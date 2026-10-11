import express  from 'express'
import { admin, protect } from '../middlware/authMiddlware.js';
import { sendOtpEmail } from '../utils/otpUtils.js';
import { bookEvent, cancelBooking, confirmBooking, getMyBooking } from '../controlllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/ ' , protect , bookEvent);

bookingRouter.post('/send-otp' , protect , sendOtpEmail);

bookingRouter.get('/my' , protect , getMyBooking);

bookingRouter.put('/:id/confirm ' , protect , admin , confirmBooking);

bookingRouter.delete('/ ' ,protect , cancelBooking);






export default bookingRouter;