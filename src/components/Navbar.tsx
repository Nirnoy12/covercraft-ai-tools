
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8",
        isScrolled
          ? "py-4 backdrop-blur-md bg-white/90 shadow-sm"
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary">ResumeAI</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Pricing
          </a>
          
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  Login
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary text-sm">
                  Get Started Free
                </button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8"
                  }
                }}
              />
            </>
          )}
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-foreground focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 p-4 bg-white shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4 pt-2 pb-4">
            <a
              href="#features"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </a>
            
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button 
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2 text-left"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="btn-primary text-sm mx-4 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-4 py-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
