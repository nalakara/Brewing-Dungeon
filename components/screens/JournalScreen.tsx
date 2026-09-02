import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../context/LocalizationContext';
import { BrewJournalEntry } from '../../types';
import {
  getJournalEntries,
  updateJournalEntry,
  deleteJournalEntry,
} from '../../services/journalService';
import BrewTimer from '../BrewTimer';
import {
  BookOpen,
  Calendar,
  Coffee,
  Droplets,
  Star,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Thermometer,
  Play,
  Edit3,
  Check,
} from 'lucide-react';

interface JournalScreenProps {
  onNavigateHome: () => void;
}

const JournalScreen: React.FC<JournalScreenProps> = ({ onNavigateHome }) => {
  const { t, language } = useLocalization();
  const [entries, setEntries] = useState<BrewJournalEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');
  const [tempBean, setTempBean] = useState('');

  useEffect(() => {
    setEntries(getJournalEntries());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t('deleteConfirm'))) {
      const updated = deleteJournalEntry(id);
      setEntries(updated);
      if (expandedId === id) setExpandedId(null);
      if (activeTimerId === id) setActiveTimerId(null);
    }
  };

  const handleRatingChange = (id: string, rating: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateJournalEntry(id, { rating });
    setEntries(updated);
  };

  const handleStartEditingNotes = (entry: BrewJournalEntry, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNotesId(entry.id);
    setTempNotes(entry.tastingNotes || '');
    setTempBean(entry.beanOrigin || '');
  };

  const handleSaveNotes = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = updateJournalEntry(id, {
      tastingNotes: tempNotes.trim(),
      beanOrigin: tempBean.trim(),
    });
    setEntries(updated);
    setEditingNotesId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-[var(--heading-color)] flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[var(--primary-color)]" />
            {t('brewJournal')}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {entries.length} {language === 'id' ? 'resep tersimpan di perangkat' : 'recipes saved locally'}
          </p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="container-aurora p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--border-color)] flex items-center justify-center text-[var(--primary-color)]">
            <Coffee className="w-8 h-8" />
          </div>
          <p className="text-sm text-gray-300 max-w-xs mx-auto">
            {t('journalEmpty')}
          </p>
          <button
            onClick={onNavigateHome}
            className="btn-aurora primary px-6 py-2 text-sm font-semibold inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {t('getCrafting')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map(entry => {
            const isExpanded = expandedId === entry.id;
            const isEditing = editingNotesId === entry.id;
            const isTimerOpen = activeTimerId === entry.id;

            return (
              <div
                key={entry.id}
                className="container-aurora p-4 transition-all duration-200 hover:border-[var(--primary-color)]/50"
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(entry.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[var(--primary-color)]/20 text-[var(--primary-color)]">
                          {entry.methodName}
                        </span>
                        <span className="text-xs text-gray-400">
                          {entry.ratio}
                        </span>
                      </div>
                      <h3 className="text-lg font-display text-[var(--heading-color)] font-bold mt-1">
                        {entry.championStyleName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        title={t('deleteEntry')}
                        className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="text-gray-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Summary metric tags */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs bg-[var(--bg-color)]/60 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Coffee className="w-3.5 h-3.5 text-[#A98D7A]" />
                      <span>{entry.coffeeAmount}g</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Droplets className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      <span>{entry.waterAmount}ml</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Clock className="w-3.5 h-3.5 text-[var(--primary-color)]" />
                      <span>{entry.recommendation.optimal_time}</span>
                    </div>
                  </div>

                  {/* Star rating row */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border-color)]/50">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(starVal => (
                        <button
                          key={starVal}
                          onClick={(e) => handleRatingChange(entry.id, starVal, e)}
                          className="p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              (entry.rating || 0) >= starVal
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)] space-y-4 animate-fade-in">
                    {/* Bean & Tasting notes section */}
                    <div className="bg-[var(--bg-color)]/70 p-3 rounded-lg border border-[var(--border-color)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[var(--primary-color)] flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          {t('tastingNotes')} & {t('coffeeBeanOrigin')}
                        </span>
                        {!isEditing && (
                          <button
                            onClick={(e) => handleStartEditingNotes(entry, e)}
                            className="text-xs text-[var(--secondary-color)] hover:underline"
                          >
                            Edit
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="space-y-2 mt-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={tempBean}
                            onChange={(e) => setTempBean(e.target.value)}
                            placeholder={t('coffeeBeanOriginPlaceholder')}
                            className="w-full text-xs p-2 rounded bg-[var(--bg-color)] border border-[var(--border-color)] text-white"
                          />
                          <textarea
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder={t('tastingNotesPlaceholder')}
                            rows={2}
                            className="w-full text-xs p-2 rounded bg-[var(--bg-color)] border border-[var(--border-color)] text-white resize-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNotesId(null);
                              }}
                              className="btn-aurora px-2.5 py-1 text-xs"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => handleSaveNotes(entry.id, e)}
                              className="btn-aurora primary px-3 py-1 text-xs flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-300 space-y-1">
                          {entry.beanOrigin ? (
                            <p className="font-medium text-amber-200">
                              ☕ {entry.beanOrigin}
                            </p>
                          ) : (
                            <p className="italic text-gray-500">
                              {language === 'id' ? 'Belum ada catatan biji kopi.' : 'No bean origin noted.'}
                            </p>
                          )}
                          {entry.tastingNotes ? (
                            <p className="text-gray-300">
                              &ldquo;{entry.tastingNotes}&rdquo;
                            </p>
                          ) : (
                            <p className="italic text-gray-500">
                              {language === 'id' ? 'Belum ada catatan rasa.' : 'No tasting notes yet.'}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick Specs */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[var(--bg-color)]/60 p-2.5 rounded border border-[var(--border-color)]/60 flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <div>
                          <p className="text-[10px] text-gray-400">{t('optimalTemp')}</p>
                          <p className="font-semibold text-white">{entry.recommendation.optimal_temperature}</p>
                        </div>
                      </div>
                      <div className="bg-[var(--bg-color)]/60 p-2.5 rounded border border-[var(--border-color)]/60 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--primary-color)]" />
                        <div>
                          <p className="text-[10px] text-gray-400">{t('grindSize')}</p>
                          <p className="font-semibold text-white capitalize">{entry.grindSize}</p>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-step guide */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-[var(--primary-color)] uppercase tracking-wider">
                        {t('guide')}
                      </h4>
                      <ol className="list-decimal list-inside space-y-1 text-xs text-gray-300 leading-relaxed bg-[var(--bg-color)]/40 p-3 rounded-lg border border-[var(--border-color)]/40">
                        {entry.recommendation.guide.map((step, idx) => (
                          <li key={idx} className="pl-1 py-0.5">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Interactive Timer inside Journal */}
                    <div className="pt-2">
                      {!isTimerOpen ? (
                        <button
                          onClick={() => setActiveTimerId(entry.id)}
                          className="btn-aurora primary w-full py-2 text-xs flex items-center justify-center gap-2 font-semibold"
                        >
                          <Play className="w-4 h-4" />
                          <span>{t('brewAgain')}</span>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <BrewTimer onClose={() => setActiveTimerId(null)} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalScreen;
