import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  login: (usuario: string, senha?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedFunc = AuthService.checkSession();
    if (loggedFunc) {
      setUser({
        id: loggedFunc.getId(),
        nome: loggedFunc.getNome(),
        usuario: loggedFunc.getUsuario(),
        nivelPermissao: loggedFunc.getNivelPermissao() as unknown as Role,
        telefone: loggedFunc.getTelefone(),
        endereco: loggedFunc.getEndereco()
      });
    }
  }, []);

  const login = (usuario: string, senha?: string) => {
    if (AuthService.login(usuario, senha || '')) {
      const loggedFunc = AuthService.getUsuarioLogado();
      if (loggedFunc) {
        setUser({
          id: loggedFunc.getId(),
          nome: loggedFunc.getNome(),
          usuario: loggedFunc.getUsuario(),
          nivelPermissao: loggedFunc.getNivelPermissao() as unknown as Role,
          telefone: loggedFunc.getTelefone(),
          endereco: loggedFunc.getEndereco()
        });
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
