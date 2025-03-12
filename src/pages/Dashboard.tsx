
import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">ResumeAI Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{user?.firstName}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome to your dashboard!</h2>
          <p className="text-gray-600">
            This is where you'll create and manage your resumes and cover letters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Resume</h3>
            <p className="text-gray-600 mb-4">Start building your professional resume with our AI-powered tools.</p>
            <button className="btn-primary text-sm">Create Resume</button>
          </div>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Cover Letter</h3>
            <p className="text-gray-600 mb-4">Generate a matching cover letter to increase your chances of getting hired.</p>
            <button className="btn-primary text-sm">Create Cover Letter</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
