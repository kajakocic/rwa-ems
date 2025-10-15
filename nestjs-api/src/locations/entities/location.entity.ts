import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/events/entities/event.entity";

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, length: 100})
    lokacija: string;

    @OneToMany(()=>Event,(event)=>event.lokacija)
    events: Event[];
}

//GOTOVA