import { HttpException, Injectable } from '@nestjs/common';
import env from '@config/env';
import axios, { AxiosRequestConfig } from 'axios';
import { IPersonSig } from '../interfaces/IPersonSig';
@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<IPersonSig> {
    const config: AxiosRequestConfig<any> = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: env.TOKEN_SIGPMPB,
        Referer: env.REFERER_SIGPMPB,
      },
    };

    const { data } = await axios(
      `${env.API_SIGPMPB}/servidores/${matricula}`,
      config,
    );

    const { servidor } = data;

    if (!servidor) {
      throw new HttpException('Servidor não encontrado', 404);
    }

    return await servidor;
  }
}
