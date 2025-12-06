# PetStory

A mobile app I built to help my mom's pet grooming shop manage its daily operations. This was my first time building something that someone would actually use in a real business.

## What It Does

The shop owner needed to:
- Look up customers quickly (they were using a paper notebook)
- Track who's checked in for grooming
- Record payments and see daily/monthly revenue
- Keep a history of each pet's visits

I built this app to solve those problems.

## The Stack

**Frontend:**
- React Native with Expo (so it works on both iPhone and Android)
- TypeScript (I added this after getting bugs from typos in property names)
- Expo Router for navigation

**Backend:**
- Node.js with Express
- MongoDB (first time using it - I chose it because the data structure kept changing as I learned what the shop needed)

## What I Learned

**Things that went well:**
- The search feature works fast even with a few hundred customers
- Phone number formatting looks clean and handles different input formats
- The reports page accurately breaks down revenue by payment method (after I fixed a bug where I used `=` instead of `+=`)

**Things I'd do differently:**
- I hardcoded the API URL (`http://192.168.4.20:3000`) which only works on my local network. Should use environment variables.
- No authentication - anyone can open the app and see everything. This is fine for now since only one person uses it on their device, but it's not production-ready.
- The image upload feature is stubbed out (pets just get default dog/cat images). I ran out of time to implement proper photo storage.
- I wrote tests for the search page but didn't finish testing the rest. I know this is important but I was learning testing as I went.

**Bugs I fixed:**
- Payment totals were showing wrong because I was overwriting instead of accumulating (learned about reduce patterns)
- Date ranges weren't inclusive, so end-of-month reports missed the last day
- The check-in modal would disappear when you changed the search filter (moved it outside the conditional)

## How to Run It

**Backend:**
```bash
cd server
npm install
npm start
# Runs on port 3000
```

**Frontend:**
```bash
npm install
npx expo start
# Scan QR code with Expo Go app
```

**Note:** You need MongoDB running locally. I haven't set up a hosted database yet.

## Project Structure

```
app/(dashboard-tabs)/    # Main screens (dashboard, search, check-in, reports)
app/customer/           # New customer registration
app/pet/               # Pet profile and history
server/routes/         # API endpoints
server/models/         # MongoDB schemas
```

## What's Missing

- Authentication/authorization
- Image uploads for pet photos
- Data backup (it's all local MongoDB right now)
- Proper error handling in a lot of places
- The UI works but isn't polished - some spacing is inconsistent
- No data validation on the frontend (relies entirely on backend)

## Why I Built This

My mom owns a small grooming shop and was tracking everything in a notebook. When customers called asking "when was Bella's last visit?", they had to flip through pages. I saw it as a chance to build something useful while learning React Native and MongoDB.

It's not perfect, but it works and what we use it every day. That feels good.

## What I'm Working On Next

- Moving the database to MongoDB Atlas so it's not just local
- Adding a simple PIN code for security
- Fixing the spacing issues in the UI
- Writing more tests


