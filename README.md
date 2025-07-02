# Society Management System

> **Note:** This project is ready for GitHub. Sensitive environment variables (such as `.env` files) are not committed and are listed in `.gitignore`. Please create your own `.env` files as described below.

> **GitHub Setup:**
> 1. Fork or clone this repository.
> 2. Run `npm install` in both `backend` and `client` folders.
> 3. Create a `.env` file in the `backend` directory (see below for required variables).
> 4. Start the backend and frontend servers as described.

A comprehensive web application for managing residential society operations including bills, complaints, events, appointments, and more.

## 🚀 Features

### User Management
- User registration and authentication
- Profile management
- Role-based access (User/Admin/Super Admin)
- User activation/deactivation
- Permission-based access control

### Admin System
- **Super Admin**: Full system access with all permissions
- **Admin**: Role-based permissions for specific modules
- **User Management**: View, update roles, and manage user status
- **Store Management**: Add, edit, delete products and manage inventory
- **Event Management**: Create, update, and manage society events
- **Complaint Management**: Review and resolve user complaints
- **Bill Management**: Generate bills for all users automatically
- **Analytics Dashboard**: View system statistics and recent activity

### Bill Management
- Automatic bill generation based on house size
- Electricity, gas, and security bills
- Online bill payment with penalty calculation
- Payment history tracking

### Complaint System
- Submit complaints with categories
- Track complaint status (pending/resolved)
- View complaint history
- Admin review and resolution system

### Event Management
- Create and manage society events
- Event booking system
- Capacity management
- Event details and location tracking
- Free and paid ticket options

### Store System
- Product catalog
- Shopping cart functionality
- Order placement and tracking
- Inventory management
- Stock level monitoring

### Doctor Appointments
- Book appointments with society doctors
- View available doctors and specializations
- Appointment status tracking

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS-in-JS** - Styling

## 📁 Project Structure

```
OOP Project/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Authentication & admin middleware
│   ├── server.js       # Main server file
│   ├── createSuperAdmin.js # Admin creation script
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── api/        # API configuration
│   │   ├── App.js      # Main app component
│   │   └── index.js    # Entry point
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OOP Project
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/society_management
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

5. **Create Super Admin**
   ```bash
   cd backend
   npm run create-admin
   ```
   This creates a super admin with:
   - Username: `superadmin`
   - Password: `admin123`
   - All permissions granted

6. **Start the servers**

   **Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Frontend:**
   ```bash
   cd client
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👑 Admin System

### Admin Roles & Permissions

#### Super Admin
- Full system access
- All permissions enabled
- Can manage other admins
- System-wide analytics

#### Admin
- Role-based permissions
- Specific module access
- Limited to assigned areas

### Admin Permissions
- `manageUsers` - User management
- `manageEvents` - Event creation and management
- `manageStore` - Product and inventory management
- `manageComplaints` - Complaint review and resolution
- `manageBills` - Bill generation and management
- `manageAppointments` - Appointment management
- `viewReports` - Analytics and reporting

### Admin Features

#### Dashboard
- System overview with key metrics
- Recent activity monitoring
- Quick access to all admin functions

#### User Management
- View all users
- Update user roles and permissions
- Activate/deactivate users
- User status monitoring

#### Store Management
- Add new products
- Edit existing products
- Delete products
- Monitor inventory levels
- Track stock status

#### Event Management
- Create new events
- Set event details (date, location, capacity)
- Configure ticket types (free/paid)
- Manage event bookings
- Event status tracking

#### Complaint Management
- View all complaints
- Update complaint status
- Resolve complaints
- Track resolution time

#### Bill Management
- Generate bills for all users
- Automatic bill calculation
- Bulk bill generation

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/user/profile` - Get user profile

### Admin Endpoints
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/role` - Update user role
- `PUT /api/admin/users/:userId/deactivate` - Deactivate user
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:eventId` - Update event
- `DELETE /api/admin/events/:eventId` - Delete event
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:productId` - Update product
- `DELETE /api/admin/products/:productId` - Delete product
- `GET /api/admin/complaints` - Get all complaints
- `PUT /api/admin/complaints/:complaintId/status` - Update complaint status
- `POST /api/admin/bills/generate-all` - Generate bills for all users

### Bills
- `GET /api/bills` - Get user bills
- `POST /api/bills/:id/pay` - Pay bill

### Complaints
- `GET /api/complaints` - Get user complaints
- `POST /api/complaints` - Submit complaint

### Events
- `GET /api/events` - Get all events
- `POST /api/events/:eventId/book` - Book event

### Store
- `GET /api/products` - Get products
- `POST /api/orders` - Place order

### Appointments
- `GET /api/doctors` - Get available doctors
- `POST /api/appointments` - Book appointment

## 🎯 Usage

### For Regular Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your profile and access all features
3. **Bills**: View and pay your utility bills
4. **Complaints**: Submit and track complaints
5. **Events**: Browse and book society events
6. **Store**: Shop for products from the society store
7. **Appointments**: Book appointments with society doctors

### For Admins
1. **Login**: Use admin credentials
2. **Admin Panel**: Access comprehensive admin dashboard
3. **User Management**: Manage society members
4. **Store Management**: Control inventory and products
5. **Event Management**: Create and manage events
6. **Complaint Resolution**: Review and resolve complaints
7. **Bill Generation**: Generate bills for all users
8. **Analytics**: View system statistics and reports

## 🔧 Configuration

### House Size Categories
- 5 Marla: Base rate with 5% markup
- 10 Marla: Base rate with 10% markup  
- 20 Marla: Base rate with 15% markup

### Bill Types
- Electricity
- Gas
- Security

### Admin Access Levels
- **Super Admin**: Complete system control
- **Admin**: Module-specific permissions
- **User**: Standard member access

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Society Management System Team
- Muhammad Bilal
- Ab Rehman
- Aliya Ahsrif
- Najiba

## 🙏 Acknowledgments 
