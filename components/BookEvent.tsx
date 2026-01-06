'use client';
import { useState } from 'react';
import { createBooking } from '@/lib/actions/booking.actions';
import { usePathname } from 'next/navigation';

const BookEvent = ({ eventId }: { eventId: string }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [message, setMessage] = useState('');
    const pathname = usePathname();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createBooking({ eventId, email, path: pathname });
        setMessage(result.message);
        setSubmitted(true);
    }
    return (
        <div id="book-event">
            {submitted ? (
                <p className='text-sm'>{message}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email"> Address</label>
                        <input type="email" id="email" value={email} placeholder='Enter your email' onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <button type='submit' className='button-submit'>Sign Up</button>
                </form>
            )}
        </div>
    )
}

export default BookEvent