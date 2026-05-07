import { Aeronave } from "../models/Aeronave";
import { Peca } from "../models/Peca";
import { Etapa } from "../models/Etapa";
import { Teste } from "../models/Teste";
import { AeronaveRepository } from "../repositories/AeronaveRepository";
import { EtapaRepository } from "../repositories/EtapaRepository";
import { TesteRepository } from "../repositories/TesteRepository";
import { PecaAeronaveRepository } from "../repositories/PecaAeronaveRepository";
import { FuncionarioRepository } from "../repositories/FuncionarioRepository";
import { Funcionario } from "../models/Funcionario";
import { StatusEtapa } from "../models/StatusEtapa";
import { TipoAeronave } from "../models/TipoAeronave";

export class AeronaveService {
    private repository: AeronaveRepository;
    private etapaRepo: EtapaRepository;
    private testeRepo: TesteRepository;
    private pecaAeronaveRepo: PecaAeronaveRepository;
    private funcRepo: FuncionarioRepository;
    private aeronaves: Aeronave[] = [];
    private funcionarios: Map<string, Funcionario> = new Map();

    constructor() {
        this.repository = new AeronaveRepository();
        this.etapaRepo = new EtapaRepository();
        this.testeRepo = new TesteRepository();
        this.pecaAeronaveRepo = new PecaAeronaveRepository();
        this.funcRepo = new FuncionarioRepository();
        this.carregarFuncionarios();
        this.carregarDadosIniciais();
    }

    private carregarFuncionarios(): void {
        const arquivos = this.funcRepo.listarTodos();
        arquivos.forEach(linha => {
            const campos = linha.split(';');
            if (campos.length >= 7) {
                const [id, nome, telefone, endereco, usuario, senha, nivel] = campos.map(c => c.trim());
                this.funcionarios.set(id, new Funcionario(id, nome, telefone, endereco, usuario, senha, nivel as any));
            }
        });
    }

    private carregarDadosIniciais(): void {
        const arquivos = this.repository.listarTodos();
        arquivos.forEach(linha => {
            const campos = linha.split(';');
            if (campos.length >= 7) {
                const [codigo, modelo, tipo, capacidade, alcance, cliente, dataEntrega] = campos.map(c => c.trim());
                const aeronave = new Aeronave(
                    codigo, 
                    modelo, 
                    tipo as TipoAeronave, 
                    Number(capacidade), 
                    Number(alcance),
                    cliente,
                    dataEntrega
                );

                const etapasSalvas = this.etapaRepo.listarPorAeronave(codigo);
                etapasSalvas.forEach(eLinha => {
                    const eCampos = eLinha.split(';');
                    if (eCampos.length >= 4) {
                        const [_, nome, prazo, status, funcStr] = eCampos;
                        const etapa = new Etapa(nome, prazo, status as any);
                        if (funcStr && funcStr.startsWith('[') && funcStr.endsWith(']')) {
                            const ids = funcStr.slice(1, -1).split(',').filter(id => id.length > 0);
                            ids.forEach(id => {
                                const f = this.funcionarios.get(id);
                                if (f) etapa.associarFuncionario(f);
                            });
                        }
                        aeronave.adicionarEtapa(etapa);
                    }
                });

                const testesSalvos = this.testeRepo.listarPorAeronave(codigo);
                testesSalvos.forEach(tLinha => {
                    const tCampos = tLinha.split(';');
                    if (tCampos.length >= 3 && tCampos[0] === codigo) {
                        const [_, tipoT, res] = tCampos;
                        aeronave.adicionarTeste(new Teste(tipoT as any, res as any));
                    }
                });

                const pecasSalvas = this.pecaAeronaveRepo.listarPorAeronave(codigo);
                pecasSalvas.forEach(pLinha => {
                    const pCampos = pLinha.split(';');
                    if (pCampos.length >= 5 && pCampos[0] === codigo) {
                        const [_, nomeP, tipoP, fornecedor, statusP] = pCampos;
                        aeronave.adicionarPeca(new Peca(nomeP, tipoP as any, fornecedor, statusP as any));
                    }
                });

                this.aeronaves.push(aeronave);
            }
        });
    }

    public cadastrarAeronave(aeronave: Aeronave): void {
        const existe = this.buscarPorCodigo(aeronave.getCodigo());
        if (existe) {
            console.log(`Erro: Já existe uma aeronave com o código ${aeronave.getCodigo()} no sistema.`);
            return;
        }

        this.aeronaves.push(aeronave);
        this.repository.salvar(aeronave);
    }

    public atualizarAeronave(codigoAeronave: string): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            this.repository.salvar(aeronave);
        }
    }

    public adicionarPeca(codigoAeronave: string, peca: Peca): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            aeronave.adicionarPeca(peca);
            this.atualizarPecas(codigoAeronave);
        }
    }

    public atualizarPecas(codigoAeronave: string): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            this.pecaAeronaveRepo.salvarTodas(aeronave.getPecas(), codigoAeronave);
        }
    }

    public adicionarEtapa(codigoAeronave: string, etapa: Etapa): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            aeronave.adicionarEtapa(etapa);
            this.atualizarEtapas(codigoAeronave);
        }
    }

    public atualizarEtapas(codigoAeronave: string): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            this.etapaRepo.salvarTodas(aeronave.getEtapas(), codigoAeronave);
        }
    }

    public registrarTeste(codigoAeronave: string, teste: Teste): void {
        const aeronave = this.buscarPorCodigo(codigoAeronave);
        if (aeronave) {
            aeronave.adicionarTeste(teste);
            this.testeRepo.salvar(teste, codigoAeronave);
        }
    }

    public buscarPorCodigo(codigo: string): Aeronave | undefined {
        return this.aeronaves.find(a => a.getCodigo() === codigo);
    }

    public listarTodas(): Aeronave[] {
        return this.aeronaves;
    }
}
