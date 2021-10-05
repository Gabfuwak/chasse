import { getVisiblePosts, Post } from "@util/tools/getallposts";
import Link from "next/link";
import React, { Fragment, ReactNode, useEffect, useState } from "react";

import styles from "@styles/u/navbar.module.css";
import compose from "@util/tools/composecss";
import useObjectMediaQuery, { useIsMobileMQ } from "@util/hooks/objmediaquery";

//Check out (in the future)
//https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html

export default function AppNavbar() {
	const isMobile = useIsMobileMQ();

	const categories = ["posts", "reviews"];

	return (isMobile ? (<MobileAppNavbar categories={categories}/>) : <DesktopAppNavbar categories={categories}/>);
}

type Category = string;

interface NavbarProps {
	categories: Category[];
}

export function DesktopAppNavbar({categories}: NavbarProps) {
	const [menuSelected, setMenu] = useState<number | undefined>(undefined);

	const handleClick = (index: number) => {
		if (index === menuSelected) {
			setMenu(-1);
		} else {
			setMenu(index);
		}
	}

	return (
		<nav className={styles.coolNavbar}>
			<ul className={styles.coolNavList}>
					{categories.map((cat, index) => (
						<li key={index}>
							<button
								className={compose(styles.navelcontainer, (menuSelected == index) && styles.debugSelected)}
								onClick={() => handleClick(index)}
							>
								<p>{cat}</p>
							</button>
						</li>
					))}
				</ul>
		</nav>
	)
}

export function MobileAppNavbar({categories}: NavbarProps) {
	const [popupMenuSelected, setPopup] = useState(0);
	const [shouldPopupBeOpen, setPopupOpenState] = useState(false);

	const handleClick = (index: number) => {
		//If you click on the same menu, toggle open/closed
		//If it's different you want it open anyways
		//So set the menu and set it to open so it works even
		//When the menu was closed

		if (index === popupMenuSelected) {
			setPopupOpenState(!shouldPopupBeOpen);
		} else {
			setPopup(index);
			setPopupOpenState(true);
		}
	};

	return (
		<Fragment>
			<nav className={compose(styles.coolNavbar, styles.mobile)}>
				<ul className={styles.coolNavList}>
					{categories.map((cat, index) => (
						<li key={index}>
							<button
								className={styles.navelcontainer}
								onClick={() => handleClick(index)}
							>
								<p>{cat}</p>
							</button>
						</li>
					))}
				</ul>
			</nav>

			<MobilePopUpNavMenu
				selected={popupMenuSelected}
				shouldBeOpen={shouldPopupBeOpen}
			/>
		</Fragment>
	);
}

interface MobPopupProps {
	selected: number;
	shouldBeOpen: boolean;
}

export function MobilePopUpNavMenu({ selected, shouldBeOpen }: MobPopupProps) {
	const posts = getVisiblePosts();

	let content = (
		<div>
			<p>Nothing here :/</p>
		</div>
	);

	if (selected == 0) {
		content = (
			<ul className={styles.popupNavList}>
				{posts.map((post, index) => (
					<NavElement key={index} href={`/wc/post/${post.name}`}>
						<p>{post.name}</p>
					</NavElement>
				))}
			</ul>
		);
	}

	return (
		<div className={compose(styles.popup, shouldBeOpen && styles.active)}>
			{content}
		</div>
	);
}

interface NavbarElProps {
	children: ReactNode;
	href: string;
	[key: string]: any;
}

export function NavElement({ children, href, ...props }: NavbarElProps) {
	return (
		<li {...props}>
			<Link href={href}>
				<a>{children}</a>
			</Link>
		</li>
	);
}
