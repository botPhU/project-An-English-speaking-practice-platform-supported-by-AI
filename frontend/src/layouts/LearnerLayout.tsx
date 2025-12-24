import type { ReactNode } from 'react';

interface LearnerLayoutProps {
    children: ReactNode;
}

export default function LearnerLayout({ children }: LearnerLayoutProps) {
    return (
        <div className="learner-layout">
            {/* Header với navigation */}
            <header className="header">
                {/* Logo, menu, user profile */}
            </header>

            {/* Main content */}
            <main className="main-content">
                {children}
            </main>

            {/* Footer */}
            <footer className="footer">
                {/* Footer content */}
            </footer>
        </div>
    );
}
