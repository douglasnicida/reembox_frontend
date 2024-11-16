import { Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
import CollaboratorsPage from './pages/Collaborators';
import Sidebar from "@/components/custom_components/Sidebar.tsx";
import Header from "@/components/custom_components/Header.tsx";
import LoginPage from './pages/Login';
import ReportsPage from "@/pages/Reports.tsx";
import { useActiveItem } from './context/ActiveItemContext';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

export default function AppRoute() {
    const { activeItem } = useActiveItem();
    const { token } = useAuth();

    // TODO: verificar se token expirou
    
    const navigate = useNavigate();
    useEffect(() => {
        const storedUserInfo =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null
        const storedTokenInfo =  localStorage.getItem('access_token')
        if(!storedTokenInfo || !storedUserInfo) {navigate('/')}
    }, [navigate])
    
    return (
        <div className="dark flex h-screen bg-zinc-900 text-zinc-100">
            { activeItem != 'Login' && <Sidebar/> }
            <div className="flex flex-col w-full">
                {activeItem != 'Login' && activeItem.length > 0 && <Header/>}
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        {
                            token &&
                            <>
                                <Route path="/home" element={<App />}/>
                                <Route path="/collabs" element={<CollaboratorsPage/>}/>
                                <Route path="/ponto" element={<App/>}/>
                                <Route path="/benefits" element={<App/>}/>
                                <Route path="/management" element={<App/>}/>
                                <Route path="/financial" element={<App/>}/>
                                <Route path="/reports" element={<ReportsPage/>}/>
                                <Route path="/config" element={<App/>}/>
                                <Route path="/corporate" element={<App/>}/>
                                <Route path="/departments" element={<App/>}/>
                            </>
                        }
                    </Routes>
                </div>
            </div>
        </div>
    );
}