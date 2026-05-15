import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  GitBranch,
  Handshake,
  UsersRound,
} from 'lucide-react'

export type NavItem = {
  label: string
  icon: LucideIcon
}

export type Candidate = {
  id: string
  name: string
  role: string
  location: string
  experience: string
  match: number
  stage: string
  client: string
  vendor: string
  owner: string
  email: string
  phone: string
  noticePeriod: string
  currentCtc: string
  expectedCtc: string
  source: string
  duplicateRisk: 'Low' | 'Medium' | 'High'
  resumeStatus: 'Parsed' | 'Needs review' | 'Approved'
  lastUpdate: string
  skills: string[]
}

export type Submission = {
  candidate: string
  client: string
  job: string
  owner: string
  status: string
  updated: string
  feedback: 'Pending' | 'Interview' | 'Shortlisted' | 'Rejected'
}

export type VendorSubmission = {
  vendor: string
  candidate: string
  job: string
  health: 'Ready' | 'Review' | 'Duplicate'
  submitted: string
}

export type Notification = {
  id: number
  title: string
  detail: string
  time: string
  unread: boolean
}

export type ClientAccount = {
  name: string
  industry: string
  contact: string
  owner: string
  activeJobs: number
  submissions: number
  interviews: number
  visibility: string[]
  health: 'Healthy' | 'Needs feedback' | 'At risk'
}

export type VendorAccount = {
  name: string
  contact: string
  activeJobs: number
  submitted: number
  accepted: number
  duplicateRate: string
  status: 'Active' | 'Review' | 'Paused'
}

export type JobOpening = {
  id: string
  title: string
  client: string
  location: string
  openings: number
  budget: string
  priority: 'High' | 'Medium' | 'Low'
  owner: string
  vendors: string[]
  pipeline: number
  status: 'Open' | 'Hold' | 'Closing'
}

export type ReportMetric = {
  label: string
  value: string
  change?: string
  trend?: string
}

export type Activity = {
  time: string
  title: string
  detail: string
}

export const navItems: NavItem[] = [
  { label: 'Pipeline', icon: GitBranch },
  { label: 'Candidates', icon: UsersRound },
  { label: 'Clients', icon: Building2 },
  { label: 'Vendors', icon: Handshake },
  { label: 'Jobs', icon: BriefcaseBusiness },
  { label: 'Reports', icon: BarChart3 },
]

export const candidates: Candidate[] = [
  {
    id: 'VH-1042',
    name: 'Ananya Rao',
    role: 'Senior Java Developer',
    location: 'Bengaluru',
    experience: '7.4 yrs',
    match: 94,
    stage: 'Client Review',
    client: 'Northstar Digital',
    vendor: 'Direct',
    owner: 'Priya',
    email: 'ananya.rao@example.com',
    phone: '+91 98765 42110',
    noticePeriod: '30 days',
    currentCtc: '23 LPA',
    expectedCtc: '29 LPA',
    source: 'LinkedIn',
    duplicateRisk: 'Low',
    resumeStatus: 'Approved',
    lastUpdate: '12 min',
    skills: ['Java', 'Spring Boot', 'AWS', 'Kafka'],
  },
  {
    id: 'VH-1038',
    name: 'Rahul Menon',
    role: 'Data Engineer',
    location: 'Hyderabad',
    experience: '5.8 yrs',
    match: 88,
    stage: 'Interview',
    client: 'Apex Finserv',
    vendor: 'HireNest',
    owner: 'Kiran',
    email: 'rahul.menon@example.com',
    phone: '+91 99887 12340',
    noticePeriod: '45 days',
    currentCtc: '18 LPA',
    expectedCtc: '24 LPA',
    source: 'Vendor',
    duplicateRisk: 'Medium',
    resumeStatus: 'Parsed',
    lastUpdate: '34 min',
    skills: ['Python', 'Spark', 'Airflow', 'Snowflake'],
  },
  {
    id: 'VH-1031',
    name: 'Meera Iyer',
    role: 'QA Automation Lead',
    location: 'Chennai',
    experience: '8.1 yrs',
    match: 91,
    stage: 'Submitted',
    client: 'BlueOrbit',
    vendor: 'TalentWave',
    owner: 'Nisha',
    email: 'meera.iyer@example.com',
    phone: '+91 90001 77421',
    noticePeriod: 'Immediate',
    currentCtc: '21 LPA',
    expectedCtc: '26 LPA',
    source: 'Vendor',
    duplicateRisk: 'Low',
    resumeStatus: 'Needs review',
    lastUpdate: '1 hr',
    skills: ['Selenium', 'Playwright', 'API Testing'],
  },
  {
    id: 'VH-1025',
    name: 'Akhil S.',
    role: 'React Developer',
    location: 'Kochi',
    experience: '4.2 yrs',
    match: 86,
    stage: 'HR Review',
    client: 'Northstar Digital',
    vendor: 'HireNest',
    owner: 'Priya',
    email: 'akhil.s@example.com',
    phone: '+91 80862 23231',
    noticePeriod: '60 days',
    currentCtc: '14 LPA',
    expectedCtc: '19 LPA',
    source: 'Vendor',
    duplicateRisk: 'High',
    resumeStatus: 'Parsed',
    lastUpdate: '2 hr',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
  },
]

