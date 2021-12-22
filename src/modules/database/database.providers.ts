import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from '../../constants/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> =>
      mongoose.connect(configService.get<string>('MONGODB_URI')),
  },
];
