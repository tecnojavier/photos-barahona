// Animación al hacer scroll y funcionalidades principales
document.addEventListener("DOMContentLoaded", function() {
    // Observador para animaciones al hacer scroll
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    // Elementos a observar
    document.querySelectorAll(".package, .faq-item, .calendar-wrapper").forEach(el => {
        scrollObserver.observe(el);
    });

    // Filtrado de paquetes mejorado
    const filterButtons = document.querySelectorAll(".filter-button");
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener("click", function() {
                // Quitar clase active de todos los botones
                filterButtons.forEach(btn => {
                    btn.classList.remove("active");
                    btn.classList.add("secondary");
                });
                
                // Añadir clase active al botón clickeado
                this.classList.add("active");
                this.classList.remove("secondary");
                
                const filter = this.textContent.toLowerCase();
                const packages = document.querySelectorAll(".package");
                
                packages.forEach(pkg => {
                    if (filter === "todos" || pkg.dataset.category === filter) {
                        pkg.style.display = "block";
                        pkg.style.animation = "fadeInUp 0.5s ease forwards";
                    } else {
                        pkg.style.display = "none";
                    }
                });
            });
        });
        
        // Activar el filtro "Todos" por defecto
        document.querySelector(".filter-button").click();
    }

    // FAQ interactivo
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            item.classList.toggle("active");
            
            // Cerrar los demás items al abrir uno nuevo
            if (item.classList.contains("active")) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains("active")) {
                        otherItem.classList.remove("active");
                    }
                });
            }
        });
    });

    // Botones de WhatsApp mejorados
    document.querySelectorAll('.whatsapp-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const packageName = this.getAttribute('data-package') || "un paquete fotográfico";
            const phoneNumber = "50378572812";
            const message = `Hola, estoy interesado/a en el paquete ${packageName}. ¿Podrían darme más información?`;
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        });
    });

    // Precarga de imágenes para mejor rendimiento
    function preloadImages() {
        const images = [
            'portada.jpg',
            'boda.jpg',
            'cumpleanos.jpg',
            'casuales.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    preloadImages();

    // Manejo del formulario de contacto (si existe)
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Validación básica
            const nombre = document.getElementById("nombre");
            const email = document.getElementById("email");
            const mensaje = document.getElementById("mensaje");

            let isValid = true;

            [nombre, email, mensaje].forEach((field) => {
                if (!field.value.trim()) {
                    field.classList.add("error");
                    isValid = false;
                } else {
                    field.classList.remove("error");
                }
            });

            if (isValid) {
                // Aquí iría la lógica para enviar el formulario
                showToast("Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto.");
                contactForm.reset();
            } else {
                showToast("Por favor completa todos los campos requeridos.");
            }
        });
    }

    // Inicializar el datepicker y lógica de fechas reservadas
    $(function() {
        let bookedDates = JSON.parse(localStorage.getItem("bookedDates")) || [];
        
        $("#datepicker").datepicker({
            beforeShowDay: function(date) {
                const dateString = $.datepicker.formatDate("yy-mm-dd", date);
                return [true, bookedDates.includes(dateString) ? "booked-date" : ""];
            },
            onSelect: function(dateText) {
                selectedDate = dateText;
            }
        });

        $("#mark-date").click(function() {
            const selectedDate = $("#datepicker").datepicker("getDate");
            if (selectedDate) {
                const dateString = $.datepicker.formatDate("yy-mm-dd", selectedDate);
                if (!bookedDates.includes(dateString)) {
                    bookedDates.push(dateString);
                    localStorage.setItem("bookedDates", JSON.stringify(bookedDates));
                    $("#datepicker").datepicker("refresh");
                    showToast("Fecha marcada como reservada");
                }
            }
        });

        $("#clear-date").click(function() {
            const selectedDate = $("#datepicker").datepicker("getDate");
            if (selectedDate) {
                const dateString = $.datepicker.formatDate("yy-mm-dd", selectedDate);
                bookedDates = bookedDates.filter(date => date !== dateString);
                localStorage.setItem("bookedDates", JSON.stringify(bookedDates));
                $("#datepicker").datepicker("refresh");
                showToast("Fecha liberada");
            }
        });
    });

    // Mostrar notificación toast
    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "toast-notification";
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add("show");
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});

// Estilos adicionales para errores y notificaciones
const dynamicStyles = document.createElement("style");
dynamicStyles.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3) !important;
    }
    
    .toast-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #1d4ed8;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
    }
    
    .toast-notification.show {
        opacity: 1;
    }
    
    .filter-button.active {
        background-color: #1e40af !important;
        color: white !important;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(dynamicStyles);
