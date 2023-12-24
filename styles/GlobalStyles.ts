import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
p,
span {
  color: #3C1903;
}

* {
  font-family: 'Poppins', sans-serif;
}
/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
  margin: 0;
}

body {
  background-color: #f1f1f1;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* Set core root defaults */
html:focus-within {
  scroll-behavior: smooth;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* A elements that don't have a class get default styles */
a:not([class]) {
  text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}



.heart-particle {
  margin-left: 1rem;
  opacity: 1;
  width: 0.5rem;
  height: 0.5rem;
  position: absolute;
  top: 0px;
  left: -16px;
  background-color: rgba(204, 42, 93, 1);
  transition: all 1.4s ease-out;

  z-index: 100;

  &:before,
  &:after {
    position: absolute;
    content: '';
    border-radius: 100px;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    transition: all 0.1s ease-in;
    background-color: rgba(204, 42, 93, 1);
  }
  &:before {
    transform: translateX(-50%);
  }
  &:after {
    transform: translateY(-50%);
  }

  &.particle-float {
    left: -40px;
    top: -25px;
    opacity: 0;
  }
}

`;

export default GlobalStyles;
