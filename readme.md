# Travel Booking Management System Canister

This Canister provides backend functionality for a Travel Booking Management System. It allows users to book trips, hotels, manage bookings, make payments, and manage users.

## Endpoints

### Trips

- `POST /trips`: Create a new trip.
- `GET /trips`: Get all trips.
- `GET /trips/:id`: Get a specific trip by ID.

### Hotels

- `POST /hotels`: Create a new hotel.
- `GET /hotels`: Get all hotels.
- `GET /hotels/:id`: Get a specific hotel by ID.

### Bookings

- `POST /bookings`: Create a new booking.
- `GET /bookings`: Get all bookings.
- `GET /bookings/:id`: Get a specific booking by ID.
- `PUT /bookings/:id/cancel`: Cancel a booking by ID.

### Payments

- `POST /payments`: Create a new payment.
- `GET /payments`: Get all payments.
- `GET /payments/:id`: Get a specific payment by ID.

### Users

- `POST /users`: Create a new user (admin only).
- `GET /users`: Get all users (admin only).
- `GET /users/:id`: Get a specific user by ID (admin only).

### Authentication

- `POST /login`: Authenticate a user.

## Usage

1. Clone the repository.
2. Install dependencies with ```npm install```.
3. Install dfx
4. ```DFX_VERSION=0.15.0 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)```
5. ```dfx start --background```

