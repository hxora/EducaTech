document.addEventListener('DOMContentLoaded', () => {
    const heroContactBtn = document.getElementById('heroContactBtn');
    const navContactBtn = document.getElementById('navContactBtn');
    const navMenu = document.getElementById('navbarNav');
    const contactSection = document.getElementById('contacto');
    const contactModalEl = document.getElementById('contactModal');
    const form = document.getElementById('registroForm');
    const formAlert = document.getElementById('formAlert');
    const submitBtn = form?.querySelector('button[type="submit"]');
    let alertTimer;

    function openContactModal() {
        if (contactModalEl && window.bootstrap) {
            bootstrap.Modal.getOrCreateInstance(contactModalEl).show();
        }
    }

    heroContactBtn?.addEventListener('click', openContactModal);

    navContactBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        contactSection?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(openContactModal, 400);
    });

    navMenu?.addEventListener('click', (e) => {
        if (window.bootstrap && e.target.closest('a') && navMenu.classList.contains('show')) {
            bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
    });

    function showAlert(message, type) {
        if (!formAlert) return;
        clearTimeout(alertTimer);
        formAlert.className = `alert alert-${type}`;
        formAlert.textContent = message;
        alertTimer = setTimeout(() => formAlert.classList.add('d-none'), 5000);
    }

    function nombrePrograma(valor) {
        switch (valor) {
            case 'software':
                return 'Desarrollo de Software con IA';
            case 'admin':
                return 'Administración de Empresas';
            case 'redes':
                return 'Redes y Comunicaciones';
            default:
                return 'Programa no especificado';
        }
    }

    function simularPost(datos) {
        return new Promise((resolve) => {
            setTimeout(() => resolve({ status: 201, mensaje: 'Registro creado', datos }), 1000);
        });
    }

    function marcarCampo(campo) {
        const esValido = campo.checkValidity();
        campo.classList.toggle('is-valid', esValido);
        campo.classList.toggle('is-invalid', !esValido);
    }

    function limpiarValidacion() {
        form.classList.remove('was-validated');
        form.querySelectorAll('.is-valid, .is-invalid').forEach((campo) => {
            campo.classList.remove('is-valid', 'is-invalid');
        });
    }

    form?.querySelectorAll('input, select').forEach((campo) => {
        campo.addEventListener('blur', () => marcarCampo(campo));
        campo.addEventListener('change', () => marcarCampo(campo));
        campo.addEventListener('input', () => {
            if (campo.classList.contains('is-invalid')) marcarCampo(campo);
        });
    });

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            showAlert('Por favor completa correctamente todos los campos obligatorios.', 'danger');
            return;
        }

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const programa = document.getElementById('programa').value;

        const formData = {
            nombre,
            email,
            telefono,
            programa,
            terminosAceptados: document.getElementById('terminos')?.checked ?? false,
            fechaRegistro: new Date().toISOString()
        };

        const textoOriginal = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const respuesta = await simularPost(formData);
            console.log(`POST /registro → ${respuesta.status}`, respuesta.datos);

            showAlert(
                `¡Registro exitoso, ${nombre}! Te escribiremos a ${email} con información sobre ${nombrePrograma(programa)}.`,
                'success'
            );

            form.reset();
            limpiarValidacion();
        } catch (error) {
            showAlert('No se pudo enviar el registro. Inténtalo nuevamente.', 'danger');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = textoOriginal;
        }
    });
});
