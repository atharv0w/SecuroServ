import React, { useEffect, useState } from "react";
import DashNavbar from "../Components/DashNavbar";
import StatsOverview from "../Components/StatsOverview";
import { getToken, fetchMe } from "../auth.jsx";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    fetchMe().then((data) => {
      setUser(data?.user || null);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <DashNavbar />

      {/* Scrollable Section */}
      <main className="flex-1 overflow-y-auto px-0 py-0">
        <StatsOverview />

        {user && (
          <p className="mt-6 text-sm text-zinc-400">
            Logged in as <strong>{user.username || user.email}</strong>
          </p>
        )}
      </main>
    </div>
  );
}
