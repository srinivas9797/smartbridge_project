export type Stage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Onboarding';

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  status: 'Open' | 'Closed';
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experienceYears: number;
  skills: string[];
  resumeText: string;
  stage: Stage;
  status: 'Active' | 'Hired' | 'Rejected' | 'Withdrawn';
  recruiterId: string;
  recruiterName: string;
  jobId: string;
  jobTitle: string;
  createdAt: string;
  
  // Offer Details
  offeredSalary?: number;
  offerBonus?: number;
  offerEquity?: string;
  offerStatus?: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Sent';
  offerApprovedBy?: string;
  offerRejectionReason?: string;
  
  // AI Screen insights (Agentforce)
  aiScreened: boolean;
  aiScoreOverall?: number; // 0-100
  aiScoreTechFit?: number; // 0-100
  aiScoreCultureFit?: number; // 0-100
  aiSummary?: string;
  aiRiskLevel?: 'Low' | 'Medium' | 'High';
  aiRisks?: string[];
  aiStrengths?: string[];
  aiRecommendation?: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  interviewerName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  rating?: number; // 1-5 stars
  feedback?: string;
  stage: 'Technical' | 'Cultural' | 'Hiring Manager' | 'System Design';
}

export interface Activity {
  id: string;
  candidateId: string;
  type: 'Email' | 'Call' | 'Note' | 'Task' | 'System';
  title: string;
  description: string;
  user: string;
  date: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  trigger: string;
  steps: string[];
}

export interface FlowExecutionLog {
  id: string;
  timestamp: string;
  flowName: string;
  candidateName: string;
  status: 'Success' | 'Warning' | 'Failed';
  message: string;
}

export type Role = 'Recruiter' | 'Hiring Manager' | 'System Admin';
