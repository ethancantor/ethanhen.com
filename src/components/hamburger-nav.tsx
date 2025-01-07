'use client';

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HamburgerNav() {

    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const { data: session } = useSession();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && menuRef.current && !buttonRef.current.contains(event.target as Node) && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [buttonRef, menuRef]);

    const navItems = [
        { label: 'home', href: '/' },
        { label: 'gallery', href: '/gallery' }
    ];

    if(session) navItems.push({ label: 'file upload', href: '/fileupload' });

    return (
        <div ref={menuRef} className="absolute top-3 left-3 flex flex-col pointer-events-none">
            <div className="w-fit h-fit cursor-pointer pointer-events-auto" ref={buttonRef} onClick={() => setIsOpen(!isOpen)} >
                <HamburgerMenuIcon className="w-8 h-8"  />
            </div>
            <div className={`w-fit h-fit backdrop-blur-lg flex flex-col gap-1 md:gap-2 lg:gap-3 px-1 py-1 sm:px-2 md:py-2 lg:px-3 lg:py-3 text-base sm:text-lg md:text-xl lg:text-2xl
                rounded-lg ${isOpen ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-[100%] pointer-events-none'} transition-all duration-300 ease-in-out`}>
                { navItems.map((item, index) => 
                    <Link href={item.href} key={index}>{item.label}</Link>
                )}
            </div>
        </div>
    )
};
