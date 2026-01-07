'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EventForm = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        overview: '',
        venue: '',
        location: '',
        date: '',
        time: '',
        mode: 'offline',
        audience: '',
        organizer: '',
        tags: '',
        agenda: [''],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAgendaChange = (index: number, value: string) => {
        const newAgenda = [...formData.agenda];
        newAgenda[index] = value;
        setFormData((prev) => ({ ...prev, agenda: newAgenda }));
    };

    const addAgendaItem = () => {
        setFormData((prev) => ({ ...prev, agenda: [...prev.agenda, ''] }));
    };

    const removeAgendaItem = (index: number) => {
        const newAgenda = formData.agenda.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, agenda: newAgenda }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'tags') {
                    // Convert comma separated string to array string for JSON.parse on server
                    const tagsArray = (value as string).split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                    data.append(key, JSON.stringify(tagsArray));
                } else if (key === 'agenda') {
                    // Filter empty agenda items and stringify
                    const agendaArray = (value as string[]).filter(item => item.trim() !== '');
                    data.append(key, JSON.stringify(agendaArray));
                } else {
                    data.append(key, value as string);
                }
            });

            if (imageFile) {
                data.append('image', imageFile);
            } else {
                throw new Error('Image is required');
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create event');
            }

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-3xl mx-auto p-6 bg-dark-100 rounded-lg border border-dark-200">
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="title">Event Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                    placeholder="e.g. Next.js Conf 2026"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="date">Date</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="time">Time</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="mode">Mode</label>
                <select
                    id="mode"
                    name="mode"
                    value={formData.mode}
                    onChange={handleChange}
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                >
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                    <option value="hybrid">Hybrid</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="venue">Venue</label>
                    <input
                        type="text"
                        id="venue"
                        name="venue"
                        value={formData.venue}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                        placeholder="e.g. Moscone Center"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                        placeholder="e.g. San Francisco, CA"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    rows={4}
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none resize-none"
                    placeholder="Detailed description of the event..."
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="overview">Overview</label>
                <textarea
                    id="overview"
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    required
                    maxLength={500}
                    rows={2}
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none resize-none"
                    placeholder="Short summary/catchphrase..."
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="image">Event Banner</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!imagePreview} // Required only if no preview (initial load)
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary/90"
                />
                {imagePreview && (
                    <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="audience">Target Audience</label>
                    <input
                        type="text"
                        id="audience"
                        name="audience"
                        value={formData.audience}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                        placeholder="e.g. Developers, Designers"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-light-100 font-semibold" htmlFor="organizer">Organizer</label>
                    <input
                        type="text"
                        id="organizer"
                        name="organizer"
                        value={formData.organizer}
                        onChange={handleChange}
                        required
                        className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                        placeholder="e.g. Vercel"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold" htmlFor="tags">Tags (comma separated)</label>
                <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    required
                    className="bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                    placeholder="e.g. javascript, react, web"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-light-100 font-semibold">Agenda Items</label>
                {formData.agenda.map((item, index) => (
                    <div key={index} className="flex gap-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleAgendaChange(index, e.target.value)}
                            required
                            className="flex-1 bg-dark-200 text-white p-3 rounded-md border border-dark-200 focus:border-primary outline-none"
                            placeholder={`Agenda Item ${index + 1}`}
                        />
                        {formData.agenda.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeAgendaItem(index)}
                                className="px-3 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20"
                            >
                                X
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addAgendaItem}
                    className="w-fit text-sm text-primary hover:underline mt-1"
                >
                    + Add another agenda item
                </button>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-lg mt-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? 'Creating Event...' : 'Create Event'}
            </button>
        </form>
    );
};

export default EventForm;
