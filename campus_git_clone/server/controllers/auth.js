import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role
        });

        const savedUser = await newUser.save();

        // Create token
        const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Remove password from response
        const userToSend = savedUser.toObject();
        delete userToSend.password;

        res.status(201).json({ token, user: userToSend });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGGING IN */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        const userToSend = user.toObject();
        delete userToSend.password;

        res.status(200).json({ token, user: userToSend });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
