import { useRef, useState, type ReactNode } from 'react'
import {
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleAlert,
  Cloud,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderKanban,
  Gauge,
  KeyRound,
  LockKeyhole,
  LogOut,
  Mail,
  PanelRightOpen,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UsersRound,
} from 'lucide-react'
import './App.css'
import {
  activityFeed,
  candidates,
  clients,
  dashboardStats,
  initialNotifications,
  jobs,
  moduleStats,
  navItems,
  parserFields,
  pipelineStages,
  reportMetrics,
  submissions,
  vendors,
  vendorSubmissions,
  type Candidate,
  type JobOpening,
  type Notification,
} from './data'

type IntakeState = 'idle' | 'processing' | 'ready'
type AuthMode = 'Magic link' | 'Password'
type UserRole = 'Admin' | 'HR' | 'Client' | 'Vendor'

type Session = {
  email: string
  role: UserRole
}

const pageTitles: Record<string, string> = {
  Pipeline: 'Recruiting Workspace',
  Candidates: 'Candidate Command',
  Clients: 'Client Portal',
  Vendors: 'Vendor Portal',
  Jobs: 'Job Control',
  Reports: 'Reports',
}

const initialCandidate = requireSeed(candidates, 'candidates')
const initialClient = requireSeed(clients, 'clients')
const initialVendor = requireSeed(vendors, 'vendors')

