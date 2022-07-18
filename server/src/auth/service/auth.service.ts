import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(plainTextPwd: string): Observable<string> {
    return from<string>(bcrypt.hash(plainTextPwd, 12));
  }

  comparePasswords(
    loginPassword: string,
    storedPassword: string,
  ): Observable<any> {
    return of<any | boolean>(bcrypt.compare(loginPassword, storedPassword));
  }
}
