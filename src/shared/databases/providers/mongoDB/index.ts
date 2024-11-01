import env from '@config/env';
import { MongooseModule } from '@nestjs/mongoose';

export enum Collections {
  FORM_ANSWER = 'form_answers',
  FORM_TEMPLATE = 'forms_templates',
}

const MONGO_CONFIG = MongooseModule.forRootAsync({
  useFactory: () => ({
    uri: `mongodb://${env.MONGODB_HOST}:${env.MONGODB_PORT}/`,
    user: env.MONGODB_USER,
    pass: env.MONGODB_PASS,
    dbName: env.MONGODB_DATABASE,
    autoCreate: true,
  }),
});

export const MONGO_MODULE = {
  ...MONGO_CONFIG,
  provide: 'MONGO_DATABASE_CONNECTION',
};
