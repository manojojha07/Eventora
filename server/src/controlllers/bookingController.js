import Booking from "../models/bookingModel.js";
import OTP from '../models/otpModel.js'
import Event from '../models/eventModel.js'
import { sendBookingEmail, sendOtpEmail } from "../utils/otpUtils.js";


const genrateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendBookingOTP = async (req, res) => {

    const otp = genrateOtp();
    await OTP.findOneAndDelete({ email: req.user.email, action: "event_booking" });
    await OTP.create({ email: req.user.email, otp: otp, action: "event_booking" });
    await sendOtpEmail(req.user.email, otp, 'event_booking');
    res.json({ message: "OTP sent to email" });
}

export const bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const otpRecord = await OTP.findOne({ email: req.user.email, otp, action: "event_booking" });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            })
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(400).json({
                success: false,
                messsage: "Event not found"
            })
        }
        if (event.totalSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: "No Seats availble"
            })
        }

        const existsBooking = await Booking.findOne({ userId: req.user._id, eventId });
        if (existsBooking) {
            return res.status(400).json({
                success: false,
                message: "You have already booked this event"
            })
        }

        const booking = await Booking.create({
            userId: req.user._id,
            eventId,
            status: 'pending',
            paymentStatus: 'non-paid',
            amount: event.ticketPrice
        });

        await OTP.deleteMany({ email: req.user.email, action: 'event_booking' });
        /*await sendBookingEmail({
            email: req.user.email, title: event.title,
            bookingId: booking._id,
        }); */
        return res.status(200).json({
            success: true,
            message: "Booking created. Please check your email for confirmation"
        })



    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error "
        });
    }
}

export const confirmBooking = async (req, res) => {
    try {
        const paymentStatus = req.body.paymentStatus;
        if(!['paid', 'non_paid'].includes(paymentStatus)){
            return res.status(400).json({
                success:false,
                message:"Invalid payment status"
            })
        }
        const booking = await Booking.findById(req.params.id).populate('eventId');
        if(!booking){
            return res.status(400).json({
                success:false,
                message:"Booking not found"
            })
        }
        if(booking === 'confirmed'){
            return res.status(400).json({
                success:false,
                message:"Booking is already confirmed"
            });
        }

        const event = await Event.findById(booking.eventId._id);
        if(event.totalSeats <= 0){
            return res.status(400).json({
                success:false,
                message:"No seats availble"
            })
        }

        booking.status = 'confirmed';
        if(paymentStatus){
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        event.totalSeats -= 1;
        await event.save();
        await sendBookingEmail(req.user.email, event.title, booking._id);
        return res.status(200).json({
            success:true,
            message:"Booking confirmed"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error "
        });
    }
}

export const getMyBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const bookings = await Booking.findById(id);
        if (!bookings) {
            return res.status(400).json({
                success: false,
                message: "You cannot make a booking at this time."
            })
        }

        return res.status(200).json({
            success: true,
            bookings
        })
    } catch (error) {
        console.log("Error on getMyBooking")
        return res.status(500).json({
            success: false,
            message: "Internal server error "
        });
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await Booking.findByIdAndDelete(id).populate('eventId');
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        if(exists.userId.toString() !== req.user._id.toString()){
            return res.status(403).json({
                success:false,
                message:"Unautorized"
            });
        }
        exists.status = 'cancelled'
        await exists.save();

        if(exists.status === 'confirmed'){
         const event = await Event.findById(exists.eventId._id);
         event.totalSeats += 1;
         await event.save();
        }

        await exists.remove();
        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully.,"
        })
    } catch (error) {

        console.log("Error on CancelBooking :) ")

        return res.status(500).json({
            success: false,
            message: "Internal server error "
        });
    }
}


