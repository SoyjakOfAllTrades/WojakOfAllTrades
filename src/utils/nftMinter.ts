import { ethers } from 'ethers';
import type { WojakCharacter } from '../types/wojak';
import { web3Manager } from './web3';

// Standard ERC-721 NFT Contract ABI (essential functions)
export const NFT_CONTRACT_ABI = [
  // Read functions
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function balanceOf(address owner) view returns (uint256)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function totalSupply() view returns (uint256)',
  
  // Write functions
  'function mint(address to, string memory tokenURI) public returns (uint256)',
  'function safeMint(address to, string memory tokenURI) public returns (uint256)',
  'function setTokenURI(uint256 tokenId, string memory tokenURI) public',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'event Mint(address indexed to, uint256 indexed tokenId, string tokenURI)',
] as const;

export interface NFTContractConfig {
  address: string;
  name: string;
  symbol: string;
  chainId: number;
  blockExplorer: string;
}

// Default configurations for different networks
export const NFT_CONTRACTS: Record<string, NFTContractConfig> = {
  mainnet: {
    address: '0x0000000000000000000000000000000000000000', // Replace with actual contract address
    name: 'Wojak DIID Collection',
    symbol: 'WDIID',
    chainId: 1,
    blockExplorer: 'https://etherscan.io',
  },
  goerli: {
    address: '0x0000000000000000000000000000000000000000', // Replace with actual contract address
    name: 'Wojak DIID Collection (Testnet)',
    symbol: 'WDIID',
    chainId: 5,
    blockExplorer: 'https://goerli.etherscan.io',
  },
  sepolia: {
    address: '0x0000000000000000000000000000000000000000', // Replace with actual contract address
    name: 'Wojak DIID Collection (Testnet)',
    symbol: 'WDIID',
    chainId: 11155111,
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  polygon: {
    address: '0x0000000000000000000000000000000000000000', // Replace with actual contract address
    name: 'Wojak DIID Collection',
    symbol: 'WDIID',
    chainId: 137,
    blockExplorer: 'https://polygonscan.com',
  },
};

export interface MintTransaction {
  hash: string;
  tokenId?: number;
  blockExplorer: string;
  gasUsed?: string;
  gasPrice?: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
}

export class NFTMinter {
  private contract: ethers.Contract | null = null;
  private config: NFTContractConfig | null = null;

  async initialize(chainId: number): Promise<void> {
    const networkName = this.getNetworkName(chainId);
    this.config = NFT_CONTRACTS[networkName];
    
    if (!this.config) {
      throw new Error(`Unsupported network with chain ID: ${chainId}`);
    }

    if (this.config.address === '0x0000000000000000000000000000000000000000') {
      throw new Error(`Contract not deployed on ${networkName}. Please update the contract address.`);
    }

    this.contract = web3Manager.getContract({
      address: this.config.address,
      abi: NFT_CONTRACT_ABI as readonly string[],
    });
  }

  private getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1: return 'mainnet';
      case 5: return 'goerli';
      case 11155111: return 'sepolia';
      case 137: return 'polygon';
      default: return 'unknown';
    }
  }

  async mintNFT(
    _wojak: WojakCharacter,
    recipientAddress: string,
    metadataUrl: string
  ): Promise<MintTransaction> {
    if (!this.contract || !this.config) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }

    try {
      // Estimate gas for the mint function
      const gasEstimate = await this.contract.mint.estimateGas(recipientAddress, metadataUrl);
      const gasLimit = gasEstimate * BigInt(120) / BigInt(100); // Add 20% buffer

      // Get current gas price
      const gasPrice = await web3Manager.getGasPrice();

      // Execute transaction
      const tx = await this.contract.mint(recipientAddress, metadataUrl, {
        gasLimit,
        gasPrice,
      });

      console.log('Minting transaction submitted:', tx.hash);

      return {
        hash: tx.hash,
        blockExplorer: `${this.config.blockExplorer}/tx/${tx.hash}`,
        gasUsed: gasEstimate.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        status: 'pending',
      };
    } catch (error: any) {
      console.error('Minting failed:', error);
      throw new Error(`Minting failed: ${error.message || error.reason || 'Unknown error'}`);
    }
  }

  async waitForConfirmation(txHash: string): Promise<MintTransaction> {
    if (!this.contract || !this.config) {
      throw new Error('Contract not initialized');
    }

    try {
      const web3State = web3Manager.getState();
      if (!web3State.provider) {
        throw new Error('Provider not available');
      }

      const receipt = await web3State.provider.waitForTransaction(txHash);
      
      if (receipt.status === 0) {
        return {
          hash: txHash,
          blockExplorer: `${this.config.blockExplorer}/tx/${txHash}`,
          status: 'failed',
        };
      }

      // Try to extract token ID from transaction receipt
      let tokenId: number | undefined;
      try {
        const logs = receipt.logs;
        for (const log of logs) {
          try {
            const parsedLog = this.contract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'Transfer' && parsedLog.args.from === ethers.ZeroAddress) {
              tokenId = Number(parsedLog.args.tokenId);
              break;
            }
          } catch {
            // Ignore parsing errors for non-contract logs
          }
        }
      } catch (error) {
        console.warn('Could not extract token ID from transaction:', error);
      }

      return {
        hash: txHash,
        tokenId,
        blockExplorer: `${this.config.blockExplorer}/tx/${txHash}`,
        gasUsed: receipt.gasUsed.toString(),
        status: 'confirmed',
      };
    } catch (error: any) {
      console.error('Transaction confirmation failed:', error);
      return {
        hash: txHash,
        blockExplorer: `${this.config.blockExplorer}/tx/${txHash}`,
        status: 'failed',
      };
    }
  }

  generateMetadata(wojak: WojakCharacter): NFTMetadata {
    return {
      name: wojak.name || `Wojak DIID #${wojak.id}`,
      description: `A unique Wojak Digital Identity (DIID) card from the Wojak of All Trades collection. First mint, first served with memestonks cyberpunk style.`,
      image: '', // This should be populated with IPFS URL or data URL
      external_url: `https://wojakoftrades.com/wojak/${wojak.id}`,
      attributes: [
        {
          trait_type: 'Template',
          value: wojak.template,
        },
        {
          trait_type: 'Hat',
          value: wojak.hat === 'none' ? 'None' : wojak.hat,
        },
        {
          trait_type: 'Glasses',
          value: wojak.glasses === 'none' ? 'None' : wojak.glasses,
        },
        {
          trait_type: 'Mask',
          value: wojak.mask === 'none' ? 'None' : wojak.mask,
        },
        {
          trait_type: 'Background Color',
          value: wojak.background.color,
        },
        {
          trait_type: 'Background Pattern',
          value: wojak.background.pattern,
        },
        {
          trait_type: 'Creation Date',
          value: wojak.createdAt.toISOString().split('T')[0],
          display_type: 'date',
        },
      ],
    };
  }

  async getContractInfo(): Promise<{ name: string; symbol: string; totalSupply: number } | null> {
    if (!this.contract) {
      return null;
    }

    try {
      const [name, symbol, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.totalSupply(),
      ]);

      return {
        name,
        symbol,
        totalSupply: Number(totalSupply),
      };
    } catch (error) {
      console.error('Failed to get contract info:', error);
      return null;
    }
  }

  getConfig(): NFTContractConfig | null {
    return this.config;
  }
}

// Global NFT minter instance
export const nftMinter = new NFTMinter();