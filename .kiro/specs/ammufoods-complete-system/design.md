# AMMUFOODS - Complete Business Management System Design

## Overview

The AMMUFOODS system is a full-stack web application designed to streamline operations for a home-based food manufacturing business. The system manages daily shop orders, event catering requests, inventory, shop partnerships, and provides comprehensive business analytics.

**Key Design Principles**:
- Mobile-first responsive design
- Role-based access control (PUBLIC, USER, SHOP, ADMIN)
- Real-time data updates
- Unified authentication (same email = same account)
- Production-ready quality and reliability
- Scalable architecture for business growth

**Technology Stack**:
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **Frontend**: React, React Router, Axios
- **Authentication**: Google OAuth 2.0, JWT, bcrypt
- **Image Storage**: Cloudinary
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Backend on Render, Frontend on Vercel

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           React SPA (Vercel)                         │  │
│  │  - Public Pages (Landing, Products, About)           │  │
│  │  - User Pages (Event Orders, Shop Request)           │  │
│  │  - Shop Pages (Daily Orders, History)                │  │
│  │  - Admin Pages (Dashboard, Management, Analytics)    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Express.js Server (Render)                   │  │
│  │  - Authentication Middleware                         │  │
│  │  - Role-based Authorization                          │  │
│  │  - Request Validation                                │  │
│  │  - Rate Limiting                                     │  │
│  │  - Error Handling                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                     │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ Auth Service │ Order Service│ Notification Service │    │
│  ├──────────────┼──────────────┼──────────────────────┤    │
│  │ Shop Service │ Event Service│ Email Service        │    │
│  ├──────────────┼──────────────┼──────────────────────┤    │
│  │ Product Svc  │ Analytics Svc│ Image Service        │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Mongoose ODM                            │  │
│  │  - Schema Definitions                                │  │
│  │  - Validation Rules                                  │  │
│  │  - Query Builders                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │  MongoDB     │  Cloudinary  │  Google OAuth        │    │
│  │  Atlas       │  CDN         │  API                 │    │
│  ├──────────────┼──────────────┼──────────────────────┤    │
│  │  Gmail SMTP  │              │                      │    │
│  │  (Nodemailer)│              │                      │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

**Authentication Flow**:
1. User initiates login (Google OAuth or Email/Password)
2. Backend validates credentials
3. JWT token generated and returned
4. Frontend stores token in localStorage
5. Token included in Authorization header for subsequent requests
6. Middleware validates token and extracts user role
7. Role-based authorization checks before route access

**Daily Order Flow**:
1. Shop user submits order for tomorrow
2. Backend validates date (must be tomorrow only)
3. Order saved to database
4. Email notification sent to admin
5. In-app notification created for admin
6. Admin views order in dashboard manufacturing plan
7. Admin updates order status as manufacturing progresses
8. Email notification sent to shop on status change
9. Shop views updated status in order history

---

## Components and Interfaces

### Backend Components

#### 1. Authentication Module

**Purpose**: Handle user authentication and authorization

**Components**:
- `authController.js` - Authentication endpoints
- `authMiddleware.js` - JWT validation and role checking
- `googleOAuth.js` - Google OAuth integration
- `unifiedAuth.js` - Unified authentication logic

**Key Functions**:
```javascript
// Register new user with email/password
async function registerUser(email, password, name)
  Input: email (string), password (string), name (string)
  Output: { user, token } or error
  
// Login with email/password
async function loginUser(email, password)
  Input: email (string), password (string)
  Output: { user, token } or error
  
// Google OAuth callback
async function googleAuthCallback(googleProfile)
  Input: googleProfile (object with email, name, googleId)
  Output: { user, token } or error
  
// Verify JWT token
function verifyToken(token)
  Input: token (string)
  Output: decoded user object or error
  
// Check user role
function checkRole(requiredRole)
  Input: requiredRole (string: 'USER', 'SHOP', 'ADMIN')
  Output: middleware function that allows/denies access
```

**Unified Authentication Logic**:
- Check if user exists by email
- If exists: merge authentication methods (add Google ID if missing)
- If new: create user with provided method
- Maintain single user record per email
- Preserve highest role (ADMIN > SHOP > USER)

#### 2. Order Management Module

**Purpose**: Handle daily shop orders

**Components**:
- `orderController.js` - Order CRUD operations
- `orderService.js` - Business logic for orders
- `orderValidation.js` - Order validation rules

**Key Functions**:
```javascript
// Create daily order (SHOP only)
async function createDailyOrder(shopId, products, deliveryDate)
  Input: shopId (ObjectId), products ([{productId, quantity}]), deliveryDate (Date)
  Output: order object or error
  Validation: deliveryDate must be tomorrow only
  
// Get manufacturing plan for date
async function getManufacturingPlan(date)
  Input: date (Date)
  Output: { productTotals: [{productId, productName, totalQuantity}] }
  
// Get shop-wise packing list for date
async function getPackingList(date)
  Input: date (Date)
  Output: [{ shopId, shopName, products: [{name, quantity}], address, contact, deliveryTime }]
  
// Update order status
async function updateOrderStatus(orderId, newStatus)
  Input: orderId (ObjectId), newStatus (string)
  Output: updated order or error
  Side effect: Send email notification to shop
  
// Get shop order history
async function getShopOrderHistory(shopId, filters)
  Input: shopId (ObjectId), filters (object)
  Output: [order] sorted by date descending
```

#### 3. Event Order Module

**Purpose**: Handle event/catering requests

**Components**:
- `eventController.js` - Event order endpoints
- `eventService.js` - Event order business logic

**Key Functions**:
```javascript
// Create event request
async function createEventRequest(userId, eventDetails)
  Input: userId (ObjectId), eventDetails (object)
  Output: eventRequest object
  Side effect: Send email to admin, create notification
  
// Get all event requests (ADMIN only)
async function getAllEventRequests(filters)
  Input: filters (object with status, dateRange)
  Output: [eventRequest] sorted by date
  
// Update event request status
async function updateEventStatus(requestId, status, adminNotes)
  Input: requestId (ObjectId), status (string), adminNotes (string)
  Output: updated eventRequest
  Side effect: Send email to user, create notification
```

#### 4. Shop Management Module

**Purpose**: Handle shop partnership requests and management

