import { Routes } from '@angular/router';
import { EmpreendimentoListComponent } from './features/empreendimentos/empreendimento-list/empreendimento-list.component';
import { EmpreendimentoFormComponent } from './features/empreendimentos/empreendimento-form/empreendimento-form.component';

export const routes: Routes = [
  { path: '', component: EmpreendimentoListComponent },
  { path: 'novo', component: EmpreendimentoFormComponent },
  { path: 'editar/:id', component: EmpreendimentoFormComponent },
  { path: '**', redirectTo: '' }
];
