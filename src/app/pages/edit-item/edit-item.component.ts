import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../../core/environments';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  styleUrls: ['./edit-item.component.css'],
})
export class EditItemComponent implements OnInit {
  @Input() item: any;
  @Output() onClose = new EventEmitter<void>();

  formProduto: FormGroup;
bsModalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {
    this.formProduto = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.item) {
      this.formProduto.patchValue(this.item);
    }
  }

  editarProduto() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    });

    if (this.item && this.item.id) {
      this.http
        .put(
          `${API_URL}/api/products/update-product/${this.item.id}`,
          this.formProduto.value,
          { headers }
        )
        .subscribe(
          (res: any) => {
            if (res.success) {
              console.log('Produto atualizado com sucesso!');
              this.onClose.emit();
              this.activeModal.close();
            } else {
              console.error('Erro ao atualizar produto:', res.message);
            }
          },
          (error: any) => {
            console.error('Erro ao atualizar produto:', error);
          }
        );
    }
  }
}
