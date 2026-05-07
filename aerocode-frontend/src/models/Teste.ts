import { TipoTeste } from "./TipoTeste";
import { ResultadoTeste } from "./ResultadoTeste";

export class Teste {
    private tipo: TipoTeste;
    private resultado: ResultadoTeste;

    constructor(tipo: TipoTeste, resultado: ResultadoTeste) {
        this.tipo = tipo;
        this.resultado = resultado;
    }

    
    public getTipo(): TipoTeste { return this.tipo; }
    public getResultado(): ResultadoTeste { return this.resultado; }

    
    public salvar(): void {
        console.log(`Salvando resultado do teste ${this.tipo}: ${this.resultado}...`);
    }

    
    public carregar(): void {
        console.log(`Carregando teste ${this.tipo}...`);
    }
}
