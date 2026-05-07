import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AeronaveService } from '../services/AeronaveService';
import { PecaService } from '../services/PecaService';
import { FuncionarioService } from '../services/FuncionarioService';
import { ProducaoService } from '../services/ProducaoService';
import { TesteService } from '../services/TesteService';
import { RelatorioService } from '../services/RelatorioService';

import { Aeronave } from '../models/Aeronave';
import { Peca } from '../models/Peca';
import { Funcionario } from '../models/Funcionario';
import { TipoTeste } from '../models/TipoTeste';
import { ResultadoTeste } from '../models/ResultadoTeste';
import { NivelPermissao } from '../models/NivelPermissao';
import { TipoAeronave } from '../models/TipoAeronave';
import { TipoPeca } from '../models/TipoPeca';
import { StatusPeca } from '../models/StatusPeca';

// Interfaces estritamente alinhadas aos Models AV1
export interface Aircraft {
  codigo: string;
  modelo: string;
  tipo: string;
  capacidade: number;
  alcance: number;
  cliente: string;
  dataEntrega: string;
  pecas: any[];
  etapas: any[];
  testes: any[];
  statusCalculado: string; // Campo extra para UI
}

export interface Part {
  nome: string;
  tipo: string;
  fornecedor: string;
  status: string;
}

export interface Employee {
  id: string;
  nome: string;
  usuario: string;
  nivelPermissao: string;
  status: string; // UI status
  telefone?: string;
  endereco?: string;
}

