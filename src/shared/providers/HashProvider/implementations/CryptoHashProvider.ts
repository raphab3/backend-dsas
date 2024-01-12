import IHashProvider from '../interfaces/IHashProvider';
import { Injectable } from '@nestjs/common';
import { pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

@Injectable()
class CryptoHashProvider implements IHashProvider {
  private readonly iterations: number;
  private readonly keylen: number;
  private readonly digest: string;

  constructor() {
    this.iterations = 100000;
    this.keylen = 64;
    this.digest = 'sha512';
  }

  public async generateHash(
    password: string,
  ): Promise<{ salt: string; hash: string }> {
    const salt = randomBytes(16).toString('hex');
    const hashed = await pbkdf2Async(
      password,
      salt,
      this.iterations,
      this.keylen,
      this.digest,
    );
    return {
      salt,
      hash: hashed.toString('base64'),
    };
  }

  public async compareHash(
    password: string,
    hashed: string,
    salt: string,
  ): Promise<boolean> {
    const hashedPayloadBuffer = await pbkdf2Async(
      password,
      salt,
      this.iterations,
      this.keylen,
      this.digest,
    );
    const hashedBuffer = Buffer.from(hashed, 'base64');
    return timingSafeEqual(hashedPayloadBuffer, hashedBuffer);
  }
}

export default CryptoHashProvider;
