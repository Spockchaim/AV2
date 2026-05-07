import { TipoAeronave } from "./TipoAeronave";
import { Peca } from "./Peca";
import { Etapa } from "./Etapa";
import { Teste } from "./Teste";

export class Aeronave {
    private codigo: string;
    private modelo: string;
    private tipo: TipoAeronave;
    private capacidade: number;
    private alcance: number;
    private cliente: string;
    private dataEntrega: string;
    private pecas: Peca[];
    private etapas: Etapa[];
    private testes: Teste[];
    
    
    
    constructor(
        codigo: string,
        modelo: string,
        tipo: TipoAeronave,
        capacidade: number,
        alcance: number,
        cliente: string = "Nao definido",
        dataEntrega: string = "Pendente"
    ) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.cliente = cliente;
        this.dataEntrega = dataEntrega;
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
    }

    
    public getCodigo(): string { return this.codigo; }
    public getModelo(): string { return this.modelo; }
    public getTipo(): TipoAeronave { return this.tipo; }
    public getCapacidade(): number { return this.capacidade; }
    public getAlcance(): number { return this.alcance; }
    public getCliente(): string { return this.cliente; }
    public getDataEntrega(): string { return this.dataEntrega; }
    public getPecas(): Peca[] { return this.pecas; }
    public getEtapas(): Etapa[] { return this.etapas; }
    public getTestes(): Teste[] { return this.testes; }

    public setCliente(cliente: string): void { this.cliente = cliente; }
    public setDataEntrega(data: string): void { this.dataEntrega = data; }

    
    public detalhar(): void {
        console.log(`--- Detalhes da Aeronave [${this.codigo}] ---`);
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);
        console.log(`Peças: ${this.pecas.length} | Etapas: ${this.etapas.length} | Testes: ${this.testes.length}`);
    }

    
    public adicionarPeca(peca: Peca): void {
        this.pecas.push(peca);
    }

    
    public adicionarEtapa(etapa: Etapa): void {
        this.etapas.push(etapa);
    }

    
    public adicionarTeste(teste: Teste): void {
        this.testes.push(teste);
    }

    
    public salvar(): void {
        console.log(`Salvando dados da aeronave ${this.codigo} em arquivo TXT...`);
    }

    public carregar(): void {
        console.log(`Carregando dados da aeronave ${this.codigo}...`);
    }
}
