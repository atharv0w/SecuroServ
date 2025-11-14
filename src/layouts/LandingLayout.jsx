import React from "react";
import LandingNavbar from "../Components/LandingNavbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <LandingNavbar />
      <main className="flex-1 pt-20">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
}
