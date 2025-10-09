import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Location } from 'src/locations/entities/location.entity';
import { Review } from 'src/reviews/review.entity';
import { Registration } from 'src/registrations/entities/registration.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  ticketPrice: number;

  @Column()
  urlImg: string;

  @ManyToOne(() => Category, (category) => category.events, { eager: true }) //svaki put kada se ucita event ucita se i kategorija
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Location, (location) => location.events, { eager: true })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @OneToMany(() => Registration, (registration) => registration.event)
  registrations: Registration[];
 
  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[]; 
}

//GOTOVA