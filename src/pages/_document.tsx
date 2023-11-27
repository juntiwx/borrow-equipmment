import { Html, Head, Main, NextScript } from 'next/document';
import { ColorSchemeScript } from '@mantine/core';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="shortcut icon" href="/logo.png" />
        <title>แบบฟอร์มกรอกข้อมูลขอใช้งานอุปกรณ์ IT</title>
      </Head>
      <body className='font-style'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}