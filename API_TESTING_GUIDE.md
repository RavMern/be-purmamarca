# Purmamarca API Testing Guide

## 🚀 Quick Start

1. **Import the Collection**: Import `postman_collection.json` into Postman
2. **Set Environment Variables**: The collection includes variables for easy testing
3. **Start the Server**: Run `npm run start:dev` to start the NestJS server
4. **Run Tests**: Execute the requests in order for best results

## 📋 API Endpoints Overview

### Base URL

```
http://localhost:3000
```

## 🔐 Authentication Endpoints

### 1. User Signup

- **Method**: `POST`
- **Endpoint**: `/auth/signup`
- **Body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "isAdmin": false
}
```

### 2. User Login

- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

- **Response**: Returns JWT token (automatically saved to collection variable)

## 📂 Categories Endpoints

### 1. Create Category

- **Method**: `POST`
- **Endpoint**: `/categories`
- **Body**:

```json
{
  "name": "Electronics"
}
```

### 2. Get All Categories

- **Method**: `GET`
- **Endpoint**: `/categories`

### 3. Get Category by ID

- **Method**: `GET`
- **Endpoint**: `/categories/{id}`

### 4. Get Category by Name

- **Method**: `GET`
- **Endpoint**: `/categories/name/{name}`

### 5. Update Category

- **Method**: `PATCH`
- **Endpoint**: `/categories/{id}`
- **Body**:

```json
{
  "name": "Electronics & Gadgets"
}
```

### 6. Delete Category

- **Method**: `DELETE`
- **Endpoint**: `/categories/{id}`

## 🛍️ Products Endpoints

### 1. Create Product

- **Method**: `POST`
- **Endpoint**: `/products`
- **Body**:

```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced camera system",
  "color": "Natural Titanium",
  "categoryId": "{{categoryId}}",
  "price": 999,
  "stock": 50,
  "size": "6.1 inch",
  "onSale": true,
  "priceOnSale": 899
}
```

### 2. Get All Products

- **Method**: `GET`
- **Endpoint**: `/products`

### 3. Get Product by ID

- **Method**: `GET`
- **Endpoint**: `/products/{id}`

### 4. Update Product

- **Method**: `PUT`
- **Endpoint**: `/products/{id}`
- **Body**:

```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Latest iPhone with advanced camera system and larger display",
  "color": "Natural Titanium",
  "price": 1099,
  "stock": 30,
  "size": "6.7 inch",
  "onSale": false
}
```

### 5. Patch Product (Set Unavailable)

- **Method**: `PATCH`
- **Endpoint**: `/products/{id}`

### 6. Delete Product

- **Method**: `DELETE`
- **Endpoint**: `/products/{id}`

## 📁 File Upload Endpoints

### 1. Upload Product Images

- **Method**: `POST`
- **Endpoint**: `/files/uploadimages/{productId}`
- **Headers**: `Authorization: Bearer {token}`
- **Body**: Form-data with multiple files
- **File Field**: `files` (multiple files allowed)

## 🔔 Available Now (Stock Notifications)

### 1. Add Email to Waiting List

- **Method**: `POST`
- **Endpoint**: `/available-now`
- **Body**:

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "productId": "{{productId}}"
}
```

### 2. Get Waiting List for Product

- **Method**: `GET`
- **Endpoint**: `/available-now/{productId}`

## 📧 Mailer Endpoints

### 1. Send Newsletter

- **Method**: `POST`
- **Endpoint**: `/mailer/newsletter`
- **Body**:

```json
{
  "title": "New Arrivals",
  "subtitle": "Check out our latest products",
  "description": "Discover our newest collection of electronics and gadgets with amazing deals and discounts."
}
```

## 🏥 Health Check

### 1. App Health Check

- **Method**: `GET`
- **Endpoint**: `/`

## 🧪 Testing Workflow

### Recommended Test Order:

1. **Setup Phase**:
   - Create a category
   - Create a product
   - Sign up a user
   - Login to get auth token

2. **Core Functionality**:
   - Test all CRUD operations for categories
   - Test all CRUD operations for products
   - Test file upload functionality

3. **Advanced Features**:
   - Test stock notification system
   - Test newsletter functionality

4. **Cleanup**:
   - Delete test data if needed

## 🔧 Environment Variables

The Postman collection includes these variables:

- `baseUrl`: http://localhost:3000
- `authToken`: Automatically set after login
- `productId`: Automatically set after creating a product
- `categoryId`: Automatically set after creating a category

## 📊 Expected Response Codes

- `200`: Success
- `201`: Created
- `204`: No Content (for DELETE operations)
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

## 🐛 Common Issues & Solutions

### 1. Database Connection Issues

- Ensure PostgreSQL is running
- Check `.env` file configuration
- Verify database credentials

### 2. File Upload Issues

- Ensure Cloudinary is configured
- Check file size limits (20MB max)
- Verify file types (jpg, jpeg, png, gif, webp)

### 3. Authentication Issues

- Ensure JWT secret is set in `.env`
- Check token expiration
- Verify user credentials

### 4. Validation Errors

- Check required fields
- Verify data types
- Ensure proper JSON format

## 📝 Test Data Examples

### Sample Categories:

```json
{"name": "Electronics"}
{"name": "Clothing"}
{"name": "Books"}
{"name": "Home & Garden"}
```

### Sample Products:

```json
{
  "name": "MacBook Pro 16\"",
  "description": "Powerful laptop for professionals",
  "color": "Space Gray",
  "categoryId": "category-uuid",
  "price": 2499,
  "stock": 25,
  "size": "16 inch",
  "onSale": true,
  "priceOnSale": 2299
}
```

### Sample Users:

```json
{
  "name": "Admin User",
  "email": "admin@purmamarca.com",
  "password": "admin123",
  "isAdmin": true
}
```

## 🚀 Performance Testing

For load testing, consider:

- Testing with multiple concurrent requests
- Testing file upload with large files
- Testing database operations under load
- Monitoring response times

## 📈 Monitoring

Monitor these metrics during testing:

- Response times
- Memory usage
- Database connection pool
- File upload success rates
- Error rates

---

**Happy Testing! 🎉**

For issues or questions, check the server logs and ensure all dependencies are properly installed and configured.

