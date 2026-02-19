# AMMUFOODS - Complete Business Management System Requirements

## Project Overview
A comprehensive web application for AMMUFOODS, a home-based food manufacturer, to manage daily shop supplies, event orders, inventory, and business analytics.

---

## User Roles

### 1. **PUBLIC VISITOR**
- Can view landing page
- Can view products
- Can view about us
- Can view contact details
- Must sign up/login to place orders

### 2. **USER** (Authenticated)
- All public visitor access
- Can place event orders
- Can request shop partnership
- Can view order history
- Can view inventory

### 3. **SHOP** (Approved Partner)
- All USER access
- Can place daily stock orders (next day only)
- Can skip daily orders if not needed
- Can view order history with status
- Receives email notifications on order status

### 4. **ADMIN** (ammufoods2018@gmail.com)
- Complete system access
- Dashboard with daily orders
- Manage shop requests (approve/reject)
- Manage inventory (add/edit/delete products)
- Manage event orders (accept/reject)
- View analytics and reports
- Receive email notifications
- Manage notifications

---

## Core Features

### 1. LANDING PAGE (Public)

**Purpose**: First impression, brand showcase, call-to-action

**Requirements**:
- Hero section with brand message
- Featured products (3-4 items from inventory)
- "What We Do" section
- Product highlights
- Call-to-action buttons:
  - "Order for Events"
  - "Become a Partner"
  - "View Products"
- Contact information
- About us preview
- Professional design with Ammu Foods branding

**Acceptance Criteria**:
- [ ] Landing page loads in < 2 seconds
- [ ] All images load from Cloudinary
- [ ] Responsive on mobile, tablet, desktop
- [ ] CTA buttons navigate correctly
- [ ] Products load from database dynamically

---

### 2. AUTHENTICATION SYSTEM

**Requirements**:
- Google OAuth (primary method)
- Email/password (alternative)
- Unified authentication (same email = same account)
- Role-based access control
- Secure JWT tokens

**Acceptance Criteria**:
- [x] Google OAuth works
- [x] Email/password signup works
- [x] Email/password login works
- [x] Same email creates single account
- [x] Roles enforced on all routes
- [x] JWT tokens expire after 7 days

---

### 3. EVENT ORDER SYSTEM (USER + SHOP)

**Purpose**: Allow users to request catering for events/parties

**Data Collection**:
- Event name
- Contact person name
- Contact number
- Secondary contact number (optional)
- Event location/address
- Event date and time
- Delivery time
- Products needed (checkbox selection from inventory)
- Approximate quantity for each product
- Special instructions/notes

**Workflow**:
1. User fills event order form
2. Selects products from inventory (checkboxes)
3. Enters quantities for selected products
4. Submits request
5. Admin receives email notification
6. Admin receives in-app notification
7. Request appears in admin event orders page
8. Admin can accept/reject with notes
9. User receives email notification of status
10. User receives in-app notification

**Acceptance Criteria**:
- [ ] Form validates all required fields
- [ ] Products load from inventory dynamically
- [ ] Can select multiple products
- [ ] Quantity input for each selected product
- [ ] Date picker for event date (future dates only)
- [ ] Time picker for delivery time
- [ ] Email sent to admin on submission
- [ ] Email sent to user on status change
- [ ] Request appears in admin dashboard
- [ ] User can view request history
- [ ] Status tracking (NEW, CONTACTED, ACCEPTED, REJECTED, COMPLETED)

---

### 4. SHOP PARTNERSHIP REQUEST (USER)

**Purpose**: Allow users to apply for regular supply partnership

**Data Collection**:
- Shop name
- Shop owner name
- Official business details (GST, license if any)
- Shop full address
- Area/locality
- Contact number
- Alternate contact number
- Daily approximate stock needed (description)
- Preferred delivery time
- Products interested in (checkboxes)
- Additional notes

**Workflow**:
1. User fills shop request form
2. Submits application
3. Admin receives email notification
4. Admin receives in-app notification
5. Request appears in "New Shop Requests" page
6. Admin reviews and approves/rejects
7. If approved:
   - User role upgraded to SHOP
   - User receives approval email
   - Shop added to "Active Shops" list
8. If rejected:
   - User receives rejection email with reason
   - User can reapply after 30 days

