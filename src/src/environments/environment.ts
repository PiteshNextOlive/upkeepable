// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
 //allowedDomains:["localhost:44323"],
 //defaultApiRoot:"https://localhost:44305/",

   allowedDomains:["154.27.72.187:81"],
   defaultApiRoot:"http://154.27.72.187:81/",

  // allowedDomains:["154.27.72.187:80"],
  // defaultApiRoot:"http://154.27.72.187:80/Stage1",
  
  defaultProfilePhoto: 'assets/img/default-profile-icon.png',
  defaultHomePhoto: 'assets/img/home-img-default.jpg',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
