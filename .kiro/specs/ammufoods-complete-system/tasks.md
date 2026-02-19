# Implementation Plan: AMMUFOODS Complete Business Management System

## Overview

This implementation plan breaks down the AMMUFOODS system into discrete, manageable coding tasks. Each task builds on previous work, with incremental validation through automated tests. The plan follows a bottom-up approach: database models → business logic → API endpoints → frontend components → integration.

**Technology Stack**:
- Backend: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt
- Frontend: React, React Router, Axios
- External Services: Cloudinary, Google OAuth, Gmail SMTP
- Testing: Jest, Supertest, fast-check (property-based testing)

**Implementation Strategy**:
- Start with core infrastructure (database, authentication)
- Build feature by feature (orders, events, shops, inventory)
- Add admin features (dashboard, management, analytics)
- Implement notifications and email
- Complete with frontend integration and testing

---

## Tasks

- [x] 1. Project setup and infrastructure
  - Initialize backend and frontend projects with proper structure
  - Set up MongoDB connection with Mongoose
  - Configure environment variables for all services
  - Set up CORS, body parser, and security middleware (helmet, rate limiting)
  - Create health check endpoint
  - _Requirements: Technical Requirements (Backend, Frontend)_


- [ ] 2. Database models and schemas
  - [x] 2.1 Create User model with schema validation
    - Define User schema with all fields (name, email, password, googleId, role, phone, isActive)
    - Add indexes for email, googleId, and role
    - Add timestamps (createdAt, updatedAt)
    - _Requirements: Authentication System (Auth.1-6)_
  
  - [x] 2.2 Create Product model with schema validation
    - Define Product schema with all fields (name, description, category, unit, pricePerUnit, currentStock, minimumStockLevel, imageUrl, imagePublicId, isAvailable)
    - Add indexes for name, category, and isAvailable
    - Add timestamps
    - _Requirements: Inventory Management (Inventory.1-9)_
  
  - [x] 2.3 Create Order model with schema validation
    - Define Order schema with embedded products array and status tracking
    - Add indexes for shopId, deliveryDate, status, and compound index (deliveryDate, status)
    - Add statusHistory array for audit trail
    - _Requirements: Daily Stock Order System (Order.1-10)_
  
  - [x] 2.4 Create EventRequest model with schema validation
    - Define EventRequest schema with embedded products array and status tracking
    - Add indexes for userId, status, eventDate, and compound index (status, eventDate)
    - Add statusHistory array
    - _Requirements: Event Order System (Event.1-11)_
  
  - [x] 2.5 Create ShopRequest model with schema validation
    - Define ShopRequest schema with all application fields
    - Add indexes for userId, status, and compound index (userId, status)
    - _Requirements: Shop Partnership Request (Shop.1-8)_
  
  - [x] 2.6 Create Notification model with schema validation
    - Define Notification schema with type, priority, and metadata
    - Add indexes for userId, isRead, and compound index (userId, isRead, priority, createdAt)
    - _Requirements: Notification System (Notif.1-8)_


- [ ] 3. Authentication system
  - [x] 3.1 Implement JWT token generation and verification
    - Create functions for generating JWT tokens with user ID and role
    - Create middleware for verifying JWT tokens
    - Set token expiration to 7 days
    - _Requirements: Authentication System (Auth.6)_
  
  - [ ]* 3.2 Write property test for JWT token generation
    - **Property 34: JWT token generation**
    - **Validates: Requirements Auth.6**
  
  - [x] 3.3 Implement password hashing with bcrypt
    - Create functions for hashing passwords (salt rounds: 10)
    - Create functions for comparing passwords
    - _Requirements: Security Requirements (Security.8)_
  
  - [ ]* 3.4 Write property test for password hashing
    - **Property 22: Password hashing**
    - **Validates: Requirements Security.8**
  
  - [x] 3.5 Implement email/password registration
    - Create registration endpoint that validates input, hashes password, creates user
    - Return user object and JWT token
    - Handle duplicate email errors
    - _Requirements: Authentication System (Auth.2)_
  
  - [ ]* 3.6 Write property test for user creation on signup
    - **Property 36: User creation on signup**
    - **Validates: Requirements Auth.2**
  
  - [x] 3.7 Implement email/password login
    - Create login endpoint that validates credentials, compares password hash
    - Return user object and JWT token
    - Handle invalid credentials
    - _Requirements: Authentication System (Auth.3)_
  
  - [ ]* 3.8 Write property test for password authentication
    - **Property 35: Password authentication**
    - **Validates: Requirements Auth.3**
  
  - [x] 3.9 Implement Google OAuth integration
    - Set up Google OAuth strategy with passport.js
    - Create OAuth callback endpoint
    - Implement unified authentication logic (same email = same account)
    - _Requirements: Authentication System (Auth.1, Auth.4)_
  
  - [ ]* 3.10 Write property test for unified authentication
    - **Property 2: Unified authentication by email**
    - **Validates: Requirements Auth.4**
  
  - [x] 3.11 Implement role-based authorization middleware
    - Create middleware that checks user role against required role
    - Implement role hierarchy (ADMIN > SHOP > USER > PUBLIC)
    - Return 403 for insufficient permissions
    - _Requirements: Authentication System (Auth.5), Security Requirements (Security.1)_
  
  - [ ]* 3.12 Write property test for role-based route access
    - **Property 3: Role-based route access**
    - **Validates: Requirements Auth.5, Security.1**


