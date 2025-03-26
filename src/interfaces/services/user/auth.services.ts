export default interface IUserAuthService{
    resetPassword(token: string, newPassword: string): Promise<void>
    forgotPassword(email: string): Promise<void>
}