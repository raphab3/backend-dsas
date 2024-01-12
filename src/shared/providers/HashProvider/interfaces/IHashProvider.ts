export default interface IHashProvider {
  generateHash(password: string): Promise<{ salt: string; hash: string }>;
  compareHash(password: string, hashed: string, salt: string): Promise<boolean>;
}
