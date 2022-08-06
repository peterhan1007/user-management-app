import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { constants } from 'src/constants';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.input';
import { UpdateUserDto } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  createToken(payload: JwtPayload): any {
    const secretOrKey = constants.secret;
    const token = jwt.sign(payload, secretOrKey);
    return token;
  }

  async validateUser(payload: JwtPayload) {
    return await this.findOne(payload.id);
  }

  async login(name: string, password: string): Promise<User> {
    if (password == '') {
      throw new HttpException('empty password', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.findOne({ where: { name } });

    if (user.name) {
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return user;
    }

    throw new HttpException(
      'Username or password is incorrect',
      HttpStatus.NON_AUTHORITATIVE_INFORMATION,
    );
  }

  async register(
    name: string,
    password: string,
    email: string,
    title: string,
    description: string,
  ): Promise<User> {
    const duplicate = await this.usersRepository.findOne({
      where: { name },
    });

    if (duplicate != null) {
      throw new HttpException('Name already in use', HttpStatus.CONFLICT);
    }

    if (password == undefined) password = '';

    password = await bcrypt.hashSync(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;
    user.title = title;
    user.description = description;

    return await this.usersRepository.save(user);
  }

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.title = createUserDto.title;
    user.description = createUserDto.description;
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (user) return user;
    else return 'No user';
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const { name, email, description, password, title } = updateUserDto;

    const updatedUser = this.usersRepository
      .update(
        { id },
        {
          name,
          title,
          email,
          description,
          password: hash(password, 10),
        },
      )
      .then(async () => {
        return await this.findOne(id);
      });

    return updatedUser;
  }

  async remove(id: number) {
    const user = this.usersRepository.findOne({ where: { id } });
    const isDeleted = await this.usersRepository.delete(id);

    return isDeleted ? user : 'Invalid ID supplied.';
  }
}
