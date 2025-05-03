import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { FacultadesApiService } from '../../../services/facultades-api.service';
import { Facultad } from '../../../models/facultad.interface';
import { TiposAulasApiService } from '../../../services/tipos-aulas-api.service';
import { TipoAula, TipoAulaPorCrear } from '../../../models/tipo-aula.interface';

@Component({
  selector: 'app-editar-tipo-aula-dialog',
  templateUrl: './editar-tipo-aula-dialog.component.html',
  styleUrls: ['./../crear-tipo-aula-dialog/crear-tipo-aula-dialog.component.scss']
})
export class EditarTipoAulaDialogComponent implements OnInit {

  facultades: Facultad[] = [];
  facultadSeleccionada = "";
  formularioTiposAulas: FormGroup = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<EditarTipoAulaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TipoAula,
    private facultadServicio: FacultadesApiService,
    private tipoAulaServicio: TiposAulasApiService,
    private fb: FormBuilder,
  ) { }

  async ngOnInit() {
    await this.obtenerFacultades()
    this.crearFormulario();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private async obtenerFacultades() {
    this.facultades = await lastValueFrom<Facultad[]>(this.facultadServicio.obtenerFacultades());
  }

  private crearFormulario() {
    // Faculad con el id de la facultad de la fila seleccionada
    const facultad = this.facultades
      .filter(facultad => facultad.id === this.data.facultad.id)[0];

    // Se crea el form group en base a los valores de la fila seleccionada
    this.formularioTiposAulas = this.fb.group(
      {
        facultad: [facultad, [Validators.required]],
        tipoAula: [this.data.tipo, [Validators.required]],
      }
    );
  }

  editarTipoAula() {

    const facultad : Facultad = this.formularioTiposAulas.get('facultad')?.value;

    if (this.formularioTiposAulas.valid && this.data.id) {
      // Objeto a actualizar
      const tipoAula: TipoAulaPorCrear = {
        tipo: this.formularioTiposAulas.get('tipoAula')?.value,
        idFacultad: facultad.id!,
      }

      // Actualización
      this.tipoAulaServicio.actualizarTipoAula(tipoAula, this.data.id).subscribe(
        {
          next: () => { // si se crea exitosamente
            Swal.fire({
              icon: 'success',
              title: 'Actualización exitosa',
              text: `Se ha actualizado correctamente el tipo de aula ${tipoAula.tipo.toUpperCase()} de la ${facultad.nombre.toUpperCase()}.`,
            }).then(
              _ => {
                this.dialogRef.close();
              }
            )
          },
          error: err => { // en caso de que no se pueda actualizar un tipo de aula
            Swal.fire({
              icon: 'error',
              title: 'No se ha podido actualizar el tipo de aula.',
            })
          }
        }
      );
    }
  }
}
