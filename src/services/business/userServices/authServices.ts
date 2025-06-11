import { CryptoService } from "../../../integration/cryptoServices";
import { EmailService } from "../../../integration/emailServices";
import { GoogleAuthService } from "../../../integration/googleVerification";
import { JWTService } from "../../../integration/jwtServices";
import { IGoogleAuthService } from "../../../interfaces/integration/IGoogleVerification";
import { IUser } from "../../../interfaces/entities/user.entity";
import ICryptoService from "../../../interfaces/integration/ICrypto";
import { IEmailService } from "../../../interfaces/integration/IEmail";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IUserRepository from "../../../interfaces/repository/user/auth.repository";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import { UserRepository } from "../../../repositories/entities/userRepositories/authRepository";
import bcrypt from "bcrypt";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import { CloudinaryService } from "../../../integration/claudinaryService";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class UserAuthServices implements IUserAuthService {
  private _jwtService: IJWTService;
  private _userRepo: IUserRepository;
  private _cryptoService: ICryptoService;
  private _emailService: IEmailService;
  private _googleAuthService: IGoogleAuthService;
  private _cloudinaryService: ICloudinaryService;
  constructor(
    jwtService: IJWTService,
    userRepo: IUserRepository,
    cryptoService: ICryptoService,
    emailConfig: {
      user: string | undefined;
      pass: string | undefined;
      frontendUrl: string | undefined;
    },
    googleAuthService: IGoogleAuthService,
    cloudinaryService: ICloudinaryService
  ) {
    this._jwtService = jwtService;
    this._userRepo = userRepo;
    this._cryptoService = cryptoService;
    this._emailService = new EmailService(emailConfig);
    this._googleAuthService = googleAuthService;
    this._cloudinaryService = cloudinaryService;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const user = await this._userRepo.findUserByEmail(email);

      if (!user) {
        throw new AppError(
          "User not found",
          HttpStatusCode.NOT_FOUND,
          "UserNotFound"
        );
      }

      if (!user.isVerified) {
        await this._userRepo.updateActivatedStatus(email, true);
      }

      console.log(user.isBlocked,"isBLockeddd")
      if (user.isBlocked) {
        throw new AppError(
          "Your account is blocked",
          HttpStatusCode.BAD_REQUEST,
          "AccountIsBlocked"
        );
      }
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password as string
      );
      if (!isPasswordValid) {
        throw new AppError(
          "Invalid password",
          HttpStatusCode.BAD_REQUEST,
          "InvalidPassword"
        );
      }
      const payload = { id: user._id || "", role: "user", name: user.name };
      const accessToken = this._jwtService.generateAccessToken(payload);
      const refreshToken = this._jwtService.generateRefreshToken(payload);
      return { accessToken, refreshToken };
    } catch (error: unknown) {
      throw error;
    }
  }

  async googleLogin(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(token, "qwertyuiop");
      const tokenPayload = await this._googleAuthService.verifyIdToken(token);
      if (!tokenPayload) {
        throw new AppError(
          "Invalid token",
          HttpStatusCode.UNAUTHORIZED,
          "InvalidToken"
        );
      }

      const googleImageUrl = tokenPayload.picture as string;
      let cloudinaryImageUrl: string;
      try {
        cloudinaryImageUrl =
          await this._cloudinaryService.uploadGoogleProfileImage(
            googleImageUrl
          );
      } catch (error) {
        console.error("Failed to upload profile image:", error);
        cloudinaryImageUrl = googleImageUrl;
      }

      console.log(cloudinaryImageUrl, "cloudinaryImageUrl");

      let existingUser = await this._userRepo.findUserByEmail(
        tokenPayload.email as string
      );
      console.log(existingUser, "user in userUseCase");
      if (existingUser) {
        if (existingUser.isBlocked) {
          throw new AppError(
            "User is blocked. Please contact support",
            HttpStatusCode.FORBIDDEN,
            "UserIsBlocked"
          );
        }
      }else{
        const userData: IUser = {
        name: tokenPayload.name,
        email: tokenPayload.email,
        imageUrl: cloudinaryImageUrl,
        isVerified: true,
        isBlocked: false,
      } as unknown as IUser;
      
      console.log(userData, "userDataaaaaaaaaaaaaa");
      
      try {
        existingUser = await this._userRepo.createUser(userData);
        if (!existingUser) {
          throw new AppError(
            "Failed to create user",
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "UserCreationFailed"
          );
        }
        console.log("New user created successfully");
      } catch (createError) {
        console.error("Error creating user:", createError);
        throw new AppError(
          "Failed to create user account",
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "UserCreationFailed"
        );
      }
      }

      // if (!existingUser) {
      //   const userData: IUser = {
      //     name: tokenPayload.name,
      //     email: tokenPayload.email,
      //     imageUrl: cloudinaryImageUrl,
      //     isVerified: true,
      //     isBlocked: false,
      //   } as unknown as IUser;
      //   console.log(userData, "userDataaaaaaaaaaaaaa");
      //   await this._userRepo.createUser(userData);
      //   console.log("New user created successfully");
      // }
      const payload = { id: existingUser._id || "", role: "user", name: existingUser.name };
      console.log(payload, "payload");
      const accessToken = this._jwtService.generateAccessToken(payload);
      const refreshToken = this._jwtService.generateRefreshToken(payload);

      console.log("Generated Tokens:", { accessToken, refreshToken });

      return { accessToken, refreshToken };
    } catch (error: unknown) {
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = this._jwtService.verifyAccessToken(token);

      if (!decoded.id) {
        throw new AppError(
          "Invalid reset token",
          HttpStatusCode.BAD_REQUEST,
          "InvalidResetToken"
        );
      }

      const user = await this._userRepo.findUserById(decoded.id);
      if (!user) {
        throw new AppError(
          "User not found",
          HttpStatusCode.NOT_FOUND,
          "UserNotFound"
        );
      }

      const storedToken = await this._userRepo.getPasswordResetToken(
        decoded.id
      );
      if (!storedToken || storedToken !== token) {
        throw new AppError(
          "Invalid or expired reset token",
          HttpStatusCode.BAD_REQUEST,
          "InvalidOrExpiredResetToken"
        );
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
      const user: IUser | null = await this._userRepo.findUserByEmail(email);
      if (!user) {
        console.log("qwert");
        throw new AppError(
          "User not found",
          HttpStatusCode.NOT_FOUND,
          "UserNotFound"
        );
      }

      const token = this._jwtService.generateAccessToken({
        id: user._id || "",
        role: "user",
        name: user.name
      });
      await this._userRepo.savePasswordResetToken(user._id, token);
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await this._emailService.sendPasswordResetEmail(email, resetLink);
    } catch (error: unknown) {
      throw error;
    }
  }
}

const IjwtService: IJWTService = new JWTService();
const userRepository = new UserRepository();
const cryptoService: ICryptoService = new CryptoService();
const cloudinaryService: ICloudinaryService = new CloudinaryService();
const emailConfig = {
  user: process.env.EMAIL_COMPANY,
  pass: process.env.EMAIL_PASS,
  frontendUrl: process.env.FRONTEND_URL,
};
if (!process.env.GOOGLE_AUTH_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID environment variable is required");
}
const googleAuthService: IGoogleAuthService = new GoogleAuthService(
  process.env.GOOGLE_AUTH_CLIENT_ID
);

export const userAuthService = new UserAuthServices(
  IjwtService,
  userRepository,
  cryptoService,
  emailConfig,
  googleAuthService,
  cloudinaryService
);
