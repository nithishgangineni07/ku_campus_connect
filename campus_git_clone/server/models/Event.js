import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 2,
            max: 100,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        creatorId: {
            type: String,
            required: true,
        },
        attendees: {
            type: Array, // Array of user IDs
            default: [],
        },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
