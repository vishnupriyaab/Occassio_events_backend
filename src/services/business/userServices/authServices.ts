import { CryptoService } from "../../../integration/cryptoServices";
import { EmailService } from "../../../integration/emailServices";
import { JWTService } from "../../../integration/jwtServices";
import { IUser } from "../../../interfaces/entities/user.entity";
import ICryptoService from "../../../interfaces/integration/ICrypto";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IUserRepository from "../../../interfaces/repository/user/auth.repository";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import { UserRepository } from "../../../repositories/entities/userRepositories.ts/authRepository";

export class UserAuthServices implements IUserAuthService {
  private _jwtService: IJWTService;
  private _userRepo: IUserRepository;
  private _cryptoService: ICryptoService;
  private _emailService: IEmailService;
  constructor(
    jwtService: IJWTService,
    userRepo: IUserRepository,
    cryptoService: ICryptoService,
    emailConfig: {
        user: string | undefined;
        pass: string | undefined;
        frontendUrl: string | undefined;
      },
  ) {
    this._jwtService = jwtService;
    this._userRepo = userRepo;
    this._cryptoService = cryptoService;
    this._emailService = new EmailService(emailConfig);
  }
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this._jwtService.verifyAccessToken(token);

      if (!decoded.id) {
        const error = new Error("Invalid reset token");
        error.name = "InvalidResetToken";
        throw error;
      }

      const user = await this._userRepo.findUserById(decoded.id);
      if (!user) {
        const error = new Error("User not found");
        error.name = "UserNotFound";
        throw error;
      }

      const storedToken = await this._userRepo.getPasswordResetToken(
        decoded.id
      );
      if (!storedToken || storedToken !== token) {
        const error = new Error("Invalid or expired reset token");
        error.name = "InvalidOrExpiredResetToken";
        throw error;
      }

      const hashedPassword = await this._cryptoService.hashData(newPassword);
      await this._userRepo.updatePassword(decoded.id, hashedPassword);
      await this._userRepo.clearPasswordResetToken(decoded.id);
    } catch (error) {
      throw error;
    }
  }
    async forgotPassword(email: string): Promise<void> {
      try {
        const user: IUser | null = await this._userRepo.findUserByEmail(
          email
        );
        if (!user) {
          console.log("qwert");
          const error = new Error("User not found!");
          error.name = "UserNotFound";
          throw error;
        }
  
        const token = this._jwtService.generateAccessToken({
          id: user._id || '',
          role: "user",
        });
        await this._userRepo.savePasswordResetToken(user._id, token);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this._emailService.sendPasswordResetEmail(email, resetLink);
      } catch (error) {
        throw error;
      }
    }
}

const IjwtService: IJWTService = new JWTService();
const userRepository = new UserRepository();
const cryptoService: ICryptoService = new CryptoService();
const emailConfig = {
    user: process.env.EMAIL_COMPANY,
    pass: process.env.EMAIL_PASS,
    frontendUrl: process.env.FRONTEND_URL,
  };

export const userAuthService = new UserAuthServices(IjwtService, userRepository, cryptoService, emailConfig)