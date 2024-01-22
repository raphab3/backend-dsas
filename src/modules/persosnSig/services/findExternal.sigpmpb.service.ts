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

      console.log(response.headers);

      console.log(response);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        // Tratamento para respostas que não são JSON
        const textData = await response.text();
        console.log(textData);
        return textData;
      }
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
