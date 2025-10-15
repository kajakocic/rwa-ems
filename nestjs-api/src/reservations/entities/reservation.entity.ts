import { User } from "src/users/entities/user.entity";
import { Event } from "src/events/entities/event.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('reservations')
export class Reservation {
    @PrimaryColumn()
    id:number;

    @Column({type:'int', default:1})
    brMesta: number;

    @ManyToOne(() => Event, (event) => event.registrations, { eager: true })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(()=>User, (user)=>user.registrations, {eager:true})
    @JoinColumn({name:'user_id'})
    user:User;
}

