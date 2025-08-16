
# Casual Quizing

A full-stack quiz application built with Next.js, TypeScript, MongoDB, and Nodemailer. Users can take timed quizzes, receive results via email, and view their quiz history.

## Tech Stack
- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API routes
- **Database:** MongoDB
- **Email:** Nodemailer (SMTP)

## Features
- Timed quizzes (15 minutes)
- Multiple choice and boolean questions (Open Trivia API)
- Email-based user registration
- Quiz results sent via email
- Quiz history and statistics
- Dark/light theme toggle

## Setup Instructions
1. **Clone the repository:**
	```sh
	git clone <repo-url>
	cd casual_quizing
	```
2. **Install dependencies:**
	```sh
	npm install
	```
3. **Configure environment variables:**
	Create a `.env.local` file in the root directory:
	```env
	MONGODB_URI=mongodb://localhost:27017/quiz-app
	EMAIL_HOST=smtp.gmail.com
	EMAIL_PORT=587
	EMAIL_USER=your_email@gmail.com
	EMAIL_PASS=your_app_password
	EMAIL_FROM=Quiz App <your_email@gmail.com>
	```
4. **Run the development server:**
	```sh
	npm run dev
	```

## Environment Variables
See `.env.local` for required variables:
- `MONGODB_URI`: MongoDB connection string
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`: SMTP settings for email notifications

## Main Components
- `components/QuizPage.tsx`: Quiz UI, timer, answer selection, submission
- `components/QuizLandingPage.tsx`: Landing page
- `app/api/quiz/route.ts`: API for quiz submission, history, and email notifications

## API Endpoints
### `POST /api/quiz`
- Submit quiz results
- Request body: `{ email, score, totalQuestions, answers, timeTaken }`
- Saves results to MongoDB and sends email notification

### `GET /api/quiz?email=<email>&limit=<n>&page=<n>`
- Retrieve quiz history for a user
- Supports pagination

### `PUT /api/quiz`
- Update quiz result (if needed)

### `DELETE /api/quiz`
- Delete quiz result (admin only)

## Folder Structure
```
casual_quizing/
├── app/
│   ├── api/
│   │   └── quiz/
│   │       └── route.ts
│   └── page.tsx
├── components/
│   ├── QuizPage.tsx
│   └── QuizLandingPage.tsx
├── config/
│   └── database.ts
├── lib/
│   ├── mongodb.ts
│   └── types.ts
├── models/
│   └── User.ts
├── public/
│   └── *.svg
├── utils/
│   └── validation.ts
├── .env.local
├── package.json
├── README.md
└── ...
```

## License
MIT
