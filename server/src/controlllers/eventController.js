




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
            imageUrl
        } = req.body;


        // create event on database
        const event = new Event.create({
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl,
        });

        return res.status(200).json({
            success: true,
            message: "Event created successfully,"
        })

    } catch (error) {
        console.log("Error by create Event");
        return res.status(500).json({
            success: false,
            message: "Internal serverr error"
        });
    }
}

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

        const event = await findByIdAndUpdate(id, {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        },{new:true});
        
        if(!event){
            return res.status(404).json({
                success:false,
                message:"Event not found,"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Event updated successfully,",
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
            filters.location = req.query.location
        }

        const events = await Event.find({ filters }); //.limit(10)

        return res.status(200).json({
            success: true,
            events
        })
    } catch (error) {
        console.log("Error while getting all Events ");
        return res.status(500).json({
            success: false,
            message: "Internal serverr error"
        });
    }
}

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