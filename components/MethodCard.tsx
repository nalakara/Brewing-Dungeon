import React from 'react';
import { BrewingMethod } from '../types';
import { useLocalization } from '../context/LocalizationContext';

interface MethodCardProps {
  method: BrewingMethod;
  onSelectMethod: (methodId: string) => void;
}

const MethodCard: React.FC<MethodCardProps> = ({ method, onSelectMethod }) => {
  const { language } = useLocalization();

  return (
    <div
      onClick={() => onSelectMethod(method.id)}
      className="container-aurora p-4 cursor-pointer transition-all duration-300 ease-in-out hover:transform hover:-translate-y-1"
    >
      <h3 className="font-bold text-lg font-display tracking-wide text-[var(--heading-color)]">{method[`name_${language}`]}</h3>
      <p className="text-sm text-[var(--primary-color)] font-medium">{method[`category_${language}`]}</p>
    </div>
  );
};

export default MethodCard;