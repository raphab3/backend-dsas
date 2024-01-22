import { Injectable } from '@nestjs/common';
import env from '@config/env';

@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<any> {
    try {
      fetch(`${env.API_SIGPMPB}/servidores/${matricula}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${env.TOKEN_SIGPMPB}`,
          referer: env.Referer_SIGPMPB,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          return data;
        });
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
