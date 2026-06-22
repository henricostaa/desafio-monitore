export type StatusEmpreendimento = 'Ativo' | 'Inativo';

export interface Empreendimento {
  id: string;
  nome: string;
  cnpj: string;
  endereco?: string | null;
  status: StatusEmpreendimento;
  dataCriacao: string | Date;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateEmpreendimentoDto {
  nome: string;
  cnpj: string;
  endereco?: string | null;
}

export interface UpdateEmpreendimentoDto {
  nome: string;
  endereco?: string | null;
}

export interface GetEmpreendimentosQuery {
  nome?: string;
  status?: number;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
