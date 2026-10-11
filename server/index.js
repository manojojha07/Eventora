import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectToDB } from './src/config/DB.config.js';
import authRouter from './src/routes/authRoutes.js';
import eventRouter from './src/routes/eventRoutes.js';
import bookingRouter from './src/routes/bookingRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
 
app.use(express.json());
app.use(cors());

app.get('/', (req , res) => {
    res.send("Working fine API");
});

//Routes
app.use('/api/auth' , authRouter);
app.use('/api/events' , eventRouter);
app.use('/api/bookings' , bookingRouter);


connectToDB();
app.listen(PORT , () => console.log(`server running on :)  http://loacalhost:${PORT}`));
