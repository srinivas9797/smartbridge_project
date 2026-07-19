import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Mail, Phone, Calendar, Briefcase, Award, Clock, FileText, 
  Brain, CheckCircle, AlertTriangle, Plus, Send, RefreshCw, Sparkles, AlertCircle, X, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Candidate, Job, Interview, Activity, Stage, Role } from '../types';

interface CandidateDetailViewProps {
  candidate: Candidate;
  job?: Job;
  interviews: Interview[];
  activities: Activity[];
  currentRole: Role;
  onBack: () => void;
  onUpdateStage: (stage: Stage) => void;
  onUpdateStatus: (status: 'Active' | 'Hired' | 'Rejected' | 'Withdrawn') => void;
  onLogActivity: (type: 'Email' | 'Call' | 'Note' | 'Task', title: string, description: string) => void;
  onScheduleInterview: (stage: 'Technical' | 'Cultural' | 'Hiring Manager' | 'System Design', interviewer: string, date: string, time: string) => void;
  onSubmitOfferApproval: (salary: number, bonus: number, equity: string) => void;
  onApproveOffer: (comment?: string) => void;
  onRejectOffer: (reason?: string) => void;
  onRunAiScreen: () => void;
  isAiScreening: boolean;
}

export default function CandidateDetailView({
  candidate,
  job,
  interviews,
  activities,
  currentRole,
  onBack,
  onUpdateStage,
  onUpdateStatus,
  onLogActivity,
  onScheduleInterview,
  onSubmitOfferApproval,
  onApproveOffer,
  onRejectOffer,
  onRunAiScreen,
  isAiScreening,
}: CandidateDetailViewProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'interviews' | 'offer'>('details');
  const [selectedPathStage, setSelectedPathStage] = useState<Stage>(candidate.stage);
  
  // Local states for posting activity
  const [activityType, setActivityType] = useState<'Email' | 'Call' | 'Note' | 'Task'>('Note');
  const [activityTitle, setActivityTitle] = useState('');
  const [activityDesc, setActivityDesc] = useState('');

  // Local states for scheduling interview
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [intStage, setIntStage] = useState<'Technical' | 'Cultural' | 'Hiring Manager' | 'System Design'>('Technical');
  const [intInterviewer, setIntInterviewer] = useState('');
  const [intDate, setIntDate] = useState('');
  const [intTime, setIntTime] = useState('');

  // Local states for submitting offer
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [proposedSalary, setProposedSalary] = useState(job ? Math.round((job.salaryMin + job.salaryMax) / 2) : 150000);
  const [proposedBonus, setProposedBonus] = useState(10000);
  const [proposedEquity, setProposedEquity] = useState('0.02%');

  // Approval comments state
  const [approvalComment, setApprovalComment] = useState('');

  const stagesList: Stage[] = ['Applied', 'Screening', 'Interview', 'Offer', 'Onboarding'];

  const getStageColorIndex = (stage: Stage) => {
    return stagesList.indexOf(stage);
  };

  const handlePostActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) return;
    onLogActivity(activityType, activityTitle, activityDesc);
    setActivityTitle('');
    setActivityDesc('');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intInterviewer.trim() || !intDate || !intTime) return;
    onScheduleInterview(intStage, intInterviewer, intDate, intTime);
    setShowInterviewModal(false);
    setIntInterviewer('');
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOfferApproval(proposedSalary, proposedBonus, proposedEquity);
    setShowOfferModal(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Back button and Record header info */}
      <div className="flex items-center justify-between pb-3 border-b border-black/10">
        <button
          onClick={onBack}
          className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Back to Sourcing Board
        </button>
        <div className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest">
          Lead Ref: <span className="text-slate-600">ID-{candidate.id.toUpperCase()}</span>
        </div>
      </div>

      {/* COMPACT RECORD HEADER (Editorial Style) */}
      <div className="bg-white border border-black/10 rounded-xl p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white text-lg font-serif italic shadow-sm">
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-serif font-light text-[#1a1a1a]">{candidate.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                candidate.status === 'Hired' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                candidate.status === 'Rejected' ? 'bg-red-50 text-red-800 border-red-200' :
                'bg-indigo-50 text-indigo-700 border-indigo-200/50'
              }`}>
                {candidate.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{candidate.role}</p>
            
            {/* Sourced metadata details */}
            <div className="flex flex-wrap items-center gap-4 text-[10.5px] text-slate-400 mt-2">
              <span className="flex items-center gap-1 text-slate-500 font-medium"><Mail size={12} /> {candidate.email}</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium"><Phone size={12} /> {candidate.phone}</span>
              <span className="flex items-center gap-1 font-bold text-indigo-600">
                <Briefcase size={12} /> {candidate.jobTitle}
              </span>
            </div>
          </div>
        </div>

        {/* COMPACT HEADER PRIMARY ACTIONS */}
        <div className="flex flex-wrap gap-2 self-stretch lg:self-auto justify-end">
          <button
            onClick={() => setShowInterviewModal(true)}
            className="border border-black/15 bg-white hover:bg-slate-50 text-slate-800 font-bold text-[10px] uppercase tracking-widest py-2 px-3.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Calendar size={12} /> Schedule Panel
          </button>

          {(candidate.stage === 'Interview' || candidate.stage === 'Offer') && (
            <button
              onClick={() => setShowOfferModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Award size={12} /> Submit Salary Offer
            </button>
          )}

          {currentRole === 'System Admin' && (
            <button
              onClick={() => {
                if (confirm('Delete this Candidate CRM record?')) {
                  onUpdateStatus('Withdrawn');
                  onBack();
                }
              }}
              className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full border border-red-200 hover:bg-red-50 text-red-600 cursor-pointer transition-colors"
            >
              Archive
            </button>
          )}
        </div>
      </div>

      {/* STAGE PATH */}
      <div className="bg-white border border-black/10 rounded-xl p-5 shadow-sm">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recruitment Stages Lifecycle</p>
        <div className="flex flex-col md:flex-row items-stretch md:items-center rounded-xl overflow-hidden border border-black/10">
          {stagesList.map((stage, index) => {
            const currentStageIndex = getStageColorIndex(candidate.stage);
            const selectedStageIndex = getStageColorIndex(selectedPathStage);
            
            let bgClass = '';
            let textClass = 'text-slate-500';

            if (stage === candidate.stage) {
              // Exact current stage
              bgClass = 'bg-slate-900 text-white';
              textClass = 'text-white';
            } else if (index < currentStageIndex) {
              // Past complete stages
              bgClass = 'bg-emerald-700 text-white';
              textClass = 'text-white';
            } else if (stage === selectedPathStage) {
              // Highlighted selection stage
              bgClass = 'bg-indigo-50 text-indigo-900';
              textClass = 'text-indigo-900';
            } else {
              // Unvisited future stages
              bgClass = 'bg-slate-50 hover:bg-slate-100';
              textClass = 'text-slate-600';
            }

            return (
              <button
                key={stage}
                onClick={() => setSelectedPathStage(stage)}
                className={`flex-1 text-center py-3 px-3 text-[10px] uppercase tracking-widest font-black transition-all border-b md:border-b-0 md:border-r border-black/10 last:border-none cursor-pointer flex items-center justify-center gap-1.5 relative ${bgClass}`}
              >
                {index < currentStageIndex && <CheckCircle size={12} className="text-emerald-100" />}
                <span className={textClass}>{stage}</span>
                {stage === candidate.stage && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-400" />
                )}
              </button>
            );
          })}

          {/* Mark Stage Complete Salesforce Button */}
          {selectedPathStage !== candidate.stage && (
            <button
              onClick={() => onUpdateStage(selectedPathStage)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest py-3 px-5 cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              Mark Completed <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* BENTO-GRID SPLIT: 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Details) - spans 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-black/10 rounded-xl shadow-sm">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">CRM Record Details</span>
            </div>
            <div className="p-4 space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Job Interest</label>
                <p className="font-bold text-slate-800 mt-1">{candidate.jobTitle}</p>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Department</label>
                <p className="font-semibold text-slate-700 mt-1">{job?.department || 'Engineering'}</p>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Professional Experience</label>
                <p className="font-mono font-bold text-slate-800 mt-1">{candidate.experienceYears} Years</p>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Primary Skills Stack</label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {candidate.skills.map(skill => (
                    <span key={skill} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[9px] border border-black/5 font-bold uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Recruiter Owner</label>
                <p className="font-bold text-slate-700 mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {candidate.recruiterName}
                </p>
              </div>

              <div>
                <label className="text-slate-400 font-bold uppercase tracking-wider text-[9px] block">Sourced Date</label>
                <p className="font-mono font-semibold text-slate-600 mt-1">{candidate.createdAt}</p>
              </div>
            </div>
          </div>

          {/* Full Resume text box */}
          <div className="bg-white border border-black/10 rounded-xl shadow-sm">
            <div className="bg-slate-50/80 px-5 py-3.5 border-b border-black/10 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                <FileText size={13} className="text-slate-500" />
                Dossier Resume
              </span>
            </div>
            <div className="p-3">
              <p className="text-[10px] text-slate-500 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-mono p-2.5 bg-slate-50 border border-black/5 rounded-xl">
                {candidate.resumeText || 'No resume file uploaded yet.'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Column (Subtabs & Timeline Feed) - spans 6 cols */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tabs header */}
          <div className="bg-white border border-black/10 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-black/10 flex">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-4 text-center text-[10px] uppercase tracking-widest font-black border-b-2 cursor-pointer transition-all ${
                  activeTab === 'details' ? 'border-black text-black bg-slate-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`flex-1 py-4 text-center text-[10px] uppercase tracking-widest font-black border-b-2 cursor-pointer transition-all ${
                  activeTab === 'activity' ? 'border-black text-black bg-slate-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Activities
              </button>
              <button
                onClick={() => setActiveTab('interviews')}
                className={`flex-1 py-4 text-center text-[10px] uppercase tracking-widest font-black border-b-2 cursor-pointer transition-all ${
                  activeTab === 'interviews' ? 'border-black text-black bg-slate-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Scorecards
              </button>
              <button
                onClick={() => setActiveTab('offer')}
                className={`flex-1 py-4 text-center text-[10px] uppercase tracking-widest font-black border-b-2 cursor-pointer transition-all ${
                  activeTab === 'offer' ? 'border-black text-black bg-slate-50/40' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Offer
              </button>
            </div>

            <div className="p-4">
              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                  <div>
                    <h3 className="font-serif text-base text-[#1a1a1a] border-b border-black/10 pb-2">Candidate Statement</h3>
                    <p className="mt-2 text-slate-600">
                      The candidate is currently mapped to job ID <span className="font-semibold text-indigo-600">{candidate.jobId}</span> in department <span className="font-semibold">{job?.department}</span>. 
                      Agentforce screening was triggered upon submission to verify skills compatibility.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-serif text-base text-[#1a1a1a] border-b border-black/10 pb-2 mt-4">Job Opening Overview</h3>
                    <div className="mt-3 bg-slate-50/60 p-4 rounded-xl border border-black/10 space-y-2">
                      <p className="font-serif font-bold text-slate-900 text-sm">{job?.title}</p>
                      <p className="text-slate-600">{job?.description}</p>
                      <p className="font-bold uppercase tracking-wider text-[9px] text-slate-500 flex items-center gap-1.5">
                        <Award size={12} className="text-slate-400" />
                        Target requirements: {job?.requirements.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVITY FEED TIMELINE */}
              {activeTab === 'activity' && (
                <div className="space-y-4">
                  {/* Logging Form */}
                  <form onSubmit={handlePostActivity} className="space-y-3 bg-slate-50/70 border border-black/10 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Log Recruiter Activity</p>
                    <div className="flex gap-2">
                      <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value as any)}
                        className="bg-white border border-black/15 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                      >
                        <option value="Note">Log Note</option>
                        <option value="Email">Log Email</option>
                        <option value="Call">Log Call</option>
                        <option value="Task">Log Task</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Activity Subject (e.g., Sourcing phone call complete)"
                        value={activityTitle}
                        onChange={(e) => setActivityTitle(e.target.value)}
                        className="flex-1 bg-white border border-black/15 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-black"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Detailed log description / email body / note transcript..."
                      value={activityDesc}
                      onChange={(e) => setActivityDesc(e.target.value)}
                      rows={2}
                      className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-black hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-widest px-3.5 py-2 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Send size={10} /> Log CRM Activity
                      </button>
                    </div>
                  </form>

                  {/* Vertical Chronological Feed */}
                  <div className="relative border-l-2 border-slate-100 pl-4 ml-2.5 space-y-4">
                    {activities.filter(act => act.candidateId === candidate.id).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 pl-2">No activities logged yet.</p>
                    ) : (
                      activities
                        .filter(act => act.candidateId === candidate.id)
                        .sort((a, b) => b.id.localeCompare(a.id)) // Latest first
                        .map(act => (
                          <div key={act.id} className="relative group">
                            {/* Dot */}
                            <div className={`absolute -left-[21.5px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                              act.type === 'Email' ? 'bg-indigo-500' :
                              act.type === 'Call' ? 'bg-purple-500' :
                              act.type === 'Note' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <div className="text-xs">
                              <div className="flex justify-between items-start">
                                <span className="font-bold text-slate-800">{act.title}</span>
                                <span className="text-[10px] text-slate-400 font-mono">{act.date}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5">Logged by <span className="font-semibold">{act.user}</span> • Type: <span className="font-bold uppercase tracking-wider text-[9px]">{act.type}</span></p>
                              {act.description && (
                                <p className="text-slate-600 mt-1.5 p-2.5 bg-slate-50/50 rounded-lg border border-black/5 italic">
                                  {act.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: INTERVIEW SCORECARDS */}
              {activeTab === 'interviews' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-black/10 pb-2">
                    <span className="text-xs font-bold text-slate-700">Scheduled Panels & Scorecards</span>
                    <button
                      onClick={() => setShowInterviewModal(true)}
                      className="bg-white hover:bg-slate-50 text-slate-800 border border-black/15 font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Plus size={10} /> Add Panel
                    </button>
                  </div>

                  <div className="space-y-3">
                    {interviews.filter(i => i.candidateId === candidate.id).length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-6">No interview stages scheduled.</p>
                    ) : (
                      interviews
                        .filter(i => i.candidateId === candidate.id)
                        .map(int => (
                          <div key={int.id} className="border border-black/10 rounded-xl p-4 bg-white space-y-2 hover:border-black/30 transition-all shadow-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-serif font-bold text-xs text-slate-800">{int.stage} Assessment Stage</span>
                                <p className="text-[10px] text-slate-400 mt-1">Assigned Interviewer: <span className="font-semibold text-slate-700">{int.interviewerName}</span></p>
                              </div>
                              <div className="text-right">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                                  int.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                }`}>
                                  {int.status}
                                </span>
                                <p className="text-[9px] text-slate-400 font-mono mt-1.5">{int.date} {int.time}</p>
                              </div>
                            </div>

                            {int.status === 'Completed' && int.rating && (
                              <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1.5 border border-black/5">
                                <div className="flex items-center gap-1 text-amber-500">
                                  {Array.from({ length: int.rating }).map((_, rIdx) => (
                                    <span key={rIdx}>★</span>
                                  ))}
                                  <span className="text-[10px] text-slate-400 font-mono ml-1">Rating: {int.rating}/5 stars</span>
                                </div>
                                <p className="text-slate-600 italic">"{int.feedback}"</p>
                              </div>
                            )}
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: OFFER APPROVAL WORKSPACE */}
              {activeTab === 'offer' && (
                <div className="space-y-4">
                  {/* Active offer review details */}
                  {!candidate.offeredSalary ? (
                    <div className="text-center py-6">
                      <Award size={32} className="text-slate-300 mx-auto" />
                      <p className="text-xs font-semibold text-slate-700 mt-2">No active salary parameters defined.</p>
                      <p className="text-[10px] text-slate-400 mt-1">Submit proposed terms to start the approval process routing.</p>
                      <button
                        onClick={() => setShowOfferModal(true)}
                        className="bg-black hover:bg-slate-800 text-white font-bold text-[9px] uppercase tracking-widest px-4 py-2 rounded-full transition-all mt-3 cursor-pointer shadow-sm"
                      >
                        Propose Salary Offer Terms
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Active offer parameters */}
                      <div className="bg-slate-50 p-4 border border-black/10 rounded-xl space-y-3">
                        <div className="flex justify-between items-center border-b border-black/10 pb-2">
                          <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Salary Offer Parameters</span>
                          <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border ${
                            candidate.offerStatus === 'Approved' ? 'bg-green-50 border-green-200 text-green-800' :
                            candidate.offerStatus === 'Rejected' ? 'bg-red-50 border-red-200 text-red-800' :
                            'bg-amber-50 border-amber-200 text-amber-800'
                          }`}>
                            {candidate.offerStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center py-1">
                          <div className="p-2 bg-white rounded-lg border border-black/5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Base Salary</span>
                            <span className="text-sm font-mono font-bold text-slate-800">${candidate.offeredSalary.toLocaleString()}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-black/5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Sign-on Bonus</span>
                            <span className="text-sm font-mono font-bold text-slate-800">${candidate.offerBonus?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="p-2 bg-white rounded-lg border border-black/5">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Equity Share</span>
                            <span className="text-sm font-mono font-bold text-slate-800">{candidate.offerEquity || 'None'}</span>
                          </div>
                        </div>

                        {/* Limit warnings indicator */}
                        {job && candidate.offeredSalary > job.salaryMax && (
                          <div className="bg-red-50 text-red-800 text-[10px] p-3 rounded-lg flex items-start gap-1.5 border border-red-200">
                            <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-bold">Salary Exceeds standard limit!</p>
                              <p>The proposed salary of ${candidate.offeredSalary.toLocaleString()} exceeds the job ceiling of ${job.salaryMax.toLocaleString()}. Requires high-level approval router override.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Decisive Salesforce Approval Actions */}
                      {candidate.offerStatus === 'Pending Approval' && (
                        <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
                          <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <Clock size={13} className="text-amber-600" />
                            Hiring Manager Approval Workflow
                          </h4>
                          
                          {currentRole === 'Hiring Manager' || currentRole === 'System Admin' ? (
                            <div className="space-y-3">
                              <p className="text-[10px] text-amber-800">Review candidate scores and resume summaries prior to signature. Input rationale below for CRM audit record.</p>
                              <input
                                type="text"
                                placeholder="Audit comment (e.g., Highly qualified cloud authority, approve salary scale)"
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                className="w-full bg-white border border-amber-200 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onApproveOffer(approvalComment);
                                    setApprovalComment('');
                                  }}
                                  className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold text-[10px] uppercase tracking-widest py-2.5 rounded-full cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                >
                                  <ThumbsUp size={12} /> Sign & Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRejectOffer(approvalComment);
                                    setApprovalComment('');
                                  }}
                                  className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] uppercase tracking-widest py-2.5 rounded-full cursor-pointer transition-all flex items-center justify-center gap-1.5"
                                >
                                  <ThumbsDown size={12} /> Send Back / Reject
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[10px] text-amber-800 flex items-center gap-1.5">
                              <AlertTriangle size={13} className="text-amber-500" />
                              <span>Sourcing locked. Requires <span className="font-bold">Hiring Manager</span> credentials to finalize this decision.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Approval History log */}
                      <div className="space-y-2 text-xs">
                        <h4 className="font-serif font-bold text-slate-800 text-sm">Approval Workflow Audit Logs</h4>
                        <div className="bg-slate-50 p-3 rounded-lg border border-black/5 text-[10.5px] space-y-1.5 text-slate-600">
                          {candidate.offerApprovedBy && (
                            <p className="text-green-600 font-bold">✓ Offer authorized by <span className="font-bold">{candidate.offerApprovedBy}</span>.</p>
                          )}
                          {candidate.offerRejectionReason && (
                            <p className="text-red-600 font-bold">✗ Offer rejected. Reason: <span className="italic">"{candidate.offerRejectionReason}"</span></p>
                          )}
                          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">• Offer initialized by <span className="text-slate-600">{candidate.recruiterName}</span> on {candidate.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Agentforce Copilot Insights) - spans 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 border border-indigo-900/60 rounded-xl shadow-lg text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 translate-x-12 -translate-y-12 bg-indigo-500/10 w-44 h-44 rounded-full blur-2xl" />
            
            <div className="bg-indigo-950/80 px-4 py-3 border-b border-indigo-900/40 flex justify-between items-center">
              <span className="text-xs font-display font-extrabold tracking-wide flex items-center gap-1.5 text-indigo-200">
                <Sparkles size={13} className="text-purple-400 animate-bounce" />
                AGENTFORCE AI COPILOT
              </span>
              <span className="bg-purple-900/50 text-purple-300 text-[9px] px-2 py-0.5 rounded-full font-bold border border-purple-800/40">
                Ready
              </span>
            </div>

            <div className="p-5 space-y-5">
              {!candidate.aiScreened ? (
                <div className="text-center py-6 space-y-3">
                  <Brain size={36} className="text-indigo-400 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-slate-200">Profile Unscreened</p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Trigger Agentforce to run high-speed screening, calculate matching criteria, and outline candidate fit risks.
                  </p>
                  <button
                    onClick={onRunAiScreen}
                    disabled={isAiScreening}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-indigo-800 disabled:cursor-not-allowed"
                  >
                    {isAiScreening ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Screen with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-purple-300" /> Screen with Agentforce AI
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Gauge score visualizer */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider">Overall Match Index</span>
                    <div className="relative flex items-center justify-center w-24 h-24 mt-2">
                      {/* Circular Gauge using SVG */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          stroke="#10b981" strokeWidth="8" fill="transparent" 
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * (candidate.aiScoreOverall || 0)) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <span className="absolute text-xl font-display font-extrabold text-white">
                        {candidate.aiScoreOverall}%
                      </span>
                    </div>
                  </div>

                  {/* Sourcing Fit Sub-indices */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/30">
                      <span className="text-[9px] text-slate-400 block">Technical Fit</span>
                      <span className="text-xs font-bold font-mono text-indigo-300">{candidate.aiScoreTechFit || '0'}%</span>
                    </div>
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/30">
                      <span className="text-[9px] text-slate-400 block">Culture Fit</span>
                      <span className="text-xs font-bold font-mono text-indigo-300">{candidate.aiScoreCultureFit || '0'}%</span>
                    </div>
                  </div>

                  {/* Sourcing Summary */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                      Candidate Summary
                    </h5>
                    <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-800/30 p-2.5 rounded border border-slate-700/30 italic">
                      "{candidate.aiSummary}"
                    </p>
                  </div>

                  {/* Risk analysis (Warnings) */}
                  <div className="space-y-1.5">
                    <h5 className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle size={11} /> Hiring Risk Assessment
                    </h5>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {candidate.aiRisks && candidate.aiRisks.map((risk, rIdx) => (
                        <p key={rIdx} className="text-[9.5px] text-slate-300 leading-tight flex items-start gap-1 p-1 bg-red-950/20 rounded">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{risk}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* AI Recommendation Decision */}
                  <div className="bg-indigo-900/50 p-3 rounded-lg border border-indigo-800/60 space-y-1.5">
                    <h5 className="text-[9.5px] font-bold text-indigo-200 tracking-wide uppercase">AI Recommendations Summary</h5>
                    <p className="text-[10.5px] text-slate-200 font-medium">
                      {candidate.aiRecommendation}
                    </p>
                  </div>

                  {/* Re-screen button */}
                  <button
                    onClick={onRunAiScreen}
                    disabled={isAiScreening}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600/40 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isAiScreening ? <RefreshCw size={10} className="animate-spin" /> : <RefreshCw size={10} />}
                    Re-analyze Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: SCHEDULE INTERVIEW PANEL */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-black/10 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-950 text-white px-5 py-4 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-slate-200">
                <Calendar size={14} className="text-slate-400" /> Schedule Interview Stage Panel
              </span>
              <button onClick={() => setShowInterviewModal(false)} className="text-white/80 hover:text-white cursor-pointer transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Candidate</label>
                <input
                  type="text"
                  value={candidate.name}
                  disabled
                  className="w-full bg-slate-50 border border-black/10 text-xs rounded-lg p-2.5 text-slate-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Interview Stage</label>
                  <select
                    value={intStage}
                    onChange={(e) => setIntStage(e.target.value as any)}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                  >
                    <option value="Technical">Technical Panel</option>
                    <option value="Cultural">Cultural Alignment</option>
                    <option value="Hiring Manager">Hiring Manager Chat</option>
                    <option value="System Design">System Design</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Interviewer</label>
                  <input
                    type="text"
                    placeholder="Interviewer Name (e.g. Parker Harris)"
                    value={intInterviewer}
                    onChange={(e) => setIntInterviewer(e.target.value)}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Panel Date</label>
                  <input
                    type="date"
                    value={intDate}
                    onChange={(e) => setIntDate(e.target.value)}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Panel Time</label>
                  <input
                    type="time"
                    value={intTime}
                    onChange={(e) => setIntTime(e.target.value)}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
              </div>

              <div className="bg-indigo-50/50 text-indigo-950 text-[10px] p-3 rounded-lg flex items-start gap-1.5 border border-indigo-200/50">
                <Sparkles size={12} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Scheduling automatically triggers Salesforce flow alerts to generate prep material and calendar locks.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 border border-black/15 text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-widest py-2 px-4.5 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PROPOSE SALARY OFFER TERMS */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-black/10 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-amber-700 text-white px-5 py-4 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 text-amber-100">
                <Award size={14} className="text-amber-200" /> Propose Salary Offer Parameters
              </span>
              <button onClick={() => setShowOfferModal(false)} className="text-white/80 hover:text-white cursor-pointer transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="p-5 space-y-4">
              <div className="bg-slate-50 p-3 border border-black/10 rounded-xl space-y-1 text-xs">
                <span className="font-bold text-slate-700 block text-[9px] uppercase tracking-wider">Standard Job Band Range:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  ${job?.salaryMin.toLocaleString()} - ${job?.salaryMax.toLocaleString()}
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Proposed Base Salary</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={proposedSalary}
                  onChange={(e) => setProposedSalary(Number(e.target.value))}
                  className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-black"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Sign-on Cash Bonus ($)</label>
                  <input
                    type="number"
                    value={proposedBonus}
                    onChange={(e) => setProposedBonus(Number(e.target.value))}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Equity Grant Options</label>
                  <input
                    type="text"
                    value={proposedEquity}
                    onChange={(e) => setProposedEquity(e.target.value)}
                    className="w-full bg-white border border-black/15 text-xs rounded-lg p-2.5 font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div className="bg-amber-50/50 text-amber-900 text-[10px] p-3 rounded-lg flex items-start gap-1.5 border border-amber-200/50">
                <AlertTriangle size={12} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Submitting routes offer to <span className="font-bold">Bret Taylor (Hiring Manager)</span>. Automated warning checks will flag any bounds excess.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 border border-black/15 text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] uppercase tracking-widest py-2 px-4.5 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  Submit Proposed Terms
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
