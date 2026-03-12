/**
 * Footer Component
 *
 * Provides the application footer with copyright information.
 *
 * @component
 * @example
 * return (
 *   <Footer />
 * )
 *
 * @returns {JSX.Element} Rendered footer with copyright notice
 */

"use client";

import React from "react";
import styles from "./Footer.module.css";
import { siteConfig } from "@/config/siteConfig";

/**
 * Footer Component
 *
 * Displays the application footer with copyright information.
 *
 * @returns {JSX.Element} Footer with copyright notice
 */
const Footer = (): React.ReactElement => {
	return (
		<div className={styles.foot}>
			{/* Copyright notice centered with serif bold styling */}
			<div className="center serifBold">
				{siteConfig.footer.copyright}
			</div>
		</div>
	);
};

export default Footer;
