# PetStory

A mobile app I built to help my mom's pet grooming shop manage its daily operations. This was my first time building something that someone would actually use in a real business.

## What It Does

The shop owner needed to:
- Look up customers quickly (we were using a paper notebook)
- Track who's checked in for grooming
- Record payments and see daily/monthly revenue
- Keep a history of each pet's visits

I built this app to solve those problems.

## The Stack

**Frontend:**
- React Native with Expo (so it works on both iPhone and Android)
- TypeScript 
- Expo Router for navigation

**Backend:**
- Node.js with Express
- MongoDB (first time using it)

## What I Learned

**Things I'd do differently:**
- I hardcoded the API URL (`http://192.168.4.20:3000`) which only works on my local network. Should use environment variables.
- No authentication - anyone can open the app and see everything. This is fine for now since only one person uses it on their device, but it's not production-ready.
- The image upload feature is stubbed out (pets just get default dog/cat images). I ran out of time to implement proper photo storage.

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

## Screenshots

### Dashboard
<img width="200" height="700" alt="dashboard" src="https://github.com/user-attachments/assets/86a9d506-a416-40ec-ac06-5349511b14d6" />

### Search
<img width="200" height="700" alt="search" src="https://github.com/user-attachments/assets/65a6dcb4-4daa-466d-8dec-22fd03e1cf69" />

### Pet Profile
<img width="200" height="700" alt="profile" src="https://github.com/user-attachments/assets/0277697b-0c0d-45a4-ac79-25dd00f94a9f" />

### Check in detail
<img width="200" height="700" alt="check in detail" src="https://github.com/user-attachments/assets/ae442456-411e-4918-90ed-85f045d5e670" />

### Active check in 
<img width="200" height="700" alt="active check in" src="https://github.com/user-attachments/assets/b3d44f57-80b6-44ca-8e1f-31beab05ab32" />

### Checkout
<img width="200" height="700" alt="check out" src="https://github.com/user-attachments/assets/d9f0cc8c-79cd-42e1-95df-ce3ab3eed998" />

### Reports
<img width="200" height="700" alt="reports" src="https://github.com/user-attachments/assets/fa6c1b85-4089-4227-bdfc-a2852954a5d7" />

## What's Missing

- Authentication/authorization
- Image uploads for pet photos
- Data backup (it's all local MongoDB right now)
- Proper error handling in a lot of places
- The UI works but isn't polished - some spacing is inconsistent
- No data validation on the frontend (relies entirely on backend)

## Why I Built This

My mom owns a small grooming shop and was tracking everything in a notebook. When customers called asking "when was Bella's last visit?", they had to flip through pages. I saw it as a chance to build something useful while learning React Native and MongoDB.

It's not perfect, but it works and what we use it every day.

## What I'm Working On Next

- Moving the database to MongoDB Atlas so it's not just local
- Adding a simple PIN code for security (user anth)
- Fixing the spacing issues in the UI
- Writing more tests
- adding multiple pets for the same customer
- hope I can do more faster with the search feature


