import nodemailer from 'nodemailer';
import 'dotenv/config'


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);





const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
transporter.verify()
    .then(() => {
        console.log("Gmail SMTP connected successfully! ✅");
    })
    .catch((error) => {
        console.error("Gmail SMTP error:", error.message);
    });

export const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        //await transporter.sendMail({
        const mailOption = ({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hi ${userName},</h2>

                    <p>
                        Your booking for the event
                        <strong>${eventTitle}</strong>
                        has been successfully confirmed.
                    </p>

                    <p>Thank you for choosing Eventora.</p>
                </div>
            `,
        });
                await transporter.sendMail(mailOption);


        console.log(`Booking confirmation email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
        throw error;
    }
};

export const sendOtpEmail = async (userEmail, otp, type) => {
     if (process.env.NODE_ENV !== 'production') {
         console.log(`OTP for ${userEmail}: ${otp}`);
         return true;
     } 
    try {
        const title =
            type === 'account_verification'
                ? 'Verify your Eventora Account'
                : 'Event Booking Verification';

        const msg =
            type === 'account_verification'
                ? 'Please use the following OTP to verify your new Eventora account.'
                : 'Please use the following OTP to verify and confirm your event booking.';

           const mailOption = ({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    
                    <h2 style="color: #000;">
                        ${title}
                    </h2>

                    <p style="color: #555; font-size: 16px;">
                        ${msg}
                    </p>

                    <div style="
                        margin: 20px auto;
                        padding: 15px;
                        font-size: 24px;
                        font-weight: bold;
                        background: #f4f4f4;
                        width: max-content;
                        letter-spacing: 5px;
                    ">
                        ${otp}
                    </div>

                    <p style="color: #999; font-size: 12px;">
                        This code expires in 5 minutes.
                        If you didn't request this, please ignore this email.
                    </p>

                </div>
            `,
        });
                await transporter.sendMail(mailOption);

    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};
