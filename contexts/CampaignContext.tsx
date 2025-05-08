import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface CampaignContextType {
    currentCampaign: string;
    setCurrentCampaign: (campaign: string) => void;
    clearCampaign: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
    const [currentCampaign, setCurrentCampaignState] = useState<string>('Jesus March 2025 - Miami- new');
    const router = useRouter();

    // Load campaign from localStorage on mount
    useEffect(() => {
        const savedCampaign = localStorage.getItem('currentCampaign');
        if (savedCampaign) {
            setCurrentCampaignState(savedCampaign);
        }
    }, []);

    // Update campaign based on URL changes
    useEffect(() => {
        const path = router.pathname;
        const pathSegments = path.split('/').filter(Boolean);

        if (pathSegments.length > 0) {
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment && lastSegment !== 'index') {
                const formattedTitle = lastSegment
                    .replace(/-/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ');

                // Remove "Event" suffix if present
                const cleanTitle = formattedTitle.replace(/ Event$/i, '');

                // Format like "Jesus March 2025 - City Name"
                const campaignTitle = `Jesus March 2025 - ${cleanTitle}`;
                setCurrentCampaign(campaignTitle);
            }
        }
    }, [router.pathname]);

    const setCurrentCampaign = (campaign: string) => {
        setCurrentCampaignState(campaign);
        localStorage.setItem('currentCampaign', campaign);
    };

    const clearCampaign = () => {
        setCurrentCampaignState('Jesus March 2025 - Miami- new');
        localStorage.removeItem('currentCampaign');
    };

    return (
        <CampaignContext.Provider value={{ currentCampaign, setCurrentCampaign, clearCampaign }}>
            {children}
        </CampaignContext.Provider>
    );
}

export function useCampaign() {
    const context = useContext(CampaignContext);
    if (context === undefined) {
        throw new Error('useCampaign must be used within a CampaignProvider');
    }
    return context;
} 