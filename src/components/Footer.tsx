/**
 * Footer Component
 * Rewrite with TypeScript on 2026/3/10 (1773140655)
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

"use client"

import React from "react"
import styles from "./Footer.module.css"

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
            <div className="center serifBold">© 2026 BISZ Developers' Club.</div>
        </div>
    )
}

export default Footer