**Components**:
- `shopController.js` - Shop management endpoints
- `shopService.js` - Shop business logic

**Key Functions**:
```javascript
// Submit shop request
async function submitShopRequest(userId, shopDetails)
  Input: userId (ObjectId), shopDetails (object)
  Output: shopRequest object
  Validation: User cannot have pending request
  Side effect: Send email to admin, create notification
  
// Approve shop request
async function approveShopRequest(requestId, adminNotes)
  Input: requestId (ObjectId), adminNotes (string)
  Output: updated shopRequest
  Side effects:
    - Upgrade user role to SHOP
    - Send approval email to user
    - Create notification
  
// Reject shop request
async function rejectShopRequest(requestId, reason)
  Input: requestId (ObjectId), reason (string)
  Output: updated shopRequest
  Side effect: Send rejection email with reason
  
// Get active shops
async function getActiveShops()
  Input: none
  Output: [shop] with order statistics
```

#### 5. Product/Inventory Module

**Purpose**: Manage product catalog

**Components**:
- `productController.js` - Product CRUD endpoints
- `productService.js` - Product business logic
- `imageService.js` - Cloudinary integration

**Key Functions**:
```javascript
// Create product with image
async function createProduct(productData, imageFile)
  Input: productData (object), imageFile (file)
  Output: product object
  Side effects:
    - Upload image to Cloudinary
    - Store Cloudinary URL in product
  
// Update product
async function updateProduct(productId, updates, newImageFile)
  Input: productId (ObjectId), updates (object), newImageFile (file, optional)
  Output: updated product
  Side effect: Upload new image if provided
  
// Delete product (soft delete)
async function deleteProduct(productId)
  Input: productId (ObjectId)
  Output: success message
  Implementation: Set isAvailable = false
  
// Get available products
async function getAvailableProducts(filters)
  Input: filters (object with category, search)
  Output: [product] where isAvailable = true
  
// Check low stock
async function checkLowStock()
  Input: none
  Output: [product] where currentStock < minimumStockLevel
  Side effect: Create notifications for low stock items
```

#### 6. Notification Module

**Purpose**: Handle in-app and email notifications

**Components**:
- `notificationController.js` - Notification endpoints
- `notificationService.js` - Notification creation logic
- `emailService.js` - Email sending logic

**Key Functions**:
```javascript
// Create notification
async function createNotification(userId, type, message, priority, metadata)
  Input: userId (ObjectId), type (string), message (string), priority (string), metadata (object)
  Output: notification object
  
// Send email notification
async function sendEmail(to, subject, htmlContent)
  Input: to (string), subject (string), htmlContent (string)
  Output: success/failure
  Implementation: Use Nodemailer with Gmail SMTP
  
// Get user notifications
async function getUserNotifications(userId, unreadOnly)
  Input: userId (ObjectId), unreadOnly (boolean)
  Output: [notification] sorted by priority and date
  
// Mark notification as read
async function markAsRead(notificationId)
  Input: notificationId (ObjectId)
  Output: updated notification
```

#### 7. Analytics Module

**Purpose**: Generate business insights and reports

**Components**:
- `analyticsController.js` - Analytics endpoints
- `analyticsService.js` - Data aggregation logic

**Key Functions**:
```javascript
// Get sales analytics
async function getSalesAnalytics(startDate, endDate, groupBy)
  Input: startDate (Date), endDate (Date), groupBy (string: 'day'|'week'|'month')
  Output: { totalRevenue, orderCount, averageOrderValue, chartData }
  
// Get product performance
async function getProductPerformance(startDate, endDate)
  Input: startDate (Date), endDate (Date)
  Output: [{ productId, productName, totalQuantity, totalRevenue, orderCount }]
  
// Get shop performance
async function getShopPerformance(startDate, endDate)
  Input: startDate (Date), endDate (Date)
  Output: [{ shopId, shopName, orderCount, totalRevenue, averageOrderValue }]
  
// Get growth metrics
async function getGrowthMetrics()
  Input: none
  Output: { totalShops, newShopsThisMonth, totalUsers, newUsersThisMonth, revenueGrowth }
```

### Frontend Components

#### 1. Public Components

**LandingPage**:
- Hero section with CTA buttons
- Featured products (3-4 items)
- What We Do section
- Product highlights
- Contact preview

**ProductsPage**:
- Product grid with images
- Search and filter functionality
- Product details modal
- Responsive layout

**AboutPage**:
- Company story
- Mission and vision
- Quality standards
- Contact information

**ContactPage**:
- Contact form
- Business details
- Map (optional)

#### 2. Authentication Components

**LoginPage**:
- Email/password form
- Google OAuth button
- Link to signup
- Form validation

**SignupPage**:
- Registration form
- Google OAuth button
- Link to login
- Password strength indicator

#### 3. User Components

**UserDashboard**:
- Quick actions (Event Order, Shop Request)
- Order history
- Notifications
- Profile management

**EventOrderForm**:
- Multi-step form
- Product selection with checkboxes
- Quantity inputs
- Date/time pickers
- Form validation

**ShopRequestForm**:
- Comprehensive application form
- Product interest selection
- Business details
- Form validation

**OrderHistory**:
- List of past orders
- Status tracking
- Order details view
- Filter and search

#### 4. Shop Components

**ShopDashboard**:
- Tomorrow's order form
- Order history
- Notifications
- Quick stats

**DailyOrderForm**:
- Date locked to tomorrow
- Product selection
- Quantity inputs
- Skip order option
- Real-time validation

#### 5. Admin Components

**AdminDashboard**:
- Daily orders summary
- Manufacturing plan (product-wise totals)
- Shop-wise packing list
- Recent notifications
- Quick stats
- Quick action buttons

**ShopManagement**:
- Active shops list
- New shop requests
- Approve/reject functionality
- Shop details view
- Order history per shop

**EventOrderManagement**:
- Event requests list
- Filter by status
- Request details view
- Accept/reject functionality
- Admin notes

**InventoryManagement**:
- Product list with images
- Add/edit/delete products
- Image upload
- Stock level tracking
- Low stock alerts

**AnalyticsDashboard**:
- Sales charts
- Product performance
- Shop performance
- Growth metrics
- Date range filters

---

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed, required if not Google OAuth),
  googleId: String (optional, for Google OAuth users),
  role: String (enum: ['PUBLIC', 'USER', 'SHOP', 'ADMIN'], default: 'USER'),
  phone: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}

