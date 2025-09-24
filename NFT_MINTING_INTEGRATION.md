# NFT Minting Integration

This document explains the NFT minting functionality that has been integrated into the Wojak of All Trades application.

## Overview

The "Mint DIID" button now supports actual blockchain NFT minting through Web3 integration, in addition to the existing local storage functionality.

## New Features

### 🔗 Web3 Integration
- **MetaMask Connection**: Users can connect their MetaMask wallet to mint NFTs
- **Multi-Network Support**: Supports Ethereum Mainnet, Goerli, Sepolia, and Polygon
- **Gas Estimation**: Automatic gas estimation with 20% buffer for reliable transactions
- **Transaction Tracking**: Real-time transaction status updates with blockchain explorer links

### 🎨 NFT Metadata Generation
- **Automatic Metadata**: Generates ERC-721 compliant metadata for each Wojak
- **Trait Attributes**: Includes all Wojak traits (template, hat, glasses, mask, background)
- **Image Generation**: Creates base64 image representation (ready for IPFS integration)
- **Collection Info**: Supports collection name, symbol, and description

### 💼 Smart Contract Integration
- **ERC-721 Compatible**: Works with standard NFT contracts
- **Configurable Contracts**: Easy network and contract address configuration
- **Event Parsing**: Extracts token ID from mint transaction events
- **Contract Info Display**: Shows collection name, symbol, and total supply

## File Structure

```
src/
├── utils/
│   ├── web3.ts              # Web3 provider and wallet management
│   └── nftMinter.ts         # NFT contract interaction and minting logic
├── hooks/
│   ├── useWeb3.ts           # React hook for Web3 state management
│   └── useNFTMinting.ts     # React hook for NFT minting operations
└── components/
    ├── WalletConnector.tsx  # Wallet connection modal
    ├── NFTMintingModal.tsx  # NFT minting interface
    └── WojakPreview.tsx     # Updated with NFT minting button
```

## How It Works

1. **User Clicks "Mint DIID"**: Opens the NFT minting modal
2. **Wallet Connection**: If not connected, prompts user to connect MetaMask
3. **Network Check**: Verifies user is on supported network
4. **Contract Initialization**: Loads the appropriate NFT contract for the network
5. **Metadata Generation**: Creates NFT metadata with Wojak traits
6. **Transaction Execution**: Calls the mint function on the smart contract
7. **Confirmation**: Waits for blockchain confirmation and displays results

## Smart Contract Requirements

The integration expects an ERC-721 contract with the following function:

```solidity
function mint(address to, string memory tokenURI) public returns (uint256)
```

### Contract Configuration

Update the contract addresses in `src/utils/nftMinter.ts`:

```typescript
export const NFT_CONTRACTS: Record<string, NFTContractConfig> = {
  mainnet: {
    address: '0xYourContractAddress', // Replace with actual address
    name: 'Wojak DIID Collection',
    symbol: 'WDIID',
    chainId: 1,
    blockExplorer: 'https://etherscan.io',
  },
  // ... other networks
};
```

## Usage Instructions

### For Users
1. Build your Wojak character
2. Give it a name
3. Click "Mint DIID"
4. Connect your MetaMask wallet if not already connected
5. Confirm the transaction in MetaMask
6. Wait for blockchain confirmation
7. View your NFT on the blockchain explorer

### For Developers
1. Deploy your ERC-721 contract
2. Update contract addresses in `nftMinter.ts`
3. Configure IPFS storage for metadata (currently uses mock implementation)
4. Test on testnets before mainnet deployment

## IPFS Integration (Production Ready)

For production use, replace the mock metadata upload in `useNFTMinting.ts`:

```typescript
const uploadMetadata = async (metadata: NFTMetadata, image: string): Promise<string> => {
  // Example with Pinata
  const formData = new FormData();
  formData.append('file', new Blob([JSON.stringify({...metadata, image})], {type: 'application/json'}));
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });
  
  const result = await response.json();
  return `ipfs://${result.IpfsHash}`;
};
```

## Error Handling

The integration includes comprehensive error handling:
- **Wallet Connection Errors**: Clear messages for installation, connection issues
- **Network Errors**: Prompts to switch to supported networks
- **Transaction Errors**: Gas estimation failures, insufficient funds, user rejection
- **Contract Errors**: Invalid contract addresses, ABI mismatches

## Security Considerations

- **Contract Verification**: Always verify smart contracts on blockchain explorers
- **Network Validation**: Users are warned about network compatibility
- **Gas Limits**: Automatic gas estimation with safety buffers
- **User Consent**: Clear transaction details before execution

## Testing

Test the integration on testnets first:
1. **Goerli/Sepolia**: Use test ETH from faucets
2. **Polygon Mumbai**: Use test MATIC tokens
3. **Local Development**: Use Hardhat or Ganache for local testing

## Migration from NFT-MAIN Project

To capture specific functionality from your NFT-MAIN project:

1. **Copy Contract ABI**: Update `NFT_CONTRACT_ABI` in `nftMinter.ts`
2. **Custom Functions**: Add any special mint functions your contract uses
3. **Additional Parameters**: Modify mint functions if they require extra parameters
4. **Event Handling**: Update event parsing for your contract's specific events

## Dependencies

New dependencies added:
- `ethers@^6.x`: Ethereum library for Web3 interactions
- `@metamask/detect-provider`: MetaMask detection utility

## Browser Compatibility

- **MetaMask**: Primary wallet support
- **WalletConnect**: Can be added for broader wallet support
- **Mobile**: Works with MetaMask mobile browser

## Next Steps

1. **Deploy Smart Contracts**: Deploy your NFT collection contracts
2. **IPFS Setup**: Configure decentralized storage for metadata
3. **Testing**: Comprehensive testing on testnets
4. **Security Audit**: Audit smart contracts before mainnet
5. **UI/UX Polish**: Customize the minting interface to match your brand

The NFT minting functionality is now fully integrated and ready for production use once you configure your smart contracts and IPFS storage!