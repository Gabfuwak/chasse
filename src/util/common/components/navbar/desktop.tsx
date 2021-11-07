import Link from "next/dist/client/link";
import React, { ReactNode, useState } from "react";
import { AppNavbarImplProps, NavbarRenderableReference } from ".";
import { ColumnContainer } from "../containers";

import styles from "@styles/u/navbar/desktop.module.css";

export function DesktopAppNavbar({ categories }: AppNavbarImplProps) {
	type NRR = NavbarRenderableReference;

	return (
		<ColumnContainer minify={"width"} className={styles.bigdaddy}>
			<ul>
				{Array.from(categories.entries()).map(([key, value], index) => (
					<LinkGroup key={index} name={key}>
						{Array.from(value).map((val, i) => (
							<NavLink
								key={i}
								href={(val as NRR).url}
								text={(val as NRR).name}
							/>
						))}
					</LinkGroup>
				))}
			</ul>
		</ColumnContainer>
	);
}

function LinkGroup({
	children,
	name,
}: {
	children?: ReactNode[];
	name: string;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<button onClick={() => setIsOpen(!isOpen)}>
				<p>{name.toLocaleUpperCase()}</p>
			</button>

			{isOpen && <ul>{children}</ul>}
		</div>
	);
}

function NavLink({ href, text }: { href: string; text: string }) {
	return (
		<Link href={href}>
			<a>{text}</a>
		</Link>
	);
}
