# Chalapao

**Chalapao** is a platform that allows people to rent out their belongings to others. Whether you have tools, electronics, or other valuable items sitting unused, Chalapao enables you to share them with those in need while earning extra income.

## Features

* **Item Listings** – Users can list their items for rent with images, descriptions, and pricing.
* **Secure Payments** – Integrated payment system to ensure smooth transactions.
* **Booking System** – Schedule rental periods and manage reservations.
* **User Reviews** – Renters and owners can rate and review each other.
* **Location-Based Search** – Find rental items near your location.

## Requirements for Developers

### 1. Install Docker Compose

Chalapao uses Docker to manage services efficiently. Install Docker Compose by following the official guide:

* Docker Compose Installation

### 2. Setup Environment Variables

Both the frontend and backend require environment variables. Follow the instructions in the Environment Variables Wiki to configure your `.env` files.

## Backend Setup

### 1. Install **Deno**

```
curl -fsSL https://deno.land/x/install/install.sh | sh
```

or refer to the Deno Installation Guide.

### 2. Run the backend

```
deno task start
```

## Frontend Setup

### 1. Install **pnpm**

```
npm install -g pnpm
```

### 2. Install dependencies

```
pnpm install
```

### 3. Start the frontend

```
pnpm run dev
```

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Make sure to follow best practices and test your code before pushing.

## License

This project is licensed under the MIT License.
