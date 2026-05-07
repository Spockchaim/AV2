import { TipoPeca } from "./TipoPeca";
import { StatusPeca } from "./StatusPeca";

export class Peca {
    private nome: string;
    private tipo: TipoPeca;
    private fornecedor: string;
    private status: StatusPeca;

    constructor(
        nome: string,
        tipo: TipoPeca,
        fornecedor: string,
        status: StatusPeca
    ) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = status;
    }

    
    public getNome(): string { return this.nome; }
    public getTipo(): TipoPeca { return this.tipo; }
    public getFornecedor(): string { return this.fornecedor; }
    public getStatus(): StatusPeca { return this.status; }

    
    public atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus;
        console.log(`Status da peça ${this.nome} atualizado para: ${this.status}`);
    }

    
    public salvar(): void {
        console.log(`Salvando peça ${this.nome} no sistema...`);
    }

    
    public carregar(): void {
        console.log(`Carregando peça ${this.nome}...`);
    }
}
