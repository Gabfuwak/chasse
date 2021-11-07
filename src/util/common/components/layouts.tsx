import React, {ReactNode } from "react";
import { RowContainer, ColumnContainer } from "./containers";
import AppNavbar from "@components/navbar";

import basicnavfillstyles from '@styles/u/layouts/basicnavfill.module.css'

interface BasicLayoutProps {
    children: ReactNode;
    [key: string]: any;
}


/**
A basic layout including a navbar that fills the screen even if it's contents
are not big enough.

Props passed to this element are all passed down to the column container containing
the children
*/
export default function BasicNavFillLayout({children, ...props}: BasicLayoutProps) {
    return (
        <RowContainer fill className={basicnavfillstyles.leftroasted}>
			<AppNavbar />

			<ColumnContainer {...props}> 
                {children}
            </ColumnContainer>
        </RowContainer>

    )
}