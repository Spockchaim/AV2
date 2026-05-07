import { Aeronave } from "./Aeronave";
import { Peca } from "./Peca";
import { Funcionario } from "./Funcionario";

export class Relatorio {
    public compilarConteudoAeronave(aeronave: Aeronave): string {
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

        conteudo += `\n--- ETAPAS E COLABORADORES ---\n`;
        if (aeronave.getEtapas().length === 0) {
            conteudo += `Nenhuma etapa registrada.\n`;
        } else {
            aeronave.getEtapas().forEach(etapa => {
                const equipe = etapa.listarFuncionarios().map(f => f.getNome()).join(", ") || "Nenhum";
                conteudo += `- ${etapa.getNome()} | Status: ${etapa.getStatus()}\n`;
                conteudo += `  Equipe: ${equipe}\n`;
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

    public gerarRelatorioEstoque(pecas: Peca[]): string {
        let conteudo = `========================================\n`;
        conteudo += `      RELATORIO: PECAS EM ESTOQUE       \n`;
        conteudo += `========================================\n\n`;
        conteudo += `Data de Geracao: ${new Date().toLocaleDateString()}\n\n`;
        
        if (pecas.length === 0) {
            conteudo += `Estoque vazio.\n`;
        } else {
            pecas.forEach(peca => {
                conteudo += `ITEM: ${peca.getNome()}\n`;
                conteudo += `- Tipo: ${peca.getTipo()} | Fornecedor: ${peca.getFornecedor()}\n`;
                conteudo += `- Status: ${peca.getStatus()}\n`;
                conteudo += `----------------------------------------\n`;
            });
        }
        return conteudo;
    }

    public gerarRelatorioColaboradores(funcionarios: Funcionario[], aeronaves: Aeronave[]): string {
        let conteudo = `========================================\n`;
        conteudo += `    STATUS E HISTORICO COLABORADORES    \n`;
        conteudo += `========================================\n\n`;
        
        funcionarios.forEach(f => {
            conteudo += `COLABORADOR: ${f.getNome()} [ID: ${f.getId()}]\n`;
            conteudo += `Cargo: ${f.getNivelPermissao()}\n`;
            conteudo += `Historico de Atividades:\n`;
            
            let participacoes = 0;
            aeronaves.forEach(aero => {
                aero.getEtapas().forEach(etapa => {
                    if (etapa.listarFuncionarios().some(func => func.getId() === f.getId())) {
                        conteudo += `- Aeronave: ${aero.getModelo()} (${aero.getCodigo()}) | Etapa: ${etapa.getNome()}\n`;
                        participacoes++;
                    }
                });
            });
            
            if (participacoes === 0) {
                conteudo += `- Nenhuma atividade registrada ate o momento.\n`;
            }
            conteudo += `----------------------------------------\n`;
        });
        
        return conteudo;
    }

    public baixarRelatorio(aeronave: Aeronave): void {
        const conteudo = this.compilarConteudoAeronave(aeronave);
        this.downloadTxt(`relatorio_final_${aeronave.getCodigo()}`, conteudo);
    }

    public baixarRelatorioEstoque(pecas: Peca[]): void {
        const conteudo = this.gerarRelatorioEstoque(pecas);
        this.downloadTxt("relatorio_estoque_pecas", conteudo);
    }

    public baixarRelatorioColaboradores(funcionarios: Funcionario[], aeronaves: Aeronave[]): void {
        const conteudo = this.gerarRelatorioColaboradores(funcionarios, aeronaves);
        this.downloadTxt("relatorio_status_colaboradores", conteudo);
    }

    private downloadTxt(filename: string, content: string): void {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${filename}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
