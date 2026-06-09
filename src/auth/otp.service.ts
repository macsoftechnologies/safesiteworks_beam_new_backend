import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    try {
      const twilio = require('twilio');
      const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      this.twilioClient = new twilio(accountSid, authToken);
    } catch (error) {
      console.warn('Twilio not fully configured, OTP will be generated but SMS may not send');
    }
  }

  /**
   * Generate a random 6-digit OTP
   */
  generateOtp(): string {
    return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
  }

  /**
   * Send OTP via SMS using Twilio
   */
  async sendOtpViaSms(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      if (!phoneNumber) {
        console.warn('No phone number provided, skipping SMS');
        return true;
      }

      if (!this.twilioClient) {
        console.warn('Twilio not configured, skipping SMS but continuing');
        return true;
      }

      const messagingServiceSid = this.configService.get<string>('TWILIO_MESSAGING_SERVICE_SID') || 'MGb53b30d757d11e8a4d038c1948ec8991';

      // Ensure E.164 format
      const to = '+' + String(phoneNumber).replace(/\D/g, '');

      const message = await this.twilioClient.messages.create({
        messagingServiceSid,
        body: `Your verification code: ${otp} for BEAM "PTW" authentication.`,
        to,
      });

      console.log(`OTP sent successfully to ${to}, SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('Error sending OTP via SMS:', error.message);
      // Don't throw - allow system to continue even if SMS fails
      return false;
    }
  }

  /**
   * Validate OTP expiry (5 minutes)
   */
  isOtpValid(otpCreatedAt: Date): boolean {
    if (!otpCreatedAt) return false;
    const expiryTime = 5 * 60 * 1000; // 5 minutes
    return Date.now() - new Date(otpCreatedAt).getTime() < expiryTime;
  }
}
