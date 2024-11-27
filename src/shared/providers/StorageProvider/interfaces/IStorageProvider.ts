export default interface IStorageProvider {
  saveFile(fileName: string, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  presign(path: string, expire: number): Promise<string>;
  saveFileDatabase?(folderPath: string, path: string): Promise<void>;
}
