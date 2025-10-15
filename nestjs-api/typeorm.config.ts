import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Review } from 'src/reviews/entities/review.entity';

config();

export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'admin123',
  database: process.env.DATABASE_NAME || 'eventsdb',
  entities: [User, Event, Category, Location, Reservation, Review],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

const dataSource = new DataSource(typeOrmConfig);

export default dataSource;