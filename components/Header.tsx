import Head from 'next/head';

const Header = () => {
  return (
    <Head>
      <title>Fund Jesus March</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:image" content="/feature-image.jpeg" />
      <meta property="og:image:width" content="650" />
      <meta property="og:image:height" content="500" />
    </Head>
  );
};

export default Header;
