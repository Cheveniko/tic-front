import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Carrera } from '../../modelos/carrera.interface';
import { CarreraApiService } from '../../servicios/carreras_api.service';


@Component({
  selector: 'app-crear-carrera',
  templateUrl: './crear-carrera.component.html',
  styleUrls: ['./crear-carrera.component.scss']
})
export class CrearCarreraComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly carreraService: CarreraApiService,
    private dialogReference: MatDialogRef<CrearCarreraComponent>,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  formateoNombre?: string;
  formateoCodigo?: string;
  formateoModalidad?: string;

  configuracion = { minDuracion: 1, maxDuracion: 10 };

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

  formatearTextoModalidad(event: Event) {
    const lectura = (event.target as HTMLInputElement).value;
    if (this.formateoModalidad != lectura) {
      this.formateoModalidad = lectura.toUpperCase();
      this.formGroup?.get('modalidad')?.setValue(this.formateoModalidad);
    }
  }

  crearUnaCarrera() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores 
        const nuevaCarrera: Carrera = {
          codigo: this.formGroup.get('codigo')?.value,
          nombre: this.formGroup.get('nombre')?.value,
          duracion: Number(this.formGroup.get('duracion')?.value),
          modalidad: this.formGroup.get('modalidad')?.value
        };
        this.carreraService.crearUnCarrera(nuevaCarrera)
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
          Validators.minLength(3),
          Validators.maxLength(7),
          Validators.pattern('^[A-Z]*$')
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
      duracion: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minDuracion),
          Validators.max(this.configuracion.maxDuracion),
          Validators.pattern('^[0-9]*$'),
        ]
      ),
      modalidad: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern('^[A-Z ]*$'),
        ]
      ),
    });
  }

  cancelar(): void {
    this.dialogReference.close();
  }

}
