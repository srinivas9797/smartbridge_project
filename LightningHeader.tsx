import React from 'react';
import { Cloud, Search, Shield, User, HelpCircle, Bell, RefreshCw } from 'lucide-react';
import { Role } from '../types';

interface LightningHeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  onResetData: () => void;
}

export default function LightningHeader({
  currentRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
  onResetData,
}: LightningHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white text-[#1a1a1a] border-b border-black/10 shadow-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 h-16 bg-white">
        {/* Left Logo / Branding */}
        <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <div className="bg-slate-950 p-1.5 rounded-full text-white flex items-center justify-center">
            <Cloud size={16} className="fill-current" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-sans font-black text-2xl tracking-tighter text-[#1a1a1a]">AI.RCMS</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 border border-black/5 px-2 py-0.5 rounded-full">
              Recruitment Workspace
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8 relative">
          <Search className="absolute left-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search candidates, skills, job openings, or departments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border border-black/10 text-[#1a1a1a] placeholder-slate-400 text-xs rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-black/20 focus:bg-white transition-all duration-150"
          />
        </div>

        {/* Right side Actions */}
        <div className="flex items-center space-x-4">
          {/* Reset System Button */}
          <button
            onClick={onResetData}
            title="Restore Original Salesforce Records"
            className="p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer text-slate-600 flex items-center gap-1.5 text-[10px] bg-slate-50 border border-black/10 px-3 py-1.5 font-bold uppercase tracking-widest"
          >
            <RefreshCw size={12} className="hover:rotate-180 transition-transform duration-500 text-slate-500" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* Role Switcher Widget */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-black/10 rounded-full p-1 pl-3.5">
            <span className="hidden xl:inline text-[9px] text-slate-400 uppercase tracking-widest font-bold">
              Persona:
            </span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as Role)}
              className="bg-transparent border-none text-[#1a1a1a] text-xs rounded px-2.5 py-1 font-bold focus:outline-none cursor-pointer"
            >
              <option value="Recruiter">Recruiter (Marc)</option>
              <option value="Hiring Manager">Hiring Manager (Bret)</option>
              <option value="System Admin">System Admin (Clara)</option>
            </select>
          </div>

          {/* Notification Indicator */}
          <div className="relative cursor-pointer p-1.5 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1 right-1 bg-indigo-600 text-[8px] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </div>

          {/* User Info / Avatar */}
          <div className="flex items-center space-x-2 border-l border-black/10 pl-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shadow-inner text-xs">
              {currentRole === 'Recruiter' ? 'MB' : currentRole === 'Hiring Manager' ? 'BT' : 'CB'}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-tight text-[#1a1a1a]">
                {currentRole === 'Recruiter' ? 'Marc Benioff' : currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton'}
              </p>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold leading-none mt-0.5">
                {currentRole}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs bar */}
      <div className="bg-white border-t border-black/10 flex items-center justify-between px-8 h-12">
        <nav className="flex space-x-8 h-full">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`text-[11px] font-bold uppercase tracking-widest h-full px-1 cursor-pointer transition-colors border-b-2 ${
              activeView === 'dashboard'
                ? 'text-black border-black'
                : 'text-black/50 border-transparent hover:text-black hover:border-black/20'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onViewChange('candidates')}
            className={`text-[11px] font-bold uppercase tracking-widest h-full px-1 cursor-pointer transition-colors border-b-2 ${
              activeView === 'candidates'
                ? 'text-black border-black'
                : 'text-black/50 border-transparent hover:text-black hover:border-black/20'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => onViewChange('jobs')}
            className={`text-[11px] font-bold uppercase tracking-widest h-full px-1 cursor-pointer transition-colors border-b-2 ${
              activeView === 'jobs'
                ? 'text-black border-black'
                : 'text-black/50 border-transparent hover:text-black hover:border-black/20'
            }`}
          >
            Job Openings
          </button>
          {currentRole === 'System Admin' && (
            <button
              onClick={() => onViewChange('setup-flows')}
              className={`text-[11px] font-bold uppercase tracking-widest h-full px-1 cursor-pointer transition-colors border-b-2 flex items-center gap-1.5 ${
                activeView === 'setup-flows'
                  ? 'text-black border-black'
                  : 'text-black/50 border-transparent hover:text-black hover:border-black/20'
              }`}
            >
              <Shield size={12} className="text-orange-600 animate-pulse" />
              Setup: Agentforce
            </button>
          )}
        </nav>

        {/* Dynamic Context banner */}
        <div className="hidden lg:block text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Org ID: <span className="text-[#1a1a1a] font-black">RECRUIT_982B</span> | Sandbox: v26
        </div>
      </div>
    </header>
  );
}
