import React from 'react';
import { 
  Users, Briefcase, FileCheck, Brain, TrendingUp, AlertTriangle, 
  Calendar, CheckCircle, XCircle, ArrowRight, ArrowUpRight, Award, ShieldAlert
} from 'lucide-react';
import { Candidate, Job, Interview, Role } from '../types';

interface DashboardViewProps {
  candidates: Candidate[];
  jobs: Job[];
  interviews: Interview[];
  currentRole: Role;
  onSelectCandidate: (id: string) => void;
  onApproveOffer: (id: string, comment?: string) => void;
  onRejectOffer: (id: string, reason?: string) => void;
  onViewAllCandidates: () => void;
  onViewAllJobs: () => void;
}

export default function DashboardView({
  candidates,
  jobs,
  interviews,
  currentRole,
  onSelectCandidate,
  onApproveOffer,
  onRejectOffer,
  onViewAllCandidates,
  onViewAllJobs,
}: DashboardViewProps) {
  // Compute Key Metrics
  const activeCandidates = candidates.filter(c => c.status === 'Active');
  const totalCandidatesCount = activeCandidates.length;
  const openJobsCount = jobs.filter(j => j.status === 'Open').length;
  
  const pendingApprovals = candidates.filter(
    c => c.status === 'Active' && c.offerStatus === 'Pending Approval'
  );
  
  const aiScreenedCount = candidates.filter(c => c.aiScreened).length;
  const aiScreenedPct = candidates.length > 0 
    ? Math.round((aiScreenedCount / candidates.length) * 100) 
    : 0;

  // Group candidates by stage
  const stagesCount = {
    Applied: activeCandidates.filter(c => c.stage === 'Applied').length,
    Screening: activeCandidates.filter(c => c.stage === 'Screening').length,
    Interview: activeCandidates.filter(c => c.stage === 'Interview').length,
    Offer: activeCandidates.filter(c => c.stage === 'Offer').length,
    Onboarding: activeCandidates.filter(c => c.stage === 'Onboarding').length,
  };

  // Get upcoming interviews
  const upcomingInterviews = interviews
    .filter(i => i.status === 'Scheduled')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 4);

  // Average AI Score
  const screenedWithScore = candidates.filter(c => c.aiScreened && c.aiScoreOverall !== undefined);
  const avgAiScore = screenedWithScore.length > 0
    ? Math.round(screenedWithScore.reduce((sum, c) => sum + (c.aiScoreOverall || 0), 0) / screenedWithScore.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Welcome & Role Context Alert */}
      <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif italic font-light text-[#1a1a1a] flex items-center gap-2">
            Welcome back, {currentRole === 'Recruiter' ? 'Marc' : currentRole === 'Hiring Manager' ? 'Bret' : 'Clara'}!
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">
            Recruitment Salesforce Hub. Current workspace permissions: <span className="font-bold text-[10px] uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">{currentRole}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] p-4 rounded-xl flex items-center gap-2.5 max-w-md leading-relaxed">
            <ShieldAlert size={14} className="text-amber-600 flex-shrink-0" />
            <span>
              {currentRole === 'Recruiter' && 'You can create candidates and schedule panels. Offers require Manager approval.'}
              {currentRole === 'Hiring Manager' && 'You hold authority to Approve/Reject salary and sign-on offers.'}
              {currentRole === 'System Admin' && 'Full platform credentials. Set up automation Flows and inspect engine logs.'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of KPI Metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 bg-slate-50 w-24 h-24 rounded-full -z-10 group-hover:bg-indigo-50/50 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Active Portfolio</p>
              <h3 className="text-4xl font-serif italic font-light text-[#1a1a1a] mt-2">{totalCandidatesCount}</h3>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-2">
                <TrendingUp size={10} /> +12% this cycle
              </span>
            </div>
            <div className="bg-slate-50 border border-black/5 text-slate-800 p-3 rounded-xl">
              <Users size={18} />
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 bg-slate-50 w-24 h-24 rounded-full -z-10 group-hover:bg-indigo-50/50 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Open Job Positions</p>
              <h3 className="text-4xl font-serif italic font-light text-[#1a1a1a] mt-2">{openJobsCount}</h3>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-2 cursor-pointer hover:underline" onClick={onViewAllJobs}>
                Across 3 departments
              </span>
            </div>
            <div className="bg-slate-50 border border-black/5 text-slate-800 p-3 rounded-xl">
              <Briefcase size={18} />
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 bg-slate-50 w-24 h-24 rounded-full -z-10 group-hover:bg-indigo-50/50 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Salary Approvals</p>
              <h3 className={`text-4xl font-serif italic font-light mt-2 ${pendingApprovals.length > 0 ? 'text-amber-600' : 'text-[#1a1a1a]'}`}>
                {pendingApprovals.length}
              </h3>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-2">
                {pendingApprovals.length > 0 ? 'Action required' : 'All decisions current'}
              </span>
            </div>
            <div className={`p-3 rounded-xl border ${pendingApprovals.length > 0 ? 'bg-amber-50 border-amber-100 text-amber-600 animate-pulse' : 'bg-slate-50 border-black/5 text-slate-400'}`}>
              <FileCheck size={18} />
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 bg-slate-50 w-24 h-24 rounded-full -z-10 group-hover:bg-indigo-50/50 transition-colors" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Agentforce Coverage</p>
              <h3 className="text-4xl font-serif italic font-light text-[#1a1a1a] mt-2">{aiScreenedPct}%</h3>
              <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-2">
                Avg Match Score: {avgAiScore}/100
              </span>
            </div>
            <div className="bg-slate-50 border border-black/5 text-indigo-600 p-3 rounded-xl">
              <Brain size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Split: Charts & Action items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Conversion Funnel and Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Funnel chart and metrics */}
          <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/5">
              <div>
                <h2 className="text-lg font-serif italic font-light text-[#1a1a1a]">Salesforce Recruitment Funnel</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Tracking candidates through workflow milestones</p>
              </div>
              <button 
                onClick={onViewAllCandidates}
                className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Manage Candidates <ArrowRight size={12} />
              </button>
            </div>

            {/* Custom Interactive SVG Recruitment Funnel */}
            <div className="space-y-4 my-6">
              {[
                { stage: 'Applied', count: stagesCount.Applied, width: 'w-full', bg: 'bg-slate-900', iconColor: 'text-slate-900' },
                { stage: 'Screening', count: stagesCount.Screening, width: 'w-[85%]', bg: 'bg-slate-700', iconColor: 'text-slate-700' },
                { stage: 'Interview', count: stagesCount.Interview, width: 'w-[70%]', bg: 'bg-indigo-900', iconColor: 'text-indigo-900' },
                { stage: 'Offer', count: stagesCount.Offer, width: 'w-[55%]', bg: 'bg-indigo-700', iconColor: 'text-indigo-700' },
                { stage: 'Onboarding', count: stagesCount.Onboarding, width: 'w-[40%]', bg: 'bg-emerald-800', iconColor: 'text-emerald-800' },
              ].map((item, index) => {
                const percentage = totalCandidatesCount > 0 ? Math.round((item.count / totalCandidatesCount) * 100) : 0;
                return (
                  <div key={item.stage} className="flex items-center gap-4 group">
                    {/* Stage Label */}
                    <div className="w-24 text-right text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors tracking-wide">
                      {item.stage}
                    </div>
                    {/* Visual Funnel Bar */}
                    <div className="flex-1 bg-slate-50 border border-black/5 h-8 rounded-full relative overflow-hidden">
                      <div 
                        className={`h-full ${item.bg} rounded-full transition-all duration-700 ease-out flex items-center px-4`}
                        style={{ width: `${Math.max(12, (item.count / (totalCandidatesCount || 1)) * 100)}%` }}
                      >
                        {item.count > 0 && (
                          <span className="text-[10px] font-bold text-white tracking-wide whitespace-nowrap">
                            {item.count} {item.count === 1 ? 'Lead' : 'Leads'}
                          </span>
                        )}
                      </div>
                      <span className="absolute right-4 top-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sourcing Analysis & Top Job Matches */}
          <div className="bg-white rounded-xl border border-black/10 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-black/5">
              <div>
                <h2 className="text-lg font-serif italic font-light text-[#1a1a1a]">Job Sourcing Velocity</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Applications per job opening</p>
              </div>
              <button onClick={onViewAllJobs} className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 cursor-pointer">
                View Jobs Panel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => {
                const candidateMatches = candidates.filter(c => c.jobId === job.id && c.status === 'Active');
                const avgJobScore = candidateMatches.length > 0
                  ? Math.round(candidateMatches.reduce((sum, c) => sum + (c.aiScoreOverall || 0), 0) / candidateMatches.length)
                  : 0;
                return (
                  <div key={job.id} className="p-4 border border-black/5 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">{job.title}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">{job.department} • {job.location}</p>
                      <div className="flex items-center gap-1.5 mt-3">
                        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-100 border border-black/5 text-slate-600 rounded-full">
                          {candidateMatches.length} candidates
                        </span>
                        {avgJobScore > 0 && (
                          <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full flex items-center gap-0.5">
                            <Brain size={9} /> score: {avgJobScore}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${job.status === 'Open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Decision & Action Widgets */}
        <div className="space-y-6">
          {/* Pending Offer Approval list */}
          <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <FileCheck className="text-amber-500" size={14} />
                Requires Decision
              </span>
              <span className="bg-amber-100 text-amber-800 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {pendingApprovals.length} pending
              </span>
            </div>

            <div className="p-5 divide-y divide-black/5">
              {pendingApprovals.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle size={28} className="text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-800 mt-3">All decisions current</p>
                  <p className="text-[10px] text-slate-400 mt-1">No offers are pending approval.</p>
                </div>
              ) : (
                pendingApprovals.map(cand => (
                  <div key={cand.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <button 
                          onClick={() => onSelectCandidate(cand.id)}
                          className="text-xs font-bold text-[#1a1a1a] hover:text-indigo-600 text-left hover:underline"
                        >
                          {cand.name}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-0.5">{cand.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono font-bold text-[#1a1a1a]">
                          ${cand.offeredSalary?.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Base</p>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-3 rounded-xl border border-black/5 text-[10.5px] text-slate-600 space-y-1">
                      <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Recruiter:</span> {cand.recruiterName}</p>
                      <p><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Bonus / Equity:</span> ${cand.offerBonus?.toLocaleString()} • {cand.offerEquity || 'None'}</p>
                      {cand.aiScoreOverall && (
                        <p className="flex items-center gap-1 text-indigo-600 font-semibold mt-1">
                          <Brain size={10} /> Candidate Match: {cand.aiScoreOverall}/100
                        </p>
                      )}
                    </div>

                    {/* Role-Based approval button actions */}
                    {currentRole === 'Hiring Manager' || currentRole === 'System Admin' ? (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => onApproveOffer(cand.id)}
                          className="flex-1 bg-black hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-2 rounded-full cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={10} /> Approve
                        </button>
                        <button
                          onClick={() => onRejectOffer(cand.id)}
                          className="flex-1 border border-black/10 hover:bg-slate-50 text-[#1a1a1a] font-bold text-[10px] uppercase tracking-widest py-2 rounded-full cursor-pointer transition-all flex items-center justify-center gap-1"
                        >
                          <XCircle size={10} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="bg-amber-50/50 text-amber-900 text-[10px] p-2.5 rounded-xl flex items-start gap-2 border border-amber-100">
                        <AlertTriangle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="leading-snug">Sourcing locks approval capability. Log in as Hiring Manager to sign off.</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming scheduled interview panels */}
          <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Calendar className="text-slate-400" size={14} />
                Interview Pipeline
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Scheduled</span>
            </div>

            <div className="p-5 divide-y divide-black/5">
              {upcomingInterviews.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4 italic">No interviews currently scheduled.</p>
              ) : (
                upcomingInterviews.map(int => (
                  <div key={int.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1a1a1a]">{int.candidateName}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">{int.stage} Panel • {int.interviewerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#1a1a1a]">{int.date}</p>
                      <p className="text-[9px] text-slate-400 font-medium">{int.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Tips / Governance rules */}
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-5 space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-indigo-600 tracking-[0.2em] flex items-center gap-1.5">
              <Award size={14} className="text-indigo-600" />
              Smart Recommendations
            </h4>
            <ul className="text-[11px] text-indigo-900 leading-relaxed space-y-2 font-medium">
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Candidates require both <span className="underline decoration-indigo-200">Technical and Cultural panels</span> before advancing to Offer terms.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">•</span>
                <span>Agentforce AI screen logs are generated instantly upon record sourcing to mitigate compliance anomalies.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
