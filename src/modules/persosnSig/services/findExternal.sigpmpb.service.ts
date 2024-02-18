import { Injectable } from '@nestjs/common';
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

    try {
      const { data } = await axios(
        `${env.API_SIGPMPB}/servidores/${matricula}`,
        config,
      );

      const { servidor } = data;

      return await servidor;
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
