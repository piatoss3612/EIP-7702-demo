import { useState } from "react";
import { Button, Flex, TextField, Text, Tabs } from "@radix-ui/themes";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export function AccountConnectionBox() {
  const [mnemonic, setMnemonic] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const { connect, walletClient, publicClient, isLoading } = useAuth();

  const { data: nonce, isFetching: isFetchingNonce } = useQuery({
    queryKey: ["nonce", walletClient?.account?.address, publicClient?.chain],
    queryFn: async () => {
      return (
        (await publicClient?.getTransactionCount({
          address: walletClient?.account?.address as `0x${string}`,
        })) ?? null
      );
    },
    enabled: !!walletClient,
    refetchInterval: 10000, // 10초
  });

  const { data: code, isFetching: isFetchingCode } = useQuery({
    queryKey: ["getCode", walletClient?.account?.address, publicClient?.chain],
    queryFn: async () => {
      return (
        (await publicClient?.getCode({
          address: walletClient?.account?.address as `0x${string}`,
        })) ?? null
      );
    },
    enabled: !!walletClient,
    refetchInterval: 10000, // 10초
  });

  const handleConnect = async (type: "mnemonic" | "privateKey") => {
    if (type === "mnemonic" && mnemonic) {
      await connect({ mnemonic });
    } else if (type === "privateKey" && privateKey) {
      await connect({ privateKey: privateKey as `0x${string}` });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg space-y-6">
      <div className="mb-6">
        <Text size="5" weight="bold">
          1. 계정 연결
        </Text>
      </div>

      {/* Warning message */}
      <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              주의사항
            </h3>
            <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              <p>
                이 데모는 <strong>오직 테스트 목적으로만</strong> 사용해야
                합니다.
              </p>
              <p className="mt-1">
                실제 자산이 있는 니모닉이나 개인 키를 절대 입력하지 마세요.
                테스트넷용 키만 사용하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* EIP-7702 explanation */}
      <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              EIP-7702 트랜잭션 실행 방법
            </h3>
            <div className="mt-1 text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>
                <strong>중요:</strong> 여기서 입력하는 니모닉이나 개인키는
                네비게이션 바에서 연결된 계정의 키와{" "}
                <strong>동일해야 합니다</strong>.
              </p>
              <p>
                이는 EIP-7702 트랜잭션 실행을 위한 authorization tuple을
                생성하기 위함입니다.
              </p>
              <p>
                이렇게 별도의 입력 방식을 사용하는 이유는 authorization tuple
                생성을 위한 서명 요청이 지갑에서 아직 공식적으로 지원되지 않기
                때문입니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Tabs.Root defaultValue="mnemonic">
          <Tabs.List className="mb-4">
            <Tabs.Trigger value="mnemonic">니모닉 구문</Tabs.Trigger>
            <Tabs.Trigger value="privateKey">개인 키</Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="mnemonic">
            <Flex direction="column" gap="3" className="mb-4">
              <TextField.Root
                placeholder="니모닉 구문 입력"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                className="min-h-[100px] w-full"
              />

              <Flex justify="end">
                <Button
                  onClick={() => handleConnect("mnemonic")}
                  disabled={!mnemonic || isLoading}
                >
                  {isLoading ? "연결 중..." : "니모닉으로 연결"}
                </Button>
              </Flex>

              <Text size="1" color="gray">
                니모닉 구문은 12~24개의 단어로 구성되어 있습니다.
              </Text>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="privateKey">
            <Flex direction="column" gap="3" className="mb-4">
              <TextField.Root
                placeholder="0x로 시작하는 개인 키 입력"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="w-full"
              />

              <Flex justify="end">
                <Button
                  onClick={() => handleConnect("privateKey")}
                  disabled={!privateKey || isLoading}
                >
                  {isLoading ? "연결 중..." : "개인 키로 연결"}
                </Button>
              </Flex>

              <Text size="1" color="gray">
                개인 키는 0x로 시작하는 64자리 16진수 형태입니다.
              </Text>
            </Flex>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {walletClient && (
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Text size="3" weight="medium" className="mb-4">
            연결된 계정 정보
          </Text>
          <Flex direction="column" gap="2">
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                계정 주소:
              </Text>
              <Text size="2" className="font-mono truncate">
                {walletClient.account?.address}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                네트워크:
              </Text>
              <Text size="2">{walletClient.chain?.name}</Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                논스:
              </Text>
              <Text size="2">
                {isFetchingNonce ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500"
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
                    로딩중...
                  </span>
                ) : (
                  nonce
                )}
              </Text>
            </Flex>
            <Flex gap="2" align="center">
              <Text
                size="2"
                weight="medium"
                className="text-gray-500 dark:text-gray-400 w-24"
              >
                코드:
              </Text>
              <Text size="2">
                {isFetchingCode ? (
                  <span className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500"
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
                    로딩중...
                  </span>
                ) : !code || code === "0x" ? (
                  <span className="text-red-500">없음 (EOA)</span>
                ) : (
                  <span className="text-green-500">
                    {code} (스마트 컨트랙트)
                  </span>
                )}
              </Text>
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  );
}
