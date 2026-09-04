import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonInput, IonButton, 
  IonSpinner, IonIcon, IonText 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, logInOutline } from 'ionicons/icons';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonInput, IonButton, 
    IonSpinner, IonIcon,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
    addIcons({ lockClosedOutline, mailOutline, logInOutline });
  }

  async login() {
    if (!this.email || !this.password) return;

    this.loading = true;
    this.error = null;

    try {
      await this.auth.signInWithEmail(this.email, this.password);
      // Si la connexion réussit, on redirige vers le dashboard
      this.router.navigateByUrl('/dashboard', { replaceUrl: true });
    } catch (err: any) {
      console.error(err);
      this.error = 'Email ou mot de passe incorrect.';
    } finally {
      this.loading = false;
    }
  }
}