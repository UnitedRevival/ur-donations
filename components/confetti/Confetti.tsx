import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface ConfettiProps {
  children?: any;
  mKey?: any;
}

const maxDistanceX = 250;
const minDistanceX = 100;
const maxDistanceY = 150;

const maxOffsetX = 50;
const maxOffsetY = 50;

const getRandomBoolean = () => {
  return Math.floor(Math.random() + 1) === 1;
};

const Confetti: React.FC<ConfettiProps> = ({ children, mKey }) => {
  const [opacity, setOpacity] = useState(1);
  const animate = useMemo(
    () => ({
      x: Math.floor(Math.random() * maxDistanceX),
      y: Math.floor(Math.random() * maxDistanceY),
      offsetX:
        (getRandomBoolean() ? 1 : -1) * Math.floor(Math.random() * maxOffsetX),
      offsetY:
        (getRandomBoolean() ? 1 : -1) * Math.floor(Math.random() * maxOffsetY),
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setOpacity(0);
    }, 2000);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 + animate.offsetY, x: animate.offsetX }}
      transition={{
        duration: 2.1,
        ease: 'easeOut',
      }}
      animate={{ opacity, x: animate.x, y: animate.y }}
      exit={{ opacity: 0 }}
      key={mKey}
      style={{ position: 'absolute', fontSize: 28 }}
    >
      {children}
    </motion.div>
  );
};

// Goal based animations
export default Confetti;
