'use client';
import {
    AiFillYoutube,
    AiFillGithub,
    AiOutlineOpenAI
} from 'react-icons/ai'
import { FaLinkedin } from "react-icons/fa";
import { SiClaude, SiGmail, SiVercel } from "react-icons/si";
import { FaA } from "react-icons/fa6";

export default function QuickLinks() {
    const links = [
        {
            url: 'https://aakashsharma.vercel.app/',
            icon: <FaA className="quick-link-icon" />,
            name: 'Aakash Sharma'
        },
        {
            url: 'https://youtube.com',
            icon: <AiFillYoutube className="quick-link-icon" />,
            name: 'YouTube'
        },
        {
            url: 'https://gmail.com',
            icon: <SiGmail className="quick-link-icon" />,
            name: 'Gmail'
        },
        {
            url: 'https://github.com',
            icon: <AiFillGithub className="quick-link-icon" />,
            name: 'GitHub'
        },
        {
            url: 'https://linkedin.com',
            icon: <FaLinkedin className="quick-link-icon" />,
            name: 'LinkedIn'
        },
        {
            url: 'https://claude.ai/',
            icon: <SiClaude className="quick-link-icon" />,
            name: 'Claude'
        },
        {
            url: 'https://chat.openai.com/',
            icon: <AiOutlineOpenAI className="quick-link-icon" />,
            name: 'ChatGPT'
        },
        {
            url: 'https://vercel.com/',
            icon: <SiVercel className="quick-link-icon" />,
            name: 'Vercel'
        }
    ];

    return (
        <div className="quick-links">
            <h3>Quick Links</h3>
            <div className="links-grid">
                {links.map((link, index) => (
                    <a
                        key={index}
                        href={link.url}
                        className="quick-link"
                        title={link.name}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span className="quick-link-icon-wrapper">
                            {link.icon}
                        </span>
                        <span className="link-tooltip">
                            {link.name}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
} 
