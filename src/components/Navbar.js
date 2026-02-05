/**
 * Navigation Bar Component
 * 
 * Provides the main navigation header for the application with dynamic login/logout
 * functionality based on user authentication status.
 * 
 * @component
 * @example
 * return (
 *   <Navbar />
 * )
 * 
 * @returns {JSX.Element} Rendered navigation bar with application title and auth link
 */
"use client"
import Link from "next/link";
import styles from './Navbar.module.css'; 
import { useSession } from "next-auth/react";

const Navbar = () => {
  // Get authentication status from NextAuth session
  const { status: authStatus } = useSession();
  
  return (
    <div className={styles.nav}>
        <div className={styles.wrap}>
            {/* Application title linking to home page */}
            <Link href = "/">BIBS·C Network Hackathon</Link>
            
            {/* Flexible spacer to push auth link to the right */}
            <span className={styles.fill}></span>
            
            {/* Dynamic auth link: shows "Logout" when authenticated, "Login" otherwise */}
            <Link href = "/login" className = "med">
              {authStatus === 'authenticated' ? 'Logout' : 'Login'}
            </Link>
        </div>
    </div>
  );
};

export default Navbar;
