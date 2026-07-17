import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationSetting } from './entities/notification-setting.entity';
import { User } from '../users/entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Subcontractor } from '../subcontractor/entities/subcontractor.entity';
import { RequestEntity } from '../requests/entities/request.entity';
import { RedisCacheService } from '../redis/redid-cache.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    @InjectRepository(NotificationSetting)
    private readonly settingRepo: Repository<NotificationSetting>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Subcontractor)
    private readonly subcontractorRepo: Repository<Subcontractor>,
    @InjectRepository(RequestEntity)
    private readonly requestRepo: Repository<RequestEntity>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  /**
   * Centralized method to trigger notifications for permit request status changes.
   */
  async triggerNotification(
    permitId: number,
    previousStatus: string | null | undefined,
    newStatus: string | undefined,
    actorUserId: number,
  ): Promise<void> {
    try {
      // 1. Fetch permit request
      const request = await this.requestRepo.findOne({ where: { id: permitId } });
      if (!request) {
        console.error(`[Notification] Permit request not found for ID: ${permitId}`);
        return;
      }

      // Normalize statuses
      const normPrev = previousStatus ? previousStatus.toLowerCase().trim() : null;
      const normNew = newStatus ? newStatus.toLowerCase().trim() : 'pending';

      // If status hasn't changed, skip
      if (normPrev === normNew) {
        return;
      }

      // 2. Fetch actor display name
      const actorName = await this.getUserDisplayName(actorUserId);

      // Determine recipients and construct message
      let message = '';
      let title = 'Permit Status Update';
      let recipientRole: 'department' | 'all_company' = 'all_company';

      const subcontractorId = request.subContractorId;

      // Fetch Subcontractor and resolve department
      let departId: number | null = null;
      if (subcontractorId) {
        const sub = await this.subcontractorRepo.findOne({ where: { id: subcontractorId } });
        if (sub) {
          departId = sub.departId;
        }
      }

      // SCENARIO 1: Raised in Hold status or changed from Draft -> Hold
      const isCreatedAsHold = !previousStatus && normNew === 'hold';
      const isDraftToHold = normPrev === 'draft' && normNew === 'hold';
      
      if (isCreatedAsHold || isDraftToHold) {
        title = 'New Permit Request Raised';
        message = `A new work permit request has been raised by ${actorName}.`;
        recipientRole = 'department'; // Notify only responsible Department Users (and Admins as system level)
      } 
      // SCENARIO 2 & 3: Approved status or other general transitions
      else if (normNew === 'approved') {
        title = 'Permit Request Approved';
        message = `Work permit request approved by ${actorName}.`;
        recipientRole = 'all_company'; // Notify Company Admins, Contractors, and Department Users
      } else if (normNew === 'pre-approved') {
        title = 'Permit Request Pre-Approved';
        message = `Work permit request pre-approved by ${actorName}.`;
        recipientRole = 'all_company';
      } else if (normNew === 'opened') {
        title = 'Permit Request Opened';
        message = `Work permit request opened by ${actorName}.`;
        recipientRole = 'all_company';
      } else if (normNew === 'closed') {
        title = 'Permit Request Closed';
        message = `Work permit request closed by ${actorName}.`;
        recipientRole = 'all_company';
      } else if (normNew === 'cancelled') {
        title = 'Permit Request Cancelled';
        message = `Work permit request cancelled by ${actorName}.`;
        recipientRole = 'all_company';
      } else if (normNew === 'rejected') {
        title = 'Permit Request Rejected';
        message = `Work permit request rejected by ${actorName}.`;
        recipientRole = 'all_company';
      } else {
        title = 'Permit Status Changed';
        message = `Work permit request status changed to ${newStatus} by ${actorName}.`;
        recipientRole = 'all_company';
      }

      // Resolve candidate recipient users
      const recipients: User[] = [];

      // 1. Always notify Admins (system wide supervision)
      const admins = await this.userRepo.createQueryBuilder('user')
        .where('user.userType LIKE :admin OR user.userType LIKE :super', {
          admin: '%Admin%',
          super: '%SuperAdmin%',
        })
        .getMany();
      recipients.push(...admins);

      // 2. Fetch Department Users for this department
      if (departId) {
        const deptUsers = await this.userRepo.createQueryBuilder('user')
          .leftJoin('employees', 'emp', 'user.empId = emp.id')
          .where('(user.userType = :dept OR user.userType = :dept1 OR user.userType LIKE :deptLike)', {
            dept: 'Department',
            dept1: 'Department1',
            deptLike: '%Department%',
          })
          .andWhere('(user.typeId = :departId OR emp.departId = :departId)', { departId })
          .getMany();
        recipients.push(...deptUsers);
      }

      // 3. Fetch Company Contractors (if recipientRole is 'all_company')
      if (recipientRole === 'all_company' && subcontractorId) {
        const contractors = await this.userRepo.createQueryBuilder('user')
          .leftJoin('employees', 'emp', 'user.empId = emp.id')
          .where('user.userType = :subcon', { subcon: 'Subcontractor' })
          .andWhere('(user.typeId = :subconId OR emp.subContId = :subconId)', { subconId: subcontractorId })
          .getMany();
        recipients.push(...contractors);
      }

      // De-duplicate recipients by User ID
      const uniqueRecipients = Array.from(new Map(recipients.map(u => [u.id, u])).values());

      // Iterate through recipients, check user preferences, and save notifications
      for (const rx of uniqueRecipients) {
        // Skip sender to avoid self-notification
        if (rx.id === actorUserId) {
          continue;
        }

        // Verify if user enabled notification for this status
        const isEnabled = await this.isNotificationEnabled(rx.id, newStatus || 'Pending');
        if (isEnabled) {
          await this.notificationRepo.save(
            this.notificationRepo.create({
              receiverUserId: rx.id,
              senderUserId: actorUserId,
              permitRequestId: permitId,
              companyId: subcontractorId || undefined,
              notificationType: 'status_change',
              permitStatus: newStatus,
              title,
              message,
              isRead: 0,
              metadata: JSON.stringify({
                permitNo: request.permitNo,
                previousStatus,
                newStatus,
              }),
            }),
          );
        }
      }
    } catch (error) {
      console.error('[Notification] Error in triggerNotification:', error);
    }
  }

  /**
   * Checks if notification for a specific status is enabled for a user, using Redis cache.
   */
  async isNotificationEnabled(userId: number, status: string): Promise<boolean> {
    try {
      const cacheKey = `notifications:settings:${userId}`;
      const settingsMap = await this.redisCacheService.getOrSet(
        cacheKey,
        async () => {
          const rows = await this.settingRepo.find({ where: { userId } });
          const map: Record<string, boolean> = {};
          for (const row of rows) {
            map[row.permitStatus.toLowerCase().trim()] = row.enabled === 1;
          }
          return map;
        },
        1000 * 60 * 60, // 1 hour TTL
      );

      const normStatus = status.toLowerCase().trim();
      // If setting exists, return its value; default to true (ON) otherwise
      return settingsMap[normStatus] !== false;
    } catch (error) {
      console.error(`[Notification] Error checking preferences for user ${userId}:`, error);
      return true; // Fallback to true on error
    }
  }

  /**
   * Get paginated notifications list for a user.
   */
  async getNotificationsForUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Notification[]; total: number; page: number; limit: number; totalPages: number }> {
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { receiverUserId: userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get total count of unread notifications for a user.
   */
  async getUnreadCount(userId: number): Promise<number> {
    return this.notificationRepo.count({
      where: { receiverUserId: userId, isRead: 0 },
    });
  }

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    const result = await this.notificationRepo.update(
      { id: notificationId, receiverUserId: userId },
      { isRead: 1 },
    );
    return (result.affected ?? 0) > 0;
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: number): Promise<boolean> {
    const result = await this.notificationRepo.update(
      { receiverUserId: userId, isRead: 0 },
      { isRead: 1 },
    );
    return (result.affected ?? 0) > 0;
  }

  /**
   * Fetch all user notification preferences.
   */
  async getNotificationSettings(userId: number): Promise<Record<string, boolean>> {
    const cacheKey = `notifications:settings:${userId}`;
    return this.redisCacheService.getOrSet(
      cacheKey,
      async () => {
        const rows = await this.settingRepo.find({ where: { userId } });
        const map: Record<string, boolean> = {};
        for (const row of rows) {
          map[row.permitStatus.toLowerCase().trim()] = row.enabled === 1;
        }
        return map;
      },
      1000 * 60 * 60,
    );
  }

  /**
   * Update user notification preferences and invalidate settings cache.
   */
  async updateNotificationSettings(userId: number, settings: Record<string, boolean>): Promise<void> {
    // Save to database
    for (const [status, enabled] of Object.entries(settings)) {
      const dbStatus = status.trim();
      let setting = await this.settingRepo.findOne({
        where: { userId, permitStatus: dbStatus },
      });

      if (setting) {
        setting.enabled = enabled ? 1 : 0;
        await this.settingRepo.save(setting);
      } else {
        await this.settingRepo.save(
          this.settingRepo.create({
            userId,
            permitStatus: dbStatus,
            enabled: enabled ? 1 : 0,
          }),
        );
      }
    }

    // Invalidate Redis cache
    const cacheKey = `notifications:settings:${userId}`;
    await this.redisCacheService.delete(cacheKey);
  }

  /**
   * Fetch actor display name helper.
   */
  private async getUserDisplayName(userId: number): Promise<string> {
    if (!userId) return 'System';
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return `User #${userId}`;
    if (user.empId) {
      const emp = await this.employeeRepo.findOne({ where: { id: user.empId } });
      if (emp && emp.employeeName) {
        return emp.employeeName;
      }
    }
    return user.username || `User #${userId}`;
  }
}
