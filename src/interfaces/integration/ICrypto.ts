export default interface ICryptoService {
    compareData(data: string, hashedData: string): Promise<boolean>;
    hashData(data: string): Promise<string>
  }