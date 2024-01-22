import { Injectable } from '@nestjs/common';
import axios from 'axios';
import env from '@config/env';

@Injectable()
export class FindExternalSigpmpbService {
  // constructor(private readonly personSigRepository: PersonSigRepository) {}

  async execute(matricula: string): Promise<any> {
    const config = {
      method: 'get',
      url: `${env.API_SIGPMPB}/servidores/${matricula}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${env.TOKEN_SIGPMPB}`,
        Referer: env.Referer_SIGPMPB,
        'Access-Control-Allow-Origin': '*',
        Accept: '*',
        'Sec-CH-UA-Platform': '"Linux"',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
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
