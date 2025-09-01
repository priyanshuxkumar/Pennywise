import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import HomePage from './pages/Home';
import NotFound from './pages/NotFound';
import Entry from './pages/Entry';
import Profile from './pages/Profile';
import { MobileBottomNav } from './components/MobileNavigation';
import { useMediaQuery } from './hooks/useMobile';
import Sidebar from './components/Sidebar';
import { useUser } from './components/UserProvider';
import LoginPage from './pages/Login';
import { UserProvider } from './context/user.context';
import Loader from './components/Loader';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useUser();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader strokeWidth="2" size="40" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function Layout() {
    const matches = useMediaQuery();

    return (
        <div className="app flex bg-white dark:bg-black overflow-hidden">
            {matches ? (
                <div className="fixed bottom-0 z-50 w-full">
                    <MobileBottomNav />
                </div>
            ) : (
                <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
                    <Sidebar />
                </div>
            )}
            <div className={`flex-1 ${matches ? 'pb-20' : 'ml-64'}`}>
                <div className="h-full md:h-screen overflow-y-auto">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/entry" element={<Entry />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <UserProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </UserProvider>
    );
}

export default App;
