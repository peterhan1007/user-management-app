import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

export const ORM_CONFIG: TypeOrmModuleOptions = {
  keepConnectionAlive: true,
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'sgm0216',
  database: 'nestjsdb',
  entities: [User],
  synchronize: true,
  logging: false,
};
