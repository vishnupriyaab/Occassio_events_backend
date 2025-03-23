export default interface IEmplAuthService{
    loginEmployee(
        email: string,
        password: string
      ): Promise<{ accessToken: string; refreshToken: string }>
    forgotPassword(email: string): Promise<void>
    resetPassword(token: string, newPassword: string): Promise<void>
}