Indexes:
- email (unique)
- googleId (sparse, unique)
- role
```

### Product Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  description: String (required),
  category: String (optional),
  unit: String (required, e.g., 'kg', 'liters', 'pieces'),
  pricePerUnit: Number (required, min: 0),
  currentStock: Number (required, min: 0, default: 0),
  minimumStockLevel: Number (required, min: 0, default: 10),
  imageUrl: String (Cloudinary URL),
  imagePublicId: String (Cloudinary public ID for deletion),
  isAvailable: Boolean (default: true),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}

Indexes:
- name
- category
- isAvailable
```

### Order Model (Daily Shop Orders)

```javascript
{
  _id: ObjectId,
  shopId: ObjectId (ref: 'User', required),
  shopName: String (denormalized for performance),
  deliveryDate: Date (required, must be tomorrow),
  products: [{
    productId: ObjectId (ref: 'Product', required),
    productName: String (denormalized),
    quantity: Number (required, min: 1),
    pricePerUnit: Number (required),
    totalPrice: Number (calculated: quantity * pricePerUnit)
  }],
  totalAmount: Number (calculated: sum of all product totalPrices),
  status: String (enum: ['PLACED', 'APPROVED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'], default: 'PLACED'),
  deliveryAddress: String (required),
  contactNumber: String (required),
  preferredDeliveryTime: String (optional),
  adminNotes: String (optional),
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId (ref: 'User')
  }],
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}

Indexes:
- shopId
- deliveryDate
- status
- compound: (deliveryDate, status)
```

### EventRequest Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  userName: String (denormalized),
  userEmail: String (denormalized),
  eventName: String (required),
  contactPerson: String (required),
  contactNumber: String (required),
  secondaryContact: String (optional),
  eventLocation: String (required),
  eventDate: Date (required),
  eventTime: String (required),
  deliveryTime: String (required),
  products: [{
    productId: ObjectId (ref: 'Product', required),
    productName: String (denormalized),
    approximateQuantity: Number (required)
  }],
  specialInstructions: String (optional),
  status: String (enum: ['NEW', 'CONTACTED', 'ACCEPTED', 'REJECTED', 'COMPLETED'], default: 'NEW'),
  adminNotes: String (optional),
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: ObjectId (ref: 'User'),
    notes: String
  }],
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}

Indexes:
- userId
- status
- eventDate
- compound: (status, eventDate)
```

### ShopRequest Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  userName: String (denormalized),
  userEmail: String (denormalized),
  shopName: String (required),
  shopOwnerName: String (required),
  businessDetails: String (optional, GST/license info),
  shopAddress: String (required),
  area: String (required),
  contactNumber: String (required),
  alternateContact: String (optional),
  dailyStockNeeded: String (required, description),
  preferredDeliveryTime: String (optional),
  productsInterested: [ObjectId] (ref: 'Product'),
  additionalNotes: String (optional),
  status: String (enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING'),
  adminNotes: String (optional),
  rejectionReason: String (optional),
  reviewedBy: ObjectId (ref: 'User', optional),
  reviewedAt: Date (optional),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}

Indexes:
- userId
- status
- compound: (userId, status) - to check for pending requests
```

### Notification Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  type: String (enum: ['ORDER', 'EVENT', 'SHOP_REQUEST', 'STOCK', 'SYSTEM'], required),
  message: String (required),
  priority: String (enum: ['HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM'),
  isRead: Boolean (default: false),
  metadata: {
    relatedId: ObjectId (optional, reference to order/event/shop request),
    relatedType: String (optional, 'Order', 'EventRequest', 'ShopRequest')
  },
  createdAt: Date (default: Date.now)
}

Indexes:
- userId
- isRead
- compound: (userId, isRead, priority, createdAt)
```

### AuditLog Model (Optional but Recommended)

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  action: String (required, e.g., 'CREATE_ORDER', 'APPROVE_SHOP', 'UPDATE_PRODUCT'),
  entityType: String (required, e.g., 'Order', 'ShopRequest', 'Product'),
  entityId: ObjectId (required),
  changes: Object (optional, before/after values),
  ipAddress: String (optional),
  userAgent: String (optional),
  timestamp: Date (default: Date.now)
}

Indexes:
- userId
- entityType
- entityId
- timestamp
```

---

## API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register
  Body: { name, email, password }
  Response: { user, token }
  
POST   /api/auth/login
  Body: { email, password }
  Response: { user, token }
  
GET    /api/auth/google
  Redirects to Google OAuth consent screen
  
GET    /api/auth/google/callback
  Query: { code }
  Response: { user, token }
  
GET    /api/auth/me
  Headers: { Authorization: Bearer <token> }
  Response: { user }
  
POST   /api/auth/logout
  Headers: { Authorization: Bearer <token> }
  Response: { message: 'Logged out successfully' }
```

### Product Endpoints

```
GET    /api/products
  Query: { category, search, available }
  Response: [product]
  Access: PUBLIC
  
GET    /api/products/:id
  Response: product
  Access: PUBLIC
  
POST   /api/products
  Headers: { Authorization: Bearer <token> }
  Body: FormData { name, description, category, unit, pricePerUnit, currentStock, minimumStockLevel, image }
  Response: product
  Access: ADMIN only
  
PUT    /api/products/:id
  Headers: { Authorization: Bearer <token> }
  Body: FormData { updates, image (optional) }
  Response: updated product
  Access: ADMIN only
  
DELETE /api/products/:id
  Headers: { Authorization: Bearer <token> }
  Response: { message: 'Product deleted' }
  Access: ADMIN only (soft delete)
  
GET    /api/products/low-stock
  Headers: { Authorization: Bearer <token> }
  Response: [product]
  Access: ADMIN only
```

### Order Endpoints

```
POST   /api/orders
  Headers: { Authorization: Bearer <token> }
  Body: { products: [{productId, quantity}], deliveryDate, deliveryAddress, contactNumber, preferredDeliveryTime }
  Response: order
  Access: SHOP only
  Validation: deliveryDate must be tomorrow
  
GET    /api/orders
  Headers: { Authorization: Bearer <token> }
  Query: { shopId, status, startDate, endDate }
  Response: [order]
  Access: SHOP (own orders), ADMIN (all orders)
  
