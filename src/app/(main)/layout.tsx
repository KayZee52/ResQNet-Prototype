import { BottomNavigationBar } from "@/components/layout/bottom-navigation";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ResQNet',
  description: 'Your Safety Network Assistant',
};

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow pb-16"> {/* Padding bottom for the fixed navbar */}
        {children}
      </main>
      <BottomNavigationBar />
    </div>
  );
}
