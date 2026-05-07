import React, { useState } from 'react';
import { useData, Aircraft } from '../context/DataContext';
import { Plus, Trash2, Search } from 'lucide-react';

export const AeronavesPage = () => {
  const { aircrafts, addAircraft, removeAircraft } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newAircraft, setNewAircraft] = useState<Partial<Aircraft>>({
    codigo: '',
    modelo: '',
    tipo: 'COMERCIAL',
    capacidade: 0,
    alcance: 0,
    cliente: 'Nao definido',
    dataEntrega: 'Pendente'
  });

  const [statusFilter, setStatusFilter] = useState('TODOS');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAircraft.codigo && newAircraft.modelo) {
      addAircraft(newAircraft);
      setNewAircraft({
        codigo: '',
        modelo: '',
        tipo: 'COMERCIAL',
        capacidade: 0,
        alcance: 0,
        cliente: 'Nao definido',
        dataEntrega: 'Pendente'
      });
      setShowForm(false);
    }
  };

  const filteredAircrafts = aircrafts.filter(a => {
    const matchesSearch = a.modelo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         a.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'TODOS' || 
                          (statusFilter === 'PENDENTE' && a.statusCalculado === 'Pendente') ||
                          (statusFilter === 'PRODUCAO' && a.statusCalculado === 'Em Produção') ||
                          (statusFilter === 'CONCLUIDO' && a.statusCalculado === 'Concluído');
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>GERENCIAR AERONAVES</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> {showForm ? 'CANCELAR' : 'NOVA AERONAVE'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="box" style={{ marginBottom: '30px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>CADASTRAR NOVA AERONAVE</h3>
          <div className="grid grid-2" style={{ gap: '20px' }}>
            <div>
              <label className="label">CÓDIGO (PREFIXO)</label>
              <input type="text" value={newAircraft.codigo} onChange={(e) => setNewAircraft({...newAircraft, codigo: e.target.value})} placeholder="Ex: AC-123" required />
            </div>
            <div>
              <label className="label">MODELO</label>
              <input type="text" value={newAircraft.modelo} onChange={(e) => setNewAircraft({...newAircraft, modelo: e.target.value})} placeholder="Ex: Boeing 737" required />
            </div>
            <div>
              <label className="label">TIPO</label>
              <select style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }} value={newAircraft.tipo} onChange={(e) => setNewAircraft({...newAircraft, tipo: e.target.value})}>
                <option value="COMERCIAL">COMERCIAL</option>
                <option value="CARGUEIRO">CARGUEIRO</option>
                <option value="EXECUTIVO">EXECUTIVO</option>
                <option value="MILITAR">MILITAR</option>
              </select>
            </div>
            <div>
              <label className="label">CAPACIDADE (PAX)</label>
              <input type="number" value={newAircraft.capacidade} onChange={(e) => setNewAircraft({...newAircraft, capacidade: Number(e.target.value)})} required />
            </div>
            <div>
              <label className="label">ALCANCE (KM)</label>
              <input type="number" value={newAircraft.alcance} onChange={(e) => setNewAircraft({...newAircraft, alcance: Number(e.target.value)})} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%' }}>SALVAR NO SISTEMA</button>
            </div>
          </div>
        </form>
      )}

      <div className="box" style={{ padding: '0' }}>
        <div className="flex-mobile-column" style={{ padding: '15px', borderBottom: '2px solid #000', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, width: '100%' }}>
            <Search size={18} />
            <input type="text" placeholder="Buscar por código, modelo ou tipo..." style={{ border: 'none', padding: '5px', width: '100%' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'space-between' }}>
            <label style={{ fontSize: '10px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>FILTRAR STATUS:</label>
            <select 
              style={{ padding: '4px', border: '1px solid #000', fontSize: '11px', fontFamily: 'inherit', width: 'auto', minWidth: '120px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="TODOS">TODOS</option>
              <option value="PENDENTE">PENDENTE</option>
              <option value="PRODUCAO">EM PRODUÇÃO</option>
              <option value="CONCLUIDO">CONCLUÍDO</option>
            </select>
          </div>
        </div>
      <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>MODELO</th>
              <th>TIPO</th>
              <th>CAP/ALC</th>
              <th>DADOS (P/E/T)</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredAircrafts.length > 0 ? (
              filteredAircrafts.map((a) => (
                <tr key={a.codigo}>
                  <td style={{ fontWeight: 'bold' }}>{a.codigo}</td>
                  <td>{a.modelo}</td>
                  <td>{a.tipo}</td>
                  <td style={{ fontSize: '11px' }}>{a.capacidade}p / {a.alcance}km</td>
                  <td>
                    <span style={{ fontSize: '10px' }}>
                      {a.pecas.length}p / {a.etapas.length}e / {a.testes.length}t
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      fontSize: '10px', 
                      fontWeight: 'bold',
                      backgroundColor: a.statusCalculado === 'Pendente' ? '#fef3c7' : '#dcfce7',
                      color: a.statusCalculado === 'Pendente' ? '#92400e' : '#166534',
                      border: '1px solid currentColor'
                    }}>
                      {a.statusCalculado.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => removeAircraft(a.codigo)} style={{ background: 'none', color: '#ef4444', border: 'none', padding: '0' }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#666' }}>Nenhuma aeronave encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-card-list">
        {filteredAircrafts.map((a) => (
          <div key={a.codigo} className="mobile-card">
            <div className="mobile-card-row">
              <span className="mobile-card-label">PREFIXO</span>
              <span className="mobile-card-value">{a.codigo}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">MODELO / TIPO</span>
              <span className="mobile-card-value">{a.modelo} ({a.tipo})</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">CAP / ALC</span>
              <span className="mobile-card-value">{a.capacidade}p / {a.alcance}km</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">STATUS</span>
              <span className="mobile-card-value">
                <span style={{ color: a.statusCalculado === 'Pendente' ? '#92400e' : '#166534' }}>
                  {a.statusCalculado.toUpperCase()}
                </span>
              </span>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
              <button onClick={() => removeAircraft(a.codigo)} style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '5px 10px' }}>
                <Trash2 size={14} /> REMOVER
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
