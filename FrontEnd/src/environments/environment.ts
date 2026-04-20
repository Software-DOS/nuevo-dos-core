// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



// environment.ts (desarrollo)
// export const environment = {
//   production: false,
//   urlbackend: 'http://localhost:51888/',
//   urlImagenes: 'http://localhost:58000/WebAppConexion'  // Nueva propiedad
// };

// environment.prod.ts (producción)
// export const environment = {
//   production: true,
//   urlbackend: 'https://portaldeservicios.dos.com.ec/talentoHumano/assets/img/',  // Tu API
//   urlImagenes: 'https://portaldeservicios.dos.com.ec/WebAppConexion/imagen/usuarios/'  // Imágenes
// };




// DESARROLLO
// export const environment = {
//   production: false,
//   //urlApis: '/',
//   urlApis: 'http://localhost:51888/',
//   urlbackend: 'http://localhost:51888/',
//   urlImagenes: 'http://localhost:58000/'  // Nueva propiedad
//   //urlImagenes: 'http://localhost:51888/WebAppConexion/imagen/usuarios/'
//   // urlImagenes: 'https://portaldeservicios.dos.com.ec/WebAppConexion/imagen/usuarios/'  // Imágenes
// };

// PRODUCCION
// environment.prod.ts (producción)
export const environment = {
  production: true,
  urlApis: '/',
  //urlApis: 'https://portaldeservicios.dos.com.ec/TalentoHumanoApis/',
  urlbackend: 'https://portaldeservicios.dos.com.ec/TalentoHumanoApis/',  // Tu API
  urlImagenes: 'https://portaldeservicios.dos.com.ec/WebAppConexion/imagen/usuarios/'  // Imágenes
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
