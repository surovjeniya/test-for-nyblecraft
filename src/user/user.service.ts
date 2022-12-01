import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { UploadService } from 'src/upload/upload.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entity/user.entity';
import * as PDFCreator from 'pdfkit';
import * as fs from 'fs';
import { path } from 'app-root-path';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly uploadService: UploadService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.userRepository.create({ ...dto });
    return await this.userRepository.save(user);
  }
  async deleteUser(id: number) {
    const user = await this.getUser(id);
    if (user) {
      await this.userRepository.delete({ id });
      return `Пользователь ${user.email} удалён`;
    } else {
      return 'Пользователь не найден';
    }
  }
  async updateUser(dto: UpdateUserDto, id: number) {
    const user = await this.getUser(id);

    if (user) {
      return await this.userRepository.update(
        { id },
        { ...user, ...dto, password: await hash(dto.password, 3) },
      );
    } else {
      return 'Пользователь не найден';
    }
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async uploadImage(file: Express.Multer.File, id: number) {
    const user = await this.getUser(id);
    const uploadedFile = await this.uploadService.saveFile(file, user.email);
    user.image = uploadedFile.url;
    return await this.userRepository.save(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async createPdf(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return {
        response: false,
      };
    }
    const doc = new PDFCreator();
    const fileName = `${user.email}.pdf`;
    doc.pipe(fs.createWriteStream(fileName));
    doc.text(user.firstName);
    doc.text(user.lastName);
    doc.image(`${path}${user.image}`, {
      fit: [250, 300],
      align: 'center',
      valign: 'center',
    });
    doc.end();
    fs.rename(
      `${path}/${fileName}`,
      `${path}/uploads/${user.email}/${fileName}`,
      (err) => {
        if (err) throw err;
      },
    );
    user.pdf = `/uploads/${user.email}/${fileName}`;
    await this.userRepository.save(user);
    return {
      response: true,
      pdf: user.pdf,
    };
  }
}
