export interface Appointment {
    id: string;
    name: string;
    email: string;
    appointmentDateTime: string;
    notes?: string;
    googleEventId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
    createdAt: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface CreateAppointmentDto {
    name: string;
    email: string;
    appointmentDateTime: string;
    notes?: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
}
