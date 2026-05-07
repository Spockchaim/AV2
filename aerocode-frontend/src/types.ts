export enum Role {
  ADMIN = 'ADMINISTRADOR',
  ENGINEER = 'ENGENHEIRO',
  OPERATOR = 'OPERADOR'
}

export interface User {
  id: string;
  nome: string;
  usuario: string;
  nivelPermissao: Role;
  telefone?: string;
  endereco?: string;
}
