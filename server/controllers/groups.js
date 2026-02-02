import Group from "../models/Group.js";
import User from "../models/User.js";

/* CREATE */
export const createGroup = async (req, res) => {
    try {
        const { name, description, privacy, creatorId } = req.body;

        const newGroup = new Group({
            name,
            description,
            privacy,
            creatorId,
            members: [creatorId], // Creator joins automatically
        });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);
        res.status(200).json(group);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const joinGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const group = await Group.findById(id);
        const isMember = group.members.includes(userId);

        if (isMember) {
            group.members = group.members.filter((memberId) => memberId !== userId);
        } else {
            group.members.push(userId);
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            id,
            { members: group.members },
            { new: true }
        );

        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
