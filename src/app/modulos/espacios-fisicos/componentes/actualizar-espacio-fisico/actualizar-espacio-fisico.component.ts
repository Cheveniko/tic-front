import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EspaciosFisicosApiService } from 'src/app/modulos/espacios-fisicos/servicios/espacios_fisicos_api.service';
import { EspacioFisico } from 'src/app/modulos/espacios-fisicos/modelos/espacio_fisico.interface';
import { Facultad } from 'src/app/modulos/parametros-inciales/models/facultad.interface';
import { TipoAula } from 'src/app/modulos/parametros-inciales/models/tipo-aula.interface';
import { TiposAulasApiService } from 'src/app/modulos/parametros-inciales/services/tipos-aulas-api.service';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-actualizar-espacio-fisico',
  templateUrl: './actualizar-espacio-fisico.component.html',
  styleUrls: ['./actualizar-espacio-fisico.component.scss']
})
export class ActualizarEspacioFisicoComponent implements OnInit, OnDestroy {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly espaciosFisicosService: EspaciosFisicosApiService,
    private readonly tipoAulasService: TiposAulasApiService,
    private readonly dialogoRef: MatDialogRef<ActualizarEspacioFisicoComponent>,
    @Inject(MAT_DIALOG_DATA) public id: string,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  facultades: Facultad[] = [];
  facultadSuscripcion$?: Subscription;
  tipos: TipoAula[] = [];
  espacioFisico?: EspacioFisico;
  configuracion = { minAforo: 3, maxAforo: 200 };

  ngOnInit(): void {
    Swal.showLoading();
    this.obtenerEspacioFisico(this.id);
  }

  actualizarEspacioFisico() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores
        const nuevosDatosEspacioFisico: EspacioFisico = {
          nombre: this.formGroup.get('nombre')?.value,
          tipo_id: this.formGroup.get('tipo')?.value,
          aforo: Number(this.formGroup.get('aforo')?.value)
        };

        this.espaciosFisicosService.actualizarEspacioFisicoPorId(this.espacioFisico!.id!, nuevosDatosEspacioFisico)
          .subscribe({
            next: (res: any) => {
              // Si no se actualizó el registro
              if (res.filasAlteradas == 0) {
                Swal.fire('Hubo un problema',`${res.mensaje}`,'info');
              }
              // Si se se actualizó un registro
              else {
                Swal.fire('Registro actualizado', `${res.mensaje}`, 'success')
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

  obtenerEspacioFisico(idEspacioFisico: string) {
    // Obtener espacio físico
    this.espaciosFisicosService.obtenerEspacioFisicoPorId(idEspacioFisico)
    .subscribe({
      next: (res: any) => {
        this.espacioFisico = {
          id: res.id,
          nombre: res.nombre,
          tipo: res.tipo,
          aforo: res.aforo,
        };
        this.obtenerTiposYFacultades();
      },
      error: (res) => {
        Swal.fire('Error', res.error.message,'error')
        .then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            this.cerrarDialogo();
          }
        });
      }
    });
  }

  obtenerTiposYFacultades() {
    // Cargar tipos de aula
    this.tipoAulasService.obtenerTipoAulas().subscribe({
      next: (res) => {
        const tiposExistentes = res as TipoAula[];
        
        // Obtener facultades con tipos de aula
        tiposExistentes.forEach(tipo => {
          const noRepetido = this.facultades.every(facultad => {
            return facultad.id != tipo.facultad.id;
          });
          if (noRepetido) {
            this.facultades.push(tipo.facultad);
          }
        });

        // Valor previo de Facultad
        const facultad = tiposExistentes.filter(tipo => { 
          return tipo.id == this.espacioFisico?.tipo?.id
        }).map(tipo => tipo.facultad)[0];
        
        this.espacioFisico!.tipo!.facultad = facultad;

        // Obtener tipos de aulta de la facultad seleccionada
        this.tipos = tiposExistentes.filter(tipo => tipo.facultad.id == facultad.id);

        // Construye el formulario
        this.configurarFormulario();
        this.escucharCambiosCampoFacultad();
      }
    });
  }

  escucharCambiosCampoFacultad() {
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
              }
            }); 
          }
        });
    }
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      nombre: new FormControl(
        { value: this.espacioFisico!.nombre, disabled: false },
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(15),
        ]
      ),
      facultad: new FormControl(
        { value: '', disabled: false },
        [ Validators.required, ]
      ),
      tipo: new FormControl(
        { value: '', disabled: false },
        [ Validators.required, ]
      ),
      aforo: new FormControl(
        { value: this.espacioFisico!.aforo, disabled: false },
        [
          Validators.required,
          Validators.min(this.configuracion.minAforo),
          Validators.max(this.configuracion.maxAforo),
          Validators.pattern('^[0-9]*$'),
        ]
      )
    });
    // Valor inicial de Facultad
    this.formGroup.get('facultad')!.setValue(this.espacioFisico!.tipo!.facultad.nombre);
    this.formGroup.get('facultad')!.setValue(this.espacioFisico!.tipo!.facultad.id, { emitModelToViewChange: false });
    // Valor inicial de Tipo
    this.formGroup.get('tipo')!.setValue(this.espacioFisico!.tipo!.tipo);
    this.formGroup.get('tipo')!.setValue(this.espacioFisico!.tipo!.id, { emitModelToViewChange: false });
    // Detiene el ícono de carga
    Swal.close();
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

