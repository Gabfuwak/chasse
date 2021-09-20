import Link from 'next/link';
import React from 'react';


export default function AppNavbar() {
    return (
        <RawNavbar>
            <NavElement href="/wc/posts/test-post">
                <div>
                    <p>The official 'Test Post'</p>
                    <p>little description</p>
                </div>
            </NavElement>
        </RawNavbar>
    )
}


interface RawNavbarProps {
    children: React.ReactNode | React.ReactNode[]
}

export function RawNavbar(children: RawNavbarProps) {
    return (
        <nav>
            <ul>
                {children}
            </ul>
        </nav>
    );
}



interface NavbarElProps {
    children: React.ReactNode,
    href: string,
}

export function NavElement({children, href}: NavbarElProps) {
    return (
        <ul>
            <li>
                <Link href={href}>
                    {children}
                </Link>
            </li>
        </ul>
    )
}