GET    /api/orders/:id
  Headers: { Authorization: Bearer <token> }
  Response: order
  Access: SHOP (own order), ADMIN
  
PUT    /api/orders/:id/status
  Headers: { Authorization: Bearer <token> }
  Body: { status, adminNotes }
  Response: updated order
  Access: ADMIN only
  Side effect: Send email to shop
  
GET    /api/orders/manufacturing-plan/:date
  Headers: { Authorization: Bearer <token> }
  Response: { productTotals: [{productId, productName, totalQuantity}] }
  Access: ADMIN only
  
GET    /api/orders/packing-list/:date
  Headers: { Authorization: Bearer <token> }
  Response: [{ shopId, shopName, products, address, contact, deliveryTime }]
  Access: ADMIN only
```

### Event Request Endpoints

```
POST   /api/events
  Headers: { Authorization: Bearer <token> }
  Body: { eventName, contactPerson, contactNumber, secondaryContact, eventLocation, eventDate, eventTime, deliveryTime, products: [{productId, approximateQuantity}], specialInstructions }
  Response: eventRequest
  Access: USER, SHOP
  Side effect: Email to admin, notification created
  
GET    /api/events
  Headers: { Authorization: Bearer <token> }
  Query: { status, startDate, endDate }
  Response: [eventRequest]
  Access: USER/SHOP (own requests), ADMIN (all requests)
  
GET    /api/events/:id
  Headers: { Authorization: Bearer <token> }
  Response: eventRequest
  Access: USER/SHOP (own request), ADMIN
  
PUT    /api/events/:id/status
  Headers: { Authorization: Bearer <token> }
  Body: { status, adminNotes }
  Response: updated eventRequest
  Access: ADMIN only
  Side effect: Email to user, notification created
```

### Shop Request Endpoints

```
POST   /api/shop-requests
  Headers: { Authorization: Bearer <token> }
  Body: { shopName, shopOwnerName, businessDetails, shopAddress, area, contactNumber, alternateContact, dailyStockNeeded, preferredDeliveryTime, productsInterested, additionalNotes }
  Response: shopRequest
  Access: USER only
  Validation: No pending request for this user
  Side effect: Email to admin, notification created
  
GET    /api/shop-requests
  Headers: { Authorization: Bearer <token> }
  Query: { status }
  Response: [shopRequest]
  Access: USER (own requests), ADMIN (all requests)
  
GET    /api/shop-requests/:id
  Headers: { Authorization: Bearer <token> }
  Response: shopRequest
  Access: USER (own request), ADMIN
  
PUT    /api/shop-requests/:id/approve
  Headers: { Authorization: Bearer <token> }
  Body: { adminNotes }
  Response: updated shopRequest
  Access: ADMIN only
  Side effects:
    - Upgrade user role to SHOP
    - Email to user
    - Notification created
  
PUT    /api/shop-requests/:id/reject
  Headers: { Authorization: Bearer <token> }
  Body: { rejectionReason }
  Response: updated shopRequest
  Access: ADMIN only
  Side effect: Email to user with reason
```

### Shop Management Endpoints

```
GET    /api/shops
  Headers: { Authorization: Bearer <token> }
  Response: [shop with order statistics]
  Access: ADMIN only
  
GET    /api/shops/:id
  Headers: { Authorization: Bearer <token> }
  Response: { shop, orderHistory, statistics }
  Access: ADMIN only
  
PUT    /api/shops/:id/deactivate
  Headers: { Authorization: Bearer <token> }
  Response: { message: 'Shop deactivated' }
  Access: ADMIN only
```

### Notification Endpoints

```
GET    /api/notifications
  Headers: { Authorization: Bearer <token> }
  Query: { unreadOnly }
  Response: [notification]
  Access: Authenticated users (own notifications)
  
GET    /api/notifications/unread-count
  Headers: { Authorization: Bearer <token> }
  Response: { count }
  Access: Authenticated users
  
PUT    /api/notifications/:id/read
  Headers: { Authorization: Bearer <token> }
  Response: updated notification
  Access: Authenticated users (own notification)
  
PUT    /api/notifications/mark-all-read
  Headers: { Authorization: Bearer <token> }
  Response: { message: 'All notifications marked as read' }
  Access: Authenticated users
```

### Analytics Endpoints

```
GET    /api/analytics/sales
  Headers: { Authorization: Bearer <token> }
  Query: { startDate, endDate, groupBy }
  Response: { totalRevenue, orderCount, averageOrderValue, chartData }
  Access: ADMIN only
  
GET    /api/analytics/products
  Headers: { Authorization: Bearer <token> }
  Query: { startDate, endDate }
  Response: [{ productId, productName, totalQuantity, totalRevenue, orderCount }]
  Access: ADMIN only
  
GET    /api/analytics/shops
  Headers: { Authorization: Bearer <token> }
  Query: { startDate, endDate }
  Response: [{ shopId, shopName, orderCount, totalRevenue, averageOrderValue }]
  Access: ADMIN only
  
GET    /api/analytics/growth
  Headers: { Authorization: Bearer <token> }
  Response: { totalShops, newShopsThisMonth, totalUsers, newUsersThisMonth, revenueGrowth }
  Access: ADMIN only
  
GET    /api/analytics/dashboard
  Headers: { Authorization: Bearer <token> }
  Response: { todayOrders, tomorrowOrders, pendingShopRequests, pendingEventRequests, lowStockCount, recentRevenue }
  Access: ADMIN only
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Core Business Logic Properties

**Property 1: Tomorrow-only order validation**
*For any* daily order submission, if the delivery date is not exactly tomorrow (current date + 1 day), the order creation should be rejected with a validation error.
**Validates: Requirements - Daily Stock Order System (Order.1)**

**Property 2: Unified authentication by email**
*For any* email address, regardless of authentication method used (Google OAuth or email/password), there should exist at most one user record in the database.
**Validates: Requirements - Authentication System (Auth.4)**

**Property 3: Role-based route access**
*For any* API endpoint with role requirements and any authenticated user, access should be granted if and only if the user's role meets or exceeds the required role level (ADMIN > SHOP > USER > PUBLIC).
**Validates: Requirements - Authentication System (Auth.5), Security Requirements (Security.1)**

