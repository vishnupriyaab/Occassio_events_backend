export default interface IUserAuthService {
  resetPassword(token: string, newPassword: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }>;
  googleLogin(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }>
}