const roleProfiles: Array<{
  role: UserRole
  title: string
  detail: string
}> = [
  {
    role: 'Admin',
    title: 'Full workspace',
    detail: 'Users, jobs, clients, vendors, reports',
  },
  {
    role: 'HR',
    title: 'Recruiter desk',
    detail: 'Resume intake, candidates, submissions',
  },
  {
    role: 'Client',
    title: 'Client portal',
    detail: 'Submitted candidates and feedback',
  },
  {
    role: 'Vendor',
    title: 'Vendor portal',
    detail: 'Assigned jobs and candidate uploads',
  },
]

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode>('Magic link')
  const [loginEmail, setLoginEmail] = useState('support@theclosinggap.net')
  const [loginPassword, setLoginPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin')
  const [loginMessage, setLoginMessage] = useState(
    'Choose a role and continue. API auth connects later.',
  )
  const [activeNav, setActiveNav] = useState('Pipeline')
  const [candidateRecords, setCandidateRecords] = useState<Candidate[]>(candidates)
  const [selectedCandidateId, setSelectedCandidateId] = useState(
    initialCandidate.id,
  )
  const [selectedClient, setSelectedClient] = useState(initialClient.name)
  const [selectedVendor, setSelectedVendor] = useState(initialVendor.name)
  const [stage, setStage] = useState(initialCandidate.stage)
  const [intakeState, setIntakeState] = useState<IntakeState>('ready')
  const [fileName, setFileName] = useState('ananya-rao-resume.pdf')
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications)
  const [clientPacketReady, setClientPacketReady] = useState(false)
  const [newJobOpen, setNewJobOpen] = useState(false)
  const [portalFeedback, setPortalFeedback] = useState('Pending')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedCandidate =
    candidateRecords.find((candidate) => candidate.id === selectedCandidateId) ??
    initialCandidate
  const unreadCount = notifications.filter((item) => item.unread).length

  const completeLogin = () => {
    const trimmedEmail = loginEmail.trim()

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setLoginMessage('Enter a valid email address.')
      return
    }

    if (authMode === 'Password' && loginPassword.length < 6) {
      setLoginMessage('Password login needs at least 6 characters for this demo.')
      return
    }

    setSession({ email: trimmedEmail, role: selectedRole })
    setActiveNav(
      selectedRole === 'Client'
        ? 'Clients'
        : selectedRole === 'Vendor'
          ? 'Vendors'
          : 'Pipeline',
    )
    setLoginMessage('Signed in locally.')
  }

  const pushNotification = (title: string, detail: string) => {
    setNotifications((items) => [
      {
        id: Date.now(),
        title,
        detail,
        time: 'now',
        unread: true,
      },
      ...items,
    ])
  }

  const handleFile = (file?: File) => {
    if (!file) return

    setFileName(file.name)
    setIntakeState('processing')
    setClientPacketReady(false)

    window.setTimeout(() => {
      setIntakeState('ready')
      pushNotification(
        'Resume parsed',
        `${file.name} was allocated into the candidate profile.`,
      )
    }, 900)
  }

  const selectCandidate = (candidateId: string) => {
    const nextCandidate =
      candidateRecords.find((candidate) => candidate.id === candidateId) ??
      initialCandidate
    setSelectedCandidateId(nextCandidate.id)
    setStage(nextCandidate.stage)
    setClientPacketReady(false)
  }

  const updateStage = (nextStage: string) => {
    setStage(nextStage)
    setCandidateRecords((records) =>
      records.map((candidate) =>
        candidate.id === selectedCandidate.id
          ? { ...candidate, stage: nextStage, lastUpdate: 'now' }
          : candidate,
      ),
    )
    pushNotification(
      'Candidate flow updated',
      `${selectedCandidate.name} moved to ${nextStage}.`,
    )
  }

  const generateClientPacket = () => {
    setClientPacketReady(true)
    pushNotification(
      'Client PDF ready',
      `${selectedCandidate.id} packet excludes phone, email, and vendor details.`,
    )
  }

  const markAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, unread: false })),
    )
  }

  const handleClientFeedback = (feedback: string) => {
    setPortalFeedback(feedback)
    pushNotification(
      'Client portal feedback',
      `${selectedClient} marked ${selectedCandidate.id} as ${feedback}.`,
    )
  }

  if (!session) {
    return (
      <LoginView
        authMode={authMode}
        email={loginEmail}
        message={loginMessage}
        password={loginPassword}
        selectedRole={selectedRole}
        onAuthModeChange={setAuthMode}
        onEmailChange={setLoginEmail}
        onPasswordChange={setLoginPassword}
        onRoleChange={setSelectedRole}
        onSubmit={completeLogin}
      />
    )
  }

  return (
    <main className="app-shell">
      <Sidebar activeNav={activeNav} onSelect={setActiveNav} session={session} />

      <section className="workspace" aria-label={pageTitles[activeNav]}>
        <Topbar
          unreadCount={unreadCount}
          onUpload={() => fileInputRef.current?.click()}
          onNewJob={() => setNewJobOpen((open) => !open)}
          session={session}
          onLogout={() => setSession(null)}
        />

        <input
          ref={fileInputRef}
          className="visually-hidden"
          type="file"
          accept=".pdf"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <PageHero activeNav={activeNav} />

        {newJobOpen && <NewJobPanel onClose={() => setNewJobOpen(false)} />}

        {activeNav === 'Pipeline' && (
          <PipelineView
            fileName={fileName}
            intakeState={intakeState}
            onBrowse={() => fileInputRef.current?.click()}
            onGeneratePacket={generateClientPacket}
            clientPacketReady={clientPacketReady}
            selectedCandidate={selectedCandidate}
            candidateRecords={candidateRecords}
            onSelectCandidate={selectCandidate}
            currentStage={stage}
            onStageChange={updateStage}
            notifications={notifications}
            onMarkAllRead={markAllRead}
          />
        )}

        {activeNav === 'Candidates' && (
          <CandidatesView
            candidateRecords={candidateRecords}
            selectedCandidate={selectedCandidate}
            onSelectCandidate={selectCandidate}
            onStageChange={updateStage}
            onGeneratePacket={generateClientPacket}
            clientPacketReady={clientPacketReady}
          />
        )}

        {activeNav === 'Clients' && (
          <ClientsView
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            selectedCandidate={selectedCandidate}
            portalFeedback={portalFeedback}
            onPortalFeedback={handleClientFeedback}
          />
        )}

        {activeNav === 'Vendors' && (
          <VendorsView
            selectedVendor={selectedVendor}
            onSelectVendor={setSelectedVendor}
            onBrowse={() => fileInputRef.current?.click()}
            onNotify={(detail) => pushNotification('Vendor action', detail)}
          />
        )}

        {activeNav === 'Jobs' && (
          <JobsView
            onSelectClient={setSelectedClient}
            onSwitchClients={() => setActiveNav('Clients')}
            onSwitchVendors={() => setActiveNav('Vendors')}
          />
        )}

        {activeNav === 'Reports' && <ReportsView />}
      </section>
    </main>
  )
}

