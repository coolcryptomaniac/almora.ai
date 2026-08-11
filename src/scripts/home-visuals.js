import{initCultureTheme}from'./culture-theme.js';import{mountHeroSlideshow}from'./hero-slideshow.js';
function boot(){initCultureTheme();mountHeroSlideshow()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
