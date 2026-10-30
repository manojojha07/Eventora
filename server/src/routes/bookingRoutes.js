import express  from 'express'
import { admin, protect } from '../middlware/authMiddlware.js';
import { bookEvent, cancelBooking, confirmBooking, getMyBookings, sendBookingOTP } from '../controlllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/' , protect , bookEvent);

bookingRouter.post('/send-otp', protect, sendBookingOTP);

bookingRouter.get('/my' , protect , getMyBookings);

bookingRouter.put('/:id/confirm' , protect , admin , confirmBooking);

bookingRouter.delete('/:id' ,protect , cancelBooking);






export default bookingRouter;