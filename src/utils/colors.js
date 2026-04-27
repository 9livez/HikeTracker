export const PRESET_COLORS = [
  '#4548edff', // Indigo
  '#d61919ff', // Red
  '#ffb73bff', // Amber
  '#03ac73ff', // Emerald
  '#0caffaff', // Sky Blue
  '#af58ffff', // Violet
  '#ff4ea7ff', // Pink
  '#84CC16'  // Lime
];

/**
 * Resolves the actual hex color from the style object.
 * Prioritizes colorIndex to ensure the route follows the current palette.
 */
export function resolveColor(style) {
  if (!style) return PRESET_COLORS[0];

  // 1. Check for colorIndex first (Priority)
  if (style.colorIndex !== undefined && style.colorIndex !== null) {
    const index = parseInt(style.colorIndex);
    if (!isNaN(index) && index >= 0 && index < PRESET_COLORS.length) {
      return PRESET_COLORS[index];
    }
  }

  // 2. Fallback to hex color if index is missing or invalid
  if (style.color && typeof style.color === 'string' && style.color.startsWith('#')) {
    return style.color;
  }

  // 3. Last resort fallback to first palette color
  return PRESET_COLORS[0];
}

/**
 * Ensures a route has a colorIndex, snapping it from hex if necessary.
 * Used during import/load to fix legacy or external data.
 */
export function ensureColorIndex(style) {
  if (!style) return { colorIndex: 0, color: PRESET_COLORS[0] };

  // If already has a valid index, we are good
  if (style.colorIndex !== undefined && style.colorIndex !== null) {
    const idx = parseInt(style.colorIndex);
    if (!isNaN(idx) && idx >= 0 && idx < PRESET_COLORS.length) {
      return { ...style, colorIndex: idx, color: PRESET_COLORS[idx] };
    }
  }

  // Try to snap hex to palette
  const hex = style.color;
  const foundIndex = PRESET_COLORS.indexOf(hex);
  if (foundIndex !== -1) {
    return { ...style, colorIndex: foundIndex, color: hex };
  }

  // If not in palette, default to index 0
  return { ...style, colorIndex: 0, color: PRESET_COLORS[0] };
}
