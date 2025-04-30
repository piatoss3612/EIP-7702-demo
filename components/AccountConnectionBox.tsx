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
  });
  const handleConnect = async (type: "mnemonic" | "privateKey") => {
    if (type === "mnemonic" && mnemonic) {
      await connect({ mnemonic });
    } else if (type === "privateKey" && privateKey) {
      await connect({ privateKey: privateKey as `0x${string}` });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded shadow-lg">
      <Text size="5" weight="bold" className="mb-4">
        1. 계정 연결
      </Text>

      <Tabs.Root defaultValue="mnemonic">
        <Tabs.List className="mb-4">
          <Tabs.Trigger value="mnemonic">니모닉 구문</Tabs.Trigger>
          <Tabs.Trigger value="privateKey">개인 키</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="mnemonic">
          <Flex direction="column" gap="3">
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
          <Flex direction="column" gap="3">
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
      {walletClient && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
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
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
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
          </Flex>
        </div>
      )}
    </div>
  );
}
