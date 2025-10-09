import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { emailDomainValidator } from './emailDomainValidator';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
})
export class RegisterComponent {
  public naslov = 'Kreiraj svoj nalog';

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email, emailDomainValidator()],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);

      const formData = this.registerForm.value;
      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Korisnik registrovan:', response);

          this.snackBar.open('Uspešna registracija!', 'Zatvori', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Greška pri registraciji:', error);

          this.snackBar.open(
            'Greška pri registraciji. Pokušaj ponovo.',
            'Zatvori',
            {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );

          this.registerForm.reset();
        }
      );
    } else {
      console.log('Forma nije validna');

      this.snackBar.open(
        'Popuni sve potrebne podatke. Pokušaj ponovo.',
        'Zatvori',
        {
          duration: 6000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );

      this.registerForm.reset();
    }
  }
}
