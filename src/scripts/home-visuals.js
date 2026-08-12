import{initCultureTheme}from'./culture-theme.js';import{mountHeroSlideshow}from'./hero-slideshow.js';import{initAccessibleShell}from'./a11y-shell.js';
function boot(){initCultureTheme();mountHeroSlideshow();initAccessibleShell()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
