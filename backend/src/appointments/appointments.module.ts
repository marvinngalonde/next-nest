import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleCalendarModule } from '../google-calendar/google-calendar.module';

@Module({
    imports: [PrismaModule, GoogleCalendarModule],
    controllers: [AppointmentsController],
    providers: [AppointmentsService],
})
export class AppointmentsModule { }
