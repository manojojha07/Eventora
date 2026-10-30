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
    try {
        // Development mode: inspect arguments safely
        if (process.env.NODE_ENV !== 'production') {
            console.log("OTP email arguments:", {
                userEmail,
                otp,
                type
            });
        }

        const title =
            type === 'account_verification'
                ? 'Verify your Eventora Account'
                : 'Event Booking Verification';

        const msg =
            type === 'account_verification'
                ? 'Please use the following OTP to verify your new Eventora account.'
                : 'Please use the following OTP to verify and confirm your event booking.';

        const mailOption = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: title,
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>${title}</h2>
                    <p>${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This code expires in 5 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOption);
        return true;

    } catch (error) {
        console.error("Error sending OTP email:", error.message);
        throw error;
    }
};

// export const sendOtpEmail = async (req, res) => {
//   try {
//     const email = req.user.email;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "User email not found",
//       });
//     }

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email, // Email string, NOT req
//       subject: "Your OTP",
//       text: `Your OTP is ${otp}`,
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (error) {
//     console.error("Send OTP error:", error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//     });
//   }
// };