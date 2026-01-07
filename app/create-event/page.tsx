import EventForm from '@/components/EventForm'
import React from 'react'

const CreateEventPage = () => {
    return (
        <section className="container mx-auto py-10">
            <h1 className="text-3xl font-bold text-center mb-10 text-gradient">Create a New Event</h1>
            <EventForm />
        </section>
    )
}

export default CreateEventPage