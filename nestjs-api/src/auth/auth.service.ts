import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Korisnik sa ovim email-om već postoji.');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id, tip: user.tip };
    const token = this.jwtService.sign(payload);
    
    return {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      password: user.password,
      email: user.email,
      tip: user.tip,
    };
   /*  return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.ime,
        lastName: user.prezime,
        email: user.email,
        tip: user.tip,
      },
    }; */
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Pogrešan email ili lozinka.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Pogrešan email ili lozinka.');
    }

    const payload = { email: user.email, sub: user.id, tip: user.tip };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      tip: user.tip,
      token: token,  
    };
    
    /* return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.ime,
        lastName: user.prezime,
        email: user.email,
        tip: user.tip,
      },
    }; */
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}