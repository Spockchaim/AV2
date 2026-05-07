import { BaseRepository } from "./BaseRepository";
import { Aeronave } from "../models/Aeronave";

export class AeronaveRepository extends BaseRepository<Aeronave> {
    constructor() {
        super('aeronaves');
    }

    public salvar(aeronave: Aeronave): void {
        const data = `${aeronave.getCodigo()};${aeronave.getModelo()};${aeronave.getTipo()};${aeronave.getCapacidade()};${aeronave.getAlcance()};${aeronave.getCliente()};${aeronave.getDataEntrega()}`;
        this.saveToStorage(aeronave.getCodigo(), data);
    }

    public listarTodos(): string[] {
        return this.readAll();
    }
}
