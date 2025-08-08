// Toggle del menú lateral
const toggleBtn = document.getElementById('toggleMenu');
const menu = document.getElementById('menu');

// Función para alternar el menú
function toggleMenu() {
    menu.classList.toggle('show');
}

// Evento para el botón toggle
toggleBtn.addEventListener('click', toggleMenu);

// Evento para los items del menú
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        // Oculta el menú después de un pequeño retraso para permitir la navegación
        setTimeout(() => {
            menu.classList.remove('show');
        }, 100); // 100ms de retraso
    });
});

// Inicialización de Swiper
const swiper = new Swiper(".mySwiper", {
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
    effect: "fade",
    fadeEffect: {
        crossFade: true,
    },
    speed: 1000,
});

// Animación al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll(".animate-on-scroll").forEach(el => {
    observer.observe(el);
});

// Función para enviar por WhatsApp
function enviarWhatsApp() {
    // Validación de campos
    const nombre = document.getElementById("nombre");
    const fecha = document.getElementById("fecha");
    const tipo = document.getElementById("tipo");

    let valid = true;

    [nombre, fecha, tipo].forEach(field => {
        if (!field.value.trim()) {
            field.classList.add("error");
            valid = false;
        } else {
            field.classList.remove("error");
        }
    });

    if (!valid) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
    }

    // Datos para el mensaje
    const mensaje = document.getElementById("mensaje").value;
    const texto = `Hola, quiero reservar una sesión fotográfica.\nNombre: ${nombre.value}\nFecha: ${fecha.value}\nTipo de evento: ${tipo.value}\nMensaje: ${mensaje}`;
    const url = `https://wa.me/50378572812?text=${encodeURIComponent(texto)}`;

    window.open(url, "_blank");

    // Animación de confirmación
    mostrarConfirmacion();
}

function mostrarConfirmacion() {
    const confirmBox = document.createElement("div");
    confirmBox.innerHTML = `
        <div class="animate-fade-in confirmation-box">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>¡Reserva enviada con éxito!</span>
        </div>
    `;
    document.body.appendChild(confirmBox);

    setTimeout(() => {
        confirmBox.remove();
    }, 4000);
}

// Estilos adicionales para la confirmación
const style = document.createElement('style');
style.textContent = `
    .confirmation-box {
        position: fixed;
        top: 24px;
        right: 24px;
        background-color: #16a34a;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .icon {
        width: 24px;
        height: 24px;
        color: white;
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3) !important;
    }
`;
document.head.appendChild(style);

// Inicializar el datepicker y lógica de fechas reservadas
$(function () {
  // Array para almacenar fechas reservadas (en producción usarías una base de datos)
  let bookedDates = JSON.parse(localStorage.getItem("bookedDates")) || [];

  $("#datepicker").datepicker({
    beforeShowDay: function (date) {
      const dateString = $.datepicker.formatDate("yy-mm-dd", date);
      return [true, bookedDates.includes(dateString) ? "booked-date" : ""];
    },
    onSelect: function (dateText) {
      selectedDate = dateText;
    },
  });

  // Marcar fecha como reservada
  $("#mark-date").click(function () {
    const selectedDate = $("#datepicker").datepicker("getDate");
    if (selectedDate) {
      const dateString = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      if (!bookedDates.includes(dateString)) {
        bookedDates.push(dateString);
        localStorage.setItem("bookedDates", JSON.stringify(bookedDates));
        $("#datepicker").datepicker("refresh");
      }
    }
  });

  // Limpiar fecha seleccionada
  $("#clear-date").click(function () {
    const selectedDate = $("#datepicker").datepicker("getDate");
    if (selectedDate) {
      const dateString = $.datepicker.formatDate("yy-mm-dd", selectedDate);
      bookedDates = bookedDates.filter((date) => date !== dateString);
      localStorage.setItem("bookedDates", JSON.stringify(bookedDates));
      $("#datepicker").datepicker("refresh");
    }
  });
});