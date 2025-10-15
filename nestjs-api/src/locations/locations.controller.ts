import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserType } from 'src/common/enums/user-type.enum';
import { CreateLocationDto } from './dto/create-location.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateLocationDto } from './dto/update-location.dto';

@Controller('locations')
export class LocationsController {
    constructor (private readonly locationsService:LocationsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.Admin)
    create(@Body() createLocationDto: CreateLocationDto) {
      return this.locationsService.create(createLocationDto);
    }

    @Get()
    findAll() {
      return this.locationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
    return this.locationsService.findOne(+id);
  }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.Admin)
    update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
      return this.locationsService.update(+id, updateLocationDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.Admin)
    remove(@Param('id') id: string) {
      return this.locationsService.remove(+id);
    }
}
