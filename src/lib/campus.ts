import { BookOpen, CalendarDays, ClipboardCheck, CreditCard, FileBadge, BedDouble, Bus, MessageSquare, type LucideIcon } from 'lucide-react';

export type Service = { id: string; name: string; description: string; icon: LucideIcon; tone: string; action: string; category: string };
export const services: Service[] = [
  { id: 'attendance', name: 'Attendance', description: 'Every class counts.', icon: ClipboardCheck, tone: 'mint', action: 'View attendance', category: 'Academic' },
  { id: 'timetable', name: 'My timetable', description: 'Make room for what’s next.', icon: CalendarDays, tone: 'lavender', action: 'View schedule', category: 'Academic' },
  { id: 'fees', name: 'Fees & payments', description: 'One less thing on your mind.', icon: CreditCard, tone: 'peach', action: 'View fee details', category: 'Finance' },
  { id: 'certificates', name: 'Digital certificates', description: 'Your milestones, made official.', icon: FileBadge, tone: 'sky', action: 'Request certificate', category: 'Certificates' },
  { id: 'academics', name: 'Academic records', description: 'Your progress, all in one place.', icon: BookOpen, tone: 'rose', action: 'View records', category: 'Academic' },
  { id: 'hostel', name: 'Hostel & living', description: 'A little more like home.', icon: BedDouble, tone: 'yellow', action: 'Hostel services', category: 'Hostel' },
  { id: 'transport', name: 'Campus transport', description: 'Your next stop starts here.', icon: Bus, tone: 'mint', action: 'Transport services', category: 'Transport' },
  { id: 'grievances', name: 'Help & grievances', description: 'We’re here to hear you.', icon: MessageSquare, tone: 'lavender', action: 'Raise a concern', category: 'Grievance' },
];
export function campusHead(title: string, description: string) {
  return { meta: [{ title: `${title} · Campusly` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} · Campusly` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] };
}