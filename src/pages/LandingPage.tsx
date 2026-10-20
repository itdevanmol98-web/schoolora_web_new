import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppSelector';
import { PATHS } from '@/routes/paths';

// Landing Page Layout & Sections
import { Header } from '@/components/landing/layout/Header';
import { Footer } from '@/components/landing/layout/Footer';
import { Hero } from '@/components/landing/sections/Hero';
import { TrustBar } from '@/components/landing/sections/TrustBar';
import { Statistics } from '@/components/landing/sections/Statistics';
import { FeatureExplorer } from '@/components/landing/sections/FeatureExplorer';
import { AppsEcosystem } from '@/components/landing/sections/AppsEcosystem';
import { SchoolChallenges } from '@/components/landing/sections/SchoolChallenges';
import { DashboardShowcase } from '@/components/landing/sections/DashboardShowcase';
import { RoleDashboards } from '@/components/landing/sections/RoleDashboards';
import { AIAssistant } from '@/components/landing/sections/AIAssistant';
import { Security } from '@/components/landing/sections/Security';
import { Testimonials } from '@/components/landing/sections/Testimonials';
import { Achievements } from '@/components/landing/sections/Achievements';
import { Integrations } from '@/components/landing/sections/Integrations';
import { KnowledgeHub } from '@/components/landing/sections/KnowledgeHub';
import { Pricing } from '@/components/landing/sections/Pricing';
import { FinalCTA } from '@/components/landing/sections/FinalCTA';

// Landing Page UI & Modals
import { DemoModal } from '@/components/landing/ui/DemoModal';
import { SearchModal } from '@/components/landing/ui/SearchModal';
import { FloatingWidgets } from '@/components/landing/ui/FloatingWidgets';

// Scoped Landing Styles
import '@/styles/landingPage.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const handleNavigateToDashboard = () => {
    navigate(PATHS.ADMIN_DASHBOARD);
  };

  const handleOpenLogin = () => {
    navigate(PATHS.LOGIN);
  };

  const handleExploreModules = () => {
    const modulesEl = document.getElementById('modules') || document.getElementById('features');
    if (modulesEl) {
      modulesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="public-landing-root">
      {/* 1. Header & Navigation */}
      <Header
        onOpenDemoModal={() => setDemoModalOpen(true)}
        onOpenLoginModal={handleOpenLogin}
        onOpenSearchModal={() => setSearchModalOpen(true)}
        isLoggedIn={isAuthenticated}
        onNavigateToDashboard={handleNavigateToDashboard}
      />

      {/* 2. Main Public Content Sections in Prescribed Sequence */}
      <main>
        {/* 2. Hero Section */}
        <Hero
          onBookDemo={() => setDemoModalOpen(true)}
          onExplore={handleExploreModules}
        />

        {/* 3. Trust Bar */}
        <TrustBar />

        {/* 4. Statistics */}
        <Statistics />

        {/* 5. Feature Explorer */}
        <div id="features">
          <FeatureExplorer />
        </div>

        {/* 6. Apps Ecosystem */}
        <div id="apps">
          <AppsEcosystem />
        </div>

        {/* 7. School Challenges & Solutions */}
        <SchoolChallenges />

        {/* 8. Dashboard Showcase */}
        <div id="modules">
          <DashboardShowcase />
        </div>

        {/* 9. Role-based Dashboard Showcase */}
        <RoleDashboards />

        {/* 10. AI Assistant Showcase */}
        <AIAssistant />

        {/* 11. Security & Compliance */}
        <div id="security">
          <Security />
        </div>

        {/* 12. Testimonials */}
        <Testimonials />

        {/* 13. Achievements & Awards */}
        <Achievements />

        {/* 14. Integrations */}
        <div id="integrations">
          <Integrations />
        </div>

        {/* 15. Knowledge Hub */}
        <KnowledgeHub />

        {/* 16. Pricing */}
        <div id="pricing">
          <Pricing />
        </div>

        {/* 17. Final Call to Action */}
        <FinalCTA onBookDemo={() => setDemoModalOpen(true)} />
      </main>

      {/* 18. Footer */}
      <Footer />

      {/* 19. Demo Request Modal */}
      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
      />

      {/* 20. Quick Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectFeature={() => handleExploreModules()}
      />

      {/* 21. Floating AI Chatbot & WhatsApp Quick Contact Widgets */}
      <FloatingWidgets onOpenDemoModal={() => setDemoModalOpen(true)} />
    </div>
  );
};

export default LandingPage;