**Property 4: Single pending shop request per user**
*For any* user attempting to submit a shop request, if that user already has a pending shop request (status = 'PENDING'), the new submission should be rejected.
**Validates: Requirements - Shop Partnership Request (Shop.8)**

**Property 5: Role upgrade on shop approval**
*For any* shop request that is approved, the associated user's role should be automatically updated to 'SHOP'.
**Validates: Requirements - Shop Partnership Request (Shop.5)**

**Property 6: Soft delete preservation**
*For any* product deletion operation, the product record should remain in the database with isAvailable set to false, not be removed from the database.
**Validates: Requirements - Inventory Management (Inventory.5)**

**Property 7: Manufacturing plan accuracy**
*For any* date, the manufacturing plan should contain product-wise totals where each product's total quantity equals the sum of that product's quantities across all orders for that date.
**Validates: Requirements - Admin Dashboard (Dashboard.3)**

**Property 8: Shop-wise packing list completeness**
*For any* date, the packing list should include all and only those shops that have orders with deliveryDate equal to that date.
**Validates: Requirements - Admin Dashboard (Dashboard.4)**

**Property 9: Available products filter**
*For any* public inventory view request, the returned products should include all and only those products where isAvailable = true.
**Validates: Requirements - Inventory View (InventoryView.6)**

**Property 10: Low stock alert generation**
*For any* product where currentStock < minimumStockLevel, a notification of type 'STOCK' with priority 'HIGH' should exist for admin users.
**Validates: Requirements - Inventory Management (Inventory.7)**

### Data Consistency Properties

**Property 11: Order status progression**
*For any* order status update, the new status should be a valid transition from the current status following the flow: PLACED → APPROVED → PACKED → OUT_FOR_DELIVERY → DELIVERED.
**Validates: Requirements - Daily Stock Order System (Order.9)**

**Property 12: Event status validity**
*For any* event request, the status field should always contain one of the valid enum values: 'NEW', 'CONTACTED', 'ACCEPTED', 'REJECTED', or 'COMPLETED'.
**Validates: Requirements - Event Order System (Event.11)**

**Property 13: Status history tracking**
*For any* order or event request status change, a new entry should be appended to the statusHistory array containing the new status, timestamp, and updatedBy user ID.
**Validates: Requirements - Event Order Management (EventMgmt.8)**

**Property 14: Data isolation for shops**
*For any* shop user requesting their order history, the returned orders should include all and only those orders where shopId equals the requesting user's ID.
**Validates: Requirements - Daily Stock Order System (Order.8)**

**Property 15: Data isolation for users**
*For any* user requesting their event request history, the returned event requests should include all and only those requests where userId equals the requesting user's ID.
**Validates: Requirements - Event Order System (Event.10)**

**Property 16: Admin full data access**
*For any* admin user requesting orders, event requests, or shop requests, all records should be accessible regardless of ownership.
**Validates: Requirements - Shop Management (ShopMgmt.1), Event Order Management (EventMgmt.1)**

**Property 17: Real-time data consistency**
*For any* data modification (create, update, delete), a subsequent read operation should reflect the modification without caching delays.
**Validates: Requirements - Admin Dashboard (Dashboard.2), Inventory Management (Inventory.6), Analytics & Reports (Analytics.4)**

### Validation Properties

**Property 18: Required field validation**
*For any* API endpoint accepting data, if any required field is missing or empty, the request should be rejected with a 400 status code and descriptive error message.
**Validates: Requirements - Event Order System (Event.1), Shop Partnership Request (Shop.1), Security Requirements (Security.3)**

**Property 19: Quantity validation**
*For any* order or event request, all product quantities should be positive integers (>= 1).
**Validates: Requirements - Daily Stock Order System (Order.4), Event Order System (Event.4)**

**Property 20: Future date validation**
*For any* event request, the eventDate should be greater than the current date.
**Validates: Requirements - Event Order System (Event.5)**

**Property 21: Product data validation**
*For any* product creation or update, pricePerUnit, currentStock, and minimumStockLevel should be non-negative numbers, and required fields (name, description, unit) should be non-empty strings.
**Validates: Requirements - Inventory Management (Inventory.9)**

**Property 22: Password hashing**
*For any* user created with email/password authentication, the password field in the database should be a bcrypt hash, not the plaintext password.
**Validates: Requirements - Security Requirements (Security.8)**

### Notification Properties

**Property 23: State change notifications**
*For any* state change event (order status update, event request status update, shop request approval/rejection), an email notification should be sent to the affected user and an in-app notification should be created.
**Validates: Requirements - Daily Stock Order System (Order.6, Order.7), Event Order System (Event.7, Event.8), Shop Partnership Request (Shop.3, Shop.4), Notification System (Notif.2)**

**Property 24: Notification priority ordering**
*For any* notification list retrieval, notifications should be sorted first by priority (HIGH before MEDIUM before LOW), then by creation date (newest first).
**Validates: Requirements - Admin Dashboard (Dashboard.5)**

**Property 25: Unread count accuracy**
*For any* user, the unread notification count should equal the number of notifications for that user where isRead = false.
**Validates: Requirements - Notification System (Notif.5)**

**Property 26: Notification content completeness**
*For any* notification email, the email body should contain all relevant details for that notification type (order ID, shop name, product details, status, etc.).
**Validates: Requirements - Notification System (Notif.7)**

### Image Management Properties

**Property 27: Cloudinary image upload**
*For any* product creation or update with an image file, the image should be uploaded to Cloudinary and the returned URL should be stored in the product's imageUrl field.
**Validates: Requirements - Inventory Management (Inventory.1, Inventory.2)**

**Property 28: Image accessibility**
*For any* product with a non-null imageUrl, the URL should be accessible and return a valid image response.
**Validates: Requirements - Inventory View (InventoryView.2)**

### Analytics Properties

**Property 29: Analytics data accuracy**
*For any* analytics query (sales, product performance, shop performance), the aggregated results should match the sum/count of the underlying data in the database for the specified date range.
**Validates: Requirements - Analytics & Reports (Analytics.1), Admin Dashboard (Dashboard.6)**

**Property 30: Date range filtering**
*For any* analytics query with a date range, the returned data should include all and only those records where the date field falls within the specified range (inclusive).
**Validates: Requirements - Analytics & Reports (Analytics.3)**

### Search and Filter Properties

