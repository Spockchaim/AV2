import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { AeronavesPage } from './pages/AeronavesPage';
import { PecasPage } from './pages/PecasPage';
import { ProducaoPage } from './pages/ProducaoPage';
import { QualidadePage } from './pages/QualidadePage';
import { RelatoriosPage } from './pages/RelatoriosPage';
import { EquipePage } from './pages/EquipePage';
import { Layout } from './components/Layout';

import { Role } from './types';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Role[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  
  if (allowedRoles && !allowedRoles.includes(user.nivelPermissao)) {
    return <Navigate to="/home" />;
  }

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/aeronaves" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER]}><AeronavesPage /></ProtectedRoute>} />
            <Route path="/pecas" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER]}><PecasPage /></ProtectedRoute>} />
            <Route path="/producao" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER, Role.OPERATOR]}><ProducaoPage /></ProtectedRoute>} />
            <Route path="/qualidade" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER]}><QualidadePage /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER]}><RelatoriosPage /></ProtectedRoute>} />
            <Route path="/equipe" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><EquipePage /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
