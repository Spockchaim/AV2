import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle2, Clock, AlertCircle, Plus, Check, UserPlus } from 'lucide-react';

export const ProducaoPage = () => {
  const { aircrafts, employees, addStepToAircraft, addEmployeeToStep, startStep, finishStep } = useData();
  const [selectedAircraftCode, setSelectedAircraftCode] = useState(aircrafts[0]?.codigo || '');
  const [showAddStep, setShowAddStep] = useState(false);
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  
  const [newStep, setNewStep] = useState({ name: '', deadline: '', responsible: '' });

  const selectedAircraft = aircrafts.find(a => a.codigo === selectedAircraftCode);
  const steps = selectedAircraft?.etapas || [];

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStep.name && newStep.deadline) {
      addStepToAircraft(selectedAircraftCode, newStep.name, newStep.deadline, newStep.responsible);
      setNewStep({ name: '', deadline: '', responsible: '' });
      setShowAddStep(false);
    }
  };

  const handleAssignEmployee = (nomeEtapa: string, empId: string) => {
    if (empId) {
      addEmployeeToStep(selectedAircraftCode, nomeEtapa, empId);
      setAssigningTo(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>LINHA DE PRODUÇÃO (KANBAN)</h2>
        <button 
          onClick={() => setShowAddStep(!showAddStep)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> NOVA ETAPA
        </button>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className="label">AERONAVE EM FOCO:</label>
          <select 
            style={{ width: '100%', padding: '10px', border: '2px solid #000', fontFamily: 'inherit', marginTop: '10px' }}
            value={selectedAircraftCode}
            onChange={(e) => setSelectedAircraftCode(e.target.value)}
          >
            <option value="">Selecione...</option>
            {aircrafts.map(a => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>
            ))}
          </select>
        </div>
      </div>

      {showAddStep && (
        <form onSubmit={handleAddStep} className="box" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc' }}>
          <div className="grid grid-3" style={{ gap: '20px' }}>
            <div style={{ gridColumn: 'span 1' }}>
              <label className="label">NOME DA ETAPA</label>
              <input type="text" value={newStep.name} onChange={e => setNewStep({...newStep, name: e.target.value})} placeholder="Ex: Montagem Elétrica" required />
            </div>
            <div>
              <label className="label">PRAZO</label>
              <input type="text" value={newStep.deadline} onChange={e => setNewStep({...newStep, deadline: e.target.value})} placeholder="Ex: 5 dias" required />
            </div>
            <div>
              <label className="label">RESPONSÁVEL</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '2px solid #000', fontFamily: 'inherit' }}
                value={newStep.responsible}
                onChange={e => setNewStep({...newStep, responsible: e.target.value})}
              >
                <option value="">Selecione...</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.nome}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="submit">INICIAR</button>
          </div>
        </form>
      )}

      <div className="grid grid-main-side" style={{ gap: '30px', alignItems: 'start' }}>
        {/* COLUNAS KANBAN */}
        <div className="grid grid-3" style={{ gap: '20px' }}>
          {/* PENDENTE */}
          <div className="box" style={{ backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} /> AGUARDANDO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {steps.filter(s => s.status === 'PENDENTE').map((s, idx) => (
                <div key={idx} className="box" style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{s.nome}</div>
                  <div style={{ color: '#666' }}>Prazo: {s.prazo}</div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>EQUIPE:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {s.funcionarios?.map((f: any) => (
                        <span key={f.id} style={{ padding: '2px 6px', backgroundColor: '#e2e8f0', fontSize: '9px', fontWeight: 'bold', border: '1px solid #000' }}>
                          {f.nome.split(' ')[0]}
                        </span>
                      ))}
                      {s.funcionarios?.length === 0 && <span style={{ color: '#999', fontSize: '9px' }}>Nenhum associado</span>}
                    </div>

                    {assigningTo === s.nome ? (
                      <select 
                        autoFocus
                        onBlur={() => setAssigningTo(null)}
                        onChange={(e) => handleAssignEmployee(s.nome, e.target.value)}
                        style={{ padding: '2px', fontSize: '10px', width: '100%' }}
                      >
                        <option value="">Adicionar...</option>
                        {employees.filter(e => !s.funcionarios?.some((f: any) => f.id === e.id)).map(e => (
                          <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <button 
                        onClick={() => setAssigningTo(s.nome)}
                        style={{ padding: '2px 8px', fontSize: '9px', backgroundColor: '#fff', color: '#000', borderStyle: 'dashed', width: '100%' }}
                      >
                        <UserPlus size={10} /> ADICIONAR MEMBRO
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => startStep(selectedAircraftCode, s.nome)}
                    style={{ marginTop: '15px', width: '100%', fontSize: '10px', padding: '4px', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                  >
                    <Plus size={12} /> INICIAR ESTA ETAPA
                  </button>
                </div>
              ))}
            </div>          </div>

          {/* EM ANDAMENTO */}
          <div className="box" style={{ backgroundColor: '#fff7ed', borderStyle: 'dashed' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9a3412', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> EM EXECUÇÃO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {steps.filter(s => s.status === 'EM_ANDAMENTO').map((s, idx) => (
                <div key={idx} className="box" style={{ fontSize: '12px', border: '2px solid #9a3412' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{s.nome}</div>
                  <div style={{ color: '#666' }}>Prazo: {s.prazo}</div>

                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>EQUIPE ATIVA:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                      {s.funcionarios?.map((f: any) => (
                        <span key={f.id} style={{ padding: '2px 6px', backgroundColor: '#ffedd5', color: '#9a3412', fontSize: '9px', fontWeight: 'bold', border: '1px solid #9a3412' }}>
                          {f.nome.split(' ')[0]}
                        </span>
                      ))}
                    </div>

                    {assigningTo === s.nome ? (
                      <select 
                        autoFocus
                        onBlur={() => setAssigningTo(null)}
                        onChange={(e) => handleAssignEmployee(s.nome, e.target.value)}
                        style={{ padding: '2px', fontSize: '10px', width: '100%' }}
                      >
                        <option value="">Adicionar...</option>
                        {employees.filter(e => !s.funcionarios?.some((f: any) => f.id === e.id)).map(e => (
                          <option key={e.id} value={e.id}>{e.nome}</option>
                        ))}
                      </select>
                    ) : (
                      <button 
                        onClick={() => setAssigningTo(s.nome)}
                        style={{ padding: '2px 8px', fontSize: '9px', backgroundColor: '#fff', color: '#9a3412', border: '1px dashed #9a3412', width: '100%' }}
                      >
                        <UserPlus size={10} /> REFORÇAR EQUIPE
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => finishStep(selectedAircraftCode, s.nome)}
                    style={{ marginTop: '15px', width: '100%', fontSize: '10px', padding: '4px', backgroundColor: '#9a3412', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                  >
                    <Check size={12} /> FINALIZAR ETAPA
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* CONCLUIDO */}
          <div className="box" style={{ backgroundColor: '#f0fdf4' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#166534', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> CONCLUÍDO
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {steps.filter(s => s.status === 'CONCLUIDA').map((s, idx) => (
                <div key={idx} className="box" style={{ fontSize: '12px', opacity: 0.7 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{s.nome}</div>
                  <div style={{ color: '#666' }}>Finalizado ✓</div>
                  <div style={{ color: '#666', fontSize: '10px' }}>Equipe: {s.funcionarios?.map((f: any) => f.nome).join(', ') || '-'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR DE PEÇAS (BOM) */}
        <div className="box" style={{ borderStyle: 'dashed', backgroundColor: '#fff' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
            LISTA DE MATERIAIS (BOM)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {selectedAircraft?.pecas && selectedAircraft.pecas.length > 0 ? (
              selectedAircraft.pecas.map((p: any, idx: number) => {
                const isReady = p.status === 'PRONTA';
                const isTransport = p.status === 'EM_TRANSPORTE';
                
                return (
                  <div key={idx} style={{ paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{p.nome}</div>
                      <span style={{ 
                        fontSize: '8px', 
                        padding: '2px 5px', 
                        border: '1px solid #000',
                        backgroundColor: isReady ? 'var(--success-bg)' : (isTransport ? 'var(--warning-bg)' : '#f1f5f9'),
                        color: isReady ? 'var(--success)' : (isTransport ? 'var(--warning)' : '#64748b'),
                        fontWeight: 'bold'
                      }}>
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>FORNECEDOR: {p.fornecedor}</div>
                    <div style={{ fontSize: '9px', marginTop: '4px', display: 'inline-block', padding: '2px 6px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}>
                      {p.tipo}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '11px', color: '#991b1b', textAlign: 'center', padding: '20px', backgroundColor: '#fee2e2', border: '1px solid #991b1b' }}>
                NENHUM COMPONENTE VINCULADO.<br/><br/>
                Vincule as peças no módulo <b>PEÇAS</b> para garantir a rastreabilidade.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
