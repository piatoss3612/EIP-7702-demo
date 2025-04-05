import * as React from "react";
import { useState } from "react";
import { useWalletClient } from "wagmi";
import { SignAuthorizationReturnType } from "viem/accounts";
import toast from "react-hot-toast";

export default function SignAuthorizationBox() {
  const [contractAddress, setContractAddress] = useState<`0x${string}`>("0x0");
  const [authorization, setAuthorization] =
    useState<SignAuthorizationReturnType | null>(null);

  const { data: walletClient } = useWalletClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!walletClient) {
      toast.error("Please connect your wallet");
      return;
    }

    const account = walletClient.account;

    // json-rpc account is not yet supported
    const authorization = await walletClient.prepareAuthorization({
      account,
      contractAddress,
    });

    try {
      const authorizationTuple = await walletClient.signAuthorization(
        authorization
      );

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
        {/* revoke 버튼 */}
        <div className="flex gap-2 justify-end">
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded transition-colors hover:bg-red-500 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Revoke
            </button>
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
            <strong>Contract Address:</strong> {authorization.address}
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
