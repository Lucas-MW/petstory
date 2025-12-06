# Pet Grooming Management App

A mobile application for managing a dog grooming business, built for my mom's grooming shop.

## Problem Statement

My mom runs a small dog grooming business and was tracking everything on paper. Her main challenges were:
- Finding customer records quickly (she remembers dogs by name, not owners)
- Tracking daily revenue
- Recording visit history for pricing consistency

## Solution

A mobile-first app that lets her:
- Search pets by name with instant results
- Check in dogs with service selection
- Complete checkouts with tip and payment tracking
- View daily/monthly/yearly revenue reports
- Auto-fill prices based on visit history

## Tech Stack

**Frontend:**
- React Native / Expo
- TypeScript
- React Navigation

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose

**Cloud Services:**
- Railway (backend hosting)
- MongoDB Atlas (database)

## Key Features

- **Pet-first search**: Optimized for searching by pet name rather than owner
- **Quick check-in flow**: Reduced processing time from 5 minutes to 30 seconds
- **Automated pricing**: Auto-fills prices based on pet's visit history
- **Revenue tracking**: Real-time daily revenue with payment method breakdown
- **Tax-ready reports**: Generate reports for any date range for tax purposes

## Database Schema

- **Customers**: Owner information
- **Pets**: Pet profiles linked to owners
- **DailyHistory**: Completed visits with pricing and payment details
- **CheckIns**: Active grooming sessions

## Screenshots

[Add your 5 screenshots here]

## Future Enhancements

- Photo upload for before/after grooming
- SMS notifications when pet is ready
- Online booking system
- Inventory management for grooming supplies
- Customer loyalty/rewards program

## Installation
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npx expo start
```

## Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

