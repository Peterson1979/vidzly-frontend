
import React from 'react';
import { CheckCircleIcon, ArrowLeftIcon } from '../constants';
import { useNavigate } from 'react-router-dom';

const SubscriptionScreen: React.FC = () => {
  const navigate = useNavigate();
  const premiumBenefits = [
    "Ad-free viewing experience",
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-8">
         <button
            onClick={() => navigate(-1)}
            className="p-2 mr-2 rounded-full hover:bg-muted dark:hover:bg-gray-700"
            aria-label="Go back"
        >
            <ArrowLeftIcon className="w-6 h-6 text-foreground dark:text-gray-100" />
        </button>
        <h1 className="text-3xl font-bold text-foreground dark:text-gray-100">Vidzly Premium</h1>
      </div>

      <div className="text-center mb-10">
        <p className="text-lg md:text-xl text-muted-foreground dark:text-gray-300 max-w-2xl mx-auto">
            Upgrade to Vidzly Premium for an uninterrupted experience. 
            Say goodbye to ads and enjoy endless scrolling with no distractions. 
            Your support keeps Vidzly fast, clean, and fun!
        </p>
      </div>


      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="bg-card p-8 rounded-xl shadow-xl dark:bg-gray-800 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-semibold text-primary mb-2">Monthly Plan</h2>
          <p className="text-4xl font-bold text-foreground mb-1 dark:text-gray-100">$4.99 <span className="text-lg font-normal text-muted-foreground dark:text-gray-400">/ month</span></p>
          <p className="text-sm text-muted-foreground mb-6 dark:text-gray-400">Billed monthly. Cancel anytime.</p>
          <button className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
            Choose Monthly
          </button>
        </div>

        <div className="bg-card p-8 rounded-xl shadow-xl border-2 border-primary dark:bg-gray-800 dark:border-primary-light transform hover:scale-105 transition-transform duration-300 relative">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-bl-lg rounded-tr-lg">
            Best Value
          </div>
          <h2 className="text-2xl font-semibold text-primary mb-2">Annual Plan</h2>
          <p className="text-4xl font-bold text-foreground mb-1 dark:text-gray-100">$49.99 <span className="text-lg font-normal text-muted-foreground dark:text-gray-400">/ year</span></p>
          <p className="text-sm text-muted-foreground mb-6 dark:text-gray-400">Save 20%! Billed annually.</p>
          <button className="w-full py-3 px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition-colors duration-300">
            Choose Annual
          </button>
        </div>
      </div>

      <div className="mt-12 bg-card p-8 rounded-xl shadow-lg dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-foreground mb-6 dark:text-gray-100">What you get with Premium:</h3>
        <ul className="space-y-3">
          {premiumBenefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-muted-foreground dark:text-gray-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Removed "Not ready to subscribe" section */}
    </div>
  );
};

export default SubscriptionScreen;