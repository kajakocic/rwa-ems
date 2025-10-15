import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto } from './dto/review-response.dto';
import { Event } from '../events/entities/event.entity';
import { User } from '../users/entities/user.entity';
import { from, map, mergeMap, takeUntil, Subject, reduce } from 'rxjs';

@Injectable()
export class ReviewsService {
  private destroy$ = new Subject<void>();

  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const event = await this.eventsRepository.findOne({
      where: { id: createReviewDto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event ne postoji.');
    }

    const user = await this.usersRepository.findOne({
      where: { id: createReviewDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Korisnik ne postoji.');
    }

    const existingReview = await this.reviewsRepository.findOne({
      where: {
        event: { id: createReviewDto.eventId },
        user: { id: createReviewDto.userId },
      },
    });

    if (existingReview) {
      throw new ConflictException('Korisnik je već ostavio recenziju za ovaj event.');
    }

    const review = this.reviewsRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      event: event,
      user: user,
    });

    return this.reviewsRepository.save(review);
  }

  findAll() {
    return from(
      this.reviewsRepository.find({
        relations: ['event', 'user'],
      })
    ).pipe(
      takeUntil(this.destroy$),
      mergeMap(reviews => reviews),
      map(review => this.mapToResponseDto(review)),
      reduce((acc, review) => [...acc, review], [] as ReviewResponseDto[])
    );
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!review) {
      throw new NotFoundException(`Recenzija sa id: ${id} ne postoji.`);
    }

    return review;
  }

  async findByEvent(eventId: number) {
    const reviews = await this.reviewsRepository.find({
      where: { event: { id: eventId } },
      relations: ['event', 'user'],
    });

    return from(reviews).pipe(
      map(review => this.mapToResponseDto(review)),
      reduce((acc, review) => [...acc, review], [] as ReviewResponseDto[])
    );
  }

  async findByUser(userId: number) {
    const reviews = await this.reviewsRepository.find({
      where: { user: { id: userId } },
      relations: ['event', 'user'],
    });

    return from(reviews).pipe(
      map(review => this.mapToResponseDto(review)),
      reduce((acc, review) => [...acc, review], [] as ReviewResponseDto[])
    );
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    return this.reviewsRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewsRepository.remove(review);
  }

  async getAverageRating(eventId: number): Promise<number> {
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.event_id = :eventId', { eventId })
      .getRawOne();

    return result.average ? parseFloat(result.average) : 0;
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      eventName: review.event?.naziv || '',
      userName: `${review.user?.ime} ${review.user?.prezime}`,
      userEmail: review.user?.email || '',
    };
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}