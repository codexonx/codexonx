import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { AuthProvider, useAuth } from './contexts/auth-context';
import { App } from './modules/app';
import { clearWorkspaceHeadersProvider, registerWorkspaceHeadersProvider } from './services/api';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

function Bootstrap() {
  const { getWorkspaceHeaders } = useAuth();

  useEffect(() => {
    registerWorkspaceHeadersProvider(getWorkspaceHeaders);

    return () => {
      clearWorkspaceHeadersProvider();
    };
  }, [getWorkspaceHeaders]);

  return <App />;
}

createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>
      <Bootstrap />
    </AuthProvider>
  </React.StrictMode>
);
