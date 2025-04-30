"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  return (
    <NavigationMenu.Root className="bg-blue-500 dark:bg-gray-800 shadow-md transition-colors duration-300">
      <NavigationMenu.List className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center space-x-10">
          <span className="text-2xl font-bold text-white">EIP-7702 Demo</span>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton />
          <DarkModeToggle />
        </div>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