interface DataContextType {
  aircrafts: Aircraft[];
  parts: Part[];
  employees: Employee[];
  addAircraft: (a: Partial<Aircraft>) => void;
  removeAircraft: (codigo: string) => void;
  addPart: (p: Partial<Part>) => void;
  updatePartStatus: (nome: string, status: any) => void;
  removePart: (nome: string) => void;
  addEmployee: (e: any) => void;
  updateEmployee: (e: any) => void;
  linkPartToAircraft: (codigoAero: string, nomePeca: string) => void;
  addStepToAircraft: (codigoAero: string, nome: string, prazo: string, employeeId?: string) => void;
  addEmployeeToStep: (codigoAero: string, nomeEtapa: string, employeeId: string) => void;
  startStep: (codigoAero: string, nomeEtapa: string) => void;
  finishStep: (codigoAero: string, nomeEtapa: string) => void;
  addTestToAircraft: (codigoAero: string, tipo: TipoTeste, resultado: ResultadoTeste) => void;
  generateReport: (codigoAero: string, cliente: string, data: string) => void;
  generateStockReport: () => void;
  generateCollaboratorReport: () => void;
  previewReport: (codigoAero: string, cliente: string, data: string) => string;
  previewStockReport: () => string;
  previewCollaboratorReport: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const aeronaveService = new AeronaveService();
const pecaService = new PecaService();
const funcionarioService = new FuncionarioService();
const producaoService = new ProducaoService(aeronaveService);
const testeService = new TesteService(aeronaveService);
const relatorioService = new RelatorioService(aeronaveService);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    seedInitialData();
    refreshData();
  }, []);

  const seedInitialData = () => {
    if (aeronaveService.listarTodas().length === 0) {
      aeronaveService.cadastrarAeronave(new Aeronave("101", "Aerorinthians", TipoAeronave.COMERCIAL, 12, 999));
      testeService.realizarTeste("101", TipoTeste.ELETRICO, ResultadoTeste.APROVADO);
    }
    if (pecaService.listarTodas().length === 0) {
      pecaService.cadastrarPeca(new Peca("Helice", TipoPeca.NACIONAL, "Embrac", StatusPeca.EM_PRODUCAO));
    }
    if (funcionarioService.listarTodos().length === 0) {
      funcionarioService.cadastrarFuncionario(new Funcionario("1", "Administrador Padrao", "000", "Sede", "adm", "adm", NivelPermissao.ADMINISTRADOR));
      funcionarioService.cadastrarFuncionario(new Funcionario("2", "Engenheiro Padrao", "111", "Fabrica", "eng", "eng", NivelPermissao.ENGENHEIRO));
      funcionarioService.cadastrarFuncionario(new Funcionario("3", "Operador Padrao", "222", "Linha Montagem", "op", "op", NivelPermissao.OPERADOR));
      funcionarioService.cadastrarFuncionario(new Funcionario("1001", "Corinthisvaldo", "", "", "corinthians", "123", NivelPermissao.OPERADOR));
    }
  };

  const refreshData = () => {
    const allAero = aeronaveService.listarTodas();
    setAircrafts(allAero.map(a => ({
      codigo: a.getCodigo(),
      modelo: a.getModelo(),
      tipo: a.getTipo(),
      capacidade: a.getCapacidade(),
      alcance: a.getAlcance(),
      cliente: a.getCliente(),
      dataEntrega: a.getDataEntrega(),
      pecas: a.getPecas(),
      etapas: a.getEtapas(),
      testes: a.getTestes(),
      statusCalculado: a.getEtapas().length > 0 ? (a.getEtapas().every(e => e.getStatus() === 'CONCLUIDA') ? 'Concluído' : 'Em Produção') : 'Pendente'
    })));

    const allPecas = pecaService.listarTodas();
    setParts(allPecas.map(p => ({
      nome: p.getNome(),
      tipo: p.getTipo(),
      fornecedor: p.getFornecedor(),
      status: p.getStatus()
    })));

    const allFuncs = funcionarioService.listarTodos();
    setEmployees(allFuncs.map(f => ({
      id: f.getId(),
      nome: f.getNome(),
      usuario: f.getUsuario(),
      nivelPermissao: f.getNivelPermissao(),
      status: 'Ativo',
      telefone: f.getTelefone(),
      endereco: f.getEndereco()
    })));
  };

  const addAircraft = (a: Partial<Aircraft>) => {
    const aero = new Aeronave(a.codigo!, a.modelo!, a.tipo as any, a.capacidade!, a.alcance!);
    aeronaveService.cadastrarAeronave(aero);
    refreshData();
  };

  const removeAircraft = (codigo: string) => {
    setAircrafts(prev => prev.filter(a => a.codigo !== codigo));
  };

  const addPart = (p: Partial<Part>) => {
    const part = new Peca(p.nome!, p.tipo as any, p.fornecedor!, p.status as any);
    pecaService.cadastrarPeca(part);
    refreshData();
  };

  const updatePartStatus = (nome: string, status: any) => {
    pecaService.atualizarStatusPeca(nome, status);
    refreshData();
  };

  const removePart = (nome: string) => {
    setParts(prev => prev.filter(p => p.nome !== nome));
  };

  const addEmployee = (e: any) => {
    const emp = new Funcionario(e.id, e.nome, e.telefone, e.endereco, e.usuario, e.senha, e.nivelPermissao);
    funcionarioService.cadastrarFuncionario(emp);
    refreshData();
  };

  const updateEmployee = (e: any) => {
    const existing = funcionarioService.buscarPorId(e.id);
    const senha = e.senha ? e.senha : (existing ? existing.getSenha() : '123456');
    const emp = new Funcionario(e.id, e.nome, e.telefone, e.endereco, e.usuario, senha, e.nivelPermissao);
    funcionarioService.atualizarFuncionario(emp);
    refreshData();
  };

  const linkPartToAircraft = (codigoAero: string, nomePeca: string) => {
    const peca = pecaService.buscarPorNome(nomePeca);
    if (peca) {
      aeronaveService.adicionarPeca(codigoAero, peca);
      refreshData();
    }
  };

  const addStepToAircraft = (codigoAero: string, nome: string, prazo: string, employeeId?: string) => {
    producaoService.iniciarNovaEtapa(codigoAero, nome, prazo);
    if (employeeId) {
      const emp = funcionarioService.buscarPorId(employeeId);
      if (emp) {
        producaoService.vincularResponsavel(codigoAero, nome, emp);
      }
    }
    refreshData();
  };

  const addEmployeeToStep = (codigoAero: string, nomeEtapa: string, employeeId: string) => {
    const emp = funcionarioService.buscarPorId(employeeId);
    if (emp) {
      producaoService.vincularResponsavel(codigoAero, nomeEtapa, emp);
      refreshData();
    }
  };

  const startStep = (codigoAero: string, nomeEtapa: string) => {
    try {
      producaoService.iniciarEtapa(codigoAero, nomeEtapa);
      refreshData();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const finishStep = (codigoAero: string, nomeEtapa: string) => {
    producaoService.finalizarEtapa(codigoAero, nomeEtapa);
    refreshData();
  };

  const addTestToAircraft = (codigoAero: string, tipo: TipoTeste, resultado: ResultadoTeste) => {
    testeService.realizarTeste(codigoAero, tipo, resultado);
    refreshData();
  };

  const generateReport = (codigoAero: string, cliente: string, data: string) => {
    relatorioService.gerarRelatorioAeronave(codigoAero, cliente, data);
    refreshData();
  };

  const generateStockReport = () => {
    relatorioService.gerarRelatorioEstoque(pecaService.listarTodas());
  };

  const generateCollaboratorReport = () => {
    relatorioService.gerarRelatorioColaboradores(funcionarioService.listarTodos(), aeronaveService.listarTodas());
  };

  const previewReport = (codigoAero: string, cliente: string, data: string) => {
    return relatorioService.visualizarRelatorioAeronave(codigoAero, cliente, data);
  };

  const previewStockReport = () => {
    return relatorioService.visualizarRelatorioEstoque(pecaService.listarTodas());
  };

  const previewCollaboratorReport = () => {
    return relatorioService.visualizarRelatorioColaboradores(funcionarioService.listarTodos(), aeronaveService.listarTodas());
  };

  return (
    <DataContext.Provider value={{ 
      aircrafts, 
      parts, 
      employees,
      addAircraft, 
      removeAircraft,
      addPart,
      updatePartStatus,
      removePart,
      addEmployee,
      updateEmployee,
      linkPartToAircraft,
      addStepToAircraft,
      addEmployeeToStep,
      startStep,
      finishStep,
      addTestToAircraft,
      generateReport,
      generateStockReport,
      generateCollaboratorReport,
      previewReport,
      previewStockReport,
      previewCollaboratorReport
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
