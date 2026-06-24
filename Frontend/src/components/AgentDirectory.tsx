import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone, User } from 'lucide-react';
import { API_BASE } from '../lib/api';

type Agent = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
};

export default function AgentDirectory() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    let cancelled = false;
    const loadAgents = async () => {
      try {
        const response = await fetch(`${API_BASE}/agents`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Unable to load agents');
        if (!cancelled) setAgents(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load agents');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadAgents();
    return () => { cancelled = true; };
  }, []);

  const stateOptions = Array.from(new Set(agents.map((agent) => agent.state).filter(Boolean))).sort();
  const cityOptions = Array.from(new Set(
    agents
      .filter((agent) => selectedState === 'All' || agent.state === selectedState)
      .map((agent) => agent.city)
      .filter(Boolean)
  )).sort();
  const visibleAgents = agents.filter((agent) =>
    (selectedState === 'All' || agent.state === selectedState) &&
    (selectedCity === 'All' || agent.city === selectedCity)
  );

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40" />
        <div className="ld-container relative py-20">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Find an Agent</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Connect with verified agents (mediators) across India.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Browse agent profiles and the properties they've listed. Contact details unlock with an active membership.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="ld-container">
          {loading && <p className="text-center text-slate-500">Loading agents...</p>}
          {!loading && error && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="font-semibold text-slate-700">{error}</p>
            </div>
          )}
          {!loading && !error && agents.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
              <User className="mx-auto h-8 w-8 text-teal-700" />
              <p className="mt-3 font-black text-slate-950">No agents found yet.</p>
            </div>
          )}
          {!loading && agents.length > 0 && (
            <>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <select
                  value={selectedState}
                  onChange={(e) => { setSelectedState(e.target.value); setSelectedCity('All'); }}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-teal-600"
                >
                  <option value="All">All States</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-teal-600"
                >
                  <option value="All">All Cities</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {(selectedState !== 'All' || selectedCity !== 'All') && (
                  <button
                    type="button"
                    onClick={() => { setSelectedState('All'); setSelectedCity('All'); }}
                    className="text-sm font-semibold text-teal-700 underline-offset-2 hover:underline"
                  >
                    Reset filters
                  </button>
                )}
                <span className="text-sm font-semibold text-slate-500">{visibleAgents.length} of {agents.length} agents</span>
              </div>

              {visibleAgents.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <p className="font-black text-slate-950">No agents found for this location.</p>
                </div>
              ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visibleAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-600 hover:shadow-lg"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xl font-black text-white">
                      {agent.firstName?.charAt(0).toUpperCase() || <User className="h-6 w-6" />}
                    </div>
                    <Link to={`/agent/${agent.id}`} className="text-xs font-bold text-teal-700 hover:underline">
                      View Profile
                    </Link>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-lg font-black text-slate-950">
                      {agent.firstName} {agent.lastName}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0 text-teal-700" />
                      <span className="truncate">{[agent.city, agent.state].filter(Boolean).join(', ') || 'Location not specified'}</span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        to={`/agent/${agent.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </Link>
                      <Link
                        to={`/agent/${agent.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-800"
                      >
                        <Phone className="h-3.5 w-3.5" /> Contact
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
