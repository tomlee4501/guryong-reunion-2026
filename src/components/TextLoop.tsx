import { useEffect, useState } from 'react';
import ReactBitsTextLoop from './reactbits/TextLoop';
import { LOOP_LINES } from '../lib/constants';

/**
 * Genuine React Bits SVG-path ribbon marquee; unlike the previous text swap,
 * the whole message continuously moves along a curved wave.
 * Source: https://reactbits.dev/text-animations/text-loop
 */
export default function TextLoop() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section className="loop-section" aria-label="구룡중학교 동창회와 행사 일시">
      <div className="loop-ribbon-stage">
        {reducedMotion ? (
          <div className="loop-ribbon-fallback">
            {LOOP_LINES[0]} <span aria-hidden="true">✦</span> {LOOP_LINES[1]}
          </div>
        ) : (
          <ReactBitsTextLoop
            text={LOOP_LINES.join('  ✦  ')}
            shape="wave"
            direction="forward"
            speed={70}
            separator="✦"
            curviness={24}
            fontSize={32}
            fontWeight={800}
            letterSpacing={0}
            uppercase={false}
            ribbon
            ribbonColor="#DFFF7A"
            ribbonWidth={52}
            color="#15171E"
            edgeFade={0.18}
            pauseOnHover
            cross={false}
            draggable={false}
            scrollBoost={0}
          />
        )}
      </div>
      <span className="sr-only">{LOOP_LINES.join(' · ')}</span>
    </section>
  );
}
