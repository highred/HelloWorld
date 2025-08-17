
import React from 'react';
import { TUTORIAL_STEPS } from './constants';
import { Step } from './types';
import StepCard from './components/StepCard';
import ConnectionTest from './components/ConnectionTest';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100 text-content font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Your First Full-Stack "Hello World"
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            An interactive guide to deploying a complete application using the modern web's best tools.
          </p>
        </header>

        <div className="space-y-8">
          {TUTORIAL_STEPS.map((step: Step, index: number) => (
            <StepCard key={index} step={step} number={index + 1} />
          ))}
        </div>
        
        <section className="mt-16 bg-base-200 p-8 rounded-xl shadow-lg border border-base-300">
            <h2 className="text-3xl font-bold text-white text-center mb-6">Test Your Connection</h2>
            <ConnectionTest />
        </section>

        <footer className="text-center mt-16 text-gray-500">
            <p>Built with React, TypeScript, and Tailwind CSS.</p>
            <p>You've got this! Happy coding!</p>
        </footer>
      </main>
    </div>
  );
};

export default App;