**Acceptance Criteria**:
- [ ] Form validates all required fields
- [ ] Can select products interested in
- [ ] Email sent to admin on submission
- [ ] Email sent to user on approval/rejection
- [ ] User role automatically upgraded on approval
- [ ] Shop appears in admin shops list
- [ ] User can check request status
- [ ] Only one pending request per user allowed

---

### 5. DAILY STOCK ORDER SYSTEM (SHOP)

**Purpose**: Allow shop partners to order daily supplies

**Requirements**:
- Order for NEXT DAY ONLY (strict validation)
- Select products from inventory
- Enter quantities
- Can skip if no order needed
- View order history
- Track order status

**Order Status Flow**:
```
PLACED → APPROVED → PACKED → OUT FOR DELIVERY → DELIVERED
```

**Workflow**:
1. Shop user accesses daily order page
2. System shows tomorrow's date (cannot change)
3. Selects products and quantities
4. Submits order
5. Admin receives notification
6. Order appears in admin dashboard
7. Admin updates status as manufacturing progresses
8. Shop receives email on each status change
9. Shop can view order history with status

**Acceptance Criteria**:
- [ ] Can only order for tomorrow (today + 1 day)
- [ ] Cannot order for today or day after tomorrow
- [ ] Products load from inventory
- [ ] Quantity validation (min: 1)
- [ ] Order appears in admin dashboard immediately
- [ ] Email sent to admin on order placement
- [ ] Email sent to shop on status change
- [ ] Shop can view order history
- [ ] Status updates in real-time
- [ ] Can skip order (no order for tomorrow)

---

### 6. INVENTORY MANAGEMENT (ADMIN)

**Purpose**: Manage product catalog

**Features**:
- Add new product
- Edit product details
- Delete product (soft delete)
- Upload product images (Cloudinary)
- Set product availability
- Track stock levels
- Low stock alerts

**Product Fields**:
- Product name
- Description
- Category (optional)
- Unit (kg, liters, pieces, etc.)
- Price per unit
- Current stock quantity
- Minimum stock level (for alerts)
- Product image (Cloudinary)
- Availability status

**Acceptance Criteria**:
- [ ] Can add new product with image upload
- [ ] Image uploads to Cloudinary
- [ ] Can edit product details
- [ ] Can toggle availability
- [ ] Soft delete (mark as unavailable)
- [ ] Products reflect immediately for all users
- [ ] Low stock alerts when stock < minimum level
- [ ] Image optimization for web
- [ ] Validation for all fields

---

### 7. ADMIN DASHBOARD

**Purpose**: Central command center for daily operations

**Sections**:

#### A. **Daily Orders Summary**
- Tomorrow's orders count
- Total items to manufacture
- Shop-wise breakdown
- Priority orders (by time)

#### B. **Manufacturing Plan**
- Product-wise totals for tomorrow
- Example:
  ```
  Ellaneer Payasam: 50 units
  Sweet Beeda: 30 boxes
  Jigarthanda: 40 bottles
  ```

#### C. **Shop-wise Packing List**
- Each shop's order details
- Products and quantities
- Delivery address
- Contact number
- Preferred delivery time

#### D. **Recent Notifications**
- New event orders
- New shop requests
- Low stock alerts
- Order status updates

#### E. **Quick Stats**
- Total active shops
- Pending shop requests
- Pending event orders
- Today's revenue

#### F. **Quick Actions**
- View all orders
- Manage inventory
- View shop requests
- View event orders

**Acceptance Criteria**:
- [ ] Dashboard loads in < 2 seconds
- [ ] Real-time data (no caching)
- [ ] Manufacturing plan accurate
- [ ] Shop-wise packing list complete
- [ ] Notifications sorted by priority
- [ ] Quick stats accurate
- [ ] Quick action buttons work
- [ ] Mobile responsive

---

### 8. SHOP MANAGEMENT (ADMIN)

**Pages**:

#### A. **Active Shops**
- List of all approved shops
- Shop details
- Order history
- Contact information
- Performance metrics (optional)
- Can deactivate shop

#### B. **New Shop Requests**
- List of pending requests
- View full application details
- Approve with notes
- Reject with reason
- Email sent automatically