- [ ] 4. Product/Inventory management
  - [x] 4.1 Implement Cloudinary image upload service
    - Create service for uploading images to Cloudinary
    - Return imageUrl and imagePublicId
    - Handle upload errors
    - _Requirements: Inventory Management (Inventory.2)_
  
  - [ ]* 4.2 Write property test for Cloudinary image upload
    - **Property 27: Cloudinary image upload**
    - **Validates: Requirements Inventory.1, Inventory.2**
  
  - [x] 4.3 Implement product creation endpoint (ADMIN only)
    - Create POST /api/products endpoint with image upload
    - Validate all required fields
    - Upload image to Cloudinary
    - Save product to database
    - _Requirements: Inventory Management (Inventory.1)_
  
  - [ ]* 4.4 Write property test for product data validation
    - **Property 21: Product data validation**
    - **Validates: Requirements Inventory.9**
  
  - [x] 4.5 Implement product update endpoint (ADMIN only)
    - Create PUT /api/products/:id endpoint
    - Support optional image update
    - Delete old image from Cloudinary if new image provided
    - _Requirements: Inventory Management (Inventory.3)_
  
  - [ ]* 4.6 Write property test for real-time data consistency
    - **Property 17: Real-time data consistency**
    - **Validates: Requirements Inventory.6**
  
  - [x] 4.7 Implement product soft delete endpoint (ADMIN only)
    - Create DELETE /api/products/:id endpoint
    - Set isAvailable to false instead of removing from database
    - _Requirements: Inventory Management (Inventory.5)_
  
  - [ ]* 4.8 Write property test for soft delete preservation
    - **Property 6: Soft delete preservation**
    - **Validates: Requirements Inventory.5**
  
  - [x] 4.9 Implement get products endpoint (PUBLIC)
    - Create GET /api/products endpoint with filters (category, search, available)
    - Return only available products for non-admin users
    - Support pagination
    - _Requirements: Inventory View (InventoryView.1, InventoryView.6)_
  
  - [ ]* 4.10 Write property test for available products filter
    - **Property 9: Available products filter**
    - **Validates: Requirements InventoryView.6**
  
  - [ ]* 4.11 Write property test for product search accuracy
    - **Property 31: Product search accuracy**
    - **Validates: Requirements InventoryView.4**
  
  - [ ]* 4.12 Write property test for category filter accuracy
    - **Property 33: Category filter accuracy**
    - **Validates: Requirements InventoryView.5**
  
  - [x] 4.13 Implement low stock check service
    - Create service that finds products where currentStock < minimumStockLevel
    - Create notifications for low stock items
    - _Requirements: Inventory Management (Inventory.7)_
  
  - [ ]* 4.14 Write property test for low stock alert generation
    - **Property 10: Low stock alert generation**
    - **Validates: Requirements Inventory.7**


