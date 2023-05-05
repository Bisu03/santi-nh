import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const handleLogout = () => {
    signOut();
  };
  return (
    <>
      <div className="navbar bg-primary fixed top-0 z-50  ">
        <div className="navbar-start">
          <div className="dropdown ">
            <label tabIndex={0} className="btn btn-ghost btn-circle ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-success rounded-box w-52 font-bold">
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>

              {/* <li>
                <a>All Appoinment</a>
              </li> */}
              <li>
                <Link href="/patientrecord">Patient Record</Link>
              </li>
              <li>
                <Link href="/admitpatient">Admit Patient</Link>
              </li>
              {/* <li>
                <Link href="/billing">Billing</Link>
              </li> */}
              {/* <li>
                <Link href="/addmedicine">Add Medicine</Link>
              </li>
              <li>
                <Link href="/medicinelist">Medicine List</Link>
              </li>
         <li>
                <Link href="/medicinestockout">Medicine Stocks Out</Link>
              </li> 
              <li>
                <Link href="/customerrecord">Medicine Billing</Link>
              </li> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-warning text-base-100 ">
                  log out
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost normal-case text-xl">Admin Dashboard</a>
        </div>
        <div className="navbar-end">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
