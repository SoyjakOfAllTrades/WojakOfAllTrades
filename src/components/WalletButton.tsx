import { CheckCircle, ChevronDown, Copy, ExternalLink, LogOut, Plus, Wallet } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useToast } from '../hooks/useToast';
import { WalletConnector } from './WalletConnector';

export const WalletButton: React.FC = () => {
  const { web3State, isConnecting, disconnectWallet } = useWeb3();
  const { success } = useToast();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'ETH';
      case 5: return 'GOERLI';
      case 11155111: return 'SEPOLIA';  
      case 137: return 'POLYGON';
      default: return `CHAIN ${chainId}`;
    }
  };

  const getNetworkExplorer = (chainId: number) => {
    switch (chainId) {
      case 1: return 'https://etherscan.io';
      case 5: return 'https://goerli.etherscan.io';
      case 11155111: return 'https://sepolia.etherscan.io';
      case 137: return 'https://polygonscan.com';
      default: return 'https://etherscan.io';
    }
  };

  // Handle click outside to close dropdown - simple version like builder button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  // Simple click handler like builder button - no complex event handling
  const handleWalletButtonClick = () => {
    if (web3State.isConnected) {
      setShowDropdown(prev => !prev);
    } else if (!isConnecting) {
      setShowWalletModal(true);
    }
  };

  // Dropdown action handlers
  const copyAddress = async () => {
    if (web3State.account) {
      try {
        await navigator.clipboard.writeText(web3State.account);
        success('Address Copied!', `${formatAddress(web3State.account)} copied to clipboard`);
        setShowDropdown(false);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  const openExplorer = () => {
    if (web3State.account && web3State.chainId) {
      const explorerUrl = getNetworkExplorer(web3State.chainId);
      window.open(`${explorerUrl}/address/${web3State.account}`, '_blank');
      setShowDropdown(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowDropdown(false);
  };

  const addWallet = () => {
    setShowDropdown(false);
    setShowWalletModal(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Main Wallet Button */}
      <button
        type="button"
        onClick={handleWalletButtonClick}
        disabled={isConnecting}
        className={`
          flex items-center space-x-2 rounded-xl px-4 py-3 
          font-rajdhani font-semibold transition-all duration-300
          ${web3State.isConnected 
            ? 'cursor-pointer bg-gradient-to-r from-stonks-green/20 to-stonks-accent/20 border border-stonks-green/40 text-stonks-green hover:from-stonks-green/30 hover:to-stonks-accent/30 hover:border-stonks-green/60' 
            : isConnecting 
              ? 'cursor-not-allowed bg-stonks-gray/60 text-stonks-light/50' 
              : 'cursor-pointer border border-stonks-light/20 text-stonks-light/70 hover:bg-stonks-gray/30 hover:text-stonks-light hover:border-stonks-light/40'
          }
        `}
      >
        {web3State.isConnected ? (
          <>
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <div className="hidden sm:flex flex-col items-start leading-tight min-w-0">
              <span className="text-xs truncate">{formatAddress(web3State.account!)}</span>
              <span className="text-xs opacity-70">{getNetworkName(web3State.chainId!)}</span>
            </div>
            <span className="sm:hidden text-sm">{formatAddress(web3State.account!)}</span>
            <ChevronDown 
              className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${
                showDropdown ? 'rotate-180' : ''
              }`} 
            />
          </>
        ) : isConnecting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-stonks-light/30 border-t-stonks-light flex-shrink-0" />
            <span className="hidden sm:inline">CONNECTING</span>
          </>
        ) : (
          <>
            <Wallet className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">CONNECT</span>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {web3State.isConnected && showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 rounded-xl border border-stonks-green/30 bg-gradient-to-br from-stonks-darker via-stonks-gray to-stonks-darker p-2 shadow-2xl backdrop-blur-lg z-50 max-w-[90vw]">
          {/* Connected Account Info */}
          <div className="mb-3 rounded-lg border border-stonks-green/20 bg-stonks-green/10 p-3">
            <div className="mb-2 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-stonks-green flex-shrink-0" />
              <span className="font-semibold text-stonks-green text-sm">Connected</span>
            </div>
            <div className="space-y-1 text-xs text-stonks-light/70">
              <div className="break-all">Address: {formatAddress(web3State.account!)}</div>
              <div>Network: {getNetworkName(web3State.chainId!)}</div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={copyAddress}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-rajdhani font-medium text-stonks-light text-sm transition-all hover:bg-stonks-light/10"
            >
              <Copy className="h-4 w-4 flex-shrink-0" />
              <span>Copy Address</span>
            </button>
            
            <button
              type="button"
              onClick={openExplorer}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-rajdhani font-medium text-stonks-light text-sm transition-all hover:bg-stonks-light/10"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              <span>View on Explorer</span>
            </button>

            <hr className="my-2 border-stonks-light/20" />
            
            <button
              type="button"
              onClick={addWallet}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-rajdhani font-medium text-stonks-accent text-sm transition-all hover:bg-stonks-accent/10"
            >
              <Plus className="h-4 w-4 flex-shrink-0" />
              <span>Add Different Wallet</span>
            </button>
            
            <button
              type="button"
              onClick={handleDisconnect}
              className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left font-rajdhani font-medium text-red-400 text-sm transition-all hover:bg-red-400/10"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}

      {/* Wallet Connection Modal */}
      <WalletConnector 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
      />
    </div>
  );
};