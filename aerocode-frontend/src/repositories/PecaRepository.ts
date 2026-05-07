import { BaseRepository } from "./BaseRepository";
import { Peca } from "../models/Peca";

export class PecaRepository extends BaseRepository<Peca> {
    constructor() {
        super('pecas');
    }

    public salvar(peca: Peca): void {
        const data = `${peca.getNome()};${peca.getTipo()};${peca.getFornecedor()};${peca.getStatus()}`;
        this.saveToStorage(peca.getNome(), data);
    }

    public listarTodos(): string[] {
        return this.readAll();
    }
}
