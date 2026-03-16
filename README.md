# Carpentry Service Marketplace (Quiz6)

Full-stack web app for carpentry and woodwork services.

- Frontend: React + Redux + React-Bootstrap
- Backend: Django + Django REST Framework + JWT
- Payments: PayPal (Sandbox)
- Chatbot: Gemini API (with carpentry fallback responses)

## 1. Prerequisites

Install these first:

- Node.js (LTS, includes npm)
- Python 3.11+ (project currently runs in a virtual environment)
- Git

## 2. Project Structure

- frontend/: React app
- backend/: Django project and APIs
- myvenv/: Python virtual environment (local)

## 3. Environment Variables

### 3.1 Frontend env

Create `frontend/.env`:

```env
REACT_APP_PAYPAL_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID
```

### 3.2 Backend env

Create `backend/.env`:

```env
# Django
DJANGO_DEBUG=true
DJANGO_SECRET_KEY=replace-with-your-own-secret

# Gemini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-1.5-flash

# PayPal (for backend verification)
PAYPAL_CLIENT_ID=YOUR_PAYPAL_SANDBOX_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_SANDBOX_CLIENT_SECRET
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Notes:

- `.env` files are gitignored and should never be committed.
- Restart frontend/backend after changing env values.

## 4. Install Dependencies

From project root (`C:\Users\daneilla marie\Documents\Quiz6`):

### 4.1 Backend Python dependencies

If you already have `myvenv`:

```powershell
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/python.exe" -m pip install -r "c:/Users/daneilla marie/Documents/Quiz6/backend/requirements.txt"
```

If you do not have a venv yet:

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6"
python -m venv myvenv
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/Activate.ps1"
python -m pip install --upgrade pip
python -m pip install -r "backend/requirements.txt"
```

### 4.2 Frontend dependencies

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/frontend"
npm install
```

## 5. Backend First-Time Setup

Run these once (or whenever database is reset):

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/backend"
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/python.exe" manage.py migrate
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/python.exe" manage.py seed_data
```

This seeds:

- Admin account
- Sample carpentry services

## 6. Run the App

Use two terminals.

### Terminal A: Backend

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/backend"
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/python.exe" manage.py runserver 8000
```

Backend URL: `http://127.0.0.1:8000`

### Terminal B: Frontend

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/frontend"
npm start
```

Frontend URL: `http://localhost:3000`

## 7. Default Admin Login

After `seed_data`:

- Email: `admin@platform.local`
- Password: `admin12345`

## 8. How to Navigate the Website

### 8.1 Guest (not signed in)

Can:

- View service list and service details
- Open Sign In / Sign Up

Cannot:

- Access profile
- Access checkout
- Access chatbot
- Access seller dashboard
- Access user management

Protected pages automatically redirect to Sign In.

### 8.2 Regular User

Flow:

1. Sign up on `/signup`
2. Sign in on `/signin`
3. Browse services on `/`
4. Open a service detail page (`/service/:id`)
5. Checkout (`/checkout/:id`) using PayPal
6. See orders/history in `/profile`
7. Ask chatbot on `/chatbot`
8. Apply as seller on `/apply-seller`

### 8.3 Admin

Flow:

1. Sign in with admin account
2. Open `/users`
3. Manage users (edit/delete non-admin users)
4. Review seller applications
5. Approve application and assign merchant ID
6. Approved seller can now access seller dashboard

### 8.4 Seller

Flow after approval:

1. Sign in
2. Open `/seller/dashboard`
3. Add/edit/delete services
4. Services appear in the marketplace list

## 9. PayPal + Order Handling Summary

- Frontend uses PayPal Sandbox Client ID from `frontend/.env`.
- Backend validates PayPal order data before creating order records.
- In DEBUG mode, mock transaction IDs are allowed for local testing.

## 10. Chatbot Summary

- Backend chatbot endpoint: `/api/v1/chat/ask/`
- Uses Gemini if `GEMINI_API_KEY` is set.
- Falls back to built-in carpentry responses if Gemini is unavailable.

## 11. Useful Commands

### Run Django checks

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/backend"
& "c:/Users/daneilla marie/Documents/Quiz6/myvenv/Scripts/python.exe" manage.py check
```

### Build frontend

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6/frontend"
npm run build
```

### See local git status

```powershell
Set-Location "c:/Users/daneilla marie/Documents/Quiz6"
git status --short
```
