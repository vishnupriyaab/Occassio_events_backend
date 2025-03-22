export default interface IEmplAuthService{
    forgotPassword(email: string): Promise<void>
    resetPassword(token: string, newPassword: string): Promise<void>
}