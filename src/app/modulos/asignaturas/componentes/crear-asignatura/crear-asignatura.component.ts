import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Asignatura } from '../../modelos/asignatura.interface';
import { AsignaturaApiService } from '../../servicios/asignaturas_api.service';

@Component({
  selector: 'app-crear-asignatura',
  templateUrl: './crear-asignatura.component.html',
  styleUrls: ['./crear-asignatura.component.scss']
})
export class CrearAsignaturaComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly asignaturaService: AsignaturaApiService,
    private dialogReference: MatDialogRef<CrearAsignaturaComponent>,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  formateoNombre?: string;
  formateoCodigo?: string;

  configuracion = { minCredito: 1, maxCredito: 5 };

  ngOnInit(): void {
    this.configurarFormulario();
  }

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

  crearUnaAsignatura() {
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
        this.asignaturaService.crearUnaAsignatura(nuevaAsignatura)
          .subscribe({
            next: (result: any) => {
              const substring = String(result.mensaje);
              if (substring.substr(0, 1) == "S") {
                Swal.fire(
                  'Registro creado',
                  `${result.mensaje}`,
                  'success'
                ).then(() => {
                  this.dialogReference.close();
                });
              } else {
                Swal.fire(
                  'Registro duplicado',
                  `${result.mensaje}`,
                  'info'
                )
              }
            },
            error: (result: any) => {
              Swal.fire(
                'Error',
                `${result.error.message}`,
                'error'
              );
              this.cargando = false;
            }
          });
      }
    }
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      codigo: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(7),
          Validators.pattern('^[A-Z]{4}[0-9]{3}$')
        ]
      ),
      nombre: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[A-Z ]*$'),
        ]
      ),
      creditos: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minCredito),
          Validators.max(this.configuracion.maxCredito),
          Validators.pattern('^[0-9]*$'),
        ]
      )
    });
  }

  cancelar(): void {
    this.dialogReference.close();
  }

}
