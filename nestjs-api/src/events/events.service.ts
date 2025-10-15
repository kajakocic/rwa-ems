import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FilterEventDto } from './dto/filter-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Category } from '../categories/entities/category.entity';
import { Location } from '../locations/entities/location.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Location)
    private locationsRepository: Repository<Location>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Pick<EventResponseDto, 'id' | 'naziv' | 'datum' |
    'kapacitet'|'opis'|'cenaKarte'|
    'urLimg'|'kategorijaId'|'lokacijaId'>> {

    const postojeciEvent = await this.eventsRepository.findOne({
      where: { naziv: createEventDto.naziv },
    });

    if (postojeciEvent) {
      throw new ConflictException(`Event: ${createEventDto.naziv} već postoji.`);
    }

    const location = await this.locationsRepository.findOne({
      where: { id: createEventDto.lokacijaId },
    });

    if (!location) {
      throw new NotFoundException('Prosledjena lokacija ne postoji.');
    }

    const category = await this.categoriesRepository.findOne({
      where: { id: createEventDto.kategorijaId },
    });

    if (!category) {
      throw new NotFoundException('Prosledjena kategorija ne postoji.');
    }

    const noviEvent = this.eventsRepository.create({
    naziv: createEventDto.naziv,
    datum: new Date(createEventDto.datum),
    kapacitet: createEventDto.kapacitet,
    opis: createEventDto.opis,
    cenaKarte: createEventDto.cenaKarte,
    urLimg: createEventDto.urLimg,
    kategorija: category,
    lokacija: location,
    });
     const savedEvent = await this.eventsRepository.save(noviEvent);

    return {
      id: savedEvent.id,
      naziv: savedEvent.naziv,
      datum: savedEvent.datum,
      kapacitet: savedEvent.kapacitet,
      opis: savedEvent.opis,
      cenaKarte: savedEvent.cenaKarte,
      urLimg: savedEvent.urLimg,
      kategorijaId: category.id,
      lokacijaId: location.id,
      //kao za IAddEvent na frontendu
  };
  }

  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.eventsRepository.find({
      relations: ['kategorija', 'lokacija'],
    });

    return events.map(event => this.mapToResponseDto(event));
  }

  async findOne(id: number): Promise<EventResponseDto> {
    if (id <= 0) {
      throw new NotFoundException('Neispravan id.');
    }

    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['kategorija', 'lokacija'],
    });

    if (!event) {
      throw new NotFoundException(`Event sa id: ${id} ne postoji.`);
    }

    return this.mapToResponseDto(event);
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
    const postojeciEvent = await this.eventsRepository.findOne({
      where: { id },
      relations: ['kategorija', 'lokacija'],
    });

    if (!postojeciEvent) {
      throw new NotFoundException('Event koji tražite ne postoji.');
    }

    if (updateEventDto.lokacijaId) {
      const location = await this.locationsRepository.findOne({
        where: { id: updateEventDto.lokacijaId },
      });

      if (!location) {
        throw new NotFoundException('Lokacija koju tražite ne postoji.');
      }

      postojeciEvent.lokacija = location;
    }

    if (updateEventDto.kategorijaId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateEventDto.kategorijaId },
      });

      if (!category) {
        throw new NotFoundException('Kategorija koju tražite ne postoji.');
      }

      postojeciEvent.kategorija = category;
    }

    if (updateEventDto.naziv) postojeciEvent.naziv = updateEventDto.naziv;
    if (updateEventDto.opis) postojeciEvent.opis = updateEventDto.opis;
    if (updateEventDto.datum) postojeciEvent.datum = new Date(updateEventDto.datum);
    if (updateEventDto.cenaKarte !== undefined) postojeciEvent.cenaKarte = updateEventDto.cenaKarte;
    if (updateEventDto.urLimg) postojeciEvent.urLimg = updateEventDto.urLimg;
    if (updateEventDto.kapacitet !== undefined) postojeciEvent.kapacitet = updateEventDto.kapacitet;

    const updatedEvent = await this.eventsRepository.save(postojeciEvent);

    const eventWithRelations = await this.eventsRepository.findOne({
      where: { id: updatedEvent.id },
      relations: ['kategorija', 'lokacija']
    });

    if (!eventWithRelations) {
      throw new NotFoundException(`Event sa id: ${id} ne postoji nakon čuvanja.`);
    }

    return this.mapToResponseDto(eventWithRelations);
  }

  async remove(id: number): Promise<void> {
    if (id <= 0) {
      throw new NotFoundException('Neispravan id.');
    }

    const event = await this.eventsRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event sa id: ${id} ne postoji.`);
    }

    await this.eventsRepository.remove(event);
  }

  async filterEvents(filterDto: FilterEventDto): Promise<EventResponseDto[]> {
    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.kategorija', 'kategorija')
      .leftJoinAndSelect('event.lokacija', 'lokacija');

    if (filterDto.datum) {
      const datum = new Date(filterDto.datum);
      queryBuilder.andWhere('DATE(event.datum) = DATE(:datum)', { datum });
    }

    if (filterDto.kategorija) {
      queryBuilder.andWhere('kategorija.name = :kategorija', { 
        kategorija: filterDto.kategorija 
      });
    }

    if (filterDto.lokacija) {
      queryBuilder.andWhere('lokacija.name = :lokacija', { 
        lokacija: filterDto.lokacija 
      });
    }

    const events = await queryBuilder.getMany();
    return events.map(event => this.mapToResponseDto(event));
  }

  private mapToResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      naziv: event.naziv,
      datum: event.datum,
      kapacitet: event.kapacitet,
      opis: event.opis,
      cenaKarte: Number(event.cenaKarte),
      urLimg: event.urLimg,
      kategorija: event.kategorija?.kategorija || '',
      lokacija: event.lokacija?.lokacija || '',
      kategorijaId: event.kategorija?.id || 0,
      lokacijaId: event.lokacija?.id || 0,
    };
  }
}