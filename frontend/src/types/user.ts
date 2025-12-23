// Types cho User (Admin, Learner, Mentor)
export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'learner' | 'mentor';
    isActive: boolean;
    createdAt: Date;
}

export interface Admin extends User {
    role: 'admin';
}

export interface Learner extends User {
    role: 'learner';
    proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
    goals: string[];
    currentPackageId?: string;
    mentorId?: string;
}

export interface Mentor extends User {
    role: 'mentor';
    skills: string[];
    experience: string;
    rating: number;
}
