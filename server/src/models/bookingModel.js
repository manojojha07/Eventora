import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    eventId:{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Event',
     required: true
    },
    status: {
        type:String,
        enum: ['confirmed', 'pending' , 'cancelled'],
        default:'pending',
    },
    paymentStatus:{
        type:String,
        enum: ['paid' , 'non_paid'],
        default:'non_paid'
    },
    amount:{
        type:Number,
        required:true
    }
},{timestamps:true});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;