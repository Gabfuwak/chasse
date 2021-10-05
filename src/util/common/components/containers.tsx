import { Fragment, ReactNode } from "react";

import styles from "@styles/u/components/containers.module.css";
import compose from "@util/tools/composecss";

interface ContainerProps {
	children: ReactNode | ReactNode[];
	fill?: true | undefined;
}

export function ContainerItem({ children }: ContainerProps) {
	if (Array.isArray(children)) {
		return <div className={styles.item}>{children}</div>;
	} else {
		return <Fragment>{children}</Fragment>;
	}
}

export function RowContainer({
	children,
	fill = undefined,
}: ContainerProps) {
	return (
		<UnshapedContainer fill={fill} shape={"row"}>
			{children}
		</UnshapedContainer>
	);
}

export function ColumnContainer({
	children,
	fill = undefined,
}: ContainerProps) {
	return (
		<UnshapedContainer fill={fill} shape={"column"}>
			{children}
		</UnshapedContainer>
	);
}


function UnshapedContainer({
	children,
	shape,
	fill=undefined,
}: ContainerProps & { shape: "row" | "column" }) {
	let actualChildren: ReactNode[];

	if (!Array.isArray(children)) {
		actualChildren = [children];
	} else {
		actualChildren = children;
	}

	return (
		<div className={compose(styles.shared, styles[shape], fill && styles.fill)}>
			{actualChildren.map((child, index) => (
				<ContainerItem key={index}>{child}</ContainerItem>
			))}
		</div>
	);
}

export function PageContainer({ children }: ContainerProps) {
	return <div className={styles.page}>{children}</div>;
}
