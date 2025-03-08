# Project Setup

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize CLI](https://sequelize.org/master/manual/migrations.html)

## Installation

### 1️⃣ Install Dependencies
```sh
npm install
```

### 2️⃣ Setup Configuration
- Navigate to the `migrations/` folder.
- Copy `example.config.json` and rename it to `config.json`.
- Update `config.json` with your PostgreSQL credentials.

### 3️⃣ Run Migrations
From the **root** folder, navigate to the `migrations` folder and run:
```sh
npx sequelize-cli db:migrate
```

### 4️⃣ Setup Environment Variables
- Navigate to `src/config/`.
- Copy `.env.dev.example` and rename it to `.env.dev`.
- Update `.env.dev` with the appropriate values.

### 5️⃣ Start the Application
```sh
npm run dev
```

## Sequelize Setup (if not already installed)
If you haven't installed Sequelize CLI globally, install it with:
```sh
npm install --save-dev sequelize-cli
```

If Sequelize is not yet installed in the project, run:
```sh
npm install sequelize pg pg-hstore
```

## Running the Application
After completing the setup, start the application locally using:
```sh
npm run dev
```

Your API should now be running locally! 🚀

## API Documentation
For API endpoints and usage, refer to the Postman documentation:
[API Documentation](https://documenter.getpostman.com/view/19672801/2sAYdoEmwY)


