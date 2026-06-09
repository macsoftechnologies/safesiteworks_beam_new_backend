import { Injectable, BadRequestException, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';
import { Employee } from '../employees/entities/employee.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,

    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) { }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    // Save password as base64 for compatibility with legacy system
    const base64Password = Buffer.from(password).toString('base64');

    // Create user in database
    const user = await this.usersService.create({
      username,
      password: base64Password,
      userType: 'Admin', // Default user type
      created: new Date(),
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Signup!',
      id: user.id,
      username: user.username,
      userType: user.userType,
    };
  }

  /**
   * Login: Generate OTP and send SMS
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Validate user credentials
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Generate OTP
    const otp = this.otpService.generateOtp();

    // Update user with OTP
    await this.usersService.updateOtp(user.id, otp);

    // Fetch phone number from Employee table
    const employee = (user.empId !== null && user.empId !== undefined) ? await this.employeeRepo.findOne({ where: { id: user.empId } }) : null;
    const phoneNumber = employee?.phonenumber ?? '';

    // Send SMS via Twilio
    const smsSent = await this.otpService.sendOtpViaSms(phoneNumber, otp);

    // Generate auth token (legacy support)
    const authString = user.id + 'beamapi' + new Date().toISOString();
    const authToken = crypto.createHash('md5').update(authString).digest('hex');

    // Save auth token
    await this.usersService.updateAuthToken(user.id, authToken);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful. OTP sent.',
      id: user.id,
      username: user.username,
      userType: user.userType,
      typeId: user.typeId,
      empId: user.empId,
      phonenumber: phoneNumber,
      auth_token: authToken,
      sms_sent: smsSent,
    };
  }

  /**
   * Verify OTP and return JWT token
   */
  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { otp, user_id } = verifyOtpDto;

    // Get user
    const user = await this.usersService.findById(user_id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if OTP is valid
    if (!user.otp || user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP
    await this.usersService.clearOtp(user.id);

    // Generate JWT token
    const payload = { sub: user.id, username: user.username };
    const access_token = this.jwtService.sign(payload);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully Login!',
      id: user.id,
      username: user.username,
      userType: user.userType,
      typeId: user.typeId,
      empId: user.empId,
      access_token,
    };
  }

  /**
   * Change password
   */
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { id, password } = changePasswordDto;

    // Get user
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Save new password as base64 for compatibility with legacy system
    const base64Password = Buffer.from(password).toString('base64');

    // Update password
    const updated = await this.usersService.updatePassword(id, base64Password);

    if (updated) {
      return {
        statusCode: HttpStatus.OK,
        message: 'User Password Updated',
      };
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'User Password not updated',
      };
    }
  }

  /**
   * Validate user credentials
   */
  private async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return null;
    }

    // Try base64 comparison first (legacy compatible)
    const base64Password = Buffer.from(password).toString('base64');
    let isPasswordValid = (user.password === base64Password);

    // Fallback to bcrypt
    if (!isPasswordValid && user.password) {
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (e) {
        // Ignore bcrypt error if not bcrypt format
      }
    }

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
