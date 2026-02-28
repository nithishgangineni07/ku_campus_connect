import Event from "../models/Event.js";

/* CREATE */
export const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, creatorId } = req.body;

        let filePath = null;
        let originalFileName = null;

        if (req.file) {
            originalFileName = req.file.originalname;
            filePath = req.file.filename;
        }

        const newEvent = new Event({
            title,
            description,
            date,
            location,
            creatorId: req.user.id,
            filePath,
            originalFileName,
            attendees: [req.user.id], // Creator attends automatically
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* DELETE */
export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) return res.status(404).json({ message: "Event not found" });

        // Check ownership
        if (req.user.id !== event.creatorId.toString() && req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: "Access denied." });
        }

        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getEvents = async (req, res) => {
    try {
        // Sort by date, ascending (soonest first)
        const events = await Event.find()
            .populate('attendees', 'name email rollNumber')
            .populate('creatorId', 'name')
            .sort({ date: 1 });

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

        console.log("RSVP Request:", { id, userId });

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Current Attendees (IDs):", event.attendees);

        // Handle potential schema mismatch (if single ID instead of array)
        let attendeesArr = Array.isArray(event.attendees) ? event.attendees : (event.attendees ? [event.attendees] : []);
        // Force it to be an array in the document if it wasn't
        if (!Array.isArray(event.attendees)) {
            event.attendees = attendeesArr;
        }

        const isAttending = attendeesArr.some(
            attendeeId => attendeeId.toString() === userId
        );

        console.log("Is Attending:", isAttending);

        if (isAttending) {
            event.attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== userId);
        } else {
            event.attendees.push(userId);
        }

        await event.save();
        console.log("Updated Attendees:", event.attendees);

        const updatedEvent = await Event.findById(id)
            .populate("attendees", "name email rollNumber")
            .populate("creatorId", "name");

        res.status(200).json(updatedEvent);
    } catch (err) {
        console.error("RSVP Error:", err);
        res.status(404).json({ message: err.message });
    }
};
