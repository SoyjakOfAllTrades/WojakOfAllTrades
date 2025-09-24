import { useCallback, useEffect, useState } from 'react';
import { web3Manager, type Web3State } from '../utils/web3';

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    account: null,
    provider: null,
    signer: null,
    chainId: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateState = useCallback(() => {
    setWeb3State(web3Manager.getState());
  }, []);

  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setError(null);
    
    try {
      const newState = await web3Manager.connectWallet();
      setWeb3State(newState);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnectWallet = useCallback(async () => {
    try {
      await web3Manager.disconnectWallet();
      setWeb3State({
        isConnected: false,
        account: null,
        provider: null,
        signer: null,
        chainId: null,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect wallet');
    }
  }, []);

  const switchNetwork = useCallback(async (chainId: number) => {
    setError(null);
    try {
      await web3Manager.switchNetwork(chainId);
      updateState();
    } catch (err: any) {
      setError(err.message || 'Failed to switch network');
    }
  }, [updateState]);

  const getBalance = useCallback(async (address?: string) => {
    try {
      return await web3Manager.getBalance(address);
    } catch (err: any) {
      setError(err.message || 'Failed to get balance');
      return '0';
    }
  }, []);

  // Listen for wallet events
  useEffect(() => {
    const handleAccountChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      setWeb3State(prev => ({
        ...prev,
        account: customEvent.detail.account,
        isConnected: !!customEvent.detail.account,
      }));
    };

    const handleChainChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      setWeb3State(prev => ({
        ...prev,
        chainId: customEvent.detail.chainId,
      }));
    };

    window.addEventListener('walletAccountChanged', handleAccountChanged);
    window.addEventListener('walletChainChanged', handleChainChanged);

    return () => {
      window.removeEventListener('walletAccountChanged', handleAccountChanged);
      window.removeEventListener('walletChainChanged', handleChainChanged);
    };
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            // Auto-connect if already authorized
            await connectWallet();
          }
        } catch (err) {
          console.log('No existing connection found');
        }
      }
    };

    checkConnection();
  }, [connectWallet]);

  return {
    web3State,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getBalance,
    clearError: () => setError(null),
  };
};