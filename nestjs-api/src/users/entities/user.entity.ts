import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserType } from 'src/common/enums/user-type.enum';
import { Review } from 'src/reviews/entities/review.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.REGULAR })
  tip: UserType;

  @Column({ length: 50 })
  name: string;

  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Reservation, (registration) => registration.user)
  registrations: Reservation[];

  @OneToMany(()=>Review,(review)=>review.user)
  reviews:Review[];
}

//gotova