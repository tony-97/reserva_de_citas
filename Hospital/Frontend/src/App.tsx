import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { PublicLayout } from './components/layout';
import { GlobalLoader } from './components/layout/GlobalLoader';
import { ToastProvider } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { RegistroPage } from './pages/RegistroPage';
import { LoginPage } from './pages/LoginPage';
import { ReservarCitaPage } from './pages/paciente/ReservarCitaPage';
import { MisCitasPage } from './pages/paciente/MisCitasPage';
import { ComprobantePage } from './pages/paciente/ComprobantePage';
import { DashboardPage } from './pages/medico/DashboardPage';
import { AdminPage } from './pages/admin/AdminPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/registro" element={<RegistroPage />} />
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute allowedRoles={['PACIENTE']} />}>
              <Route path="/reservar" element={<ReservarCitaPage />} />
              <Route path="/paciente/mis-citas" element={<MisCitasPage />} />
              <Route path="/paciente/comprobante" element={<ComprobantePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['MEDICO']} />}>
              <Route path="/medico/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            <BrowserRouter>
              <GlobalLoader>
                <AnimatedRoutes />
              </GlobalLoader>
            </BrowserRouter>
          </ToastProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
