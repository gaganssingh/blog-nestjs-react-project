import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  create(user: CreateUserDto): Observable<any> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashedPwd) => {
        const newUser = {
          ...user,
          password: hashedPwd,
        };

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...userDetails } = user;
            return userDetails;
          }),
          catchError((err) => {
            throw new Error(err);
          }),
        );
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find()).pipe(
      map((users: User[]) => {
        users.forEach((user) => delete user.password);
        return users;
      }),
    );
  }

  findOne(id: string): Observable<Partial<User>> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => {
        const { password, ...userDetails } = user;
        return userDetails;
      }),
    );
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOne({ where: { email } }));
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateOne(id: string, user: UpdateUserDto): Observable<any> {
    return from(this.userRepository.update(id, user));
  }

  login(loginUserDto: LoginUserDto): Observable<string> {
    return from(
      this.validateUser(loginUserDto.email, loginUserDto.password),
    ).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.authService
            .generateJwt(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          return `Invalid login credentials`;
        }
      }),
    );
  }

  validateUser(email: string, plainTextPwd: string) {
    return this.findByEmail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(plainTextPwd, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...userDetails } = user;
              return userDetails;
            } else {
              throw new Error(`Invalid login credentials`);
            }
          }),
        ),
      ),
    );
  }
}
