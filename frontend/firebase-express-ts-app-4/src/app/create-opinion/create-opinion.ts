import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { RouterLink } from '@angular/router';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { CreateOpinionData } from '../interfaces/createOpinionData.interface';
import { OpinionService } from '../services/opinion-service';

@Component({
  selector: 'app-create-opinion',
  imports: [RouterLink, FormField],
  templateUrl: './create-opinion.html',
  styleUrl: './create-opinion.css',
})
export class CreateOpinion {
  authService = inject(AuthService);
  opinionService = inject(OpinionService);
  btnMessage = signal('Create opinion');

  formModel = signal<CreateOpinionData>({
    opinion: '',
  });

  form = form(this.formModel, (schemaPath) => {
    required(schemaPath.opinion, { message: 'Opinion is required' });
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.form, async () => {
      const { opinion } = this.formModel();

      await this.opinionService.createOpinion(opinion);
      this.form().reset({ opinion: '' });
    });
  }
}
