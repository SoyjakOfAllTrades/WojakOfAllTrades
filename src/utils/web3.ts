import { ethers } from 'ethers';

export interface Web3State {
  isConnected: boolean;
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;
}

export interface ContractConfig {
  address: string;
  abi: readonly string[] | ethers.Interface;
}

export class Web3Manager {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private account: string | null = null;
  private chainId: number | null = null;

  async connectWallet(): Promise<Web3State> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.account = await this.signer.getAddress();
      
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);

      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      return this.getState();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async disconnectWallet(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.chainId = null;

    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.disconnectWallet();
    } else {
      this.account = accounts[0];
    }
    // Emit custom event for React components to listen to
    window.dispatchEvent(new CustomEvent('walletAccountChanged', { 
      detail: { account: this.account } 
    }));
  }

  private handleChainChanged(chainId: string): void {
    this.chainId = parseInt(chainId, 16);
    window.dispatchEvent(new CustomEvent('walletChainChanged', { 
      detail: { chainId: this.chainId } 
    }));
  }

  getState(): Web3State {
    return {
      isConnected: !!this.account,
      account: this.account,
      provider: this.provider,
      signer: this.signer,
      chainId: this.chainId,
    };
  }

  async switchNetwork(targetChainId: number): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        throw new Error(`Please add chain ${targetChainId} to your MetaMask`);
      }
      throw switchError;
    }
  }

  getContract(config: ContractConfig): ethers.Contract | null {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(config.address, config.abi, this.signer);
  }

  async getBalance(address?: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not available');
    }
    
    const targetAddress = address || this.account;
    if (!targetAddress) {
      throw new Error('No address provided');
    }

    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  async estimateGas(contract: ethers.Contract, method: string, params: any[]): Promise<bigint> {
    return await contract[method].estimateGas(...params);
  }

  async getGasPrice(): Promise<bigint> {
    if (!this.provider) {
      throw new Error('Provider not available');
    }
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice || BigInt(0);
  }
}

// Global instance
export const web3Manager = new Web3Manager();

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeAllListeners: () => void;
    };
  }
}