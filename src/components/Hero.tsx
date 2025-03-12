
import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 gradient-bg overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-50 opacity-70"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-blue-100 mb-8 animate-fade-in">
          <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2"></span>
          <span className="text-sm font-medium text-foreground/80">AI-Powered Resume Builder</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          AI-Powered Resume &<br className="hidden sm:block" /> Cover Letter Generator
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl md:text-2xl text-foreground/80 mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Generate a professional, job-winning resume & cover letter in seconds!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <a href="#signup" className="btn-primary flex items-center space-x-2 group">
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a href="#features" className="text-foreground font-medium flex items-center space-x-2 group transition-colors hover:text-primary">
            <span>See how it works</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto relative animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-blue-100">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
              <div className="text-primary font-medium">Resume & Cover Letter Preview</div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-white rounded-lg shadow-lg border border-blue-50 flex items-center justify-center transform rotate-6">
            <div className="text-primary text-lg font-bold">ATS<br/>Friendly</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
