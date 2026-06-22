import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Empreendimento,
  PagedResult,
  CreateEmpreendimentoDto,
  UpdateEmpreendimentoDto,
  GetEmpreendimentosQuery,
} from '../models/empreendimento.model';

@Injectable({
  providedIn: 'root',
})
export class EmpreendimentoService {
  private readonly apiUrl = 'http://localhost:5041/api/empreendimento';

  constructor(private readonly http: HttpClient) {}

  getEmpreendimentos(query: GetEmpreendimentosQuery): Observable<PagedResult<Empreendimento>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString())
      .set('sortBy', query.sortBy)
      .set('sortOrder', query.sortOrder);

    if (query.nome) {
      params = params.set('nome', query.nome.trim());
    }

    if (query.status !== undefined && query.status !== null) {
      params = params.set('status', query.status.toString());
    }

    return this.http.get<PagedResult<Empreendimento>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<Empreendimento> {
    return this.http.get<Empreendimento>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEmpreendimentoDto): Observable<Empreendimento> {
    return this.http.post<Empreendimento>(this.apiUrl, dto);
  }

  update(id: string, dto: UpdateEmpreendimentoDto): Observable<Empreendimento> {
    return this.http.put<Empreendimento>(`${this.apiUrl}/${id}`, dto);
  }

  inactivate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
