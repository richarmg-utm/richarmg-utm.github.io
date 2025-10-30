const menuHamburguesa = document.querySelector(".menu-hamburguesa");
const menuNavegacion = document.querySelector(".menu-navegacion");

menuHamburguesa.addEventListener("click", () => {
    menuHamburguesa.classList.toggle("activo");
    menuNavegacion.classList.toggle("activo");
});

document.querySelectorAll(".enlace-navegacion").forEach(enlace => enlace.addEventListener("click", () => {
    menuHamburguesa.classList.remove("activo");
    menuNavegacion.classList.remove("activo");
}));


const nav = document.querySelector('.barra-navegacion');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('con-scroll');
    } else {
        nav.classList.remove('con-scroll');
    }
});