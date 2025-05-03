import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EspaciosFisicosApiService } from 'src/app/modulos/espacios-fisicos/servicios/espacios_fisicos_api.service';
import { EspacioFisico } from 'src/app/modulos/espacios-fisicos/modelos/espacio_fisico.interface';
import { Facultad } from 'src/app/modulos/parametros-inciales/models/facultad.interface';
import { TiposAulasApiService } from 'src/app/modulos/parametros-inciales/services/tipos-aulas-api.service';
import { TipoAula  } from 'src/app/modulos/parametros-inciales/models/tipo-aula.interface';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { CrearEspacioFisicoComponent } from '../crear-espacio-fisico/crear-espacio-fisico.component';
import { ActualizarEspacioFisicoComponent } from '../actualizar-espacio-fisico/actualizar-espacio-fisico.component';


interface FilaEspacioFisico {
  id?: string, nombre: string, tipo: string, aforo: number, idFacultad: string, facultad: string
}

@Component({
  selector: 'app-mostrar-espacios-fisicos',
  templateUrl: './mostrar-espacios-fisicos.component.html',
  styleUrls: ['./mostrar-espacios-fisicos.component.scss']
})
export class MostrarEspaciosFisicosComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private readonly espaciosFisicosService: EspaciosFisicosApiService,
    private readonly tiposAulasService: TiposAulasApiService,
    private readonly router: Router,
    private readonly dialogo: MatDialog,
  ) { }

  facultadesFiltro: Facultad[] = [];
  filtroSuscripcion$?: Subscription;
  filtro?: FormControl;
  filtrarTodas: string = "Todas";
  
  tiposExistentes: TipoAula[] = [];

  espaciosFisicosExistentes: EspacioFisico[] = [];
  datoFilasEspaciosFisicos = new MatTableDataSource<FilaEspacioFisico>([]);
  
  archivoSeleccionado?: File;

  displayedColumns: string[] = ['nombre', 'tipo', 'aforo', 'facultad', 'acciones'];
  @ViewChild('tablaSort') tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;
  rutaActual = this.router.url;

  ngOnInit(): void {
    this.cargarRegistros();
  }

  ngAfterViewInit(): void {
    this.datoFilasEspaciosFisicos.sort = this.tablaSort;
    this.datoFilasEspaciosFisicos.paginator = this.paginador!;
  }

  cargarRegistros() {
    Swal.showLoading();
    this.espaciosFisicosService.obtenerEspaciosFisicos()
      .subscribe({
        next: (data) => {
          const espaciosFisicos = data as EspacioFisico[];
          this.espaciosFisicosExistentes = espaciosFisicos;
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron obtener los registros.',
            showCancelButton: true,
            confirmButtonText: 'Reiniciar página',
            cancelButtonText: 'Cerrar',
            icon: 'error',
          }
          ).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        complete: () => {
          //Swal.close();
          this.obtenerFacultadesYTiposAulas();
        }
      });
  }

  obtenerFacultadesYTiposAulas() {
    this.tiposAulasService.obtenerTipoAulas().subscribe({
      next: (data) => {
        // Tipos existentes en la base de datos
        this.tiposExistentes = data as TipoAula[];

        // Tipos obtenidos solo entre los espacios fisicos que se muestran en pantalla
        const tiposObtenidos = this.espaciosFisicosExistentes.map(ef => ef.tipo?.id);

        // Se obtienen las facultades que deban aparecer en el Filtro
        for (let tipo of this.tiposExistentes) {
          const noEstaRepetido = this.facultadesFiltro.every(facultad => {
            return facultad.id != tipo.facultad.id;
          });
          if (noEstaRepetido && tiposObtenidos.includes(tipo.id)) {
            this.facultadesFiltro.push(tipo.facultad);
          }
        }

        // 
        for (let espacio of this.espaciosFisicosExistentes) {
          const facultadPorId = this.tiposExistentes.find(tipo => {
            return tipo.id == espacio.tipo?.id;
          });
          espacio.tipo!.facultad = facultadPorId!.facultad;
        }

        this.datoFilasEspaciosFisicos.data = this.mapearEspaciosFisicasAFilas(this.espaciosFisicosExistentes);
        
        // Se establece el control del Filtro y su valor inicial para mostrar todo
        this.filtro = new FormControl(
          { value: this.filtrarTodas , disabled: false }
        );
      },
      complete: () => {
        Swal.close();
        this.filtrarEspaciosFisicos();
      }
    });
  }

  eliminarEspacioFisico(espacioFisico: FilaEspacioFisico) {
    Swal.fire({
      title: 'Eliminar espacio físico',
      text: `¿Está seguro de eliminar el ${espacioFisico.tipo} "${espacioFisico.nombre}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.showLoading();
        // Eliminar espacio fisico
        this.espaciosFisicosService.eliminarEspacioFisico(espacioFisico.id!)
          .subscribe({
            // Si se eliminó correctamente
            next: () => {
              Swal.fire(
                'Eliminado',
                `Se ha eliminado el ${espacioFisico.tipo} "${espacioFisico.nombre}"?`,
                'success'
              );
              // Quitar del arreglo
              const indice = this.datoFilasEspaciosFisicos.data.indexOf(
                this.datoFilasEspaciosFisicos.data.find(fila => fila.id == espacioFisico.id)!
              );
              const espaciosFisicos = this.datoFilasEspaciosFisicos.data;
              espaciosFisicos.splice(indice, 1)
              this.datoFilasEspaciosFisicos.data = espaciosFisicos;
            },
            // Error al eliminar
            error: (err) => {
              Swal.fire(
                'Error',
                `No se pudo eliminar el ${espacioFisico.tipo} "${espacioFisico.nombre}"?`,
                'error'
              );
              console.error(err);
            }
          });
      }

    })
  }

  crearMultiplesEspaciosFisicos() {
    Swal.showLoading();
    if (this.archivoSeleccionado) {
      this.espaciosFisicosService.crearMultiplesEspaciosFisicos(this.archivoSeleccionado)
        .subscribe({
          next: (res: any) => {
            const mensaje = `Se ha(n) creado ${res.registrosCreados.length} registro(s). Hay ${res.registrosRepetidos.length} repetido(s).`;
            let numColumnas = (res.registrosRepetidos.length > 8)? 4 : 2;
            numColumnas = (res.registrosRepetidos.length <= 4)? 1 : numColumnas;
            const repetidos = `<div style="column-count: ${numColumnas};">` + 
                                '<p>' +
                                  res.registrosRepetidos.map((r: EspacioFisico) => {
                                    return r.nombre
                                  }).join('</p><p>') +
                                '</p>' + 
                              '</div>'
            Swal.fire({
              title: 'Archivo cargado exitosamente!',
              icon: 'success',
              html: '<h2>' + mensaje + '</h2>' + repetidos,
              width: '50vw'
            }).then((result) => {
              if (result.isDismissed || result.isConfirmed) {
                // Actualizar 
                this.datoFilasEspaciosFisicos.data = [];
                this.cargarRegistros();
              }
            });
          },
          error: (res: any) => {
            Swal.fire(
              'Error',
              res.error.message,
              'error'
            ).then((result) => {
              if (result.isDismissed || result.isConfirmed) {
                this.archivoSeleccionado = undefined;
              }
            });
          },
          complete: () => {
            this.archivoSeleccionado = undefined;
          }
        });
    }
  }

  seleccionarArchivo(event: any): void {
    this.archivoSeleccionado = event.target.files[0] ?? undefined;

    if (this.archivoSeleccionado) {

      const fileReader = new FileReader();
      fileReader.readAsText(this.archivoSeleccionado);
      fileReader.onload = (e) => {
        console.log("LECTURA");
        console.log(fileReader.result);
      }

      this.crearMultiplesEspaciosFisicos();
      
    }

  }

  mapearEspaciosFisicasAFilas(arregloEspaciosFisicos: EspacioFisico[]) {
    return arregloEspaciosFisicos.map(ef => {
      const fila: FilaEspacioFisico = {
        id: ef.id,
        nombre: ef.nombre,
        tipo: ef.tipo!.tipo,
        aforo: ef.aforo,
        idFacultad: ef.tipo!.facultad.id!,
        facultad: ef.tipo!.facultad.nombre
      }
      return fila;
    });
  }

  filtrarEspaciosFisicos() {
    this.filtroSuscripcion$ = this.filtro!.valueChanges.subscribe({
      next: (filtroFacultad) => {
        if (filtroFacultad == this.filtrarTodas) {
          this.datoFilasEspaciosFisicos.data = this.mapearEspaciosFisicasAFilas(this.espaciosFisicosExistentes);
        } else {
          
          const datosTotales: FilaEspacioFisico[] = [];
          this.mapearEspaciosFisicasAFilas(this.espaciosFisicosExistentes).forEach(fila => {
            datosTotales.push(Object.assign({}, fila));
          });

          // Filtra por ID de la Facultad
          this.datoFilasEspaciosFisicos.data = datosTotales.filter(dato => {
            return dato.idFacultad == filtroFacultad;
          });

        }
      }
    });
  }

  abrirDialogoCrear() {
    const dialogoRef = this.dialogo.open(CrearEspacioFisicoComponent, {
      width: 'auto', height: 'auto',
      disableClose: true,
    });

    dialogoRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  abrirDialogoActualizar(id: string) {
    const dialogoRef = this.dialogo.open(ActualizarEspacioFisicoComponent, {
      width: 'auto', height: 'auto',
      disableClose: true,
      data: id,
    });

    dialogoRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  ngOnDestroy(): void {
    if (this.filtroSuscripcion$) {
      this.filtroSuscripcion$?.unsubscribe();
    }
  }
}
