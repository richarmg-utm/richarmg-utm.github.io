class GestorAutenticacion {
    constructor() {
        this.formulario = document.getElementById('formulario-acceso');
        this.campoUsuario = document.getElementById('campo-usuario');
        this.campoContrasena = document.getElementById('campo-contrasena');
        this.botonAcceder = document.getElementById('boton-acceder');
        this.botonMostrarContrasena = document.getElementById('boton-mostrar-contrasena');
        this.iconoOjo = document.getElementById('icono-ojo');
        this.iconoOjoCerrado = document.getElementById('icono-ojo-cerrado');
        this.mensajeError = document.getElementById('mensaje-error');
        this.textoError = document.getElementById('texto-error');
        this.iconoCargando = document.getElementById('icono-cargando');
        this.textoBoton = this.botonAcceder.querySelector('.texto-boton');
        this.enlaceRecuperar = document.getElementById('enlace-recuperar');
        this.botonCookies = document.getElementById('boton-cookies');
        this.selectorIdioma = document.getElementById('selector-idioma');

        this.idiomaActual = 'es';
        this.traducciones = {
            es: {
                placeholderUsuario: 'Ingrese su usuario',
                placeholderContrasena: 'Ingrese su contraseña',
                botonAcceder: 'Acceder',
                olvidoContrasena: '¿Olvidó su contraseña?',
                avisoCookies: 'Aviso de Cookies',
                errorCredenciales: 'Usuario o contraseña incorrectos. Por favor, verifique sus datos.',
                errorUsuarioVacio: 'Rellene este campo.',
                errorContrasenaVacia: 'Rellene este campo.',
                errorContrasenaCorta: 'La contraseña debe tener al menos 6 caracteres',
                verificando: 'Verificando...',
                accesoExitoso: '¡Acceso exitoso!',
                bienvenida: 'Bienvenido',
                mensajeExito: 'Has iniciado sesión correctamente en el sistema UTM Online.\n\nEsta es una simulación de autenticación para pruebas de usabilidad.',
                tituloRecuperar: 'Recuperación de Contraseña',
                mensajeRecuperar: 'Para recuperar tu contraseña, por favor contacta al administrador del sistema o visita la oficina de soporte técnico.\n\nEsta es una simulación y no enviará correos reales.',
                tituloCookies: 'Aviso de Cookies',
                mensajeCookies: 'Este sitio utiliza cookies para mejorar la experiencia del usuario y garantizar el correcto funcionamiento del sistema.\n\nAl utilizar este sitio, aceptas el uso de cookies de acuerdo con nuestra política de privacidad.',
                mostrarContrasena: 'Mostrar contraseña',
                ocultarContrasena: 'Ocultar contraseña',
                avisoMayusculas: 'Bloq Mayús activado'
            },
            en: {
                placeholderUsuario: 'Enter your username',
                placeholderContrasena: 'Enter your password',
                botonAcceder: 'Login',
                olvidoContrasena: 'Forgot your password?',
                avisoCookies: 'Cookie Notice',
                errorCredenciales: 'Invalid username or password. Please check your data.',
                errorUsuarioVacio: 'Please enter your username',
                errorContrasenaVacia: 'Please enter your password',
                errorContrasenaCorta: 'Password must be at least 6 characters long',
                verificando: 'Verifying...',
                accesoExitoso: 'Login successful!',
                bienvenida: 'Welcome',
                mensajeExito: 'You have successfully logged into the UTM Online system.\n\nThis is an authentication simulation for usability testing.',
                tituloRecuperar: 'Password Recovery',
                mensajeRecuperar: 'To recover your password, please contact the system administrator or visit the technical support office.\n\nThis is a simulation and will not send real emails.',
                tituloCookies: 'Cookie Notice',
                mensajeCookies: 'This site uses cookies to improve user experience and ensure the correct functioning of the system.\n\nBy using this site, you accept the use of cookies in accordance with our privacy policy.',
                mostrarContrasena: 'Show password',
                ocultarContrasena: 'Hide password',
                avisoMayusculas: 'Caps Lock is ON'
            }
        };

        this.avisoMayusculas = document.getElementById('aviso-mayusculas');
        this.textoMayusculas = document.getElementById('texto-mayusculas');

        this.inicializarEventos();
        this.generarLogoPlaceholder();
    }

    inicializarEventos() {
        this.formulario.addEventListener('submit', (evento) => this.manejarEnvioFormulario(evento));
        this.botonMostrarContrasena.addEventListener('click', () => this.alternarVisibilidadContrasena());

        // Mensajes personalizados para el navegador
        this.campoUsuario.addEventListener('invalid', (e) => this.personalizarMensaje(e));
        this.campoContrasena.addEventListener('invalid', (e) => this.personalizarMensaje(e));

        this.campoUsuario.addEventListener('input', (e) => {
            e.target.setCustomValidity('');
            this.ocultarMensajeError();
        });

        // Detectar Bloq Mayús directo en el campo de contraseña
        this.campoContrasena.addEventListener('input', (e) => {
            e.target.setCustomValidity('');
            this.ocultarMensajeError();
        });
        this.campoContrasena.addEventListener('keyup', (e) => this.verificarMayusculas(e));
        this.campoContrasena.addEventListener('keydown', (e) => this.verificarMayusculas(e));

        this.enlaceRecuperar.addEventListener('click', (evento) => this.manejarRecuperarContrasena(evento));
        this.botonCookies.addEventListener('click', () => this.mostrarAvisoCookies());
        this.selectorIdioma.addEventListener('change', (evento) => this.cambiarIdioma(evento));
    }

    verificarMayusculas(evento) {
        if (evento.getModifierState && evento.getModifierState('CapsLock')) {
            this.avisoMayusculas.classList.remove('oculto');
        } else {
            this.avisoMayusculas.classList.add('oculto');
        }
    }

    personalizarMensaje(e) {
        const T = this.traducciones[this.idiomaActual];
        if (this.idiomaActual === 'es') {
            e.target.setCustomValidity(T.errorUsuarioVacio); // Usamos el mensaje unificado
        } else {
            e.target.setCustomValidity('Please fill out this field.');
        }
    }

    async manejarEnvioFormulario(evento) {
        evento.preventDefault();

        if (this.procesandoLogin) {
            return;
        }

        const nombreUsuario = this.campoUsuario.value.trim();
        const contrasena = this.campoContrasena.value;

        if (!this.validarCampos(nombreUsuario, contrasena)) {
            return;
        }

        this.iniciarProcesamiento();

        await this.simularAutenticacion(nombreUsuario, contrasena);
    }

    validarCampos(nombreUsuario, contrasena) {
        const T = this.traducciones[this.idiomaActual];

        if (nombreUsuario === '') {
            this.mostrarMensajeError(T.errorUsuarioVacio);
            this.campoUsuario.focus();
            return false;
        }

        if (contrasena === '') {
            this.mostrarMensajeError(T.errorContrasenaVacia);
            this.campoContrasena.focus();
            return false;
        }

        if (contrasena.length < 6) {
            this.mostrarMensajeError(T.errorContrasenaCorta);
            this.campoContrasena.focus();
            return false;
        }

        return true;
    }

    async simularAutenticacion(nombreUsuario, contrasena) {
        await this.esperarTiempo(1500);

        const credencialesValidas = this.verificarCredenciales(nombreUsuario, contrasena);

        if (credencialesValidas) {
            this.autenticacionExitosa(nombreUsuario);
        } else {
            this.autenticacionFallida();
        }
    }

    verificarCredenciales(nombreUsuario, contrasena) {
        const usuariosValidos = [
            { usuario: 'admin', contrasena: 'admin123' },
            { usuario: 'estudiante', contrasena: 'estudiante123' },
            { usuario: 'profesor', contrasena: 'profesor123' }
        ];

        return usuariosValidos.some(
            credencial => credencial.usuario === nombreUsuario && credencial.contrasena === contrasena
        );
    }

    autenticacionExitosa(nombreUsuario) {
        const T = this.traducciones[this.idiomaActual];
        this.detenerProcesamiento();
        this.ocultarMensajeError();

        this.botonAcceder.style.background = 'var(--color-exito)';
        this.textoBoton.textContent = T.accesoExitoso;

        setTimeout(() => {
            alert(`${T.bienvenida}, ${nombreUsuario}!\n\n${T.mensajeExito}`);
            this.reiniciarFormulario();
        }, 800);
    }

    autenticacionFallida() {
        const T = this.traducciones[this.idiomaActual];
        this.detenerProcesamiento();
        this.mostrarMensajeError(T.errorCredenciales);
        this.campoContrasena.value = '';
        this.campoContrasena.focus();
        this.campoUsuario.classList.add('campo-error');
        this.campoContrasena.classList.add('campo-error');

        setTimeout(() => {
            this.campoUsuario.classList.remove('campo-error');
            this.campoContrasena.classList.remove('campo-error');
        }, 3000);
    }

    iniciarProcesamiento() {
        const T = this.traducciones[this.idiomaActual];
        this.procesandoLogin = true;
        this.botonAcceder.disabled = true;
        this.textoBoton.textContent = T.verificando;
        this.iconoCargando.classList.remove('oculto');
        this.ocultarMensajeError();
    }

    detenerProcesamiento() {
        const T = this.traducciones[this.idiomaActual];
        this.procesandoLogin = false;
        this.botonAcceder.disabled = false;
        this.textoBoton.textContent = T.botonAcceder;
        this.iconoCargando.classList.add('oculto');
    }

    reiniciarFormulario() {
        const T = this.traducciones[this.idiomaActual];
        this.formulario.reset();
        this.textoBoton.textContent = T.botonAcceder;
        this.botonAcceder.style.background = '';
        this.ocultarMensajeError();

        if (this.contrasenaVisible) {
            this.alternarVisibilidadContrasena();
        }
    }

    alternarVisibilidadContrasena() {
        const T = this.traducciones[this.idiomaActual];
        this.contrasenaVisible = !this.contrasenaVisible;

        if (this.contrasenaVisible) {
            this.campoContrasena.type = 'text';
            this.iconoOjo.classList.add('oculto');
            this.iconoOjoCerrado.classList.remove('oculto');
            this.botonMostrarContrasena.setAttribute('aria-label', T.ocultarContrasena);
        } else {
            this.campoContrasena.type = 'password';
            this.iconoOjo.classList.remove('oculto');
            this.iconoOjoCerrado.classList.add('oculto');
            this.botonMostrarContrasena.setAttribute('aria-label', T.mostrarContrasena);
        }
    }

    mostrarMensajeError(mensaje) {
        this.textoError.textContent = mensaje;
        this.mensajeError.classList.remove('oculto');
    }

    ocultarMensajeError() {
        this.mensajeError.classList.add('oculto');
    }

    manejarRecuperarContrasena(evento) {
        // Permitir la navegación real a recuperar.html
    }

    mostrarAvisoCookies() {
        const T = this.traducciones[this.idiomaActual];
        alert(`${T.tituloCookies}\n\n${T.mensajeCookies}`);
    }

    cambiarIdioma(evento) {
        this.idiomaActual = evento.target.value;
        const T = this.traducciones[this.idiomaActual];

        // Actualizar placeholders
        this.campoUsuario.placeholder = T.placeholderUsuario;
        this.campoContrasena.placeholder = T.placeholderContrasena;

        // Actualizar textos de botones y enlaces
        this.textoBoton.textContent = T.botonAcceder;
        this.enlaceRecuperar.textContent = T.olvidoContrasena;
        this.botonCookies.textContent = T.avisoCookies;

        // Actualizar aria-label del botón de mostrar contraseña
        const ariaLabel = this.contrasenaVisible ? T.ocultarContrasena : T.mostrarContrasena;
        this.botonMostrarContrasena.setAttribute('aria-label', ariaLabel);

        // Actualizar aviso de mayúsculas
        this.textoMayusculas.textContent = T.avisoMayusculas;

        // Cambiar atributo lang del HTML
        document.documentElement.lang = this.idiomaActual;

        // Si hay un mensaje de error visible, actualizarlo también
        if (!this.mensajeError.classList.contains('oculto')) {
            // Solo lo actualizamos si es un error de credenciales genérico
            // (Los específicos de validación se disparan al momento de validar)
            this.textoError.textContent = T.errorCredenciales;
        }
    }

    esperarTiempo(milisegundos) {
        return new Promise(resolver => setTimeout(resolver, milisegundos));
    }

    generarLogoPlaceholder() {
        const logoElemento = document.getElementById('logo-utm');

        if (!logoElemento || !logoElemento.complete || logoElemento.naturalHeight === 0) {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 160;
            const contexto = canvas.getContext('2d');

            const gradiente = contexto.createLinearGradient(0, 0, 160, 160);
            gradiente.addColorStop(0, '#1e5631');
            gradiente.addColorStop(1, '#2a7043');

            contexto.fillStyle = gradiente;
            contexto.fillRect(0, 0, 160, 160);

            contexto.fillStyle = '#ffffff';
            contexto.font = 'bold 48px Inter, sans-serif';
            contexto.textAlign = 'center';
            contexto.textBaseline = 'middle';
            contexto.fillText('UTM', 80, 80);

            logoElemento.src = canvas.toDataURL();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GestorAutenticacion();
});

const estilosCampoError = document.createElement('style');
estilosCampoError.textContent = `
    .campo-error {
        border-color: var(--color-error) !important;
        animation: sacudir 0.4s ease;
    }
    
    @keyframes sacudir {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-8px); }
        75% { transform: translateX(8px); }
    }
`;
document.head.appendChild(estilosCampoError);
