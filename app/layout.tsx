import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoSeeder from '@/components/DemoSeeder';

export const metadata: Metadata = {
  title: 'Interview Tracker — Canadian Hiring Progress Tracker',
  description: 'Free, anonymous, community-powered hiring progress tracker for Canadian job seekers. See whether assessments, interviews, or offers have started for specific postings.',
  keywords: 'interview tracker, Canada, hiring tracker, CPA, recruitment, Deloitte, EY, KPMG, PwC, TD Bank, RBC, offer, interview',
  openGraph: {
    title: 'Interview Tracker',
    description: 'Track Canadian hiring stages anonymously. See interview and offer timelines for specific job postings.',
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
