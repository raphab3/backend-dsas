export default interface IStorageProvider {
  saveFile(fileName: string, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getSignedUrl(path: string, expire: number): Promise<string>;
  saveFileDatabase?(folderPath: string, path: string): Promise<void>;
}