export const submissions: Submission[] = [
  {
    candidate: 'Ananya Rao',
    client: 'Northstar Digital',
    job: 'Java Platform Lead',
    owner: 'Priya',
    status: 'Client Review',
    updated: '12 min',
    feedback: 'Pending',
  },
  {
    candidate: 'Rahul Menon',
    client: 'Apex Finserv',
    job: 'Data Engineer',
    owner: 'Kiran',
    status: 'Interview',
    updated: '34 min',
    feedback: 'Interview',
  },
  {
    candidate: 'Meera Iyer',
    client: 'BlueOrbit',
    job: 'QA Automation Lead',
    owner: 'Nisha',
    status: 'Submitted',
    updated: '1 hr',
    feedback: 'Shortlisted',
  },
]

export const vendorSubmissions: VendorSubmission[] = [
  {
    vendor: 'HireNest',
    candidate: 'Akhil S.',
    job: 'React Developer',
    health: 'Ready',
    submitted: '5 min',
  },
  {
    vendor: 'TalentWave',
    candidate: 'Sneha P.',
    job: 'DevOps Engineer',
    health: 'Review',
    submitted: '21 min',
  },
  {
    vendor: 'BridgeSource',
    candidate: 'Karthik V.',
    job: 'Java Platform Lead',
    health: 'Duplicate',
    submitted: '42 min',
  },
]

export const clients: ClientAccount[] = [
  {
    name: 'Northstar Digital',
    industry: 'Enterprise SaaS',
    contact: 'Alex Mathew',
    owner: 'Priya',
    activeJobs: 4,
    submissions: 18,
    interviews: 6,
    visibility: ['Client PDFs', 'Stage updates', 'Interview slots'],
    health: 'Healthy',
  },
  {
    name: 'Apex Finserv',
    industry: 'Financial Services',
    contact: 'Ritika Shah',
    owner: 'Kiran',
    activeJobs: 3,
    submissions: 14,
    interviews: 4,
    visibility: ['Client PDFs', 'Feedback controls'],
    health: 'Needs feedback',
  },
  {
    name: 'BlueOrbit',
    industry: 'Product Engineering',
    contact: 'Vikram Das',
    owner: 'Nisha',
    activeJobs: 2,
    submissions: 9,
    interviews: 3,
    visibility: ['Client PDFs', 'Stage updates'],
    health: 'Healthy',
  },
]

export const vendors: VendorAccount[] = [
  {
    name: 'HireNest',
    contact: 'Naveen P.',
    activeJobs: 8,
    submitted: 42,
    accepted: 29,
    duplicateRate: '4%',
    status: 'Active',
  },
  {
    name: 'TalentWave',
    contact: 'Shreya K.',
    activeJobs: 6,
    submitted: 31,
    accepted: 19,
    duplicateRate: '7%',
    status: 'Review',
  },
  {
    name: 'BridgeSource',
    contact: 'Irfan M.',
    activeJobs: 3,
    submitted: 17,
    accepted: 8,
    duplicateRate: '18%',
    status: 'Paused',
  },
]

