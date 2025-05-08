import React, { useEffect } from "react";

import Navbar from "../components/Navbar";

const Dashboard = () => {
  
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div className="flex">
        <Navbar />
        Dashboard
      </div>
    </>
  );
};

export default Dashboard;
