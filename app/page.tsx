import React from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventCard from '@/components/EventCard'
import { IEvent, Event as EventModel } from '@/database';
import connectDB from '@/lib/mongodb';
import { cache } from 'react';
import { cacheLife } from 'next/cache';

const page = async () => {
  'use cache';
  cacheLife('hours');
  await connectDB();
  const eventsData = await EventModel.find().sort({ createdAt: -1 });

  // Serialize to plain objects to ensure compatibility
  const events: IEvent[] = JSON.parse(JSON.stringify(eventsData));

  return (
    <section>
      <h1 className='text-center'>The Hub for Every Dev <br /> Event You Can&apos;t Miss!</h1>
      <p className='text-center mt-5'>Hackathons, Meetups, and Conferences, All in One Place </p>
      <ExploreBtn />

      <div className="mt-20 space-y-7" id="events">
        <h3>Featured Events</h3>

        <ul className='events'>
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className='list-none'>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page