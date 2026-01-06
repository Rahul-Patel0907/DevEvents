import React from 'react'
import Image from 'next/image';
import BookEvent from './BookEvent';
import { getSimilarEventBySLug } from '@/lib/actions/event.actions';
import { IEvent } from '@/database';
import EventCard from './EventCard';
const bookings = 1;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {
    return (
        <div className='flex-row-gap-2 items-center'>
            <Image src={icon} alt={alt} width={17} height={17} />
            <p>{label}</p>
        </div>
    )
}

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
    <div className='agenda'>
        <h2>Agenda</h2>
        <ul>
            {agendaItems.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
    <div className='flex flex-row gap-1.5 flex-wrap'>
        {tags.map((tag) => (
            <div className='pill' key={tag}>{tag}</div>
        ))}
    </div>
)

const EventDetails = async ({ event }: { event: any }) => {
    const { description, image, overview, title, location, date, time, mode, agenda, audience, organizer, tags } = event;

    if (!description) return null;

    const similarEvents: IEvent[] = await getSimilarEventBySLug(event.slug);


    return (
        <section id='event'>
            <div className='header'>
                <h1>Event Description</h1>
                <p className='mt-2'>{description}</p>
            </div>
            <div className='details'>
                <div className='content'>
                    <Image src={image} alt="Event Banner" width={800} height={800} className='banner' />
                    <section className='flex-col-gap-2'>
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </section>
                    <section className='flex-col-gap-2'>
                        <h2>Event Details</h2>
                        <EventDetailItem icon='/icons/pin.svg' alt='location' label={location} />
                        <EventDetailItem icon='/icons/calendar.svg' alt='date' label={date} />
                        <EventDetailItem icon='/icons/clock.svg' alt='time' label={time} />
                        <EventDetailItem icon='/icons/mode.svg' alt='mode' label={mode} />
                        <EventDetailItem icon='/icons/audience.svg' alt='audience' label={audience} />
                    </section>
                    <EventAgenda agendaItems={agenda} />

                    <section className='flex-col-gap-2'>
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </section>
                    <EventTags tags={tags} />
                </div>
                <aside className='booking'>
                    <div className='signup-card'>
                        <h2>Book Your Spot</h2>
                        {bookings > 0 ? (
                            <p className='text-sm'>Join {bookings} people who have already booked their spot!</p>
                        ) : (
                            <p className='text-sm'>Be the first to book your spot!</p>
                        )}
                        <BookEvent />
                    </div>
                </aside>

            </div>

            <div className='flex w-full flex-col gap-4 pt-20'>
                <h2>Similar Events</h2>
                <div className='events'>
                    {similarEvents.length > 0 && similarEvents.map((similarEvent: IEvent) => (
                        <EventCard key={String(similarEvent._id)} {...similarEvent} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default EventDetails;