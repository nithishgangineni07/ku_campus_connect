import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected");

        const adminEmail = "admin@campusconnect.com";
        const adminPassword = "adminpassword123";
        const adminRoll = "0000000000";

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("⚠ Admin already exists. Ensuring role is admin...");

            existingAdmin.role = "admin";
            await existingAdmin.save();

            console.log("✅ Admin role verified/updated");
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const newAdmin = new User({
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                rollNumber: adminRoll,
                role: "admin",
            });

            await newAdmin.save();

            console.log("✅ Admin user seeded successfully");
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
        }

        await mongoose.disconnect();
        console.log("🔌 MongoDB disconnected");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error seeding admin:", err.message);
        process.exit(1);
    }
};

seedAdmin();