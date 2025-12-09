# 🏨 Booking System API

A robust, production-ready booking management system built with NestJS, featuring role-based access control, real-time availability checking, and comprehensive booking management capabilities.

## ✨ Features

- **🔐 JWT Authentication** - Secure token-based authentication with refresh token support
- **👥 Role-Based Access Control** - Three user roles (ADMIN, OWNER, GUEST) with granular permissions
- **🏠 Room Management** - Complete CRUD operations for room inventory
- **📅 Smart Booking System** - Prevent overlapping bookings with intelligent conflict detection
- **🔍 Advanced Filtering** - Search available rooms by date range, price, and capacity
- **📄 Pagination Support** - Efficient data retrieval with configurable page sizes
- **📚 Auto-Generated API Docs** - Interactive Swagger documentation
- **✅ Schema Validation** - Request validation using Zod schemas
- **🌱 Database Seeding** - Populate database with realistic test data using Faker

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for type-safe database access
- **Database**: [MySQL](https://www.mysql.com/) - Relational database
- **Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation
- **Authentication**: [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication
- **Password Hashing**: [Argon2](https://github.com/ranisalt/node-argon2) - Secure password hashing
- **Documentation**: [Swagger](https://swagger.io/) - OpenAPI specification
- **Testing Data**: [Faker](https://fakerjs.dev/) - Generate realistic test data

## 📋 Prerequisites

- Node.js >= 18.x
- MySQL >= 8.x
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd booking-system-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/booking_system"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1d"

# Application
PORT=3000
NODE_ENV="development"
```

### 4. Database Setup

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 5. Seed the Database (Optional)

Populate the database with test data:

```bash
npm run seed
```

This will create:
- 1 Admin user
- 2 Owner users
- 5 Guest users
- 10 Rooms with various capacities and prices
- Sample bookings

**Default Test Credentials:**
```
Admin:
  Email: admin@booking.com
  Password: Admin123!

Owner:
  Email: owner1@booking.com
  Password: Owner123!

Guest:
  Email: guest1@booking.com
  Password: Guest123!
```

### 6. Run the Application

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:3000/api
```

## 🔗 API Routes

### Authentication Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/sign-up` | Public | Register a new user |
| POST | `/auth/sign-in` | Public | Login and receive JWT token |

### User Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/user` | Admin | List all users |
| GET | `/user/:id` | Admin | Get user by ID |
| POST | `/user` | Admin | Create a new user |
| PATCH | `/user/:id` | Admin | Update user details |
| DELETE | `/user/:id` | Admin | Delete a user |

### Room Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/room` | All | List all rooms (paginated) |
| GET | `/room/available` | All | Search available rooms by date range, price, capacity |
| GET | `/room/:id` | All | Get room details |
| POST | `/room` | Admin, Owner | Create a new room |
| PATCH | `/room/:id` | Admin, Owner | Update room details |
| DELETE | `/room/:id` | Admin, Owner | Delete a room |

### Booking Routes

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/booking` | All | List bookings (filtered by role) |
| GET | `/booking/:id` | All | Get booking details |
| POST | `/booking` | Guest | Create a new booking |
| PATCH | `/booking/:id` | Admin, Owner | Confirm a booking |
| DELETE | `/booking/:id` | Guest, Admin, Owner | Cancel a booking |

## 🏗️ Project Structure

```
booking-system-api/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Prisma schema definition
│   └── seed.ts              # Database seeding script
├── src/
│   ├── auth/                # Authentication module
│   │   ├── decorators/      # Custom decorators (@IsPublic, @Roles, @User)
│   │   ├── guards/          # Auth guards (JWT, Roles)
│   │   └── strategies/      # Passport strategies
│   ├── booking/             # Booking module
│   │   ├── dto/             # Data transfer objects
│   │   └── booking.service.ts
│   ├── room/                # Room module
│   │   ├── dto/             # Data transfer objects
│   │   └── room.service.ts
│   ├── user/                # User module
│   │   ├── dto/             # Data transfer objects
│   │   └── user.service.ts
│   ├── common/              # Shared utilities
│   │   ├── pipes/           # Custom pipes (ZodValidationPipe)
│   │   └── filters/         # Exception filters
│   ├── prisma/              # Prisma service
│   │   └── prisma.service.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── .env                     # Environment variables
├── .env.example             # Environment template
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🔑 Authentication & Authorization

### JWT Token

After successful login, you'll receive a JWT token:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Include this token in subsequent requests:

```
Authorization: Bearer <your-token>
```

### User Roles

- **ADMIN**: Full system access, user management
- **OWNER**: Room management, booking confirmation
- **GUEST**: Create and cancel own bookings

## 🎯 Key Features Explained

### Overlap Prevention

The booking system automatically prevents double-bookings by checking for conflicts:
- Validates date ranges before creating bookings
- Returns clear error messages when conflicts are detected
- Ensures data integrity at the database level

### Available Rooms Filter

Search for rooms based on multiple criteria:
```
GET /room/available?checkIn=2024-01-01&checkOut=2024-01-05&minPrice=50&maxPrice=200&capacity=2
```

### Pagination

List endpoints support pagination:
```
GET /room?page=1&limit=10
```

## 📝 Example Requests

### Sign Up

```bash
curl -X POST http://localhost:3000/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "role": "GUEST"
  }'
```

### Create a Booking

```bash
curl -X POST http://localhost:3000/booking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "roomId": 1,
    "checkIn": "2024-06-01",
    "checkOut": "2024-06-05"
  }'
```

### Search Available Rooms

```bash
curl -X GET "http://localhost:3000/room/available?checkIn=2024-06-01&checkOut=2024-06-05&capacity=2"
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔧 Available Scripts

```bash
npm run start          # Start the application
npm run start:dev      # Start in development mode with hot-reload
npm run start:prod     # Start in production mode
npm run build          # Build the application
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint
npm run seed           # Seed the database
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
```

## 🐳 Docker Support (Optional)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop containers
docker-compose down
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name - [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- All contributors who help improve this project

---

**Built with ❤️ using NestJS**