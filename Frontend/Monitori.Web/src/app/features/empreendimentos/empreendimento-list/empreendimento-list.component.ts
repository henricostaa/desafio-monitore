import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmpreendimentoService } from '../../../core/services/empreendimento.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Empreendimento, GetEmpreendimentosQuery } from '../../../core/models/empreendimento.model';

@Component({
  selector: 'app-empreendimento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './empreendimento-list.component.html',
  styleUrl: './empreendimento-list.component.css',
})
export class EmpreendimentoListComponent implements OnInit {
  private readonly service = inject(EmpreendimentoService);
  private readonly notification = inject(NotificationService);

  protected readonly empreendimentos = signal<Empreendimento[]>([]);
  protected readonly totalCount = signal<number>(0);

  protected readonly filterName = signal<string>('');
  protected readonly filterStatus = signal<string>(''); // "" (Todos), "1" (Ativo), "2" (Inativo)

  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = signal<number>(5);
  protected readonly sortBy = signal<string>('Nome');
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const query: GetEmpreendimentosQuery = {
      nome: this.filterName(),
      status: this.filterStatus() ? parseInt(this.filterStatus(), 10) : undefined,
      pageNumber: this.currentPage(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortOrder: this.sortOrder(),
    };

    this.service.getEmpreendimentos(query).subscribe({
      next: (res) => {
        this.empreendimentos.set(res.items);
        this.totalCount.set(res.totalCount);
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'Erro ao carregar empreendimentos.';
        this.notification.error(errorMsg);
      },
    });
  }

  onFilter(): void {
    this.currentPage.set(1);
    this.loadData();
  }

  onClearFilters(): void {
    this.filterName.set('');
    this.filterStatus.set('');
    this.currentPage.set(1);
    this.loadData();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
      this.loadData();
    }
  }

  onSort(column: string): void {
    if (this.sortBy() === column) {
      this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortOrder.set('asc');
    }
    this.currentPage.set(1);
    this.loadData();
  }

  onInactivate(id: string, name: string): void {
    if (confirm(`Deseja realmente inativar o empreendimento "${name}"?`)) {
      this.service.inactivate(id).subscribe({
        next: () => {
          this.notification.success('Empreendimento inativado com sucesso!');
          this.loadData();
        },
        error: (err) => {
          const errorMsg = err.error?.error || 'Erro ao inativar empreendimento.';
          this.notification.error(errorMsg);
        },
      });
    }
  }

  getMinIndex(): number {
    return Math.min(this.currentPage() * this.pageSize(), this.totalCount());
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize()) || 1;
  }

  get pages(): number[] {
    const list: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      list.push(i);
    }
    return list;
  }
}