- [ ] 5. Daily order system
  - [x] 5.1 Implement order creation endpoint (SHOP only)
    - Create POST /api/orders endpoint
    - Validate deliveryDate is exactly tomorrow
    - Validate products and quantities
    - Calculate total amount
    - Save order with status 'PLACED'
    - _Requirements: Daily Stock Order System (Order.1, Order.4)_
  
  - [ ]* 5.2 Write property test for tomorrow-only order validation
    - **Property 1: Tomorrow-only order validation**
    - **Validates: Requirements Order.1**
  
  - [ ]* 5.3 Write property test for quantity validation
    - **Property 19: Quantity validation**
    - **Validates: Requirements Order.4**
  
  - [x] 5.4 Implement get orders endpoint
    - Create GET /api/orders endpoint with filters (shopId, status, date range)
    - SHOP users can only see their own orders
    - ADMIN can see all orders
    - _Requirements: Daily Stock Order System (Order.8)_
  
  - [ ]* 5.5 Write property test for data isolation for shops
    - **Property 14: Data isolation for shops**
    - **Validates: Requirements Order.8**
  
  - [x] 5.6 Implement order status update endpoint (ADMIN only)
    - Create PUT /api/orders/:id/status endpoint
    - Validate status transitions (PLACED → APPROVED → PACKED → OUT_FOR_DELIVERY → DELIVERED)
    - Add entry to statusHistory array
    - _Requirements: Daily Stock Order System (Order.9)_
  
  - [ ]* 5.7 Write property test for order status progression
    - **Property 11: Order status progression**
    - **Validates: Requirements Order.9**
  
  - [ ]* 5.8 Write property test for status history tracking
    - **Property 13: Status history tracking**
    - **Validates: Requirements EventMgmt.8**
  
  - [x] 5.9 Implement manufacturing plan endpoint (ADMIN only)
    - Create GET /api/orders/manufacturing-plan/:date endpoint
    - Aggregate all orders for the date
    - Calculate product-wise totals (sum quantities by product)
    - Return array of {productId, productName, totalQuantity}
    - _Requirements: Admin Dashboard (Dashboard.3)_
  
  - [ ]* 5.10 Write property test for manufacturing plan accuracy
    - **Property 7: Manufacturing plan accuracy**
    - **Validates: Requirements Dashboard.3**
  
  - [x] 5.11 Implement packing list endpoint (ADMIN only)
    - Create GET /api/orders/packing-list/:date endpoint
    - Get all orders for the date
    - Return shop-wise breakdown with products, address, contact, delivery time
    - _Requirements: Admin Dashboard (Dashboard.4)_
  
  - [ ]* 5.12 Write property test for shop-wise packing list completeness
    - **Property 8: Shop-wise packing list completeness**
    - **Validates: Requirements Dashboard.4**


- [ ] 6. Event order system
  - [x] 6.1 Implement event request creation endpoint (USER, SHOP)
    - Create POST /api/events endpoint
    - Validate all required fields (event details, products, dates)
    - Validate eventDate is in the future
    - Save event request with status 'NEW'
    - _Requirements: Event Order System (Event.1, Event.4, Event.5)_
  
  - [ ]* 6.2 Write property test for required field validation
    - **Property 18: Required field validation**
    - **Validates: Requirements Event.1, Shop.1, Security.3**
  
  - [ ]* 6.3 Write property test for future date validation
    - **Property 20: Future date validation**
    - **Validates: Requirements Event.5**
  
  - [x] 6.4 Implement get event requests endpoint
    - Create GET /api/events endpoint with filters (status, date range)
    - USER/SHOP can only see their own requests
    - ADMIN can see all requests
    - _Requirements: Event Order System (Event.10)_
  
  - [ ]* 6.5 Write property test for data isolation for users
    - **Property 15: Data isolation for users**
    - **Validates: Requirements Event.10**
  
  - [ ]* 6.6 Write property test for admin full data access
    - **Property 16: Admin full data access**
    - **Validates: Requirements ShopMgmt.1, EventMgmt.1**
  
  - [x] 6.7 Implement event status update endpoint (ADMIN only)
    - Create PUT /api/events/:id/status endpoint
    - Support status changes (NEW, CONTACTED, ACCEPTED, REJECTED, COMPLETED)
    - Add entry to statusHistory array with admin notes
    - _Requirements: Event Order Management (EventMgmt.4, EventMgmt.6, EventMgmt.7)_
  
  - [ ]* 6.8 Write property test for event status validity
    - **Property 12: Event status validity**
    - **Validates: Requirements Event.11**
  
  - [ ]* 6.9 Write property test for status filter accuracy
    - **Property 32: Status filter accuracy**
    - **Validates: Requirements EventMgmt.2**


