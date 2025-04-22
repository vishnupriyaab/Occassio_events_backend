import IHelperService from "../interfaces/integration/IHelper";

export class HelperService implements IHelperService{
    async getMimeType(fileName: string): Promise<string> {
        const ext = fileName.split(".").pop()?.toLowerCase();
        switch (ext) {
          case "jpg":
          case "jpeg":
            return "image/jpeg";
          case "png":
            return "image/png";
          case "gif":
            return "image/gif";
          default:
            return "application/octet-stream";
        }
      }
}