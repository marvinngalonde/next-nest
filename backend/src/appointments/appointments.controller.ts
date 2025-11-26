import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('appointments')
export class AppointmentsController {
    constructor(private appointmentsService: AppointmentsService) { }

    @Post()
    async create(@Body(ValidationPipe) createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    async findAll() {
        return this.appointmentsService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    async findOne(@Param('id') id: string) {
        return this.appointmentsService.findOne(id);
    }
}
