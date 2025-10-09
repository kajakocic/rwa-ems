import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class LoginComponent {
  public naslov = 'Prijavi se na svoj nalog';

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log('Prijavljeni ste:', response);
          this.authService.saveUser(response);

          //potvrda za uspesnu prijavu
          this.snackBar.open('Uspešna prijava!', 'Zatvori', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Redirekcija na stranicu "Aktuelna dešavanja" nakon uspešne prijave
          this.router.navigate(['/events']);
        },
        (error) => {
          console.error('Greška pri prijavi:', error);

          // Greška prilikom prijave, resetovanje polja
          this.loginForm.reset();

          //greska prilikom prijave
          this.snackBar.open(
            'Pogrešan email ili lozinka. Pokušaj ponovo.',
            'Zatvori',
            {
              duration: 6000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }
          );
        }
      );
    } else {
      console.log('Forma nije validna');

      this.snackBar.open('Popuni sve potrebne podatke.', 'Zatvori', {
        duration: 6000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
}
