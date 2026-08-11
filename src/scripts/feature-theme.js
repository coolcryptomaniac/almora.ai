import{read,mountThemeControls}from'./theme-runtime.js';
function boot(){read();mountThemeControls(document.querySelector('.featureTop'))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
