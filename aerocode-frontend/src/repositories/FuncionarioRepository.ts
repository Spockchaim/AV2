import { BaseRepository } from "./BaseRepository";
import { Funcionario } from "../models/Funcionario";

export class FuncionarioRepository extends BaseRepository<Funcionario> {
    constructor() {
        super('funcionarios');
    }

    public salvar(funcionario: Funcionario): void {
        const data = `${funcionario.getId()};${funcionario.getNome()};${funcionario.getTelefone()};${funcionario.getEndereco()};${funcionario.getUsuario()};${funcionario.getSenha()};${funcionario.getNivelPermissao()}`;
        this.saveToStorage(funcionario.getId(), data);
    }

    public listarTodos(): string[] {
        return this.readAll();
    }
}
