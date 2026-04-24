function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function accentVars(hex: string) {
  const [h, s, l] = hexToHsl(hex);
  return {
    accent: hex,
    accentHoverDark: `hsl(${h} ${s}% ${Math.min(95, l + 14)}%)`,
    accentSoftDark: `hsl(${h} ${s}% ${l}% / 0.12)`,
    accentHoverLight: `hsl(${h} ${s}% ${Math.max(5, l - 12)}%)`,
    accentSoftLight: `hsl(${h} ${s}% ${l}% / 0.09)`,
  };
}
