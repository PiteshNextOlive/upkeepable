// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
// allowedDomains:["localhost:44323"],
 // defaultApiRoot:"https://localhost:44305/",

  // allowedDomains:["154.27.72.187:81"],
  //  defaultApiRoot:"http://154.27.72.187:81/",

  // allowedDomains:["154.27.72.187:80"],
  // defaultApiRoot:"http://154.27.72.187:80/Stage1",

//   allowedDomains:["15.204.210.115:81"],
//  defaultApiRoot:"http://15.204.210.115:81/",

//   allowedDomains:["15.204.210.115:5050"],
//  defaultApiRoot:"http://15.204.210.115:5050/",

  allowedDomains:["stage.upkeepable.com:4455"],
 defaultApiRoot:"https://stage.upkeepable.com:4455/",

 // allowedDomains:["app.upkeepable.com:4455"],
// defaultApiRoot:"https://app.upkeepable.com:4455/",
  
  defaultProfilePhoto: 'assets/img/default-profile-icon.png',
  defaultHomePhoto: 'assets/img/home-img-default.jpg',
  firebase: {
    apiKey: "AIzaSyDLwkwEaeBXQTFeSg1yjlGX3yDgJZ0v9SE",
    authDomain: "traver-lamp.firebaseapp.com",
    projectId: "traver-lamp",
    storageBucket: "traver-lamp.appspot.com",
    messagingSenderId: "15520629438",
    appId: "1:15520629438:web:cd59191af4d6ad997394ef",
    measurementId: "G-8GZTCP8V3F",
    vapidKey:"BFLWEBUCUTPgESdIAAtj9IlI82FQuCYmJzGSe01RK3P8-ic0boVxpgBkXa7D_R9wynVxjuvOYwbaPy73hKMVFgw"
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