**Property 31: Product search accuracy**
*For any* product search query, the returned products should include all and only those products where the name or description contains the search term (case-insensitive).
**Validates: Requirements - Inventory View (InventoryView.4)**

**Property 32: Status filter accuracy**
*For any* event request list with a status filter, the returned requests should include all and only those requests where the status field equals the filter value.
**Validates: Requirements - Event Order Management (EventMgmt.2)**

**Property 33: Category filter accuracy**
*For any* product list with a category filter, the returned products should include all and only those products where the category field equals the filter value.
**Validates: Requirements - Inventory View (InventoryView.5)**

### Authentication Properties

**Property 34: JWT token generation**
*For any* successful authentication (login or signup), a JWT token should be generated with the user's ID and role, and should expire exactly 7 days from creation.
**Validates: Requirements - Authentication System (Auth.6)**

**Property 35: Password authentication**
*For any* login attempt with email and password, authentication should succeed if and only if a user exists with that email and the provided password matches the stored bcrypt hash.
**Validates: Requirements - Authentication System (Auth.3)**

**Property 36: User creation on signup**
*For any* valid signup request with email, password, and name, a new user record should be created with role 'USER' and isActive true.
**Validates: Requirements - Authentication System (Auth.2)**

---

## Error Handling

### Error Response Format

All API errors should follow a consistent format:

```javascript
{
  success: false,
  error: {
    code: String,        // Error code (e.g., 'VALIDATION_ERROR', 'UNAUTHORIZED')
    message: String,     // Human-readable error message
    details: Object      // Optional additional details
  }
}
```

### Error Categories

**1. Validation Errors (400)**:
- Missing required fields
- Invalid data types
- Business rule violations (e.g., date not tomorrow)
- Constraint violations (e.g., duplicate email)

**2. Authentication Errors (401)**:
- Missing JWT token
- Invalid JWT token
- Expired JWT token

**3. Authorization Errors (403)**:
- Insufficient role permissions
- Attempting to access other user's data

**4. Not Found Errors (404)**:
- Resource does not exist
- Invalid ID

**5. Conflict Errors (409)**:
- Duplicate email on signup
- Pending shop request already exists

**6. Server Errors (500)**:
- Database connection failures
- External service failures (Cloudinary, email)
- Unexpected errors

### Error Handling Strategy

**Backend**:
- Use try-catch blocks in all async functions
- Centralized error handling middleware
- Log all errors with context (user ID, request ID, timestamp)
- Sanitize error messages (no sensitive data in responses)
- Graceful degradation for external service failures

**Frontend**:
- Display user-friendly error messages
- Toast notifications for errors
- Form validation before submission
- Retry logic for network failures
- Fallback UI for failed data loads

### Critical Error Scenarios

**1. Email Sending Failure**:
- Log error with full context
- Store notification in database as fallback
- Retry up to 3 times with exponential backoff
- Alert admin if persistent failure

**2. Cloudinary Upload Failure**:
- Return error to user with retry option
- Allow product creation without image
- Log failure for investigation

**3. Database Connection Loss**:
- Return 503 Service Unavailable
- Implement connection retry logic
- Alert admin immediately

**4. Invalid JWT Token**:
- Clear client-side token
- Redirect to login page
- Return 401 Unauthorized

---

## Testing Strategy

### Testing Approach

The AMMUFOODS system requires a comprehensive testing strategy combining unit tests for specific scenarios and property-based tests for universal correctness guarantees.

**Dual Testing Philosophy**:
- **Unit Tests**: Verify specific examples, edge cases, and integration points
- **Property Tests**: Verify universal properties across all possible inputs
- Both approaches are complementary and necessary for production quality

### Property-Based Testing

**Library**: fast-check (for JavaScript/Node.js)

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: ammufoods-complete-system, Property {N}: {property description}`

**Property Test Coverage**:

Each of the 36 correctness properties defined above should have a corresponding property-based test. Examples:

```javascript
// Property 1: Tomorrow-only order validation
test('Feature: ammufoods-complete-system, Property 1: Tomorrow-only order validation', () => {
  fc.assert(
    fc.property(
      fc.date(), // Generate random dates
      fc.array(fc.record({ productId: fc.string(), quantity: fc.integer(1, 100) })),
      async (deliveryDate, products) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const result = await createOrder({ deliveryDate, products });
        
        if (isSameDay(deliveryDate, tomorrow)) {
          expect(result.success).toBe(true);
        } else {
          expect(result.success).toBe(false);
          expect(result.error.code).toBe('INVALID_DATE');
        }
      }
    ),
    { numRuns: 100 }
  );
});

