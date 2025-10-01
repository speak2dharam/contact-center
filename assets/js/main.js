function createRipple(event, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    ripple.className = "ripple-effect";
    element.appendChild(ripple);

    ripple.addEventListener("animationend", () => {
        ripple.remove();
    });
}

document.querySelectorAll(".ripple-btn").forEach(button => {
    button.addEventListener("click", function (e) {
        createRipple(e, this);
    });

    button.addEventListener("mouseenter", function (e) {
        createRipple(e, this);
    });
});

$(document).ready(function () {
    // Toggle sidebar collapse
    $("#toggleSidebar").on("click", function () {
        $("#sidebar").toggleClass("collapsed");
        //$("#sidebar").toggle();
    });
    // Rotate chevron icon on submenu toggle
    $('#sidebar .nav-link[data-bs-toggle="collapse"]').on('click', function () {
        $(this).find("i.fa-chevron-down, i.fa-chevron-up").toggleClass("fa-chevron-down fa-chevron-up");
    });
});