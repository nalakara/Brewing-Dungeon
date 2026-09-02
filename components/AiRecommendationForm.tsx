import React, { useState, useEffect } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { getBrewingRecommendation } from '../services/geminiService';
import { AiRecommendation } from '../types';
import { BREWING_CLUSTERS, ALL_METHODS, METHOD_DETAILS, METHOD_CHAMPION_STYLES, CHAMPION_STYLE_PRESETS } from '../constants';
import BrewTimer from './BrewTimer';
import { saveJournalEntry, isRecipeSaved, updateJournalEntry } from '../services/journalService';
import { hasUserApiKey, fetchServerConfig } from '../services/apiKeyService';
import { Bookmark, BookmarkCheck, Star, Sparkles, AlertCircle, Key, Check } from 'lucide-react';

const AiRecommendationForm: React.FC = () => {
    const { t, language } = useLocalization();
    const [coffeeAmount, setCoffeeAmount] = useState('20');
    const [waterAmount, setWaterAmount] = useState('300');
    const [grindSize, setGrindSize] = useState('medium-fine');
    const [cluster, setCluster] = useState<string>('pour-over');
    const [method, setMethod] = useState<string>('v60');
    const [selectedRatio, setSelectedRatio] = useState<string>('1:15');
    const [intensity, setIntensity] = useState('Medium');
    const [championStyle, setChampionStyle] = useState('default');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<AiRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [ratios, setRatios] = useState<string[]>(['1:15', '1:16', '1:17']);
    const [hasKeyAvailable, setHasKeyAvailable] = useState(true);

    const availableChampionStyles = METHOD_CHAMPION_STYLES[method as keyof typeof METHOD_CHAMPION_STYLES];

    useEffect(() => {
        // Check if either server key or BYOK key is set
        const checkKeyStatus = async () => {
            const userKey = hasUserApiKey();
            if (userKey) {
                setHasKeyAvailable(true);
                return;
            }
            const cfg = await fetchServerConfig();
            setHasKeyAvailable(cfg.hasServerKey);
        };
        checkKeyStatus();
    }, []);

    // This effect handles what's specific to the method itself: the list of available ratios, and resetting the style choice.
    useEffect(() => {
        const details = METHOD_DETAILS[method as keyof typeof METHOD_DETAILS];
        if (details) {
            if (details.recommendedRatios && details.recommendedRatios.length > 0) {
                setRatios(details.recommendedRatios);
            } else {
                setRatios(['1:15', '1:16', '1:17']);
            }
        }
        setChampionStyle('default');
    }, [method]);

    // This effect handles applying presets for both champion styles and the method's own defaults.
    useEffect(() => {
        const preset = CHAMPION_STYLE_PRESETS[method as keyof typeof CHAMPION_STYLE_PRESETS]?.[championStyle as keyof typeof CHAMPION_STYLE_PRESETS[keyof typeof CHAMPION_STYLE_PRESETS]];

        if (championStyle !== 'default' && preset) {
            if (preset.grind) setGrindSize(preset.grind);
            if (preset.intensity) setIntensity(preset.intensity);
            if (preset.ratio) setSelectedRatio(preset.ratio);
        } else {
            const details = METHOD_DETAILS[method as keyof typeof METHOD_DETAILS];
            if (details) {
                if (details.defaultGrind) setGrindSize(details.defaultGrind);
                if (details.defaultRatio) setSelectedRatio(details.defaultRatio);
                else if (details.recommendedRatios?.length) setSelectedRatio(details.recommendedRatios[0]);
                setIntensity('Medium'); 
            }
        }
    }, [championStyle, method]);
    
    // This effect calculates water amount based on coffee amount and selected ratio.
    useEffect(() => {
        if (selectedRatio !== 'custom' && coffeeAmount) {
            const parts = selectedRatio.split(':');
            if (parts.length === 2) {
                const coffeePart = parseFloat(parts[0]);
                const waterPart = parseFloat(parts[1]);
                if (!isNaN(coffeePart) && !isNaN(waterPart) && coffeePart > 0) {
                    const ratioValue = waterPart / coffeePart;
                    const newWaterAmount = parseFloat(coffeeAmount) * ratioValue;
                    if (!isNaN(newWaterAmount)) {
                        setWaterAmount(String(Math.round(newWaterAmount)));
                    }
                }
            }
        }
    }, [coffeeAmount, selectedRatio]);

    const handleWaterInputChange = (value: string) => {
        setWaterAmount(value);
        setSelectedRatio('custom');
    };

    const handleClusterChange = (newClusterKey: string) => {
        setCluster(newClusterKey);
        const firstMethod = BREWING_CLUSTERS[newClusterKey as keyof typeof BREWING_CLUSTERS].methods[0];
        setMethod(firstMethod);
    };

    const methodName = ALL_METHODS[method as keyof typeof ALL_METHODS][language as keyof typeof ALL_METHODS[keyof typeof ALL_METHODS]];
    const stylesForMethod = METHOD_CHAMPION_STYLES[method as keyof typeof METHOD_CHAMPION_STYLES];
    const championStyleName = stylesForMethod 
        ? stylesForMethod[championStyle as keyof typeof stylesForMethod][language as 'en'|'id']
        : 'Standard Method';
    const activeRatio = selectedRatio !== 'custom'
        ? selectedRatio
        : `1:${(parseFloat(waterAmount) / parseFloat(coffeeAmount)).toFixed(1)}`;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setRecommendation(null);

        try {
            const result = await getBrewingRecommendation(
                parseFloat(coffeeAmount),
                parseFloat(waterAmount),
                grindSize,
                methodName,
                language,
                activeRatio,
                intensity,
                championStyleName
            );
            setRecommendation(result);
        } catch (err: any) {
            setError(err.message || t('error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-aurora p-6 space-y-6">
            <h2 className="text-2xl font-display text-center text-[var(--heading-color)] flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[var(--primary-color)]" />
                {t('aiBrewingGuide')}
            </h2>

            {!hasKeyAvailable && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                        {language === 'id'
                            ? 'Belum ada API Key terdeteksi. Anda bisa memasukkan Gemini API Key pribadi di tab Pengaturan (BYOK).'
                            : 'No API Key detected yet. You can add your personal Gemini API key in Settings (BYOK).'}
                    </span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <SelectField label={t('brewingCluster')} value={cluster} onChange={handleClusterChange}>
                        {Object.entries(BREWING_CLUSTERS).map(([key, value]) => (
                            <option key={key} value={key}>{value[language as keyof typeof value]}</option>
                        ))}
                    </SelectField>
                    <SelectField label={t('brewingMethod')} value={method} onChange={setMethod}>
                        {BREWING_CLUSTERS[cluster as keyof typeof BREWING_CLUSTERS].methods.map(methodKey => (
                            <option key={methodKey} value={methodKey}>
                                {ALL_METHODS[methodKey as keyof typeof ALL_METHODS][language as keyof typeof ALL_METHODS[keyof typeof ALL_METHODS]]}
                            </option>
                        ))}
                    </SelectField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <InputField
                        label={t('coffeeAmount')}
                        value={coffeeAmount}
                        onChange={setCoffeeAmount}
                        type="number"
                    />
                    <InputField
                        label={t('waterAmount')}
                        value={waterAmount}
                        onChange={handleWaterInputChange}
                        type="number"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SelectField label={t('selectRatio')} value={selectedRatio} onChange={setSelectedRatio}>
                        {ratios.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                        <option value="custom">{t('customRatio')}</option>
                    </SelectField>
                    <SelectField label={t('grindSize')} value={grindSize} onChange={setGrindSize}>
                        <option value="fine">{t('fine')}</option>
                        <option value="medium-fine">{t('mediumFine')}</option>
                        <option value="medium">{t('medium')}</option>
                        <option value="medium-coarse">{t('mediumCoarse')}</option>
                        <option value="coarse">{t('coarse')}</option>
                    </SelectField>
                </div>

                <SelectField label={t('brewingIntensity')} value={intensity} onChange={setIntensity}>
                    <option value="Light">{t('light')}</option>
                    <option value="Medium">{t('mediumStrength')}</option>
                    <option value="Strong">{t('strong')}</option>
                </SelectField>

                {availableChampionStyles && (
                    <SelectField label={t('championStyle')} value={championStyle} onChange={setChampionStyle}>
                        {Object.entries(availableChampionStyles).map(([key, value]) => (
                            <option key={key} value={key}>{value[language as keyof typeof value]}</option>
                        ))}
                    </SelectField>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-aurora primary font-bold py-3 px-4 text-base transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                           <Spinner /> {t('generating')}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            {t('generateRecommendation')}
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs text-center">
                    {error}
                </div>
            )}

            {recommendation && (
                <RecommendationDisplay
                    recommendation={recommendation}
                    methodName={methodName}
                    clusterKey={cluster}
                    clusterName={BREWING_CLUSTERS[cluster as keyof typeof BREWING_CLUSTERS][language as keyof typeof BREWING_CLUSTERS[keyof typeof BREWING_CLUSTERS]]}
                    championStyleName={championStyleName}
                    coffeeAmount={parseFloat(coffeeAmount)}
                    waterAmount={parseFloat(waterAmount)}
                    ratio={activeRatio}
                    grindSize={grindSize}
                    intensity={intensity}
                />
            )}
        </div>
    );
};

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface InputFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    disabled?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, type = 'text', disabled = false }) => (
    <div>
        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full py-2 px-3 ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-700 !important' : ''}`}
        />
    </div>
);

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, value, onChange, children }) => (
     <div>
        <label className="block text-sm font-medium text-[var(--text-color)] mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full py-2 px-3 appearance-none bg-no-repeat bg-right pr-8"
            style={{
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
            }}
        >
            {children}
        </select>
    </div>
);

const TimerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface RecommendationDisplayProps {
    recommendation: AiRecommendation;
    methodName: string;
    clusterKey: string;
    clusterName: string;
    championStyleName: string;
    coffeeAmount: number;
    waterAmount: number;
    ratio: string;
    grindSize: string;
    intensity: string;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
    recommendation,
    methodName,
    clusterKey,
    clusterName,
    championStyleName,
    coffeeAmount,
    waterAmount,
    ratio,
    grindSize,
    intensity,
}) => {
    const { t } = useLocalization();
    const [isTimerVisible, setIsTimerVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [savedEntryId, setSavedEntryId] = useState<string | null>(null);
    const [showNotesForm, setShowNotesForm] = useState(false);
    const [tastingNotes, setTastingNotes] = useState('');
    const [beanOrigin, setBeanOrigin] = useState('');
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const saved = isRecipeSaved(methodName, championStyleName, coffeeAmount, waterAmount);
        setIsSaved(saved);
    }, [methodName, championStyleName, coffeeAmount, waterAmount]);

    const handleSaveToJournal = () => {
        const entry = saveJournalEntry({
            methodName,
            clusterKey,
            clusterName,
            championStyleName,
            coffeeAmount,
            waterAmount,
            ratio,
            grindSize,
            intensity,
            recommendation,
            rating,
            tastingNotes: tastingNotes.trim() || undefined,
            beanOrigin: beanOrigin.trim() || undefined,
        });
        setIsSaved(true);
        setSavedEntryId(entry.id);
        setShowNotesForm(true);
    };

    const handleUpdateNotes = () => {
        if (savedEntryId) {
            updateJournalEntry(savedEntryId, {
                tastingNotes: tastingNotes.trim(),
                beanOrigin: beanOrigin.trim(),
                rating,
            });
            setShowNotesForm(false);
        }
    };

    return (
        <div className="mt-6 border-t border-[var(--border-color)] pt-6 animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-display text-[var(--heading-color)] font-bold">{t('recommendation')}</h3>
                
                {/* Save to Local Journal Button */}
                <button
                    onClick={handleSaveToJournal}
                    disabled={isSaved}
                    className={`btn-aurora px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isSaved
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'primary hover:scale-105'
                    }`}
                >
                    {isSaved ? (
                        <>
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>{t('savedToJournal')}</span>
                        </>
                    ) : (
                        <>
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{t('saveToJournal')}</span>
                        </>
                    )}
                </button>
            </div>

            {/* In-place Notes & Rating Drawer for newly saved recipe */}
            {showNotesForm && (
                <div className="container-aurora p-3 space-y-2 border border-emerald-500/40 bg-emerald-500/5 animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            {t('savedToJournal')}! Add tasting notes?
                        </span>
                        <button
                            onClick={() => setShowNotesForm(false)}
                            className="text-[10px] text-gray-400 hover:text-white"
                        >
                            Close
                        </button>
                    </div>

                    <input
                        type="text"
                        value={beanOrigin}
                        onChange={(e) => setBeanOrigin(e.target.value)}
                        placeholder={t('coffeeBeanOriginPlaceholder')}
                        className="w-full text-xs p-2 rounded bg-[var(--bg-color)] border border-[var(--border-color)] text-white"
                    />

                    <textarea
                        value={tastingNotes}
                        onChange={(e) => setTastingNotes(e.target.value)}
                        placeholder={t('tastingNotesPlaceholder')}
                        rows={2}
                        className="w-full text-xs p-2 rounded bg-[var(--bg-color)] border border-[var(--border-color)] text-white resize-none"
                    />

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] text-gray-400 mr-1">{t('rating')}:</span>
                            {[1, 2, 3, 4, 5].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setRating(val)}
                                    className="p-0.5"
                                >
                                    <Star className={`w-3.5 h-3.5 ${rating >= val ? 'text-amber-400 fill-amber-400' : 'text-gray-500'}`} />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleUpdateNotes}
                            className="btn-aurora primary px-3 py-1 text-xs"
                        >
                            Save Notes
                        </button>
                    </div>
                </div>
            )}
            
            <ParameterVisualizations recommendation={recommendation} />

            <div className="text-center bg-[var(--border-color)]/50 rounded-lg p-2 flex justify-center items-center px-4">
                <div>
                    <p className="text-xs text-[var(--text-color)] tracking-wider uppercase">{t('optimalTime')}</p>
                    <p className="font-bold text-[var(--heading-color)] font-display text-xl">{recommendation.optimal_time}</p>
                </div>
            </div>
            
            <div className="container-aurora p-3">
                <h4 className="font-semibold text-[var(--primary-color)] mb-2 font-display">{t('guide')}</h4>
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
                <ol className="list-decimal list-inside space-y-1 text-sm">
                    {recommendation.guide.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
             <div className="container-aurora p-3">
                <h4 className="font-semibold text-[var(--primary-color)] mb-2 font-display">{t('keyPrinciples')}</h4>
                <p className="text-sm">{recommendation.key_principles}</p>
            </div>
             {recommendation.chemical_reactions && (
                <div className="container-aurora p-3">
                    <h4 className="font-semibold text-[var(--primary-color)] mb-2 font-display">{t('chemicalReactions')}</h4>
                    <p className="text-sm">{recommendation.chemical_reactions}</p>
                </div>
            )}
            {recommendation.physical_principles && (
                 <div className="container-aurora p-3">
                    <h4 className="font-semibold text-[var(--primary-color)] mb-2 font-display">{t('physicalPrinciples')}</h4>
                    <p className="text-sm">{recommendation.physical_principles}</p>
                </div>
            )}
        </div>
    );
};