// Property 2: Unified authentication by email
test('Feature: ammufoods-complete-system, Property 2: Unified authentication by email', () => {
  fc.assert(
    fc.property(
      fc.emailAddress(),
      fc.string(),
      fc.string(),
      async (email, password, googleId) => {
        // Create user with email/password
        await registerUser({ email, password, name: 'Test User' });
        
        // Attempt to create user with same email via Google OAuth
        await googleAuthCallback({ email, googleId, name: 'Test User' });
        
        // Verify only one user exists
        const users = await User.find({ email });
        expect(users.length).toBe(1);
        
        // Verify both auth methods are linked
        expect(users[0].password).toBeDefined();
        expect(users[0].googleId).toBe(googleId);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 7: Manufacturing plan accuracy
test('Feature: ammufoods-complete-system, Property 7: Manufacturing plan accuracy', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        shopId: fc.string(),
        products: fc.array(fc.record({
          productId: fc.string(),
          productName: fc.string(),
          quantity: fc.integer(1, 100)
        }))
      })),
      async (orders) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Create orders
        for (const order of orders) {
          await createOrder({ ...order, deliveryDate: tomorrow });
        }
        
        // Get manufacturing plan
        const plan = await getManufacturingPlan(tomorrow);
        
        // Calculate expected totals
        const expectedTotals = {};
        for (const order of orders) {
          for (const product of order.products) {
            expectedTotals[product.productId] = 
              (expectedTotals[product.productId] || 0) + product.quantity;
          }
        }
        
        // Verify plan matches expected totals
        for (const item of plan.productTotals) {
          expect(item.totalQuantity).toBe(expectedTotals[item.productId]);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Framework**: Jest

**Unit Test Focus**:
- Specific examples demonstrating correct behavior
- Edge cases (empty arrays, null values, boundary conditions)
- Error conditions (invalid input, missing data)
- Integration between components
- External service mocking (Cloudinary, email, Google OAuth)

**Unit Test Examples**:

```javascript
// Example: Test order creation with valid data
test('should create order with valid tomorrow date', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const orderData = {
    shopId: 'shop123',
    deliveryDate: tomorrow,
    products: [
      { productId: 'prod1', quantity: 10 },
      { productId: 'prod2', quantity: 5 }
    ]
  };
  
  const result = await createOrder(orderData);
  
  expect(result.success).toBe(true);
  expect(result.order.deliveryDate).toEqual(tomorrow);
  expect(result.order.products).toHaveLength(2);
});

// Example: Test edge case - empty product list
test('should reject order with empty product list', async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const orderData = {
    shopId: 'shop123',
    deliveryDate: tomorrow,
    products: []
  };
  
  const result = await createOrder(orderData);
  
  expect(result.success).toBe(false);
  expect(result.error.code).toBe('VALIDATION_ERROR');
});

// Example: Test error condition - invalid date
test('should reject order for today', async () => {
  const today = new Date();
  
  const orderData = {
    shopId: 'shop123',
    deliveryDate: today,
    products: [{ productId: 'prod1', quantity: 10 }]
  };
  
  const result = await createOrder(orderData);
  
  expect(result.success).toBe(false);
  expect(result.error.code).toBe('INVALID_DATE');
  expect(result.error.message).toContain('tomorrow');
});
```

### Integration Testing

**Focus**:
- End-to-end API flows
- Database operations
- Authentication and authorization
- Email sending
- Image upload

**Tools**:
- Supertest for API testing
- MongoDB Memory Server for test database
- Nock for mocking external APIs

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Property Tests**: All 36 correctness properties
- **Integration Tests**: All critical user flows
- **E2E Tests**: Key business scenarios (order placement, shop approval, etc.)

### Testing Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Reset database state between tests
3. **Mocking**: Mock external services (Cloudinary, Gmail, Google OAuth)
4. **Assertions**: Clear, specific assertions
5. **Naming**: Descriptive test names explaining what is being tested
6. **Organization**: Group related tests in describe blocks
7. **Performance**: Keep tests fast (< 5 seconds per test suite)

---

## Security Design

### Authentication Security

**JWT Implementation**:
- Use strong secret key (256-bit minimum)
- Store secret in environment variable
- Set expiration to 7 days
- Include user ID and role in payload
- Sign with HS256 algorithm

**Password Security**:
- Hash with bcrypt (salt rounds: 10)
- Never store plaintext passwords
- Validate password strength on signup (min 8 characters)
- No password in API responses

**Google OAuth Security**:
- Use official Google OAuth library
- Validate OAuth tokens server-side
- Store only necessary user data
- Implement CSRF protection for OAuth flow

### Authorization Security

**Role-Based Access Control (RBAC)**:
- Middleware checks role before route access
- Hierarchical roles: ADMIN > SHOP > USER > PUBLIC
- Deny by default (explicit allow required)
- Log all authorization failures

**Data Access Control**:
- Users can only access their own data
- Shops can only access their own orders
- Admin can access all data
- Validate ownership in every data access

### Input Validation

**Server-Side Validation**:
- Validate all input on server (never trust client)
- Use Joi or express-validator for schema validation
- Sanitize input to prevent injection attacks
- Validate data types, ranges, formats

**MongoDB Injection Prevention**:
- Use Mongoose schema validation
- Never use raw queries with user input
- Parameterize all queries
- Validate ObjectIds before use

### API Security

**Rate Limiting**:
- Use express-rate-limit middleware
- Limit: 100 requests per 15 minutes per IP
- Stricter limits for auth endpoints (5 login attempts per 15 minutes)
- Return 429 Too Many Requests on limit exceeded

**CORS Configuration**:
- Allow only frontend domain
- Restrict allowed methods (GET, POST, PUT, DELETE)
- Allow credentials for cookie-based auth
- No wildcard origins in production

**Headers Security**:
- Use helmet.js for security headers
- Set Content-Security-Policy
- Enable HSTS (Strict-Transport-Security)
- Disable X-Powered-By header

### Data Security

**Sensitive Data Protection**:
- Never log passwords or tokens
- Mask sensitive data in logs (phone numbers, emails)
- Use HTTPS for all communication
- Encrypt sensitive data at rest (if needed)

**Environment Variables**:
- Store all secrets in .env file
- Never commit .env to version control
- Use different secrets for dev/staging/production
- Rotate secrets periodically

### Session Security

**Token Management**:
- Store JWT in httpOnly cookie (preferred) or localStorage
- Implement token refresh mechanism
- Invalidate tokens on logout
- Detect and prevent token reuse

**Session Timeout**:
- JWT expires after 7 days
- Prompt user to re-login on expiration
- Clear client-side token on expiration

### External Service Security

**Cloudinary**:
- Use signed uploads
- Restrict upload file types (images only)
- Set maximum file size (5MB)
- Use secure URLs (HTTPS)

**Email (Nodemailer)**:
- Use app-specific password (not main Gmail password)
- Enable 2FA on Gmail account
- Validate email addresses before sending
- Rate limit email sending

**Google OAuth**:
- Use official Google OAuth library
- Validate OAuth tokens server-side
- Implement state parameter for CSRF protection
- Restrict OAuth scopes to minimum required

### Monitoring and Logging

**Security Logging**:
- Log all authentication attempts (success and failure)
- Log all authorization failures
- Log all data modifications (audit trail)
- Log all errors with context

**Monitoring**:
- Monitor for unusual activity (multiple failed logins)
- Alert on security events (unauthorized access attempts)
- Track API usage patterns
- Monitor external service failures

### Deployment Security

**Production Checklist**:
- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database access restricted (IP whitelist)
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Error messages sanitized (no stack traces)
- [ ] Logging configured
- [ ] Monitoring enabled
- [ ] Backup strategy implemented

---

## Performance Considerations

### Database Optimization

**Indexing Strategy**:
- Index frequently queried fields (email, role, status, dates)
- Compound indexes for common query patterns
- Sparse indexes for optional fields (googleId)
- Monitor slow queries and add indexes as needed

**Query Optimization**:
- Use projection to limit returned fields
- Implement pagination for large result sets
- Use aggregation pipeline for complex queries
- Avoid N+1 queries (use populate wisely)

**Connection Pooling**:
- Configure MongoDB connection pool size
- Reuse connections across requests
- Handle connection errors gracefully

### API Performance

**Response Time Goals**:
- Simple queries: < 100ms
- Complex queries: < 500ms
- Image uploads: < 2 seconds
- Page loads: < 2 seconds

**Caching Strategy**:
- Cache static data (product list for public view)
- Cache duration: 5 minutes for product list
- Invalidate cache on data modification
- Use Redis for caching (optional, future enhancement)

**Pagination**:
- Implement cursor-based pagination for large lists
- Default page size: 20 items
- Maximum page size: 100 items
- Return total count for UI

### Frontend Performance

**Code Splitting**:
- Split code by route
- Lazy load admin pages
- Lazy load heavy components (charts, analytics)

**Image Optimization**:
- Use Cloudinary transformations for responsive images
- Lazy load images below the fold
- Use WebP format where supported
- Set appropriate image dimensions

**Bundle Optimization**:
- Minimize bundle size
- Tree shaking for unused code
- Compress assets (gzip/brotli)
- Use CDN for static assets

### Scalability Considerations

**Horizontal Scaling**:
- Stateless API design (no server-side sessions)
- JWT tokens for authentication (no session store)
- Database connection pooling
- Load balancer ready

**Vertical Scaling**:
- Optimize memory usage
- Efficient algorithms for data processing
- Stream large data sets
- Monitor resource usage

**Future Enhancements**:
- Redis for caching and session management
- Message queue for email sending (Bull/RabbitMQ)
- CDN for static assets
- Database read replicas for analytics

---

## Deployment Architecture

### Backend Deployment (Render)

**Configuration**:
- Node.js environment
- Auto-deploy from main branch
- Environment variables configured
- Health check endpoint: /api/health
- Start command: `npm start`

**Environment Variables**:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<MongoDB Atlas connection string>
JWT_SECRET=<strong secret key>
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=<Google OAuth client ID>
GOOGLE_CLIENT_SECRET=<Google OAuth client secret>
GOOGLE_CALLBACK_URL=<backend URL>/api/auth/google/callback
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=ammufoods2018@gmail.com
EMAIL_PASS=<app-specific password>
FRONTEND_URL=<Vercel frontend URL>
```

### Frontend Deployment (Vercel)

**Configuration**:
- React build
- Auto-deploy from main branch
- Environment variables configured
- Build command: `npm run build`
- Output directory: `build`

**Environment Variables**:
```
REACT_APP_API_URL=<Render backend URL>
REACT_APP_GOOGLE_CLIENT_ID=<Google OAuth client ID>
```

### Database (MongoDB Atlas)

**Configuration**:
- Shared cluster (M0) for development
- Dedicated cluster (M10+) for production
- IP whitelist: Allow from anywhere (0.0.0.0/0) or specific IPs
- Database user with read/write permissions
- Automated backups enabled

### Image Storage (Cloudinary)

**Configuration**:
- Free tier for development
- Paid tier for production (if needed)
- Upload preset configured
- Folder structure: /ammufoods/products
- Transformations: Auto-optimize, auto-format

### Email Service (Gmail SMTP)

**Configuration**:
- Gmail account: ammufoods2018@gmail.com
- 2FA enabled
- App-specific password generated
- SMTP settings: smtp.gmail.com:587
- TLS enabled

### Monitoring and Logging

**Render Monitoring**:
- Built-in metrics (CPU, memory, requests)
- Log aggregation
- Alerts for errors and downtime

**Application Logging**:
- Winston or Morgan for logging
- Log levels: error, warn, info, debug
- Log format: JSON for production
- Log rotation for disk space management

**Error Tracking** (Optional):
- Sentry for error tracking
- Real-time error notifications
- Stack trace capture
- User context in errors

---

## Development Workflow

### Local Development Setup

**Prerequisites**:
- Node.js 16+ installed
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account
- Google OAuth credentials
- Gmail account with app-specific password

**Backend Setup**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

**Frontend Setup**:
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm start
```

### Git Workflow

**Branching Strategy**:
- `main` branch: production-ready code
- `develop` branch: integration branch
- Feature branches: `feature/feature-name`
- Bug fix branches: `fix/bug-name`

**Commit Messages**:
- Use conventional commits format
- Examples:
  - `feat: add daily order creation endpoint`
  - `fix: resolve date validation bug`
  - `docs: update API documentation`
  - `test: add property tests for authentication`

### Code Quality

**Linting**:
- ESLint for JavaScript
- Prettier for code formatting
- Pre-commit hooks with Husky

**Code Review**:
- All changes via pull requests
- At least one approval required
- Automated tests must pass
- No merge conflicts

---

## Future Enhancements

### Phase 2 Features

1. **SMS Notifications**: Send SMS for critical updates
2. **Mobile App**: React Native app for shop partners
3. **Advanced Analytics**: Predictive analytics, forecasting
4. **Customer Portal**: Allow event customers to track orders
5. **Payment Integration**: Online payment for event orders
6. **Inventory Forecasting**: Predict stock needs based on trends
7. **Multi-language Support**: Tamil and English
8. **Offline Mode**: PWA with offline capabilities

### Technical Improvements

1. **Caching Layer**: Redis for improved performance
2. **Message Queue**: Bull for background jobs
3. **Microservices**: Split into smaller services as needed
4. **GraphQL API**: Alternative to REST for flexible queries
5. **Real-time Updates**: WebSockets for live dashboard updates
6. **Advanced Search**: Elasticsearch for full-text search
7. **CDN**: CloudFront or similar for static assets
8. **Database Sharding**: For massive scale

---

## Conclusion

This design document provides a comprehensive blueprint for the AMMUFOODS complete business management system. The architecture is designed to be:

- **Scalable**: Can grow with the business
- **Maintainable**: Clean code structure and documentation
- **Secure**: Multiple layers of security
- **Performant**: Optimized for speed and efficiency
- **Reliable**: Error handling and monitoring
- **Testable**: Comprehensive testing strategy

The system will streamline daily operations, improve efficiency, and provide valuable business insights for AMMUFOODS to grow and succeed.
