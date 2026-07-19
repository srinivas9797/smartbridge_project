
import React, { useState } from 'react';
import { 
  Plus, Search, List, Kanban, Filter, UserPlus, Briefcase, 
  ChevronRight, Brain, AlertCircle, FileText, CheckCircle, ArrowRight
} from 'lucide-react';
import { Candidate, Job, Stage, Role } from '../types';

interface RecordListViewProps {
  type: 'candidates' | 'jobs';
  candidates: Candidate[];
  jobs: Job[];
  currentRole: Role;
  searchQuery: string;
  onSelectCandidate: (id: string) => void;
  onSelectJob: (id: string) => void;
  onOpenCreateModal: () => void;
  onUpdateCandidateStage: (id: string, stage: Stage) => void;
}

export default function RecordListView({
  type,
  candidates,
  jobs,
  currentRole,
  searchQuery,
  onSelectCandidate,
  onSelectJob,
  onOpenCreateModal,
  onUpdateCandidateStage,
}: RecordListViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  // Filter candidates
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' ? true : cand.status === statusFilter;
    const matchesDept = deptFilter === 'All' ? true : cand.jobTitle.toLowerCase().includes(deptFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesDept;
  });

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : job.status === statusFilter;
    const matchesDept = deptFilter === 'All' ? true : job.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStageColor = (stage: Stage) => {
    switch (stage) {
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Screening': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Interview': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Offer': return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'Onboarding': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  const getRiskColor = (level?: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-4">
      {/* List Header */}
      <div className="bg-white border border-black/10 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-slate-950 text-white rounded-full">
              {type === 'candidates' ? <UserPlus size={16} /> : <Briefcase size={16} />}
            </span>
            <h1 className="text-xl font-serif italic font-light text-[#1a1a1a]">
              {type === 'candidates' ? 'Candidates Sourcing Directory' : 'Job Openings Cloud'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {type === 'candidates' 
              ? `Showing ${filteredCandidates.length} Candidates. Filter and screen profiles using integrated Agentforce workflows.`
              : `Showing ${filteredJobs.length} active positions. Add positions and customize candidate matching standards.`}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCreateModal}
          className="bg-black hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-2.5 px-4 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
        >
          <Plus size={12} />
          {type === 'candidates' ? 'New Candidate Record' : 'Create Job Opening'}
        </button>
      </div>

      {/* Control filters & view toggles */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 border border-black/10 rounded-xl shadow-sm">
        {/* Sourcing Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <Filter size={14} />
            <span>Filter:</span>
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-black/10 text-xs rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-black/20 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {type === 'candidates' ? (
              <>
                <option value="Active">Active Sourcing</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </>
            ) : (
              <>
                <option value="Open">Status: Open</option>
                <option value="Closed">Status: Closed</option>
              </>
            )}
          </select>

          {/* Department / Category Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="border border-black/10 text-xs rounded-xl px-3 py-1.5 bg-slate-50 text-slate-700 font-bold focus:outline-none focus:ring-1 focus:ring-black/20 cursor-pointer"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Human Resources">Human Resources</option>
          </select>
        </div>

        {/* Kanban toggle for Candidates only */}
        {type === 'candidates' && (
          <div className="flex items-center border border-black/10 rounded-full overflow-hidden p-1 bg-slate-50 self-end">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Salesforce List View"
            >
              <List size={12} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-all ${viewMode === 'kanban' ? 'bg-black text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              title="Salesforce Kanban Board"
            >
              <Kanban size={12} />
              <span>Kanban</span>
            </button>
          </div>
        )}
      </div>

      {/* TABLE LIST VIEW */}
      {viewMode === 'list' || type === 'jobs' ? (
        <div className="bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden overflow-x-auto">
          {type === 'candidates' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-black/10 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-5 py-3">Candidate Name</th>
                  <th className="px-5 py-3">Recruitment Stage</th>
                  <th className="px-5 py-3">Assigned Job Opening</th>
                  <th className="px-5 py-3">Exp</th>
                  <th className="px-5 py-3 text-center">Agentforce Score</th>
                  <th className="px-5 py-3">AI Risk</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400 font-medium">
                      No candidate records found matching current criteria.
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map(cand => (
                    <tr 
                      key={cand.id} 
                      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                      onClick={() => onSelectCandidate(cand.id)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-[#1a1a1a] group-hover:text-indigo-600 group-hover:underline transition-colors">
                          {cand.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{cand.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStageColor(cand.stage)}`}>
                          {cand.stage}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-semibold">
                        {cand.jobTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono font-medium">
                        {cand.experienceYears}y
                      </td>
                      <td className="px-5 py-3.5">
                        {cand.aiScreened ? (
                          <div className="flex flex-col items-center">
                            <span className="font-mono font-bold text-[#1a1a1a]">
                              {cand.aiScoreOverall}/100
                            </span>
                            <div className="w-16 bg-slate-100 h-1 rounded-full overflow-hidden mt-1.5 border border-black/5">
                              <div 
                                className="bg-indigo-600 h-full rounded-full" 
                                style={{ width: `${cand.aiScoreOverall}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic block text-center">Unscreened</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        {cand.aiScreened ? (
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${getRiskColor(cand.aiRiskLevel)}`}>
                            {cand.aiRiskLevel || 'Low'}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          cand.status === 'Hired' ? 'bg-emerald-50 text-emerald-700' :
                          cand.status === 'Rejected' ? 'bg-red-50 text-red-700' :
                          cand.status === 'Withdrawn' ? 'bg-slate-50 text-slate-500' : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectCandidate(cand.id)}
                          className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold flex items-center justify-end gap-1 text-xs ml-auto cursor-pointer"
                        >
                          View <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-black/10 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-5 py-3">Job Title</th>
                  <th className="px-5 py-3">Department</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Salary Bracket</th>
                  <th className="px-5 py-3">Applications</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 font-medium">
                      No jobs currently posted. Create one to begin matching.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => {
                    const candidateCount = candidates.filter(c => c.jobId === job.id).length;
                    return (
                      <tr 
                        key={job.id} 
                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                        onClick={() => onSelectJob(job.id)}
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-[#1a1a1a] group-hover:text-indigo-600 group-hover:underline transition-colors">
                            {job.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Created {job.createdAt}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 font-semibold">
                          {job.department}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          {job.location}
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono font-medium">
                          ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-[10px] border border-indigo-100 uppercase tracking-wider">
                            {candidateCount} Active
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            job.status === 'Open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectJob(job.id)}
                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold flex items-center justify-end gap-1 text-xs ml-auto cursor-pointer"
                          >
                            Explore matches <ChevronRight size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* SALESFORCE KANBAN INTERACTIVE BOARD */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[650px] overflow-x-auto pb-4">
          {(['Applied', 'Screening', 'Interview', 'Offer', 'Onboarding'] as Stage[]).map(stage => {
            const stageCandidates = filteredCandidates.filter(c => c.stage === stage);
            
            // Calculate sum of active candidate salaries at offer stage for context
            const offerSum = stageCandidates.reduce((sum, c) => sum + (c.offeredSalary || 0), 0);

            return (
              <div 
                key={stage} 
                className="bg-white border border-black/10 rounded-xl p-4 flex flex-col h-full min-w-[230px] shadow-sm"
              >
                {/* Stage header */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/5">
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest">{stage}</h3>
                    {stage === 'Offer' && offerSum > 0 && (
                      <p className="text-[9px] text-slate-400 font-mono mt-1">Val: ${offerSum.toLocaleString()}</p>
                    )}
                  </div>
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/5">
                    {stageCandidates.length}
                  </span>
                </div>

                {/* Candidate card list */}
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {stageCandidates.length === 0 ? (
                    <div className="h-full border border-dashed border-black/10 rounded-xl flex items-center justify-center p-4">
                      <p className="text-[10px] text-slate-400 text-center italic">No profiles in this segment.</p>
                    </div>
                  ) : (
                    stageCandidates.map(cand => (
                      <div 
                        key={cand.id} 
                        className="bg-slate-50 hover:bg-white border border-black/5 hover:border-black/15 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                        onClick={() => onSelectCandidate(cand.id)}
                      >
                        {/* Quick action for move stage */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          {/* Previous Stage */}
                          {stage !== 'Applied' && (
                            <button 
                              title="Move Previous Stage"
                              onClick={() => {
                                const stages: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Onboarding'];
                                const prevIndex = stages.indexOf(stage) - 1;
                                onUpdateCandidateStage(cand.id, stages[prevIndex]);
                              }}
                              className="p-1 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-bold text-xs"
                            >
                              ←
                            </button>
                          )}
                          {/* Next Stage */}
                          {stage !== 'Onboarding' && (
                            <button 
                              title="Advance Candidate Stage"
                              onClick={() => {
                                const stages: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Onboarding'];
                                const nextIndex = stages.indexOf(stage) + 1;
                                onUpdateCandidateStage(cand.id, stages[nextIndex]);
                              }}
                              className="p-1 bg-black text-white hover:bg-slate-800 rounded text-xs font-bold"
                            >
                              →
                            </button>
                          )}
                        </div>

                        {/* Candidate basic */}
                        <p className="text-xs font-bold text-[#1a1a1a] hover:text-indigo-600 transition-colors">
                          {cand.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">{cand.jobTitle}</p>
                        
                        {/* Rating or requirements summary */}
                        <div className="mt-3 flex items-center justify-between">
                          {cand.aiScreened ? (
                            <div className="flex items-center gap-1">
                              <Brain size={11} className="text-indigo-600" />
                              <span className="text-[10px] font-mono font-bold text-slate-700">
                                {cand.aiScoreOverall}/100
                              </span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-400 italic">No screen logs</span>
                          )}

                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            cand.status === 'Active' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                            cand.status === 'Hired' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {cand.status}
                          </span>
                        </div>

                        {/* Experience and priority indicators */}
                        <div className="mt-2.5 pt-2.5 border-t border-black/5 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>{cand.experienceYears} Years Exp</span>
                          {cand.aiRiskLevel === 'High' && (
                            <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold uppercase tracking-wider">
                              <AlertCircle size={8} /> High Risk
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
