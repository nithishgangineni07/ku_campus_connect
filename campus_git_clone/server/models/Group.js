import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 2,
            max: 50,
        },
        description: {
            type: String,
            required: true,
            min: 5,
        },
        privacy: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        creatorId: {
            type: String,
            required: true,
        },
        members: {
            type: Array,
            default: [],
        },
    },
    { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);
export default Group;
