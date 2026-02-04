// Types cho Service Package
export interface ServicePackage {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // days
    features: string[];
    hasMentor: boolean;
    isActive: boolean;
}

export interface PurchaseHistory {
    id: string;
    learnerId: string;
    packageId: string;
    purchaseDate: Date;
    startDate: Date;
    endDate: Date;
    status: 'active' | 'expired' | 'cancelled';
}
