import { ReactNode } from 'react';

interface MentorLayoutProps {
    children: ReactNode;
}

export default function MentorLayout({ children }: MentorLayoutProps) {
    return (
        <div className="mentor-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Navigation menu */}
            </aside>

            {/* Main content */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
