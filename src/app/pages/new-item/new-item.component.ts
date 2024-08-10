import { FormBuilder, FormControl, FormGroup, Validators}from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { API_URL } from '../../core/environments';
import { HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CssSelector } from '@angular/compiler';

@Component({
  selector: 'NewItemComponent',
  standalone: true,
  imports: [MatTableModule,HttpClientModule, ReactiveFormsModule],
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css'],
})
export class NewItemComponent {
    formProduto = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required)
  });

  apiurl = API_URL
  token = localStorage.getItem('token')
  router: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
  ){}

  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'stock'];
  dataSource: any[] = [];

  ngOnInit(): void {
    this.getItem();
  }

  getItem() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(`${this.apiurl}/api/products/get-all-products`, { headers }).subscribe((res: any) => {
      if (res.success) {
        this.dataSource = res.data.products;
      } else {
        console.error('Erro ao carregar produtos:', res.message);
      }
    })
  }

  criarItem() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    const formData = this.formProduto.value;
    console.log(formData);

    this.http.post(`${this.apiurl}/api/products/create-product`, formData, { headers })
      .subscribe((res: any) => {
        if (res.success) {
          alert('Produto criado com sucesso!');
          this.getItem();
          this.formProduto.reset();
          window.location.reload()
        } else {
          console.error('Erro ao criar produto:', res.message);
        }
      }, (error: any) => {
        console.error('Erro ao criar produto:', error);
      });
  }



}
