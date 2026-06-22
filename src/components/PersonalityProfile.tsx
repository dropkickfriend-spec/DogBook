import React, { useState, useEffect } from 'react';
import { User, LineageData, PersonalityTraits } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Save, Info, Zap, Target, Facebook, Sparkles } from 'lucide-react';

interface PersonalityProfileProps {
  currentUser: User;
  targetUser?: User;
  users: Record<string, User>;
  lineageMap: Record<string, LineageData>;
}

export function PersonalityProfile({ currentUser, targetUser, users, lineageMap }: PersonalityProfileProps) {
  const isOwnProfile = !targetUser || targetUser.id === currentUser.id;
  const activeUser = targetUser || currentUser;

  const [traits, setTraits] = useState<PersonalityTraits>(activeUser.traits || {
    energy: 50,
    sociability: 50,
    trainability: 50,
    preyDrive: 50,
    vocalization: 50,
    loyalty: 50
  });

  const [isSaved, setIsSaved] = useState(false);
  const [fbConnected, setFbConnected] = useState(false);
  const [analyzingFb, setAnalyzingFb] = useState(false);
  const [fbAnalysis, setFbAnalysis] = useState('');

  useEffect(() => {
    setTraits(activeUser.traits || {
      energy: 50,
      sociability: 50,
      trainability: 50,
      preyDrive: 50,
      vocalization: 50,
      loyalty: 50
    });
  }, [activeUser]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        setFbConnected(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnectFacebook = async () => {
    try {
      const response = await fetch('/api/auth/facebook/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();
      window.open(url, 'oauth_popup', 'width=600,height=700');
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Could not connect to Facebook right now.');
    }
  };

  const handleAnalyzeFb = async () => {
    setAnalyzingFb(true);
    try {
      const response = await fetch('/api/analyze-owner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animalTraits: traits })
      });
      const data = await response.json();
      setFbAnalysis(data.analysis || 'Analysis failed.');
    } catch(err) {
      setFbAnalysis('Analysis failed. Make sure your API defaults are configured.');
    } finally {
      setAnalyzingFb(false);
    }
  };

  const handleTraitChange = (trait: keyof PersonalityTraits, value: number) => {
    if (!isOwnProfile) return;
    setTraits(prev => ({ ...prev, [trait]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!isOwnProfile) return;
    currentUser.traits = traits; // Mock saving
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Prepare chart data comparing current user with target user, or just target user
  const getChartData = () => {
    const dataKeyMap = [
      { subject: 'Energy', key: 'energy' as keyof PersonalityTraits },
      { subject: 'Sociability', key: 'sociability' as keyof PersonalityTraits },
      { subject: 'Trainability', key: 'trainability' as keyof PersonalityTraits },
      { subject: 'Prey Drive', key: 'preyDrive' as keyof PersonalityTraits },
      { subject: 'Vocalization', key: 'vocalization' as keyof PersonalityTraits },
      { subject: 'Loyalty', key: 'loyalty' as keyof PersonalityTraits },
    ];

    if (isOwnProfile) {
      return dataKeyMap.map(d => ({
        subject: d.subject,
        [activeUser.name]: traits[d.key]
      }));
    } else {
      return dataKeyMap.map(d => ({
        subject: d.subject,
        [currentUser.name]: currentUser.traits?.[d.key] || 50,
        [activeUser.name]: activeUser.traits?.[d.key] || 50
      }));
    }
  };

  const chartData = getChartData();

  const renderSlider = (label: string, trait: keyof PersonalityTraits, description: string, minLabel: string, maxLabel: string) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <label className="font-bold text-slate-800">{label}</label>
        <span className="text-sm font-black text-orange-500">{traits[trait]}%</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">{description}</p>
      
      <div className="relative pt-1">
        <div className="flex items-center justify-between absolute w-full top-0 text-[10px] sm:text-xs font-bold text-slate-400 mt-6">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={traits[trait]}
          disabled={!isOwnProfile}
          onChange={(e) => handleTraitChange(trait, parseInt(e.target.value))}
          className={`w-full h-2 bg-amber-100 rounded-lg appearance-none z-10 relative mb-4 ${isOwnProfile ? 'cursor-pointer accent-orange-500' : 'cursor-not-allowed accent-teal-500'}`}
        />
      </div>
    </div>
  );

  const getImprovementTip = () => {
    if (traits.energy > 80) return "High energy! Try adding an agility course or extra fetch time to channel this into focus.";
    if (traits.trainability < 40) return "Stubborn streak? Use high-value treats and keep training sessions under 5 minutes to hold attention.";
    if (traits.preyDrive > 70) return "High prey drive: Practice 'Leave It' commands frequently and reward heavily for making eye contact with you instead of squirrels.";
    if (traits.sociability < 40) return "A bit shy. Gradual, positive-reinforcement introductions to calm dogs can help build confidence safely.";
    return "Balanced traits! Keep up the consistent routine and regular varied playtime to maintain this healthy equilibrium.";
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 max-w-7xl mx-auto w-full">
      <div className="flex-1 bg-white rounded-[32px] p-6 shadow-md border-b-4 border-amber-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl overflow-hidden shadow-sm shrink-0">
             <img src={activeUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{isOwnProfile ? 'Your Personality Profile' : `${activeUser.name}'s Profile`}</h2>
            <p className="text-sm font-medium text-slate-500">{isOwnProfile ? 'Fill this out to find optimal playmates and track trait heredity.' : 'Check out their traits to see if you\'re a match!'}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-6 border border-slate-100">
          {renderSlider('Energy Level', 'energy', 'How active is this pet?', 'Couch Potato', 'Hyperactive')}
          {renderSlider('Sociability', 'sociability', 'Reactions to new pets and people?', 'Loner', 'Social Butterfly')}
          {renderSlider('Trainability', 'trainability', 'How easily do they pick up commands?', 'Stubborn', 'Eager to Please')}
          {renderSlider('Prey Drive', 'preyDrive', 'Chasing squirrels or toys aggressively?', 'Low Drive', 'High Drive')}
          {renderSlider('Vocalization', 'vocalization', 'How much noise do they make?', 'Quiet', 'Very Vocal')}
          {renderSlider('Loyalty', 'loyalty', 'Desire to stay close to primary owner?', 'Independent', 'Velcro Dog')}
        </div>

        {!isOwnProfile && (
          <div className="bg-teal-50 rounded-2xl p-4 mb-6 border border-teal-100 flex items-center gap-4">
             <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-xl font-bold">🧬</span>
             </div>
             <div>
               <h4 className="font-black text-teal-900">Lineage Relatedness</h4>
               <p className="text-sm text-teal-700 font-medium">Based on your shared evolution tree, you and {activeUser.name} have a genetic overlap.</p>
             </div>
          </div>
        )}

        {isOwnProfile && (
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <Save className="w-5 h-5"/>
            {isSaved ? 'SAVED!' : 'SAVE PROFILE'}
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-teal-50 rounded-[32px] p-6 shadow-md border-b-4 border-teal-200 flex-1">
           <h3 className="font-black text-teal-800 text-xl mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> {isOwnProfile ? 'Current Traits Radar' : 'Compatibility Radar'}
          </h3>
          <p className="text-sm font-medium text-teal-700 mb-6">
            {isOwnProfile 
              ? `A visual breakdown of ${activeUser.name}'s fundamental personality drivers.` 
              : `Compare your traits with ${activeUser.name} to see if you have matching play styles.`}
          </p>

          <div className="h-[300px] sm:h-[350px] w-full bg-white rounded-3xl p-4 shadow-sm border border-teal-100">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                
                {isOwnProfile ? (
                   <Radar name={activeUser.name} dataKey={activeUser.name} stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                ) : (
                  <>
                    <Radar name={currentUser.name} dataKey={currentUser.name} stroke="#f97316" fill="#f97316" fillOpacity={0.5} />
                    <Radar name={activeUser.name} dataKey={activeUser.name} stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.4} />
                  </>
                )}
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {isOwnProfile ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 opacity-50 border-2 border-orange-500" />
                <span className="font-bold text-sm text-slate-700">{activeUser.name}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-orange-500 opacity-50 border-2 border-orange-500" />
                  <span className="font-bold text-sm text-slate-700">{currentUser.name} (You)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-teal-500 opacity-40 border-2 border-teal-500" />
                  <span className="font-bold text-sm text-slate-700">{activeUser.name}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-amber-100 rounded-[32px] p-6 shadow-md border-b-4 border-amber-300">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-amber-200 text-amber-700 rounded-xl flex items-center justify-center shrink-0">
               <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-amber-900 mb-1">Growth & Improvement Stats</h4>
              <p className="text-sm border-l-2 border-amber-300 pl-3 font-medium py-1 text-amber-800 italic">
                "{getImprovementTip()}"
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl w-fit">
                 <Zap className="w-4 h-4 text-amber-500" />
                 <span>+15% Focus since last month</span>
              </div>
            </div>
          </div>
        </div>
        
        {isOwnProfile && (
          <div className="bg-blue-50 rounded-[32px] p-6 shadow-md border-b-4 border-blue-200">
            <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
              <Facebook className="w-5 h-5" /> Like Owner, Like Dog?
            </h4>
            <p className="text-sm font-medium text-blue-800 mb-4">
              Link your Facebook to analyze your owner personality and compare it to {activeUser.name}'s traits!
            </p>
            {!fbConnected ? (
              <button onClick={handleConnectFacebook} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm w-full sm:w-auto">
                Connect Facebook
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-teal-600 bg-teal-50 px-3 py-2 rounded-lg inline-block w-fit">
                  ✓ Facebook Connected
                </p>
                <button 
                  onClick={handleAnalyzeFb} 
                  disabled={analyzingFb}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold rounded-xl transition-colors shadow-sm flex flex-wrap items-center gap-2 w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4" /> 
                  {analyzingFb ? 'Analyzing Persona...' : 'Analyze with Gemini'}
                </button>
                {fbAnalysis && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-blue-100 shadow-sm">
                    <p className="text-sm font-bold text-slate-700">{fbAnalysis}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