- [ ] 7. Shop partnership system
  - [x] 7.1 Implement shop request creation endpoint (USER only)
    - Create POST /api/shop-requests endpoint
    - Validate all required fields
    - Check user doesn't have pending request
    - Save shop request with status 'PENDING'
    - _Requirements: Shop Partnership Request (Shop.1, Shop.8)_
  
  - [ ]* 7.2 Write property test for single pending shop request per user
    - **Property 4: Single pending shop request per user**
    - **Validates: Requirements Shop.8**
  
  - [x] 7.3 Implement get shop requests endpoint
    - Create GET /api/shop-requests endpoint with status filter
    - USER can only see their own requests
    - ADMIN can see all requests
    - _Requirements: Shop Partnership Request (Shop.7)_
  
  - [x] 7.4 Implement shop request approval endpoint (ADMIN only)
    - Create PUT /api/shop-requests/:id/approve endpoint
    - Update request status to 'APPROVED'
    - Upgrade user role to 'SHOP'
    - Add admin notes
    - _Requirements: Shop Partnership Request (Shop.5, Shop.6)_
  
  - [ ]* 7.5 Write property test for role upgrade on shop approval
    - **Property 5: Role upgrade on shop approval**
    - **Validates: Requirements Shop.5**
  
  - [x] 7.6 Implement shop request rejection endpoint (ADMIN only)
    - Create PUT /api/shop-requests/:id/reject endpoint
    - Update request status to 'REJECTED'
    - Add rejection reason
    - _Requirements: Shop Partnership Request (Shop.5)_
  
  - [x] 7.7 Implement get active shops endpoint (ADMIN only)
    - Create GET /api/shops endpoint
    - Return all users with role 'SHOP'
    - Include order statistics for each shop
    - _Requirements: Shop Management (ShopMgmt.1, ShopMgmt.2)_


- [ ] 8. Notification system
  - [x] 8.1 Implement notification creation service
    - Create service for creating in-app notifications
    - Support different notification types (ORDER, EVENT, SHOP_REQUEST, STOCK, SYSTEM)
    - Set priority levels (HIGH, MEDIUM, LOW)
    - Store metadata for linking to related entities
    - _Requirements: Notification System (Notif.1-8)_
  
  - [x] 8.2 Implement email service with Nodemailer
    - Set up Nodemailer with Gmail SMTP
    - Create email templates for different notification types
    - Implement retry logic for failed sends
    - _Requirements: Notification System (Notif.2, Notif.6, Notif.7)_
  
  - [ ]* 8.3 Write property test for notification content completeness
    - **Property 26: Notification content completeness**
    - **Validates: Requirements Notif.7**
  
  - [x] 8.4 Implement get notifications endpoint
    - Create GET /api/notifications endpoint with unreadOnly filter
    - Return user's notifications sorted by priority and date
    - _Requirements: Notification System (Notif.3)_
  
  - [ ]* 8.5 Write property test for notification priority ordering
    - **Property 24: Notification priority ordering**
    - **Validates: Requirements Dashboard.5**
  
  - [x] 8.6 Implement mark notification as read endpoint
    - Create PUT /api/notifications/:id/read endpoint
    - Update isRead to true
    - _Requirements: Notification System (Notif.4)_
  
  - [x] 8.7 Implement get unread count endpoint
    - Create GET /api/notifications/unread-count endpoint
    - Return count of notifications where isRead = false
    - _Requirements: Notification System (Notif.5)_
  
  - [ ]* 8.8 Write property test for unread count accuracy
    - **Property 25: Unread count accuracy**
    - **Validates: Requirements Notif.5**
  
  - [x] 8.9 Integrate notifications with state changes
    - Add notification creation to order status updates
    - Add notification creation to event status updates
    - Add notification creation to shop request approval/rejection
    - Add notification creation to low stock alerts
    - Send email for each notification
    - _Requirements: Notification System (Notif.2)_
  
  - [ ]* 8.10 Write property test for state change notifications
    - **Property 23: State change notifications**
    - **Validates: Requirements Order.6, Order.7, Event.7, Event.8, Shop.3, Shop.4, Notif.2**


- [ ] 9. Analytics and reporting
  - [x] 9.1 Implement sales analytics endpoint (ADMIN only)
    - Create GET /api/analytics/sales endpoint
    - Support date range and groupBy (day, week, month) parameters
    - Calculate totalRevenue, orderCount, averageOrderValue
    - Return chart data for visualization
    - _Requirements: Analytics & Reports (Analytics.1, Analytics.3)_
  
  - [ ]* 9.2 Write property test for analytics data accuracy
    - **Property 29: Analytics data accuracy**
    - **Validates: Requirements Analytics.1, Dashboard.6**
  
  - [ ]* 9.3 Write property test for date range filtering
    - **Property 30: Date range filtering**
    - **Validates: Requirements Analytics.3**
  
  - [x] 9.4 Implement product performance endpoint (ADMIN only)
    - Create GET /api/analytics/products endpoint
    - Aggregate orders by product for date range
    - Calculate totalQuantity, totalRevenue, orderCount per product
    - _Requirements: Analytics & Reports (Analytics.1)_
  
  - [x] 9.5 Implement shop performance endpoint (ADMIN only)
    - Create GET /api/analytics/shops endpoint
    - Aggregate orders by shop for date range
    - Calculate orderCount, totalRevenue, averageOrderValue per shop
    - _Requirements: Analytics & Reports (Analytics.1)_
  
  - [x] 9.6 Implement growth metrics endpoint (ADMIN only)
    - Create GET /api/analytics/growth endpoint
    - Calculate totalShops, newShopsThisMonth, totalUsers, newUsersThisMonth
    - Calculate revenue growth percentage
    - _Requirements: Analytics & Reports (Analytics.1)_
  
  - [x] 9.7 Implement admin dashboard summary endpoint (ADMIN only)
    - Create GET /api/analytics/dashboard endpoint
    - Return todayOrders, tomorrowOrders, pendingShopRequests, pendingEventRequests
    - Return lowStockCount, recentRevenue
    - _Requirements: Admin Dashboard (Dashboard.1-6)_


