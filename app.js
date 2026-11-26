
// Show toast notification
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}

// Calculate ticket amount
function updateSummary() {
    const match = document.getElementById("match").value;
    const stand = document.getElementById("stand");
    const quantity = Number(document.getElementById("quantity").value);

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        showToast("Enter between 1 and 10 tickets.");
        return false;
    }

    const price = Number(stand.value);
    const category = stand.options[stand.selectedIndex].text.split(" - ")[0];
    const total = price * quantity;

    document.getElementById("summaryMatch").textContent = match;
    document.getElementById("summaryStand").textContent = category;
    document.getElementById("price").textContent = price;
    document.getElementById("summaryQuantity").textContent = quantity;
    document.getElementById("total").textContent = total;

    return true;
}

// Filter match schedule
function filterMatches() {
    const filter = document.getElementById("teamFilter").value;
    const rows = document.querySelectorAll("#matchTable tr");

    for (let i = 1; i < rows.length; i++) {
        const teams = rows[i].cells[1].textContent;
        rows[i].style.display =
            filter === "all" || teams.includes(filter) ? "" : "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("bookingForm");

    // Smooth scrolling when clicking Book buttons
    document.querySelectorAll(".book-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            document.getElementById("match").value = button.dataset.match;
            document.getElementById("booking").scrollIntoView({
                behavior: "smooth"
            });
            showToast("Select your tickets to continue!");
        });
    });

    // Filter matches
    document.getElementById("teamFilter").addEventListener("change", filterMatches);

    // Calculate button
    document.getElementById("calculateBtn").addEventListener("click", updateSummary);

    // Booking submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        if (!updateSummary()) {
            return;
        }

        const name = document.getElementById("name").value;
        const match = document.getElementById("match").value;
        const quantity = document.getElementById("quantity").value;
        const total = document.getElementById("total").textContent;

        const row = document.createElement("tr");
        const bookingId = "IPL" + Date.now().toString().slice(-6);

        [bookingId, name, match, quantity, "₹" + total].forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        document.getElementById("bookingTable").appendChild(row);
        document.getElementById("emptyMessage").style.display = "none";

        showToast("Booking submitted successfully!");
        form.reset();

        document.getElementById("summaryMatch").textContent = "RCB vs CSK";
        document.getElementById("summaryStand").textContent = "General";
        document.getElementById("price").textContent = "1000";
        document.getElementById("summaryQuantity").textContent = "1";
        document.getElementById("total").textContent = "1000";
    });
});
