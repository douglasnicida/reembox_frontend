import { Routes, Route, useNavigate } from 'react-router-dom';
import App from './App';
import Sidebar from "@/components/custom_components/Sidebar.tsx";
import Header from "@/components/custom_components/Header.tsx";
import LoginPage from './pages/Login';
import ReportsPage from "@/pages/Reports.tsx";
import { useActiveItem } from './context/ActiveItemContext';
import CostCenterPage from './pages/CostCenter';
import { useEffect } from 'react';
import ExpenseCategoryPage from './pages/ExpenseCategory';
import CustomerPage from './pages/Customer';
import JobTitlePage from './pages/JobTitle';
import CollaboratorPage from './pages/Collaborator';
import ProjectPage from './pages/Project';
import ExpensePage from './pages/Expense';
import CreateExpensePage from './pages/CreateExpense';
import CreateReportPage from './pages/CreateReport';
import ApprovePage from './pages/ApprovePage';
import AllocationPage from './pages/Allocation';
import CreateAllocationPage from './pages/CreateAllocation';
import MyAllocationsPage from './pages/MyAllocations';
import ContextPage from './pages/Context';
import FinancialPage from './pages/FinancialPage';
import ReportDetailsPage from './pages/ReportDetails';

export default function AppRoute() {
    const { activeItem, setActiveItem } = useActiveItem();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('user');
        const storedTokenInfo = localStorage.getItem('access_token');

        if(!storedTokenInfo || !storedUserInfo) {
            setActiveItem('Login');
            navigate('/');
        }
    }, [navigate, setActiveItem])

    return (
        <div className="dark flex h-full bg-zinc-900 text-zinc-100">
            { activeItem != 'Login' && <Sidebar/> }
            <div className="flex flex-col w-full">
                { activeItem != 'Login' && activeItem.length > 0 && <Header/> }
                <div className="flex-grow overflow-y-hidden h-[calc(100%-300px)]">
                    <Routes>
                        <Route path="/" element={<LoginPage/>}/>
                        <Route path="/home" element={<App />}/>
                        <Route path="/reports" element={<ReportsPage/>}/>
                        <Route path="/expenses" element={<ExpensePage/>}/>
                        <Route path="/collaborators" element={<CollaboratorPage/>}/>
                        <Route path="/job-titles" element={<JobTitlePage/>}/>
                        <Route path="/cost-centers" element={<CostCenterPage/>}/>
                        <Route path="/expense-categories" element={<ExpenseCategoryPage/>}/>
                        <Route path="/projects" element={<ProjectPage/>}/>
                        <Route path="/customers" element={<CustomerPage/>}/>
                        <Route path="/allocations" element={<AllocationPage/>}/>
                        <Route path="/financial" element={<FinancialPage/>}/>
                        <Route path="/approval" element={<ApprovePage/>}/>
                        <Route path="/reports/:id/details" element={<ReportDetailsPage/>}/>
                        <Route path="/expense/new" element={<CreateExpensePage/>}/>
                        <Route path="/reports/new" element={<CreateReportPage/>}/>
                        <Route path="/allocations/new" element={<CreateAllocationPage/>}/>
                        <Route path="/allocations/my" element={<MyAllocationsPage/>}/>
                        <Route path="/context" element={<ContextPage/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}