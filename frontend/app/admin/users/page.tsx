'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '@/lib/api';
import type { User, CreateUserDto } from '@/types';
import Link from 'next/link';

const userSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type UserFormData = z.infer<typeof userSchema>;

export default function UsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        fetchUsers();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data);
        } catch (err: any) {
            setError('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: UserFormData) => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const userData: CreateUserDto = {
                email: data.email,
                password: data.password,
            };

            await apiClient.post('/users', userData);
            setSuccess('Admin user created successfully!');
            reset();
            fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-8">
                            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                            <Link
                                href="/admin/dashboard"
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Appointments
                            </Link>
                            <span className="text-blue-600 font-medium">Manage Users</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Create User Form */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Admin User</h2>
                            <div className="bg-white rounded-lg shadow p-6">
                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            id="email"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                            placeholder="newadmin@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Password
                                        </label>
                                        <input
                                            {...register('password')}
                                            type="password"
                                            id="password"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                            placeholder="••••••••"
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isSubmitting ? 'Creating...' : 'Create Admin User'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Users List */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Users</h2>
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                {users.length === 0 ? (
                                    <div className="p-6 text-center text-gray-600">
                                        No users found
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <li key={user.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{user.email}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Created: {new Date(user.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Admin
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
