import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/events/entities/event.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  naziv: string;

  @OneToMany(() => Event, (event) => event.category)
  events: Event[];
}
