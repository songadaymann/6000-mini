"use client";

import {
  useMiniKit,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useState } from "react";
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { parseEther } from "viem";
// import { Button } from "./components/DemoComponents"; // Assuming we'll create our own or use simple buttons
// import { Icon } from "./components/DemoComponents";
// import { Home } from "./components/DemoComponents";
// import { Features } from "./components/DemoComponents";

const ETH_PURCHASE_ADDRESS = "0xaB920659eb7457b7C223e450D33959ED923E9Ffe";

export default function PresalePage() {
  const { setFrameReady, isFrameReady } = useMiniKit();
  const openUrl = useOpenUrl();
  const [ethAmount, setEthAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [processing, setProcessing] = useState(false);

  const { address, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const {
    sendTransactionAsync,
    isPending,
    isSuccess,
    error: txError,
    data: txHash,
  } = useSendTransaction();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  useEffect(() => {
    if (isPending) {
      setStatusMsg("Transaction pending...");
      setProcessing(true);
    }
    if (isSuccess && txHash) {
      setStatusMsg(`Success! Tx: ${txHash.substring(0, 10)}...`);
      setProcessing(false);
      setEthAmount("");
    }
    if (txError) {
      setStatusMsg(`Error: ${txError.message.split("(")[0]}`);
      setProcessing(false);
    }
  }, [isPending, isSuccess, txHash, txError]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(ETH_PURCHASE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  const handlePurchase = async () => {
    if (!address) {
      setStatusMsg("Connect wallet first");
      return;
    }
    const valueNum = parseFloat(ethAmount);
    if (!ethAmount || isNaN(valueNum) || valueNum <= 0) {
      setStatusMsg("Enter valid amount");
      return;
    }

    try {
      if (chainId !== 8453) {
        await switchChainAsync({ chainId: 8453 }); // Base
      }
      await sendTransactionAsync({
        to: ETH_PURCHASE_ADDRESS,
        value: parseEther(ethAmount),
      });
    } catch (e: unknown) {
      const errMessage = e && typeof e === "object" && "message" in e ? String((e as Error).message) : "Transaction failed";
      setStatusMsg(errMessage);
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#333A35] text-white font-['Comic_Sans_MS','Chalkboard_SE','Comic_Neue',_sans-serif] p-4 md:p-8 items-center">
      <div className="w-full max-w-4xl bg-[#4A544E] border-8 border-[#5D4A3C] rounded-lg shadow-2xl p-6 md:p-10">
        {/* Header with Wallet Connect */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#FFF1E0]">TOKEN PRESALE</h1>
          <Wallet className="z-10">
            <ConnectWallet>
              <button className="bg-[#D18B47] hover:bg-[#B87333] text-white font-bold py-2 px-4 rounded shadow">
                <Name className="text-inherit" />
              </button>
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2 bg-[#5D4A3C] text-[#FFF1E0]" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect className="bg-[#D18B47] hover:bg-[#B87333] text-white" />
            </WalletDropdown>
          </Wallet>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Presale Info */}
          <div className="space-y-4 text-[#E0D6CC]">
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Ticker: $TAXES</h2>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Chain: <span className="text-blue-400">Base</span> (also Mainnet, OP, Arbitrum)</h2>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Total supply: 1,095,171.79 <span className="text-sm">(my exact IRS bill)</span></h2>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Presale window: Jun 2 - Jun 9 2025</h2>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Distribution: 90% to presale participants, 10% to liquidity pool (locked)</h2>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C]">Trading: Zero fees or taxes</h2>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-[#F0E68C]">Boost your allocation (+2% each):</h3>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Beat the game & sign the ending message</li>
                <li>Own a Song-a-Day 1/1</li>
                <li>Own 10+ Song-a-Day 1/1s</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Purchase Section */}
          <div className="space-y-6 bg-[#3E4842] p-6 rounded-md shadow-lg">
            <div>
              <h2 className="text-xl font-semibold text-[#F0E68C] mb-1">ETH Purchase Address</h2>
              <div className="flex items-center space-x-2 bg-[#2E3631] p-3 rounded">
                <input
                  type="text"
                  value={ETH_PURCHASE_ADDRESS}
                  readOnly
                  className="bg-transparent text-[#E0D6CC] border-none focus:ring-0 w-full text-sm md:text-base"
                />
                <button
                  onClick={handleCopyAddress}
                  className="bg-[#D18B47] hover:bg-[#B87333] text-white font-semibold py-2 px-3 rounded text-sm shadow"
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-red-400 mt-1">Send only ETH (mainnet, base, arb, op) to this address.</p>
            </div>

            <div className="space-y-3">
              <label htmlFor="ethAmount" className="block text-lg font-semibold text-[#F0E68C]">Amount in ETH</label>
              <div className="flex items-center space-x-2">
                 {/* Tab-like buttons for Ethereum / jmann.eth - non-functional for now */}
                <button className="bg-[#5D4A3C] text-[#FFF1E0] py-2 px-4 rounded-t-lg opacity-50 cursor-not-allowed text-sm">Ethereum</button>
                <button className="bg-[#3E4842] border border-b-0 border-[#5D4A3C] text-[#F0E68C] py-2 px-4 rounded-t-lg text-sm">jmann.eth</button>
              </div>
              <div className="flex items-center bg-[#2E3631] p-1 rounded border border-[#5D4A3C]">
                <input
                  type="number"
                  id="ethAmount"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-[#E0D6CC] border-none focus:ring-0 w-full p-2 text-lg"
                />
                <span className="text-[#F0E68C] pr-2">ETH</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[0.01, 0.1, 1].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setEthAmount(amount.toString())}
                    className="bg-[#5A6860] hover:bg-[#6B7D74] text-[#FFF1E0] font-semibold py-2 px-3 rounded text-sm shadow"
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={processing || !ethAmount || parseFloat(ethAmount) <= 0}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded text-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.250M2.985 12.644H18.25m1.682-5.752a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Purchase
            </button>
            {statusMsg && (
              <p className="mt-2 text-center text-sm text-[#F0E68C]">{statusMsg}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-[#5D4A3C] flex justify-center">
          <button
            type="button"
            className="text-[#B0A091] hover:text-[#FFF1E0] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            BUILT ON BASE WITH MINIKIT
          </button>
        </footer>
      </div>
    </div>
  );
}
