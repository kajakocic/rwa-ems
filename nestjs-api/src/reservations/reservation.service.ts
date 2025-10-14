import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { from, map, mergeMap, zip, reduce } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationsRepository: Repository<Reservation>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const event = await this.eventsRepository.findOne({
      where: { id: createReservationDto.eventId },
      relations: ['registrations'],
    });

    if (!event) {
      throw new NotFoundException('Event ne postoji.');
    }

    const user = await this.usersRepository.findOne({
      where: { id: createReservationDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Korisnik ne postoji.');
    }

    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        event: { id: createReservationDto.eventId },
        user: { id: createReservationDto.userId },
      },
    });

    if (existingReservation) {
      throw new ConflictException('Korisnik je već registrovan za ovaj event.');
    }

    const totalRegistered = event.registrations?.reduce((sum, reg) => sum + reg.capacity, 0) || 0;
    const requestedCapacity = createReservationDto.capacity || 1;

    if (totalRegistered + requestedCapacity > event.capacity) {
      throw new BadRequestException('Nema dovoljno mesta za registraciju.');
    }

    const reservation = this.reservationsRepository.create({
      capacity: requestedCapacity,
      event: event,
      user: user,
    });

    return this.reservationsRepository.save(reservation);
  }

  findAll() {
    return from(
      this.reservationsRepository.find({
        relations: ['event', 'user'],
      })
    ).pipe(
      mergeMap(reservations => reservations),
      map(reg => this.mapToResponseDto(reg)),
      reduce((acc, reg) => [...acc, reg], [] as ReservationResponseDto[])
    );
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!reservation) {
      throw new NotFoundException(`Registracija sa id: ${id} ne postoji.`);
    }

    return reservation;
  }

  async findByUser(userId: number) {
    const reservations = await this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'user'],
    });

    return from(reservations).pipe(
      map(reg => this.mapToResponseDto(reg)),
      reduce((acc, reg) => [...acc, reg], [] as ReservationResponseDto[])
    );
  }

  async findByEvent(eventId: number) {
    const reservations = await this.reservationsRepository.find({
      where: { event: { id: eventId } },
      relations: ['event', 'user'],
    });

    return from(reservations).pipe(
      map(reg => this.mapToResponseDto(reg)),
      reduce((acc, reg) => [...acc, reg], [] as ReservationResponseDto[])
    );
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationsRepository.remove(reservation);
  }

  private mapToResponseDto(registration: Reservation): ReservationResponseDto {
    return {
      id: registration.id,
      capacity: registration.capacity,
      reservedAt: registration.reservedAt,
      eventNaziv: registration.event?.name || '',
      eventDatum: registration.event?.date,
      userName: `${registration.user?.name} ${registration.user?.lastName}`,
      userEmail: registration.user?.email || '',
    };
  }
}