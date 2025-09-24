import { AlertCircle, CheckCircle, ExternalLink, Wallet, X } from 'lucide-react';
import type React from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useNFTMinting } from '../hooks/useNFTMinting';

interface WalletConnectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnector: React.FC<WalletConnectorProps> = ({ isOpen, onClose }) => {
  const { web3State, isConnecting, error, connectWallet, disconnectWallet, clearError } = useWeb3();
  const { contractConfig } = useNFTMinting();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1: return 'Ethereum Mainnet';
      case 5: return 'Goerli Testnet';
      case 11155111: return 'Sepolia Testnet';
      case 137: return 'Polygon';
      default: return `Chain ${chainId}`;
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wallet-modal-title"
    >
      <div className="relative w-full max-w-md my-auto">
        {/* Modal content */}
        <div className="relative rounded-2xl border border-stonks-green/30 bg-gradient-to-br from-stonks-darker via-stonks-gray to-stonks-darker p-6 shadow-2xl backdrop-blur-lg">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-stonks-accent/80 hover:bg-stonks-accent p-2 text-stonks-dark transition-all hover:scale-105 shadow-lg"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-6 text-center pt-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-stonks-green/20 to-stonks-accent/20">
              <Wallet className="h-8 w-8 text-stonks-accent" />
            </div>
            <h2 id="wallet-modal-title" className="stonks-text mb-2 font-bold font-orbitron text-xl">
              Connect Wallet
            </h2>
            <p className="font-medium font-rajdhani text-sm text-stonks-light/70">
              Connect your wallet to mint DIID NFTs
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
              <button
                type="button"
                onClick={clearError}
                className="mt-2 text-red-400 text-xs underline hover:text-red-300"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Connection Status */}
          {web3State.isConnected ? (
            <div className="space-y-4">
              {/* Connected Status */}
              <div className="rounded-lg border border-stonks-green/20 bg-stonks-green/10 p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-stonks-green" />
                  <span className="font-semibold text-stonks-green text-sm">Wallet Connected</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-stonks-light/70">
                  <div>Address: {formatAddress(web3State.account!)}</div>
                  <div>Network: {getNetworkName(web3State.chainId!)}</div>
                </div>
              </div>

              {/* Contract Info */}
              {contractConfig && (
                <div className="rounded-lg border border-stonks-accent/20 bg-stonks-accent/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stonks-accent text-sm">NFT Contract</span>
                    <a
                      href={`${contractConfig.blockExplorer}/address/${contractConfig.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stonks-accent hover:text-stonks-green"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div className="mt-2 space-y-1 text-xs text-stonks-light/70">
                    <div>Name: {contractConfig.name}</div>
                    <div>Symbol: {contractConfig.symbol}</div>
                    <div>Address: {formatAddress(contractConfig.address)}</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-gradient-to-r from-stonks-green to-stonks-accent px-4 py-3 font-rajdhani font-semibold text-stonks-dark transition-all hover:scale-105 hover:from-stonks-accent hover:to-stonks-green"
                >
                  Continue Minting
                </button>
                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="rounded-xl border border-stonks-light/20 bg-stonks-light/10 px-4 py-3 font-rajdhani font-semibold text-stonks-light transition-all hover:bg-stonks-light/20"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* MetaMask Connect */}
              <button
                type="button"
                onClick={connectWallet}
                disabled={isConnecting}
                className={`flex w-full items-center justify-center space-x-3 rounded-xl px-6 py-4 font-rajdhani font-semibold transition-all ${
                  isConnecting
                    ? 'cursor-not-allowed bg-stonks-gray/60 text-stonks-light/50'
                    : 'bg-gradient-to-r from-stonks-green to-stonks-accent text-stonks-dark hover:scale-105 hover:from-stonks-accent hover:to-stonks-green'
                }`}
              >
                <Wallet className="h-5 w-5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
              </button>

              {/* Help Text */}
              <div className="rounded-lg border border-stonks-light/10 bg-stonks-light/5 p-4 text-center">
                <p className="mb-2 font-semibold text-stonks-light text-sm">Don't have MetaMask?</p>
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-stonks-accent text-sm underline hover:text-stonks-green"
                >
                  Download MetaMask →
                </a>
              </div>
            </div>
          )}
          
          {/* Help text for closing modal */}
          <div className="mt-4 text-center">
            <p className="text-stonks-light/50 text-xs">
              Press <kbd className="bg-stonks-light/10 px-1 rounded">Esc</kbd> or click outside to close
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};