import { PlusCircle } from "lucide-react";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";

function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Create and start your Interview</p>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        <AddNewInterview />
      </div>
      <InterviewList />
    </div>
  );
}

export default DashboardHome;
