import express from "express";
import { createEvent, getEvents, rsvpEvent } from "../controllers/events.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getEvents);

/* CREATE */
router.post("/", verifyToken, createEvent);

/* UPDATE */
router.patch("/:id/rsvp", verifyToken, rsvpEvent);

export default router;
