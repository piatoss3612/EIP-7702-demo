import { createContext, useContext, useState, ReactNode } from "react";
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
} from "viem/accounts";
import { useChainId, useConfig } from "wagmi";

interface AuthContextType {
  walletClient: WalletClient | null;
  publicClient: PublicClient | null;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const chainId = useChainId();
  const config = useConfig();

  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

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

  return (
    <AuthContext.Provider
      value={{
        walletClient,
        publicClient,
        isConnected: !!walletClient,
        connect,
        disconnect,
        isLoading,
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
