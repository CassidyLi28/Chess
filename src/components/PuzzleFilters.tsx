import { useState } from 'react';
import { Filter, Settings, Star, Target, Zap, Crown } from 'lucide-react';
import type { PuzzleFilters, DifficultyLevel, PuzzleCategory, TacticalTheme } from '@/types/puzzle';

interface PuzzleFiltersProps {
  filters: PuzzleFilters;
  onFiltersChange: (filters: PuzzleFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const difficultyConfig: Record<DifficultyLevel, { color: string; icon: React.ReactNode; rating: string }> = {
  beginner: { color: 'text-green-400', icon: <Star className="h-4 w-4" />, rating: '800-1200' },
  intermediate: { color: 'text-blue-400', icon: <Target className="h-4 w-4" />, rating: '1200-1600' },
  advanced: { color: 'text-purple-400', icon: <Zap className="h-4 w-4" />, rating: '1600-2000' },
  expert: { color: 'text-orange-400', icon: <Crown className="h-4 w-4" />, rating: '2000-2400' },
  master: { color: 'text-red-400', icon: <Crown className="h-4 w-4" />, rating: '2400-2600' },
  grandmaster: { color: 'text-yellow-400', icon: <Crown className="h-4 w-4" />, rating: '2600+' },
};

const categoryOptions: { value: PuzzleCategory; label: string; description: string }[] = [
  { value: 'tactics', label: 'Tactics', description: 'Basic tactical patterns and combinations' },
  { value: 'sacrifices', label: 'Sacrifices', description: 'Piece sacrifices for advantage' },
  { value: 'mating-patterns', label: 'Mating Patterns', description: 'Checkmate combinations' },
  { value: 'endgames', label: 'Endgames', description: 'Endgame technique and theory' },
  { value: 'positional', label: 'Positional', description: 'Strategic and positional play' },
  { value: 'calculation', label: 'Calculation', description: 'Deep calculation challenges' },
  { value: 'opening-traps', label: 'Opening Traps', description: 'Tactical traps in openings' },
  { value: 'defensive', label: 'Defensive', description: 'Defensive techniques and resources' },
];

const themeGroups: Record<string, { themes: TacticalTheme[]; label: string }> = {
  'Basic Tactics': {
    label: 'Basic Tactics',
    themes: ['fork', 'pin', 'skewer', 'discovered-attack', 'double-attack']
  },
  'Advanced Tactics': {
    label: 'Advanced Tactics', 
    themes: ['deflection', 'decoy', 'clearance', 'interference', 'x-ray']
  },
  'Sacrifices': {
    label: 'Sacrifices',
    themes: ['sacrifice', 'queen-sacrifice', 'rook-sacrifice', 'bishop-sacrifice', 'knight-sacrifice', 'pawn-sacrifice']
  },
  'Mating Attacks': {
    label: 'Mating Attacks',
    themes: ['mating-attack', 'back-rank-mate', 'smothered-mate', 'anastasia-mate', 'legal-mate']
  },
  'Endgame Themes': {
    label: 'Endgame Themes',
    themes: ['endgame', 'pawn-endgame', 'rook-endgame', 'queen-endgame', 'bishop-endgame', 'knight-endgame']
  },
  'Special Patterns': {
    label: 'Special Patterns',
    themes: ['zugzwang', 'stalemate-trick', 'promotion', 'underpromotion', 'trapped-piece']
  },
  'Positional': {
    label: 'Positional',
    themes: ['weak-king', 'exposed-king', 'piece-coordination', 'positional-sacrifice', 'exchange-sacrifice']
  },
  'Famous Sacrifices': {
    label: 'Famous Sacrifices',
    themes: ['greek-gift', 'bxh7-sacrifice']
  }
};

export const PuzzleFilters = ({ filters, onFiltersChange, isOpen, onToggle }: PuzzleFiltersProps) => {
  const [activeTab, setActiveTab] = useState<'difficulty' | 'category' | 'themes' | 'rating'>('difficulty');

  const updateFilters = (updates: Partial<PuzzleFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleTheme = (theme: TacticalTheme) => {
    const currentThemes = filters.themes || [];
    const newThemes = currentThemes.includes(theme)
      ? currentThemes.filter(t => t !== theme)
      : [...currentThemes, theme];
    updateFilters({ themes: newThemes.length > 0 ? newThemes : undefined });
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
      >
        <Filter className="h-4 w-4" />
        Filters
        {(filters.difficulty || filters.category || filters.themes?.length) && (
          <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
            {[filters.difficulty, filters.category, filters.themes?.length].filter(Boolean).length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="bg-[#272522] border-b border-white/10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Puzzle Filters
        </h3>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['difficulty', 'category', 'themes', 'rating'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filter Content */}
      <div className="min-h-[200px]">
        {activeTab === 'difficulty' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(difficultyConfig).map(([level, config]) => (
              <button
                key={level}
                onClick={() => updateFilters({ 
                  difficulty: filters.difficulty === level ? undefined : level as DifficultyLevel 
                })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  filters.difficulty === level
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className={`flex items-center gap-2 mb-2 ${config.color}`}>
                  {config.icon}
                  <span className="font-bold capitalize">{level}</span>
                </div>
                <div className="text-xs text-gray-400">{config.rating}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'category' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryOptions.map(({ value, label, description }) => (
              <button
                key={value}
                onClick={() => updateFilters({ 
                  category: filters.category === value ? undefined : value 
                })}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  filters.category === value
                    ? 'border-blue-500 bg-blue-500/20'
                    : 'border-white/20 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="font-bold text-white mb-1">{label}</div>
                <div className="text-xs text-gray-400">{description}</div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'themes' && (
          <div className="space-y-6">
            {Object.entries(themeGroups).map(([groupName, { themes, label }]) => (
              <div key={groupName}>
                <h4 className="text-sm font-bold text-gray-300 mb-3">{label}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => toggleTheme(theme)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        filters.themes?.includes(theme)
                          ? 'bg-green-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {theme.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'rating' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating Range
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min (800)"
                  value={filters.ratingRange?.[0] || ''}
                  onChange={(e) => updateFilters({
                    ratingRange: [
                      parseInt(e.target.value) || 800,
                      filters.ratingRange?.[1] || 3000
                    ]
                  })}
                  className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  min="800"
                  max="3000"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max (3000)"
                  value={filters.ratingRange?.[1] || ''}
                  onChange={(e) => updateFilters({
                    ratingRange: [
                      filters.ratingRange?.[0] || 800,
                      parseInt(e.target.value) || 3000
                    ]
                  })}
                  className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  min="800"
                  max="3000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Beginner', range: [800, 1200] },
                { label: 'Club Player', range: [1200, 1600] },
                { label: 'Tournament', range: [1600, 2000] },
                { label: 'Expert', range: [2000, 2400] },
                { label: 'Master', range: [2400, 2600] },
                { label: 'GM Level', range: [2600, 3000] },
              ].map(({ label, range }) => (
                <button
                  key={label}
                  onClick={() => updateFilters({ ratingRange: range as [number, number] })}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                >
                  {label}
                  <div className="text-xs text-gray-400">{range[0]}-{range[1]}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => updateFilters({ difficulty: undefined, category: undefined, themes: undefined, ratingRange: undefined })}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
        >
          Clear All Filters
        </button>
        <div className="text-sm text-gray-400">
          {filters.difficulty && `${filters.difficulty} • `}
          {filters.category && `${filters.category} • `}
          {filters.themes?.length && `${filters.themes.length} themes • `}
          {filters.ratingRange && `${filters.ratingRange[0]}-${filters.ratingRange[1]}`}
        </div>
      </div>
    </div>
  );
};