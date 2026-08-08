import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OtpService {
  private twilioClient: any;

  constructor(private configService: ConfigService) {
    try {
      const twilio = require('twilio');
      const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID')?.trim();
      const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN')?.trim();
      if (accountSid && authToken) {
        this.twilioClient = new twilio(accountSid, authToken);
      } else {
        console.warn('[Twilio] Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN in environment variables.');
      }
    } catch (error) {
      console.warn('[Twilio] Initialization error:', error.message);
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
      if (!phoneNumber || !phoneNumber.trim()) {
        console.warn('[Twilio] No phone number provided for user.');
        return false;
      }

      if (!this.twilioClient) {
        console.warn('[Twilio] Client not initialized. Check TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in .env');
        return false;
      }

      const messagingServiceSid = this.configService.get<string>('TWILIO_MESSAGING_SERVICE_SID') || 'MGb53b30d757d11e8a4d038c1948ec8991';

      // Format phone number to E.164 without altering country codes
      let clean = String(phoneNumber).trim();
      let to = '';

      if (clean.startsWith('00')) {
        // e.g. 004526468661 -> +4526468661
        to = '+' + clean.slice(2);
      } else if (clean.startsWith('+')) {
        // e.g. +4531900094 -> +4531900094
        to = clean;
      } else {
        const onlyDigits = clean.replace(/\D/g, '');
        if (onlyDigits.length === 8) {
          // Standard 8-digit Danish local number (e.g. 31911638 -> +4531911638)
          to = '+45' + onlyDigits;
        } else {
          to = '+' + onlyDigits;
        }
      }

      console.log(`[Twilio] Sending OTP to: ${to} (original DB val: ${phoneNumber})`);

      const message = await this.twilioClient.messages.create({
        messagingServiceSid,
        body: `Your verification code: ${otp} for BEAM "PTW" authentication.`,
        to,
      });

      console.log(`[Twilio] OTP sent successfully to ${to}, SID: ${message.sid}`);
      return true;
    } catch (error) {
      console.error(`[Twilio Error] Failed to send SMS to ${phoneNumber}:`, error.code ? `[Code ${error.code}] ${error.message}` : error.message);
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
