
import React, { useState } from "react";
import { Check } from "lucide-react";

const Pricing = () => {
  const [annually, setAnnually] = useState(false);

  const pricingPlans = [
    {
      name: "Free Plan",
      price: 0,
      features: [
        "1 Resume & Cover Letter",
        "Basic Templates",
        "PDF Export",
        "24/7 Support"
      ],
      cta: "Start Free",
      ctaLink: "#signup",
      popular: false
    },
    {
      name: "Pro Plan",
      price: annually ? 49 : 5,
      period: annually ? "/year" : "/month",
      discount: annually ? "Save $11" : null,
      features: [
        "Unlimited Resumes & Cover Letters",
        "Premium Templates",
        "PDF & Word Export",
        "AI Suggestions",
        "Custom Branding",
        "Priority Support"
      ],
      cta: "Upgrade Now",
      ctaLink: "#signup",
      popular: true
    }
  ];

  return (
    <section id="pricing" className="section bg-blue-50/50">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
          Choose the perfect plan that fits your needs.
        </p>
        
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center p-1 rounded-full bg-white shadow-sm border border-blue-100 gap-1">
            <button
              onClick={() => setAnnually(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !annually 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnually(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                annually 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Annually
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card bg-white animate-fade-in-up ${
              plan.popular 
                ? "border-primary" 
                : "border-blue-100"
            }`}
            style={{ animationDelay: `${0.2 * index}s` }}
          >
            {plan.popular && (
              <div className="pricing-highlight">Popular</div>
            )}
            
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold">${plan.price}</span>
              {plan.period && (
                <span className="text-foreground/70 ml-1">{plan.period}</span>
              )}
            </div>
            
            {plan.discount && (
              <div className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded mb-4">
                {plan.discount}
              </div>
            )}
            
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start">
                  <Check className="w-5 h-5 text-primary shrink-0 mr-2" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
            
            <a 
              href={plan.ctaLink} 
              className={`block text-center py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] ${
                plan.popular 
                  ? "bg-primary text-white hover:shadow-lg" 
                  : "bg-white text-primary border border-primary hover:bg-blue-50"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
