export default interface IHelperService{
    getMimeType(fileName: string): Promise<string>
}