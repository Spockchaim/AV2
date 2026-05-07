import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileBarChart, Download, FileText, CheckCircle, UserCheck, Eye, X } from 'lucide-react';

export const RelatoriosPage = () => {
  const { 
    aircrafts, 
    parts,
    generateReport, 
    generateStockReport, 
    generateCollaboratorReport,
    previewReport,
    previewStockReport,
    previewCollaboratorReport
  } = useData();
  
  const [selectedAircraftCode, setSelectedAircraftCode] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [done, setDone] = useState(false);
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAircraftCode && client && date) {
      generateReport(selectedAircraftCode, client, date);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }
  };

  const handlePreview = () => {
    if (selectedAircraftCode && client && date) {
      const content = previewReport(selectedAircraftCode, client, date);
      setPreviewContent(content);
    } else {
      alert("Preencha todos os campos para visualizar o relatorio.");
    }
  };

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' }}>CENTRAL DE RELATÓRIOS E EXPORTAÇÃO</h2>

      <div className="grid grid-2" style={{ marginBottom: '40px' }}>
        <div className="box" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px' }}>
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '4px' }}>
            <FileBarChart size={32} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{aircrafts.length}</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>AERONAVES CADASTRADAS</div>
          </div>
        </div>

        <div className="box" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '30px' }}>
          <div style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '15px', borderRadius: '4px' }}>
            <Download size={32} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{parts.length}</div>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>PEÇAS NO INVENTÁRIO</div>
          </div>
        </div>
      </div>

      <div className="box" style={{ padding: '30px', backgroundColor: '#f8fafc', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
          GERAR LAUDO FINAL DE AERONAVE (AIRWORTHINESS)
        </h3>
        
        <form onSubmit={handleGenerate} className="grid grid-2">
          <div>
            <label className="label">SELECIONE A AERONAVE</label>
            <select 
              style={{ width: '100%', padding: '10px', border: '2px solid #000', fontFamily: 'inherit', marginTop: '10px' }}
              value={selectedAircraftCode}
              onChange={(e) => setSelectedAircraftCode(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {aircrafts
                .filter(a => a.statusCalculado === 'Concluído')
                .map(a => (
                  <option key={a.codigo} value={a.codigo}>{a.codigo} - {a.modelo}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="label">NOME DO CLIENTE / COMPANHIA</label>
            <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Ex: LATAM Airlines" required style={{ marginTop: '10px' }} />
          </div>
          <div>
            <label className="label">DATA DE ENTREGA</label>
            <input type="text" value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/AAAA" required style={{ marginTop: '10px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <button 
              type="button" 
              onClick={handlePreview}
              style={{ flex: 1, backgroundColor: '#fff', color: '#000', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px solid #000' }}
            >
              <Eye size={18} /> VISUALIZAR
            </button>
            <button type="submit" style={{ flex: 1, backgroundColor: '#000', color: '#fff', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {done ? <><CheckCircle size={18} /> RELATÓRIO SALVO</> : <><Download size={18} /> GERAR TXT</>}
            </button>
          </div>
        </form>
        {aircrafts.filter(a => a.statusCalculado === 'Concluído').length === 0 && (
          <div style={{ marginTop: '15px', fontSize: '12px', color: '#991b1b', fontWeight: 'bold', backgroundColor: '#fee2e2', padding: '10px', border: '1px solid #991b1b' }}>
            AVISO: Nenhuma aeronave concluída disponível para emissão de laudo. Finalize todas as etapas na página de Produção.
          </div>
        )}
        {done && <div style={{ marginTop: '15px', fontSize: '11px', color: '#166534', fontWeight: 'bold' }}>O arquivo foi gerado e salvo na pasta 'relatorios/' no servidor de dados.</div>}
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>RELATÓRIOS DO SISTEMA</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div className="box flex-mobile-column" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '20px', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FileText size={24} />
            <div>
              <div style={{ fontWeight: 'bold' }}>Peças em Estoque</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Lista completa de peças, fornecedores e status atual no inventário.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setPreviewContent(previewStockReport())}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto', backgroundColor: '#fff', border: '1px solid #000', color: '#000' }}
            >
              <Eye size={16} /> VISUALIZAR
            </button>
            <button 
              onClick={() => generateStockReport()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto' }}
            >
              <Download size={16} /> GERAR .TXT
            </button>
          </div>
        </div>

        <div className="box flex-mobile-column" style={{ justifyContent: 'space-between', alignItems: 'center', padding: '20px', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UserCheck size={24} />
            <div>
              <div style={{ fontWeight: 'bold' }}>Status e Histórico dos Colaboradores</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Registro de atividades e participações de cada membro da equipe em projetos.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setPreviewContent(previewCollaboratorReport())}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto', backgroundColor: '#fff', border: '1px solid #000', color: '#000' }}
            >
              <Eye size={16} /> VISUALIZAR
            </button>
            <button 
              onClick={() => generateCollaboratorReport()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'auto' }}
            >
              <Download size={16} /> GERAR .TXT
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE VISUALIZAÇÃO */}
      {previewContent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="box" style={{ 
            backgroundColor: '#fff', 
            width: '100%', 
            maxWidth: '800px', 
            maxHeight: '90vh', 
            overflow: 'auto',
            position: 'relative',
            padding: '40px'
          }}>
            <button 
              onClick={() => setPreviewContent(null)}
              style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '10px', 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#000',
                cursor: 'pointer',
                width: 'auto',
                padding: '5px'
              }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>PRÉVIA DO RELATÓRIO</h3>
            <pre style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '20px', 
              borderRadius: '4px', 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace',
              fontSize: '13px',
              border: '1px solid #cbd5e1',
              lineHeight: '1.5'
            }}>
              {previewContent}
            </pre>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setPreviewContent(null)} style={{ width: 'auto', padding: '10px 30px' }}>FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
