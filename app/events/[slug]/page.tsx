import React from 'react'
import { notFound } from 'next/navigation';
import EventDetails from '@/components/EventDetails';


const BASE_URL = process.env.NEXT_PUBLIC_URL;

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const { event } = await request.json();

  if (!event) return notFound();

  return (
    <section id='event'>
      <h1>{event.title}</h1>
      <EventDetails event={event} />
    </section>
  )
}

export default EventDetailsPage