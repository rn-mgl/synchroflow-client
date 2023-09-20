import React from "react";
import logo from "../../../public/landing/SynchroFlow.svg";
import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link className="absolute top-5 left-2/4 -translate-x-2/4 flex flex-row" href="/">
      <Image src={logo} alt="logo" className="w-5" />
      <p className="font-header font-extrabold text-center text-primary-500 text-lg t:text-xl">SynchroFlow</p>
    </Link>
  );
}
