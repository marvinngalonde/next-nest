import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Post()
    async createAdmin(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.usersService.createAdmin(createUserDto);
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }
}