**Acceptance Criteria**:
- [ ] Can view all active shops
- [ ] Can view shop details
- [ ] Can view shop order history
- [ ] Can approve shop requests
- [ ] Can reject with reason
- [ ] Email sent on approval/rejection
- [ ] User role upgraded automatically
- [ ] Shop added to active list on approval

---

### 9. EVENT ORDER MANAGEMENT (ADMIN)

**Purpose**: Manage event/catering requests

**Features**:
- View all event requests
- Filter by status (NEW, CONTACTED, ACCEPTED, REJECTED, COMPLETED)
- View full request details
- Contact customer
- Accept request
- Reject request with reason
- Mark as completed
- Add admin notes

**Workflow**:
1. Admin views event requests
2. Reviews details
3. Contacts customer if needed
4. Accepts or rejects
5. Customer receives email
6. Admin marks as completed after delivery
7. Request archived

**Acceptance Criteria**:
- [ ] Can view all event requests
- [ ] Can filter by status
- [ ] Can view full details
- [ ] Can accept/reject
- [ ] Email sent to customer
- [ ] Can add admin notes
- [ ] Can mark as completed
- [ ] Status history tracked

---

### 10. NOTIFICATION SYSTEM

**Types**:

#### A. **In-App Notifications**
- New event orders
- New shop requests
- Daily orders placed
- Low stock alerts
- Order status updates

#### B. **Email Notifications**

**To Admin**:
- New event order submitted
- New shop request submitted
- Daily order placed
- Low stock alert

**To User/Shop**:
- Shop request approved/rejected
- Event order accepted/rejected
- Order status updated
- Order delivered

**Priority Levels**:
- HIGH: Daily orders, low stock
- MEDIUM: Event orders, shop requests
- LOW: General updates

**Acceptance Criteria**:
- [ ] In-app notifications display correctly
- [ ] Email notifications sent reliably
- [ ] Notifications sorted by priority
- [ ] Can mark as read
- [ ] Unread count displayed
- [ ] Email templates professional
- [ ] Email includes relevant details
- [ ] Notification preferences (optional)

---

### 11. ANALYTICS & REPORTS (ADMIN)

**Purpose**: Business insights for growth

**Reports**:

#### A. **Sales Analytics**
- Daily sales
- Weekly sales
- Monthly sales
- Yearly sales
- Revenue trends
- Product-wise sales

#### B. **Stock Movement**
- Products moved (daily/weekly/monthly)
- Most popular products
- Least popular products
- Stock turnover rate

#### C. **Shop Performance**
- Orders per shop
- Revenue per shop
- Most active shops
- Inactive shops

#### D. **Event Orders**
- Total event orders
- Acceptance rate
- Revenue from events
- Popular event products

#### E. **Growth Metrics**
- New shops added
- Total active shops
- Customer growth
- Revenue growth

**Visualization**:
- Charts (line, bar, pie)
- Tables with sorting
- Date range filters
- Export to PDF/Excel (optional)

**Acceptance Criteria**:
- [ ] All analytics accurate
- [ ] Charts display correctly
- [ ] Date range filters work
- [ ] Data updates in real-time
- [ ] Mobile responsive
- [ ] Performance optimized
- [ ] Export functionality (optional)

---

### 12. INVENTORY VIEW (USER + SHOP)

**Purpose**: Browse available products

**Features**:
- Grid view of products
- Product images from Cloudinary
- Product details (name, description, price, unit)
- Availability status
- Search functionality
- Category filter (optional)
- Sort by name/price

**Acceptance Criteria**:
- [ ] Products load from database
- [ ] Images load from Cloudinary
- [ ] Grid responsive on all devices
- [ ] Search works correctly
- [ ] Filters work correctly
- [ ] Only available products shown
- [ ] Professional design

---

### 13. ABOUT US PAGE

**Content**:
- Company story
- Mission and vision
- What we do
- Why choose us
- Quality standards
- Contact information
- Team (optional)
- Gallery (optional)

**Acceptance Criteria**:
- [ ] Professional content
- [ ] Images from Cloudinary
- [ ] Mobile responsive
- [ ] Contact details accurate
- [ ] Brand consistent

---

### 14. CONTACT PAGE

**Content**:
- Contact form
- Email: ammufoods2018@gmail.com
- Phone number
- Address
- Business hours
- Map (optional)
- Social media links (optional)

