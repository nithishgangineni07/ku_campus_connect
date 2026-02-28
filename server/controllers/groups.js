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
        const groups = await Group.find()
            .populate("members", "username rollNumber email")
            .populate("creatorId", "username");
        res.status(200).json(groups);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id)
            .populate("members", "username rollNumber email")
            .populate("creatorId", "username");
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
        const isMember = group.members.some(memberId => memberId.toString() === userId);

        if (isMember) {
            group.members = group.members.filter((memberId) => memberId.toString() !== userId);
        } else {
            group.members.push(userId);
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            id,
            { members: group.members },
            { new: true }
        )
            .populate("members", "username rollNumber email")
            .populate("creatorId", "username");

        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* DELETE */
export const deleteGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const group = await Group.findById(id);

        if (!group) return res.status(404).json({ message: "Group not found" });

        // Check ownership or admin/faculty role
        if (req.user.id !== group.creatorId.toString() && req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: "Access denied." });
        }

        await Group.findByIdAndDelete(id);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* REMOVE MEMBER */
export const removeMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // ID of the member to remove

        const group = await Group.findById(id);
        if (!group) return res.status(404).json({ message: "Group not found" });

        // Check permissions: Admin, Faculty, or Group Creator
        if (
            req.user.id !== group.creatorId.toString() &&
            req.user.role !== 'admin' &&
            req.user.role !== 'faculty'
        ) {
            return res.status(403).json({ message: "Access denied. You cannot remove members." });
        }

        group.members = group.members.filter((memberId) => memberId.toString() !== userId);

        await group.save();

        const updatedGroup = await Group.findById(id)
            .populate("members", "username rollNumber email")
            .populate("creatorId", "username");

        res.status(200).json(updatedGroup);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
