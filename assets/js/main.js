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

//...Loader
$(document).ready(function () {
    $("#top-loader").css("width", "0%");
    $("#top-loader").show().animate({ width: "80%" }, 1000); // load to 80%
});

// Complete loader when page fully loaded
$(window).on("load", function () {
    $("#top-loader").animate({ width: "100%" }, 400, function () {
        setTimeout(() => {
            $("#top-loader").fadeOut(200, function () {
                $(this).css("width", "0%");
            });
        }, 200);
    });
});
//End of loader