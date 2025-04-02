import { Document } from "mongoose";
import { IAdmin } from "../../../interfaces/entities/admin.entity";
import IAdminRepository from "../../../interfaces/repository/admin/auth.repository";
import Admin from "../../../models/adminModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class authRepository
  extends CommonBaseRepository<{ admin: Document & IAdmin }>
  implements IAdminRepository
{
  constructor() {
    super({ admin: Admin });
  }
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      return this.findOne("admin", { email });
    } catch (error) {
      throw error;
    }
  }

  //   async createAdmin(email: string, hashedPassword: string): Promise<IAdmin> {
  //   try {
  //     const adminData = {
  //       email,
  //       password: hashedPassword
  //     };
  //     return await this.createData("admin", adminData);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
