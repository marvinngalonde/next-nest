'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/api';
import type { CreateAppointmentDto } from '@/types';

const appointmentSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    appointmentDateTime: z.string().min(1, 'Please select a date and time'),
    notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
    });

    const onSubmit = async (data: AppointmentFormData) => {
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const appointmentData: CreateAppointmentDto = {
                ...data,
                appointmentDateTime: new Date(data.appointmentDateTime).toISOString(),
            };

            await apiClient.post('/appointments', appointmentData);

            setSubmitStatus({
                type: 'success',
                message: 'Appointment booked successfully! You will receive a calendar invitation.',
            });
            reset();
        } catch (error: any) {
            setSubmitStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to book appointment. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
                <p className="text-gray-600 mb-6">Fill out the form below to schedule your appointment.</p>

                {submitStatus && (
                    <div
                        className={`mb-6 p-4 rounded-md ${submitStatus.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                    >
                        {submitStatus.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Name *
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="john@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="appointmentDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Date & Time *
                        </label>
                        <input
                            {...register('appointmentDateTime')}
                            type="datetime-local"
                            id="appointmentDateTime"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        {errors.appointmentDateTime && (
                            <p className="mt-1 text-sm text-red-600">{errors.appointmentDateTime.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            {...register('notes')}
                            id="notes"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            placeholder="Any additional information..."
                        />
                        {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isSubmitting ? 'Booking...' : 'Book Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
}
