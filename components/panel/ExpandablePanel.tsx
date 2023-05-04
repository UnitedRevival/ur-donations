import { AnimatePresence, motion } from 'framer-motion';
import useMeasure from 'react-use-measure';
import styled from 'styled-components';

interface ExpandablePanelProps {
  children?: any;
  animateKey: any;
  className?: any;
  slide: 'Left' | 'Right';
}

const fadeDistance = 100;

const variants = {
  slideLeftInitial: {
    opacity: 0,
    x: fadeDistance,
  },
  slideLeftExit: {
    opacity: 0,
    x: fadeDistance,
  },

  slideRightInitial: {
    opacity: 0,
    x: -fadeDistance,
  },
  slideRightExit: {
    opacity: 0,
    x: -fadeDistance,
  },
};

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  children,
  animateKey,
  className,
  slide,
}) => {
  const [ref, { height }] = useMeasure();
  return (
    <motion.div
      animate={{ height }}
      transition={{
        duration: 0.15,
      }}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={animateKey}
          variants={variants}
          initial={`slide${slide}Initial`}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.15,
            delay: 0.15,
          }}
          exit={`slide${slide}Exit`}
        >
          <Content ref={ref}>{children}</Content>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const Content = styled.div`
  padding-top: 4px;
  padding-bottom: 4px;
  box-sizing: border-box;
`;

export default styled(ExpandablePanel)`
  overflow: hidden;
  padding-left: 4px;
  padding-right: 4px;
  box-sizing: border-box;
`;
