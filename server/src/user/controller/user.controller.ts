import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { map, Observable, of, catchError } from 'rxjs';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../models/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Observable<User | { error: string }> {
    return this.userService.create(createUserDto).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Observable<{ access_token: string }> {
    return this.userService
      .login(loginUserDto)
      .pipe(map((jwt: string) => ({ access_token: jwt })));
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<Partial<User>> {
    return this.userService.findOne(id);
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(id);
  }

  @Put(':id')
  updateOne(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<any> {
    return this.userService.updateOne(id, updateUserDto);
  }
}