export const jobs: JobOpening[] = [
  {
    id: 'JOB-248',
    title: 'Java Platform Lead',
    client: 'Northstar Digital',
    location: 'Bengaluru',
    openings: 3,
    budget: '28-34 LPA',
    priority: 'High',
    owner: 'Priya',
    vendors: ['HireNest', 'BridgeSource'],
    pipeline: 16,
    status: 'Open',
  },
  {
    id: 'JOB-241',
    title: 'Data Engineer',
    client: 'Apex Finserv',
    location: 'Hyderabad',
    openings: 2,
    budget: '22-30 LPA',
    priority: 'High',
    owner: 'Kiran',
    vendors: ['HireNest'],
    pipeline: 11,
    status: 'Open',
  },
  {
    id: 'JOB-236',
    title: 'QA Automation Lead',
    client: 'BlueOrbit',
    location: 'Chennai',
    openings: 1,
    budget: '20-26 LPA',
    priority: 'Medium',
    owner: 'Nisha',
    vendors: ['TalentWave'],
    pipeline: 7,
    status: 'Closing',
  },
  {
    id: 'JOB-230',
    title: 'React Developer',
    client: 'Northstar Digital',
    location: 'Remote',
    openings: 4,
    budget: '16-22 LPA',
    priority: 'Medium',
    owner: 'Priya',
    vendors: ['HireNest', 'TalentWave'],
    pipeline: 13,
    status: 'Open',
  },
]

export const initialNotifications: Notification[] = [
  {
    id: 1,
    title: 'Client feedback received',
    detail: 'Northstar moved Ananya Rao to Client Review.',
    time: '2 min',
    unread: true,
  },
  {
    id: 2,
    title: 'Vendor candidate submitted',
    detail: 'HireNest uploaded a resume for React Developer.',
    time: '8 min',
    unread: true,
  },
  {
    id: 3,
    title: 'Duplicate check flagged',
    detail: 'BridgeSource submission matches an existing candidate.',
    time: '18 min',
    unread: false,
  },
]

export const pipelineStages = [
  'Parsed',
  'HR Review',
  'Submitted',
  'Client Review',
  'Interview',
  'Offer',
  'Joined',
]

export const parserFields = [
  { label: 'Name', value: 'Ananya Rao', confidence: 98 },
  { label: 'Email', value: 'hidden for client PDF', confidence: 96 },
  { label: 'Phone', value: 'hidden for client PDF', confidence: 95 },
  { label: 'Experience', value: '7.4 years', confidence: 92 },
  { label: 'Current role', value: 'Senior Java Developer', confidence: 91 },
  { label: 'Notice period', value: '30 days', confidence: 84 },
]

export const dashboardStats: ReportMetric[] = [
  { label: 'Parsed today', value: '48', trend: '+12%' },
  { label: 'Client packets', value: '19', trend: '+7%' },
  { label: 'Vendor review', value: '11', trend: '-3%' },
]

export const moduleStats: Record<string, ReportMetric[]> = {
  Pipeline: dashboardStats,
  Candidates: [
    { label: 'Active records', value: '1,284', change: '+38' },
    { label: 'Duplicates', value: '16', change: '-9%' },
    { label: 'Ready packets', value: '72', change: '+14' },
  ],
  Clients: [
    { label: 'Active clients', value: '26', change: '+3' },
    { label: 'Pending feedback', value: '41', change: '-8' },
    { label: 'Interviews', value: '18', change: '+6' },
  ],
  Vendors: [
    { label: 'Active vendors', value: '12', change: '+2' },
    { label: 'Submissions', value: '90', change: '+21' },
    { label: 'Duplicate rate', value: '6.4%', change: '-1.1%' },
  ],
  Jobs: [
    { label: 'Open jobs', value: '38', change: '+5' },
    { label: 'High priority', value: '12', change: '+4' },
    { label: 'Avg pipeline', value: '9.8', change: '+1.2' },
  ],
  Reports: [
    { label: 'Submissions', value: '278', change: '+12%' },
    { label: 'Joiners', value: '24', change: '+5' },
    { label: 'Time to submit', value: '2.4d', change: '-8%' },
  ],
}

export const reportMetrics: ReportMetric[] = [
  { label: 'Submission to interview', value: '31%', change: '+4%' },
  { label: 'Interview to offer', value: '22%', change: '+2%' },
  { label: 'Offer to joining', value: '68%', change: '-3%' },
  { label: 'Vendor acceptance', value: '64%', change: '+7%' },
]

export const activityFeed: Activity[] = [
  {
    time: '09:40',
    title: 'Resume parsed',
    detail: 'Ananya Rao profile approved for Northstar Digital.',
  },
  {
    time: '10:15',
    title: 'Client feedback',
    detail: 'Apex Finserv requested interview slots for Rahul Menon.',
  },
  {
    time: '11:05',
    title: 'Vendor access',
    detail: 'TalentWave assigned to QA Automation Lead.',
  },
  {
    time: '12:20',
    title: 'Packet generated',
    detail: 'Client-safe PDF created for VH-1042.',
  },
]
