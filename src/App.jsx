import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import LandingLayout from "./layouts/LandingLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/SignUp.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import Features from "./Pages/Features.jsx";
import Dashboard from "./Pages/Dashboard";
import FileUploadPage from "./Pages/DataUploadPage.jsx";
import MyVault from "./Pages/MyVault.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import { sanitizeAuthStorage } from "./auth.jsx";


export default function App() {
  sanitizeAuthStorage();

  
  useEffect(() => {
    const preventDefaultDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragover", preventDefaultDrop);
    window.addEventListener("drop", preventDefaultDrop);

    return () => {
      window.removeEventListener("dragover", preventDefaultDrop);
      window.removeEventListener("drop", preventDefaultDrop);
    };
  }, []);

  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/features" element={<Features />} />

          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRedirect>
                <Signup />
              </AuthRedirect>
            }
          />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              
              <Dashboard />
            </ProtectedRoute>
          }
        />
        

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/data-uploads" element={<FileUploadPage />} />
          <Route path="/myVault" element={< MyVault/>} />
        </Route>


        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


function AuthRedirect({ children }) {
  const token = localStorage.getItem("sv_token");

  const isValid =
    token &&
    token !== "null" &&
    token !== "undefined" &&
    token.trim() !== "" &&
    token.split(".").length === 3;

  if (isValid) {
    console.log("[AuthRedirect] Valid token detected → redirecting to /dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  return null;
}