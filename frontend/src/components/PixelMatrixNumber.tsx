// 5x7 dot-matrix representations for digits 0-9 and special characters (/, %)

/**
 * 5x7 dot-matrix representations for digits 0-9 and special characters (/, %)
 * 1 = filled square dot, 0 = empty
 */
const MATRIX_GLYPHS: Record<string, number[][]> = {
  '0': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '1': [
    [0, 1, 0],
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  '2': [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
  ],
  '3': [
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '4': [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  '5': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '6': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '7': [
    [1, 1, 1],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  '8': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  '9': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],
  '/': [
    [0, 0, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  '%': [
    [1, 0, 1],
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
    [1, 0, 1],
  ],
};

interface PixelMatrixNumberProps {
  value: string | number;
  dotSize?: number;
  gap?: number;
  color?: string;
  label?: string;
}

export function PixelMatrixNumber({
  value,
  dotSize = 7,
  gap = 3,
  color = '#FFFFFF',
  label,
}: PixelMatrixNumberProps) {
  const chars = String(value).split('');

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${gap * 2.5}px`,
        userSelect: 'none',
      }}
      aria-label={label ? `${label}: ${value}` : String(value)}
    >
      {chars.map((char, charIdx) => {
        const glyph = MATRIX_GLYPHS[char] || MATRIX_GLYPHS['0'];
        const numRows = glyph.length;
        const numCols = glyph[0].length;
        const width = numCols * dotSize + (numCols - 1) * gap;
        const height = numRows * dotSize + (numRows - 1) * gap;

        return (
          <svg
            key={`${char}-${charIdx}`}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            aria-hidden="true"
          >
            {glyph.map((row, r) =>
              row.map((val, c) => {
                if (val === 0) return null;
                const x = c * (dotSize + gap);
                const y = r * (dotSize + gap);
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={x}
                    y={y}
                    width={dotSize}
                    height={dotSize}
                    rx={1.5}
                    fill={color}
                  />
                );
              }),
            )}
          </svg>
        );
      })}
    </div>
  );
}