function LoginView({
  authMode,
  email,
  message,
  password,
  selectedRole,
  onAuthModeChange,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
}: {
  authMode: AuthMode
  email: string
  message: string
  password: string
  selectedRole: UserRole
  onAuthModeChange: (mode: AuthMode) => void
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onRoleChange: (role: UserRole) => void
  onSubmit: () => void
}) {
  return (
    <main className="login-shell">
      <section className="login-panel" aria-label="Closing Gap sign in">
        <div className="login-brand">
          <div className="brand-mark login-mark" aria-hidden="true">
            T
          </div>
          <div>
            <span>Closing Gap</span>
            <strong>TruHyre Recruit Suite</strong>
          </div>
        </div>

        <div className="login-heading">
          <h1>Sign in to workspace</h1>
          <p>Secure access for recruiters, clients, and vendors.</p>
        </div>

        <div className="auth-toggle" role="tablist" aria-label="Login method">
          {(['Magic link', 'Password'] as const).map((mode) => (
            <button
              className={authMode === mode ? 'selected' : ''}
              type="button"
              role="tab"
              aria-selected={authMode === mode}
              key={mode}
              onClick={() => onAuthModeChange(mode)}
            >
              {mode}
            </button>
          ))}
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
        </label>

        {authMode === 'Password' && (
          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              placeholder="Local demo password"
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </label>
        )}

        <div className="role-grid" aria-label="Choose login role">
          {roleProfiles.map((profile) => (
            <button
              className={
                selectedRole === profile.role ? 'role-card selected' : 'role-card'
              }
              type="button"
              aria-label={`${profile.role} role`}
              key={profile.role}
              onClick={() => onRoleChange(profile.role)}
            >
              <strong>{profile.role}</strong>
              <span>{profile.title}</span>
              <small>{profile.detail}</small>
            </button>
          ))}
        </div>

        <button className="primary-button login-submit" type="button" onClick={onSubmit}>
          {authMode === 'Magic link' ? 'Send Magic Link' : 'Continue'}
        </button>

        <p className="login-message">{message}</p>
      </section>

      <section className="workflow-panel" aria-label="Workflow preview">
        <div className="workflow-card">
          <span>Workflow</span>
          <strong>PDF to client-ready submission</strong>
          <ol>
            <li>Upload resume</li>
            <li>Parse and review profile</li>
            <li>Store original privately</li>
            <li>Generate client-safe PDF</li>
            <li>Notify HR, client, or vendor</li>
          </ol>
        </div>
        <div className="connection-card">
          <span>Later connections</span>
          <strong>Supabase + Google Workspace</strong>
          <p>
            Database, auth, Drive, Gmail, PDF/OCR, and AI parsing will connect
            after the frontend workflow is approved.
          </p>
        </div>
      </section>
    </main>
  )
}

