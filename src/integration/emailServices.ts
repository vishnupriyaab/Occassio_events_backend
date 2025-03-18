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
}
