import User from "../models/User.js";

/* READ */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove password before sending
        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json(userToSend);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { bio, location, occupation } = req.body;

        // Ensure user initiates their own update (check req.user.id from middleware)
        if (req.user.id !== id) return res.status(403).json({ message: "Access denied" });

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (occupation !== undefined) user.occupation = occupation;

        const updatedUser = await user.save();

        const userToSend = updatedUser.toObject();
        delete userToSend.password;

        res.status(200).json(userToSend);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* ROLE UPDATE */
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // should be 'student', 'faculty', 'admin', 'moderator'

        // Only admin or faculty can update roles
        if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
            return res.status(403).json({ message: "Access denied. Only admin or faculty can assign roles." });
        }

        const validRoles = ['student', 'faculty', 'admin', 'moderator'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role specified." });
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent faculty from demoting admins
        if (req.user.role === 'faculty' && user.role === 'admin') {
            return res.status(403).json({ message: "Access denied. Faculty cannot modify admin roles." });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: `User role updated to ${role}` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* SEARCH */
export const searchUsers = async (req, res) => {
    try {
        const { query } = req.params;
        // Search by username or rollNumber (case insensitive regex)
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: "i" } }, // Assuming username field exists, need to verify Model
                { rollNumber: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("-password"); // Exclude password

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
