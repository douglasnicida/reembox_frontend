import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoute from './routes.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import {ActiveItemProvider} from "@/context/ActiveItemContext.tsx";
import { Toaster } from './components/ui/toaster.tsx'
import AuthProvider from './context/AuthContext.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <BrowserRouter>
                <ActiveItemProvider>
                    <AuthProvider>
                            <Toaster />
                            <AppRoute />
                    </AuthProvider>
                </ActiveItemProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
)