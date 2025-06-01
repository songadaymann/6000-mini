"use client";

import {
  useMiniKit,
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
  const [ethAmount, setEthAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [processing, setProcessing] = useState(false);
  /* ---------------- TAB STATE ---------------- */
  const [activeTab, setActiveTab] = useState<"transaction" | "about">("transaction");

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
    <div className="flex flex-col min-h-screen bg-[#F9F9F7] text-[#2B2B2B] font-['Courier_New','Source_Code_Pro',_monospace] p-4 md:p-8 items-center pb-24"> {/* Extra bottom padding so content isn't hidden behind fixed nav */}
      <div className="w-full max-w-xl border-2 rounded-md p-4 flex flex-col flex-grow">
        {/* Header with Wallet Connect */}
        <header className="flex flex-col items-start mb-3 space-y-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-[#1A1A1A]">$TAXES TOKEN PRESALE</h1>
          <Wallet className="z-10">
            <ConnectWallet className="bg-[#0B0B61] hover:bg-[#1C1C7A] text-white font-semibold py-1 px-2 rounded shadow-sm text-xs">
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2 bg-[#EDEDED] text-[#2B2B2B]" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect className="bg-[#710000] hover:bg-[#910000] text-white" />
            </WalletDropdown>
          </Wallet>
        </header>

        {/* MAIN CONTENT BASED ON TAB */}
        <div className="flex-grow">
          {activeTab === "about" && (
            <div className="space-y-2 text-[#2B2B2B]">
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Ticker: $TAXES</h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Chain: <span className="text-blue-700">Base</span> (also Mainnet, OP, Arbitrum)</h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Total supply: 1,095,171.79 <span className="text-sm">(my exact IRS bill)</span></h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Presale window: Jun 2 - Jun 9 2025</h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Distribution: 90% to presale participants, 10% to liquidity pool (locked)</h2>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61]">Trading: Zero fees or taxes</h2>
              </div>
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-[#0B0B61]">Boost your allocation (+2% each):</h3>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>Beat the game & sign the ending message</li>
                  <li>Own a Song-a-Day 1/1</li>
                  <li>Own 10+ Song-a-Day 1/1s</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "transaction" && (
            <div className="space-y-3 bg-[#F3F3F3] p-3 rounded-md shadow-md">
              <div>
                <h2 className="text-xl font-semibold text-[#0B0B61] mb-1">SEND ETH TO</h2>
                <div className="bg-[#EDEDED] pl-1 pr-2 py-2 rounded">
                  <input
                    type="text"
                    value={ETH_PURCHASE_ADDRESS}
                    readOnly
                    className="bg-transparent text-[#2B2B2B] border-none focus:ring-0 w-full text-[11px] leading-tight mb-1"
                  />
                  <button
                    onClick={handleCopyAddress}
                    className="bg-[#0B0B61] hover:bg-[#1C1C7A] text-white font-semibold py-1 px-2 rounded text-xs shadow"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-red-700 mt-1">Send <b>only ETH</b> (mainnet, base, arb, op).</p>
              </div>

              <div className="space-y-3">
                
                <div className="flex items-center bg-[#FFFFFF] p-1 rounded border border-[#B0B0B0]">
                  <input
                    type="number"
                    id="ethAmount"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-[#2B2B2B] border-none focus:ring-0 w-full p-2 text-lg"
                  />
                  <span className="text-[#0B0B61] pr-2">ETH</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[0.01, 0.1, 1].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setEthAmount(amount.toString())}
                      className="bg-[#C9C9C9] hover:bg-[#AAAAAA] text-[#1A1A1A] font-semibold py-2 px-3 rounded text-sm shadow"
                    >
                      {amount} ETH
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={processing || !ethAmount || parseFloat(ethAmount) <= 0}
                className="w-full bg-[#0B0B61] hover:bg-[#1C1C7A] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded text-lg shadow-md transition duration-150 ease-in-out flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.250M2.985 12.644H18.25m1.682-5.752a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Purchase
              </button>
              {statusMsg && (
                <p className="mt-2 text-center text-sm text-[#0B0B61]">{statusMsg}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-6 pt-3 border-t border-[#B0B0B0] flex justify-center">
          {/* <button
            type="button"
            className="text-[#6A6A6A] hover:text-[#0B0B61] text-xs"
            onClick={() => console.log("Footer button clicked - openUrl was removed due to being unused.")}
          >
            BUILT ON BASE WITH MINIKIT
          </button> */}
        </footer>
      </div>

      {/* BOTTOM TAB NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#EDEDED] border-t border-[#B0B0B0] flex text-center z-20"> {/* Fixed to bottom of viewport */}
        <button
          onClick={() => setActiveTab("transaction")}
          className={`flex-1 py-3 font-semibold ${activeTab === "transaction" ? "text-[#0B0B61] bg-[#FFFFFF]" : "text-[#6A6A6A]"}`}
        >
          Transaction
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-3 font-semibold ${activeTab === "about" ? "text-[#0B0B61] bg-[#FFFFFF]" : "text-[#6A6A6A]"}`}
        >
          About
        </button>
      </nav>
    </div>
  );
}
