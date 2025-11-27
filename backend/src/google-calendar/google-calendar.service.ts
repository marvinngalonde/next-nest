import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
    private calendar;
    private readonly logger = new Logger(GoogleCalendarService.name);

    constructor() {
        try {
            const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
            const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!serviceAccountEmail || !privateKey) {
                this.logger.warn(
                    'Google Calendar credentials not configured. Calendar integration will be disabled.',
                );
                return;
            }

            const auth = new google.auth.JWT({
                email: serviceAccountEmail,
                key: privateKey,
                scopes: ['https://www.googleapis.com/auth/calendar'],
            });

            this.calendar = google.calendar({ version: 'v3', auth });
            this.logger.log('Google Calendar service initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Google Calendar service', error);
        }
    }

    async createEvent(
        name: string,
        email: string,
        appointmentDateTime: Date,
        notes?: string,
    ): Promise<string | null> {
        if (!this.calendar) {
            this.logger.warn('Google Calendar not configured, skipping event creation');
            return null;
        }

        try {
            const endTime = new Date(appointmentDateTime);
            endTime.setHours(endTime.getHours() + 1); // Default 1-hour appointment

            const event = {
                summary: `Appointment with ${name}`,
                description: `Attendee: ${email}\n\n${notes || 'No additional notes'}`,
                start: {
                    dateTime: appointmentDateTime.toISOString(),
                    timeZone: 'UTC',
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: 'UTC',
                },
                // attendees: [{ email }], // Removed to avoid "Service accounts cannot invite attendees" error
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: 'email', minutes: 24 * 60 },
                        { method: 'popup', minutes: 30 },
                    ],
                },
            };

            const response = await this.calendar.events.insert({
                calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
                requestBody: event,
                sendUpdates: 'all',
            });

            this.logger.log(`Calendar event created: ${response.data.id}`);
            return response.data.id;
        } catch (error) {
            this.logger.error('Failed to create calendar event', error);
            return null;
        }
    }
}
