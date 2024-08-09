import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { API_URL } from '../../core/environments';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [BsModalService]
})
export class ListComponent {

  formProduto = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required),

  });

  apiurl = API_URL;
  token = localStorage.getItem('token');
  showForm = false;
  isEdit = false;
  editingItemId: number | null = null;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'stock',
    'actions',
  ];
  dataSource: any[] = [];

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    private bsModalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.isEdit = false;
    this.formProduto.reset();
  }

  getItem() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    this.http
      .get(`${this.apiurl}/api/products/get-all-products`, { headers })
      .subscribe((res: any) => {
        if (res.success) {
          this.dataSource = res.data.products;
        } else {
          console.error('Erro ao carregar produtos:', res.message);
        }
      });
  }

  criarItem() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });

    const formData = this.formProduto.value;
    if (this.isEdit && this.editingItemId !== null) {
      // Atualiza o item existente
      this.http
        .put(
          `${this.apiurl}/api/products/update-product/${this.editingItemId}`,
          formData,
          { headers }
        )
        .subscribe(
          (res: any) => {
            if (res.success) {
              console.log('Produto atualizado com sucesso!');
              this.getItem();
              this.toggleForm();
            } else {
              console.error('Erro ao atualizar produto:', res.message);
            }
          },
          (error: any) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    } else {

      this.http
        .post(`${this.apiurl}/api/products/create-product`, formData, {
          headers,
        })
        .subscribe(
          (res: any) => {
            if (res.success) {
              console.log('Produto criado com sucesso!');
              this.getItem();
              this.toggleForm();
            } else {
              console.error('Erro ao criar produto:', res.message);
            }
          },
          (error: any) => {
            console.error('Erro ao criar produto:', error);
          }
        );
    }
  }

  editItem(element: any): void {
    const initialState: Partial<EditItemComponent> = {
      item: element,
    };
    this.bsModalRef = this.bsModalService.show(EditItemComponent, {
      initialState,
    });
    this.bsModalRef.content.onClose.subscribe(() => {
      this.getItem();
    });
  }

  deleteItem(id: number) {
    if (confirm(`Deseja excluir o produto com ID ${id}?`)) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      });

      this.http
        .delete(`${this.apiurl}/api/products/delete-product/${id}`, { headers })
        .subscribe(
          (res: any) => {
            if (res.success) {
              console.log('Produto excluído com sucesso!');
              this.getItem();
            } else {
              console.error('Erro ao excluir produto:', res.message);
            }
          },
          (error: any) => {
            console.error('Erro ao excluir produto:', error);
          }
        );
    }
  }
}
