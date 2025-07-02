# Balance Request Debug Guide

## 🚨 Issue: "Not Found" Error on Submit Request Button

### Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Try to submit a balance request
4. Look for error messages like:
   - `404 Not Found`
   - `Network Error`
   - `CORS Error`
   - `Authentication Error`

### Step 2: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Try to submit a balance request
3. Look for the failed request and note:
   - **Request URL**: Should be `http://localhost:5000/api/user/balance-request`
   - **Request Method**: Should be `POST`
   - **Response Status**: What status code?
   - **Response Body**: Any error message?

### Step 3: Verify Backend Status
Run this test to check if the endpoint exists:
```bash
node test-balance-request-endpoint.js
```

### Step 4: Check Authentication
1. Open browser console
2. Type: `localStorage.getItem('token')`
3. Should return a valid JWT token
4. If it returns `null`, you need to login again

### Step 5: Test API Directly
You can test the API directly using curl or Postman:
```bash
curl -X POST http://localhost:5000/api/user/balance-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"requestedAmount": 100, "reason": "Test request"}'
```

## 🔧 Common Solutions

### Solution 1: Backend Not Running
**Symptoms**: Network Error, Connection Refused
**Fix**: 
```bash
cd backend
npm start
```

### Solution 2: Invalid Token
**Symptoms**: 401 Unauthorized, 403 Forbidden
**Fix**: 
1. Logout and login again
2. Check if token is expired

### Solution 3: CORS Issue
**Symptoms**: CORS Error in console
**Fix**: Backend CORS is already configured, restart backend server

### Solution 4: Route Not Found
**Symptoms**: 404 Not Found
**Fix**: Check if userRoutes.js is properly imported in server.js

### Solution 5: Database Connection
**Symptoms**: 500 Internal Server Error
**Fix**: Make sure MongoDB is running

## 📋 Expected Behavior

### When Working Correctly:
1. Click "Submit Request" button
2. Request sent to `POST /api/user/balance-request`
3. Backend validates request
4. Request saved to database
5. Success message displayed
6. Modal closes

### Error Responses:
- **400**: Invalid amount or reason
- **401**: No token or invalid token
- **404**: Endpoint not found
- **500**: Server error

## 🎯 Quick Fix Checklist

- [ ] Backend server running (`npm start` in backend folder)
- [ ] MongoDB running
- [ ] User is logged in (valid token in localStorage)
- [ ] No CORS errors in browser console
- [ ] Network request shows correct URL
- [ ] Response status is not 404

## 📞 Next Steps

1. **Run the test script**: `node test-balance-request-endpoint.js`
2. **Check browser console** for exact error message
3. **Share the error details** so I can provide specific solution

The backend is working (as shown by your logs), so the issue is likely in the frontend or authentication. 