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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 760px)');
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <section className="loop-section" aria-label="구룡중 22기 동창회와 행사 일시">
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
            textBaselineOffset={isMobile ? 11 : 0}
            mobileSafeSpacing={isMobile}
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
