
import React from 'react';
import type { Step } from '../types';

interface StepCardProps {
  step: Step;
  number: number;
}

const StepCard: React.FC<StepCardProps> = ({ step, number }) => {
  return (
    <section className="bg-base-200 rounded-xl shadow-lg overflow-hidden border border-base-300 transition-shadow hover:shadow-2xl">
      <div className="p-6 md:p-8">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 w-12 h-12 bg-brand-primary/20 text-brand-primary rounded-full flex items-center justify-center mr-4 border-2 border-brand-primary/50">
            {step.icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">{step.title}</h2>
          <span className="ml-auto text-5xl font-black text-base-300/50 hidden md:block">
            {number}
          </span>
        </div>
        <div className="prose prose-invert prose-p:text-content prose-a:text-brand-primary max-w-none">
            {step.content}
        </div>
      </div>
    </section>
  );
};

export default StepCard;