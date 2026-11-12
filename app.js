
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.innerText = message;

    toast.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: green;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 9999;
    `;

    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;

            showToast("Booking successful! Thank you, " + name + "!");

            bookingForm.reset();
        });
    }

});
