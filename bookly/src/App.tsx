// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Homepage';
import AddBookPage from './pages/AddBookPage';
import BookExplore from './pages/BookExplore';
import BookPreview from './pages/BookPreview';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout'; // ✅ New
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/explore"
          element={
            <Layout>
              <BookExplore />
            </Layout>
          }
        />
        <Route
          path="/book/:id"
          element={
            <Layout>
              <BookPreview />
            </Layout>
          }
        />
        <Route
          path="/add"
          element={
            user ? (
              <Layout>
                <AddBookPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
