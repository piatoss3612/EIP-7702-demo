"use client";

import SignAuthorizationBox from "@/components/SignAuthorizationBox";
import { AccountConnectionBox } from "@/components/AccountConnectionBox";
export default function Home() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <AccountConnectionBox />
      <SignAuthorizationBox />
    </div>
  );
}
