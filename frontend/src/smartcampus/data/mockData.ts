import {
  UserProfile,
  StudentRecord,
  SubjectAttendance,
  TimetableSlot,
  Grievance,
  FeeItem,
  CertificateItem,
  CampusAlert,
  AIChatMessage,
  AdmissionApplication,
  ExamScheduleItem,
  GradeEntry,
  ParentMessage,
  StudentServiceRequest
} from '../types';

export const USER_PROFILES: Record<string, UserProfile> = {
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. S. K. Mahapatra',
    role: 'admin',
    email: 'registrar@smartcampus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    title: 'Dean of Academic Governance & Registrar',
    department: 'Central Administration',
    phone: '+91 98765 43210'
  },
  faculty: {
    id: 'usr-fac-02',
    name: 'Prof. Priya Raman, Ph.D.',
    role: 'faculty',
    email: 'priya.raman@smartcampus.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    title: 'Head of Department & Professor',
    department: 'Computer Science & Engineering',
    phone: '+91 98111 22334'
  },
  student: {
    id: 'usr-stu-03',
    name: 'Aarav Sharma',
    role: 'student',
    email: 'aarav.sharma22@smartcampus.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    title: 'B.Tech CSE - 6th Semester',
    department: 'Computer Science & Engineering',
    rollNumber: 'CS2022-048',
    semester: 6,
    phone: '+91 99887 76655',
    guardianName: 'Manoj Sharma',
    guardianPhone: '+91 94123 56789',
    hostelBlock: 'Aryabhata Hall - Block B',
    roomNumber: 'B-304',
    busRoute: 'Campus Shuttle #4 (South City Express)'
  },
  parent: {
    id: 'usr-par-04',
    name: 'Manoj Sharma',
    role: 'parent',
    email: 'm.sharma.consult@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    title: 'Parent / Guardian of Aarav Sharma (CS2022-048)',
    department: 'Parent-Teacher Council',
    phone: '+91 94123 56789'
  }
};

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'stu-1',
    rollNo: 'CS2022-048',
    name: 'Aarav Sharma',
    branch: 'Computer Science & Engg',
    semester: 6,
    cgpa: 8.84,
    creditsCompleted: 132,
    totalCredits: 160,
    overallAttendance: 82.5,
    feeStatus: 'Paid',
    pendingDues: 0,
    hostelResident: true,
    hostelRoom: 'Aryabhata Block B-304',
    busRoute: 'Route 4 (South City)',
    email: 'aarav.sharma22@smartcampus.edu',
    phone: '+91 99887 76655',
    status: 'Active',
    backlogs: 0,
    riskScore: 'Low'
  },
  {
    id: 'stu-2',
    rollNo: 'CS2022-012',
    name: 'Ananya Deshmukh',
    branch: 'Computer Science & Engg',
    semester: 6,
    cgpa: 9.42,
    creditsCompleted: 134,
    totalCredits: 160,
    overallAttendance: 91.2,
    feeStatus: 'Paid',
    pendingDues: 0,
    hostelResident: true,
    hostelRoom: 'Gargi Hall A-102',
    email: 'ananya.d@smartcampus.edu',
    phone: '+91 98765 11223',
    status: 'Active',
    backlogs: 0,
    riskScore: 'Low'
  },
  {
    id: 'stu-3',
    rollNo: 'CS2022-089',
    name: 'Rohan Varma',
    branch: 'Computer Science & Engg',
    semester: 6,
    cgpa: 7.15,
    creditsCompleted: 118,
    totalCredits: 160,
    overallAttendance: 68.4,
    feeStatus: 'Partial',
    pendingDues: 25000,
    hostelResident: false,
    busRoute: 'Route 11 (Indira Nagar Metro)',
    email: 'rohan.v@smartcampus.edu',
    phone: '+91 91234 56780',
    status: 'Active',
    backlogs: 1,
    riskScore: 'Medium'
  },
  {
    id: 'stu-4',
    rollNo: 'AI2023-005',
    name: 'Meera Krishnan',
    branch: 'Artificial Intelligence & DS',
    semester: 4,
    cgpa: 9.12,
    creditsCompleted: 88,
    totalCredits: 160,
    overallAttendance: 89.0,
    feeStatus: 'Paid',
    pendingDues: 0,
    hostelResident: true,
    hostelRoom: 'Maitreyi Hall C-214',
    email: 'meera.k@smartcampus.edu',
    phone: '+91 94567 89012',
    status: 'Active',
    backlogs: 0,
    riskScore: 'Low'
  },
  {
    id: 'stu-5',
    rollNo: 'EC2022-031',
    name: 'Devansh Singhania',
    branch: 'Electronics & Comm. Engg',
    semester: 6,
    cgpa: 6.95,
    creditsCompleted: 112,
    totalCredits: 160,
    overallAttendance: 64.2,
    feeStatus: 'Overdue',
    pendingDues: 72000,
    hostelResident: true,
    hostelRoom: 'Bose Hall D-401',
    email: 'devansh.s@smartcampus.edu',
    phone: '+91 93214 56789',
    status: 'Detained',
    backlogs: 2,
    riskScore: 'High'
  },
  {
    id: 'stu-6',
    rollNo: 'ME2021-020',
    name: 'Tanvi Agarwal',
    branch: 'Mechanical Engineering',
    semester: 8,
    cgpa: 8.35,
    creditsCompleted: 154,
    totalCredits: 160,
    overallAttendance: 79.5,
    feeStatus: 'Paid',
    pendingDues: 0,
    hostelResident: false,
    busRoute: 'Route 2 (Green Valley)',
    email: 'tanvi.a@smartcampus.edu',
    phone: '+91 97654 32109',
    status: 'Active',
    backlogs: 0,
    riskScore: 'Low'
  }
];

