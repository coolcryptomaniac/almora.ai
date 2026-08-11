import'./page-i18n.js';import'./super-i18n.js';import{read,mountThemeControls}from'./theme-runtime.js';
function style(href,id){if(document.getElementById(id))return;const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=href;document.head.appendChild(link)}
read();style('./src/styles/aipan.css?v=10','almoraAipanTheme');style('./src/styles/page-theme.css?v=10','almoraSharedPageTheme');
function mount(){const host=document.querySelector('.authNav')||document.querySelector('header nav')||document.querySelector('header');mountThemeControls(host)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
