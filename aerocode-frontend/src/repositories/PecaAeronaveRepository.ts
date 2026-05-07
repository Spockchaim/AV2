import { BaseRepository } from "./BaseRepository";
import { Peca } from "../models/Peca";

export class PecaAeronaveRepository extends BaseRepository<Peca> {
    constructor() {
        super('aeronave_pecas');
    }

    public salvarTodas(pecas: Peca[], codigoAeronave: string): void {
        let data = '';
        pecas.forEach(peca => {
            data += `${codigoAeronave};${peca.getNome()};${peca.getTipo()};${peca.getFornecedor()};${peca.getStatus()}\n`;
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
