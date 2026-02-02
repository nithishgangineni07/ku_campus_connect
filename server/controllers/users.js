import User from "../models/User.js";

/* READ */
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
