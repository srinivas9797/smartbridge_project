import React, { useState, useEffect } from 'react';
import { 
  INITIAL_JOBS, INITIAL_CANDIDATES, INITIAL_INTERVIEWS, 
  INITIAL_ACTIVITIES, INITIAL_FLOWS, INITIAL_EXECUTION_LOGS 
} from './data';
import { Candidate, Job, Interview, Activity, Flow, FlowExecutionLog, Role, Stage } from './types';
import LightningHeader from './components/LightningHeader';
import DashboardView from './components/DashboardView';
import RecordListView from './components/RecordListView';
import CandidateDetailView from './components/CandidateDetailView';
import SetupFlowView from './components/SetupFlowView';
import InteractiveDialogs from './components/InteractiveDialogs';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  // Global App States
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('aircms_role') as Role) || 'Recruiter';
  });
  const [activeView, setActiveView] = useState<string>(() => {
    return localStorage.getItem('aircms_view') || 'dashboard';
  });
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(() => {
    return localStorage.getItem('aircms_selected_cand') || null;
  });
  const [selectedJobId, setSelectedJobId] = useState<string | null>(() => {
    return localStorage.getItem('aircms_selected_job') || null;
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Sourcing Entities States
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('aircms_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    const saved = localStorage.getItem('aircms_candidates');
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem('aircms_interviews');
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem('aircms_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [flows, setFlows] = useState<Flow[]>(() => {
    const saved = localStorage.getItem('aircms_flows');
    return saved ? JSON.parse(saved) : INITIAL_FLOWS;
  });

  const [executionLogs, setExecutionLogs] = useState<FlowExecutionLog[]>(() => {
    const saved = localStorage.getItem('aircms_execution_logs');
    return saved ? JSON.parse(saved) : INITIAL_EXECUTION_LOGS;
  });

  // Loading indicator for real-time AI Screening
  const [isAiScreening, setIsAiScreening] = useState(false);

  // Dialog Display toggles
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  // Sync state with LocalStorage for durable cloud-feeling persistence
  useEffect(() => {
    localStorage.setItem('aircms_role', currentRole);
    localStorage.setItem('aircms_view', activeView);
    localStorage.setItem('aircms_selected_cand', selectedCandidateId || '');
    localStorage.setItem('aircms_selected_job', selectedJobId || '');
    localStorage.setItem('aircms_jobs', JSON.stringify(jobs));
    localStorage.setItem('aircms_candidates', JSON.stringify(candidates));
    localStorage.setItem('aircms_interviews', JSON.stringify(interviews));
    localStorage.setItem('aircms_activities', JSON.stringify(activities));
    localStorage.setItem('aircms_flows', JSON.stringify(flows));
    localStorage.setItem('aircms_execution_logs', JSON.stringify(executionLogs));
  }, [currentRole, activeView, selectedCandidateId, selectedJobId, jobs, candidates, interviews, activities, flows, executionLogs]);

  // View navigation helper
  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedCandidateId(null);
    setSelectedJobId(null);
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    setActiveView('candidate-detail');
  };

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
    // When selecting a job, view candidates filter matching that job
    setSearchQuery('');
    setActiveView('candidates');
  };

  // Reset demo databases
  const handleResetData = () => {
    if (confirm('Are you sure you want to restore the original Salesforce records? Any customizations will be reset.')) {
      setJobs(INITIAL_JOBS);
      setCandidates(INITIAL_CANDIDATES);
      setInterviews(INITIAL_INTERVIEWS);
      setActivities(INITIAL_ACTIVITIES);
      setFlows(INITIAL_FLOWS);
      setExecutionLogs(INITIAL_EXECUTION_LOGS);
      setSelectedCandidateId(null);
      setSelectedJobId(null);
      setActiveView('dashboard');
      alert('Salesforce Sandbox database refreshed successfully.');
    }
  };

  // -------------------------------------------------------------
  // RECRUITMENT AUTOMATION FLOWS LOGIC
  // -------------------------------------------------------------
  
  // Trigger Background Agentforce Screen on Candidate Profile
  const triggerAiScreeningFlow = async (candidateId: string, currentCandidates = candidates) => {
    const candidate = currentCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const job = jobs.find(j => j.id === candidate.jobId);
    if (!job) return;

    console.log(`[AIRCMS Flow Orchestrator] Launching Agentforce screen for ${candidate.name}...`);
    setIsAiScreening(true);

    try {
      const response = await fetch('/api/ai/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate, job })
      });

      if (!response.ok) {
        throw new Error('AI Server screening returned a failure status.');
      }

      const result = await response.json();
      
      // Update candidate details with AI insights
      setCandidates(prev => prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            aiScreened: true,
            aiScoreOverall: result.aiScoreOverall,
            aiScoreTechFit: result.aiScoreTechFit,
            aiScoreCultureFit: result.aiScoreCultureFit,
            aiSummary: result.aiSummary,
            aiRiskLevel: result.aiRiskLevel,
            aiRisks: result.aiRisks,
            aiStrengths: result.aiStrengths,
            aiRecommendation: result.aiRecommendation,
          };
        }
        return c;
      }));

      // Log Workflow execution
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newLog: FlowExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp,
        flowName: 'Agentforce Screen on Creation',
        candidateName: candidate.name,
        status: result.aiScoreOverall > 60 ? 'Success' : 'Warning',
        message: `Agentforce Screening complete. Overall score: ${result.aiScoreOverall}%. Identified risks level: ${result.aiRiskLevel}.`
      };
      setExecutionLogs(prev => [newLog, ...prev]);

      // Log system interaction on Candidate Feed
      const systemAct: Activity = {
        id: `act-${Date.now()}-ai`,
        candidateId,
        type: 'System',
        title: 'Agentforce Screen Completed',
        description: `Agentforce AI completed resume requirements evaluation against ${job.title}. Result match: ${result.aiScoreOverall}/100. Recommendations: ${result.aiRecommendation}`,
        user: 'Agentforce Bot',
        date: new Date().toISOString().split('T')[0]
      };
      setActivities(prev => [...prev, systemAct]);

    } catch (err) {
      console.error('[AIRCMS Flow Orchestrator] AI Screening failure:', err);
      
      // Log failure in execution log terminal
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newLog: FlowExecutionLog = {
        id: `log-${Date.now()}-err`,
        timestamp,
        flowName: 'Agentforce Screen on Creation',
        candidateName: candidate.name,
        status: 'Failed',
        message: 'Could not establish server connection to Gemini. Ensure API secrets are configured.'
      };
      setExecutionLogs(prev => [newLog, ...prev]);
    } finally {
      setIsAiScreening(false);
    }
  };

  // Handler for candidate stage change (Salesforce Paths / Kanban Moves)
  const handleUpdateCandidateStage = (candidateId: string, newStage: Stage) => {
    let updatedCandidates: Candidate[] = [];
    
    setCandidates(prev => {
      updatedCandidates = prev.map(c => {
        if (c.id === candidateId) {
          // If we are updating to 'Offer' stage, check if standard offer terms should be initialized
          const offeredSalary = c.offeredSalary || (jobs.find(j => j.id === c.jobId)?.salaryMin || 120000);
          const offerStatus = c.offerStatus || 'Draft';
          return {
            ...c,
            stage: newStage,
            offeredSalary,
            offerStatus: newStage === 'Offer' && offerStatus === 'Draft' ? 'Pending Approval' : offerStatus
          };
        }
        return c;
      });
      return updatedCandidates;
    });

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    // Log Stage update on Candidate activity feed
    const sysAct: Activity = {
      id: `act-${Date.now()}`,
      candidateId,
      type: 'System',
      title: `Stage Advanced to ${newStage}`,
      description: `Candidate moved from ${candidate.stage} stage to ${newStage} stage in Salesforce CRM pipeline.`,
      user: currentRole === 'Recruiter' ? 'Marc Benioff' : currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, sysAct]);

    // TRIGGER BACKGROUND FLOWS: Salary limits verification routing
    if (newStage === 'Offer') {
      const activeOfferSalary = candidate.offeredSalary || (jobs.find(j => j.id === candidate.jobId)?.salaryMin || 120000);
      triggerSalaryLimitWorkflow(candidateId, activeOfferSalary);
    }
  };

  // Salary Band Limit Approval Router Flow Trigger
  const triggerSalaryLimitWorkflow = (candidateId: string, proposedSalary: number) => {
    const isFlowActive = flows.find(f => f.id === 'flow-2')?.active;
    if (!isFlowActive) return;

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const job = jobs.find(j => j.id === candidate.jobId);
    if (!job) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (proposedSalary > job.salaryMax) {
      // Create Warning log
      const newLog: FlowExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp,
        flowName: 'Salary Limit Approval Router',
        candidateName: candidate.name,
        status: 'Warning',
        message: `Proposed Salary of $${proposedSalary.toLocaleString()} exceeds the maximum band ceiling ($${job.salaryMax.toLocaleString()}) for ${job.title}. Exceeded limit flags activated.`
      };
      setExecutionLogs(prev => [newLog, ...prev]);

      // Set offerStatus to 'Pending Approval'
      setCandidates(prev => prev.map(c => {
        if (c.id === candidateId) {
          return { ...c, offerStatus: 'Pending Approval' };
        }
        return c;
      }));
    } else {
      // Successful normal routing log
      const newLog: FlowExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp,
        flowName: 'Salary Limit Approval Router',
        candidateName: candidate.name,
        status: 'Success',
        message: `Salary of $${proposedSalary.toLocaleString()} fits standard bounding limit. Routed for standard executive signature.`
      };
      setExecutionLogs(prev => [newLog, ...prev]);
    }
  };

  // -------------------------------------------------------------
  // CRM INTERACTIVE ACTIONS HANDLERS
  // -------------------------------------------------------------

  // Save new candidate record
  const handleCreateCandidate = (candData: Partial<Candidate>) => {
    const newId = `cand-${Date.now()}`;
    const newCandidate: Candidate = {
      id: newId,
      name: candData.name || 'John Doe',
      email: candData.email || 'j.doe@example.com',
      phone: candData.phone || '(555) 000-0000',
      role: candData.role || 'Staff Engineer',
      experienceYears: candData.experienceYears || 5,
      skills: candData.skills || [],
      resumeText: candData.resumeText || '',
      stage: 'Applied',
      status: 'Active',
      recruiterId: 'rec-1',
      recruiterName: currentRole === 'Recruiter' ? 'Marc Benioff' : 'Clara Barton',
      jobId: candData.jobId || 'job-1',
      jobTitle: candData.jobTitle || 'Senior Full Stack Engineer',
      createdAt: new Date().toISOString().split('T')[0],
      aiScreened: false,
    };

    const updatedCandidates = [newCandidate, ...candidates];
    setCandidates(updatedCandidates);

    // Post to Execution Logs
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const flowLog: FlowExecutionLog = {
      id: `log-${Date.now()}`,
      timestamp,
      flowName: 'Agentforce Screen on Creation',
      candidateName: newCandidate.name,
      status: 'Success',
      message: `New Lead created. Automatically triggering background screening flows.`
    };
    setExecutionLogs(prev => [flowLog, ...prev]);

    // Save initial system activity on record creation
    const act: Activity = {
      id: `act-${Date.now()}`,
      candidateId: newId,
      type: 'System',
      title: 'Candidate Profile Created',
      description: `Sourcing completed. Candidate portfolio mapped to ${newCandidate.jobTitle} vacancy.`,
      user: currentRole === 'Recruiter' ? 'Marc Benioff' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, act]);

    // AUTO-SCREEN TRIGGER: If Flow is Active, immediately trigger live AI evaluation!
    const isAutoScreenActive = flows.find(f => f.id === 'flow-1')?.active;
    if (isAutoScreenActive) {
      triggerAiScreeningFlow(newId, updatedCandidates);
    }
  };

  // Save new job opening
  const handleCreateJob = (jobData: Partial<Job>) => {
    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'Specialist Partner',
      department: jobData.department || 'Product',
      location: jobData.location || 'San Francisco, CA (Hybrid)',
      salaryMin: jobData.salaryMin || 100000,
      salaryMax: jobData.salaryMax || 150000,
      status: 'Open',
      description: jobData.description || 'General scope.',
      requirements: jobData.requirements || [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setJobs(prev => [newJob, ...prev]);
  };

  // Log interaction activity (Note, Call, Email, Task)
  const handleLogActivity = (type: 'Email' | 'Call' | 'Note' | 'Task', title: string, description: string) => {
    if (!selectedCandidateId) return;
    
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      candidateId: selectedCandidateId,
      type,
      title,
      description,
      user: currentRole === 'Recruiter' ? 'Marc Benioff' : currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };

    setActivities(prev => [...prev, newAct]);
  };

  // Schedule Interview stage panel
  const handleScheduleInterview = (stage: 'Technical' | 'Cultural' | 'Hiring Manager' | 'System Design', interviewerName: string, date: string, time: string) => {
    if (!selectedCandidateId) return;
    const candidate = candidates.find(c => c.id === selectedCandidateId);
    if (!candidate) return;

    const newInt: Interview = {
      id: `int-${Date.now()}`,
      candidateId: selectedCandidateId,
      candidateName: candidate.name,
      interviewerName,
      date,
      time,
      status: 'Scheduled',
      stage
    };

    setInterviews(prev => [...prev, newInt]);

    // Log Activity Feed
    const logAct: Activity = {
      id: `act-${Date.now()}`,
      candidateId: selectedCandidateId,
      type: 'Task',
      title: `Scheduled ${stage} Assessment Panel`,
      description: `Interview panel set up with ${interviewerName} on ${date} at ${time}. Prep guidelines dispatched.`,
      user: currentRole === 'Recruiter' ? 'Marc Benioff' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, logAct]);
  };

  // Propose Salary terms for approval
  const handleSubmitOfferApproval = (salary: number, bonus: number, equity: string) => {
    if (!selectedCandidateId) return;
    
    setCandidates(prev => prev.map(c => {
      if (c.id === selectedCandidateId) {
        return {
          ...c,
          offeredSalary: salary,
          offerBonus: bonus,
          offerEquity: equity,
          offerStatus: 'Pending Approval',
          offerApprovedBy: undefined,
          offerRejectionReason: undefined,
        };
      }
      return c;
    }));

    // Post to Activity
    const newAct: Activity = {
      id: `act-${Date.now()}`,
      candidateId: selectedCandidateId,
      type: 'System',
      title: 'Salary Proposal Dispatched',
      description: `Recruiter submitted proposed offer parameters ($${salary.toLocaleString()} base, $${bonus.toLocaleString()} sign-on, ${equity} equity) for executive signature approval.`,
      user: currentRole === 'Recruiter' ? 'Marc Benioff' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, newAct]);

    // Run router limit verification flows
    triggerSalaryLimitWorkflow(selectedCandidateId, salary);
  };

  // Approve Proposed Salary terms
  const handleApproveOffer = (id: string, comment?: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          offerStatus: 'Approved',
          offerApprovedBy: currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton',
          offerRejectionReason: undefined
        };
      }
      return c;
    }));

    // Post to Activity Timeline
    const act: Activity = {
      id: `act-${Date.now()}`,
      candidateId: id,
      type: 'System',
      title: 'Offer Package Approved',
      description: `Hiring Manager Bret Taylor signed and authorized proposed salary package. Comment: "${comment || 'Excellent fit.'}"`,
      user: currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, act]);
  };

  // Reject Proposed Salary terms
  const handleRejectOffer = (id: string, reason?: string) => {
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          offerStatus: 'Rejected',
          offerRejectionReason: reason || 'Proposed package exceeds typical budget caps.'
        };
      }
      return c;
    }));

    // Post to Activity timeline
    const act: Activity = {
      id: `act-${Date.now()}`,
      candidateId: id,
      type: 'System',
      title: 'Offer Package Rejected',
      description: `Hiring Manager sent back salary proposal. Rationale: "${reason || 'Salary is too high.'}"`,
      user: currentRole === 'Hiring Manager' ? 'Bret Taylor' : 'Clara Barton',
      date: new Date().toISOString().split('T')[0]
    };
    setActivities(prev => [...prev, act]);
  };

  // Sourcing board active flow toggle
  const handleToggleFlow = (id: string) => {
    setFlows(prev => prev.map(f => {
      if (f.id === id) {
        const active = !f.active;
        // Log action in Terminal
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        const log: FlowExecutionLog = {
          id: `log-${Date.now()}`,
          timestamp,
          flowName: f.name,
          candidateName: 'System Core',
          status: 'Success',
          message: `Flow ${f.name} was successfully ${active ? 'activated' : 'deactivated'} in Salesforce Setup.`
        };
        setExecutionLogs(prevLogs => [log, ...prevLogs]);
        return { ...f, active };
      }
      return f;
    }));
  };

  // -------------------------------------------------------------
  // SELECTION & FILTER HELPERS
  // -------------------------------------------------------------
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
  const selectedCandidateJob = selectedCandidate 
    ? jobs.find(j => j.id === selectedCandidate.jobId) 
    : undefined;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans antialiased text-[#1a1a1a] pb-12 flex flex-col justify-between selection:bg-indigo-100">
      <div>
        {/* CRM BRANDING HEADER */}
        <LightningHeader 
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeView={activeView}
          onViewChange={handleViewChange}
          onResetData={handleResetData}
        />

        {/* CONTAINER WORKSPACE */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
          {activeView === 'dashboard' && (
            <DashboardView 
              candidates={candidates}
              jobs={jobs}
              interviews={interviews}
              currentRole={currentRole}
              onSelectCandidate={handleSelectCandidate}
              onApproveOffer={(id) => handleApproveOffer(id, 'Approved via CRM dashboard.')}
              onRejectOffer={(id) => handleRejectOffer(id, 'Rejected via CRM dashboard.')}
              onViewAllCandidates={() => handleViewChange('candidates')}
              onViewAllJobs={() => handleViewChange('jobs')}
            />
          )}

          {activeView === 'candidates' && (
            <RecordListView 
              type="candidates"
              candidates={candidates}
              jobs={jobs}
              currentRole={currentRole}
              searchQuery={searchQuery}
              onSelectCandidate={handleSelectCandidate}
              onSelectJob={handleSelectJob}
              onOpenCreateModal={() => setShowCandidateModal(true)}
              onUpdateCandidateStage={handleUpdateCandidateStage}
            />
          )}

          {activeView === 'jobs' && (
            <RecordListView 
              type="jobs"
              candidates={candidates}
              jobs={jobs}
              currentRole={currentRole}
              searchQuery={searchQuery}
              onSelectCandidate={handleSelectCandidate}
              onSelectJob={handleSelectJob}
              onOpenCreateModal={() => setShowJobModal(true)}
              onUpdateCandidateStage={handleUpdateCandidateStage}
            />
          )}

          {activeView === 'candidate-detail' && selectedCandidate && (
            <CandidateDetailView 
              candidate={selectedCandidate}
              job={selectedCandidateJob}
              interviews={interviews}
              activities={activities}
              currentRole={currentRole}
              onBack={() => handleViewChange('candidates')}
              onUpdateStage={(stage) => handleUpdateCandidateStage(selectedCandidate.id, stage)}
              onUpdateStatus={(status) => {
                setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, status } : c));
              }}
              onLogActivity={handleLogActivity}
              onScheduleInterview={handleScheduleInterview}
              onSubmitOfferApproval={handleSubmitOfferApproval}
              onApproveOffer={(cmt) => handleApproveOffer(selectedCandidate.id, cmt)}
              onRejectOffer={(re) => handleRejectOffer(selectedCandidate.id, re)}
              onRunAiScreen={() => triggerAiScreeningFlow(selectedCandidate.id)}
              isAiScreening={isAiScreening}
            />
          )}

          {activeView === 'setup-flows' && currentRole === 'System Admin' && (
            <SetupFlowView 
              flows={flows}
              executionLogs={executionLogs}
              onToggleFlow={handleToggleFlow}
              onClearLogs={() => setExecutionLogs([])}
              onResetLogs={() => setExecutionLogs(INITIAL_EXECUTION_LOGS)}
            />
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="text-center text-slate-400 text-[10px] mt-12 py-6 border-t border-black/10">
        <p className="tracking-widest font-bold uppercase">AIRCMS Recruitment Workspace © 2026. Built in accordance with Salesforce Governance and Agentforce AI protocols.</p>
      </footer>

      {/* DYNAMIC FORMS AND MODALS */}
      <InteractiveDialogs 
        showCandidateModal={showCandidateModal}
        onCloseCandidateModal={() => setShowCandidateModal(false)}
        showJobModal={showJobModal}
        onCloseJobModal={() => setShowJobModal(false)}
        jobs={jobs}
        onCreateCandidate={handleCreateCandidate}
        onCreateJob={handleCreateJob}
      />
    </div>
  );
}
