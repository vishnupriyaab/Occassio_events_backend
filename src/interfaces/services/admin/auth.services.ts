export default interface IAuthService{
    adminLogin( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
}