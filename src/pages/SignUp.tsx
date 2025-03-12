
import React from "react";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const SignUp = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Get Started</h1>
          <p className="text-foreground/70">Create your ResumeAI account</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <ClerkSignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                formFieldInput: "rounded-lg border-gray-300 focus:border-primary focus:ring-primary",
                footerActionLink: "text-primary hover:text-primary/90",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
              },
            }}
            routing="path"
            path="/sign-up"
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
