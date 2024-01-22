import { Injectable } from '@nestjs/common';
import env from '@config/env';
import axios, { AxiosRequestConfig } from 'axios';
@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<any> {
    const config: AxiosRequestConfig<any> = {
      headers: {
        Authorization: `${env.TOKEN_SIGPMPB}`,
        Referer: env.Referer_SIGPMPB,
      },
    };

    try {
      const response = await axios(
        `${env.API_SIGPMPB}/servidores/${matricula}`,
        config,
      );

      console.log('status: ', response.status);
      console.log('statusText: ', response.statusText);
      console.log('headers: ', response.headers);
      console.log('config: ', response.config);
      console.log('data: ', response.data);

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
