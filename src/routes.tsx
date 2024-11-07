import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CollaboratorsPage from './pages/Collaborators';
import Sidebar from "@/components/custom_components/Sidebar.tsx";
import Header from "@/components/custom_components/Header.tsx";

export default function AppRoute() {
    return (
        <BrowserRouter>
            <div className="dark flex h-screen bg-zinc-900 text-zinc-100">
                <Sidebar/>
                <div className="flex flex-col w-full">
                    <Header/>
                    <div className="flex-grow">
                        <Routes>
                            <Route path="/" element={<App/>}/>
                            <Route path="/collabs" element={<CollaboratorsPage/>}/>
                            <Route path="/ponto" element={<App/>}/>
                            <Route path="/benefits" element={<App/>}/>
                            <Route path="/management" element={<App/>}/>
                            <Route path="/financial" element={<App/>}/>
                            <Route path="/reports" element={<App/>}/>
                            <Route path="/config" element={<App/>}/>
                            <Route path="/corporate" element={<App/>}/>
                            <Route path="/departments" element={<App/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}