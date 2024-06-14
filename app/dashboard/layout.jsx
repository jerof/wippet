import React from "react";
import Navbar from "./_components/Navbar";

function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="mx-5 md:mx-20 lg:mx-36 mt-10">{children}</div>
    </div>
  );
}

export default DashboardLayout;
