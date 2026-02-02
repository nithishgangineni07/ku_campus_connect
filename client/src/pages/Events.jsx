import MobileNavbar from '../components/MobileNavbar';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx'
import LeftSidebar from '../components/LeftSidebar.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import axios from '../api/axios';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router-dom';


const Events = () => {
    const [events, setEvents] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const [file, setFile] = useState(null);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('location', location);

        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await axios.post('/events',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEvents([...events, response.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
            setShowCreateModal(false);
            setTitle('');
            setDescription('');
            setDate('');
            setLocation('');
            setFile(null);
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

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        try {
            await axios.delete(`/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(events.filter(e => e._id !== eventId));
            showToast('Event deleted successfully', 'success');
        } catch (err) {
            console.error("Error deleting event", err);
            showToast('Failed to delete event', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <MobileNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-7xl mx-auto">
                <LeftSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
                                                <div className="flex items-center gap-2">
                                                    {event.attendees.includes(user._id) && (
                                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Attending</span>
                                                    )}
                                                    {(user._id === event.creatorId || user.role === 'admin') && (
                                                        <button
                                                            onClick={() => handleDeleteEvent(event._id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                            title="Delete Event"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                                <span>📍</span> {event.location}
                                            </p>
                                            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                                            {event.filePath && (
                                                <div className="mb-4">
                                                    <a
                                                        href={`http://localhost:5000/assets/${event.filePath}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                                                    >
                                                        <span>📎</span>
                                                        <span>{event.originalFileName || 'View Attachment'}</span>
                                                    </a>
                                                </div>
                                            )}
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                                    <span>📎</span>
                                    <span>{file ? file.name : 'Choose File'}</span>
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
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
