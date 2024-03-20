import { v4 as uuidv4 } from 'uuid';
import { Server, StableBTreeMap, ic } from 'azle';
import express from 'express';

// Define types for Trip, Hotel, Booking, and Payment
interface Trip {
    id: string;
    destination: string;
    departureDate: Date;
    returnDate: Date;
    price: number;
}

interface Hotel {
    id: string;
    name: string;
    location: string;
    checkInDate: Date;
    checkOutDate: Date;
    pricePerNight: number;
}

interface Booking {
    id: string;
    tripId?: string;
    hotelId?: string;
    userId: string;
    paymentId?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

interface Payment {
    id: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
}

// Define types for User and UserRole
interface User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
}

type UserRole = 'admin' | 'customer';

// Initialize storage for trips, hotels, bookings, payments, and users
const tripsStorage = StableBTreeMap<string, Trip>(0);
const hotelsStorage = StableBTreeMap<string, Hotel>(1);
const bookingsStorage = StableBTreeMap<string, Booking>(2);
const paymentsStorage = StableBTreeMap<string, Payment>(3);
const usersStorage = StableBTreeMap<string, User>(4);

export default Server(() => {
    const app = express();
    app.use(express.json());

    // Middleware to check user role
    const checkUserRole = (role: UserRole) => {
        return (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const userId = req.headers['user-id'] as string;
            const user = usersStorage.get(userId).Some;
            if (!user || user.role !== role) {
                return res.status(403).json({ error: "Access denied" });
            }
            next();
        };
    };

    // Endpoints for managing trips
    app.post("/trips", checkUserRole('admin'), (req, res) => {
        const trip: Trip = { id: uuidv4(), ...req.body };
        tripsStorage.insert(trip.id, trip);
        res.json(trip);
    });

    app.get("/trips", (req, res) => {
        res.json(tripsStorage.values());
    });

    app.get("/trips/:id", (req, res) => {
        const tripId = req.params.id;
        const trip = tripsStorage.get(tripId).Some;
        if (!trip) {
            return res.status(404).json({ error: `Trip with id ${tripId} not found` });
        }
        res.json(trip);
    });

    // Endpoints for managing hotels
    app.post("/hotels", checkUserRole('admin'), (req, res) => {
        const hotel: Hotel = { id: uuidv4(), ...req.body };
        hotelsStorage.insert(hotel.id, hotel);
        res.json(hotel);
    });

    app.get("/hotels", (req, res) => {
        res.json(hotelsStorage.values());
    });

    app.get("/hotels/:id", (req, res) => {
        const hotelId = req.params.id;
        const hotel = hotelsStorage.get(hotelId).Some;
        if (!hotel) {
            return res.status(404).json({ error: `Hotel with id ${hotelId} not found` });
        }
        res.json(hotel);
    });

    // Endpoints for managing bookings
    app.post("/bookings", (req, res) => {
        const booking: Booking = { id: uuidv4(), ...req.body };
        bookingsStorage.insert(booking.id, booking);
        res.json(booking);
    });

    app.get("/bookings", (req, res) => {
        res.json(bookingsStorage.values());
    });

    app.get("/bookings/:id", (req, res) => {
        const bookingId = req.params.id;
        const booking = bookingsStorage.get(bookingId).Some;
        if (!booking) {
            return res.status(404).json({ error: `Booking with id ${bookingId} not found` });
        }
        res.json(booking);
    });

    app.put("/bookings/:id/cancel", (req, res) => {
        const bookingId = req.params.id;
        const booking = bookingsStorage.get(bookingId).Some;
        if (!booking) {
            return res.status(404).json({ error: `Booking with id ${bookingId} not found` });
        }
        // Update booking status to 'cancelled'
        booking.status = 'cancelled';
        bookingsStorage.insert(bookingId, booking);
        res.json(booking);
    });

    // Endpoints for managing payments
    app.post("/payments", (req, res) => {
        // Extract payment details from request body
        const { amount } = req.body;

        // Validate payment amount
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid payment amount" });
            }}

        app.get("/payments", (req, res) => {
            res.json(paymentsStorage.values());
        });
        
        app.get("/payments/:id", (req, res) => {
            const paymentId = req.params.id;
            const payment = paymentsStorage.get(paymentId).Some;
            if (!payment) {
                return res.status(404).json({ error: `Payment with id ${paymentId} not found` });
            }
            res.json(payment);
        });
        
        // Endpoints for managing users
        app.post("/users", checkUserRole('admin'), (req, res) => {
            const user: User = { id: uuidv4(), ...req.body };
            usersStorage.insert(user.id, user);
            res.json(user);
        });
        
        app.get("/users", checkUserRole('admin'), (req, res) => {
            res.json(usersStorage.values());
        });
        
        app.get("/users/:id", checkUserRole('admin'), (req, res) => {
            const userId = req.params.id;
            const user = usersStorage.get(userId).Some;
            if (!user) {
                return res.status(404).json({ error: `User with id ${userId} not found` });
            }
            res.json(user);
        });
        
        // Endpoint for user authentication
        app.post("/login", (req, res) => {
            const { username, password } = req.body;
            const user = Object.values(usersStorage.values()).find(u => u.username === username && u.password === password);
            if (!user) {
                return res.status(401).json({ error: "Invalid username or password" });
            }
            res.json(user);
        });
        
        return app.listen();
        