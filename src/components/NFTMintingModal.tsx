import { AlertCircle, CheckCircle, ExternalLink, Loader2, Sparkles, X, Zap } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useNFTMinting } from '../hooks/useNFTMinting';
import type { WojakCharacter } from '../types/wojak';
import { WalletConnector } from './WalletConnector';

interface NFTMintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  wojak: WojakCharacter;
  onMintSuccess: (txHash: string, tokenId?: number) => void;
}

export const NFTMintingModal: React.FC<NFTMintingModalProps> = ({
  isOpen,
  onClose,
  wojak,
  onMintSuccess,
}) => {
  const { web3State } = useWeb3();
  const { mintState, mintNFT, resetMintState, getContractInfo } = useNFTMinting();
  const [showWalletConnector, setShowWalletConnector] = useState(false);
  const [contractInfo, setContractInfo] = useState<{ name: string; symbol: string; totalSupply: number } | null>(null);

  // Load contract info when modal opens
  useEffect(() => {
    if (isOpen && web3State.isConnected) {
      getContractInfo().then(setContractInfo);
    }
  }, [isOpen, web3State.isConnected, getContractInfo]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetMintState();
    }
  }, [isOpen, resetMintState]);

  const handleMint = async () => {
    if (!web3State.isConnected) {
      setShowWalletConnector(true);
      return;
    }

    try {
      await mintNFT(wojak);
    } catch (error) {
      console.error('Minting failed:', error);
    }
  };

  const handleSuccess = () => {
    if (mintState.transaction) {
      onMintSuccess(mintState.transaction.hash, mintState.transaction.tokenId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative mx-4 w-full max-w-lg">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-2 -top-2 z-10 rounded-full bg-stonks-accent p-2 text-stonks-dark transition-all hover:scale-105 hover:bg-stonks-green"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal content */}
          <div className="rounded-2xl border border-stonks-green/30 bg-gradient-to-br from-stonks-darker via-stonks-gray to-stonks-darker p-6 shadow-2xl backdrop-blur-lg">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-stonks-green/20 to-stonks-accent/20">
                <Sparkles className="h-8 w-8 text-stonks-accent" />
              </div>
              <h2 className="stonks-text mb-2 font-bold font-orbitron text-xl">
                Mint NFT
              </h2>
              <p className="font-medium font-rajdhani text-sm text-stonks-light/70">
                Mint your Wojak DIID as an NFT
              </p>
            </div>

            {/* Wojak Preview */}
            <div className="mb-6 rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4">
              <div className="text-center">
                <h3 className="stonks-text mb-2 font-bold font-orbitron text-lg">
                  {wojak.name || 'Unnamed Wojak'}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-stonks-light/70">
                  <div>Template: {wojak.template}</div>
                  <div>Hat: {wojak.hat === 'none' ? 'None' : wojak.hat}</div>
                  <div>Glasses: {wojak.glasses === 'none' ? 'None' : wojak.glasses}</div>
                  <div>Mask: {wojak.mask === 'none' ? 'None' : wojak.mask}</div>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            {contractInfo && (
              <div className="mb-4 rounded-lg border border-stonks-accent/20 bg-stonks-accent/10 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stonks-accent text-sm">Collection</span>
                  <span className="text-stonks-light/70 text-xs">Total: {contractInfo.totalSupply}</span>
                </div>
                <div className="text-stonks-light/70 text-xs">
                  {contractInfo.name} ({contractInfo.symbol})
                </div>
              </div>
            )}

            {/* Error Display */}
            {mintState.error && (
              <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">{mintState.error}</span>
                </div>
              </div>
            )}

            {/* Success Display */}
            {mintState.success && mintState.transaction && (
              <div className="mb-4 rounded-lg border border-stonks-green/20 bg-stonks-green/10 p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-stonks-green" />
                  <span className="font-semibold text-stonks-green text-sm">NFT Minted Successfully!</span>
                </div>
                {mintState.transaction.tokenId && (
                  <div className="mt-1 text-stonks-light/70 text-xs">
                    Token ID: #{mintState.transaction.tokenId}
                  </div>
                )}
                <a
                  href={mintState.transaction.blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center space-x-1 text-stonks-accent text-xs underline hover:text-stonks-green"
                >
                  <span>View on Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Transaction Pending */}
            {mintState.transaction && !mintState.success && !mintState.error && (
              <div className="mb-4 rounded-lg border border-stonks-accent/20 bg-stonks-accent/10 p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-stonks-accent" />
                  <span className="font-semibold text-stonks-accent text-sm">Transaction Pending</span>
                </div>
                <div className="mt-1 text-stonks-light/70 text-xs">
                  Waiting for blockchain confirmation...
                </div>
                <a
                  href={mintState.transaction.blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center space-x-1 text-stonks-accent text-xs underline hover:text-stonks-green"
                >
                  <span>View Transaction</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {mintState.success ? (
                <button
                  type="button"
                  onClick={handleSuccess}
                  className="flex w-full items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-stonks-green to-stonks-accent px-6 py-4 font-rajdhani font-semibold text-stonks-dark transition-all hover:scale-105 hover:from-stonks-accent hover:to-stonks-green"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Complete</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleMint}
                  disabled={mintState.isLoading || !!mintState.transaction}
                  className={`flex w-full items-center justify-center space-x-3 rounded-xl px-6 py-4 font-rajdhani font-semibold transition-all ${
                    mintState.isLoading || !!mintState.transaction
                      ? 'cursor-not-allowed bg-stonks-gray/60 text-stonks-light/50'
                      : 'bg-gradient-to-r from-stonks-green to-stonks-accent text-stonks-dark hover:scale-105 hover:from-stonks-accent hover:to-stonks-green'
                  }`}
                >
                  {mintState.isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Minting...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>{web3State.isConnected ? 'Mint NFT' : 'Connect Wallet to Mint'}</span>
                    </>
                  )}
                </button>
              )}

              {/* Cancel/Close */}
              {!mintState.isLoading && !mintState.transaction && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full rounded-xl border border-stonks-light/20 bg-stonks-light/10 px-4 py-3 font-rajdhani font-semibold text-stonks-light transition-all hover:bg-stonks-light/20"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 rounded-lg border border-stonks-light/10 bg-stonks-light/5 p-3 text-center">
              <p className="text-stonks-light/60 text-xs">
                By minting, you agree that this is a test implementation. 
                Please ensure you're on the correct network before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Connector Modal */}
      <WalletConnector 
        isOpen={showWalletConnector} 
        onClose={() => setShowWalletConnector(false)} 
      />
    </>
  );
};