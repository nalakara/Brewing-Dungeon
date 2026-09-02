import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import {
  getUserApiKey,
  setUserApiKey,
  removeUserApiKey,
  fetchServerConfig,
} from '../../services/apiKeyService';
import { Key, Eye, EyeOff, ShieldCheck, Server, AlertCircle, ExternalLink, Check, Trash2 } from 'lucide-react';

const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage } = useLocalization();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);
  const [savedUserKey, setSavedUserKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    const key = getUserApiKey();
    setSavedUserKey(key);
    if (key) {
      setApiKeyInput(key);
    }
    fetchServerConfig().then(cfg => {
      setHasServerKey(cfg.hasServerKey);
    });
  }, []);

  const handleSaveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    setUserApiKey(trimmed);
    setSavedUserKey(trimmed);
    setStatusMessage({
      text: t('apiKeySavedSuccess'),
      type: 'success',
    });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleRemoveApiKey = () => {
    removeUserApiKey();
    setSavedUserKey('');
    setApiKeyInput('');
    setStatusMessage({
      text: t('apiKeyRemovedSuccess'),
      type: 'info',
    });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-[var(--heading-color)]">{t('settings')}</h2>

      {/* BYOK (Bring Your Own API Key) Section */}
      <div className="container-aurora p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-[var(--primary-color)]" />
            <h3 className="font-display font-semibold text-lg text-[var(--heading-color)]">
              {t('apiKeySettings')}
            </h3>
          </div>
          {/* Key Status Pill */}
          {savedUserKey ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('customKeyActive')}
            </span>
          ) : hasServerKey ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--primary-color)]/20 text-[var(--primary-color)] border border-[var(--primary-color)]/30">
              <Server className="w-3.5 h-3.5" />
              {t('serverKeyActive')}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              {t('noKeyActive')}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          {t('apiKeyDesc')}
        </p>

        {/* Input box with toggle visibility */}
        <div className="space-y-2">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={t('apiKeyPlaceholder')}
              className="w-full text-xs p-3 pr-10 rounded bg-[var(--bg-color)] border border-[var(--border-color)] text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[var(--secondary-color)] hover:underline inline-flex items-center gap-1"
            >
              <span>{t('getFreeKey')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center gap-2">
              {savedUserKey && (
                <button
                  type="button"
                  onClick={handleRemoveApiKey}
                  className="btn-aurora px-3 py-1.5 text-xs text-red-300 hover:text-red-200 border-red-500/30 hover:bg-red-500/10 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{t('removeKey')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="btn-aurora primary px-4 py-1.5 text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t('saveKey')}</span>
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded bg-[var(--primary-color)]/10 border border-[var(--primary-color)]/30 text-xs text-[var(--primary-color)] animate-fade-in flex items-center gap-2">
              <Check className="w-3.5 h-3.5" />
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>
      </div>

      {/* General Settings Section */}
      <div className="container-aurora p-5 space-y-4">
        {/* Language Setting */}
        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
          <div>
            <label className="font-medium text-sm text-[var(--heading-color)]">{t('language')}</label>
            <p className="text-[11px] text-gray-400">
              {language === 'id' ? 'Bahasa tampilan aplikasi & prompt AI' : 'App display language & AI prompt'}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setLanguage('en')}
              className={`btn-aurora px-3 py-1 text-xs font-bold ${language === 'en' ? 'active' : ''}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('id')}
              className={`btn-aurora px-3 py-1 text-xs font-bold ${language === 'id' ? 'active' : ''}`}
            >
              ID
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="flex justify-between items-center py-2">
          <span className="font-medium text-sm text-[var(--heading-color)]">{t('appVersion')}</span>
          <span className="text-xs text-[var(--primary-color)] font-mono">1.1.0 (Full-Stack BYOK)</span>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs space-y-1">
        <p className="font-display text-base text-gray-300">{t('appName')}</p>
        <p>Specialty Coffee Extraction & Barista AI Assistant</p>
      </div>
    </div>
  );
};

export default ProfileScreen;