- [x] 10. Checkpoint - Backend core complete
  - Ensure all backend tests pass (unit tests and property tests)
  - Verify all API endpoints work with Postman/Thunder Client
  - Check database indexes are created
  - Verify authentication and authorization work correctly
  - Test email sending functionality
  - Test Cloudinary image upload
  - Ask the user if questions arise


- [ ] 11. Frontend setup and routing
  - [x] 11.1 Initialize React project with routing
    - Set up React app with React Router
    - Configure Axios for API calls with base URL and interceptors
    - Set up authentication context for managing user state
    - Create protected route component for role-based access
    - _Requirements: Technical Requirements (Frontend)_
  
  - [x] 11.2 Create layout components
    - Create Header component with navigation and user menu
    - Create Footer component
    - Create Sidebar component for admin pages
    - Create responsive layout wrapper
    - _Requirements: Technical Requirements (Frontend, UI/UX)_
  
  - [x] 11.3 Set up routing structure
    - Define routes for all pages (public, user, shop, admin)
    - Implement protected routes with role checking
    - Set up 404 page
    - _Requirements: Technical Requirements (Frontend)_


- [ ] 12. Authentication pages
  - [x] 12.1 Create Login page
    - Build login form with email and password fields
    - Add Google OAuth button
    - Implement form validation
    - Handle login API call and store JWT token
    - Redirect to appropriate dashboard based on role
    - _Requirements: Authentication System (Auth.1-3)_
  
  - [x] 12.2 Create Signup page
    - Build signup form with name, email, and password fields
    - Add Google OAuth button
    - Implement form validation with password strength indicator
    - Handle signup API call and store JWT token
    - _Requirements: Authentication System (Auth.2)_
  
  - [x] 12.3 Implement authentication context
    - Create context for managing user state (user object, token, role)
    - Implement login, logout, and token refresh functions
    - Add token to Axios interceptor for authenticated requests
    - Handle token expiration and redirect to login
    - _Requirements: Authentication System (Auth.6)_


- [ ] 13. Public pages
  - [x] 13.1 Create Landing page
    - Build hero section with brand message and CTA buttons
    - Add featured products section (fetch from API)
    - Add "What We Do" section
    - Add product highlights
    - Add contact preview
    - Implement responsive design
    - _Requirements: Landing Page (Public)_
  
  - [x] 13.2 Create Products page
    - Build product grid with images from Cloudinary
    - Implement search functionality
    - Add category filter
    - Add sort options (name, price)
    - Show only available products
    - Implement responsive grid layout
    - _Requirements: Inventory View (InventoryView.1-7)_
  
  - [x] 13.3 Create About Us page
    - Add company story and mission
    - Add quality standards section
    - Add contact information
    - Include images from Cloudinary
    - _Requirements: About Us Page_
  
  - [x] 13.4 Create Contact page
    - Build contact form
    - Display contact details (email, phone, address)
    - Add map (optional)
    - Handle form submission
    - _Requirements: Contact Page_


- [ ] 14. User pages
  - [x] 14.1 Create User Dashboard
    - Display quick actions (Event Order, Shop Request buttons)
    - Show recent orders/requests
    - Display notifications
    - Add profile section
    - _Requirements: Technical Requirements (Frontend)_
  
  - [x] 14.2 Create Event Order Form
    - Build multi-step form for event details
    - Add product selection with checkboxes
    - Add quantity inputs for selected products
    - Implement date and time pickers
    - Add form validation
    - Handle form submission
    - _Requirements: Event Order System (Event.1-11)_
  
  - [x] 14.3 Create Shop Request Form
    - Build comprehensive application form
    - Add product interest selection
    - Implement form validation
    - Handle form submission
    - Show pending request status if exists
    - _Requirements: Shop Partnership Request (Shop.1-8)_
  
  - [x] 14.4 Create Order History page
    - Display list of user's event requests
    - Show status for each request
    - Add filter by status
    - Implement request details modal
    - _Requirements: Event Order System (Event.10)_


