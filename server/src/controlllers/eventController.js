
import Event from "../models/eventModel.js";




export const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            image
        } = req.body;

        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats: availableSeats ?? totalSeats,
            ticketPrice,
            image: image || '',
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });

    } catch (error) {
        console.error('Create event error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// export const createEvent = async (req, res) => {
//     try {
//         const {
//             title,
//             description,
//             date,
//             location,
//             category,
//             totalSeats,
//             availableSeats,
//             ticketPrice,
//             image
//         } = req.body;


//         // create event on database
//         const event = await Event.create({
//             title,
//             description,
//             date,
//             location,
//             category,
//             totalSeats,
//             availableSeats,
//             ticketPrice,
//             image: image || ' ',
//             createdBy: req.user.id
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Event created successfully,",
//             event
//         })

//     } catch (error) {
//         console.log("Status:", error.response?.status);
//         console.log("Backend error:", error.response?.data);
//         console.log("Full error:", error);
//     }
// }

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        } = req.body;

        const event = await Event.findByIdAndUpdate(id, {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        }, { new: true });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found,"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully,",
            event
        });

    } catch (error) {
        console.log("Error by create Event");
        return res.status(500).json({
            success: false,
            message: "Internal serverr error"
        });
    }
}


export const getAllEvents = async (req, res) => {
    try {
        const filters = {};

        if (req.query.category) {
            filters.category = req.query.category;
        }

        if (req.query.location) {
            filters.location = req.query.location;
        }

        const events = await Event.find(filters);

        return res.status(200).json({
            success: true,
            events
        });

    } catch (error) {
        console.log("Error while getting all events:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const exists = await Event.findById(id);
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        return res.status(200).json({
            success: true,
            exists
        })

    } catch (error) {
        console.log("Error on GET EventById ");
        return res.status(500).json({
            success: false,
            message: "Internal serverr error"
        });
    }
}

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await Event.findByIdAndDelete(id);
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Event delete successfully."
        })

    } catch (error) {
        console.log("Error on DELETE Event by ID ");
        return res.status(500).json({
            success: false,
            message: "Internal serverr error"
        });
    }
}