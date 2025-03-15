'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';

export default function SoundControl() {
    const { isMuted, toggleSound } = useAppContext();
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;

        // Set initial volume
        audioRef.current.volume = 0.2;

        // Update sound state based on muted status
        if (isMuted) {
            audioRef.current.pause();
        } else {
            // Ensure volume is set and play
            audioRef.current.volume = 0.2;
            audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }

        // Ensure sound starts playing when user interacts with the page
        const handleFirstInteraction = () => {
            if (!isMuted && audioRef.current) {
                audioRef.current.volume = 0.2;
                audioRef.current.play().catch(e => console.log('Audio play failed:', e));
            }
        };

        document.addEventListener('click', handleFirstInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleFirstInteraction);
        };
    }, [isMuted]);

    return (
        <div className="fixed bottom-4 md:bottom-6 lg:bottom-8 right-4 md:right-6 lg:right-8 z-[1000]">
            <audio ref={audioRef} loop>
                <source src="/sounds/ticking.mp3" type="audio/mpeg" />
            </audio>
            <button
                className="bg-bg-card backdrop-blur-md border border-card shadow-card rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer text-white p-2 md:p-3 transition-all duration-300 hover:bg-white/10 hover:scale-110"
                onClick={toggleSound}
            >
                {isMuted ? (
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M23 9L17 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M17 9L23 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19.07 4.93C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>
        </div>
    );
} 