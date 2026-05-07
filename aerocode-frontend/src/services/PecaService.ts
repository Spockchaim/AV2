import { Peca } from "../models/Peca";
import { PecaRepository } from "../repositories/PecaRepository";

export class PecaService {
    private repository: PecaRepository;
    private pecas: Peca[] = [];

    constructor() {
        this.repository = new PecaRepository();
        this.carregarDadosIniciais();
    }

    private carregarDadosIniciais(): void {
        const arquivos = this.repository.listarTodos();
        arquivos.forEach(linha => {
            const campos = linha.split(';');
            if (campos.length >= 4) {
                const [nome, tipo, fornecedor, status] = campos;
                const peca = new Peca(nome, tipo as any, fornecedor, status as any);
                this.pecas.push(peca);
            }
        });
    }

    public cadastrarPeca(peca: Peca): void {
        this.pecas.push(peca);
        this.repository.salvar(peca);
    }

    public atualizarStatusPeca(nome: string, novoStatus: any): void {
        const peca = this.buscarPorNome(nome);
        if (peca) {
            peca.atualizarStatus(novoStatus);
            this.repository.salvar(peca);
        }
    }

    public listarTodas(): Peca[] {
        return this.pecas;
    }

    public buscarPorNome(nome: string): Peca | undefined {
        return this.pecas.find(p => p.getNome().toLowerCase() === nome.toLowerCase());
    }
}
