import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserPlus, UserMinus, Search, Phone, MapPin, Edit } from 'lucide-react';

export const EquipePage = () => {
  const { employees, addEmployee, updateEmployee } = useData();
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = {
    id: '',
    nome: '',
    telefone: '',
    endereco: '',
    usuario: '',
    senha: '',
    nivelPermissao: 'OPERADOR'
  };

  const [newEmp, setNewEmp] = useState(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmp.id && newEmp.nome && newEmp.usuario) {
      if (isEditing) {
        updateEmployee(newEmp);
      } else {
        addEmployee(newEmp);
      }
      setNewEmp(initialFormState);
      setShowForm(false);
      setIsEditing(false);
    }
  };

  const handleEdit = (emp: any) => {
    setNewEmp({
      id: emp.id,
      nome: emp.nome,
      telefone: emp.telefone || '',
      endereco: emp.endereco || '',
      usuario: emp.usuario,
      senha: '', 
      nivelPermissao: emp.nivelPermissao
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleToggleForm = () => {
    if (showForm) {
      setNewEmp(initialFormState);
      setIsEditing(false);
      setShowForm(false);
    } else {
      setNewEmp(initialFormState);
      setIsEditing(false);
      setShowForm(true);
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>GESTÃO DE RECURSOS HUMANOS</h2>
        <button 
          onClick={handleToggleForm}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <UserPlus size={18} /> {showForm ? 'CANCELAR' : 'CADASTRAR FUNCIONÁRIO'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="box" style={{ marginBottom: '30px', padding: '20px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>{isEditing ? 'EDITAR COLABORADOR' : 'NOVO COLABORADOR'}</h3>
          <div className="grid grid-2" style={{ gap: '15px' }}>
            <div>
              <label className="label">ID ÚNICO</label>
              <input type="text" value={newEmp.id} onChange={e => setNewEmp({...newEmp, id: e.target.value})} required disabled={isEditing} style={{ backgroundColor: isEditing ? '#f0f0f0' : 'white' }} />
            </div>
            <div>
              <label className="label">NOME COMPLETO</label>
              <input type="text" value={newEmp.nome} onChange={e => setNewEmp({...newEmp, nome: e.target.value})} required />
            </div>
            <div>
              <label className="label">TELEFONE</label>
              <input type="text" value={newEmp.telefone} onChange={e => setNewEmp({...newEmp, telefone: e.target.value})} placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label className="label">ENDEREÇO</label>
              <input type="text" value={newEmp.endereco} onChange={e => setNewEmp({...newEmp, endereco: e.target.value})} placeholder="Rua, Número, Cidade" />
            </div>
            <div>
              <label className="label">USUÁRIO</label>
              <input type="text" value={newEmp.usuario} onChange={e => setNewEmp({...newEmp, usuario: e.target.value})} required />
            </div>
            <div>
              <label className="label">SENHA</label>
              <input type="password" value={newEmp.senha} onChange={e => setNewEmp({...newEmp, senha: e.target.value})} required={!isEditing} placeholder={isEditing ? 'Deixe em branco para manter' : ''} />
            </div>
            <div>
              <label className="label">NÍVEL DE ACESSO</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }}
                value={newEmp.nivelPermissao}
                onChange={e => setNewEmp({...newEmp, nivelPermissao: e.target.value})}
              >
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="ENGENHEIRO">ENGENHEIRO</option>
                <option value="OPERADOR">OPERADOR</option>
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%' }}>SALVAR NO SISTEMA</button>
            </div>
          </div>
        </form>
      )}

      <div className="box" style={{ padding: '0' }}>
        <div className="flex-mobile-column" style={{ padding: '15px', borderBottom: '2px solid #000', alignItems: 'center', gap: '10px' }}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou usuário..." 
            style={{ border: 'none', padding: '5px', flex: 1, width: '100%' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOME COMPLETO / CONTATO</th>
              <th>USUÁRIO</th>
              <th>NÍVEL DE ACESSO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>#{emp.id}</td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{emp.nome}</div>
                  <div style={{ fontSize: '10px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                    {emp.telefone && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Phone size={10} /> {emp.telefone}</span>}
                    {emp.endereco && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={10} /> {emp.endereco}</span>}
                  </div>
                </td>
                <td>{emp.usuario}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    fontSize: '10px', 
                    fontWeight: 'bold',
                    backgroundColor: emp.nivelPermissao === 'ADMINISTRADOR' ? '#fee2e2' : (emp.nivelPermissao === 'ENGENHEIRO' ? '#e0f2fe' : '#f1f5f9'),
                    color: emp.nivelPermissao === 'ADMINISTRADOR' ? '#991b1b' : (emp.nivelPermissao === 'ENGENHEIRO' ? '#075985' : '#475569'),
                    border: '1px solid currentColor'
                  }}>
                    {emp.nivelPermissao}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(emp)} style={{ background: 'none', color: '#000', border: 'none', padding: '0', cursor: 'pointer' }} title="Editar">
                      <Edit size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="mobile-card-list">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="mobile-card">
            <div className="mobile-card-row">
              <span className="mobile-card-label">COLABORADOR</span>
              <span className="mobile-card-value">{emp.nome} (#{emp.id})</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">USUÁRIO</span>
              <span className="mobile-card-value">{emp.usuario}</span>
            </div>
            <div className="mobile-card-row">
              <span className="mobile-card-label">NÍVEL</span>
              <span className="mobile-card-value">{emp.nivelPermissao}</span>
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end', gap: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
              <button onClick={() => handleEdit(emp)} style={{ background: 'var(--accent)', color: '#fff', fontSize: '10px', padding: '5px 10px' }}>
                <Edit size={14} /> EDITAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};
