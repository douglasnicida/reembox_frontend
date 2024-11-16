import { Routes, Route } from 'react-router-dom';
import App from './App';
import { Collaborators } from './pages/Collaborators';
import Sidebar from "@/components/custom_components/Sidebar.tsx";
import Header from "@/components/custom_components/Header.tsx";
import LoginPage from './pages/Login';
import ReportsPage from "@/pages/Reports.tsx";
import { useActiveItem } from './context/ActiveItemContext';
import CostCenterPage from './pages/CostCenter';

export default function AppRoute() {
    const { activeItem } = useActiveItem();
    return (
        <div className="dark flex h-screen bg-zinc-900 text-zinc-100">
            { activeItem != 'Login' && <Sidebar/> }
            <div className="flex flex-col w-full">
                { activeItem != 'Login' && activeItem.length > 0 && <Header/> }
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/home" element={<App />}/>
                        <Route path="/reports" element={<ReportsPage/>}/>
                        <Route path="/expenses" element={<App/>}/>
                        <Route path="/collaborators" element={<Collaborators/>}/>
                        <Route path="/job-titles" element={<App/>}/>
                        <Route path="/cost-centers" element={<CostCenterPage/>}/>
                        <Route path="/expense-categories" element={<CostCenterPage/>}/>
                        <Route path="/projects" element={<App/>}/>
                        <Route path="/customers" element={<App/>}/>
                        <Route path="/financial" element={<App/>}/>
                        <Route path="/approval" element={<App/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}