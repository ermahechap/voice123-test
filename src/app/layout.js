'use client';
import { Container } from '@mui/material';
import AppMenu from './components/AppMenu';

export default function RootLayout({ children }) {
  return (<html>
    <body>
      <AppMenu/>
      <Container maxWidth='xl' sx={{mt: 5}}>
        {children}
      </Container>
    </body>
  </html>);
}
