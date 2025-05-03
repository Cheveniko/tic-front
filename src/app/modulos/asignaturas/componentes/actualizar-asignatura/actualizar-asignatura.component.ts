import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Asignatura } from '../../modelos/asignatura.interface';
import { AsignaturaApiService } from '../../servicios/asignaturas_api.service';

@Component({
  selector: 'app-actualizar-asignatura',
  templateUrl: './actualizar-asignatura.component.html',
  styleUrls: ['./actualizar-asignatura.component.scss']
})
export class ActualizarAsignaturaComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly asignaturaService: AsignaturaApiService,
    private readonly dialogoReferencia: MatDialogRef<ActualizarAsignaturaComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly idAsignatura: string,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  asignatura?: Asignatura;
  formateoNombre?: string;
  formateoCodigo?: string;

  configuracion = { minCredito: 1, maxCredito: 5 };

  formatearTextoNombre(event: Event) {
    const lectura = (event.target as HTMLInputElement).value;
    if (this.formateoNombre != lectura) {
      this.formateoNombre = lectura.toUpperCase();
      this.formGroup?.get('nombre')?.setValue(this.formateoNombre);
    }
  }

  formatearTextoCodigo(event: Event) {
    const lectura = (event.target as HTMLInputElement).value;
    if (this.formateoCodigo != lectura) {
      this.formateoCodigo = lectura.toUpperCase();
      this.formGroup?.get('codigo')?.setValue(this.formateoCodigo);
    }
  }

  ngOnInit(): void {
    Swal.showLoading();
    this.obtenerAsignaturaPorID(this.idAsignatura);
  }

  actualizarAsignaturaPorID() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores
        const nuevaAsignatura: Asignatura = {
          codigo: this.formGroup.get('codigo')?.value,
          nombre: this.formGroup.get('nombre')?.value,
          creditos: Number(this.formGroup.get('creditos')?.value)
        };

        this.asignaturaService.actualizarAsignaturaPorID(this.idAsignatura, nuevaAsignatura)
          .subscribe({
            next: (res: any) => {
              Swal.fire(
                'Asignatura actualizada',
                'Se ha actualizado la asignatura existosamente.',
                'success'
              ).then(() => {
                this.dialogoReferencia.close();
              });
            },
            error: (res: any) => {
              Swal.fire(
                'Error',
                `${res.mensaje}`,
                'error'
              )
            }
          });
      }
    }
  }

  obtenerAsignaturaPorID(idAsignatura: string) {
    this.asignaturaService.obtenerAsignaturaPorID(idAsignatura)
      .subscribe({
        next: (result: any) => {
          this.asignatura = {
            codigo: result.codigo,
            nombre: result.nombre,
            creditos: result.creditos
          };
          this.configurarFormulario();
        },
        error: (result) => {
          Swal.fire(
            'Error',
            `${result.mensaje}`,
            'error'
          )
        }
      });
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      codigo: new FormControl(
        { value: this.asignatura!.codigo, disabled: false },
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(7),
          Validators.pattern('^[A-Z]{4}[0-9]{3}$')
        ]
      ),
      nombre: new FormControl(
        { value: this.asignatura!.nombre, disabled: false },
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[A-Z ]*$'),
        ]
      ),
      creditos: new FormControl(
        { value: this.asignatura!.creditos, disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minCredito),
          Validators.max(this.configuracion.maxCredito),
          Validators.pattern('^[0-9]*$'),
        ]
      )
    });
    Swal.close();
  }

  cancelar(): void {
    this.dialogoReferencia.close();
  }

}
