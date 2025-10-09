import { User } from "src/users/entities/user.entity";
import { Event } from "src/events/entities/event.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('registrations')
export class Registration {
    @PrimaryColumn()
    id:number;

    @Column({type:'int', default:1})
    capacity: number;

    @CreateDateColumn({ name: 'registered_at' })
    registeredAt: Date;

    @ManyToOne(() => Event, (event) => event.registrations, { eager: true })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @ManyToOne(()=>User, (user)=>user.registrations, {eager:true})
    @JoinColumn({name:'user_id'})
    user:User;
}

//GOTOVA