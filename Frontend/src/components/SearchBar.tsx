import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Search, ShieldCheck } from 'lucide-react';

interface SearchBarProps {
  compact?: boolean;
  popularLocations?: string[];
}

const fallbackPopularLocations = ['Kokapet', 'Gachibowli', 'Kondapur', 'Financial District', 'Madhapur', 'Narsingi'];

const SearchBar: React.FC<SearchBarProps> = ({ compact = false, popularLocations = fallbackPopularLocations }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedCity = localStorage.getItem('selectedCity') || 'Hyderabad';
  const buildDeveloperLocationUrl = (location: string) =>
    `/properties?view=developers&listingIntent=development&city=${encodeURIComponent(selectedCity)}&q=${encodeURIComponent(location)}`;

  const handleSearch = () => {
    const query = searchQuery.trim();
    navigate(query ? buildDeveloperLocationUrl(query) : `/properties?view=developers&listingIntent=development&city=${encodeURIComponent(selectedCity)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={compact ? 'w-full' : 'mx-auto max-w-5xl'}>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl shadow-slate-950/10">
        <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Search verified development listings</p>
            <p className="text-xs text-slate-500">Location, pincode, project, landmark or society</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Try Kokapet, 500032, Gachibowli..."
              className="ld-input pl-12"
            />
          </div>
          <button onClick={handleSearch} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0AA6A6] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#088f8f] disabled:cursor-not-allowed disabled:bg-slate-400">
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular</span>
          {popularLocations.map((location) => (
            <button
              key={location}
              onClick={() => navigate(buildDeveloperLocationUrl(location))}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              {location}
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
