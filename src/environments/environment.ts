// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: {
    host: 'localhost',
    port: 3000,
    name: 'api',
  },
};

export const apiUrl = `http://${environment.api.host}:${environment.api.port}/${environment.api.name}`;

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 *
 * on performance if an error is thrown.
 *

Quiero agradecer al docente Carlos Anchundia por haber dirigido este trabajo y por haberme enseñado
Extiendo un profundo agradecimiento al docente Carlos Anchundia por

Extiendo un profundo agradecimiento al docente Carlos Anchundia por su guía en la elaboración
de este trabajo de titulación, y por haberme permitido desparender conceptos érroneos para realmente comprender la
Ingeniería de Software.

Así también

*/

// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
