import bcrypt from "bcrypt";
import { JWTService } from "../../../integration/jwtServices";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IAdminRepository from "../../../interfaces/repository/admin/auth.repository";
import { authRepository } from "../../../repositories/entities/adminRepositories.ts/authRepository";
import IAuthService from "../../../interfaces/services/admin/auth.services";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class authService implements IAuthService {
  private _adminRepo: IAdminRepository;
  private _IjwtSevice: IJWTService;
  constructor(adminRepo: IAdminRepository) {
    this._adminRepo = adminRepo;
    this._IjwtSevice = new JWTService();
  }

  async adminLogin(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      console.log(email, password, "qwertyuiop");

      const admin = await this._adminRepo.findAdminByEmail(email);
      console.log(admin, "admin");

      if (!admin) {
        throw new AppError(
          "Admin not found",
          HttpStatusCode.NOT_FOUND,
          "AdminNotFound"
        );
      }

      const isValid = await bcrypt.compare(password, admin.password);

      if (!isValid) {
        throw new AppError(
          "Password is Incorrect",
          HttpStatusCode.UNAUTHORIZED,
          "PasswordIsIncorrect"
        );
      }

      const payload = { id: admin._id, role: "admin" };
      const accessToken = this._IjwtSevice.generateAccessToken(payload);
      const refreshToken = this._IjwtSevice.generateRefreshToken(payload);
      console.log(accessToken, refreshToken);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error:unknown) {
      throw error;
    }
  }

  // async register(email:string,password:string):Promise<void>{
  //   const hashedPassword = await this._cryptoService.hashData(
  //     password
  //   );
  //   const admin = await this._adminRepo.createAdmin(email,hashedPassword);
  // }
}

const adminAuthRepository = new authRepository();
export const adminAuthServices = new authService(adminAuthRepository);
