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
        const etapa = etapas.find(e => e.getNome() === nomeEtapa);
        
        if (!etapa) return;

        // Agora permitimos iniciar qualquer etapa, mesmo que as anteriores estejam em andamento
        etapa.iniciar();
        this.aeronaveService.atualizarEtapas(codigoAeronave);
    }

    public finalizarEtapa(codigoAeronave: string, nomeEtapa: string): void {
        const aeronave = this.aeronaveService.buscarPorCodigo(codigoAeronave);
        if (!aeronave) return;

        const etapas = aeronave.getEtapas();
        const index = etapas.findIndex(e => e.getNome() === nomeEtapa);
        
        if (index === -1) return;

        // Validação de Ordem Lógica de Entrega: 
        // Só pode finalizar se todas as etapas inseridas ANTES (index menor) estiverem CONCLUÍDAS
        for (let i = 0; i < index; i++) {
            if (etapas[i].getStatus() !== StatusEtapa.CONCLUIDA) {
                throw new Error(`Não é possível finalizar "${nomeEtapa}": a etapa anterior "${etapas[i].getNome()}" precisa ser finalizada primeiro.`);
            }
        }

        const etapa = etapas[index];
        if (etapa.getStatus() === StatusEtapa.EM_ANDAMENTO) {
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
