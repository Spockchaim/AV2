import { AeronaveService } from "./AeronaveService";
import { Teste } from "../models/Teste";
import { TipoTeste } from "../models/TipoTeste";
import { ResultadoTeste } from "../models/ResultadoTeste";
import { TesteRepository } from "../repositories/TesteRepository";

export class TesteService {
    private repository: TesteRepository;

    constructor(private aeronaveService: AeronaveService) {
        this.repository = new TesteRepository();
    }

    public realizarTeste(codigoAeronave: string, tipo: TipoTeste, resultado: ResultadoTeste): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) {
            return;
        }

        const novoTeste = new Teste(tipo, resultado);
        aeronave.adicionarTeste(novoTeste);
        this.repository.salvar(novoTeste, codigoAeronave);
    }

    public listarTestesAeronave(codigoAeronave: string): Teste[] {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        return aeronave ? aeronave.getTestes() : [];
    }
}
