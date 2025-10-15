import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';

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

  /**
   * Kreira novu rezervaciju za event
   */
  async create(createReservationDto: CreateReservationDto): Promise<ReservationResponseDto> {
    // Provera da li event postoji
    const event = await this.eventsRepository.findOne({
      where: { id: createReservationDto.eventId },
      relations: ['registrations'],
    });

    if (!event) {
      throw new NotFoundException('Event ne postoji.');
    }

    // Provera da li korisnik postoji
    const user = await this.usersRepository.findOne({
      where: { id: createReservationDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Korisnik ne postoji.');
    }

    // Provera da li korisnik već ima rezervaciju za ovaj event
    const existingReservation = await this.reservationsRepository.findOne({
      where: {
        event: { id: createReservationDto.eventId },
        user: { id: createReservationDto.userId },
      },
    });

    if (existingReservation) {
      throw new ConflictException('Korisnik je već registrovan za ovaj event.');
    }

    // Provera dostupnosti mesta
    const totalRegistered = event.registrations?.reduce((sum, reg) => sum + reg.brMesta, 0) || 0;
    const requestedCapacity = createReservationDto.brMesta || 1;

    if (totalRegistered + requestedCapacity > event.kapacitet) {
      throw new BadRequestException('Nema dovoljno mesta za registraciju.');
    }

    // Kreiranje rezervacije
    const reservation = this.reservationsRepository.create({
      brMesta: requestedCapacity,
      event: event,
      user: user,
    });

    const savedReservation = await this.reservationsRepository.save(reservation);

    // Vraćanje DTO objekta
    return this.mapToResponseDto(savedReservation);
  }

  /**
   * Vraća sve rezervacije
   */
  async findAll(): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationsRepository.find({
      relations: ['event', 'user'],
    });

    return reservations.map(reservation => this.mapToResponseDto(reservation));
  }

  /**
   * Vraća jednu rezervaciju po ID-u
   */
  async findOne(id: number): Promise<ReservationResponseDto> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!reservation) {
      throw new NotFoundException(`Rezervacija sa ID ${id} ne postoji.`);
    }

    return this.mapToResponseDto(reservation);
  }

  /**
   * Vraća sve rezervacije jednog korisnika
   */
  async findByUser(userId: number): Promise<ReservationResponseDto[]> {
    // Provera da li korisnik postoji
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Korisnik sa ID ${userId} ne postoji.`);
    }

    const reservations = await this.reservationsRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'user'],
    });

    return reservations.map(reservation => this.mapToResponseDto(reservation));
  }

  /**
   * Vraća sve rezervacije za određeni event
   */
  async findByEvent(eventId: number): Promise<ReservationResponseDto[]> {
    // Provera da li event postoji
    const event = await this.eventsRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event sa ID ${eventId} ne postoji.`);
    }

    const reservations = await this.reservationsRepository.find({
      where: { event: { id: eventId } },
      relations: ['event', 'user'],
    });

    return reservations.map(reservation => this.mapToResponseDto(reservation));
  }

  /**
   * Briše rezervaciju po ID-u
   */
  async remove(id: number): Promise<void> {
    const reservation = await this.reservationsRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException(`Rezervacija sa ID ${id} ne postoji.`);
    }

    await this.reservationsRepository.remove(reservation);
  }

  /**
   * Mapira Reservation entitet u ReservationResponseDto
   */
  private mapToResponseDto(reservation: Reservation): ReservationResponseDto {
    return {
      id: reservation.id,
      userId: reservation.user.id,
      userName: `${reservation.user.ime} ${reservation.user.prezime}`,
      eventId: reservation.event.id,
      eventName: reservation.event.naziv,
      brMesta: reservation.brMesta,
    };
  }
}