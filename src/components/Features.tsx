
import React from "react";
import { Clock, Wand2, FileDown } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Clock,
      title: "Save Hours of Effort",
      description: "Instantly generate tailored resumes & cover letters.",
      bgColor: "bg-blue-500",
    },
    {
      icon: Wand2,
      title: "AI-Powered Optimization",
      description: "ATS-friendly and role-specific customization.",
      bgColor: "bg-indigo-500",
    },
    {
      icon: FileDown,
      title: "Export & Download",
      description: "Download as PDF or Word with one click.",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <section id="features" className="section">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Powerful Features
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Our AI-powered platform makes creating professional resumes and cover letters effortless.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="glass-card rounded-2xl p-8 card-hover animate-fade-in-up"
            style={{ animationDelay: `${0.2 * index}s` }}
          >
            <div className="feature-icon-container">
              <div className={`feature-icon-bg ${feature.bgColor}`}></div>
              <feature.icon className="feature-icon" />
            </div>
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-foreground/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
