import { JWTService } from "../../../integration/jwtServices";
import { IJWTService } from "../../../interfaces/integration/IJwt";
import IAdminRepository from "../../../interfaces/repository/admin/auth.repository";
import bcrypt from 'bcrypt'
import { authRepository } from "../../../repositories/entities/adminRepositories.ts/authRepository";

export class authService {
  private _adminRepo: IAdminRepository;
  private _IjwtSevice: IJWTService;
  constructor(adminRepo: IAdminRepository) {
    this ._adminRepo = adminRepo
    this._IjwtSevice = new JWTService()
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
        const error = new Error("Admin not found");
        error.name = "AdminNotFound";
        throw error;
      }

      const isValid = await bcrypt.compare(password, admin.password);
      if (!isValid) {
        const error = new Error("Invalid credentials");
        error.name = "InvalidCredentials";
        throw error;
      }

      const payload = { id: admin._id, role: "admin" };
      const accessToken = this._IjwtSevice.generateAccessToken(payload);
      const refreshToken = this._IjwtSevice.generateRefreshToken(payload);
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
}

const adminAuthRepository = new authRepository();
export const adminAuthServices = new authService(adminAuthRepository);
