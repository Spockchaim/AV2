import { BaseRepository } from "./BaseRepository";
import { Etapa } from "../models/Etapa";

export class EtapaRepository extends BaseRepository<Etapa> {
    constructor() {
        super('etapas');
    }

    public salvarTodas(etapas: Etapa[], codigoAeronave: string): void {
        let data = '';
        etapas.forEach(etapa => {
            const funcionariosIds = etapa.listarFuncionarios().map(f => f.getId()).join(',');
            data += `${codigoAeronave};${etapa.getNome()};${etapa.getPrazo()};${etapa.getStatus()};[${funcionariosIds}]\n`;
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
