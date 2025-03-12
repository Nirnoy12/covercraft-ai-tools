
import React from "react";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const SignIn = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-foreground/70">Sign in to continue to ResumeAI</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
          <ClerkSignIn
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
            path="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
