import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "./entities/location.entity";
import { CreateLocationDto } from "./dto/create-location.dto";
import { from, map, take } from "rxjs";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(Location)
        private locationsRepository: Repository<Location>,
    ){}

    //add, get, getByID, delete IMPLEMENTACIJA
    
    async create(createLocationDto: CreateLocationDto):Promise<Location>
    {
        const existing = await this.locationsRepository.findOne({
            where: {name:createLocationDto.name}
        });

        if (existing) {
            throw new ConflictException(`Lokaciaja ${createLocationDto.name} već postoji.`);
        }

        const location = this.locationsRepository.create(createLocationDto);
        return this.locationsRepository.save(location);
    }

    findAll() {
        return from(this.locationsRepository.find({ relations: ['events'] })).pipe( 
        take(1),
        map(locations => locations)
        );
        //relations radi join
        //from()-iz rxjs biblioteke i pretvara Promise u Observable
        //take i map suvisni
    }

    /* async findAll(): Promise<Location[]> {
        return this.locationsRepository.find({ relations: ['events'] });
    } */

    async findOne(id: number):Promise<Location> {
        const location = await this.locationsRepository.findOne({
            where: {id},
            relations: ['events'], //govori TypeORM-u da, pored same lokacije, 
            //u istom upitu dohvati i sve povezane objekte iz tabele events
        });

        if(!location){
            throw new NotFoundException(`Lokacija sa id: ${id} ne postoji.`);
        }

        return location;
    }

    async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        const location = await this.findOne(id);
        Object.assign(location, updateLocationDto); //kopira vrednosti iz izvornog u ciljani obj
        return this.locationsRepository.save(location);
    }

    async remove(id: number): Promise<void> {
        const location = await this.findOne(id);
        await this.locationsRepository.remove(location);
    }
    
}