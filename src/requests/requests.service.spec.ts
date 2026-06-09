import { BadRequestException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dtos/create-request.dto';

describe('RequestsService - Validation and Zone Logic', () => {
  let service: RequestsService;
  let mockZoneRepo: any;
  let mockRedisCacheService: any;

  beforeEach(() => {
    mockZoneRepo = {
      find: jest.fn(),
    };

    mockRedisCacheService = {
      getOrSet: jest.fn((key, cb) => cb()),
      deleteByPattern: jest.fn(),
    };

    // Create a minimal instantiation of RequestsService with mocked repositories
    service = new RequestsService(
      {} as any, // requestRepo
      {} as any, // chemicalRepo
      {} as any, // confinedRepo
      {} as any, // electricalRepo
      {} as any, // energisingElecRepo
      {} as any, // energisingMechRepo
      {} as any, // excavationRepo
      {} as any, // extraMiscRepo
      {} as any, // fireHotworkRepo
      {} as any, // generalRepo
      {} as any, // heightRepo
      {} as any, // liftingRepo
      {} as any, // ppeRepo
      {} as any, // pressureTestingRepo
      {} as any, // ramsFileRepo
      {} as any, // noteRepo
      {} as any, // uploadImageRepo
      {} as any, // logRepo
      {} as any, // logDataRepo
      {} as any, // completeLogRepo
      {} as any, // buildingRepo
      {} as any, // floorRepo
      mockZoneRepo, // zoneRepo
      {} as any, // roomRepo
      {} as any, // subcontractorRepo
      {} as any, // activityRepo
      mockRedisCacheService, // redisCacheService
    );
  });

  describe('checkZoneStatusAndAssignPermitUnder', () => {
    it('should throw BadRequestException if selected zones are not found', async () => {
      mockZoneRepo.find.mockResolvedValue([]);
      const dto: CreateRequestDto = { Zone_Id: 999 };

      await expect(
        service['checkZoneStatusAndAssignPermitUnder'](dto)
      ).rejects.toThrow(new BadRequestException('Selected zones not found'));
    });

    it('should throw BadRequestException if zone status is HO', async () => {
      mockZoneRepo.find.mockResolvedValue([{ id: 1, status: 'HO' }]);
      const dto: CreateRequestDto = { Zone_Id: 1 };

      await expect(
        service['checkZoneStatusAndAssignPermitUnder'](dto)
      ).rejects.toThrow(new BadRequestException('Cannot create a permit if zone status is HO'));
    });

    it('should throw BadRequestException if selected zones have mixed statuses', async () => {
      mockZoneRepo.find.mockResolvedValue([
        { id: 1, status: 'UC' },
        { id: 2, status: 'C' },
      ]);
      const dto: CreateRequestDto = { Zone_Id: '1,2' };

      await expect(
        service['checkZoneStatusAndAssignPermitUnder'](dto)
      ).rejects.toThrow(new BadRequestException('All selected zones must belong to the same status'));
    });

    it('should assign permit_under to Construction if status is UC', async () => {
      mockZoneRepo.find.mockResolvedValue([{ id: 3, status: 'UC' }]);
      const dto: CreateRequestDto = { Zone_Id: 3 };

      await service['checkZoneStatusAndAssignPermitUnder'](dto);
      expect(dto.permit_under).toBe('Construction');
      expect(dto.Zone_Id).toBe(3);
    });

    it('should assign permit_under to Commissioning if status is C', async () => {
      mockZoneRepo.find.mockResolvedValue([{ id: 4, status: 'C' }]);
      const dto: CreateRequestDto = { Zone_Id: 4 };

      await service['checkZoneStatusAndAssignPermitUnder'](dto);
      expect(dto.permit_under).toBe('Commissioning');
      expect(dto.Zone_Id).toBe(4);
    });
  });

  describe('validateMandatoryFields', () => {
    it('should skip validation if status is draft', () => {
      const dto: CreateRequestDto = { Request_status: 'draft' };
      expect(() => service['validateMandatoryFields'](dto)).not.toThrow();
    });

    it('should throw validation error if mandatory fields are missing', () => {
      const dto: CreateRequestDto = { Request_status: 'Pending' };
      expect(() => service['validateMandatoryFields'](dto)).toThrow(
        /Validation failed/
      );
    });

    it('should validate chemical hazard sub-fields if working_hazardious_substen is 1', () => {
      const dto: CreateRequestDto = {
        Request_status: 'Pending',
        Sub_Contractor_Id: 1,
        Company_Name: 'Test Inc',
        Foreman: 'John Doe',
        Foreman_Phone_Number: '12345678',
        Activity: 'Test Activity',
        Type_Of_Activity_Id: 'A1',
        Working_Date: '2026-06-05',
        Start_Time: '08:00',
        End_Time: '17:00',
        Building_Id: 1,
        Floor_Id: 1,
        Plans_Id: 1,
        Room_Nos: '101',
        Room_Type: 'Office',
        Zone_Id: 1,
        Number_Of_Workers: '5',
        Site_Id: 1,
        permit_type: 'Construction',
        permit_under: 'Construction',
        working_hazardious_substen: 1,
        // missing checklist fields like relevant_mal
        Tools: 'Screwdriver',
        Machinery: 'None',
        description_of_activity: 'Working',
        mechanical_works: 'None',
        electrical_works: 'None',
        work_type: 'General',
        affecting_other_contractors: 1,
        other_conditions: 0,
        lighting_begin_work: 1,
        specific_risks: 1,
        environment_ensured: 1,
        course_of_action: 1,
        eye_protection: 1,
        fall_protection: 1,
        hearing_protection: 1,
        respiratory_protection: 1,
        other_ppe: 'Gloves',
      };

      expect(() => service['validateMandatoryFields'](dto)).toThrow(
        /relevant_mal must be checked/
      );
    });
  });
});
