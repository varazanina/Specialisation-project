import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import "./config/Firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";

import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { CreatePage } from "./pages/CreatePage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { TripAnimation } from "./components/TripAnimation";
import { MapPage } from "./pages/MapPage";
import { CreateTagsPage } from "./pages/CreateTagsPage";
import { CreateActivitiesPage } from "./pages/CreateActivitiesPage";

export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth")); // start default value comes from localStorage

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        //user is authenticated / signed in
        setIsAuth(true); // set isAuth to true
        localStorage.setItem("isAuth", true); // also, save isAuth in localStorage
      } else {
        // user is not authenticated / not signed in
        setIsAuth(false); // set isAuth to false
        localStorage.removeItem("isAuth"); // remove isAuth from localStorage
      }
    });
  }, []);

  // variable holding all private routes including the nav bar
  const privateRoutes = (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/trips/tags/:tripId" element={<CreateTagsPage />} />
        <Route
          path="/trips/activities/:tripId"
          element={<CreateActivitiesPage />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );

  // variable holding all public routes
  const publicRoutes = (
    <Routes>
      <Route path="/animation" element={<TripAnimation />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="*" element={<Navigate to="/animation" />} />
    </Routes>
  );

  // if user is authenticated, show privateRoutes, else show publicRoutes
  return <main>{isAuth ? privateRoutes : publicRoutes}</main>;
}
