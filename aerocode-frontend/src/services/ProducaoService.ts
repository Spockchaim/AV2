import { AeronaveService } from "./AeronaveService";
import { Etapa } from "../models/Etapa";
import { StatusEtapa } from "../models/StatusEtapa";
import { Funcionario } from "../models/Funcionario";

export class ProducaoService {
    constructor(private aeronaveService: AeronaveService) {}

    public iniciarNovaEtapa(codigoAeronave: string, nomeEtapa: string, prazo: string): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return;

        const novaEtapa = new Etapa(nomeEtapa, prazo, StatusEtapa.PENDENTE);
        this.aeronaveService.adicionarEtapa(codigoAeronave, novaEtapa);
        this.aeronaveService.atualizarEtapas(codigoAeronave);
    }

    public iniciarEtapa(codigoAeronave: string, nomeEtapa: string): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return;

        const etapas = aeronave.getEtapas();
        const index = etapas.findIndex(e => e.getNome() === nomeEtapa);
        
        if (index === -1) return;

        // Validação de Ordem Lógica: Todas as etapas anteriores devem estar CONCLUIDA
        for (let i = 0; i < index; i++) {
            if (etapas[i].getStatus() !== StatusEtapa.CONCLUIDA) {
                throw new Error(`Não é possível iniciar "${nomeEtapa}": a etapa anterior "${etapas[i].getNome()}" ainda não foi concluída.`);
            }
        }

        etapas[index].iniciar();
        this.aeronaveService.atualizarEtapas(codigoAeronave);
    }

    public finalizarEtapa(codigoAeronave: string, nomeEtapa: string): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return;

        const etapa = aeronave.getEtapas().find(e => e.getNome() === nomeEtapa && e.getStatus() === StatusEtapa.EM_ANDAMENTO);
        if (etapa) {
            etapa.finalizar();
            this.aeronaveService.atualizarEtapas(codigoAeronave);
        }
    }

    public vincularResponsavel(codigoAeronave: string, nomeEtapa: string, funcionario: Funcionario): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return;

        const etapa = aeronave.getEtapas().find(e => e.getNome() === nomeEtapa);
        if (etapa) {
            etapa.associarFuncionario(funcionario);
            this.aeronaveService.atualizarEtapas(codigoAeronave);
        }
    }
}
