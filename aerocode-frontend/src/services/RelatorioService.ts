import { AeronaveService } from "./AeronaveService";
import { Relatorio } from "../models/Relatorio";
import { Peca } from "../models/Peca";
import { Funcionario } from "../models/Funcionario";
import { Aeronave } from "../models/Aeronave";

export class RelatorioService {
    private relatorio: Relatorio;

    constructor(private aeronaveService: AeronaveService) {
        this.relatorio = new Relatorio();
    }

    public gerarRelatorioAeronave(codigoAeronave: string, cliente: string, dataEntrega: string): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);

        if (!aeronave) {
            return;
        }

        aeronave.setCliente(cliente);
        aeronave.setDataEntrega(dataEntrega);
        this.aeronaveService.atualizarAeronave(codigoAeronave);

        this.relatorio.baixarRelatorio(aeronave);
    }

    public visualizarRelatorioAeronave(codigoAeronave: string, cliente: string, dataEntrega: string): string {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return "Erro: Aeronave nao encontrada.";
        
        aeronave.setCliente(cliente);
        aeronave.setDataEntrega(dataEntrega);
        return this.relatorio.compilarConteudoAeronave(aeronave);
    }

    public gerarRelatorioEstoque(pecas: Peca[]): void {
        this.relatorio.baixarRelatorioEstoque(pecas);
    }

    public visualizarRelatorioEstoque(pecas: Peca[]): string {
        return this.relatorio.gerarRelatorioEstoque(pecas);
    }

    public gerarRelatorioColaboradores(funcionarios: Funcionario[], aeronaves: Aeronave[]): void {
        this.relatorio.baixarRelatorioColaboradores(funcionarios, aeronaves);
    }

    public visualizarRelatorioColaboradores(funcionarios: Funcionario[], aeronaves: Aeronave[]): string {
        return this.relatorio.gerarRelatorioColaboradores(funcionarios, aeronaves);
    }
}
