import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './routes.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import {ActiveItemProvider} from "@/context/ActiveItemContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div>
          <ActiveItemProvider>
        <AppRoute />
          </ActiveItemProvider>
      </div>

    </ThemeProvider>
  </StrictMode>
)