const ParameterVisualizations: React.FC<{ recommendation: AiRecommendation }> = ({ recommendation }) => {
    const ratioParts = recommendation.ratio.split(':').map(Number);
    const [coffeePart, waterPart] = ratioParts.length === 2 && !ratioParts.some(isNaN) ? ratioParts : [1, 15];
    const totalParts = coffeePart + waterPart;

    const tempMatches = recommendation.optimal_temperature.match(/\d+/g)?.map(Number);
    const avgTemp = tempMatches ? (tempMatches.reduce((a, b) => a + b, 0) / tempMatches.length) : 92;
    const SCALE_MIN = 80;
    const SCALE_MAX = 100;
    
    const tempPercent = ((avgTemp - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;

    return (
        <div className="space-y-5 container-aurora p-4">
            {/* Ratio Visualization */}
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium">Ratio</span>
                    <span className="font-display text-2xl text-[var(--heading-color)]">{recommendation.ratio}</span>
                </div>
                <div className="flex w-full h-3 rounded-full overflow-hidden" role="figure">
                    <div className="bg-[#6F4E37]" style={{ width: `${(coffeePart / totalParts) * 100}%` }}></div>
                    <div className="bg-[var(--accent-color)]" style={{ width: `${(waterPart / totalParts) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span className="text-[#A98D7A]">Coffee</span>
                    <span className="text-[var(--accent-color)]">Water</span>
                </div>
            </div>
            
            {/* Temperature Visualization */}
            <div>
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm font-medium">Temperature</span>
                    <span className="font-display text-2xl text-[var(--heading-color)]">{recommendation.optimal_temperature}</span>
                </div>
                <div className="relative h-2 w-full bg-gray-600 rounded-full">
                    <div className="absolute top-0 h-2 bg-gradient-to-r from-[#EAE0D5] via-[#D8C3A5] to-[#C48A69] rounded-full"></div>
                    <div 
                        className="absolute -top-1 h-4 w-1 bg-white border-2 border-[var(--heading-color)] rounded-full"
                        style={{ left: `calc(${tempPercent}% - 4px)` }}
                    ></div>
                </div>
                <div className="relative text-xs text-gray-400 mt-1 h-4">
                    <span>{SCALE_MIN}°C</span>
                    <span className="absolute right-0">{SCALE_MAX}°C</span>
                </div>
            </div>
        </div>
    );
};

export default AiRecommendationForm;
