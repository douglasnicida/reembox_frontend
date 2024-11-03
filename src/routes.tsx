import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CollaboratorsPage from './pages/Collaborators';

export default function AppRoute() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/collabs" element={<CollaboratorsPage />} />
            </Routes>
        </BrowserRouter>
    );
}