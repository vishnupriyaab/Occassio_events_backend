export class AdminLoginDto {
  email: string;
  password: string;

  constructor(data: Partial<AdminLoginDto>) {
    this.email = data.email || "";
    this.password = data.password || "";
  }

  validate(): string[] {
    const errors: string[] = [];

    if (!this.email) {
      errors.push("Email is required");
    } else if (!this.validateEmail(this.email)) {
      errors.push("Invalid email format");
    }

    if (!this.password) {
      errors.push("Password is required");
    }

    return errors;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class AdminResponseDto {
  adminId: string;
  email: string;

  constructor(data: Partial<AdminResponseDto>) {
    this.adminId = data.adminId || "";
    this.email = data.email || "";
  }
}

export class AdminAuthResponseDto {
  success: boolean;
  message: string;
  accessToken?: string;
  admin?: AdminResponseDto;

  constructor(data: Partial<AdminAuthResponseDto>) {
    this.success = data.success || false;
    this.message = data.message || "";
    this.accessToken = data.accessToken;
    this.admin = data.admin;
  }
}

export class AdminLogoutResponseDto {
  success: boolean;
  message: string;

  constructor(data: Partial<AdminLogoutResponseDto>) {
    this.success = data.success || false;
    this.message = data.message || "";
  }
}
