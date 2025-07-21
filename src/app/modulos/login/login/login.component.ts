import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FloatLabelType } from "@angular/material/form-field";
import { Router } from "@angular/router";
import { AuthService } from "src/app/servicios/auth/auth.service";
import { TokenStorageService } from "src/app/servicios/auth/token-storage.service";
import { UsuarioStorageService } from "src/app/servicios/auth/usuario-storage.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly tokenService: TokenStorageService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
  ) {}

  formGroup?: FormGroup;
  floatLabelControl = new FormControl("auto" as FloatLabelType);
  errorSesion: boolean = false;
  sesionIniciada: boolean = false;
  cargando: boolean = false;

  ngOnInit(): void {
    this.sesionIniciada = !!this.tokenService.obtenerToken();
    // Si ya ha iniciado sesión
    if (this.sesionIniciada) {
      this.router.navigate(["/spa"]);
      return;
    }
    this.configurarFormulario();
  }

  login() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        this.errorSesion = false;
        // Iniciar sesión con credenciales
        const correo = this.formGroup.get("correo")?.value;
        const clave = this.formGroup.get("constrasena")?.value;
        this.authService.login(correo, clave).subscribe({
          next: (data) => {
            // Guardar Token
            this.tokenService.guardarToken(data.access_token);
            // Guardar información del usuario
            this.usuarioService.guardarUsuario(data.usuario);
            console.log(data);
            this.errorSesion = false;

            const toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: false,
              didDestroy: () => {
                this.ingresarAlAplicativo();
              },
            });

            toast.fire({
              icon: "success",
              title: "¡Ha iniciado sesión!",
            });
          },
          error: (err) => {
            this.errorSesion = true;
            this.cargando = false;

            const toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: false,
            });

            toast.fire({
              icon: "error",
              title: "Error en el inicio de sesión",
            });
          },
        });
      }
    }
  }

  ingresarAlAplicativo() {
    this.router.navigate(["/spa"]);
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      correo: new FormControl(
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required,
          Validators.email,
          Validators.pattern("([a-z]{2,})\.([a-z0-9]{2,})@epn\.edu\.ec"),
        ],
      ),
      constrasena: new FormControl(
        {
          value: "",
          disabled: false,
        },
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$",
          ),
        ],
      ),
    });
  }
}
