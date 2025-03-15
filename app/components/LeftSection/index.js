'use client';

import GreetingSection from './GreetingSection';
import SearchSection from './SearchSection';
import QuickLinks from './QuickLinks';
import QuoteSection from './QuoteSection';
import GoalSection from './GoalSection';
import FinanceSection from './FinanceSection';
import Weather from './Weather';
import { useContextApi } from '../../contexts/contextApi';
import localFont from 'next/font/local';
import { useEffect } from 'react';


const myFont = localFont({
    src: '../../public/assets/Fonts/FORTE.ttf',
});

export default function LeftSection() {
    const setFont = useContextApi((state) => state.setFont);

    useEffect(() => {
        setFont(myFont.className);
    }, [setFont]);

    return (
        <div className="left-section">
            <GreetingSection myFont={myFont} />
            <Weather />
            <SearchSection />
            <QuickLinks />
            <QuoteSection />
            <GoalSection />
            <FinanceSection />
        </div>
    );
} 