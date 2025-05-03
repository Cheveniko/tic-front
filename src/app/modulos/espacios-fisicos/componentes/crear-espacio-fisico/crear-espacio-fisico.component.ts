import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EspaciosFisicosApiService } from 'src/app/modulos/espacios-fisicos/servicios/espacios_fisicos_api.service';
import { EspacioFisico } from 'src/app/modulos/espacios-fisicos/modelos/espacio_fisico.interface';
import { FacultadesApiService } from 'src/app/modulos/parametros-inciales/services/facultades-api.service';
import { Facultad } from 'src/app/modulos/parametros-inciales/models/facultad.interface';
import { TipoAula } from 'src/app/modulos/parametros-inciales/models/tipo-aula.interface';
import { TiposAulasApiService } from 'src/app/modulos/parametros-inciales/services/tipos-aulas-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-espacio-fisico',
  templateUrl: './crear-espacio-fisico.component.html',
  styleUrls: ['./crear-espacio-fisico.component.scss']
})
export class CrearEspacioFisicoComponent implements OnInit, OnDestroy {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly espaciosFisicosService: EspaciosFisicosApiService,
    private readonly facultadesService: FacultadesApiService,
    private readonly tipoAulasService: TiposAulasApiService,
    private readonly dialogoRef: MatDialogRef<CrearEspacioFisicoComponent>,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  facultades: Facultad[] = [];
  facultadSuscripcion$?: Subscription;
  tipos: TipoAula[] = [];

  configuracion = { minAforo: 3, maxAforo: 200 };

  ngOnInit(): void {
    this.configurarFormulario();
    this.obtenerFacultades();
  }

  crearEspacioFisico() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores
        const nuevoEspacioFisico: EspacioFisico = {
          nombre: this.formGroup.get('nombre')?.value,
          tipo_id: this.formGroup.get('tipo')?.value,
          aforo: Number(this.formGroup.get('aforo')?.value)
        };

        this.espaciosFisicosService.crearEspacioFisico(nuevoEspacioFisico)
          .subscribe({
            next: (res: any) => {
              if (res.filasAlteradas == 0) {
                Swal.fire('Hubo un problema', `${res.mensaje}`,'info');
                this.cargando = false;
              } else {
                Swal.fire('Registro creado', `${res.mensaje}`,'success')
                .then((result) => {
                  if (result.isConfirmed || result.isDismissed) {
                    this.cerrarDialogo();
                  }
                });
              }
            },
            error: (res: any) => {
              Swal.fire('Error', `${res.error.message}`, 'error');
              this.cargando = false;
            }
          });

      }
    }
  }

  // Cargar facultades existentes
  obtenerFacultades() {
    this.facultadesService.obtenerFacultades()
      .subscribe({
        next: (res) => {
          this.facultades = res as Facultad[];
          // Obtener tipos de espacios fisicos
          this.obtenerTiposEspaciosFisicos();
          // Establecer una facultad por defecto
          this.formGroup!.get('facultad')!.setValue(this.facultades[0].nombre);
          this.formGroup!.get('facultad')!.setValue(this.facultades[0].id!, { emitModelToViewChange: false });
        }
      });
  }

  obtenerTiposEspaciosFisicos() {
    if (this.formGroup) {
      // Comprobar cambios en la Facultad seleccionada por el usuario
      this.facultadSuscripcion$ = this.formGroup.get('facultad')?.valueChanges
        .subscribe({
          next: (idFacultad) => {
            this.tipos = [];
            // Habilita el campo Tipo
            this.formGroup?.get('tipo')?.enable();
            // Elimina el tipo anteriormente seleccionado
            this.formGroup?.get('tipo')?.setValue('');
            // Cargar tipos de aula
            this.tipoAulasService.obtenerTipoAulas().subscribe({
              next: (res) => {
                const tiposExistentes = res as TipoAula[];
                // Filtrar por facultad
                this.tipos = tiposExistentes.filter(t => t.facultad.id == idFacultad);
                // Establecer un tipo por defecto
                this.formGroup!.get('tipo')!.setValue(this.tipos[0].tipo);
                this.formGroup!.get('tipo')!.setValue(this.tipos[0].id!, { emitModelToViewChange: false });
              }
            }); 
          }
        });
    }
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      nombre: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(30),
        ]
      ),
      facultad: new FormControl(
        { value: '', disabled: false },
        [ Validators.required, ]
      ),
      tipo: new FormControl(
        { value: '', disabled: false }, // Comienza deshabilitado
        [
          Validators.required,
        ]
      ),
      aforo: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minAforo),
          Validators.max(this.configuracion.maxAforo),
          Validators.pattern('^[0-9]*$'),
        ]
      )
    });
  }

  cerrarDialogo() {
    this.dialogoRef.close();
  }

  ngOnDestroy(): void {
    if (this.facultadSuscripcion$) {
      this.facultadSuscripcion$.unsubscribe();
    }
  }

}
