import { createContext, useContext, useState, ReactNode } from "react";
import toast from "react-hot-toast";
import {
  createWalletClient,
  http,
  Hex,
  WalletClient,
  Account,
  PublicClient,
  createPublicClient,
} from "viem";
import {
  generatePrivateKey,
  mnemonicToAccount,
  privateKeyToAccount,
  SignAuthorizationReturnType,
} from "viem/accounts";
import { useChainId, useConfig } from "wagmi";

interface AuthContextType {
  walletClient: WalletClient | null;
  publicClient: PublicClient | null;
  account: Account | null;
  authorization: SignAuthorizationReturnType | null;
  isConnected: boolean;
  connect: ({
    mnemonic,
    privateKey,
  }: {
    mnemonic?: string;
    privateKey?: Hex;
  }) => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  handleSignAuthorization: (contractAddress: `0x${string}`) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const config = useConfig();

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);
  const [authorization, setAuthorization] =
    useState<SignAuthorizationReturnType | null>(null);

  const publicClient = createPublicClient({
    chain:
      config.chains.find((chain) => chain.id === chainId) ?? config.chains[0],
    transport: http(),
  });
  const walletClient = account
    ? createWalletClient({
        account,
        chain:
          config.chains.find((chain) => chain.id === chainId) ??
          config.chains[0],
        transport: http(),
      })
    : null;

  const connect = async ({
    mnemonic,
    privateKey,
  }: {
    mnemonic?: string;
    privateKey?: Hex;
  }) => {
    try {
      setIsLoading(true);
      let account: Account;

      if (mnemonic) {
        account = mnemonicToAccount(mnemonic);
      } else {
        account = privateKeyToAccount(privateKey || generatePrivateKey());
      }

      setAccount(account);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  const handleSignAuthorization = async (contractAddress: `0x${string}`) => {
    if (!walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    const account = walletClient.account;

    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      const authorizationTuple = await walletClient.signAuthorization({
        account,
        contractAddress,
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
    <AuthContext.Provider
      value={{
        walletClient,
        account,
        authorization,
        publicClient,
        isConnected: !!walletClient,
        connect,
        disconnect,
        isLoading,
        handleSignAuthorization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