export const INITIAL_ATTENDANCE: SubjectAttendance[] = [
  {
    code: 'CS601',
    name: 'Distributed Cloud Architecture & Microservices',
    faculty: 'Prof. Priya Raman',
    totalClasses: 42,
    attendedClasses: 36,
    percentage: 85.7,
    status: 'Healthy',
    classesNeededFor75: 0,
    lastUpdated: 'Today, 10:30 AM'
  },
  {
    code: 'CS602',
    name: 'Machine Learning & Neural Foundations',
    faculty: 'Dr. Vivek Bhattacharya',
    totalClasses: 40,
    attendedClasses: 33,
    percentage: 82.5,
    status: 'Healthy',
    classesNeededFor75: 0,
    lastUpdated: 'Yesterday, 02:15 PM'
  },
  {
    code: 'CS603',
    name: 'Compiler Design & Optimization',
    faculty: 'Prof. Anupama Nair',
    totalClasses: 38,
    attendedClasses: 27,
    percentage: 71.1,
    status: 'Critical',
    classesNeededFor75: 6,
    lastUpdated: 'Oct 01, 11:45 AM'
  },
  {
    code: 'CS604',
    name: 'Cybersecurity, Cryptography & PKI',
    faculty: 'Dr. Arvind Swaminathan',
    totalClasses: 36,
    attendedClasses: 29,
    percentage: 80.6,
    status: 'Healthy',
    classesNeededFor75: 0,
    lastUpdated: 'Sep 30, 03:30 PM'
  },
  {
    code: 'CS605P',
    name: 'Cloud Native Computing Lab',
    faculty: 'Prof. Priya Raman / Er. Sameer',
    totalClasses: 14,
    attendedClasses: 13,
    percentage: 92.8,
    status: 'Healthy',
    classesNeededFor75: 0,
    lastUpdated: 'Oct 01, 04:00 PM'
  }
];

