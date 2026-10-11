import express from 'express'
import { admin, protect } from '../middlware/authMiddlware.js';
import {
     createEvent,
     deleteEvent,
     getAllEvents,
     getEventById,
     updateEvent
} from '../controlllers/eventController.js';

const eventRouter = express.Router();


eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', protect, getEventById);

eventRouter.post('/', protect, admin, createEvent);
eventRouter.put('/:id', protect, admin, updateEvent);

eventRouter.delete('/:id', protect, admin, deleteEvent);



export default eventRouter;