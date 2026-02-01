import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/ToastContext';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { token, user } = useAuth();
    const { showToast } = useToast();

    if (!user) return null;

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
        } catch (err) {
            console.error("Error fetching events", err);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/events',
                { title, description, date, location, creatorId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents([...events, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
            setShowCreateModal(false);
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            showToast('Event created successfully!', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to create event', 'error');
        }
    };

    const handleRSVP = async (eventId) => {
        try {
            const response = await axios.patch(`/events/${eventId}/rsvp`,
                { userId: user._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local state
            setEvents(events.map(e => e._id === eventId ? response.data : e));
            showToast('RSVP updated', 'success');
        } catch (err) {
            console.error(err);
            showToast('Failed to update RSVP', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="md:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Events</h1>
            </header>

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar />

                <main className="flex-1 min-w-0 p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                            <Button onClick={() => setShowCreateModal(true)}>+ Create Event</Button>
                        </div>

                        <div className="space-y-4">
                            {events.map(event => (
                                <Card key={event._id} variant="default" className="p-0 flex flex-col md:flex-row overflow-hidden">
                                    <div className="md:w-32 bg-primary-50 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-primary-100">
                                        <span className="text-sm font-bold text-primary-600 uppercase">
                                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-3xl font-bold text-gray-900">
                                            {new Date(event.date).getDate()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                                                {event.attendees.includes(user._id) && (
                                                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Attending</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                <span>📍</span> {event.location}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-sm text-gray-500">
                                                <span className="font-semibold text-gray-900">{event.attendees.length}</span> people going
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={event.attendees.includes(user._id) ? "outline" : "primary"}
                                                onClick={() => handleRSVP(event._id)}
                                            >
                                                {event.attendees.includes(user._id) ? 'Cancel RSVP' : 'RSVP Now'}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </main>

                <RightSidebar />
            </div>

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <Card className="w-full max-w-md p-6 bg-white">
                        <h3 className="text-xl font-bold mb-4">Create New Event</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <Input
                                label="Event Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <Input
                                label="Date & Time"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                            <Input
                                label="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                                <Button type="submit">Create Event</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Events;
