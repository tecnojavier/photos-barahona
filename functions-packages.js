// Animación al hacer scroll
document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".package").forEach((el) => {
    observer.observe(el);
  });

  // Filtrado de paquetes (funcionalidad básica)
  const filterButtons = document.querySelectorAll(".filter-button");
  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Aquí puedes agregar la lógica de filtrado real
        // Por ahora solo cambiamos los estilos de los botones
        filterButtons.forEach((btn) => {
          btn.classList.remove("filter-button");
          btn.classList.add("filter-button", "secondary");
        });

        this.classList.remove("secondary");
      });
    });
  }

  // Manejo del formulario de contacto
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
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
        alert(
          "Mensaje enviado con éxito. Nos pondremos en contacto contigo pronto."
        );
        contactForm.reset();
      } else {
        alert("Por favor completa todos los campos requeridos.");
      }
    });
  }
});

// Estilos adicionales para errores de formulario
const style = document.createElement("style");
style.textContent = `
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3) !important;
    }
`;
document.head.appendChild(style);

// Versión corregida del evento click para WhatsApp
document.querySelectorAll('.whatsapp-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const packageName = this.getAttribute('data-package');
        const phoneNumber = "50378572812"; // Tu número con código de país
        const message = `Hola, estoy interesado/a en el paquete ${packageName}. ¿Podrían darme más información?`;
        const encodedMessage = encodeURIComponent(message);
        window.location.href = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    });
});

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

// Mejorar el filtrado de paquetes
document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", function () {
    const filter = this.textContent.toLowerCase();

    // Actualizar botones activos
    document.querySelectorAll(".filter-button").forEach((btn) => {
      btn.classList.remove("active");
      if (btn.textContent.toLowerCase() === filter) {
        btn.classList.add("active");
      }
    });

    // Filtrar paquetes
    document.querySelectorAll(".package").forEach((pkg) => {
      if (filter === "todos" || pkg.getAttribute("data-category") === filter) {
        pkg.style.display = "block";
      } else {
        pkg.style.display = "none";
      }
    });
  });
});

// Activar el filtro "Todos" por defecto
document.querySelector(".filter-button").click();

// Animaciones adicionales
const animateOnScroll = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".faq-item, .calendar-wrapper").forEach((el) => {
  animateOnScroll.observe(el);
});
