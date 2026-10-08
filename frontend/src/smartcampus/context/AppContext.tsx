"use client";
import React, { createContext, useContext, useState } from 'react';
import {
  UserRole,
  UserProfile,
  StudentRecord,
  SubjectAttendance,
  Grievance,
  FeeItem,
  CertificateItem,
  CampusAlert,
  AIChatMessage,
  AdmissionApplication,
  ExamScheduleItem,
  ParentMessage,
  StudentServiceRequest
} from '../types';
import {
  USER_PROFILES,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_GRIEVANCES,
  INITIAL_FEES,
  INITIAL_CERTIFICATES,
  CAMPUS_ALERTS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ADMISSIONS,
  INITIAL_EXAM_SCHEDULE,
  INITIAL_PARENT_MESSAGES,
  INITIAL_SERVICE_REQUESTS
} from '../data/mockData';

interface AppContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  students: StudentRecord[];
  attendance: SubjectAttendance[];
  grievances: Grievance[];
  fees: FeeItem[];
  certificates: CertificateItem[];
  alerts: CampusAlert[];
  chatMessages: AIChatMessage[];
  isAssistantOpen: boolean;
  toggleAssistant: () => void;
  markAttendance: (code: string, present: boolean) => void;
  submitGrievance: (data: {
    title: string;
    category: Grievance['category'];
    priority: Grievance['priority'];
    department: string;
    description: string;
  }) => void;
  payFee: (feeId: string) => void;
  requestCertificate: (type: CertificateItem['type']) => void;
  sendChatMessage: (text: string) => void;
  emergencyAlertCount: number;

  // Phase 2 Extensions
  admissions: AdmissionApplication[];
  submitAdmissionApplication: (app: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'status' | 'submissionDate' | 'meritRank'>) => void;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status']) => void;
  examSchedule: ExamScheduleItem[];
  parentMessages: ParentMessage[];
  sendParentMessage: (subject: string, message: string, recipientName: string) => void;
  serviceRequests: StudentServiceRequest[];
  submitServiceRequest: (type: StudentServiceRequest['serviceType'], remarks: string) => void;
  sosTriggered: boolean;
  triggerEmergencySOS: () => void;
  dismissSOS: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [students, setStudents] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState<SubjectAttendance[]>(INITIAL_ATTENDANCE);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [fees, setFees] = useState<FeeItem[]>(INITIAL_FEES);
  const [certificates, setCertificates] = useState<CertificateItem[]>(INITIAL_CERTIFICATES);
  const [alerts] = useState<CampusAlert[]>(CAMPUS_ALERTS);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Phase 2 states
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>(INITIAL_ADMISSIONS);
  const [examSchedule] = useState<ExamScheduleItem[]>(INITIAL_EXAM_SCHEDULE);
  const [parentMessages, setParentMessages] = useState<ParentMessage[]>(INITIAL_PARENT_MESSAGES);
  const [serviceRequests, setServiceRequests] = useState<StudentServiceRequest[]>(INITIAL_SERVICE_REQUESTS);
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  const currentUser = USER_PROFILES[currentRole];

  const setRole = (role: UserRole) => {
    setRoleState(role);
    const roleNames: Record<UserRole, string> = {
      admin: 'Administrator (Dean / Registrar)',
      faculty: 'Faculty (HOD CSE)',
      student: 'Student (Aarav Sharma)',
      parent: 'Parent (Manoj Sharma)'
    };
    
    setChatMessages(prev => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'assistant',
        text: `Switched view mode to: ${roleNames[role]}. Access permissions and views have updated accordingly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const toggleAssistant = () => setIsAssistantOpen(prev => !prev);

  const markAttendance = (code: string, present: boolean) => {
    setAttendance(prev =>
      prev.map(sub => {
        if (sub.code === code) {
          const newTotal = sub.totalClasses + 1;
          const newAttended = present ? sub.attendedClasses + 1 : sub.attendedClasses;
          const newPct = parseFloat(((newAttended / newTotal) * 100).toFixed(1));
          const status = newPct >= 80 ? 'Healthy' : newPct >= 75 ? 'Warning' : 'Critical';
          const needed = newPct < 75 ? Math.ceil((0.75 * newTotal - newAttended) / 0.25) : 0;
          return {
            ...sub,
            totalClasses: newTotal,
            attendedClasses: newAttended,
            percentage: newPct,
            status,
            classesNeededFor75: Math.max(0, needed),
            lastUpdated: 'Just now (Biometric Punch Verified)'
          };
        }
        return sub;
      })
    );
  };

  const submitGrievance = (data: {
    title: string;
    category: Grievance['category'];
    priority: Grievance['priority'];
    department: string;
    description: string;
  }) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      trackingNumber: `GRV-2026-${randomNum}`,
      title: data.title,
      category: data.category,
      priority: data.priority,
      status: 'Submitted',
      submittedBy: `${currentUser.name} (${currentUser.rollNumber || currentUser.title})`,
      userRole: currentRole,
      department: data.department,
      description: data.description,
      submittedAt: 'Just now',
      slaTargetHours: data.priority === 'Urgent' ? 12 : data.priority === 'High' ? 24 : 48,
      hoursElapsed: 0,
      resolutionNotes: 'Automated AI categorization complete. Dispatched to department head SLA queue.'
    };
    setGrievances(prev => [newGrievance, ...prev]);
  };

  const payFee = (feeId: string) => {
    setFees(prev =>
      prev.map(item => {
        if (item.id === feeId) {
          return {
            ...item,
            status: 'Paid',
            paidDate: new Date().toISOString().split('T')[0],
            receiptNumber: `RCP-2026-${Math.floor(10000 + Math.random() * 90000)}`
          };
        }
        return item;
      })
    );
  };

  const requestCertificate = (type: CertificateItem['type']) => {
    const hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCert: CertificateItem = {
      id: `cert-${Date.now()}`,
      title: type,
      type,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Ready',
      sha256Hash: hash,
      issuedTo: currentUser.name,
      rollNo: currentUser.rollNumber || 'CS2022-048',
      validity: 'Digitally Verified & Valid'
    };
    setCertificates(prev => [newCert, ...prev]);
  };

  // Phase 2 Methods
  const submitAdmissionApplication = (app: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'status' | 'submissionDate' | 'meritRank'>) => {
    const randomAppNo = `APP-2026-${Math.floor(8000 + Math.random() * 2000)}`;
    const randomRank = Math.floor(50 + Math.random() * 400);
    const newApp: AdmissionApplication = {
      ...app,
      id: `adm-${Date.now()}`,
      applicationNumber: randomAppNo,
      status: 'Submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      meritRank: randomRank
    };
    setAdmissions(prev => [newApp, ...prev]);
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status']) => {
    setAdmissions(prev =>
      prev.map(a => (a.id === id ? { ...a, status } : a))
    );
  };

  const sendParentMessage = (subject: string, message: string, recipientName: string) => {
    const newMsg: ParentMessage = {
      id: `pm-${Date.now()}`,
      senderName: currentUser.name,
      senderRole: currentRole === 'parent' ? 'parent' : currentRole === 'faculty' ? 'faculty' : 'admin',
      recipientName,
      subject,
      message,
      timestamp: 'Just now',
      read: true
    };
    setParentMessages(prev => [newMsg, ...prev]);
  };

  const submitServiceRequest = (serviceType: StudentServiceRequest['serviceType'], remarks: string) => {
    const newToken = `SRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: StudentServiceRequest = {
      id: `req-${Date.now()}`,
      serviceType,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Processing',
      tokenNumber: newToken,
      remarks
    };
    setServiceRequests(prev => [newReq, ...prev]);
  };

  const triggerEmergencySOS = () => setSosTriggered(true);
  const dismissSOS = () => setSosTriggered(false);

  const sendChatMessage = (text: string) => {
    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let reply = "I am processing your inquiry regarding smart campus governance.";
      let action: { label: string; tab: string } | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('admission') || lower.includes('apply') || lower.includes('cutoff') || lower.includes('merit')) {
        reply = "Admissions 2026-27 is active! Merit lists are published for B.Tech CSE, AI & DS, and ECE. Candidates can submit their JEE/entrance scorecards for instant online verification.";
        action = { label: "Admissions Pipeline", tab: "admissions" };
      } else if (lower.includes('exam') || lower.includes('hall ticket') || lower.includes('admit card') || lower.includes('gpa')) {
        reply = "End-Term examinations start Nov 16, 2026. Hall tickets can be downloaded for courses with >= 75% attendance. You can also simulate your target CGPA on the Exam Portal.";
        action = { label: "Examinations & Hall Ticket", tab: "examinations" };
      } else if (lower.includes('parent') || lower.includes('hod') || lower.includes('message') || lower.includes('advisor')) {
        reply = "Parents can communicate directly with Faculty Advisors and HODs through the verified Parent Communication portal.";
        action = { label: "Parent Communication", tab: "parent-comm" };
      } else if (lower.includes('service') || lower.includes('library') || lower.includes('noc') || lower.includes('sports')) {
        reply = "Campus Student Services Desk lets you reserve library books, request internship NOCs, and book sports facilities in one click.";
        action = { label: "Student Services Desk", tab: "services" };
      } else if (lower.includes('attendance') || lower.includes('75') || lower.includes('absent')) {
        reply = "Campus Academic Regulation #8.2: Minimum 75% attendance is mandatory to appear in End-Semester examinations. If your attendance falls below 75%, an automated warning notice is generated for your Faculty Advisor.";
        action = { label: "Check Smart Attendance", tab: "attendance" };
      } else if (lower.includes('fee') || lower.includes('dues') || lower.includes('pay') || lower.includes('receipt')) {
        reply = "Semester fee payment deadline is Oct 15, 2026. You can pay via UPI, NetBanking, or Credit Card on the portal. Instant digital receipts with GST invoice are generated automatically.";
        action = { label: "Open FinTech Fees Portal", tab: "fees" };
      } else if (lower.includes('grievance') || lower.includes('complain') || lower.includes('wifi') || lower.includes('mess')) {
        reply = "The SmartCampus AI Grievance Redressal system tracks tickets with guaranteed SLA (Urgent: 12h, High: 24h). You can lodge a new grievance under Academic, Hostel, Transport, or Infra.";
        action = { label: "View Grievance Redressal", tab: "grievances" };
      } else if (lower.includes('certificate') || lower.includes('bonafide') || lower.includes('degree') || lower.includes('transcript')) {
        reply = "You can generate digitally signed Bona Fide and Grade Transcripts instantly. Each certificate contains a verifiable SHA-256 hash for employer and passport verification.";
        action = { label: "Request Certificate", tab: "certificates" };
      } else if (lower.includes('timetable') || lower.includes('class') || lower.includes('schedule') || lower.includes('lab')) {
        reply = "Your next scheduled session is 'Distributed Cloud Architecture' in Hall LH-301. Lab sessions are scheduled in Advanced Software Lab-4.";
        action = { label: "View Timetable", tab: "timetable" };
      } else if (lower.includes('hostel') || lower.includes('room') || lower.includes('bus') || lower.includes('transport')) {
        reply = "Hostel: Aryabhata Block B, Room B-304. Campus shuttle route #4 departs at 5:15 PM from Gate 2 with real-time GPS fleet telemetry.";
        action = { label: "Hostel & Transport", tab: "hostel" };
      } else {
        reply = `I've noted: "${text}". As your SMARTCAMPUS AI Copilot, I can assist you with admissions, exam hall tickets, attendance, fees, grievances, or student services.`;
      }

      const botMsg: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const emergencyAlertCount = alerts.filter(a => a.severity === 'emergency' || a.severity === 'warning').length;

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setRole,
        currentUser,
        activeTab,
        setActiveTab,
        students,
        attendance,
        grievances,
        fees,
        certificates,
        alerts,
        chatMessages,
        isAssistantOpen,
        toggleAssistant,
        markAttendance,
        submitGrievance,
        payFee,
        requestCertificate,
        sendChatMessage,
        emergencyAlertCount,

        // Phase 2
        admissions,
        submitAdmissionApplication,
        updateAdmissionStatus,
        examSchedule,
        parentMessages,
        sendParentMessage,
        serviceRequests,
        submitServiceRequest,
        sosTriggered,
        triggerEmergencySOS,
        dismissSOS
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

