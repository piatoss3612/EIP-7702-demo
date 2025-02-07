"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <NavigationMenu.Root className="bg-blue-500 dark:bg-gray-800 shadow-md transition-colors duration-300">
      <NavigationMenu.List className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center space-x-10">
          <span className="text-2xl font-bold text-white">EIP-7702 Demo</span>
          <div className="flex items-center space-x-6">
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/"
                  className={`px-3 py-2 text-base font-medium text-white transition-colors rounded ${
                    pathname === "/"
                      ? "bg-blue-700 dark:bg-gray-700"
                      : "hover:bg-blue-600 dark:hover:bg-gray-600"
                  }`}
                >
                  Home
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <NavigationMenu.Link asChild>
                <Link
                  href="/smart-contract-account"
                  className={`px-3 py-2 text-base font-medium text-white transition-colors rounded ${
                    pathname === "/smart-contract-account"
                      ? "bg-blue-700 dark:bg-gray-700"
                      : "hover:bg-blue-600 dark:hover:bg-gray-600"
                  }`}
                >
                  Smart Contract Account
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton />
          <DarkModeToggle />
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
