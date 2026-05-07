import { Aeronave } from "./Aeronave";

export class Relatorio {
    private compilarConteudo(aeronave: Aeronave): string {
        let conteudo = `========================================\n`;
        conteudo += `       RELATORIO FINAL DE ENTREGA       \n`;
        conteudo += `========================================\n\n`;
        conteudo += `CLIENTE: ${aeronave.getCliente()}\n`;
        conteudo += `DATA DE ENTREGA: ${aeronave.getDataEntrega()}\n\n`;
        conteudo += `--- DADOS DA AERONAVE ---\n`;
        conteudo += `Modelo: ${aeronave.getModelo()} | Codigo: ${aeronave.getCodigo()}\n`;
        conteudo += `Tipo: ${aeronave.getTipo()}\n`;
        conteudo += `Capacidade: ${aeronave.getCapacidade()} passageiros\n`;
        conteudo += `Alcance: ${aeronave.getAlcance()} km\n\n`;
        
        conteudo += `--- COMPONENTES (PECAS) ---\n`;
        if (aeronave.getPecas().length === 0) {
            conteudo += `Nenhuma peca registrada.\n`;
        } else {
            aeronave.getPecas().forEach(peca => {
                conteudo += `- ${peca.getNome()} (${peca.getTipo()}) | Fornecedor: ${peca.getFornecedor()}\n`;
            });
        }

        conteudo += `\n--- ETAPAS DE PRODUCAO ---\n`;
        if (aeronave.getEtapas().length === 0) {
            conteudo += `Nenhuma etapa registrada.\n`;
        } else {
            aeronave.getEtapas().forEach(etapa => {
                conteudo += `- ${etapa.getNome()} | Status: ${etapa.getStatus()}\n`;
            });
        }

        conteudo += `\n--- RESULTADOS DE TESTES ---\n`;
        if (aeronave.getTestes().length === 0) {
            conteudo += `Nenhum teste registrado.\n`;
        } else {
            aeronave.getTestes().forEach(teste => {
                conteudo += `- Teste ${teste.getTipo()}: ${teste.getResultado()}\n`;
            });
        }

        conteudo += `\n========================================\n`;
        conteudo += `Status: Aeronave pronta para operacao.\n`;
        conteudo += `========================================\n`;
        return conteudo;
    }

    public gerarRelatorio(aeronave: Aeronave): string {
        return this.compilarConteudo(aeronave);
    }

    public baixarRelatorio(aeronave: Aeronave): void {
        const conteudo = this.compilarConteudo(aeronave);
        const element = document.createElement("a");
        const file = new Blob([conteudo], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `relatorio_${aeronave.getCodigo()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
