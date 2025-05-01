import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { TransactionReceipt, zeroAddress } from "viem";
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
  const { walletClient, publicClient, authorization, handleSignAuthorization } =
    useAuth();
  const chainId = useChainId();

  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

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
    try {
      setIsLoading(true);

      if (!authorization) {
        toast.error("Please sign authorization first");
        return;
      }

      const txHash = await walletClientFromHook?.sendTransaction({
        authorizationList: [authorization],
        kzg: undefined,
      });

      if (!txHash) {
        toast.error("Failed to send transaction");
        return;
      }

      const receipt = await publicClient?.waitForTransactionReceipt({
        hash: txHash,
      });

      if (!receipt) {
        toast.error("Failed to wait for transaction receipt");
        return;
      }

      setTxHash(txHash);
      setReceipt(receipt);
    } catch (error) {
      console.error(error);
      toast.error("Failed to trigger transaction");
    } finally {
      setIsLoading(false);
    }
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
                권한 제거
              </button>
            </div>
            {/* 서명 버튼 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!walletClient}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded transition-colors hover:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                권한 부여
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
              disabled={!walletClient || isLoading}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded transition-colors hover:bg-blue-500 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>처리 중...</span>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>

          {/* 트랜잭션 결과 섹션 */}
          {(txHash || receipt) && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center mb-3">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <Text
                  size="3"
                  weight="medium"
                  className="text-green-800 dark:text-green-200"
                >
                  트랜잭션이 성공적으로 실행되었습니다
                </Text>
              </div>

              {txHash && (
                <div className="mb-4">
                  <div className="flex items-center mb-1">
                    <Text
                      size="2"
                      weight="medium"
                      className="text-green-700 dark:text-green-300"
                    >
                      트랜잭션 해시
                    </Text>
                    <a
                      href={`${
                        chainId === sepolia.id
                          ? sepolia.blockExplorers.default.url
                          : chainId === baseSepolia.id
                          ? baseSepolia.blockExplorers.default.url
                          : "#"
                      }/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-xs text-blue-500 hover:underline flex items-center"
                    >
                      <svg
                        className="h-3.5 w-3.5 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      블록 탐색기에서 보기
                    </a>
                  </div>
                  <div className="p-2 bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded font-mono text-xs overflow-auto">
                    {txHash}
                  </div>
                </div>
              )}

              {receipt && (
                <div>
                  <Text
                    size="2"
                    weight="medium"
                    className="text-green-700 dark:text-green-300 mb-1"
                  >
                    트랜잭션 상세 정보
                  </Text>
                  <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 rounded p-3 overflow-auto max-h-80">
                    <pre className="text-xs font-mono whitespace-pre text-gray-800 dark:text-gray-200">
                      {(() => {
                        // receipt 객체를 BigInt 값을 문자열로 변환하여 복사
                        const receiptForDisplay = {
                          ...receipt,
                          blockNumber: receipt.blockNumber
                            ? receipt.blockNumber.toString()
                            : null,
                          gasUsed: receipt.gasUsed
                            ? receipt.gasUsed.toString()
                            : null,
                          cumulativeGasUsed: receipt.cumulativeGasUsed
                            ? receipt.cumulativeGasUsed.toString()
                            : null,
                          effectiveGasPrice: receipt.effectiveGasPrice
                            ? receipt.effectiveGasPrice.toString()
                            : null,
                          status: receipt.status
                            ? receipt.status.toString() === "1"
                              ? "성공 (1)"
                              : receipt.status.toString() === "0"
                              ? "실패 (0)"
                              : receipt.status.toString()
                            : null,
                          // 로그를 처리
                          logs: receipt.logs?.map((log) => ({
                            ...log,
                            blockNumber: log.blockNumber
                              ? log.blockNumber.toString()
                              : null,
                            logIndex: log.logIndex
                              ? log.logIndex.toString()
                              : null,
                            transactionIndex: log.transactionIndex
                              ? log.transactionIndex.toString()
                              : null,
                          })),
                        };

                        return JSON.stringify(receiptForDisplay, null, 2);
                      })()}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
