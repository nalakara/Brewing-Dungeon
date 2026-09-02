import React, { useState, useEffect, useRef } from 'react';

interface BrewTimerProps {
  onClose: () => void;
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const BrewTimer: React.FC<BrewTimerProps> = ({ onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Fix for line 23: Replaced NodeJS.Timeout with a cross-platform compatible type to resolve the 'Cannot find namespace "NodeJS"' error in a browser environment.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  return (
    <div className="container-aurora p-4 my-4 animate-fade-in relative">
        <button onClick={onClose} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors">
            <CloseIcon className="w-5 h-5" />
        </button>
      <div className="text-center">
        <p className="font-display text-6xl text-[var(--heading-color)] mb-4">{formatTime(seconds)}</p>
        <div className="flex justify-center space-x-4">
          <button onClick={handleStartPause} className="btn-aurora primary w-28 py-2">
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={handleReset} className="btn-aurora w-28 py-2">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrewTimer;