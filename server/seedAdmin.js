import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");

        const adminEmail = "admin@campusconnect.com";
        const adminPassword = "adminpassword123";
        const adminRoll = "0000000000";

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin already exists. Updating role...");
            existingAdmin.role = "admin";
            await existingAdmin.save();
            console.log("Admin updated");
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            const newAdmin = new User({
                username: "Admin",
                email: adminEmail,
                password: hashedPassword,
                rollNumber: adminRoll,
                role: "admin"
            });

            await newAdmin.save();
            console.log("Admin user seeded successfully");
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
};

seedAdmin();