export const TIMETABLE_DATA: TimetableSlot[] = [
  {
    id: 'tt-1',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    subjectCode: 'CS601',
    subjectName: 'Distributed Cloud Architecture',
    room: 'Hall LH-301',
    faculty: 'Prof. Priya Raman',
    type: 'Lecture'
  },
  {
    id: 'tt-2',
    day: 'Monday',
    startTime: '10:15 AM',
    endTime: '11:15 AM',
    subjectCode: 'CS602',
    subjectName: 'Machine Learning Foundations',
    room: 'Hall LH-301',
    faculty: 'Dr. Vivek Bhattacharya',
    type: 'Lecture'
  },
  {
    id: 'tt-3',
    day: 'Monday',
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    subjectCode: 'CS605P',
    subjectName: 'Cloud Native Computing Lab (Batch A)',
    room: 'Advanced Software Lab-4',
    faculty: 'Prof. Priya Raman / Er. Sameer',
    type: 'Lab'
  },
  {
    id: 'tt-4',
    day: 'Tuesday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    subjectCode: 'CS603',
    subjectName: 'Compiler Design & Optimization',
    room: 'Hall LH-204',
    faculty: 'Prof. Anupama Nair',
    type: 'Lecture'
  },
  {
    id: 'tt-5',
    day: 'Tuesday',
    startTime: '10:15 AM',
    endTime: '11:15 AM',
    subjectCode: 'CS604',
    subjectName: 'Cybersecurity & Cryptography',
    room: 'Hall LH-204',
    faculty: 'Dr. Arvind Swaminathan',
    type: 'Lecture'
  },
  {
    id: 'tt-6',
    day: 'Wednesday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    subjectCode: 'CS601',
    subjectName: 'Distributed Cloud Architecture',
    room: 'Hall LH-301',
    faculty: 'Prof. Priya Raman',
    type: 'Lecture',
    isCurrent: true
  },
  {
    id: 'tt-7',
    day: 'Wednesday',
    startTime: '10:15 AM',
    endTime: '11:15 AM',
    subjectCode: 'CS603',
    subjectName: 'Compiler Design (Tutorial)',
    room: 'Seminar Room SR-02',
    faculty: 'Prof. Anupama Nair',
    type: 'Tutorial'
  },
  {
    id: 'tt-8',
    day: 'Thursday',
    startTime: '11:30 AM',
    endTime: '01:30 PM',
    subjectCode: 'CS602P',
    subjectName: 'AI & Machine Learning Lab',
    room: 'High-Performance Computing Lab',
    faculty: 'Dr. Vivek Bhattacharya',
    type: 'Lab'
  },
  {
    id: 'tt-9',
    day: 'Friday',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    subjectCode: 'OPEN609',
    subjectName: 'Entrepreneurship & Tech Incubation',
    room: 'Auditorium Audi-2',
    faculty: 'Guest Industry Fellow',
    type: 'Lecture'
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'grv-101',
    trackingNumber: 'GRV-2026-0842',
    title: 'High-Speed Wi-Fi Disruption on Aryabhata Hall 3rd Floor',
    category: 'Hostel & Mess',
    priority: 'Urgent',
    status: 'Investigating',
    submittedBy: 'Aarav Sharma (CS2022-048)',
    userRole: 'student',
    department: 'IT & Network Operations',
    description: 'The Wi-Fi access point in Block B corridor 3rd floor drops connection every 5 minutes during evening study hours.',
    submittedAt: 'Today, 08:30 AM',
    slaTargetHours: 24,
    hoursElapsed: 8,
    resolutionNotes: 'Network engineers dispatched; router switch port firmware update scheduled at 6:00 PM.'
  },
  {
    id: 'grv-102',
    trackingNumber: 'GRV-2026-0819',
    title: 'Discrepancy in Mid-Term Internal Marks for Compiler Design',
    category: 'Academic',
    priority: 'High',
    status: 'Under Review',
    submittedBy: 'Aarav Sharma (CS2022-048)',
    userRole: 'student',
    department: 'CSE Academic Cell',
    description: 'Marks for Assignment 2 were missing from the ERP portal grade calculation table.',
    submittedAt: 'Yesterday, 03:15 PM',
    slaTargetHours: 48,
    hoursElapsed: 26,
    resolutionNotes: 'Forwarded to Prof. Anupama Nair for grade verification against lab ledger.'
  },
  {
    id: 'grv-103',
    trackingNumber: 'GRV-2026-0790',
    title: 'AC temperature control calibration in LH-301 lecture hall',
    category: 'Infrastructure',
    priority: 'Medium',
    status: 'Resolved',
    submittedBy: 'Prof. Priya Raman',
    userRole: 'faculty',
    department: 'Estate & Campus Maintenance',
    description: 'Thermostat in LH-301 was stuck at 18 degrees Celsius causing discomfort.',
    submittedAt: 'Sep 28, 11:00 AM',
    slaTargetHours: 48,
    hoursElapsed: 36,
    resolutionNotes: 'Thermostat sensor replaced and recalibrated to 23 degrees Celsius.'
  }
];

