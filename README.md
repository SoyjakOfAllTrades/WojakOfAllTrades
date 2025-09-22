# Wojak of All Trades 🎨

A fun and interactive webapp for building unique wojak characters with NFT-ready features!

## Features

- 🎭 **Character Builder**: Drag-and-drop interface for customizing wojak characters
- 🎨 **Multiple Categories**: Customize base features, eyes, mouth, hair, accessories, and backgrounds
- 🎲 **Random Generator**: Generate random wojak characters with one click
- 🏆 **Rarity System**: Different rarity levels for character traits (Common, Uncommon, Rare, Epic, Legendary)
- 📱 **Responsive Design**: Works great on desktop and mobile devices
- 🎯 **NFT Ready**: Built with future NFT minting in mind

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and visit `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── WojakBuilder.tsx    # Main builder component
│   ├── WojakCanvas.tsx     # Canvas for character display
│   ├── WojakRenderer.tsx   # Character rendering logic
│   ├── WojakControls.tsx   # Control panel
│   ├── CategoryTabs.tsx    # Category selection tabs
│   ├── PartSelector.tsx    # Part selection interface
│   ├── WojakPreview.tsx    # Preview and actions
│   └── Header.tsx          # App header
├── data/               # Static data
│   └── wojakParts.ts      # Character parts and options
├── types/              # TypeScript type definitions
│   └── wojak.ts           # Wojak character types
├── utils/              # Utility functions
│   ├── wojakGenerator.ts  # Random character generation
│   └── cn.ts              # Class name utility
└── App.tsx             # Main app component
```

## Future Features

- 🔗 **Blockchain Integration**: Connect to Ethereum/Polygon for NFT minting
- 🎨 **Advanced Customization**: More detailed character customization options
- 🌐 **Social Features**: Share and discover community-created wojaks
- 🏪 **Marketplace**: Buy, sell, and trade wojak NFTs
- 🎮 **Gamification**: Achievements, levels, and rewards

## Contributing

Feel free to contribute to this project! Some areas that could use improvement:

- More character customization options
- Better mobile experience
- Animation improvements
- Accessibility enhancements
- Performance optimizations

## License

MIT License - feel free to use this project for your own wojak adventures!
