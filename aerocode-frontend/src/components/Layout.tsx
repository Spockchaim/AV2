import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Plane, Settings, Wrench, Beaker, FileBarChart, Users, LogOut, Menu, X } from 'lucide-react';
import { Role } from '../types';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'HOME', path: '/home', icon: <Home size={16} />, roles: [Role.ADMIN, Role.ENGINEER, Role.OPERATOR] },
    { name: 'AERONAVES', path: '/aeronaves', icon: <Plane size={16} />, roles: [Role.ADMIN, Role.ENGINEER] },
    { name: 'PEÇAS', path: '/pecas', icon: <Settings size={16} />, roles: [Role.ADMIN, Role.ENGINEER] },
    { name: 'PRODUÇÃO', path: '/producao', icon: <Wrench size={16} />, roles: [Role.ADMIN, Role.ENGINEER, Role.OPERATOR] },
    { name: 'QUALIDADE', path: '/qualidade', icon: <Beaker size={16} />, roles: [Role.ADMIN, Role.ENGINEER] },
    { name: 'RELATÓRIOS', path: '/relatorios', icon: <FileBarChart size={16} />, roles: [Role.ADMIN, Role.ENGINEER] },
    { name: 'EQUIPE', path: '/equipe', icon: <Users size={16} />, roles: [Role.ADMIN] },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="layout-container">
      {/* MOBILE HEADER */}
      <div className="mobile-header">
        <div style={{ fontWeight: '900', letterSpacing: '2px' }}>AEROCODE</div>
        <button onClick={toggleMobileMenu} className="menu-toggle">
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1 style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '2px' }}>AEROCODE</h1>
          <div style={{ fontSize: '8px', fontWeight: 'bold', color: 'var(--text-muted)' }}>INDUSTRIAL SYSTEMS v1.0</div>
        </div>

        {/* MOBILE ONLY USER INFO */}
        <div className="mobile-user-info" style={{ marginBottom: '20px', padding: '15px', border: '2px dashed var(--border-color)', display: 'none' }}>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)' }}>OPERADOR ATUAL:</div>
          <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent)' }}>{user?.nome?.toUpperCase()}</div>
          <button onClick={handleLogout} style={{ marginTop: '10px', width: '100%', fontSize: '10px', padding: '5px' }}>
            <LogOut size={12} /> SAIR
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const isAllowed = item.roles.includes(user?.nivelPermissao as Role);
            const isActive = location.pathname === item.path;
            
            if (!isAllowed) return null;

            return (
              <div 
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={isActive ? 'sidebar-item active' : 'sidebar-item'}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '2px solid var(--border-thin)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
            <a href='https://github.com/Spockchaim' style={{ color: 'inherit', textDecoration: 'none' }}>© 2026 Pedro Chaim</a>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={toggleMobileMenu}></div>}

      {/* MAIN CONTENT AREA */}
      <div className="main-area">
        <header className="main-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="status-indicator"></div>
            <div style={{ fontSize: '13px', fontWeight: 'bold' }} className="user-info">
              OPERADOR: <span style={{ color: 'var(--accent)' }}>{user?.nome?.toUpperCase()}</span> 
              <span className="hide-mobile" style={{ margin: '0 10px', color: '#ccc' }}>|</span> 
              <span className="hide-mobile">NÍVEL: <span style={{ textDecoration: 'underline' }}>{user?.nivelPermissao}</span></span>
            </div>
          </div>
          <button onClick={handleLogout} style={{ padding: '8px 15px', fontSize: '11px' }}>
            <LogOut size={14} /> <span className="hide-mobile">ENCERRAR SESSÃO</span>
          </button>
        </header>
        <main className="main-content">
          {children}
        </main>
      </div>

      <style>{`
        .layout-container {
          display: flex;
          height: 100vh;
          overflow: hidden;
          background-color: var(--bg-app);
        }

        .sidebar {
          width: 240px;
          border-right: 3px solid var(--border-color);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          background-color: #fff;
          z-index: 20;
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .sidebar-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
          padding: 10px;
          border: 2px solid #000;
          box-shadow: 4px 4px 0px #000;
          flex-shrink: 0;
        }

        .sidebar-item {
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 15px;
          border: 2px solid transparent;
          transition: all 0.2s ease;
          font-weight: bold;
          font-size: 13px;
        }

        .sidebar-item:hover {
          background-color: #f1f5f9;
          border-color: var(--border-color) !important;
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0px var(--border-color);
        }

        .sidebar-item.active {
          background-color: var(--border-color) !important;
          color: #fff !important;
          border-color: var(--border-color) !important;
          box-shadow: 4px 4px 0px var(--accent);
        }

        .main-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .main-header {
          height: 70px;
          border-bottom: 3px solid var(--border-color);
          padding: 0 30px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #fff;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--success);
          box-shadow: 0 0 5px var(--success);
        }

        .main-content {
          flex: 1;
          padding: 40px;
          overflow-y: auto;
        }

        .mobile-header {
          display: none;
          height: 60px;
          background: #fff;
          border-bottom: 3px solid var(--border-color);
          padding: 0 20px;
          align-items: center;
          justify-content: space-between;
          z-index: 15;
        }

        .menu-toggle {
          padding: 8px;
          background: var(--border-color);
          color: #fff;
          border: none;
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 18;
        }

        @media (max-width: 768px) {
          .layout-container {
            flex-direction: column;
          }

          .main-header {
            display: none !important;
          }

          .mobile-user-info {
            display: block !important;
          }

          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .mobile-header {
            display: flex;
          }

          .main-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};