export const INITIAL_FEES: FeeItem[] = [
  {
    id: 'fee-1',
    title: 'Academic Tuition Fee - Spring 2026',
    category: 'Tuition',
    amount: 65000,
    dueDate: '2026-10-15',
    status: 'Paid',
    semester: '6th Semester (B.Tech)',
    receiptNumber: 'RCP-2026-09412',
    paidDate: '2026-09-10'
  },
  {
    id: 'fee-2',
    title: 'Hostel Accommodation (Single Occupancy AC)',
    category: 'Hostel',
    amount: 28000,
    dueDate: '2026-10-15',
    status: 'Paid',
    semester: 'Spring 2026',
    receiptNumber: 'RCP-2026-09413',
    paidDate: '2026-09-10'
  },
  {
    id: 'fee-3',
    title: 'Dining & Mess Subscription (Semester 6)',
    category: 'Mess',
    amount: 18500,
    dueDate: '2026-10-15',
    status: 'Paid',
    semester: 'Spring 2026',
    receiptNumber: 'RCP-2026-09414',
    paidDate: '2026-09-10'
  },
  {
    id: 'fee-4',
    title: 'End-Term University Examination & Assessment Fee',
    category: 'Exam',
    amount: 3500,
    dueDate: '2026-10-25',
    status: 'Pending',
    semester: '6th Semester (B.Tech)'
  },
  {
    id: 'fee-5',
    title: 'Specialized Cloud Computing Lab Consumables',
    category: 'Development',
    amount: 2000,
    dueDate: '2026-10-30',
    status: 'Pending',
    semester: '6th Semester (B.Tech)'
  }
];

export const INITIAL_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Institutional Bona Fide Certificate',
    type: 'Bona Fide Certificate',
    issueDate: '2026-09-15',
    status: 'Ready',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    issuedTo: 'Aarav Sharma',
    rollNo: 'CS2022-048',
    validity: 'Valid Academic Year 2025-2026'
  },
  {
    id: 'cert-2',
    title: 'Official Grade Transcript (Semesters 1-5 Cumulative)',
    type: 'Grade Transcript',
    issueDate: '2026-08-20',
    status: 'Ready',
    sha256Hash: 'a7c92b45e9821d3f9823485fae45902187b452093481239c49d8548943829410',
    issuedTo: 'Aarav Sharma',
    rollNo: 'CS2022-048',
    validity: 'Permanent Credential (CGPA 8.84)'
  },
  {
    id: 'cert-3',
    title: 'Hostel No Dues & Clearance Certificate',
    type: 'No Dues Certificate',
    issueDate: '2026-09-30',
    status: 'In Process',
    sha256Hash: 'Pending Verification Sign-off',
    issuedTo: 'Aarav Sharma',
    rollNo: 'CS2022-048',
    validity: 'Under Warden Review'
  }
];

export const CAMPUS_ALERTS: CampusAlert[] = [
  {
    id: 'alt-1',
    title: 'Mandatory 75% Attendance Compliance Notice',
    description: 'All departments have finalized attendance cutoff for Mid-Term evaluations. Students below 75% must meet Faculty Advisors before Oct 10.',
    severity: 'warning',
    timestamp: 'Today, 09:00 AM',
    targetRole: 'all',
    active: true
  },
  {
    id: 'alt-2',
    title: 'End-Term Exam Hall Ticket Generation Active',
    description: 'Hall tickets for November 2026 theory exams are available for verified students with nil fee balance.',
    severity: 'info',
    timestamp: 'Yesterday, 04:30 PM',
    targetRole: 'students',
    active: true
  },
  {
    id: 'alt-3',
    title: 'Campus Weather Advisory & Evening Bus Fleet Scheduling',
    description: 'All 14 city commuter transit routes will operate on priority rain schedule departing strictly at 5:15 PM from Gate 2.',
    severity: 'info',
    timestamp: 'Today, 01:15 PM',
    targetRole: 'all',
    active: true
  }
];