**Acceptance Criteria**:
- [ ] Contact form works
- [ ] Email sent on form submission
- [ ] All details accurate
- [ ] Mobile responsive
- [ ] Map displays correctly (optional)

---

## Technical Requirements

### Backend

#### Database Models
1. **User** - Authentication and roles
2. **Product** - Inventory items
3. **Order** - Daily shop orders
4. **EventRequest** - Event/catering orders
5. **ShopRequest** - Partnership applications
6. **Notification** - In-app notifications
7. **AuditLog** - System activity tracking

#### APIs Required
- Authentication (Google OAuth + Email/Password)
- Product CRUD
- Order management
- Event order management
- Shop request management
- Notification management
- Analytics data
- Image upload (Cloudinary)

#### Email Integration
- Nodemailer with Gmail SMTP
- HTML email templates
- Reliable delivery
- Error handling

#### Image Storage
- Cloudinary integration
- Image optimization
- Secure upload
- CDN delivery

### Frontend

#### Pages Required
1. Landing page
2. Login page
3. Signup page
4. Home/Dashboard (user)
5. Event order form
6. Shop request form
7. Inventory view
8. About us
9. Contact
10. Profile
11. Order history
12. Admin dashboard
13. Admin shops management
14. Admin event orders
15. Admin inventory management
16. Admin analytics
17. Admin notifications

#### UI/UX Requirements
- Mobile-first responsive design
- Consistent branding (Ammu Foods colors)
- Loading states
- Error handling
- Form validation
- Toast notifications
- Professional design
- Fast performance

---

## Security Requirements

- [ ] JWT authentication
- [ ] Role-based access control
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] Secure password hashing
- [ ] HTTPS in production
- [ ] Environment variables secured

---

## Performance Requirements

- [ ] Page load < 2 seconds
- [ ] API response < 500ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Caching where appropriate
- [ ] Lazy loading
- [ ] Code splitting

---

## Testing Requirements

- [ ] All user flows tested
- [ ] All admin flows tested
- [ ] Email delivery tested
- [ ] Image upload tested
- [ ] Mobile responsive tested
- [ ] Cross-browser tested
- [ ] Error scenarios tested

---

## Deployment Requirements

- [ ] Backend on Render
- [ ] Frontend on Vercel
- [ ] Database on MongoDB Atlas
- [ ] Images on Cloudinary
- [ ] Environment variables configured
- [ ] Domain configured (optional)
- [ ] SSL certificate
- [ ] Monitoring setup

---

## Success Criteria

### For Admin (Business Owner)
- [ ] Can see tomorrow's orders at a glance
- [ ] Can manufacture correct quantities
- [ ] Can pack shop-wise orders easily
- [ ] Can manage inventory efficiently
- [ ] Can approve shops quickly
- [ ] Can track business growth
- [ ] Receives timely notifications
- [ ] Can make data-driven decisions

### For Shop Partners
- [ ] Can order supplies easily
- [ ] Receives orders on time
- [ ] Can track order status
- [ ] Receives timely notifications
- [ ] Can skip orders when needed

### For Event Customers
- [ ] Can place orders easily
- [ ] Receives confirmation quickly
- [ ] Can track request status
- [ ] Receives quality service

---

## Priority Levels

### P0 (Critical - Must Have)
- Authentication system
- Daily order system
- Admin dashboard with manufacturing plan
- Inventory management
- Shop request approval
- Email notifications

### P1 (High - Should Have)
- Event order system
- Analytics
- In-app notifications
- Order status tracking
- Shop management

### P2 (Medium - Nice to Have)
- Advanced analytics
- Export functionality
- Search and filters
- Performance optimizations

### P3 (Low - Future)
- Mobile app
- SMS notifications
- Advanced reporting
- Customer portal

---

## Timeline Estimate

- **Phase 1** (P0 features): 3-4 days
- **Phase 2** (P1 features): 2-3 days
- **Phase 3** (P2 features): 2-3 days
- **Testing & Polish**: 1-2 days
- **Total**: 8-12 days

---

## Notes

- System must be production-ready
- Code must be clean and maintainable
- Documentation must be comprehensive
- All features must work seamlessly
- Mobile-first approach
- Professional design
- Scalable architecture

---

**This is a real business system that will be used daily for operations. Quality and reliability are paramount.**
