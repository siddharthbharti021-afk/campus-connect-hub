"use client";
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { StudentRecordsModule } from './components/modules/StudentRecordsModule';
import { SmartAttendanceModule } from './components/modules/SmartAttendanceModule';
import { TimetableModule } from './components/modules/TimetableModule';
import { GrievancesModule } from './components/modules/GrievancesModule';
import { FeesModule } from './components/modules/FeesModule';
import { CertificatesModule } from './components/modules/CertificatesModule';
import { HostelTransportModule } from './components/modules/HostelTransportModule';
import { AICampusAssistant } from './components/modules/AICampusAssistant';
import { AdmissionsModule } from './components/modules/AdmissionsModule';
import { ExaminationsModule } from './components/modules/ExaminationsModule';
import { ParentCommunicationModule } from './components/modules/ParentCommunicationModule';
import { StudentServicesModule } from './components/modules/StudentServicesModule';
import { Modal } from './components/common/Modal';

export const AppContent: React.FC = () => {
  const { activeTab, isAssistantOpen, toggleAssistant } = useApp();

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ExecutiveDashboard />;
      case 'admissions':
        return <AdmissionsModule />;
      case 'students':
        return <StudentRecordsModule />;
      case 'attendance':
        return <SmartAttendanceModule />;
      case 'examinations':
        return <ExaminationsModule />;
      case 'timetable':
        return <TimetableModule />;
      case 'parent-comm':
        return <ParentCommunicationModule />;
      case 'services':
        return <StudentServicesModule />;
      case 'grievances':
        return <GrievancesModule />;
      case 'fees':
        return <FeesModule />;
      case 'certificates':
        return <CertificatesModule />;
      case 'hostel':
        return <HostelTransportModule />;
      case 'ai-assistant':
        return <AICampusAssistant />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Workspace Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderModule()}
        </main>
      </div>

      {/* Floating AI Campus Copilot Drawer Modal */}
      <Modal
        isOpen={isAssistantOpen}
        onClose={toggleAssistant}
        title="SmartCampus AI Assistant"
        subtitle="Live conversational assistant for rules, timetable, fees, and grievances"
        maxWidth="xl"
      >
        <AICampusAssistant />
      </Modal>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

