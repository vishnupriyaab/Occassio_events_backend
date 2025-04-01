import { Document } from "mongoose";
import IEmplProfileRepository from "../../../interfaces/repository/employee/profile.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { IEmployee } from "../../../interfaces/entities/employee.entity";
import Employee from "../../../models/employeeModel";

export class EmplProfileRepository
  extends CommonBaseRepository<{ employee: Document & IEmployee }>
  implements IEmplProfileRepository {
    constructor(){
        super({ employee : Employee })
    }

    async findEmplById(employeeId: string): Promise<IEmployee | null> {
        return this.findById("employee", employeeId);
      }
    
      async findEmplByEmail(email: string): Promise<IEmployee | null> {
        return this.findOne("employee", { email });
      }
    
      async updateUserProfile(userId: string, updateData: Partial<IEmployee>): Promise<IEmployee | null> {
        try {
          const updatedUser = await this.updateById("employee", userId, updateData);
          return updatedUser ? (updatedUser as any).toObject() : null;
        } catch (error) {
          console.error("Error updating user profile:", error);
          throw error;
        }
      }
    
      async updateUserProfileImage(userId: string, imageUrl: string): Promise<IEmployee | null> {
        try {
          const updatedUser = await this.updateById(
            "employee", 
            userId, 
            { imageUrl: imageUrl }
          );
          
          return updatedUser ? (updatedUser as any).toObject() : null;
        } catch (error) {
          console.error("Error updating user profile image:", error);
          throw error;
        }
      }

  }
