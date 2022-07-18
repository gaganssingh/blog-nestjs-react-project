import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user: CreateUserDto): Observable<User> {
    return from(this.userRepository.save(user));
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  findOne(id: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { id } }));
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: string, user: UpdateUserDto): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