- [ ] 15. Shop pages
  - [x] 15.1 Create Shop Dashboard
    - Display tomorrow's date (locked, cannot change)
    - Show quick stats (recent orders, pending orders)
    - Add notifications section
    - _Requirements: Daily Stock Order System (Order.1-10)_
  
  - [x] 15.2 Create Daily Order Form
    - Display tomorrow's date prominently (read-only)
    - Build product selection with quantities
    - Add "Skip Order" option
    - Implement form validation (quantities >= 1)
    - Calculate and display total amount
    - Handle form submission
    - _Requirements: Daily Stock Order System (Order.1-10)_
  
  - [x] 15.3 Create Shop Order History page
    - Display list of shop's orders
    - Show status for each order with color coding
    - Add filter by status and date range
    - Implement order details modal
    - _Requirements: Daily Stock Order System (Order.8)_


- [ ] 16. Admin dashboard
  - [x] 16.1 Create Admin Dashboard main page
    - Build daily orders summary section
    - Display manufacturing plan (product-wise totals for tomorrow)
    - Display shop-wise packing list
    - Show recent notifications
    - Add quick stats (active shops, pending requests, low stock)
    - Add quick action buttons
    - Implement real-time data refresh
    - _Requirements: Admin Dashboard (Dashboard.1-8)_
  
  - [x] 16.2 Create Manufacturing Plan component
    - Fetch and display product-wise totals for tomorrow
    - Format as clear list (Product Name: Quantity)
    - Add print functionality
    - _Requirements: Admin Dashboard (Dashboard.3)_
  
  - [x] 16.3 Create Packing List component
    - Fetch and display shop-wise orders for tomorrow
    - Show shop name, products, quantities, address, contact
    - Group by delivery time
    - Add print functionality
    - _Requirements: Admin Dashboard (Dashboard.4)_


- [ ] 17. Admin shop management
  - [x] 17.1 Create Active Shops page
    - Display list of all shops (users with role SHOP)
    - Show shop details (name, contact, address)
    - Add order statistics for each shop
    - Implement shop details modal
    - Add view order history button
    - _Requirements: Shop Management (ShopMgmt.1-3)_
  
  - [x] 17.2 Create New Shop Requests page
    - Display list of pending shop requests
    - Show request details in expandable cards
    - Add approve button with notes input
    - Add reject button with reason input
    - Handle approval/rejection API calls
    - Show success/error messages
    - _Requirements: Shop Management (ShopMgmt.4-8)_


- [ ] 18. Admin event order management
  - [x] 18.1 Create Event Orders page
    - Display list of all event requests
    - Add filter by status (NEW, CONTACTED, ACCEPTED, REJECTED, COMPLETED)
    - Show request summary in cards
    - Implement request details modal
    - Add status update buttons (Accept, Reject, Mark Completed)
    - Add admin notes input
    - Handle status update API calls
    - _Requirements: Event Order Management (EventMgmt.1-8)_


- [ ] 19. Admin inventory management
  - [x] 19.1 Create Inventory Management page
    - Display product list with images
    - Add search and filter functionality
    - Show stock levels with color coding (low stock in red)
    - Add "Add Product" button
    - Add edit and delete buttons for each product
    - _Requirements: Inventory Management (Inventory.1-9)_
  
  - [x] 19.2 Create Add/Edit Product modal
    - Build form for product details
    - Add image upload with preview
    - Implement form validation
    - Handle create/update API calls
    - Show success/error messages
    - _Requirements: Inventory Management (Inventory.1-4)_
  
  - [x] 19.3 Implement product deletion
    - Add confirmation dialog for delete
    - Handle soft delete API call
    - Update product list after deletion
    - _Requirements: Inventory Management (Inventory.5)_


