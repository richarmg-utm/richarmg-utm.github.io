class GestorRecuperacion {
    constructor() {
        this.formulario = document.getElementById('formulario-recuperar');
        this.campoCedula = document.getElementById('campo-cedula');
        this.campoKeywords = document.getElementById('campo-keywords');
        this.contenedorKeywords = document.getElementById('contenedor-keywords');
        this.botonEnviar = document.getElementById('boton-enviar');
        this.mensajeError = document.getElementById('mensaje-error');
        this.textoError = document.getElementById('texto-error');
        this.selectorIdioma = document.getElementById('selector-idioma');
        this.enlaceRegresar = document.getElementById('enlace-regresar');
        this.textoCodigo = document.getElementById('texto-codigo');

        this.codigoActual = '';
        this.idiomaActual = 'es';

        this.traducciones = {
            es: {
                placeholderCedula: 'Ingrese su número de cédula',
                placeholderKeywords: 'Ingrese el código generado',
                botonEnviar: 'Enviar solicitud',
                regresar: 'Volver al inicio de sesión',
                textoCodigo: 'Haga clic en el código para generar uno nuevo',
                errorCedula: 'Por favor, ingresa un número de cédula válido (10 dígitos)',
                errorVacio: 'Rellene este campo.',
                errorKeywords: 'El código ingresado es incorrecto',
                exitoSolicitud: 'Solicitud enviada con éxito. Revisa tu correo institucional.',
                tituloPagina: 'UTM Online - Recuperar Contraseña'
            },
            en: {
                placeholderCedula: 'Enter your ID number',
                placeholderKeywords: 'Enter the generated code',
                botonEnviar: 'Send request',
                regresar: 'Back to Login',
                textoCodigo: 'Click on the code to generate a new one',
                errorCedula: 'Please enter a valid ID number (10 digits)',
                errorKeywords: 'Keywords do not match',
                exitoSolicitud: 'Request sent successfully. Check your institutional email.',
                tituloPagina: 'UTM Online - Recover Password'
            }
        };

        this.inicializar();
    }

    inicializar() {
        this.generarKeywords();
        this.inicializarEventos();
    }

    inicializarEventos() {
        this.formulario.addEventListener('submit', (e) => this.manejarEnvio(e));
        this.contenedorKeywords.addEventListener('click', () => this.generarKeywords());
        this.selectorIdioma.addEventListener('change', (e) => this.cambiarIdioma(e));

        this.campoCedula.addEventListener('invalid', (e) => this.personalizarMensaje(e));
        this.campoKeywords.addEventListener('invalid', (e) => this.personalizarMensaje(e));

        // Input validation for numbers only in ID field
        this.campoCedula.addEventListener('input', (e) => {
            e.target.setCustomValidity('');
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
            this.ocultarError();
        });

        this.campoKeywords.addEventListener('input', (e) => {
            e.target.setCustomValidity('');
            e.target.value = e.target.value.toUpperCase();
            this.ocultarError();
        });
    }

    personalizarMensaje(e) {
        const T = this.traducciones[this.idiomaActual];
        if (this.idiomaActual === 'es') {
            e.target.setCustomValidity(T.errorVacio);
        } else {
            e.target.setCustomValidity('Please fill out this field.');
        }
    }

    generarKeywords() {
        const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Evitamos caracteres confusos
        let resultado = '';
        for (let i = 0; i < 6; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        this.codigoActual = resultado;
        this.contenedorKeywords.textContent = resultado;
    }

    manejarEnvio(e) {
        e.preventDefault();
        const T = this.traducciones[this.idiomaActual];

        const cedula = this.campoCedula.value.trim();
        const keywords = this.campoKeywords.value.trim().toUpperCase();

        if (cedula.length !== 10) {
            this.mostrarError(T.errorCedula);
            this.campoCedula.focus();
            return;
        }

        if (keywords !== this.codigoActual) {
            this.mostrarError(T.errorKeywords);
            this.campoKeywords.focus();
            this.generarKeywords();
            this.campoKeywords.value = '';
            return;
        }

        // Simulación de envío
        this.botonEnviar.disabled = true;
        this.botonEnviar.querySelector('.texto-boton').textContent = this.idiomaActual === 'es' ? 'Enviando...' : 'Sending...';

        setTimeout(() => {
            alert(T.exitoSolicitud);
            window.location.href = 'index.html';
        }, 1500);
    }

    cambiarIdioma(e) {
        this.idiomaActual = e.target.value;
        const T = this.traducciones[this.idiomaActual];

        this.campoCedula.placeholder = T.placeholderCedula;
        this.campoKeywords.placeholder = T.placeholderKeywords;
        this.botonEnviar.querySelector('.texto-boton').textContent = T.botonEnviar;
        this.enlaceRegresar.textContent = T.regresar;
        this.textoCodigo.textContent = T.textoCodigo;
        document.title = T.tituloPagina;
        document.documentElement.lang = this.idiomaActual;
    }

    mostrarError(mensaje) {
        this.textoError.textContent = mensaje;
        this.mensajeError.classList.remove('oculto');
    }

    ocultarError() {
        this.mensajeError.classList.add('oculto');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GestorRecuperacion();
});
