import express from "express";
import { createEvent, getEvents, rsvpEvent, deleteEvent } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/fileUpload.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getEvents);

/* POST */
/* POST */
router.post("/", verifyToken, upload.single("file"), createEvent);
router.delete("/:id", verifyToken, deleteEvent);

/* UPDATE */
router.patch("/:id/rsvp", verifyToken, rsvpEvent);

export default router;
