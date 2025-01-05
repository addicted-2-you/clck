import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router';

import { AppRoutes } from './AppRoutes.tsx';

import { cognitoAuthConfig } from './cognitoAuthConfig.ts';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
