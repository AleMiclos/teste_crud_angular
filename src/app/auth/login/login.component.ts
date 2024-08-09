
import { Router } from '@angular/router';
import { routes } from './../../app.routes';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_URL } from '../../core/environments';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [HttpClientModule]
})
export class LoginComponent {
  loginForm!: FormGroup;
  apiurl = API_URL
  token: string = ''

  constructor(
    private router : Router,
    private fb: FormBuilder,
    private http: HttpClient
  ){}

  ngOnInit() {

    this.loginForm = this.fb.group({
      taxNumber: ['', Validators.required],
      password: ['', Validators.required],
    });
  }



  login(loginForm: any) {

    this.http.post(`${this.apiurl}/api/auth/login`, loginForm.value).subscribe(
      (res: any) => {
        this.token = res.data.token
        localStorage.setItem('token', this.token)

        if (res) {
          this.router.navigate(['/list']);
        }
      },
      error => {
        alert('Invalid credentials');
      }
    );
  }

}
