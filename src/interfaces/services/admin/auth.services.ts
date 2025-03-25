export default interface IAuthService{
    register(email:string,password:string):Promise<void>
    adminLogin( email: string, password: string ): Promise<{ accessToken: string; refreshToken: string }>;
}