import React, { useState } from 'react';
import { useData, Part } from '../context/DataContext';
import { Plus, Trash2, Search, Link } from 'lucide-react';

export const PecasPage = () => {
  const { parts, aircrafts, addPart, removePart, updatePartStatus, linkPartToAircraft } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [linkingPart, setLinkingPart] = useState<string | null>(null);
  const [targetAircraft, setTargetAircraft] = useState('');

  const [newPart, setNewPart] = useState<Partial<Part>>({
    nome: '',
    tipo: 'NACIONAL',
    fornecedor: '',
    status: 'EM_ESTOQUE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPart.nome && newPart.fornecedor) {
      addPart(newPart);
      setNewPart({
        nome: '',
        tipo: 'NACIONAL',
        fornecedor: '',
        status: 'EM_ESTOQUE'
      });
      setShowForm(false);
    }
  };

  const handleLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkingPart && targetAircraft) {
      linkPartToAircraft(targetAircraft, linkingPart);
      setLinkingPart(null);
      setTargetAircraft('');
    }
  };

  const filteredParts = parts.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>INVENTÁRIO DE PEÇAS</h2>
        <button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {showForm ? 'CANCELAR' : 'NOVA PEÇA'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="box" style={{ marginBottom: '30px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>CADASTRAR NOVA PEÇA</h3>
          <div className="grid grid-2" style={{ gap: '20px' }}>
            <div>
              <label className="label">NOME DA PEÇA</label>
              <input type="text" value={newPart.nome} onChange={(e) => setNewPart({...newPart, nome: e.target.value})} required />
            </div>
            <div>
              <label className="label">FORNECEDOR</label>
              <input type="text" value={newPart.fornecedor} onChange={(e) => setNewPart({...newPart, fornecedor: e.target.value})} required />
            </div>
            <div>
              <label className="label">TIPO</label>
              <select style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }} value={newPart.tipo} onChange={(e) => setNewPart({...newPart, tipo: e.target.value})}>
                <option value="NACIONAL">NACIONAL</option>
                <option value="IMPORTADA">IMPORTADA</option>
              </select>
            </div>
            <div>
              <label className="label">STATUS</label>
              <select style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }} value={newPart.status} onChange={(e) => setNewPart({...newPart, status: e.target.value})}>
                <option value="EM_ESTOQUE">EM ESTOQUE</option>
                <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
              </select>
            </div>
            <div className="grid-span-2">
              <button type="submit" style={{ width: '100%' }}>REGISTRAR NO INVENTÁRIO</button>
            </div>
          </div>
        </form>
      )}

      {linkingPart && (
        <form onSubmit={handleLink} className="box" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e0f2fe' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px' }}>VINCULAR PEÇA: {linkingPart}</h3>
          <div className="flex-mobile-column" style={{ alignItems: 'flex-end', gap: '20px' }}>
            <div style={{ flex: 1, width: '100%' }}>
              <label className="label">AERONAVE DESTINO</label>
              <select style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }} value={targetAircraft} onChange={e => setTargetAircraft(e.target.value)} required>
                <option value="">Selecione a aeronave...</option>
                {aircrafts.map(a => <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', justifyContent: 'flex-end' }}>
              <button type="submit">VINCULAR</button>
              <button type="button" onClick={() => setLinkingPart(null)} style={{ backgroundColor: '#fff', color: '#000' }}>CANCELAR</button>
            </div>
          </div>
        </form>
      )}

      <div className="box" style={{ padding: '0' }}>
        <div className="flex-mobile-column" style={{ padding: '15px', borderBottom: '2px solid #000', alignItems: 'center', gap: '10px' }}>
          <Search size={18} />
          <input type="text" placeholder="Buscar..." style={{ border: 'none', padding: '5px', flex: 1, width: '100%' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>NOME</th>
              <th>TIPO</th>
              <th>FORNECEDOR</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((p, idx) => (
              <tr key={idx}>
                <td><b>{p.nome}</b></td>
                <td>{p.tipo}</td>
                <td>{p.fornecedor}</td>
                <td>
                   <select 
                    style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 'bold', border: '1px solid #000', fontFamily: 'inherit', width: 'auto' }}
                    value={p.status}
                    onChange={(e) => updatePartStatus(p.nome, e.target.value)}
                   >
                     <option value="EM_ESTOQUE">EM ESTOQUE</option>
                     <option value="EM_PRODUCAO">EM PRODUÇÃO</option>
                     <option value="EM_TRANSPORTE">EM TRANSPORTE</option>
                     <option value="PRONTA">PRONTA PARA USO</option>
                   </select>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => setLinkingPart(p.nome)} style={{ background: 'none', color: '#3b82f6', border: 'none', padding: '0', marginRight: '10px' }}>
                    <Link size={18} />
                  </button>
                  <button onClick={() => removePart(p.nome)} style={{ background: 'none', color: '#ef4444', border: 'none', padding: '0' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-card-list">
        {filteredParts.map((p, idx) => (
          <div key={idx} className="mobile-card">
            <div className="mobile-card-row">
              <span className="mobile-card-label">PEÇA</span>
              <span className="mobile-card-value">{p.nome}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">FORNECEDOR / TIPO</span>
              <span className="mobile-card-value">{p.fornecedor} ({p.tipo})</span>
            </div>
            <div className="mobile-card-row" style={{ alignItems: 'center' }}>
              <span className="mobile-card-label">STATUS</span>
              <select 
                style={{ padding: '4px', border: '1px solid #000', fontSize: '11px', width: 'auto' }}
                value={p.status}
                onChange={(e) => updatePartStatus(p.nome, e.target.value)}
              >
                <option value="EM_ESTOQUE">ESTOQUE</option>
                <option value="EM_PRODUCAO">PRODUÇÃO</option>
                <option value="EM_TRANSPORTE">TRANSPORTE</option>
                <option value="PRONTA">PRONTA</option>
              </select>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
              <button onClick={() => setLinkingPart(p.nome)} style={{ background: '#3b82f6', color: '#fff', fontSize: '10px', padding: '5px 10px' }}>
                <Link size={14} /> VINCULAR
              </button>
              <button onClick={() => removePart(p.nome)} style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '5px 10px' }}>
                <Trash2 size={14} /> EXCLUIR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
