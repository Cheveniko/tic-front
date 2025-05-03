import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CrearTipoAulaDialogComponent } from './crear-tipo-aula-dialog/crear-tipo-aula-dialog.component';
import { EditarTipoAulaDialogComponent } from './editar-tipo-aula-dialog/editar-tipo-aula-dialog.component';
import { TipoAula } from '../../models/tipo-aula.interface';
import { TiposAulasApiService } from '../../services/tipos-aulas-api.service';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';

@Component({
  selector: 'app-tipo-aulas',
  templateUrl: './tipo-aulas.component.html',
  styleUrls: ['./tipo-aulas.component.scss', '../../styles/common.scss']
})
export class TipoAulasComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private readonly usuarioService: UsuarioStorageService,
    private readonly servicioTiposAulas: TiposAulasApiService,
  ) { }

  usuario?: Usuario;

  // Table
  dataSource: TipoAula[] = []
  displayedColumns: string[] = ['Tipo de aula', 'Facultad', 'Acciones'];
  mostrarSeccion = true;

  ngOnInit(): void {
    this.obtenerTipoAulas();
    this.usuario = this.usuarioService.obtenerUsuario();
  }

  abrirCrearTipoAulaDialog() {
    const dialogRef = this.dialog.open(CrearTipoAulaDialogComponent, {
      width: '30rem',
      data: {}
    })

    dialogRef.afterClosed().subscribe(result => {
      this.obtenerTipoAulas();
    })
  }

  abrirEditarTipoAulaDialog(tipoAula: TipoAula) {
    const dialogRef = this.dialog.open(EditarTipoAulaDialogComponent, {
      width: '30rem',
      data: tipoAula
    })
    dialogRef.afterClosed().subscribe(result => {
      this.obtenerTipoAulas();
    })
  }

  eliminarTipoAula(tipoAula: TipoAula) {
    Swal.fire({
      title: `¿Está seguro de eliminar el tipo de aula ${tipoAula.tipo} de la ${tipoAula.facultad.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      // Si se elimina un tipo de aula
      if (result.isConfirmed) {
        this.servicioTiposAulas.eliminarTipoAula(tipoAula.id!).subscribe(
          {
            next: () => {
              Swal.fire(
                'Eliminado',
                `Se ha eliminado correctamente el tipo de aula ${tipoAula.tipo} de la ${tipoAula.facultad.nombre}?`,
                'success'
              )
              // Se actualiza los datos de la tabla
              this.obtenerTipoAulas();
            },
            // Caso contrario se muestra un error
            error: err => {
              Swal.fire({
                icon: 'error',
                title: 'No se ha podido eliminar el tipo de aula.',
              })
            }
          }
        );
      }
    })
  }

  private obtenerTipoAulas() {
    this.servicioTiposAulas.obtenerTipoAulas().subscribe(
      resp => {
        this.dataSource = resp;
      }
    )
  }

  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.ASISTENTE_ACADEMICO);
  }
}