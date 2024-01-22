import { Injectable } from '@nestjs/common';
import env from '@config/env';

@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<any> {
    try {
      const response = await fetch(
        `${env.API_SIGPMPB}/servidores/${matricula}`,
        {
          method: 'GET',
          headers: {
            Authorization: `${env.TOKEN_SIGPMPB}`,
            referer: env.Referer_SIGPMPB,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      console.log('status', response.status);
      console.log(response);

      const data = response.body;
      return data;
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
