import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENTOR_ROUTES } from '../../routes/paths';

interface NavItem {
    path: string;
    icon: string;
    label: string;
}

const navItems: NavItem[] = [
    { path: MENTOR_ROUTES.DASHBOARD, icon: 'dashboard', label: 'Tổng quan' },
    { path: MENTOR_ROUTES.LEARNER_ASSESSMENT, icon: 'assessment', label: 'Đánh giá học viên' },
    { path: MENTOR_ROUTES.REAL_LIFE_SITUATIONS, icon: 'theater_comedy', label: 'Tình huống thực tế' },
    { path: MENTOR_ROUTES.CONVERSATION_TOPICS, icon: 'forum', label: 'Chủ đề hội thoại' },
    { path: MENTOR_ROUTES.FEEDBACK_SESSION, icon: 'rate_review', label: 'Phản hồi & Sửa lỗi' },
    { path: MENTOR_ROUTES.PRONUNCIATION_ERRORS, icon: 'record_voice_over', label: 'Lỗi phát âm' },
    { path: MENTOR_ROUTES.GRAMMAR_ERRORS, icon: 'spellcheck', label: 'Lỗi ngữ pháp' },
    { path: MENTOR_ROUTES.COLLOCATIONS_IDIOMS, icon: 'library_books', label: 'Collocations & Idioms' },
    { path: MENTOR_ROUTES.WORD_USAGE, icon: 'edit_note', label: 'Cách dùng từ' },
    { path: MENTOR_ROUTES.CLEAR_EXPRESSION, icon: 'psychology', label: 'Diễn đạt rõ ràng' },
    { path: MENTOR_ROUTES.BUILD_CONFIDENCE, icon: 'emoji_events', label: 'Xây dựng tự tin' },
    { path: MENTOR_ROUTES.EXPERIENCE_SHARING, icon: 'tips_and_updates', label: 'Chia sẻ kinh nghiệm' },
    { path: MENTOR_ROUTES.RESOURCES, icon: 'folder_open', label: 'Tài liệu' },
];

const MentorSidebar: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === MENTOR_ROUTES.DASHBOARD) {
            return location.pathname === path || location.pathname === '/mentor/';
        }
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="hidden md:flex flex-col w-64 bg-[#111418] border-r border-[#283039] h-full shrink-0">
            <div className="flex flex-col h-full p-4">
                {/* Logo & Brand */}
                <div className="flex gap-3 mb-8 items-center">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border border-[#283039] flex items-center justify-center bg-primary/20"
                    >
                        <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <h1 className="text-white text-base font-medium leading-normal truncate">
                            AESP Mentor
                        </h1>
                        <p className="text-[#9dabb9] text-xs font-normal leading-normal truncate">
                            Cố vấn học tập
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive(item.path)
                                ? 'bg-primary/20 text-primary border border-primary/10'
                                : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {item.icon}
                            </span>
                            <span className="text-sm font-medium leading-normal truncate">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="mt-auto pt-4 border-t border-[#283039]">
                    {/* Profile Link */}
                    <Link
                        to={MENTOR_ROUTES.PROFILE}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(MENTOR_ROUTES.PROFILE)
                                ? 'bg-primary/20 text-primary border border-primary/10'
                                : 'text-[#9dabb9] hover:bg-[#283039] hover:text-white'
                            }`}
                    >
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 border-2 border-[#283039]"
                            style={{
                                backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=Mentor")'
                            }}
                        />
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-white text-sm font-medium truncate">Mentor Tuấn</p>
                            <p className="text-[#9dabb9] text-xs truncate">Chuyên gia IELTS</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MentorSidebar;
