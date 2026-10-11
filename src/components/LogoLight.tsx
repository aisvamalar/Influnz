/**
 * logo.png for dark backgrounds: drops the baked-in white background, keeps the
 * coral "i" mark in colour and turns the dark wordmark white.
 */
import { useId } from 'react';
import logoImg from '../assets/logo.png';

const IMG_W = 1983;
const IMG_H = 793;
/** x (in image pixels) between the coloured mark and the wordmark. */
const SPLIT = 489;

const BOXES = {
  full: { x: 300, y: 172, w: 1380, h: 428 },
  mark: { x: 300, y: 172, w: 204, h: 428 },
};

interface LogoLightProps {
  height: number;
  variant?: keyof typeof BOXES;
  className?: string;
  title?: string;
}

export default function LogoLight({ height, variant = 'full', className, title = 'Influnz' }: LogoLightProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const box = BOXES[variant];
  const width = Math.round((height * box.w) / box.h);
  const ids = { mark: `ll-m-${uid}`, word: `ll-w-${uid}`, markClip: `ll-mc-${uid}`, wordClip: `ll-wc-${uid}` };

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      role="img"
      aria-label={title}
    >
      <defs>
        <filter id={ids.mark} filterUnits="userSpaceOnUse" x="0" y="0" width={IMG_W} height={IMG_H} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 -2.2 0 2.2" />
        </filter>
        <filter id={ids.word} filterUnits="userSpaceOnUse" x="0" y="0" width={IMG_W} height={IMG_H} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -0.39 -0.767 -0.143 0 1.3" />
        </filter>
        <clipPath id={ids.markClip}>
          <rect x="0" y="0" width={SPLIT} height={IMG_H} />
        </clipPath>
        <clipPath id={ids.wordClip}>
          <rect x={SPLIT} y="0" width={IMG_W - SPLIT} height={IMG_H} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${ids.markClip})`}>
        <image href={logoImg} width={IMG_W} height={IMG_H} filter={`url(#${ids.mark})`} />
      </g>
      {variant === 'full' && (
        <g clipPath={`url(#${ids.wordClip})`}>
          <image href={logoImg} width={IMG_W} height={IMG_H} filter={`url(#${ids.word})`} />
        </g>
      )}
    </svg>
  );
}
