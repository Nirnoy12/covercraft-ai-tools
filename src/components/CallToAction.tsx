
import React from "react";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section id="signup" className="section relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center p-8 md:p-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to land your dream job?
        </h2>
        <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who have boosted their career with our AI-powered resume and cover letter generator.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="#" className="btn-primary flex items-center space-x-2 group">
            <span>Sign Up Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
