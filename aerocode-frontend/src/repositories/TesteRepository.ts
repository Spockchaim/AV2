import { BaseRepository } from "./BaseRepository";
import { Teste } from "../models/Teste";

export class TesteRepository extends BaseRepository<Teste> {
    constructor() {
        super('testes');
    }

    public salvar(teste: Teste, codigoAeronave: string): void {
        const line = `${codigoAeronave};${teste.getTipo()};${teste.getResultado()}`;
        this.appendToStorage(codigoAeronave, line);
    }

    public salvarTodos(testes: Teste[], codigoAeronave: string): void {
        let data = '';
        testes.forEach(teste => {
            data += `${codigoAeronave};${teste.getTipo()};${teste.getResultado()}\n`;
        });
        this.saveToStorage(codigoAeronave, data.trim());
    }

    public listarPorAeronave(codigoAeronave: string): string[] {
        const data = this.getAllFromStorage();
        const content = data[codigoAeronave];
        if (!content) return [];
        return content.split('\n').filter((line: string) => line.trim() !== '');
    }
}
