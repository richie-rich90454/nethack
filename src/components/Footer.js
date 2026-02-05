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
"use client"
import styles from "./Footer.module.css"

const Footer = () => {
    return (
        <div className={styles.foot}>
            {/* Copyright notice centered with serif bold styling */}
            <div className="center serifBold">© 2026 BISZ Developers' Club.</div>
        </div>
    )
}

export default Footer
