import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Carrera } from '../../modelos/carrera.interface';
import { CarreraApiService } from '../../servicios/carreras_api.service';


@Component({
  selector: 'app-actualizar-carrera',
  templateUrl: './actualizar-carrera.component.html',
  styleUrls: ['./actualizar-carrera.component.scss']
})
export class ActualizarCarreraComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly carreraService: CarreraApiService,
    private readonly dialogoReferencia: MatDialogRef<ActualizarCarreraComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly idCarrera: string,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  carrera?: Carrera;
  formateoNombre?: string;
  formateoCodigo?: string;
  formateoModalidad?: string;

  configuracion = { minDuracion: 1, maxDuracion: 10 };

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

  ngOnInit(): void {
    Swal.showLoading();
    this.obtenerCarreraPorID(this.idCarrera);
  }

  actualizarCarreraPorID() {
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

        this.carreraService.actualizarCarreraPorID(this.idCarrera, nuevaCarrera)
          .subscribe({
            next: () => {
              Swal.fire(
                'Asignatura actualizada',
                'Se ha actualizado la carrera existosamente.',
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

  obtenerCarreraPorID(idCarrera: string) {
    this.carreraService.obtenerCarreraPorID(idCarrera)
      .subscribe({
        next: (result: any) => {
          this.carrera = {
            codigo: result.codigo,
            nombre: result.nombre,
            duracion: result.duracion,
            modalidad: result.modalidad
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
        { value: this.carrera!.codigo, disabled: false },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(7),
          Validators.pattern('^[A-Z]*$')
        ]
      ),
      nombre: new FormControl(
        { value: this.carrera!.nombre, disabled: false },
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(80),
          Validators.pattern('^[A-Z ]*$'),
        ]
      ),
      duracion: new FormControl(
        { value: this.carrera!.duracion, disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minDuracion),
          Validators.max(this.configuracion.maxDuracion),
          Validators.pattern('^[0-9]*$'),
        ]
      ),
      modalidad: new FormControl(
        { value: this.carrera!.modalidad, disabled: false },
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          Validators.pattern('^[A-Z ]*$'),
        ]
      ),
    });
    Swal.close();
  }

  cancelar(): void {
    this.dialogoReferencia.close();
  }

}
