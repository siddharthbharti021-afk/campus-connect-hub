export type UserRole = 'admin' | 'faculty' | 'student' | 'parent';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
  title: string;
  department: string;
  rollNumber?: string;
  semester?: number;
  phone: string;
  guardianName?: string;
  guardianPhone?: string;
  hostelBlock?: string;
  roomNumber?: string;
  busRoute?: string;
}

export interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  branch: string;
  semester: number;
  cgpa: number;
  creditsCompleted: number;
  totalCredits: number;
  overallAttendance: number;
  feeStatus: 'Paid' | 'Partial' | 'Overdue';
  pendingDues: number;
  hostelResident: boolean;
  hostelRoom?: string;
  busRoute?: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Detained';
  backlogs: number;
  riskScore?: 'Low' | 'Medium' | 'High';
}

export interface SubjectAttendance {
  code: string;
  name: string;
  faculty: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  classesNeededFor75: number;
  lastUpdated: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  isCurrent?: boolean;
}

export interface Grievance {
  id: string;
  trackingNumber: string;
  title: string;
  category: 'Academic' | 'Hostel & Mess' | 'Transport' | 'Fees & Accounts' | 'Infrastructure' | 'Discipline & Anti-Ragging';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Submitted' | 'Under Review' | 'Investigating' | 'Resolved';
  submittedBy: string;
  userRole: UserRole;
  department: string;
  description: string;
  submittedAt: string;
  slaTargetHours: number;
  hoursElapsed: number;
  resolutionNotes?: string;
}

export interface FeeItem {
  id: string;
  title: string;
  category: 'Tuition' | 'Hostel' | 'Mess' | 'Exam' | 'Development' | 'Library';
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  semester: string;
  receiptNumber?: string;
  paidDate?: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  type: 'Bona Fide Certificate' | 'Provisional Degree' | 'Grade Transcript' | 'Transfer Certificate' | 'No Dues Certificate';
  issueDate: string;
  status: 'Ready' | 'In Process' | 'Requested';
  sha256Hash: string;
  issuedTo: string;
  rollNo: string;
  validity: string;
}

export interface CampusAlert {
  id: string;
  title: string;
  description: string;
  severity: 'emergency' | 'warning' | 'info';
  timestamp: string;
  targetRole: 'all' | 'students' | 'faculty' | 'parents';
  active: boolean;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tab: string;
  };
}

// ================= PHASE 2 EXTENSIONS =================

export interface AdmissionApplication {
  id: string;
  applicationNumber: string;
  applicantName: string;
  email: string;
  phone: string;
  program: string;
  branchPreference: string;
  entranceExamScore: number;
  meritRank: number;
  status: 'Submitted' | 'Document Verified' | 'Seat Allotted' | 'Fee Paid' | 'Enrolled';
  submissionDate: string;
  documentsStatus: {
    marksheet12th: boolean;
    entranceScorecard: boolean;
    identityProof: boolean;
    migrationCertificate: boolean;
  };
}

export interface ExamScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  date: string;
  timeSlot: string;
  examHall: string;
  seatNumber: string;
  invigilator: string;
  admitCardEligible: boolean;
}

export interface GradeEntry {
  courseCode: string;
  courseName: string;
  credits: number;
  gradeEarned: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'F';
  gradePoints: number;
}

export interface ParentMessage {
  id: string;
  senderName: string;
  senderRole: 'parent' | 'faculty' | 'admin';
  recipientName: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface StudentServiceRequest {
  id: string;
  serviceType: 'Library Book Reservation' | 'Digital ID Replacement' | 'No Objection Certificate (NOC)' | 'Bonafide for Passport' | 'Sports Arena Pass';
  requestDate: string;
  status: 'Approved' | 'Processing' | 'Ready for Pickup';
  tokenNumber: string;
  remarks: string;
}
