import { Check, Palette } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

interface ReactColorfulPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
  disabled?: boolean;
}

export const ReactColorfulPicker: React.FC<ReactColorfulPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = ['#FFFFFF', '#F7E98E', '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD'],
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Update input value when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePresetClick = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setInputValue(hex); // Update local state immediately for free typing

    // Only update the actual color when we have a valid 6-character hex
    if (hex.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  const handleHexBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    // Validate and fix hex code on blur
    if (hex.length === 7 && /^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex);
    } else if (hex.length > 1 && !hex.startsWith('#')) {
      // Add # if missing
      const fixedHex = `#${hex.replace('#', '')}`;
      if (/^#[0-9A-Fa-f]{6}$/.test(fixedHex)) {
        onChange(fixedHex);
        setInputValue(fixedHex);
      }
    } else {
      // Reset to original value if invalid
      setInputValue(value);
    }
  };

  return (
    <fieldset className="space-y-3">
      {label && <legend className="stonks-text block font-bold text-sm">{label}</legend>}

      <div className="space-y-3">
        {/* Color Picker Toggle */}
        <div className="relative flex items-center space-x-2">
          <Palette className="h-4 w-4 text-stonks-light/70" />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            className="h-8 w-12 rounded border-2 border-stonks-gray transition-colors hover:border-stonks-accent disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: value }}
            title="Open color picker"
          />
          <input
            type="text"
            value={inputValue}
            onChange={handleHexInput}
            onBlur={handleHexBlur}
            disabled={disabled}
            placeholder="#000000"
            className="flex-1 rounded-lg border-2 border-stonks-gray/50 bg-stonks-gray/80 px-3 py-2 font-mono text-sm text-stonks-light transition-all duration-200 focus:border-stonks-accent focus:outline-none focus:ring-2 focus:ring-stonks-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
            maxLength={7}
          />
        </div>

        {/* Preset Colors */}
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => handlePresetClick(color)}
              disabled={disabled}
              className={`relative h-8 w-8 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                value === color
                  ? 'stonks-glow scale-110 border-stonks-green shadow-lg'
                  : 'border-stonks-gray hover:border-stonks-accent'
              }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              style={{ backgroundColor: color }}
              title={color}
            >
              {value === color && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
              )}
            </button>
          ))}
        </div>

        {/* Color Picker Popup */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <button
              type="button"
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsOpen(false);
                }
              }}
            />
            {/* Picker */}
            <div
              className="fixed z-50 rounded-lg border border-stonks-gray bg-stonks-dark p-4 shadow-xl"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '320px',
              }}
            >
              <div className="space-y-4">
                {/* Color Preview */}
                <div className="flex items-center space-x-3">
                  <div
                    className="h-12 w-12 rounded-lg border-2 border-stonks-gray"
                    style={{ backgroundColor: value }}
                  />
                  <div className="flex-1">
                    <div className="stonks-text font-bold text-sm">Current Color</div>
                    <div className="font-mono text-stonks-light/70 text-xs">
                      {value.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* React Colorful Picker */}
                <div className="flex justify-center">
                  <HexColorPicker color={value} onChange={onChange} />
                </div>

                {/* Quick Color Grid */}
                <div className="space-y-2">
                  <legend className="stonks-text font-bold text-xs">Quick Colors</legend>
                  <div className="grid grid-cols-8 gap-1">
                    {[
                      '#000000',
                      '#333333',
                      '#666666',
                      '#999999',
                      '#CCCCCC',
                      '#FFFFFF',
                      '#FF0000',
                      '#FF8000',
                      '#FFFF00',
                      '#80FF00',
                      '#00FF00',
                      '#00FF80',
                      '#00FFFF',
                      '#0080FF',
                      '#0000FF',
                      '#8000FF',
                      '#FF00FF',
                      '#FF0080',
                      '#800000',
                      '#808000',
                      '#008000',
                      '#008080',
                      '#000080',
                      '#800080',
                    ].map((color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => handlePresetClick(color)}
                        className="h-6 w-6 rounded border border-stonks-gray transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </fieldset>
  );
};
