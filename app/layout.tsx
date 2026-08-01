import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoSeeder from '@/components/DemoSeeder';

export const metadata: Metadata = {
  title: 'Interviewed — Canadian Big Four Hiring Tracker',
  description: 'Anonymous, community-powered hiring progress tracker for Canadian Big Four (Deloitte, EY, KPMG, PwC) internships and new graduate positions. See whether assessments, interviews, or offers have started.',
  keywords: 'Deloitte, EY, KPMG, PwC, hiring tracker, CPA, Canada, recruitment, interview, offer',
  openGraph: {
    title: 'Interviewed — Canadian Big Four Hiring Tracker',
    description: 'Track Big Four hiring stages anonymously. See interview and offer timelines for specific job postings.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DemoSeeder />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
