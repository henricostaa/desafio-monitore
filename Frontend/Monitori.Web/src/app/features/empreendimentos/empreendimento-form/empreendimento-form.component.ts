import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpreendimentoService } from '../../../core/services/empreendimento.service';
import { NotificationService } from '../../../core/services/notification.service';
import { cnpjValidator } from './cnpj-validator';

@Component({
  selector: 'app-empreendimento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './empreendimento-form.component.html',
  styleUrl: './empreendimento-form.component.css',
})
export class EmpreendimentoFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EmpreendimentoService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected form!: FormGroup;
  protected readonly isEditMode = signal<boolean>(false);
  protected readonly id = signal<string | null>(null);
  protected readonly isLoadingState = signal<boolean>(false);
  protected readonly isInactiveRecord = signal<boolean>(false);

  ngOnInit(): void {
    this.initForm();
    this.checkRoute();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cnpj: ['', [Validators.required, cnpjValidator()]],
      endereco: [''],
    });
  }

  private checkRoute(): void {
    const routeId = this.route.snapshot.paramMap.get('id');
    if (routeId) {
      this.isEditMode.set(true);
      this.id.set(routeId);
      this.loadEmpreendimento(routeId);
    }
  }

  private loadEmpreendimento(id: string): void {
    this.isLoadingState.set(true);
    this.service.getById(id).subscribe({
      next: (emp) => {
        this.form.patchValue({
          nome: emp.nome,
          cnpj: this.formatCnpj(emp.cnpj),
          endereco: emp.endereco,
        });

        this.form.get('cnpj')?.disable();

        if (emp.status === 'Inativo') {
          this.isInactiveRecord.set(true);
          this.form.disable();
          this.notification.info('Este empreendimento está inativo e não pode ser editado.');
        }
        this.isLoadingState.set(false);
      },
      error: (err) => {
        const errorMsg = err.error?.error || 'Erro ao carregar os dados do empreendimento.';
        this.notification.error(errorMsg);
        this.router.navigate(['/']);
        this.isLoadingState.set(false);
      },
    });
  }

  protected onCnpjInput(event: any): void {
    let value = event.target.value;
    value = this.formatCnpjInput(value);
    this.form.patchValue({ cnpj: value }, { emitEvent: false });
  }

  private formatCnpj(raw: string): string {
    if (!raw) return '';
    const clean = raw.replace(/[^\d]/g, '');
    if (clean.length === 14) {
      return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
    return raw;
  }

  private formatCnpjInput(value: string): string {
    const clean = value.replace(/[^\d]/g, '');
    let formatted = clean;
    if (clean.length > 2) formatted = `${clean.slice(0, 2)}.${clean.slice(2)}`;
    if (clean.length > 5) formatted = `${formatted.slice(0, 6)}.${clean.slice(5)}`;
    if (clean.length > 8) formatted = `${formatted.slice(0, 10)}/${clean.slice(8)}`;
    if (clean.length > 12) formatted = `${formatted.slice(0, 15)}-${clean.slice(12, 14)}`;
    return formatted;
  }

  onSubmit(): void {
    if (this.form.invalid || this.isInactiveRecord()) {
      this.form.markAllAsTouched();
      return;
    }

    const formVal = this.form.getRawValue();
    const cnpjNumeros = formVal.cnpj.replace(/[^\d]/g, '');

    this.isLoadingState.set(true);

    if (this.isEditMode()) {
      const updateDto = {
        nome: formVal.nome,
        endereco: formVal.endereco,
      };

      this.service.update(this.id()!, updateDto).subscribe({
        next: () => {
          this.notification.success('Empreendimento atualizado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          const errorMsg = err.error?.error || 'Erro ao atualizar o empreendimento.';
          this.notification.error(errorMsg);
          this.isLoadingState.set(false);
        },
      });
    } else {
      const createDto = {
        nome: formVal.nome,
        cnpj: cnpjNumeros,
        endereco: formVal.endereco,
      };

      this.service.create(createDto).subscribe({
        next: () => {
          this.notification.success('Empreendimento cadastrado com sucesso!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          const errorMsg = err.error?.error || 'Erro ao cadastrar o empreendimento.';
          this.notification.error(errorMsg);
          this.isLoadingState.set(false);
        },
      });
    }
  }
}
