import { Fragment, ReactNode } from "react";

import styles from "@styles/u/components/containers.module.css";
import compose from "@util/tools/composecss";

type ExpansionType = "both" | "width" | "height";

/**
 * Can it take options as props
 * 'fill' for filling the parent container as much as possible
 * 'center' for centering the contents
 */
interface Optionnable {
	fill?: boolean;
	center?: boolean;
	minify?: ExpansionType;
}

interface ExtraPropable {
	[key: string]: any;
}

/**
 * Cannot have multiple children
 * @see MultableCProps
 */
interface SingleCProps extends Optionnable {
	children: ReactNode;
}

/**
 * Can have multiple children
 * @see SingleCProps
 */
interface MultableCProps extends Optionnable {
	children: ReactNode | ReactNode[];
}

type ContainerProps = MultableCProps & ExtraPropable;

export function CentererContainer({ children, ...props }: SingleCProps) {
	return (
		<ColumnContainer fill center>
			{children}
		</ColumnContainer>
	);
}

/**
 * Returns null if no children / children undefined, or a div containing the children otherwise.
 * props are passed down to the div if given
 * @param param0
 * @returns
 */
export function EmptyableContainer({
	children,
	...props
}: SingleCProps & ExtraPropable) {
	if (children) {
		return <div {...props}>{children}</div>;
	} else {
		return null;
	}
}

export function ContainerItem({ children }: MultableCProps) {
	if (Array.isArray(children)) {
		return <div className={styles.item}>{children}</div>;
	} else {
		return <Fragment>{children}</Fragment>;
	}
}

export function RowContainer({ children, fill, ...props }: ContainerProps) {
	return (
		<UnshapedContainer fill={fill} shape={"row"} {...props}>
			{children}
		</UnshapedContainer>
	);
}

export function ColumnContainer({ children, fill, ...props }: ContainerProps) {
	return (
		<UnshapedContainer fill={fill} shape={"column"} {...props}>
			{children}
		</UnshapedContainer>
	);
}

type UnshapedCProps = ContainerProps & { shape: "row" | "column" };

function UnshapedContainer({
	children,
	shape,
	fill,
	center,
	minify,
	className,
	...props
}: UnshapedCProps) {
	let actualChildren: ReactNode[];

	if (!Array.isArray(children)) {
		actualChildren = [children];
	} else {
		actualChildren = children;
	}

	return (
		<div
			className={compose(
				className,
				styles.shared,
				styles[shape],
				fill && styles.fill,
				center && styles.center,
				getMinifyStyle(minify)
			)}
			{...props}
		>
			{actualChildren.map((child, index) => (
				<ContainerItem key={index}>{child}</ContainerItem>
			))}
		</div>
	);
}

export function PageContainer({ children }: MultableCProps) {
	return <div className={styles.page}>{children}</div>;
}

function getMinifyStyle(minify?: ExpansionType) {
	const width = minify === 'both' || minify === "width";
	const height = minify === 'both' || minify === "height";

	return compose(width && styles.minifyWidth, height && styles.minifyHeight);
}
