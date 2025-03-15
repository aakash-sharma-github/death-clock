import './globals.css';
import { DeathYearProvider } from './contexts/DeathYearContext';
import { AppProvider } from './contexts/AppContext';

export const metadata = {
  title: 'Death Clock',
  description: 'A countdown clock showing the time left until your expected death year',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        fontSize: '18px',
        fontWeight: 400,
        letterSpacing: '0.089em',
        fontStyle: 'normal'
      }}>
        <DeathYearProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </DeathYearProvider>
      </body>
    </html>
  );
}
