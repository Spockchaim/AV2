import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Settings, Wrench, Beaker, FileBarChart, Users } from 'lucide-react';
import { Role } from '../types';

export const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const tiles = [
    { name: 'AERONAVES', path: '/aeronaves', icon: <Plane />, roles: [Role.ADMIN, Role.ENGINEER], desc: 'Gestão da Frota' },
    { name: 'PEÇAS', path: '/pecas', icon: <Settings />, roles: [Role.ADMIN, Role.ENGINEER], desc: 'Inventário e Estoque' },
    { name: 'PRODUÇÃO', path: '/producao', icon: <Wrench />, roles: [Role.ADMIN, Role.ENGINEER, Role.OPERATOR], desc: 'Etapas e Montagem' },
    { name: 'QUALIDADE', path: '/qualidade', icon: <Beaker />, roles: [Role.ADMIN, Role.ENGINEER], desc: 'Testes e Aprovação' },
    { name: 'RELATÓRIOS', path: '/relatorios', icon: <FileBarChart />, roles: [Role.ADMIN, Role.ENGINEER], desc: 'Exportação TXT' },
    { name: 'EQUIPE', path: '/equipe', icon: <Users />, roles: [Role.ADMIN], desc: 'Recursos Humanos' },
  ];

  return (
    <div style={{ margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '1px' }}>PAINEL DE OPERAÇÕES</h2>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '5px' }}>Selecione um módulo para iniciar as atividades industriais.</div>
      </div>

      <div className="grid grid-3">
        {tiles.map((tile) => {
          const isAllowed = tile.roles.includes(user?.nivelPermissao as Role);
          
          return (
            <div 
              key={tile.path}
              onClick={() => isAllowed && navigate(tile.path)}
              className="box"
              style={{ 
                cursor: isAllowed ? 'pointer' : 'not-allowed',
                opacity: isAllowed ? 1 : 0.6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                gap: '15px',
                filter: isAllowed ? 'none' : 'grayscale(1)',
                position: 'relative',
                overflow: 'hidden',
                borderStyle: isAllowed ? 'solid' : 'dashed',
                minHeight: '200px'
              }}
            >
              <div style={{ 
                color: isAllowed ? 'var(--accent)' : 'var(--text-muted)',
                marginBottom: '5px'
              }}>
                {React.cloneElement(tile.icon as React.ReactElement, { size: 40 } as any)}
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '900', fontSize: '14px', letterSpacing: '1px' }}>{tile.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '5px', textTransform: 'uppercase' }}>{tile.desc}</div>
              </div>

              {!isAllowed && (
                <div style={{ 
                  position: 'absolute',
                  top: '10px',
                  right: '-25px',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  padding: '4px 25px',
                  transform: 'rotate(45deg)'
                }}>
                  BLOQUEADO
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
