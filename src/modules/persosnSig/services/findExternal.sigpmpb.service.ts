import { Injectable } from '@nestjs/common';
import env from '@config/env';
import axios, { AxiosRequestConfig } from 'axios';
@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<any> {
    const config: AxiosRequestConfig<any> = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${env.TOKEN_SIGPMPB}`,
        Referer: `${env.Referer_SIGPMPB}`,
      },
    };

    try {
      const response = await axios(
        `${env.API_SIGPMPB}/servidores/${matricula}`,
        config,
      );

      console.log('response: ', response);

      return response.data;
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
