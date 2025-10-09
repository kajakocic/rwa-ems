import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserType } from 'src/common/enums/user-type.enum';
import { Review } from 'src/reviews/review.entity';
import { Registration } from 'src/registrations/entities/registration.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: UserType, default: UserType.REGULAR })
  tip: UserType;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

 @OneToMany(() => Registration, (registration) => registration.user)
  registrations: Registration[];

  @OneToMany(()=>Review,(review)=>review.user)
  reviews:Review[];
}

//gotova