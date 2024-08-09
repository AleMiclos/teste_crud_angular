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
import { NewItemComponent } from '../new-item/new-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [MatTableModule, HttpClientModule, ReactiveFormsModule, CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [BsModalService]
})
export class ListComponent {

  formProduto: FormGroup;
  apiurl = API_URL;
  token = localStorage.getItem('token');
  showForm = false;
  isEdit = false;
  editingItemId: number | null = null;
  modalRef!: BsModalRef;

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
    private bsModalService: BsModalService
  ) {
    this.formProduto = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
    });
  }

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

  adicionarProduto() {
    this.modalRef = this.bsModalService.show(NewItemComponent, {
    });
    this.modalRef.content.onClose.subscribe((result: string) => {
      if (result === 'success') {
        this.getItem();
      }
    });
  }


  editItem(element: any): void {
    const initialState: Partial<EditItemComponent> = {
      item: element,
    };
    this.modalRef = this.bsModalService.show(EditItemComponent, {
      initialState,
    });
    this.modalRef.content.onClose.subscribe(() => {
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
            alert('Produto excluído com sucesso!');
            window.location.reload()
            this.getItem();
          },
          (error: any) => {
            console.error('Erro ao excluir produto:', error);
          }
        );
    }
  }
}
