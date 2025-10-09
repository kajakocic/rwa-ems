import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm/browser";
import { Event } from "src/events/entities/event.entity";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 100})
    name: string;

    @OneToMany(()=>Event,(event)=>event.location)
    events: Event[];
}

//GOTOVA