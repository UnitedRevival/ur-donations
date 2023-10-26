import type { AppProps } from 'next/app';
import Script from 'next/script';
import GlobalStyles from '../styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from '../styles/themes';
import Header from '../components/Header';
import TiktokPixel from 'tiktok-pixel';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as fbq from '../lib/pixel';

const tikTokOptions = {
  debug: true, // enable logs
};

const enableTikTokPixel = async () => {
  //Tiktok pixel
  await TiktokPixel.init('CA62CRBC77U3IR5TM5SG', {}, tikTokOptions);
  TiktokPixel.pageView();
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    enableTikTokPixel();

    //Fb pixel
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
      TiktokPixel.pageView();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <GlobalStyles />
      <Header />
      <Script
        src="https://fast.wistia.com/assets/external/E-v1.js"
        async
      ></Script>
      <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${fbq.FB_PIXEL_ID});
          `,
        }}
      />
      <ThemeProvider theme={defaultTheme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
