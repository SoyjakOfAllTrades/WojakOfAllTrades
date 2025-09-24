import { useCallback, useState } from 'react';
import { nftMinter, type MintTransaction, type NFTMetadata } from '../utils/nftMinter';
import type { WojakCharacter } from '../types/wojak';
import { useWeb3 } from './useWeb3';

export interface MintState {
  isLoading: boolean;
  transaction: MintTransaction | null;
  error: string | null;
  success: boolean;
}

export const useNFTMinting = () => {
  const { web3State } = useWeb3();
  const [mintState, setMintState] = useState<MintState>({
    isLoading: false,
    transaction: null,
    error: null,
    success: false,
  });

  const resetMintState = useCallback(() => {
    setMintState({
      isLoading: false,
      transaction: null,
      error: null,
      success: false,
    });
  }, []);

  const uploadMetadata = useCallback(async (metadata: NFTMetadata, image: string): Promise<string> => {
    // For now, return a mock URL. In production, you would upload to IPFS
    // Example using Pinata, NFT.Storage, or your own IPFS node
    const mockMetadata = {
      ...metadata,
      image,
    };
    
    // Mock IPFS hash - replace with actual IPFS upload
    const mockHash = `ipfs://QmMockHash${Date.now()}`;
    console.log('Mock metadata uploaded:', mockMetadata);
    return mockHash;
  }, []);

  const generateImageDataUrl = useCallback(async (wojak: WojakCharacter): Promise<string> => {
    // Create a canvas to render the wojak
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }

    // Set background
    ctx.fillStyle = wojak.background.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some basic rendering - in production you'd render the actual wojak
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(wojak.name || 'Wojak DIID', canvas.width / 2, canvas.height / 2);
    ctx.fillText(`Template: ${wojak.template}`, canvas.width / 2, canvas.height / 2 + 30);
    ctx.fillText(`Hat: ${wojak.hat}`, canvas.width / 2, canvas.height / 2 + 60);
    ctx.fillText(`Glasses: ${wojak.glasses}`, canvas.width / 2, canvas.height / 2 + 90);

    return canvas.toDataURL('image/png');
  }, []);

  const mintNFT = useCallback(async (wojak: WojakCharacter) => {
    if (!web3State.isConnected || !web3State.account || !web3State.chainId) {
      throw new Error('Wallet not connected');
    }

    setMintState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }));

    try {
      // Initialize the NFT minter for the current network
      await nftMinter.initialize(web3State.chainId);

      // Generate image data
      const imageDataUrl = await generateImageDataUrl(wojak);

      // Generate metadata
      const metadata = nftMinter.generateMetadata(wojak);

      // Upload metadata to IPFS (mock implementation)
      const metadataUrl = await uploadMetadata(metadata, imageDataUrl);

      // Mint the NFT
      const transaction = await nftMinter.mintNFT(
        wojak,
        web3State.account,
        metadataUrl
      );

      setMintState(prev => ({
        ...prev,
        transaction,
        isLoading: false,
      }));

      // Wait for confirmation in the background
      nftMinter.waitForConfirmation(transaction.hash).then((confirmedTx) => {
        setMintState(prev => ({
          ...prev,
          transaction: confirmedTx,
          success: confirmedTx.status === 'confirmed',
          error: confirmedTx.status === 'failed' ? 'Transaction failed' : null,
        }));
      });

      return transaction;
    } catch (error: any) {
      console.error('Minting error:', error);
      setMintState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to mint NFT',
      }));
      throw error;
    }
  }, [web3State, generateImageDataUrl, uploadMetadata]);

  const getContractInfo = useCallback(async () => {
    if (!web3State.chainId) {
      return null;
    }

    try {
      await nftMinter.initialize(web3State.chainId);
      return await nftMinter.getContractInfo();
    } catch (error) {
      console.error('Failed to get contract info:', error);
      return null;
    }
  }, [web3State.chainId]);

  return {
    mintState,
    mintNFT,
    resetMintState,
    getContractInfo,
    contractConfig: nftMinter.getConfig(),
  };
};