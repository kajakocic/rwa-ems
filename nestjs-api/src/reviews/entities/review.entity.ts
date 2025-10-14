import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "src/events/entities/event.entity";
import { User } from "src/users/entities/user.entity";

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'int'})
    rating: number;
    
    @Column({type:'text'})
    comment: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @ManyToOne(()=>Event, (event)=>event.reviews, {eager:true})
    @JoinColumn({name:'event_id'})
    event:Event;

    @ManyToOne(()=>User, (user)=>user.reviews, {eager:true})
    @JoinColumn({name: 'user_id'})
    user: User;

}

//GOTOVA