- [ ] 20. Admin analytics
  - [x] 20.1 Create Analytics Dashboard
    - Build sales analytics section with charts
    - Add date range picker
    - Display total revenue, order count, average order value
    - Show sales trend chart (line chart)
    - _Requirements: Analytics & Reports (Analytics.1-7)_
  
  - [x] 20.2 Create Product Performance section
    - Display product-wise sales data in table
    - Show total quantity, revenue, order count per product
    - Add sort functionality
    - Implement bar chart for top products
    - _Requirements: Analytics & Reports (Analytics.1)_
  
  - [x] 20.3 Create Shop Performance section
    - Display shop-wise performance data in table
    - Show order count, revenue, average order value per shop
    - Add sort functionality
    - Implement chart for top shops
    - _Requirements: Analytics & Reports (Analytics.1)_
  
  - [x] 20.4 Create Growth Metrics section
    - Display growth statistics (new shops, new users, revenue growth)
    - Show month-over-month comparison
    - Add trend indicators (up/down arrows)
    - _Requirements: Analytics & Reports (Analytics.1)_


- [ ] 21. Notifications UI
  - [x] 21.1 Create Notifications dropdown component
    - Build notification bell icon with unread count badge
    - Create dropdown with notification list
    - Show notification type, message, and time
    - Add mark as read functionality
    - Add "View All" link to notifications page
    - Implement real-time unread count update
    - _Requirements: Notification System (Notif.1-8)_
  
  - [x] 21.2 Create Notifications page
    - Display full list of notifications
    - Add filter by type and read/unread
    - Show notification details
    - Add mark all as read button
    - Implement pagination
    - _Requirements: Notification System (Notif.1-8)_


- [ ] 22. UI/UX polish and responsive design
  - [x] 22.1 Implement loading states
    - Add loading spinners for API calls
    - Add skeleton loaders for content
    - Implement progress indicators for forms
    - _Requirements: Technical Requirements (UI/UX)_
  
  - [x] 22.2 Implement error handling UI
    - Create error boundary component
    - Add toast notifications for errors
    - Display user-friendly error messages
    - Add retry buttons for failed requests
    - _Requirements: Technical Requirements (UI/UX)_
  
  - [x] 22.3 Implement form validation feedback
    - Add real-time validation messages
    - Show field-level errors
    - Add success messages
    - Implement disabled state for invalid forms
    - _Requirements: Technical Requirements (UI/UX)_
  
  - [x] 22.4 Ensure mobile responsiveness
    - Test all pages on mobile, tablet, desktop
    - Adjust layouts for different screen sizes
    - Ensure touch-friendly buttons and inputs
    - Test navigation on mobile
    - _Requirements: Technical Requirements (UI/UX)_
  
  - [x] 22.5 Apply consistent branding
    - Use AMMUFOODS brand colors throughout
    - Apply consistent typography
    - Add logo to header
    - Ensure professional design aesthetic
    - _Requirements: Technical Requirements (UI/UX)_


- [x] 23. Checkpoint - Frontend complete
  - Test all user flows (signup, login, order placement, etc.)
  - Verify all pages are responsive
  - Check all forms validate correctly
  - Test error handling
  - Verify images load from Cloudinary
  - Test navigation and routing
  - Ask the user if questions arise


- [ ] 24. Integration testing and bug fixes
  - [ ]* 24.1 Write integration tests for critical flows
    - Test complete order placement flow (shop creates order → admin updates status → shop receives notification)
    - Test event request flow (user submits → admin accepts → user receives notification)
    - Test shop approval flow (user applies → admin approves → role upgraded → user can place orders)
    - Test authentication flow (signup → login → access protected routes)
  
  - [x] 24.2 Test email notifications
    - Verify emails are sent for all notification triggers
    - Check email content and formatting
    - Test email delivery reliability
    - _Requirements: Notification System (Notif.2, Notif.6, Notif.7)_
  
  - [x] 24.3 Test image upload and display
    - Upload various image formats and sizes
    - Verify images appear correctly on all pages
    - Test image optimization
    - _Requirements: Inventory Management (Inventory.2)_
  
  - [x] 24.4 Test edge cases and error scenarios
    - Test with empty data
    - Test with invalid input
    - Test with expired tokens
    - Test with insufficient permissions
    - Test with network failures
    - _Requirements: Technical Requirements (Testing)_
  
  - [x] 24.5 Fix identified bugs
    - Address any bugs found during testing
    - Verify fixes don't break existing functionality
    - Re-run tests after fixes


- [ ] 25. Performance optimization
  - [x] 25.1 Optimize database queries
    - Add missing indexes
    - Optimize aggregation pipelines
    - Implement pagination where needed
    - _Requirements: Performance Requirements_
  
  - [x] 25.2 Optimize frontend bundle
    - Implement code splitting
    - Lazy load heavy components
    - Minimize bundle size
    - _Requirements: Performance Requirements_
  
  - [x] 25.3 Optimize images
    - Use Cloudinary transformations for responsive images
    - Implement lazy loading for images
    - _Requirements: Performance Requirements_
  
  - [x] 25.4 Test performance
    - Measure page load times
    - Measure API response times
    - Identify and fix bottlenecks
    - _Requirements: Performance Requirements_


