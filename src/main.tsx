import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './routes.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import Sidebar from './components/custom_components/Sidebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div className="dark flex h-screen bg-zinc-900 text-zinc-100">
        <Sidebar />
        <AppRoute />
      </div>

    </ThemeProvider>
  </StrictMode>
)