export const INITIAL_CHAT_MESSAGES: AIChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'assistant',
    text: "Hello Aarav! I am your SMARTCAMPUS AI Copilot. I can assist you with admissions, attendance rules, fee deadlines, timetable queries, exam hall tickets, or parent-faculty messaging. How can I help you today?",
    timestamp: '10:00 AM'
  }
];

// ================= PHASE 2 EXTENDED MOCK DATA =================

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'adm-01',
    applicationNumber: 'APP-2026-8812',
    applicantName: 'Vikramaditya Sengupta',
    email: 'vikram.sen@gmail.com',
    phone: '+91 98301 22334',
    program: 'B.Tech Undergrad',
    branchPreference: 'Computer Science & Engineering',
    entranceExamScore: 98.4,
    meritRank: 42,
    status: 'Seat Allotted',
    submissionDate: '2026-09-22',
    documentsStatus: {
      marksheet12th: true,
      entranceScorecard: true,
      identityProof: true,
      migrationCertificate: true
    }
  },
  {
    id: 'adm-02',
    applicationNumber: 'APP-2026-8845',
    applicantName: 'Sneha Kulkarni',
    email: 'sneha.k@outlook.com',
    phone: '+91 97204 55667',
    program: 'B.Tech Undergrad',
    branchPreference: 'Artificial Intelligence & Data Science',
    entranceExamScore: 96.1,
    meritRank: 118,
    status: 'Document Verified',
    submissionDate: '2026-09-24',
    documentsStatus: {
      marksheet12th: true,
      entranceScorecard: true,
      identityProof: true,
      migrationCertificate: false
    }
  },
  {
    id: 'adm-03',
    applicationNumber: 'APP-2026-8902',
    applicantName: 'Kabir Oberoi',
    email: 'kabir.o@gmail.com',
    phone: '+91 99105 88990',
    program: 'B.Tech Undergrad',
    branchPreference: 'Electronics & Comm. Engg',
    entranceExamScore: 91.8,
    meritRank: 310,
    status: 'Fee Paid',
    submissionDate: '2026-09-20',
    documentsStatus: {
      marksheet12th: true,
      entranceScorecard: true,
      identityProof: true,
      migrationCertificate: true
    }
  },
  {
    id: 'adm-04',
    applicationNumber: 'APP-2026-9014',
    applicantName: 'Ritika Bannerjee',
    email: 'ritika.b@yahoo.com',
    phone: '+91 98450 11223',
    program: 'M.Tech Postgraduate',
    branchPreference: 'Cybersecurity & Cloud Computing',
    entranceExamScore: 99.1,
    meritRank: 15,
    status: 'Enrolled',
    submissionDate: '2026-09-18',
    documentsStatus: {
      marksheet12th: true,
      entranceScorecard: true,
      identityProof: true,
      migrationCertificate: true
    }
  }
];

export const INITIAL_EXAM_SCHEDULE: ExamScheduleItem[] = [
  {
    id: 'ex-1',
    courseCode: 'CS601',
    courseName: 'Distributed Cloud Architecture & Microservices',
    date: '2026-11-16',
    timeSlot: '10:00 AM - 01:00 PM',
    examHall: 'Examination Complex Block C - Room 302',
    seatNumber: 'C302-Desk-24',
    invigilator: 'Dr. Vivek Bhattacharya',
    admitCardEligible: true
  },
  {
    id: 'ex-2',
    courseCode: 'CS602',
    courseName: 'Machine Learning & Neural Foundations',
    date: '2026-11-19',
    timeSlot: '10:00 AM - 01:00 PM',
    examHall: 'Examination Complex Block C - Room 302',
    seatNumber: 'C302-Desk-24',
    invigilator: 'Prof. Anupama Nair',
    admitCardEligible: true
  },
  {
    id: 'ex-3',
    courseCode: 'CS603',
    courseName: 'Compiler Design & Optimization',
    date: '2026-11-23',
    timeSlot: '02:00 PM - 05:00 PM',
    examHall: 'Main Academic Hall LH-101',
    seatNumber: 'LH1-Desk-89',
    invigilator: 'Prof. Priya Raman',
    admitCardEligible: false // Due to attendance 71.1%
  },
  {
    id: 'ex-4',
    courseCode: 'CS604',
    courseName: 'Cybersecurity, Cryptography & PKI',
    date: '2026-11-26',
    timeSlot: '10:00 AM - 01:00 PM',
    examHall: 'Examination Complex Block C - Room 302',
    seatNumber: 'C302-Desk-24',
    invigilator: 'Dr. Arvind Swaminathan',
    admitCardEligible: true
  }
];

