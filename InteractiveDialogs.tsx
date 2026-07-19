
import React, { useState } from 'react';
import { X, UserPlus, Briefcase, Plus, Sparkles } from 'lucide-react';
import { Job, Candidate } from '../types';

interface InteractiveDialogsProps {
  showCandidateModal: boolean;
  onCloseCandidateModal: () => void;
  showJobModal: boolean;
  onCloseJobModal: () => void;
  jobs: Job[];
  onCreateCandidate: (candidateData: Partial<Candidate>) => void;
  onCreateJob: (jobData: Partial<Job>) => void;
}

export default function InteractiveDialogs({
  showCandidateModal,
  onCloseCandidateModal,
  showJobModal,
  onCloseJobModal,
  jobs,
  onCreateCandidate,
  onCreateJob,
}: InteractiveDialogsProps) {
  
  // New Candidate States
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candJobId, setCandJobId] = useState(jobs[0]?.id || '');
  const [candExp, setCandExp] = useState(3);
  const [candSkills, setCandSkills] = useState('');
  const [candResume, setCandResume] = useState('');

  // New Job States
  const [jobTitle, setJobTitle] = useState('');
  const [jobDept, setJobDept] = useState('Engineering');
  const [jobLoc, setJobLoc] = useState('');
  const [jobSalMin, setJobSalMin] = useState(100000);
  const [jobSalMax, setJobSalMax] = useState(150000);
  const [jobDesc, setJobDesc] = useState('');
  const [jobReqs, setJobReqs] = useState('');

  const handleCreateCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName.trim() || !candEmail.trim()) return;

    const selectedJob = jobs.find(j => j.id === candJobId);
    
    onCreateCandidate({
      name: candName,
      email: candEmail,
      phone: candPhone || '(555) 000-0000',
      role: selectedJob?.title || 'Engineer',
      experienceYears: candExp,
      skills: candSkills.split(',').map(s => s.trim()).filter(Boolean),
      resumeText: candResume || `Experienced professional specializing in ${candSkills}. Committed to driving values.`,
      jobId: candJobId,
      jobTitle: selectedJob?.title || 'Open Role',
    });

    // Reset States
    setCandName('');
    setCandEmail('');
    setCandPhone('');
    setCandExp(3);
    setCandSkills('');
    setCandResume('');
    onCloseCandidateModal();
  };

  const handleCreateJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !jobLoc.trim()) return;

    onCreateJob({
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      salaryMin: Number(jobSalMin),
      salaryMax: Number(jobSalMax),
      description: jobDesc || `We are searching for a high performing ${jobTitle} to join our core ${jobDept} squad.`,
      requirements: jobReqs.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Open',
    });

    // Reset States
    setJobTitle('');
    setJobDept('Engineering');
    setJobLoc('');
    setJobSalMin(100000);
    setJobSalMax(150000);
    setJobDesc('');
    setJobReqs('');
    onCloseJobModal();
  };

  return (
    <>
      {/* 1. NEW CANDIDATE MODAL */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0176D3] text-white px-5 py-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <UserPlus size={14} /> Add Candidate Profile
              </span>
              <button onClick={onCloseCandidateModal} className="text-white/80 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCandidateSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Amanda Riley"
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. amanda.r@example.com"
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. (555) 831-4091"
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    value={candExp}
                    onChange={(e) => setCandExp(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Target Job Position</label>
                <select
                  value={candJobId}
                  onChange={(e) => setCandJobId(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs rounded p-2 cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Stated Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, AWS"
                  value={candSkills}
                  onChange={(e) => setCandSkills(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Full Resume / CV Text</label>
                <textarea
                  placeholder="Paste candidate's full resume text here to allow Agentforce screening and automated scoring to trigger accurately..."
                  value={candResume}
                  onChange={(e) => setCandResume(e.target.value)}
                  rows={4}
                  className="w-full bg-white border border-slate-200 text-xs rounded p-2.5 font-mono leading-normal focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-blue-900 text-[10px] flex items-start gap-1.5">
                <Sparkles size={12} className="text-[#0176D3] mt-0.5 flex-shrink-0" />
                <span>Creating candidate triggers background <strong>Agentforce screening flows</strong>, which generates evaluation summaries and candidate match risk levels automatically.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseCandidateModal}
                  className="px-3.5 py-1.5 border border-slate-200 text-xs font-semibold rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0176D3] hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded shadow-sm transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. NEW JOB POSTING MODAL */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#0176D3] text-white px-5 py-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wide">
                <Briefcase size={14} /> Create Job Opening
              </span>
              <button onClick={onCloseJobModal} className="text-white/80 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateJobSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Talent Scout"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                  <select
                    value={jobDept}
                    onChange={(e) => setJobDept(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 cursor-pointer font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Work Location</label>
                  <input
                    type="text"
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    value={jobLoc}
                    onChange={(e) => setJobLoc(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Min Salary ($)</label>
                    <input
                      type="number"
                      value={jobSalMin}
                      onChange={(e) => setJobSalMin(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-xs rounded p-2 font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Max Salary ($)</label>
                    <input
                      type="number"
                      value={jobSalMax}
                      onChange={(e) => setJobSalMax(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 text-xs rounded p-2 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Key Requirements (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript, AWS, SQL"
                  value={jobReqs}
                  onChange={(e) => setJobReqs(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Role Description</label>
                <textarea
                  placeholder="Outline the responsibilities, standard qualifications, and career scope for this position..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-xs rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCloseJobModal}
                  className="px-3.5 py-1.5 border border-slate-200 text-xs font-semibold rounded text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#0176D3] hover:bg-blue-700 text-white font-semibold text-xs py-1.5 px-3.5 rounded shadow-sm transition-colors cursor-pointer"
                >
                  Post Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
