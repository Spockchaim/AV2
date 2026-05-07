import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Beaker, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { TipoTeste } from '../models/TipoTeste';
import { ResultadoTeste } from '../models/ResultadoTeste';

export const QualidadePage = () => {
  const { aircrafts, addTestToAircraft } = useData();
  const [selectedAircraftCode, setSelectedAircraftCode] = useState(aircrafts[0]?.codigo || '');
  const [showForm, setShowForm] = useState(false);

  const [newTest, setNewTest] = useState({
    type: TipoTeste.ELETRICO,
    result: ResultadoTeste.APROVADO
  });

  const selectedAircraft = aircrafts.find(a => a.codigo === selectedAircraftCode);
  const tests = selectedAircraft?.testes || [];

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    addTestToAircraft(selectedAircraftCode, newTest.type, newTest.result);
    setShowForm(false);
  };

  const mandatoryTests = Object.values(TipoTeste);
  const approvedTests = tests
    .filter((t: any) => t.resultado === ResultadoTeste.APROVADO)
    .map((t: any) => t.tipo);
  
  const isAllApproved = mandatoryTests.every(type => approvedTests.includes(type));

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}>CONTROLE DE QUALIDADE E LAUDOS</h2>

      <div className="box" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label className="label">AERONAVE PARA INSPEÇÃO:</label>
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
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ height: '45px', marginTop: '25px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#3b82f6' }}
          >
            <Beaker size={18} /> {showForm ? 'CANCELAR' : 'REGISTRAR TESTE'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddTest} className="box" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc' }}>
          <div className="grid grid-2" style={{ gap: '20px' }}>
            <div>
              <label className="label">TIPO DE TESTE</label>
              <select 
                style={{ width: '100%', padding: '10px', border: '2px solid #000', fontFamily: 'inherit' }}
                value={newTest.type}
                onChange={(e) => setNewTest({ ...newTest, type: e.target.value as TipoTeste })}
              >
                {Object.values(TipoTeste).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">RESULTADO</label>
              <select 
                style={{ width: '100%', padding: '10px', border: '2px solid #000', fontFamily: 'inherit' }}
                value={newTest.result}
                onChange={(e) => setNewTest({ ...newTest, result: e.target.value as ResultadoTeste })}
              >
                {Object.values(ResultadoTeste).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button type="submit">REGISTRAR</button>
          </div>
        </form>
      )}


      <div className="grid grid-main-side">
        <div className="box" style={{ padding: '0' }}>
          <div style={{ padding: '15px', borderBottom: '2px solid #000', fontWeight: 'bold' }}>HISTÓRICO DE TESTES DA AERONAVE {selectedAircraftCode}</div>
          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: 'inherit' }}>
                  <th>TIPO DE TESTE</th>
                  <th>RESULTADO</th>
                </tr>
              </thead>
              <tbody>
                {tests.length > 0 ? tests.map((t: any, idx: number) => (
                  <tr key={idx} style={{ fontSize: '13px' }}>
                    <td style={{ fontWeight: 'bold' }}>{t.tipo}</td>
                    <td>
                      <span style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '5px',
                        color: t.resultado === ResultadoTeste.APROVADO ? '#166534' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {t.resultado === ResultadoTeste.APROVADO ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {t.resultado}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Sem testes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS FOR TESTS */}
        <div className="mobile-card-list">
          {tests.length > 0 ? tests.map((t: any, idx: number) => (
            <div key={idx} className="mobile-card">
              <div className="mobile-card-row">
                <span className="mobile-card-label">TESTE</span>
                <span className="mobile-card-value">{t.tipo}</span>
              </div>
              <div className="mobile-card-row">
                <span className="mobile-card-label">RESULTADO</span>
                <span className="mobile-card-value" style={{ color: t.resultado === ResultadoTeste.APROVADO ? '#166534' : '#ef4444' }}>
                  {t.resultado}
                </span>
              </div>
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666', fontSize: '12px' }}>Sem testes registrados.</div>
          )}
        </div>
      </div>

      <div className="box" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '20px', 
          textAlign: 'center', 
          backgroundColor: isAllApproved ? '#f0fdf4' : '#f8fafc' 
        }}>
          <ShieldCheck size={64} color={isAllApproved ? "#166534" : "#94a3b8"} />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: isAllApproved ? '#166534' : '#1e293b' }}>
              {isAllApproved ? 'STATUS: PRONTO' : 'STATUS: PENDENTE'}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {isAllApproved ? 'AERONAVE APROVADA PARA VOO' : 'REQUER TODOS OS TESTES DE SEGURANÇA (ELÉTRICO, HIDRÁULICO E AERODINÂMICO) APROVADOS'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