function PageHero({ activeNav }: { activeNav: string }) {
  const stats = moduleStats[activeNav] ?? dashboardStats

  return (
    <section className="hero-strip" aria-label={`${activeNav} summary`}>
      <div>
        <h1>{pageTitles[activeNav]}</h1>
      </div>
      <div className="summary-grid" aria-label="Module activity">
        {stats.map((stat) => (
          <div className="summary-item" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.trend ?? stat.change}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

function PipelineView({
  fileName,
  intakeState,
  onBrowse,
  onGeneratePacket,
  clientPacketReady,
  selectedCandidate,
  candidateRecords,
  onSelectCandidate,
  currentStage,
  onStageChange,
  notifications,
  onMarkAllRead,
}: {
  fileName: string
  intakeState: IntakeState
  onBrowse: () => void
  onGeneratePacket: () => void
  clientPacketReady: boolean
  selectedCandidate: Candidate
  candidateRecords: Candidate[]
  onSelectCandidate: (candidateId: string) => void
  currentStage: string
  onStageChange: (stage: string) => void
  notifications: Notification[]
  onMarkAllRead: () => void
}) {
  return (
    <section className="dashboard-grid">
      <ResumeIntake
        fileName={fileName}
        intakeState={intakeState}
        onBrowse={onBrowse}
        onGeneratePacket={onGeneratePacket}
        clientPacketReady={clientPacketReady}
      />

      <ClientSubmissions />

      <VendorQueue />

      <StatusFlow
        currentStage={currentStage}
        selectedCandidateName={selectedCandidate.name}
        onStageChange={onStageChange}
      />

      <ClientPacket
        selectedCandidate={selectedCandidate}
        isReady={clientPacketReady}
        onGenerate={onGeneratePacket}
      />

      <NotificationsPanel
        notifications={notifications}
        onMarkAllRead={onMarkAllRead}
      />

      <CandidatePanel
        candidateRecords={candidateRecords}
        selectedCandidate={selectedCandidate}
        onSelect={onSelectCandidate}
      />
    </section>
  )
}

function CandidatesView({
  candidateRecords,
  selectedCandidate,
  onSelectCandidate,
  onStageChange,
  onGeneratePacket,
  clientPacketReady,
}: {
  candidateRecords: Candidate[]
  selectedCandidate: Candidate
  onSelectCandidate: (candidateId: string) => void
  onStageChange: (stage: string) => void
  onGeneratePacket: () => void
  clientPacketReady: boolean
}) {
  return (
    <section className="module-grid candidates-module">
      <section className="panel module-wide">
        <PanelHeader
          icon={<UsersRound size={18} aria-hidden="true" />}
          title="Candidate Directory"
          actionLabel={`${candidateRecords.length} records`}
        />
        <div className="data-table candidate-table">
          <div className="table-head">
            <span>Candidate</span>
            <span>Client</span>
            <span>Stage</span>
            <span>Risk</span>
            <span>Owner</span>
          </div>
          {candidateRecords.map((candidate) => (
            <button
              className={
                candidate.id === selectedCandidate.id
                  ? 'table-row selected'
                  : 'table-row'
              }
              type="button"
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate.id)}
            >
              <span>
                <strong>{candidate.name}</strong>
                <small>
                  {candidate.role} | {candidate.experience}
                </small>
              </span>
              <span>{candidate.client}</span>
              <em>{candidate.stage}</em>
              <StatusPill status={candidate.duplicateRisk} />
              <span>{candidate.owner}</span>
            </button>
          ))}
        </div>
      </section>

      <CandidateProfile selectedCandidate={selectedCandidate} />

      <section className="panel">
        <PanelHeader
          icon={<ShieldCheck size={18} aria-hidden="true" />}
          title="Duplicate Guard"
          actionLabel={selectedCandidate.duplicateRisk}
        />
        <div className="guard-list">
          <GuardItem label="Email" value={selectedCandidate.email} state="Clear" />
          <GuardItem label="Phone" value={selectedCandidate.phone} state="Clear" />
          <GuardItem label="LinkedIn" value="No matching profile" state="Clear" />
          <GuardItem label="Resume hash" value="1 similar resume" state="Review" />
        </div>
      </section>

      <StatusFlow
        currentStage={selectedCandidate.stage}
        selectedCandidateName={selectedCandidate.name}
        onStageChange={onStageChange}
      />

      <ClientPacket
        selectedCandidate={selectedCandidate}
        isReady={clientPacketReady}
        onGenerate={onGeneratePacket}
      />
    </section>
  )
}

function ClientsView({
  selectedClient,
  onSelectClient,
  selectedCandidate,
  portalFeedback,
  onPortalFeedback,
}: {
  selectedClient: string
  onSelectClient: (client: string) => void
  selectedCandidate: Candidate
  portalFeedback: string
  onPortalFeedback: (feedback: string) => void
}) {
  const activeClient =
    clients.find((client) => client.name === selectedClient) ?? initialClient

  return (
    <section className="module-grid clients-module">
      <section className="panel">
        <PanelHeader
          icon={<BriefcaseBusiness size={18} aria-hidden="true" />}
          title="Client Accounts"
          actionLabel={`${clients.length} live`}
        />
        <div className="account-list">
          {clients.map((client) => (
            <button
              className={
                client.name === selectedClient ? 'account-row selected' : 'account-row'
              }
              type="button"
              key={client.name}
              onClick={() => onSelectClient(client.name)}
            >
              <span>
                <strong>{client.name}</strong>
                <small>{client.industry}</small>
              </span>
              <StatusPill status={client.health} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel module-wide">
        <PanelHeader
          icon={<Eye size={18} aria-hidden="true" />}
          title="Client Portal Preview"
          actionLabel={activeClient.name}
        />
        <div className="portal-shell">
          <div className="portal-header">
            <span>{activeClient.contact}</span>
            <strong>{activeClient.name}</strong>
            <small>{activeClient.activeJobs} open jobs</small>
          </div>
          <div className="portal-submission">
            <div>
              <span>Candidate packet</span>
              <h3>{selectedCandidate.id}</h3>
              <p>
                {selectedCandidate.role} | {selectedCandidate.experience} |
                {selectedCandidate.location}
              </p>
            </div>
            <div className="hidden-fields">
              <span>
                <Check size={14} aria-hidden="true" />
                Contact hidden
              </span>
              <span>
                <Check size={14} aria-hidden="true" />
                Vendor hidden
              </span>
              <span>
                <Check size={14} aria-hidden="true" />
                Internal notes hidden
              </span>
            </div>
          </div>
          <div className="feedback-controls">
            {['Shortlist', 'Reject', 'Interview', 'Hold'].map((feedback) => (
              <button
                className={
                  portalFeedback === feedback
                    ? 'secondary-button selected'
                    : 'secondary-button'
                }
                type="button"
                key={feedback}
                onClick={() => onPortalFeedback(feedback)}
              >
                {feedback}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<LockKeyhole size={18} aria-hidden="true" />}
          title="Visibility Rules"
          actionLabel="Client-safe"
        />
        <div className="rule-list">
          {activeClient.visibility.map((rule) => (
            <span key={rule}>
              <Check size={14} aria-hidden="true" />
              {rule}
            </span>
          ))}
          <span>
            <Check size={14} aria-hidden="true" />
            No original resume access
          </span>
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<Mail size={18} aria-hidden="true" />}
          title="Feedback Queue"
          actionLabel={`${activeClient.submissions} sent`}
        />
        <div className="mini-metrics">
          <Metric label="Submissions" value={String(activeClient.submissions)} />
          <Metric label="Interviews" value={String(activeClient.interviews)} />
          <Metric label="Owner" value={activeClient.owner} />
        </div>
      </section>
    </section>
  )
}

function VendorsView({
  selectedVendor,
  onSelectVendor,
  onBrowse,
  onNotify,
}: {
  selectedVendor: string
  onSelectVendor: (vendor: string) => void
  onBrowse: () => void
  onNotify: (detail: string) => void
}) {
  const activeVendor =
    vendors.find((vendor) => vendor.name === selectedVendor) ?? initialVendor

  return (
    <section className="module-grid vendors-module">
      <section className="panel">
        <PanelHeader
          icon={<PanelRightOpen size={18} aria-hidden="true" />}
          title="Vendor Accounts"
          actionLabel={`${vendors.length} partners`}
        />
        <div className="account-list">
          {vendors.map((vendor) => (
            <button
              className={
                vendor.name === selectedVendor ? 'account-row selected' : 'account-row'
              }
              type="button"
              key={vendor.name}
              onClick={() => onSelectVendor(vendor.name)}
            >
              <span>
                <strong>{vendor.name}</strong>
                <small>{vendor.contact}</small>
              </span>
              <StatusPill status={vendor.status} />
            </button>
          ))}
        </div>
      </section>

      <section className="panel module-wide">
        <PanelHeader
          icon={<UploadCloud size={18} aria-hidden="true" />}
          title="Vendor Submission Desk"
          actionLabel={activeVendor.name}
        />
        <div className="vendor-submit-grid">
          <button className="drop-zone compact" type="button" onClick={onBrowse}>
            <UploadCloud size={22} aria-hidden="true" />
            <span>Upload candidate PDF</span>
            <strong>{activeVendor.name} portal intake</strong>
          </button>
          <div className="vendor-form">
            <label>
              <span>Assigned job</span>
              <select defaultValue="Java Platform Lead">
                {jobs.map((job) => (
                  <option key={job.id}>{job.title}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Candidate code</span>
              <input defaultValue="Vendor draft" />
            </label>
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                onNotify(`${activeVendor.name} submitted a candidate draft.`)
              }
            >
              Submit Draft
            </button>
          </div>
        </div>
      </section>

      <VendorQueue />

      <section className="panel">
        <PanelHeader
          icon={<Gauge size={18} aria-hidden="true" />}
          title="Vendor Quality"
          actionLabel={activeVendor.status}
        />
        <div className="mini-metrics">
          <Metric label="Submitted" value={String(activeVendor.submitted)} />
          <Metric label="Accepted" value={String(activeVendor.accepted)} />
          <Metric label="Duplicate" value={activeVendor.duplicateRate} />
        </div>
      </section>
    </section>
  )
}

function JobsView({
  onSelectClient,
  onSwitchClients,
  onSwitchVendors,
}: {
  onSelectClient: (client: string) => void
  onSwitchClients: () => void
  onSwitchVendors: () => void
}) {
  return (
    <section className="module-grid jobs-module">
      <section className="panel module-wide">
        <PanelHeader
          icon={<BriefcaseBusiness size={18} aria-hidden="true" />}
          title="Open Requirements"
          actionLabel={`${jobs.length} jobs`}
        />
        <div className="job-board">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelectClient={onSelectClient}
              onSwitchClients={onSwitchClients}
              onSwitchVendors={onSwitchVendors}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<UsersRound size={18} aria-hidden="true" />}
          title="Assignment Matrix"
          actionLabel="Live"
        />
        <div className="assignment-list">
          {jobs.map((job) => (
            <div className="assignment-row" key={job.id}>
              <strong>{job.owner}</strong>
              <span>{job.title}</span>
              <small>{job.vendors.join(', ')}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<KeyRound size={18} aria-hidden="true" />}
          title="Access"
          actionLabel="Role based"
        />
        <div className="rule-list">
          <span>
            <Check size={14} aria-hidden="true" />
            Assign client visibility per job
          </span>
          <span>
            <Check size={14} aria-hidden="true" />
            Assign vendor access per job
          </span>
          <span>
            <Check size={14} aria-hidden="true" />
            Keep internal notes private
          </span>
        </div>
      </section>
    </section>
  )
}

function ReportsView() {
  return (
    <section className="module-grid reports-module">
      <section className="panel module-wide">
        <PanelHeader
          icon={<BarChartIcon />}
          title="Performance Overview"
          actionLabel="30 days"
        />
        <div className="report-grid">
          {reportMetrics.map((metric) => (
            <div className="report-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.change}</small>
            </div>
          ))}
        </div>
        <div className="chart-strip" aria-label="Submission trend">
          {Array.from({ length: 28 }, (_, index) => (
            <span
              key={index}
              style={{ height: `${22 + ((index * 11) % 46)}px` }}
            />
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<Bell size={18} aria-hidden="true" />}
          title="Activity"
          actionLabel="Today"
        />
        <div className="activity-list">
          {activityFeed.map((activity) => (
            <div className="activity-row" key={`${activity.time}-${activity.title}`}>
              <span>{activity.time}</span>
              <div>
                <strong>{activity.title}</strong>
                <p>{activity.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <PanelHeader
          icon={<Cloud size={18} aria-hidden="true" />}
          title="Connection Plan"
          actionLabel="Later"
        />
        <div className="integration-list">
          {['Google Drive', 'Gmail', 'Database', 'PDF/OCR', 'Authentication'].map(
            (item) => (
              <span key={item}>
                <CircleAlert size={14} aria-hidden="true" />
                {item}
              </span>
            ),
          )}
        </div>
      </section>
    </section>
  )
}

function Sidebar({
  activeNav,
  onSelect,
  session,
}: {
  activeNav: string
  onSelect: (label: string) => void
  session: Session
}) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true">
          T
        </div>
        <div>
          <strong>TruHyre</strong>
          <span>Closing Gap</span>
        </div>
      </div>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              className={activeNav === item.label ? 'nav-item active' : 'nav-item'}
              type="button"
              key={item.label}
              aria-label={item.label}
              onClick={() => onSelect(item.label)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="drive-status">
        <Cloud size={18} aria-hidden="true" />
        <div>
          <strong>{session.role}</strong>
          <span>APIs connect last</span>
        </div>
      </div>
    </aside>
  )
}

function Topbar({
  unreadCount,
  onUpload,
  onNewJob,
  session,
  onLogout,
}: {
  unreadCount: number
  onUpload: () => void
  onNewJob: () => void
  session: Session
  onLogout: () => void
}) {
  return (
    <header className="topbar">
      <label className="search-field">
        <Search size={17} aria-hidden="true" />
        <input type="search" placeholder="Search candidates, jobs, clients" />
      </label>

      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Filter">
          <Filter size={18} aria-hidden="true" />
        </button>
        <button className="icon-button notification-button" type="button">
          <Bell size={18} aria-hidden="true" />
          <span>{unreadCount}</span>
        </button>
        <button className="secondary-button" type="button" onClick={onNewJob}>
          <Plus size={17} aria-hidden="true" />
          New Job
        </button>
        <button className="primary-button" type="button" onClick={onUpload}>
          <UploadCloud size={17} aria-hidden="true" />
          Upload Resume
        </button>
        <div className="user-chip" title={session.email}>
          <span>{session.role}</span>
          <strong>{initials(session.email)}</strong>
        </div>
        <button className="icon-button" type="button" aria-label="Sign out" onClick={onLogout}>
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

function NewJobPanel({ onClose }: { onClose: () => void }) {
  return (
    <section className="new-job-panel" aria-label="New job draft">
      <div>
        <h2>New Job</h2>
        <p>Capture the requirement before assigning HR users or vendors.</p>
      </div>
      <div className="new-job-fields">
        <label>
          <span>Client</span>
          <input defaultValue="Northstar Digital" />
        </label>
        <label>
          <span>Role</span>
          <input defaultValue="Java Platform Lead" />
        </label>
        <label>
          <span>Openings</span>
          <input defaultValue="3" />
        </label>
      </div>
      <button className="icon-button" type="button" onClick={onClose}>
        <Check size={18} aria-hidden="true" />
      </button>
    </section>
  )
}

function ResumeIntake({
  fileName,
  intakeState,
  onBrowse,
  onGeneratePacket,
  clientPacketReady,
}: {
  fileName: string
  intakeState: IntakeState
  onBrowse: () => void
  onGeneratePacket: () => void
  clientPacketReady: boolean
}) {
  const isProcessing = intakeState === 'processing'

  return (
    <section className="panel resume-intake">
      <PanelHeader
        icon={<FileText size={18} aria-hidden="true" />}
        title="Resume Intake"
        actionLabel={isProcessing ? 'Parsing' : 'Ready'}
      />

      <button className="drop-zone" type="button" onClick={onBrowse}>
        <UploadCloud size={24} aria-hidden="true" />
        <span>{fileName}</span>
        <strong>
          {isProcessing
            ? 'Extracting text and allocating fields'
            : 'Upload PDF resume'}
        </strong>
      </button>

      <div className="parser-progress" aria-label="Parser progress">
        <span style={{ width: isProcessing ? '68%' : '100%' }} />
      </div>

      <div className="field-grid">
        {parserFields.map((field) => (
          <div className="parsed-field" key={field.label}>
            <span>{field.label}</span>
            <strong>{field.value}</strong>
            <small>{field.confidence}%</small>
          </div>
        ))}
      </div>

      <div className="panel-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onGeneratePacket}
        >
          <ShieldCheck size={17} aria-hidden="true" />
          {clientPacketReady ? 'PDF Ready' : 'Generate Client PDF'}
        </button>
      </div>
    </section>
  )
}

function CandidatePanel({
  candidateRecords,
  selectedCandidate,
  onSelect,
}: {
  candidateRecords: Candidate[]
  selectedCandidate: Candidate
  onSelect: (candidateId: string) => void
}) {
  return (
    <section className="panel candidate-panel">
      <PanelHeader
        icon={<FolderKanban size={18} aria-hidden="true" />}
        title="Candidates"
        actionLabel={`${candidateRecords.length} active`}
      />

      <div className="candidate-list">
        {candidateRecords.slice(0, 3).map((candidate) => (
          <button
            className={
              candidate.id === selectedCandidate.id
                ? 'candidate-row selected'
                : 'candidate-row'
            }
            key={candidate.id}
            type="button"
            onClick={() => onSelect(candidate.id)}
          >
            <span>
              <strong>{candidate.name}</strong>
              <small>
                {candidate.role} | {candidate.location}
              </small>
            </span>
            <em>{candidate.match}%</em>
          </button>
        ))}
      </div>

      <div className="candidate-detail">
        <div className="candidate-avatar" aria-hidden="true">
          {initials(selectedCandidate.name)}
        </div>
        <div>
          <p>{selectedCandidate.id}</p>
          <h3>{selectedCandidate.name}</h3>
          <span>{selectedCandidate.experience}</span>
        </div>
      </div>

      <div className="skill-row">
        {selectedCandidate.skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </section>
  )
}

function CandidateProfile({ selectedCandidate }: { selectedCandidate: Candidate }) {
  return (
    <section className="panel">
      <PanelHeader
        icon={<FileCheck2 size={18} aria-hidden="true" />}
        title="Internal Profile"
        actionLabel={selectedCandidate.resumeStatus}
      />
      <div className="profile-grid">
        <ProfileField label="Name" value={selectedCandidate.name} />
        <ProfileField label="Role" value={selectedCandidate.role} />
        <ProfileField label="Email" value={selectedCandidate.email} />
        <ProfileField label="Phone" value={selectedCandidate.phone} />
        <ProfileField label="Notice" value={selectedCandidate.noticePeriod} />
        <ProfileField label="Current CTC" value={selectedCandidate.currentCtc} />
        <ProfileField label="Expected CTC" value={selectedCandidate.expectedCtc} />
        <ProfileField label="Source" value={selectedCandidate.source} />
      </div>
    </section>
  )
}

function ClientSubmissions() {
  return (
    <section className="panel client-submissions">
      <PanelHeader
        icon={<Mail size={18} aria-hidden="true" />}
        title="Client Submissions"
        actionLabel="Live"
      />

      <div className="table-list">
        {submissions.map((submission) => (
          <div className="submission-row" key={submission.candidate}>
            <span>
              <strong>{submission.candidate}</strong>
              <small>
                {submission.client} | {submission.job}
              </small>
            </span>
            <span>{submission.owner}</span>
            <em>{submission.status}</em>
            <small>{submission.updated}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

function VendorQueue() {
  return (
    <section className="panel vendor-queue">
      <PanelHeader
        icon={<PanelRightOpen size={18} aria-hidden="true" />}
        title="Vendor Queue"
        actionLabel="11 review"
      />

      <div className="vendor-list">
        {vendorSubmissions.map((submission) => (
          <div className="vendor-row" key={`${submission.vendor}-${submission.candidate}`}>
            <div>
              <strong>{submission.candidate}</strong>
              <span>
                {submission.vendor} | {submission.job}
              </span>
            </div>
            <StatusPill status={submission.health} />
            <small>{submission.submitted}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusFlow({
  currentStage,
  selectedCandidateName,
  onStageChange,
}: {
  currentStage: string
  selectedCandidateName: string
  onStageChange: (stage: string) => void
}) {
  return (
    <section className="panel status-flow">
      <PanelHeader
        icon={<GitFlowIcon />}
        title="Status Flow"
        actionLabel={selectedCandidateName}
      />

      <div className="stage-track">
        {pipelineStages.map((stageName, index) => {
          const isActive = stageName === currentStage
          const isComplete = pipelineStages.indexOf(currentStage) > index

          return (
            <button
              className={
                isActive
                  ? 'stage-item active'
                  : isComplete
                    ? 'stage-item done'
                    : 'stage-item'
              }
              type="button"
              key={stageName}
              onClick={() => onStageChange(stageName)}
            >
              <span>{index + 1}</span>
              <strong>{stageName}</strong>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ClientPacket({
  selectedCandidate,
  isReady,
  onGenerate,
}: {
  selectedCandidate: Candidate
  isReady: boolean
  onGenerate: () => void
}) {
  return (
    <section className="panel client-packet">
      <PanelHeader
        icon={<LockKeyhole size={18} aria-hidden="true" />}
        title="Client PDF"
        actionLabel={isReady ? 'Sanitized' : 'Draft'}
      />

      <div className="packet-preview">
        <div>
          <span>Client view</span>
          <h3>{selectedCandidate.role}</h3>
          <p>
            {selectedCandidate.experience} | {selectedCandidate.location} |
            {selectedCandidate.skills.slice(0, 3).join(', ')}
          </p>
        </div>
        <div className="hidden-fields">
          <span>
            <Check size={14} aria-hidden="true" />
            Email hidden
          </span>
          <span>
            <Check size={14} aria-hidden="true" />
            Phone hidden
          </span>
          <span>
            <Check size={14} aria-hidden="true" />
            Vendor hidden
          </span>
        </div>
      </div>

      <button className="primary-button full-width" type="button" onClick={onGenerate}>
        <FileCheck2 size={17} aria-hidden="true" />
        {isReady ? 'Download PDF' : 'Generate PDF'}
      </button>
    </section>
  )
}

function NotificationsPanel({
  notifications,
  onMarkAllRead,
}: {
  notifications: Notification[]
  onMarkAllRead: () => void
}) {
  return (
    <section className="panel notifications-panel">
      <PanelHeader
        icon={<Bell size={18} aria-hidden="true" />}
        title="Notifications"
        actionLabel={`${notifications.filter((item) => item.unread).length} unread`}
      />

      <div className="notification-list">
        {notifications.slice(0, 4).map((item) => (
          <div
            className={item.unread ? 'notification-row unread' : 'notification-row'}
            key={item.id}
          >
            <span aria-hidden="true" />
            <div>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
            <small>{item.time}</small>
          </div>
        ))}
      </div>

      <button className="secondary-button full-width" type="button" onClick={onMarkAllRead}>
        Mark all read
      </button>
    </section>
  )
}

function JobCard({
  job,
  onSelectClient,
  onSwitchClients,
  onSwitchVendors,
}: {
  job: JobOpening
  onSelectClient: (client: string) => void
  onSwitchClients: () => void
  onSwitchVendors: () => void
}) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <span>{job.id}</span>
        <StatusPill status={job.priority} />
      </div>
      <h3>{job.title}</h3>
      <p>
        {job.client} | {job.location} | {job.budget}
      </p>
      <div className="job-meta">
        <Metric label="Openings" value={String(job.openings)} />
        <Metric label="Pipeline" value={String(job.pipeline)} />
        <Metric label="Owner" value={job.owner} />
      </div>
      <div className="job-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            onSelectClient(job.client)
            onSwitchClients()
          }}
        >
          Client
        </button>
        <button className="secondary-button" type="button" onClick={onSwitchVendors}>
          Vendors
        </button>
      </div>
    </article>
  )
}

function PanelHeader({
  icon,
  title,
  actionLabel,
}: {
  icon: ReactNode
  title: string
  actionLabel: string
}) {
  return (
    <div className="panel-header">
      <div>
        {icon}
        <h2>{title}</h2>
      </div>
      <button className="panel-chip" type="button">
        {actionLabel}
        <ChevronDown size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

function StatusPill({ status }: { status: string }) {
  const clean = status.toLowerCase().replace(/\s+/g, '-')
  const Icon =
    status === 'Duplicate' || status === 'At risk'
      ? CircleAlert
      : status === 'Ready' || status === 'Low' || status === 'Healthy'
        ? Check
        : Sparkles

  return (
    <span className={`status-pill ${clean}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  )
}

function GuardItem({
  label,
  value,
  state,
}: {
  label: string
  value: string
  state: string
}) {
  return (
    <div className="guard-item">
      <span>{label}</span>
      <strong>{value}</strong>
      <StatusPill status={state} />
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <label className={value.length > 18 ? 'profile-field wide' : 'profile-field'}>
      <span>{label}</span>
      <input defaultValue={value} />
    </label>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function GitFlowIcon() {
  return (
    <svg
      className="flow-icon"
      viewBox="0 0 18 18"
      role="img"
      aria-label=""
      aria-hidden="true"
    >
      <path d="M5 4.2v9.6M13 4.2c0 3.6-2.8 3.7-2.8 6.6V14" />
      <circle cx="5" cy="4" r="2" />
      <circle cx="5" cy="14" r="2" />
      <circle cx="13" cy="4" r="2" />
      <circle cx="10.2" cy="14" r="2" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg
      className="flow-icon"
      viewBox="0 0 18 18"
      role="img"
      aria-label=""
      aria-hidden="true"
    >
      <path d="M3 15V8M8 15V4M13 15v-6" />
      <path d="M2 15h14" />
    </svg>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
}

function requireSeed<T>(items: readonly T[], label: string): T {
  const first = items[0]

  if (!first) {
    throw new Error(`TruHyre seed data requires at least one ${label} item.`)
  }

  return first
}

export default App
