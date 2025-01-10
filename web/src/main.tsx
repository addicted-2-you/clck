import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';

import { AppRoutes } from './AppRoutes.tsx';
import { store } from './store.ts';

import { cognitoAuthConfig } from './cognitoAuthConfig.ts';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  </StrictMode>,
);
