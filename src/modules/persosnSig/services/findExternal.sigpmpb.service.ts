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
            'Content-Type': 'application/json',
            Authorization: `${env.TOKEN_SIGPMPB}`,
            referer: env.Referer_SIGPMPB,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta não é um JSON válido');
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
