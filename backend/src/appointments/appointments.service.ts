import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
    private readonly logger = new Logger(AppointmentsService.name);

    constructor(
        private prisma: PrismaService,
        private googleCalendar: GoogleCalendarService,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        const appointmentDate = new Date(createAppointmentDto.appointmentDateTime);

        // Create Google Calendar event
        const googleEventId = await this.googleCalendar.createEvent(
            createAppointmentDto.name,
            createAppointmentDto.email,
            appointmentDate,
            createAppointmentDto.notes,
        );

        // Save appointment to database
        const appointment = await this.prisma.appointment.create({
            data: {
                name: createAppointmentDto.name,
                email: createAppointmentDto.email,
                appointmentDateTime: appointmentDate,
                notes: createAppointmentDto.notes,
                googleEventId,
            },
        });

        this.logger.log(`Appointment created: ${appointment.id}`);
        return appointment;
    }

    async findAll() {
        return this.prisma.appointment.findMany({
            orderBy: {
                appointmentDateTime: 'asc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.appointment.findUnique({
            where: { id },
        });
    }
}
