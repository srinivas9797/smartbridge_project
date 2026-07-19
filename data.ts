
import { Job, Candidate, Interview, Activity, Flow, FlowExecutionLog } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    salaryMin: 140000,
    salaryMax: 185000,
    status: 'Open',
    description: 'We are seeking a senior engineer to lead the development of our customer engagement platform. You will work with React, Node.js, and cloud native architectures to scale high-throughput services.',
    requirements: ['React', 'Node.js', 'TypeScript', 'SQL', 'AWS / Google Cloud', 'System Architecture'],
    createdAt: '2026-06-01'
  },
  {
    id: 'job-2',
    title: 'Lead Cloud Architect',
    department: 'Engineering',
    location: 'Remote (US/Canada)',
    salaryMin: 170000,
    salaryMax: 220000,
    status: 'Open',
    description: 'Responsible for defining the hybrid cloud architectures, ensuring security compliance, performance monitoring, and scalability of multi-tenant enterprise platforms.',
    requirements: ['Kubernetes', 'Terraform', 'Multi-cloud strategy', 'SOC2 Security', 'IAM Governance'],
    createdAt: '2026-06-15'
  },
  {
    id: 'job-3',
    title: 'Senior Product Manager',
    department: 'Product',
    location: 'New York, NY (Hybrid)',
    salaryMin: 135000,
    salaryMax: 165000,
    status: 'Open',
    description: 'Looking for an experienced product manager to drive our AI integration strategy. You will collaborate with engineering, UX, and marketing to shape Agentforce capabilities.',
    requirements: ['Product Strategy', 'AI/ML products', 'Agile/Scrum', 'Data-driven analytics', 'Customer Discovery'],
    createdAt: '2026-07-01'
  },
  {
    id: 'job-4',
    title: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    location: 'Chicago, IL',
    salaryMin: 85000,
    salaryMax: 110000,
    status: 'Open',
    description: 'Grow our high-performing sales and marketing groups. Maintain a robust candidate pipeline and deliver a premium experience through Salesforce recruitment clouds.',
    requirements: ['ATS Management', 'Sourcing strategies', 'Structured Interviewing', 'Employer Branding'],
    createdAt: '2026-07-10'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    role: 'Senior Full Stack Engineer',
    experienceYears: 8,
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL', 'Docker'],
    resumeText: 'Professional Full Stack Engineer with 8 years of experience building and optimizing web applications. Expert in React, Node.js, and modern cloud deployment strategies. Spearheaded migration of legacy systems to microservices, boosting throughput by 40%. Passionate about clean code, mentoring, and collaborative development in fast-paced tech startups.',
    stage: 'Interview',
    status: 'Active',
    recruiterId: 'rec-1',
    recruiterName: 'Marc Benioff',
    jobId: 'job-1',
    jobTitle: 'Senior Full Stack Engineer',
    createdAt: '2026-07-02',
    
    // Offer
    offeredSalary: 165000,
    offerBonus: 15000,
    offerEquity: '0.05%',
    offerStatus: 'Draft',
    
    // AI Insights
    aiScreened: true,
    aiScoreOverall: 88,
    aiScoreTechFit: 92,
    aiScoreCultureFit: 84,
    aiSummary: 'Sarah is an exceptionally strong candidate for the Senior Full Stack role. Her 8 years of experience align perfectly with requirements. She has demonstrated leadership in system design and microservices migration. Her communication skills during sourcing were excellent.',
    aiRiskLevel: 'Low',
    aiRisks: ['Salary request is on the higher end of our standard banding, but well within the job limit.'],
    aiStrengths: ['Proven leadership in cloud migration', 'Deep TypeScript/React competency', 'Consistent 3+ year stays at previous employers'],
    aiRecommendation: 'Highly Recommended. Proceed directly to final technical and architectural reviews.'
  },
  {
    id: 'cand-2',
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '(555) 987-6543',
    role: 'Lead Cloud Architect',
    experienceYears: 12,
    skills: ['Kubernetes', 'AWS', 'Terraform', 'Go', 'Docker', 'Python'],
    resumeText: 'Enterprise Cloud Architect with over a decade of hands-on experience in orchestrating globally distributed, highly available applications. Certified Kubernetes Administrator (CKA) and AWS Solutions Architect. Highly experienced with Infrastructure as Code (Terraform), DevSecOps pipelines, and hybrid-cloud enterprise migration.',
    stage: 'Offer',
    status: 'Active',
    recruiterId: 'rec-1',
    recruiterName: 'Marc Benioff',
    jobId: 'job-2',
    jobTitle: 'Lead Cloud Architect',
    createdAt: '2026-07-05',
    
    // Offer
    offeredSalary: 215000,
    offerBonus: 25000,
    offerEquity: '0.1%',
    offerStatus: 'Pending Approval',
    
    // AI Insights
    aiScreened: true,
    aiScoreOverall: 95,
    aiScoreTechFit: 98,
    aiScoreCultureFit: 91,
    aiSummary: 'David matches nearly every parameter of the Cloud Architect role. His technical depth in Kubernetes and AWS architecture is master-level. He is a thought-leader on compliance and security frameworks (SOC2, HIPAA).',
    aiRiskLevel: 'Low',
    aiRisks: ['Offered salary of $215k is near the maximum cap of $220k. Requires high-level approval.'],
    aiStrengths: ['CKA and AWS Certified Solutions Architect Professional', 'Strong infrastructure-as-code automation track record', 'High-volume production system experience'],
    aiRecommendation: 'Approve offer. David represents a premier hire who will elevate engineering standards across the board.'
  },
  {
    id: 'cand-3',
    name: 'Elena Rostova',
    email: 'elena.r@example.com',
    phone: '(555) 345-6789',
    role: 'Senior Product Manager',
    experienceYears: 6,
    skills: ['Product Strategy', 'Agile', 'User Research', 'SQL', 'Roadmapping'],
    resumeText: 'Data-driven Product Manager with 6 years of experience in mobile apps and analytics software. Specialized in customer development, qualitative user research, and collaborative alignment with design and tech squads. Championed data intelligence initiatives resulting in a 25% increase in monthly active users.',
    stage: 'Screening',
    status: 'Active',
    recruiterId: 'rec-2',
    recruiterName: 'Clara Barton',
    jobId: 'job-3',
    jobTitle: 'Senior Product Manager',
    createdAt: '2026-07-12',
    
    // AI Insights
    aiScreened: true,
    aiScoreOverall: 74,
    aiScoreTechFit: 70,
    aiScoreCultureFit: 78,
    aiSummary: 'Elena has solid foundational PM skills and great analytics depth. However, her resume shows limited direct experience with advanced AI/ML models or conversational agents (Agentforce), which is a key priority for this specific opening.',
    aiRiskLevel: 'Medium',
    aiRisks: ['Has not previously managed AI or large-language model feature rollouts.', 'Shorter stints (1.5 years) at her last two companies.'],
    aiStrengths: ['Excellent analytics capabilities and database query skills', 'Strong UX/design focus and structured customer interviews'],
    aiRecommendation: 'Qualified candidate. Proceed to screening call to assess her AI conceptual knowledge and adaptability.'
  },
  {
    id: 'cand-4',
    name: 'Michael Scott',
    email: 'm.scott@example.com',
    phone: '(555) 444-5555',
    role: 'Talent Acquisition Specialist',
    experienceYears: 15,
    skills: ['Sourcing', 'Management', 'Negotiation', 'Dunder Mifflin Experience'],
    resumeText: 'Experienced Regional Manager and recruiter with over 15 years in personnel management, business operations, and recruiting. Expert at building long-term relations, leading high-energy workspaces, and hosting structured organizational team building events. Master of people negotiation.',
    stage: 'Applied',
    status: 'Active',
    recruiterId: 'rec-2',
    recruiterName: 'Clara Barton',
    jobId: 'job-4',
    jobTitle: 'Talent Acquisition Specialist',
    createdAt: '2026-07-15',
    
    // AI Insights
    aiScreened: true,
    aiScoreOverall: 45,
    aiScoreTechFit: 35,
    aiScoreCultureFit: 55,
    aiSummary: 'Michael has extensive generic management tenure but lacks structured corporate Talent Acquisition expertise, modern ATS workflows, and technical sourcing tools specified in the description. His profile is non-traditional for this specialty role.',
    aiRiskLevel: 'High',
    aiRisks: ['Lacks familiarity with modern applicant tracking systems (e.g., Salesforce Recruitment Cloud).', 'Exhibits conversational style that may diverge from compliant structured interviewing standards.'],
    aiStrengths: ['High enthusiasm and dedication', 'Decade of relationship building experience'],
    aiRecommendation: 'Not Recommended for this specific role. Archive application or redirect to customer success/general sales.'
  },
  {
    id: 'cand-5',
    name: 'Amanda Riley',
    email: 'amanda.r@example.com',
    phone: '(555) 831-4091',
    role: 'Senior Full Stack Engineer',
    experienceYears: 10,
    skills: ['React', 'Node.js', 'PostgreSQL', 'Python', 'AWS'],
    resumeText: 'Senior software engineer specializing in responsive dashboards, API engineering, and cloud workflows. 10 years experience in fintech and digital health applications.',
    stage: 'Applied',
    status: 'Active',
    recruiterId: 'rec-1',
    recruiterName: 'Marc Benioff',
    jobId: 'job-1',
    jobTitle: 'Senior Full Stack Engineer',
    createdAt: '2026-07-16',
    aiScreened: false // Will screen interactively!
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins',
    interviewerName: 'Parker Harris',
    date: '2026-07-10',
    time: '14:00',
    status: 'Completed',
    rating: 5,
    feedback: 'Sarah blew me away in the system design portion. She explained event-driven architecture with absolute clarity and drew up elegant data models. Strong hire recommendation.',
    stage: 'Technical'
  },
  {
    id: 'int-2',
    candidateId: 'cand-1',
    candidateName: 'Sarah Jenkins',
    interviewerName: 'Clara Barton',
    date: '2026-07-14',
    time: '11:00',
    status: 'Completed',
    rating: 4,
    feedback: 'Great alignment on core culture principles. Sarah values collaboration and clear documentation. She has practical experience leading sprint planning.',
    stage: 'Cultural'
  },
  {
    id: 'int-3',
    candidateId: 'cand-2',
    candidateName: 'David Chen',
    interviewerName: 'Bret Taylor',
    date: '2026-07-12',
    time: '09:30',
    status: 'Completed',
    rating: 5,
    feedback: 'David is an absolute authority on Kubernetes scaling. Answered complex network partitioning questions with ease. Exceptional architect material.',
    stage: 'Technical'
  },
  {
    id: 'int-4',
    candidateId: 'cand-3',
    candidateName: 'Elena Rostova',
    interviewerName: 'Sarah Jenkins', // Peer interview
    date: '2026-07-18',
    time: '15:00',
    status: 'Scheduled',
    stage: 'Cultural'
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    candidateId: 'cand-1',
    type: 'Note',
    title: 'Recruiter Pre-screen Complete',
    description: 'Sarah demonstrated solid interest. Confirmed hybrid work preference in SF. Ready for Technical round.',
    user: 'Marc Benioff',
    date: '2026-07-03'
  },
  {
    id: 'act-2',
    candidateId: 'cand-1',
    type: 'Email',
    title: 'Interview invite sent',
    description: 'Sent email confirmation with calendar link for Technical panel with Parker Harris.',
    user: 'Marc Benioff',
    date: '2026-07-06'
  },
  {
    id: 'act-3',
    candidateId: 'cand-2',
    type: 'System',
    title: 'Offer Submitted for Approval',
    description: 'Recruiter Marc Benioff submitted a salary offer of $215,000 to Hiring Manager Bret Taylor.',
    user: 'System Workflow',
    date: '2026-07-15'
  },
  {
    id: 'act-4',
    candidateId: 'cand-3',
    type: 'Task',
    title: 'Follow-up on missing certifications',
    description: 'Ask Elena if she has any product strategy coursework or certifications related to AI.',
    user: 'Clara Barton',
    date: '2026-07-13'
  }
];

