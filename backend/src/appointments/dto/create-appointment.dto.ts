import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsDateString,
    IsOptional,
} from 'class-validator';

export class CreateAppointmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsDateString()
    @IsNotEmpty()
    appointmentDateTime: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
