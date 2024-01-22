import { Injectable } from '@nestjs/common';
import axios from 'axios';
import env from '@config/env';

@Injectable()
export class FindExternalSigpmpbService {
  async execute(matricula: string): Promise<any> {
    const config = {
      method: 'get',
      url: `${env.API_SIGPMPB}/servidores/${matricula}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${env.TOKEN_SIGPMPB}`,
        referer: env.Referer_SIGPMPB,
      },
    };

    try {
      axios(config)
        .then(function (response) {
          console.log(response);
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Erro ao consultar a API externa', error);
      throw error;
    }
  }
}
