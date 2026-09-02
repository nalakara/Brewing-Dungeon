import React, { useState } from 'react';
import { BrewingMethod } from '../../types';
import { useLocalization } from '../../context/LocalizationContext';
import BrewTimer from '../BrewTimer';

interface MethodDetailScreenProps {
  method: BrewingMethod;
  onBack: () => void;
}

const TimerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MethodDetailScreen: React.FC<MethodDetailScreenProps> = ({ method, onBack }) => {
  const { language, t } = useLocalization();
  const [isTimerVisible, setIsTimerVisible] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center space-x-2 text-[var(--accent-color)] hover:text-[var(--heading-color)] transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="font-bold">Back</span>
      </button>

      <div className="relative">
          <img src={method.image_url} alt={method[`name_${language}`]} className="w-full h-48 object-cover shadow-lg rounded-lg" />
      </div>


      <div className="container-aurora p-3 flex justify-between items-center">
        <h3 className="text-md font-bold text-[var(--heading-color)]">{t('recommendedRatio')}</h3>
        <span className="text-2xl font-display text-[var(--secondary-color)]">{method.recommended_ratio}</span>
      </div>

      <p className="leading-relaxed text-justify">{method[`description_${language}`]}</p>

      <DetailSection title={t('instructions')}>
        {!isTimerVisible && (
            <button
                onClick={() => setIsTimerVisible(true)}
                className="btn-aurora primary w-full py-2 mb-4 flex items-center justify-center space-x-2"
                >
                <TimerIcon className="w-5 h-5" />
                <span>{t('startBrewing')}</span>
            </button>
        )}
        {isTimerVisible && <BrewTimer onClose={() => setIsTimerVisible(false)} />}
        <ol className="list-decimal list-inside space-y-2">
            {method[`instructions_${language}`].map((step, index) => (
                <li key={index}>{step}</li>
            ))}
        </ol>
      </DetailSection>

      <DetailSection title={t('coffeeCharacteristics')}>
        <p>{method[`coffee_characteristics_${language}`]}</p>
      </DetailSection>
      
      <DetailSection title={t('chemicalReactions')}>
        <p>{method[`chemical_reactions_${language}`]}</p>
      </DetailSection>

      <DetailSection title={t('physicalPrinciples')}>
        <p>{method[`physical_principles_${language}`]}</p>
      </DetailSection>
    </div>
  );
};

interface DetailSectionProps {
    title: string;
    children: React.ReactNode;
}

const DetailSection: React.FC<DetailSectionProps> = ({ title, children }) => {
    return (
        <div className="container-aurora p-4">
            <h3 className="text-xl font-display text-[var(--primary-color)] mb-3">{title}</h3>
            {children}
        </div>
    );
};

export default MethodDetailScreen;