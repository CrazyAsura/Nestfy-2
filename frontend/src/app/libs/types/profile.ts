import { Role, UserType, DDI, DDD } from "./enums";

export type Profile = {
    id: number;
    name: string;
    email: string;
    document: string;
    image?: string | null;
    userType?: UserType;
    role?: Role;
    
    // Address fields
    zipCode?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    country?: string;

    // Phone fields
    ddi?: DDI;
    ddd?: DDD;
    numberPhone?: string;

    // Legacy/Calculated fields
    phone?: string;
    address?: string;
}