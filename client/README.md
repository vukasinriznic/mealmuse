# 🍽️ MealMuse — Personal Meal Planning Companion

A full-stack web application for discovering recipes, planning weekly meals, and auto-generating shopping lists, built with React, Node.js, Express and PostgreSQL.

## 📋 Overview

MealMuse is a modern meal planning platform that helps users discover new recipes, save their favorites, organize weekly meals with a visual calendar, and automatically generate shopping lists based on their meal plan.

## ✨ Features

### 🔍 Recipe Discovery
- Search from thousands of recipes powered by Spoonacular API
- Filter by cuisine (Italian, Mexican, Asian, Mediterranean, American)
- Filter by diet (Vegetarian, Vegan, Gluten Free, Ketogenic)
- View detailed recipe information including ingredients and instructions

### ❤️ Favorites
- Save recipes to your personal favorites list
- Quick access to all saved recipes
- Remove recipes from favorites with one click

### 📅 Weekly Meal Planner
- Visual weekly calendar (Monday to Sunday)
- Plan Breakfast, Lunch and Dinner for each day
- Add recipes directly from search to any meal slot
- Remove meals from the planner

### 🛒 Shopping List
- Auto-generated shopping list based on your weekly meal plan
- Ingredients are automatically merged and quantities combined
- Check off items as you shop
- Visual progress tracker

### 👤 Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes — each user sees only their own data

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| External API | Spoonacular Food API |
| Auth | JWT + bcrypt |

## 🗄️ Database

Key models:
- `User` — registered users with hashed passwords
- `MealPlan` — meal entries linked to user, date, meal type and recipe ID
- `Favorite` — saved recipes per user

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Spoonacular API key (free at [spoonacular.com](https://spoonacular.com/food-api))

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/vukasinriznic/recipe-app.git
cd recipe-app

# 2. Install server dependencies
cd server
npm install

# 3. Install client dependencies
cd ../client
npm install
```

### Backend Setup
```bash
cd server
```

Create a `.env` file in the `server/` folder:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mealmuse"
PORT=5000
JWT_SECRET=your_jwt_secret_here
SPOONACULAR_API_KEY=your_spoonacular_api_key_here
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the backend server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup
```bash
cd client
npm run dev
```

Client runs on `http://localhost:5173`

## 📁 Project Structure
```
recipe-app/
├── client/                   # React frontend
│   ├── src/
│   │   ├── components/       # Navbar, Footer, RecipeModal
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Login, Register, Recipes, MealPlan, Favorites, ShoppingList
│   │   ├── services/         # API calls (axios)
│   │   └── types/            # TypeScript interfaces
│   └── ...
├── server/                   # Express backend
│   ├── src/
│   │   ├── controllers/      # authController, recipeController, mealPlanController
│   │   ├── middleware/        # JWT auth middleware
│   │   └── routes/           # auth, recipe, mealPlan routes
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── ...
└── README.md
```

## 👤 Author

Vukašin Riznić — [github.com/vukasinriznic](https://github.com/vukasinriznic)