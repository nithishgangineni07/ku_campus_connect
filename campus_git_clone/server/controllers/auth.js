import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const { rollNumber, name, email, password, role, department } = req.body;

        // Validation based on Role
        if (role === 'student') {
            if (!rollNumber) {
                return res.status(400).json({ error: "Roll number is required for students." });
            }
            if (rollNumber.length !== 10) {
                return res.status(400).json({ error: "Roll number must be exactly 10 characters." });
            }
            // Check 3rd, 4th, 5th chars are "567" (indices 2, 3, 4)
            if (rollNumber.substring(2, 5) !== "567") {
                return res.status(400).json({ error: "Invalid College Code. Roll number must contain '567' at the 3rd, 4th, and 5th positions." });
            }
        }

        // Department Validation
        if (!department || (Array.isArray(department) && department.length === 0)) {
            return res.status(400).json({ error: "Please select at least one department." });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            rollNumber: role === 'student' ? rollNumber : undefined,
            email,
            password: passwordHash,
            role,
            department
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

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate token
        const token = crypto.randomBytes(20).toString('hex');

        // Set token and expiry (15 mins)
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset | Campus Connect',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process within 15 minutes:\n\n` +
                `http://localhost:5173/reset-password/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                console.error('Error sending email: ', err);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                return res.status(200).json({ message: "Recovery email sent" });
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Password reset token is invalid or has expired." });

        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
