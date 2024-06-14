"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import logo from "@/public/logo.svg";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function Navbar() {
  const pathName =
    usePathname(); /* A hook from next/navigation; must make component as use client */

  /* useEffect(() => {
    console.log(pathName);
  }, []); */

  return (
    <div className="flex p-4 items-center justify-between">
      <Image src={logo} alt="logo" width={140} height={100} />
      <ul className=" hidden md:flex gap-x-6">
        <li
          className={`hover:text-primary transition-all cursor-pointer ${
            pathName === "/dashboard" && "text-primary"
          }`}
        >
          <Link href={`/dashboard`}>Dashboard</Link>
        </li>
        <li
          className={`hover:text-primary transition-all cursor-pointer ${
            pathName === "/upgrade" && "text-primary"
          }`}
        >
          Upgrade
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Navbar;
