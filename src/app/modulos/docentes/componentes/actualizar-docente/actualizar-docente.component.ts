import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Docente } from '../../modelos/docente.interface';
import { DocenteApiService } from '../../servicios/docentes_api.service';

@Component({
  selector: 'app-actualizar-docente',
  templateUrl: './actualizar-docente.component.html',
  styleUrls: ['./actualizar-docente.component.scss']
})
export class ActualizarDocenteComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly docenteService: DocenteApiService,
    private readonly dialogoReferencia: MatDialogRef<ActualizarDocenteComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly idDocente: string,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  docente?: Docente;
  formateoNombre?: string;

  ngOnInit(): void {
    Swal.showLoading();
    this.obtenerDocentePorID(this.idDocente);
  }

  // Colocar el nombre con mayúsculas
  formatearTexto(event: Event) {
    const lectura = (event.target as HTMLInputElement).value;
    if (this.formateoNombre != lectura) {
      this.formateoNombre = lectura.toUpperCase();
      this.formGroup?.get('nombreCompleto')?.setValue(this.formateoNombre);
    }
  }

  actualizarDocentePorID() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores de docente
        const nuevoDocente: Docente = {
          nombreCompleto: this.formGroup.get('nombreCompleto')?.value,
          correoElectronico: this.formGroup.get('correoElectronico')?.value + "@epn.edu.ec"
        };

        this.docenteService.actualizarDocentePorID(this.docente!.id!, nuevoDocente)
          .subscribe({
            next: () => {
              Swal.fire(
                'Docente actualizado',
                'Se ha actualizado el docente existosamente.',
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

  obtenerDocentePorID(idDocente: string) {
    this.docenteService.visualizarDocentesPorID(idDocente)
      .subscribe({
        next: (result: any) => {
          const correoCompleto = result.correoElectronico;
          const correoFormateado = correoCompleto.split("@");
          this.docente = {
            id: result.id,
            nombreCompleto: result.nombreCompleto,
            correoElectronico: correoFormateado[0]
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
      nombreCompleto: new FormControl(
        { value: this.docente!.nombreCompleto, disabled: false },
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(70),
          Validators.pattern('^[A-ZÁÉÍÓÚÜÑ ]*$'),
        ]
      ),
      correoElectronico: new FormControl(
        { value: this.docente!.correoElectronico, disabled: false },
        [
          Validators.required,
          Validators.pattern('^[a-z]+[.][a-z]+[0-9]*$'),
        ]
      )
    });
    Swal.close();
  }


  cancelar(): void {
    this.dialogoReferencia.close();
  }

}
