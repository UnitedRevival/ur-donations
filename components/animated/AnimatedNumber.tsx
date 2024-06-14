'use client';

import { MotionStyle, motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

function AnimatedNumber({
  value,
  style,
  prefix,
}: {
  value: number;
  style?: MotionStyle;
  prefix?: string;
}) {
  let spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  let display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    // @ts-ignore
    <span style={style}>
      {prefix}
      <motion.span style={style}>{display}</motion.span>
    </span>
  );
}

export default AnimatedNumber;
