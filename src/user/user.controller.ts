import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guard/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //http://localhost:5000/api/user
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  // http://localhost:5000/api/user/2
  @Delete('/:id')
  @UseGuards(new AuthGuard())
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(Number(id));
  }

  // http://localhost:5000/api/user/3
  @Put('/:id')
  @UseGuards(new AuthGuard())
  async updateUser(@Body() dto: UpdateUserDto, @Param('id') id: string) {
    return await this.userService.updateUser(dto, Number(id));
  }

  // http://localhost:5000/api/user/3
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userService.getUser(Number(id));
  }

  // http://localhost:5000/api/user/upload-image/3
  @Post('/upload-image/:id')
  @UseGuards(new AuthGuard())
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    return await this.userService.uploadImage(file, Number(id));
  }

  // http://localhost:5000/api/user/create-pdf/surovjeniya@gmail.com
  @Post('/create-pdf/:email')
  @UseGuards(new AuthGuard())
  async createPdf(@Param('email') email: string) {
    return await this.userService.createPdf(email);
  }
}
