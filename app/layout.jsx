import 'aos/dist/aos.css';
import 'leaflet/dist/leaflet.css';
import '../src/styles.css';

export const metadata = {
  title: 'United Athletes for Peace',
  description: 'United Athletes for Peace builds global advocacy, visibility, and inclusion through sport.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://www.instagram.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
