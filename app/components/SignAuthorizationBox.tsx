import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import { useWalletClient } from "wagmi";
import { eip7702Actions } from "viem/experimental";
import { SignAuthorizationReturnType } from "viem/accounts";
import toast from "react-hot-toast";

type SponsorType = "custom" | "anyone";

export default function SignAuthorizationBox() {
  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");
  // sponsorType: 'custom' = 사용자 입력, 'anyone' = 누구나(true 전달)
  const [sponsorType, setSponsorType] = useState<SponsorType>("custom");
  const [sponsorAddress, setSponsorAddress] = useState<`0x${string}`>("0x0");

  const [authorization, setAuthorization] =
    useState<SignAuthorizationReturnType | null>(null);

  const { data: walletClient } = useWalletClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    const extendedWalletClient = walletClient.extend(eip7702Actions());

    const sponsor =
      sponsorType === "anyone"
        ? true
        : sponsorAddress !== "0x0"
        ? sponsorAddress
        : undefined;

    try {
      const authorizationTuple = await extendedWalletClient.signAuthorization({
        contractAddress,
        sponsor,
      });

      setAuthorization(authorizationTuple);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg">
      <h1 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
        1. Sign Authorization
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contract Address 입력 필드 */}
        <div>
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Contract Address
          </label>
          <input
            id="contractAddress"
            type="text"
            value={contractAddress}
            onChange={(e) =>
              setContractAddress(e.target.value as `0x${string}`)
            }
            className="mt-1 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            required
            placeholder="Enter contract address"
          />
        </div>
        {/* Sponsor 입력 옵션 */}
        <div>
          <label
            id="sponsor-label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Sponsor (optional)
          </label>
          <RadioGroup.Root
            aria-labelledby="sponsor-label"
            value={sponsorType}
            onValueChange={(value) => setSponsorType(value as SponsorType)}
            className="flex items-center space-x-6"
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <RadioGroup.Item
                value="custom"
                id="sponsor-custom"
                className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full p-[2px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <RadioGroup.Indicator className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full" />
              </RadioGroup.Item>
              <span className="text-gray-700 dark:text-gray-300">
                Custom Address
              </span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <RadioGroup.Item
                value="anyone"
                id="sponsor-anyone"
                className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-full p-[2px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <RadioGroup.Indicator className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full" />
              </RadioGroup.Item>
              <span className="text-gray-700 dark:text-gray-300">Anyone</span>
            </label>
          </RadioGroup.Root>
          {sponsorType === "custom" && (
            <input
              type="text"
              value={sponsorAddress}
              onChange={(e) =>
                setSponsorAddress(e.target.value as `0x${string}`)
              }
              className="mt-2 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter sponsor Ethereum address"
            />
          )}
        </div>
        {/* 서명 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded transition-colors hover:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Sign
          </button>
        </div>
      </form>
      {authorization && (
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100">
            Authorization Tuple
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Chain ID:</strong> {authorization.chainId}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Contract Address:</strong> {authorization.contractAddress}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Nonce:</strong> {authorization.nonce}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>R:</strong> {authorization.r}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>S:</strong> {authorization.s}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>V:</strong> {authorization.v}
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Y Parity:</strong> {authorization.yParity}
          </p>
        </div>
      )}
    </div>
  );
}
