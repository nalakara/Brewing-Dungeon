import React, { useState, useMemo } from 'react';
import { BREWING_METHODS } from '../../constants';
import { useLocalization } from '../../context/LocalizationContext';
import MethodCard from '../MethodCard';

interface SearchScreenProps {
  onSelectMethod: (methodId: string) => void;
}

const SearchScreen: React.FC<SearchScreenProps> = ({ onSelectMethod }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language } = useLocalization();

  const filteredMethods = useMemo(() => {
    if (!searchTerm) {
      return BREWING_METHODS;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return BREWING_METHODS.filter(
      (method) =>
        method[`name_${language}`].toLowerCase().includes(lowercasedTerm) ||
        method[`category_${language}`].toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, language]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2 pl-4 pr-10"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMethods.length > 0 ? (
          filteredMethods.map((method) => (
            <MethodCard key={method.id} method={method} onSelectMethod={onSelectMethod} />
          ))
        ) : (
          <p className="text-center text-gray-500">{t('noResults')}</p>
        )}
      </div>
    </div>
  );
};

export default SearchScreen;