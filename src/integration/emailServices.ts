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

  static getEmployeeOnboardingWithPasswordTemplate(
    employeeName: string,
    email: string,
    password: string
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #4a5568;">Welcome to the Occasio Event Management Team!</h2>
        </div>
        
        <p>Dear ${employeeName},</p>
        
        <p>We're excited to have you join our team! Your account has been created with the following credentials:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #4a5568; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p>Please use these credentials to log in to our system. For security reasons, we recommend changing your password after your first login.</p>
        
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
 
  static getEmployeeAssignmentTemplate(
    userName: string,
    employeeName: string,
    resetLink: string
  ): string {
    console.log(resetLink, "resetLink");
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
        <div style="padding: 20px; text-align: center; border-bottom: 3px solid #4a5568;">
          <h1 style="color: #4a5568; margin: 0;">Occasio Event Management</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear ${userName},</p>
          
          <p>On behalf of the Occasio Event Management team, I am reaching out to you. Our team member, ${employeeName}, will be coordinating your event.</p>
          
          <div style="background-color: #fffbea; border-left: 4px solid #f6e05e; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Account Setup Instructions</p>
            <p>Please ensure you complete these steps to enable our team to connect with you:</p>
            <ol>
              <li>Click on the "Reset Password" button below</li>
              <li>Follow the instructions to set your new password</li>
              <li>Log in with your registered email and newly created password</li>
            </ol>
            <div style="text-align: center">
            <a href="${resetLink}" style="display: inline-block; background-color:rgb(25, 214, 0); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
         </div>
            </div>
          
          <p style="font-weight: bold;">Our employee will be in touch with you within the next 24 hours to discuss your event details and provide personalized support.</p>
          
          <div style="background-color:rgb(245, 228, 228) ; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold;">Customer Support Information</p>
            <p style="margin: 5px 0 0;">If you do not hear from your assigned employee within 24 hours or if you have any confusion or questions about the login process, please contact our customer service:</p>
            <address style="font-style: normal; margin-top: 10px;">
              <strong>Occasio Events Customer Service</strong><br>
              123 Avenue des Champs-Élysées<br>
              75008 Paris, France<br>
              Email: occasioevents@gmail.com
            </address>
          </div>
          
          <p>Thank you for choosing Occasio Event Management. We look forward to making your event exceptional!</p>
          
          <p style="font-weight: bold;">Best regards,<br>Occasio Event Management Team</p>
        </div>
        
        <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 0.8em; color: #666;">
          © ${new Date().getFullYear()} Occasio Event Management. All rights reserved.
        </div>
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

  async sendEmployeeOnboardingEmailwithPassword(
    employeeName: string,
    employeeEmail: string,
    password: string
  ): Promise<string> {

    const content: EmailContent = {
      from: this._senderEmail!,
      to: employeeEmail,
      subject:
        "Welcome to the Occasio Event Management Team - Your Login Credentials",
      html: EmailTemplates.getEmployeeOnboardingWithPasswordTemplate(
        employeeName,
        employeeEmail,
        password
      ),
    };

    return await this._emailTransport.sendMail(content);
  }

  async sendEmployeeAssignedEmailToUser(
    employeeName: string,
    userName: string,
    userEmail: string,
    token: string
  ): Promise<string> {
    console.log(token, "token");
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const content: EmailContent = {
      from: this._senderEmail!,
      to: userEmail,
      subject: "Your Dedicated Event Management Support",
      html: EmailTemplates.getEmployeeAssignmentTemplate(
        userName,
        employeeName,
        resetLink
      ),
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
