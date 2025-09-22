import type { WojakCharacter } from '../types/wojak';

export const exportWojakAsPNG = async (wojak: WojakCharacter): Promise<void> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Set canvas size (higher resolution for better quality)
  const size = 512;
  canvas.width = size;
  canvas.height = size;

  // Helper function to load an image
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Helper function to get image path
  const getTemplateImage = () => {
    if (wojak.template === 'NPC') {
      return `/wojak-parts/template/NPC.PNG`;
    }
    return `/wojak-parts/template/${wojak.template}.png`;
  };

  const getHatImage = () => {
    return wojak.hat !== 'none'
      ? `/wojak-parts/accessories and clothing/hats/${wojak.hat}.png`
      : null;
  };

  const getGlassesImage = () => {
    return wojak.glasses !== 'none'
      ? `/wojak-parts/accessories and clothing/glasses/${wojak.glasses}.png`
      : null;
  };

  const getMaskImage = () => {
    return wojak.mask !== 'none'
      ? `/wojak-parts/accessories and clothing/masks/${wojak.mask}.png`
      : null;
  };

  try {
    // Draw background
    ctx.fillStyle = wojak.background.color;
    ctx.fillRect(0, 0, size, size);

    // Draw background pattern
    const patternColor = wojak.background.patternColor || '#000000';

    if (wojak.background.pattern === 'stonks') {
      // Load and draw stonks background image
      try {
        const stonksImg = await loadImage('/wojak-parts/backgrounds/stonks.webp');
        ctx.drawImage(stonksImg, 0, 0, size, size);
      } catch (_error) {
        console.warn('Could not load stonks background image, using fallback pattern');
        // Fallback to generated pattern
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 2;
        for (let x = 0; x < size; x += 40) {
          for (let y = 0; y < size; y += 40) {
            // Diagonal lines
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y + 40);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 40, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();
            // Connection points
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    } else if (wojak.background.pattern === 'not-stonks') {
      // Load and draw not stonks background image
      try {
        const notStonksImg = await loadImage('/wojak-parts/backgrounds/not stonks.png');
        ctx.drawImage(notStonksImg, 0, 0, size, size);
      } catch (_error) {
        console.warn('Could not load not stonks background image, using fallback pattern');
        // Fallback to generated pattern
        ctx.strokeStyle = patternColor;
        ctx.lineWidth = 2;
        for (let x = 0; x < size; x += 40) {
          for (let y = 0; y < size; y += 40) {
            // Diagonal lines (inverted from stonks)
            ctx.beginPath();
            ctx.moveTo(x + 40, y);
            ctx.lineTo(x, y + 40);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 40, y + 40);
            ctx.stroke();
            // Connection points
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 3, 0, 2 * Math.PI);
            ctx.fill();
          }
        }
      }
    } else if (wojak.background.pattern === 'stars') {
      ctx.fillStyle = patternColor;
      const starPositions = [
        { x: 15, y: 25, size: 4 },
        { x: 35, y: 60, size: 4 },
        { x: 75, y: 35, size: 3 },
        { x: 110, y: 70, size: 3 },
        { x: 140, y: 25, size: 4 },
        { x: 170, y: 50, size: 3 },
        { x: 50, y: 10, size: 2 },
        { x: 90, y: 80, size: 2 },
      ];
      for (let i = 0; i < size / 120; i++) {
        for (let j = 0; j < size / 60; j++) {
          starPositions.forEach((star) => {
            ctx.beginPath();
            ctx.arc(star.x + i * 120, star.y + j * 60, star.size, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
      }
    } else if (wojak.background.pattern === 'matrix') {
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < size; x += 20) {
        for (let y = 0; y < size; y += 20) {
          // Grid lines
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 20, y);
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 20);
          ctx.stroke();
          // Connection points
          ctx.beginPath();
          ctx.arc(x + 20, y + 20, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    } else if (wojak.background.pattern === 'synthwave') {
      // Create gradient for synthwave effect
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, wojak.background.color);
      gradient.addColorStop(0.25, wojak.background.patternColor || '#ff0080');
      gradient.addColorStop(0.5, wojak.background.patternColor || '#00ffff');
      gradient.addColorStop(0.75, wojak.background.patternColor || '#ff0080');
      gradient.addColorStop(1, wojak.background.color);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    } else if (wojak.background.pattern === 'moon') {
      ctx.fillStyle = patternColor || '#c0c0c0';
      for (let x = 0; x < size; x += 100) {
        for (let y = 0; y < size; y += 100) {
          // Moon craters
          ctx.beginPath();
          ctx.arc(x + 30, y + 30, 20, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#e6e6e6';
          ctx.beginPath();
          ctx.arc(x + 70, y + 70, 15, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = '#f0f0f0';
          ctx.beginPath();
          ctx.arc(x + 50, y + 50, 10, 0, 2 * Math.PI);
          ctx.fill();
          ctx.fillStyle = patternColor || '#c0c0c0';
        }
      }
    } else if (wojak.background.pattern === 'cyberpunk') {
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 2;
      for (let x = 0; x < size; x += 35) {
        for (let y = 0; y < size; y += 35) {
          // Grid
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 35, y);
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 35);
          ctx.stroke();
          // Diagonal lines
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + 35, y + 35);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + 35, y);
          ctx.lineTo(x, y + 35);
          ctx.stroke();
          // Connection points
          ctx.beginPath();
          ctx.arc(x + 20, y + 20, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + 40, y + 40, 4, 0, 2 * Math.PI);
          ctx.fill();
          // Small accent points
          ctx.beginPath();
          ctx.arc(x + 10, y + 10, 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x + 30, y + 30, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }

    // Calculate scaled dimensions for wojak character (75% of canvas size)
    const wojakSize = size * 0.75;
    const wojakOffsetX = (size - wojakSize) / 2; // Center horizontally
    const wojakOffsetY = size - wojakSize; // Anchor to bottom

    // Load and draw template
    const templateImg = await loadImage(getTemplateImage());
    ctx.drawImage(templateImg, wojakOffsetX, wojakOffsetY, wojakSize, wojakSize);

    // Load and draw hat
    const hatSrc = getHatImage();
    if (hatSrc) {
      const hatImg = await loadImage(hatSrc);
      ctx.drawImage(hatImg, wojakOffsetX, wojakOffsetY, wojakSize, wojakSize);
    }

    // Load and draw glasses
    const glassesSrc = getGlassesImage();
    if (glassesSrc) {
      const glassesImg = await loadImage(glassesSrc);
      ctx.drawImage(glassesImg, wojakOffsetX, wojakOffsetY, wojakSize, wojakSize);
    }

    // Load and draw mask
    const maskSrc = getMaskImage();
    if (maskSrc) {
      const maskImg = await loadImage(maskSrc);
      ctx.drawImage(maskImg, wojakOffsetX, wojakOffsetY, wojakSize, wojakSize);
    }

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob from canvas');
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${wojak.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${wojak.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  } catch (error) {
    console.error('Error exporting wojak:', error);
    throw new Error('Failed to export wojak as PNG');
  }
};
