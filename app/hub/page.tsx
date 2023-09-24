"use client";
import { useSession } from "next-auth/react";
import React from "react";

const Hub = () => {
  const { data: session } = useSession();

  return <div>page</div>;
};

export default Hub;
