import * as React from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { zeroAddress } from "viem";
import { Text, Flex } from "@radix-ui/themes";

export default function SignAuthorizationBox() {
  const { walletClient, authorization, handleSignAuthorization } = useAuth();

  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await handleSignAuthorization(contractAddress);
  };

  const handleRevoke = async () => {
    await handleSignAuthorization(zeroAddress);
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg">
      <h1 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
        2. Authorization 서명
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
        </div>
      )}
    </div>
  );
}
