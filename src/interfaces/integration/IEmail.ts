export interface IEmailService {
  sendPaymentLinkEmail(email: string, paymentLink: string): Promise<string>
}

export interface EmailConfig {
  service: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: {
    user: string | undefined;
    pass: string | undefined;
  };
}

export interface EmailContent {
  to: string;
  from: string;
  subject: string;
  html: string;
}
