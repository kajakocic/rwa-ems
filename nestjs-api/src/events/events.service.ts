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
import { from, map, mergeMap, switchMap, filter, reduce } from 'rxjs';

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

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const postojeciEvent = await this.eventsRepository.findOne({
      where: { name: createEventDto.name },
    });

    if (postojeciEvent) {
      throw new ConflictException(`Event: ${createEventDto.name} već postoji.`);
    }

    const location = await this.locationsRepository.findOne({
      where: { id: createEventDto.locationId },
    });

    if (!location) {
      throw new NotFoundException('Prosledjena lokacija ne postoji.');
    }

    const category = await this.categoriesRepository.findOne({
      where: { id: createEventDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Prosledjena kategorija ne postoji.');
    }

    const noviEvent = this.eventsRepository.create({
      name: createEventDto.name,
      date: new Date(createEventDto.date),
      capacity: createEventDto.capacity,
      description: createEventDto.description,
      ticketPrice: createEventDto.ticketPrice,
      urlImg: createEventDto.urlImg,
      category: category,
      location: location,
    });

    return this.eventsRepository.save(noviEvent);
  }

  findAll() {
    return from(
      this.eventsRepository.find({
        relations: ['category', 'location', 'registrations', 'reviews'],
      })
    ).pipe(
      mergeMap(events => events),
      map(event => this.mapToResponseDto(event)),
      reduce((acc, event) => [...acc, event], [] as EventResponseDto[])
    );
  }

  async findOne(id: number): Promise<Event> {
    if (id <= 0) {
      throw new NotFoundException('Neispravan id.');
    }

    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['category', 'location', 'registrations', 'reviews'],
    });

    if (!event) {
      throw new NotFoundException(`Event sa id: ${id} ne postoji.`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const postojeciEvent = await this.eventsRepository.findOne({
      where: { id },
      relations: ['category', 'location'],
    });

    if (!postojeciEvent) {
      throw new NotFoundException('Event koji tražite ne postoji.');
    }

    if (updateEventDto.locationId) {
      const location = await this.locationsRepository.findOne({
        where: { id: updateEventDto.locationId },
      });

      if (!location) {
        throw new NotFoundException('Lokacija koju tražite ne postoji.');
      }

      postojeciEvent.location = location;
    }

    if (updateEventDto.categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateEventDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Kategorija koju tražite ne postoji.');
      }

      postojeciEvent.category = category;
    }

    if (updateEventDto.name) postojeciEvent.name = updateEventDto.name;
    if (updateEventDto.description) postojeciEvent.description = updateEventDto.description;
    if (updateEventDto.date) postojeciEvent.date = new Date(updateEventDto.date);
    if (updateEventDto.ticketPrice !== undefined) postojeciEvent.ticketPrice = updateEventDto.ticketPrice;
    if (updateEventDto.urlImg) postojeciEvent.urlImg = updateEventDto.urlImg;
    if (updateEventDto.capacity !== undefined) postojeciEvent.capacity = updateEventDto.capacity;

    return this.eventsRepository.save(postojeciEvent);
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

  async filterEvents(filterDto: FilterEventDto) {
    const queryBuilder = this.eventsRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.category', 'category')
      .leftJoinAndSelect('event.location', 'location');

    if (filterDto.date) {
      const datum = new Date(filterDto.date);
      queryBuilder.andWhere('DATE(event.datum) = DATE(:datum)', { datum });
    }

    if (filterDto.category) {
      queryBuilder.andWhere('category.naziv = :kategorija', { kategorija: filterDto.category });
    }

    if (filterDto.location) {
      queryBuilder.andWhere('location.naziv = :lokacija', { lokacija: filterDto.location });
    }

    const events = await queryBuilder.getMany();

    return from(events).pipe(
      filter(event => event !== null),
      map(event => this.mapToResponseDto(event)),
      reduce((acc, event) => [...acc, event], [] as EventResponseDto[])
    );
  }

  private mapToResponseDto(event: Event): EventResponseDto {
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      capacity: event.capacity,
      description: event.description,
      ticketPrice: Number(event.ticketPrice),
      urlImg: event.urlImg,
      category: event.category?.name || '',
      location: event.location?.name || '',
      categoryId: event.category?.id || 0,
      locationId: event.location?.id || 0,
    };
  }
}