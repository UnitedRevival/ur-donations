import React from 'react';
import styles from './flex.module.css';

const FlexHorizontal = ({ children }) => {
  return <div className={styles.flexHorizontal}>{children}</div>;
};

export default FlexHorizontal;
