import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { zeroAddress } from "viem";
import { Text, Flex } from "@radix-ui/themes";
import { useWalletClient } from "wagmi";
import toast from "react-hot-toast";

export default function SignAuthorizationBox() {
  const { data: walletClientFromHook } = useWalletClient();
  const { walletClient, authorization, handleSignAuthorization } = useAuth();

  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSignAuthorization(contractAddress);
  };

  const handleRevoke = async () => {
    await handleSignAuthorization(zeroAddress);
  };

  const handleTriggerTx = async () => {
    if (!authorization) {
      toast.error("Please sign authorization first");
      return;
    }

    await walletClientFromHook?.sendTransaction({
      address: authorization?.address,
      authorizationList: [authorization],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg">
      <h1 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
        2. Authorization 서명 및 트랜잭션 실행
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contract Address 입력 필드 */}
        <div>
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            컨트랙트 주소
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
        {/* revoke 버튼 */}
        <div className="flex gap-2 justify-end">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleRevoke()}
              disabled={!walletClient}
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded transition-colors hover:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Revoke
            </button>
          </div>
          {/* 서명 버튼 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!walletClient}
              className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded transition-colors hover:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Grant
            </button>
          </div>
        </div>
      </form>
      {authorization && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Text size="3" weight="medium" className="mb-4">
            서명된 인증 정보
          </Text>
          <Flex direction="column" gap="2">
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                체인 ID:
              </Text>
              <Text size="2" className="font-mono">
                {authorization.chainId}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                컨트랙트:
              </Text>
              <Text size="2" className="font-mono truncate">
                {authorization.address}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                논스:
              </Text>
              <Text size="2" className="font-mono">
                {authorization.nonce}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                R:
              </Text>
              <Text size="2" className="font-mono truncate">
                {authorization.r}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                S:
              </Text>
              <Text size="2" className="font-mono truncate">
                {authorization.s}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                V:
              </Text>
              <Text size="2" className="font-mono">
                {authorization.v}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                Y Parity:
              </Text>
              <Text size="2" className="font-mono">
                {authorization.yParity}
              </Text>
            </Flex>
          </Flex>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => handleTriggerTx()}
              disabled={!walletClient}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded transition-colors hover:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 10 4 15 9 20"></polyline>
                <path d="M20 4v7a4 4 0 0 1-4 4H4"></path>
              </svg>
              트랜잭션 실행
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
