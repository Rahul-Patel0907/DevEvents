'use server';

import Booking from '@/database/booking.model';
import connectDB from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export const createBooking = async ({ eventId, email, path }: { eventId: string; email: string, path: string }) => {
    try {
        await connectDB();

        const existingBooking = await Booking.findOne({ eventId, email });

        if (existingBooking) {
            return { success: false, message: 'You are already registered for this event.' };
        }

        await Booking.create({ eventId, email });

        if (path) revalidatePath(path);

        return { success: true, message: 'Thank you for signing up!' };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, message: 'An error occurred while booking.' };
    }
};

export const getBookingsCount = async (eventId: string) => {
    try {
        await connectDB();
        const count = await Booking.countDocuments({ eventId });
        return count;
    } catch (error) {
        console.error('Error getting booking count:', error);
        return 0;
    }
}
