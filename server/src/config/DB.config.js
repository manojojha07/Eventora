import mongoose from 'mongoose'

export const connectToDB = async() => {
try {
     await mongoose.connect(`proccess.env.MONGO_URI`);
         console.log(`Conected Successfully :) 🚀`);
} catch (error) {
    console.log(`Mongo Can't Connected :) ❌` )
}
}