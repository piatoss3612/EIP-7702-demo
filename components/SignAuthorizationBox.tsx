import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { zeroAddress } from "viem";
import { Text, Flex } from "@radix-ui/themes";
import { useChainId, useWalletClient } from "wagmi";
import toast from "react-hot-toast";
import { baseSepolia, sepolia } from "viem/chains";

// Define a type for chain IDs to avoid TypeScript errors
type SupportedChainId = typeof sepolia.id | typeof baseSepolia.id;

const ACCOUNT_ADDRESSES: Record<SupportedChainId, `0x${string}`> = {
  [sepolia.id]: "0x69007702764179f14F51cdce752f4f775d74E139" as `0x${string}`,
  [baseSepolia.id]:
    "0x69007702764179f14F51cdce752f4f775d74E139" as `0x${string}`,
};

export default function SignAuthorizationBox() {
  const { data: walletClientFromHook } = useWalletClient();
  const { walletClient, authorization, handleSignAuthorization } = useAuth();
  const chainId = useChainId();

  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");

  // Update contract address when chainId changes
  useEffect(() => {
    // Check if the chainId is one of our supported chains
    if (chainId && chainId in ACCOUNT_ADDRESSES) {
      setContractAddress(ACCOUNT_ADDRESSES[chainId as SupportedChainId]);
    }
  }, [chainId]);

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
      kzg: undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg space-y-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          2. Smart Contract Account 권한 부여
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Address 표시 필드 */}
        <div className="space-y-2">
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            컨트랙트 주소 (체인 ID {chainId}에서 자동 선택됨)
          </label>
          <div className="p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
            {contractAddress}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-1">
            <p>
              이 주소는 Alchemy의 SemiModularAccount7702 스마트 컨트랙트 계정
              주소입니다.
            </p>
            <p>
              이 계정은 EIP-7702를 지원하며 모든 체인에서 동일한 주소로
              배포됩니다.
            </p>
            <p>
              <a
                href="https://accountkit.alchemy.com/smart-contracts/deployed-addresses#semimodularaccount7702-v200"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                더 자세한 정보 보기
              </a>
            </p>
          </div>
        </div>

        {/* 버튼 섹션 */}
        <div className="pt-2">
          {/* 버튼 정보 */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              버튼 기능 설명
            </h3>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-semibold">Grant:</span> 현재 선택된
                컨트랙트 주소에 대한 권한을 EOA에 부여합니다.
              </p>
              <p>
                <span className="font-semibold">Revoke:</span> Zero
                Address(0x0000000000000000000000000000000000000000)를 사용하여
                EOA에 부여된 권한을 제거합니다. 이는 이전에 부여한 모든 스마트
                컨트랙트 권한을 무효화합니다.
              </p>
            </div>
          </div>

          {/* 액션 버튼 */}
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
        </div>
      </form>

      {authorization && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Text size="3" weight="medium" className="mb-4">
            서명된 인증 정보
          </Text>
          <Flex direction="column" gap="2" className="mb-4">
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
          <div className="flex justify-end">
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
