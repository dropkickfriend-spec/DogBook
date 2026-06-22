import React, { useState } from 'react';
import { GitBranch, ShieldCheck, ShieldAlert, Check, X, Search, PlusCircle } from 'lucide-react';
import { User, LineageData, LineageRequest } from '../types';

interface EvolutionTreeProps {
  currentUser: User;
  users: Record<string, User>;
  lineageMap: Record<string, LineageData>;
  requests: LineageRequest[];
  onConfirm: (reqId: string) => void;
  onReject: (reqId: string) => void;
  onSendRequest: (toId: string, type: 'sire'|'dam'|'offspring') => void;
}

export function EvolutionTree({ currentUser, users, lineageMap, requests, onConfirm, onReject, onSendRequest }: EvolutionTreeProps) {
  const [optimizerMate, setOptimizerMate] = useState<string>('');
  
  const myLineage = lineageMap[currentUser.id] || { id: currentUser.id, offspringIds: [] };
  const sire = myLineage.sireId ? users[myLineage.sireId] : null;
  const dam = myLineage.damId ? users[myLineage.damId] : null;
  
  const myRequests = requests.filter(r => r.toUserId === currentUser.id && r.status === 'pending');

  const calcRelatedness = (mateId: string) => {
    if (!mateId) return 0;
    if (mateId === currentUser.id) return 100;
    
    // Simple mock relatedness calculation
    let mateNode = lineageMap[mateId];
    let currNode = lineageMap[currentUser.id];
    let distance = 0;
    
    const getAncestors = (startId: string) => {
      const ancestors = new Set<string>();
      let current = startId;
      while(current && lineageMap[current]) {
         ancestors.add(current);
         current = lineageMap[current].sireId || '';
      }
      return ancestors;
    };
    
    const myAncestors = getAncestors(currentUser.id);
    const mateAncestors = getAncestors(mateId);
    
    const intersection = new Set([...myAncestors].filter(x => mateAncestors.has(x)));
    
    return intersection.size > 0 ? Math.min(intersection.size * 15, 95) : 0;
  };

  const relatedness = calcRelatedness(optimizerMate);

  const renderAncestryChain = (userId: string | undefined): React.ReactNode => {
    if (!userId || !lineageMap[userId] || !lineageMap[userId].sireId) return null;
    const parentNodeId = lineageMap[userId].sireId!;
    const parentUser = users[parentNodeId];
    if (!parentUser) return null;

    return (
      <div className="flex flex-col items-center">
        {renderAncestryChain(parentNodeId)}
        <div className="w-1 h-8 sm:h-12 bg-amber-200 rounded-full" />
        <Node user={parentUser} role="Ancestor" onAdd={() => {}} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-[32px] p-4 sm:p-6 shadow-md border-b-4 border-orange-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">Pedigree & Evolution Tree</h2>
        </div>
        
        {/* Visual Tree */}
        <div className="flex flex-col items-center pt-4 pb-8 overflow-x-auto">
           {myLineage.sireId && (
             <div className="flex flex-col items-center mb-0">
               {renderAncestryChain(myLineage.id)}
             </div>
           )}
           <div className="flex gap-8 sm:gap-24 relative mt-12 mb-12">
             <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-amber-200 -z-10 mt-4 rounded-full"/>
             <div className="absolute top-1/2 left-1/2 w-1 h-12 bg-amber-200 -z-10 mt-4 rounded-full"/>
             {!myLineage.sireId && <Node user={sire} role="Sire" onAdd={() => {}} />}
             <Node user={dam} role="Dam" onAdd={() => {}} />
           </div>
           
           <div className="mb-12">
              <Node user={currentUser} role="Subject" onAdd={() => {}} highlight />
           </div>
           
           {myLineage.offspringIds.length > 0 && (
             <div className="flex gap-6 relative">
                <div className="absolute -top-12 left-1/2 w-1 h-12 bg-teal-200 -z-10 rounded-full"/>
                <div className="absolute -top-6 left-[10%] right-[10%] h-1 bg-teal-200 -z-10 rounded-full"/>
                {myLineage.offspringIds.map((id, i) => (
                  <div key={id} className="relative">
                    <div className="absolute -top-6 left-1/2 w-1 h-6 bg-teal-200 -z-10 rounded-full"/>
                    <Node user={users[id]} role="Offspring" onAdd={() => {}} />
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {myRequests.length > 0 && (
        <div className="bg-purple-50 rounded-[32px] p-6 shadow-md border-b-4 border-purple-200">
          <h3 className="font-black text-purple-800 text-xl mb-4 flex items-center gap-2">
            <span className="text-2xl">📬</span> Lineage Confirmations
          </h3>
          <div className="space-y-4">
            {myRequests.map(req => {
              const fromUser = users[req.fromUserId];
              return (
                <div key={req.id} className="bg-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-3 sm:gap-0">
                  <div className="flex items-center gap-3">
                    <img src={fromUser?.avatarUrl} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="Avatar"/>
                    <div>
                      <p className="font-bold text-slate-800">{fromUser?.name}</p>
                      <p className="text-xs sm:text-sm text-slate-500">Claims to be your <strong className="text-purple-600">{req.relationship}</strong></p>
                    </div>
                  </div>
                  <div className="flex gap-2 self-end sm:self-auto">
                    <button onClick={() => onConfirm(req.id)} className="p-2 sm:px-4 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-xl transition-colors font-bold text-sm flex items-center justify-center gap-2">
                      <Check className="w-5 h-5"/><span className="hidden sm:inline">Accept</span>
                    </button>
                    <button onClick={() => onReject(req.id)} className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors font-bold text-sm flex items-center justify-center">
                      <X className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="bg-teal-50 rounded-[32px] p-6 shadow-md border-b-4 border-teal-200">
        <h3 className="font-black text-teal-800 text-xl mb-4 flex items-center gap-2">
          <span className="text-2xl">🧬</span> Breeding Optimizer
        </h3>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <label className="block text-sm font-bold text-slate-500 mb-2">Select Potential Mate</label>
          <div className="relative">
            <select 
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 outline-none focus:border-teal-300 font-bold text-slate-700 appearance-none cursor-pointer"
              value={optimizerMate}
              onChange={(e) => setOptimizerMate(e.target.value)}
            >
              <option value="">Choose a pet...</option>
              {Object.values(users).filter(u => u.id !== currentUser.id).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.handle})</option>
              ))}
            </select>
          </div>
        </div>

        {optimizerMate && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-teal-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black text-slate-700">Relatedness Coefficient</span>
              <span className={`font-black text-2xl ${relatedness > 20 ? 'text-orange-500' : 'text-teal-500'}`}>
                {relatedness}%
              </span>
            </div>
            
            <div className="h-4 bg-slate-100 rounded-full mb-6 overflow-hidden">
               <div className={`h-full transition-all duration-1000 ${relatedness > 20 ? 'bg-orange-500' : 'bg-teal-500'}`} style={{width: `${Math.max(relatedness, 5)}%`}} />
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl mb-6 bg-slate-50">
              {relatedness > 20 ? (
                <ShieldAlert className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-teal-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-slate-800 text-sm sm:text-base">
                  {relatedness > 20 ? 'High Inbreeding Risk' : 'Optimal Genetic Diversity'}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {relatedness > 20 
                    ? 'These animals share too many recent ancestors. Breeding is not recommended.' 
                    : 'These animals have diverse lineages, promoting healthy and robust offspring!'}
                </p>
              </div>
            </div>

            <button 
              className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:opacity-100 text-white font-black shadow-lg shadow-teal-200 transition-all disabled:shadow-none"
              disabled={relatedness > 20}
              onClick={() => onSendRequest(optimizerMate, 'offspring')}
            >
              PROPOSE BREEDING
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Node({ user, role, onAdd, highlight = false }: { user: User | null, role: string, onAdd: () => void, highlight?: boolean }) {
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-2 z-10 w-20 sm:w-32 cursor-pointer group" onClick={onAdd}>
         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center group-hover:border-amber-400 group-hover:bg-amber-50 transition-colors">
            <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 group-hover:text-amber-500" />
         </div>
         <span className="font-bold text-slate-400 text-[10px] sm:text-xs">{role}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 z-10 w-20 sm:w-32">
       <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-lg border-4 ${highlight ? 'border-orange-500' : 'border-white'}`}>
          <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.name} />
       </div>
       <div className="text-center w-full px-1">
         <p className="font-black text-slate-800 text-[10px] sm:text-sm truncate w-full">{user.name}</p>
         <p className="font-bold text-slate-400 text-[10px] sm:text-xs">{role}</p>
       </div>
    </div>
  )
}
