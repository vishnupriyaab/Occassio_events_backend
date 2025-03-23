import nodemailer, { Transporter } from "nodemailer";
import {
  EmailConfig,
  EmailContent,
  IEmailService,
} from "../interfaces/integration/IEmail";
export class EmailTemplates {
  static getPaymentLinkTemplate(paymentLink: string): string {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center;">
          <p>Dear Customer,</p>
          <p>Your event registration requires payment. Click the button below to complete the payment:</p>
          
          <p>
            <a href="${paymentLink}" target="_blank" style="
                display: inline-block;
                padding: 12px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 5px;
                "onclick="window.open('${paymentLink}', '_blank'); return false;"
                >Pay Now</a>
          </p>
          <br />
          <p>Thank you,</p>
          <p><strong>Occasio Event Management Team.</strong></p>
        </div>
      `;
  }
  // static getEmployeeOnboardingTemplate(
  //   employeeName: string,
  //   email: string,
  //   resetLink: string,
  // ): string {
  //   return `
  //     <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
  //       <div style="text-align: center; margin-bottom: 20px;">
  //         <h2 style="color: #4a5568;">Welcome to the Occasio Event Management Team!</h2>
  //       </div>
        
  //       <p>Dear ${employeeName},</p>
        
  //       <p>We're excited to have you join our team! Your account has been created with the following email address: <strong>${email}</strong></p>
        
  //       <p>To complete your onboarding process, please follow these steps:</p>
        
  //       <ol style="margin-bottom: 20px;">
  //         <li>Visit our employee portal</li>
  //         <li>Click on "Forgot Password" since you don't have a password yet</li>
  //         <li>Enter your email address: ${email}</li>
  //         <li>Follow the instructions to set your new password</li>
  //         <li>Once complete, log in with your email and newly created password</li>
  //       </ol>
        
  //       <div style="background-color: #fffbea; border-left: 4px solid #f6e05e; padding: 12px; margin-bottom: 20px;">
  //         <p style="margin: 0; font-weight: bold;">Important Security Notice:</p>
  //         <p style="margin: 8px 0 0 0;">Your login credentials are confidential. Please do not share them with anyone. Our organization will never ask for your password.</p>
  //       </div>
        
  //       <p>If you have any questions about the onboarding process, please contact the HR department.</p>
        
  //       <p>We look forward to working with you!</p>
        
  //       <p>Best regards,<br>Occasio Event Management Team</p>
  //     </div>
  //   `;
  // }

  static getEmployeeOnboardingTemplate(
    employeeName: string,
    email: string,
    resetLink: string,
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4a5568;">Welcome to the Occasio Event Management Team!</h2>
        </div>
        
        <p>Dear ${employeeName},</p>
        
        <p>We're excited to have you join our team! Your account has been created with the following email address: <strong>${email}</strong></p>
        
        <p>To complete your onboarding process, please follow these steps:</p>
        
        <ol style="margin-bottom: 20px;">
          <li>Click on the "Reset Password" button below</li>
          <li>Follow the instructions to set your new password</li>
          <li>Once complete, log in with your registered email and newly created password</li>
        </ol>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4a5568; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        
        <div style="background-color: #fffbea; border-left: 4px solid #f6e05e; padding: 12px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: bold;">Important Security Notice:</p>
          <p style="margin: 8px 0 0 0;">Your login credentials are confidential. Please do not share them with anyone. Our organization will never ask for your password.</p>
        </div>
        
        <p>If you have any confusion or questions about the onboarding process, please contact the HR department.</p>
        
        <p>We look forward to working with you!</p>
        
        <p>Best regards,<br>Occasio Event Management Team</p>
      </div>
    `;
  }

  static getPasswordResetTemplate(resetLink: string): string {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
        </div>
      `;
  }
}

export class EmailTransport {
  private _transporter: Transporter;

  constructor(config: EmailConfig) {
    this._transporter = nodemailer.createTransport(config);
  }

  async sendMail(content: EmailContent): Promise<any> {
    return await this._transporter.sendMail(content);
  }
}

export class EmailService implements IEmailService {
  private _emailTransport: EmailTransport;
  private _senderEmail: string | undefined;

  constructor(
    private emailConfig: {
      user: string | undefined;
      pass: string | undefined;
    }
  ) {
    const config: EmailConfig = {
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    };

    this._emailTransport = new EmailTransport(config);
    this._senderEmail = emailConfig.user;
  }

  async sendPaymentLinkEmail(
    email: string,
    paymentLink: string
  ): Promise<string> {
    const content: EmailContent = {
      from: this._senderEmail!,
      to: email,
      subject: "Complete Your Payment - Occasio Event Management",
      html: EmailTemplates.getPaymentLinkTemplate(paymentLink),
    };

    return await this._emailTransport.sendMail(content);
  }

  async sendEmployeeOnboardingEmail(
    employeeName: string,
    employeeEmail: string,
    token:string,
  ): Promise<string> {
    
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const content: EmailContent = {
      from: this._senderEmail!,
      to: employeeEmail,
      subject: "Welcome to the Occasio Event Management Team - Account Setup Instructions",
      html: EmailTemplates.getEmployeeOnboardingTemplate(employeeName, employeeEmail, resetLink),
    };
    
    return await this._emailTransport.sendMail(content);
  }

  async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<string> {
    const content: EmailContent = {
      from: this._senderEmail!,
      to: email,
      subject: "Password Reset",
      html: EmailTemplates.getPasswordResetTemplate(resetLink),
    };

    return await this._emailTransport.sendMail(content);
  }

}
