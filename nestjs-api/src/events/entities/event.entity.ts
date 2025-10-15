import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Reservation } from 'src/reservations/entities/reservation.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  naziv: string;

  @Column({ type: 'timestamp' })
  datum: Date;

  @Column({ type: 'int' })
  kapacitet: number;

  @Column({ type: 'text' })
  opis: string;

  @Column({  name: 'ticket_price', type: 'decimal', precision: 10, scale: 2 })
  cenaKarte: number;

  @Column({ name: 'url_img' })
  urLimg: string;

  @ManyToOne(() => Category, (category) => category.events, { eager: true }) //svaki put kada se ucita event ucita se i kategorija
  @JoinColumn({ name: 'category_id' })
  kategorija: Category;

  @ManyToOne(() => Location, (location) => location.events, { eager: true })
  @JoinColumn({ name: 'location_id' })
  lokacija: Location;

  /* @OneToMany(() => Reservation, (registration) => registration.event)
  registrations: Reservation[]; */
 
  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[]; 
  registrations: any;
}

//GOTOVA