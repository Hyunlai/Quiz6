import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import HomeScreen from './Screens/HomeScreen';
import DetailScreen from './Screens/DetailScreen';
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import ApplySeller from './Screens/ApplySeller';
import UserScreen from './Screens/UserScreen';
import SellerDashboard from './Screens/SellerDashboard';
import UserProfile from './Screens/UserProfile';
import CheckoutScreen from './Screens/CheckoutScreen';
import ChatbotScreen from './Screens/ChatbotScreen';
import { getAccessToken, getCurrentUser } from './authService';

function ProtectedRoute({ children, allowAdminOnly = false, allowSellerOnly = false }) {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const accessToken = getAccessToken();

  if (!currentUser || !accessToken) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (allowAdminOnly && currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (allowSellerOnly && currentUser.role !== 'Seller' && currentUser.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <div className="app-shell bg-body-tertiary">
        <Header />
        <main className="py-4">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/service/:id" element={<DetailScreen />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/profile"
                element={(
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/apply-seller"
                element={(
                  <ProtectedRoute>
                    <ApplySeller />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/users"
                element={(
                  <ProtectedRoute allowAdminOnly>
                    <UserScreen />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/seller/dashboard"
                element={(
                  <ProtectedRoute allowSellerOnly>
                    <SellerDashboard />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/checkout/:id"
                element={(
                  <ProtectedRoute>
                    <CheckoutScreen />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/chatbot"
                element={(
                  <ProtectedRoute>
                    <ChatbotScreen />
                  </ProtectedRoute>
                )}
              />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;