export const INITIAL_GRADES: GradeEntry[] = [
  { courseCode: 'CS501', courseName: 'Advanced Operating Systems', credits: 4, gradeEarned: 'A+', gradePoints: 10 },
  { courseCode: 'CS502', courseName: 'Database Internals & Storage Engines', credits: 4, gradeEarned: 'A', gradePoints: 9 },
  { courseCode: 'CS503', courseName: 'Computer Networks & Socket Programming', credits: 4, gradeEarned: 'A', gradePoints: 9 },
  { courseCode: 'CS504', courseName: 'Software Engineering & Agile Ops', credits: 3, gradeEarned: 'B+', gradePoints: 8 },
  { courseCode: 'CS505P', courseName: 'System Programming Lab', credits: 2, gradeEarned: 'A+', gradePoints: 10 }
];

export const INITIAL_PARENT_MESSAGES: ParentMessage[] = [
  {
    id: 'pm-1',
    senderName: 'Prof. Priya Raman (HOD CSE)',
    senderRole: 'faculty',
    recipientName: 'Manoj Sharma (Parent)',
    subject: 'Academic Performance & Mid-Term Attendance Update for Aarav',
    message: 'Dear Mr. Sharma, Aarav is excelling in Distributed Cloud Architecture (8.84 CGPA). However, his Compiler Design attendance is at 71.1%. Please advise him to attend the remedial sessions before Oct 10 to ensure exam eligibility.',
    timestamp: 'Today, 11:20 AM',
    read: false
  },
  {
    id: 'pm-2',
    senderName: 'Manoj Sharma (Parent)',
    senderRole: 'parent',
    recipientName: 'Prof. Priya Raman (HOD CSE)',
    subject: 'Re: Attendance Remedial Sessions',
    message: 'Thank you Dr. Raman. I have spoken to Aarav and he has committed to attending the extra tutorial sessions with Prof. Nair this week.',
    timestamp: 'Today, 01:45 PM',
    read: true
  },
  {
    id: 'pm-3',
    senderName: 'Central Registrar Office',
    senderRole: 'admin',
    recipientName: 'All Parents',
    subject: 'Parent-Teacher Council & Campus Open House Announcement',
    message: 'The Annual Autonomous University Parent-Faculty Dialogue will convene on Saturday, Oct 24 in the Main Auditorium at 10:00 AM.',
    timestamp: 'Yesterday, 05:00 PM',
    read: true
  }
];

export const INITIAL_SERVICE_REQUESTS: StudentServiceRequest[] = [
  {
    id: 'req-01',
    serviceType: 'Library Book Reservation',
    requestDate: '2026-10-01',
    status: 'Ready for Pickup',
    tokenNumber: 'LIB-RES-2490',
    remarks: 'Designing Data-Intensive Applications by Martin Kleppmann (Desk 4 Reserve Shelf)'
  },
  {
    id: 'req-02',
    serviceType: 'No Objection Certificate (NOC)',
    requestDate: '2026-09-28',
    status: 'Approved',
    tokenNumber: 'NOC-2026-4412',
    remarks: 'Approved for Google Summer of Code / Microsoft Research Internship'
  },
  {
    id: 'req-03',
    serviceType: 'Sports Arena Pass',
    requestDate: '2026-09-25',
    status: 'Approved',
    tokenNumber: 'SPT-ARENA-902',
    remarks: 'Badminton Indoor Stadium (Slot: 6:00 PM - 7:30 PM)'
  }
];
