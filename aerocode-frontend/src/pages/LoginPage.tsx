import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(usuario, password)) {
      navigate('/home');
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#eee'
    }}>
      <form onSubmit={handleLogin} className="box" style={{ width: '90%', maxWidth: '350px', padding: '40px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center' }}>AEROCODE LOGIN</h1>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', fontSize: '12px', marginBottom: '20px', border: '1px solid #b91c1c' }}>
            Credenciais inválidas. Tente novamente.
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label className="label">USUÁRIO</label>
          <input 
            type="text" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ex: adm, eng, op"
            required
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label className="label">SENHA</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        
        <button type="submit" style={{ width: '100%' }}>ENTRAR</button>
        
        <div style={{ marginTop: '20px', fontSize: '9px', color: '#666', textAlign: 'center' }}>
          <b>Dica:</b> Use os usuários do sistema original (adm/adm, eng/eng, op/op).
        </div>
      </form>
    </div>
  );
};