export const INITIAL_FLOWS: Flow[] = [
  {
    id: 'flow-1',
    name: 'Agentforce Screen on Creation',
    description: 'Automatically triggers a background Gemini screening analyze when a candidate record is created, updating AI scores and risks.',
    active: true,
    trigger: 'On Record Created (Candidate)',
    steps: ['Parse Candidate Resume', 'Fetch Target Job Requirements', 'Invoke Gemini AI scoring models', 'Post AI summary to Record Feed', 'Calculate risk assessment levels']
  },
  {
    id: 'flow-2',
    name: 'Salary Limit Approval Router',
    description: 'If a proposed salary is above the median for the job band (e.g. > $160,000), require high-level Hiring Manager & VP approvals.',
    active: true,
    trigger: 'On Offer Stage Updated',
    steps: ['Check Offer Salary', 'Compare with Job Max limit', 'Route to Bret Taylor (Hiring Manager)', 'Generate warning flags if above max limit']
  },
  {
    id: 'flow-3',
    name: 'Interview Auto-Reminder Email',
    description: 'Sends automated calendar alerts and prep guides to candidates 24 hours before their scheduled interview panels.',
    active: false,
    trigger: 'Time-Based (24h before Interview)',
    steps: ['Retrieve Candidate Contact', 'Select Interview Stage Template', 'Trigger Outgoing SMTP Gateway', 'Log Email Activity on Candidate Timeline']
  }
];

export const INITIAL_EXECUTION_LOGS: FlowExecutionLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-07-15 14:32:01',
    flowName: 'Salary Limit Approval Router',
    candidateName: 'David Chen',
    status: 'Success',
    message: 'Offer of $215k identified above median ($195k). Successfully routed to Hiring Manager Bret Taylor and generated review card.'
  },
  {
    id: 'log-2',
    timestamp: '2026-07-15 09:12:15',
    flowName: 'Agentforce Screen on Creation',
    candidateName: 'Michael Scott',
    status: 'Warning',
    message: 'Screen completed. Low match scores encountered (Overall: 45%). Marked with High Risk indicators and updated Candidate details.'
  },
  {
    id: 'log-3',
    timestamp: '2026-07-12 11:24:50',
    flowName: 'Agentforce Screen on Creation',
    candidateName: 'Elena Rostova',
    status: 'Success',
    message: 'Auto-screen complete. Overall Score: 74%. Logged summary feed on candidate record successfully.'
  }
];
