import { StatusEtapa } from "./StatusEtapa";
import { Funcionario } from "./Funcionario";

export class Etapa {
    private nome: string;
    private prazo: string;
    private status: StatusEtapa;
    private funcionarios: Funcionario[];

    constructor(nome: string, prazo: string, status: StatusEtapa = StatusEtapa.PENDENTE) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = status;
        this.funcionarios = [];
    }

    
    public getNome(): string { return this.nome; }
    public getPrazo(): string { return this.prazo; }
    public getStatus(): StatusEtapa { return this.status; }

    
    public iniciar(): void {
        if (this.status === StatusEtapa.PENDENTE) {
            this.status = StatusEtapa.EM_ANDAMENTO;
            console.log(`Etapa "${this.nome}" iniciada.`);
        } else {
            console.log(`Não é possível iniciar a etapa "${this.nome}" pois seu status é: ${this.status}`);
        }
    }

    
    public finalizar(): void {
        if (this.status === StatusEtapa.EM_ANDAMENTO) {
            this.status = StatusEtapa.CONCLUIDA;
            console.log(`Etapa "${this.nome}" concluída com sucesso.`);
        } else {
            console.log(`Erro ao finalizar: a etapa "${this.nome}" deve estar em andamento.`);
        }
    }

    
    public associarFuncionario(funcionario: Funcionario): void {
        
        const jaExiste = this.funcionarios.some(f => f.getId() === funcionario.getId());
        if (!jaExiste) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário ${funcionario.getNome()} associado à etapa "${this.nome}".`);
        } else {
            console.log(`Funcionário ${funcionario.getNome()} já está associado a esta etapa.`);
        }
    }

    
    public listarFuncionarios(): Funcionario[] {
        return this.funcionarios;
    }
}
