
import bcrypt from "bcrypt";
import ICryptoService from "../interfaces/integration/ICrypto";

export class CryptoService implements ICryptoService {
  compareData(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
  async hashData(data: string): Promise<string> {
    const saltRound = 10;
    const hashOtp = await bcrypt.hash(data, saltRound);
    return hashOtp
  }
}