- [ ] 26. Security hardening
  - [x] 26.1 Implement rate limiting
    - Add rate limiting middleware to all endpoints
    - Set stricter limits for auth endpoints
    - _Requirements: Security Requirements (Security.7)_
  
  - [x] 26.2 Add security headers
    - Implement helmet.js for security headers
    - Configure Content-Security-Policy
    - Enable HSTS
    - _Requirements: Security Requirements_
  
  - [x] 26.3 Sanitize error messages
    - Remove stack traces from production errors
    - Ensure no sensitive data in error responses
    - _Requirements: Security Requirements_
  
  - [x] 26.4 Review and test security
    - Test authentication and authorization
    - Test input validation
    - Test for common vulnerabilities (XSS, injection)
    - _Requirements: Security Requirements (Security.1-10)_


- [ ] 27. Deployment preparation
  - [x] 27.1 Configure environment variables
    - Set up production environment variables for backend (Render)
    - Set up production environment variables for frontend (Vercel)
    - Ensure all secrets are secured
    - _Requirements: Deployment Requirements_
  
  - [x] 27.2 Set up MongoDB Atlas production database
    - Create production cluster
    - Configure IP whitelist
    - Set up database user
    - Enable automated backups
    - _Requirements: Deployment Requirements_
  
  - [x] 27.3 Configure Cloudinary for production
    - Set up production folder structure
    - Configure upload presets
    - Set up transformations
    - _Requirements: Deployment Requirements_
  
  - [x] 27.4 Set up Gmail SMTP for production
    - Enable 2FA on Gmail account
    - Generate app-specific password
    - Test email sending from production
    - _Requirements: Deployment Requirements_
  
  - [x] 27.5 Deploy backend to Render
    - Connect GitHub repository
    - Configure build and start commands
    - Set environment variables
    - Deploy and test
    - _Requirements: Deployment Requirements_
  
  - [x] 27.6 Deploy frontend to Vercel
    - Connect GitHub repository
    - Configure build settings
    - Set environment variables
    - Deploy and test
    - _Requirements: Deployment Requirements_
  
  - [x] 27.7 Configure custom domain (optional)
    - Set up DNS records
    - Configure SSL certificate
    - Test domain access
    - _Requirements: Deployment Requirements_


- [ ] 28. Final testing and launch
  - [x] 28.1 Conduct end-to-end testing in production
    - Test all user flows in production environment
    - Test on multiple devices and browsers
    - Verify email notifications work
    - Test image uploads and display
    - _Requirements: Testing Requirements_
  
  - [x] 28.2 Create admin account
    - Create admin user with email ammufoods2018@gmail.com
    - Verify admin has access to all features
    - _Requirements: User Roles (ADMIN)_
  
  - [x] 28.3 Seed initial data (optional)
    - Add initial products to inventory
    - Add product images
    - Test with sample orders
    - _Requirements: Success Criteria_
  
  - [x] 28.4 Set up monitoring and logging
    - Configure error tracking (Sentry optional)
    - Set up log aggregation
    - Configure alerts for critical errors
    - _Requirements: Deployment Requirements_
  
  - [x] 28.5 Create user documentation
    - Write admin user guide
    - Write shop user guide
    - Write event customer guide
    - Document common workflows
    - _Requirements: Success Criteria_
  
  - [x] 28.6 Final checkpoint - Production ready
    - All features working correctly
    - All tests passing
    - Performance meets requirements
    - Security measures in place
    - Documentation complete
    - System ready for daily operations
    - Ask the user for final approval

---

## Notes

- Tasks marked with `*` are optional property-based tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- Both testing approaches are complementary and necessary for production quality

---

## Success Criteria

The implementation will be considered complete when:

- [ ] All core features (P0) are implemented and working
- [ ] Admin can view tomorrow's orders and manufacturing plan
- [ ] Shops can place daily orders for tomorrow only
- [ ] Users can submit event requests and shop applications
- [ ] Admin can manage inventory, shops, and event orders
- [ ] Email notifications work reliably
- [ ] System is secure and performant
- [ ] All critical tests pass
- [ ] System is deployed and accessible
- [ ] Documentation is complete

**This is a production system that will be used daily for business operations. Quality, reliability, and usability are paramount.**
