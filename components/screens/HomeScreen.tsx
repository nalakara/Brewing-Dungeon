import React from 'react';
import { BREWING_METHODS } from '../../constants';
import { useLocalization } from '../../context/LocalizationContext';
import MethodCard from '../MethodCard';
import AiRecommendationForm from '../AiRecommendationForm';

interface HomeScreenProps {
  onSelectMethod: (methodId: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMethod }) => {
  const { t } = useLocalization();

  return (
    <div className="space-y-8">
      <section>
        <AiRecommendationForm />
      </section>

      <section>
        <h2 className="text-2xl font-display mb-4 border-b-2 border-[var(--border-color)] pb-2">{t('brewingMethods')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BREWING_METHODS.map((method) => (
            <MethodCard key={method.id} method={method} onSelectMethod={onSelectMethod} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;