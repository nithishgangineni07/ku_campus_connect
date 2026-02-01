import Event from "../models/Event.js";

/* CREATE */
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, creatorId } = req.body;

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            creatorId,
            attendees: [creatorId], // Creator attends automatically
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getEvents = async (req, res) => {
    try {
        // Sort by date, ascending (soonest first)
        const events = await Event.find().sort({ date: 1 });
        res.status(200).json(events);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const rsvpEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const event = await Event.findById(id);
        const isAttending = event.attendees.includes(userId);

        if (isAttending) {
            event.attendees = event.attendees.filter((attendeeId) => attendeeId !== userId);
        } else {
            event.attendees.push(userId);
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { attendees: event.attendees },
            { new: true }
        );

        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
