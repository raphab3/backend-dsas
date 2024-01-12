import IHashProvider from '../interfaces/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<{
    hash: string;
    salt: string;
  }> {
    return {
      hash: payload,
      salt: payload,
    };
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed;
  }

  public async decodeHash(payload: string): Promise<string> {
    return payload;
  }
}

export default FakeHashProvider;
