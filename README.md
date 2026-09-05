# 🦷 Tooothy

### Smart, simple dental appointment scheduling for modern clinics.

**Tooothy** is a web-based dental clinic scheduling system designed to make booking appointments simple for patients and manageable for dental clinics.

Built initially for **SmileHaos Dental Clinic** in Iba, Zambales, Tooothy is being developed with a focus on simplicity, mobile responsiveness, and a clean patient experience.

---

## 🚀 What is Tooothy?

Tooothy helps dental clinics move away from complicated appointment processes and gives patients a simple way to:

* 🦷 Browse available dental services
* 📅 Choose an appointment date
* ⏰ Select an available time
* 👤 Provide patient information
* 📝 Submit an appointment request
* 🔎 Track appointment status
* 📱 Book conveniently from mobile devices

For clinic staff, Tooothy provides an administration area for managing appointments, services, schedules, and blocked dates.

---

## ✨ Features

### Patient Booking

* Multi-step appointment booking
* Multiple dental services per appointment
* Automatic appointment duration calculation
* Automatic appointment price calculation
* Date availability checking
* Time-slot generation
* Closed-date handling
* Sunday/clinic schedule handling
* Patient information collection
* Appointment confirmation
* Appointment tracking number
* Appointment status tracking

### 🏥 Clinic Administration

* Secure admin login
* Appointment management
* Appointment details drawer
* Appointment status management
* Service management
* Clinic schedule management
* Blocked/closed dates
* Clinic settings

### 🎨 Patient Experience

* Clean and modern UI
* Fully responsive design
* Mobile-first booking experience
* Clinic information
* Dentist profile
* Service showcase
* Simple booking flow
* Google Maps directions
* Optimized clinic landing page

---

## 🏗️ Tech Stack

### Frontend

* **React**
* **TypeScript**
* **Vite**
* **Mantine UI**
* **Mantine Dates**

### Backend / Cloud

* **Firebase**
* **Cloud Firestore**
* **Firebase Authentication**
* **Firebase Hosting**
* **Firebase Cloud Functions**

### Development

* **Node.js**
* **npm**
* **Git**
* **GitHub**

---

## 📁 Project Structure

```text
tooothy/
│
├── public/
│   ├── images/
│   └── ...
│
├── src/
│   ├── app/
│   │   ├── AppRouter.tsx
│   │   └── theme.ts
│   │
│   ├── components/
│   │   ├── Brand.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── features/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   │
│   │   ├── booking/
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   └── services/
│   │       ├── data/
│   │       └── types/
│   │
│   ├── layouts/
│   │   └── PublicLayout.tsx
│   │
│   ├── lib/
│   │   └── firebase.ts
│   │
│   ├── pages/
│   │   ├── AdminLoginPage.tsx
│   │   └── HomePage.tsx
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── functions/
│   └── src/
│       └── index.ts
│
├── scripts/
│   └── seedServices.mjs
│
├── firestore.rules
├── firebase.json
├── package.json
└── README.md
```

---

## 🖥️ Main Pages

### Public Website

```text
/
```

The clinic landing page containing:

* Clinic introduction
* Dental services
* Dentist information
* How booking works
* Appointment CTA

### Booking

```text
/book
```

Patient appointment booking flow.

### Appointment Tracking

```text
/appointment-status
```

Used to check the status of an appointment.

### Admin

```text
/admin/login
/admin/dashboard
/admin/appointments
/admin/schedule
/admin/services
/admin/settings
```

Clinic administration area.

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/riankmviloria/tooothy.git
```

Enter the project:

```bash
cd tooothy
```

### 2. Install dependencies

```bash
npm install
```

Install Firebase Functions dependencies:

```bash
cd functions
npm install
cd ..
```

### 3. Start the development server

```bash
npm run dev
```

Vite will provide a local development URL, usually:

```text
http://localhost:5173
```

---

## 🔥 Firebase

Tooothy uses Firebase for cloud services.

The project currently uses:

* Firebase Hosting
* Cloud Firestore
* Firebase Authentication
* Cloud Functions

Firebase configuration is managed through:

```text
.firebaserc
firebase.json
firestore.rules
```

### Firebase project

```text
tooothy-smilehaos
```

Production website:

```text
https://tooothy-smilehaos.web.app
```

---

## 🗄️ Firestore

The application uses Firestore to manage application data such as:

* Appointments
* Services
* Clinic schedules
* Blocked dates
* Clinic settings

Firestore security rules are maintained in:

```text
firestore.rules
```

---

## 🧪 Development

Run the application:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🚀 Deployment

The frontend can be deployed to Firebase Hosting.

Build the application:

```bash
npm run build
```

Then deploy:

```bash
firebase deploy
```

Or deploy only Hosting:

```bash
firebase deploy --only hosting
```

Cloud Functions can be deployed with:

```bash
firebase deploy --only functions
```

---

## 🔐 Environment Variables

Environment-specific configuration should **never be committed to GitHub**.

Local environment files are ignored through `.gitignore`.

Example:

```text
.env
.env.local
.env.*.local
```

If environment variables are required, create a local `.env.local` file.

Do not commit:

* API keys
* Private credentials
* Service account keys
* Passwords
* Authentication secrets

---

## 🦷 SmileHaos Dental Clinic

Tooothy is currently being developed for:

**SmileHaos Dental Clinic**

📍 JRM Building, Unit 303
G-916 Palanginan
Iba, Zambales
In front of LTO

📞 **0927 239 3075**

🕘 **9:00 AM – 6:00 PM, Monday–Sunday**

---

## 🎯 Project Goals

Tooothy started as a simple scheduling system for a single dental clinic.

The long-term vision is to evolve it into a flexible platform that can support multiple dental clinics while keeping the experience simple for both patients and dentists.

### Current

```text
One clinic
      ↓
Online booking
      ↓
Appointment management
      ↓
Clinic administration
```

### Future

```text
Multiple Clinics
       ↓
       Tooothy
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Clinic Clinic Clinic
  A     B     C
```

Potential future features include:

* Multi-clinic support
* Dentist profiles
* Patient accounts
* SMS notifications
* Email notifications
* Online payments
* Automated reminders
* Treatment history
* Dental records
* Analytics and reporting
* Mobile application
* Subscription plans for clinics

---

## 🛠️ Development Philosophy

Tooothy follows a few simple principles:

### Keep it simple

Patients shouldn't need instructions to book a dental appointment.

### Mobile first

A large percentage of patients will access the system from their phones, so mobile usability is a priority.

### Clinic friendly

The system should reduce administrative work rather than create more of it.

### Maintainable code

Features are organized by domain so the application can grow without becoming difficult to maintain.

### Build for the real world

Features are prioritized based on actual clinic workflows and patient needs.

---

## 📌 Current Status

🚧 **Active Development**

Tooothy is currently under active development.

The core booking and clinic management architecture is already in place, while the user experience, mobile responsiveness, and production workflows continue to be refined.

---

## 📜 License

This project is currently private and intended for development and internal use.

---

## ⚡ Built with Tooothy

Made with ❤️, ☕, and a lot of debugging.

**Tooothy — making dental appointments a little easier.** 🦷⚡
