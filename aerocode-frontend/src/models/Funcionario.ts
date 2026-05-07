import { NivelPermissao } from "./NivelPermissao";

export class Funcionario {
    private id: string;
    private nome: string;
    private telefone: string;
    private endereco: string;
    private usuario: string;
    private senha: string;
    private nivelPermissao: NivelPermissao;

    constructor(
        id: string,
        nome: string,
        telefone: string,
        endereco: string,
        usuario: string,
        senha: string,
        nivelPermissao: NivelPermissao
    ) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senha = senha;
        this.nivelPermissao = nivelPermissao;
    }

    
    public getId(): string { return this.id; }
    public getNome(): string { return this.nome; }
    public getTelefone(): string { return this.telefone; }
    public getEndereco(): string { return this.endereco; }
    public getUsuario(): string { return this.usuario; }
    public getSenha(): string { return this.senha; }
    public getNivelPermissao(): NivelPermissao { return this.nivelPermissao; }

    
    public autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.senha === senha;
    }

    
    public salvar(): void {
        console.log(`Salvando funcionário ${this.nome} no sistema...`);
    }

    
    public carregar(): void {
        console.log(`Carregando dados do funcionário ID: ${this.id}...`);
    }
}
