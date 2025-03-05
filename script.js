document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");

    // Ensure tables are hidden on page load
    const wifiTable = document.querySelector(".wifi-usage-table");
    const electricityContainer = document.getElementById("electricity-meter-container");

    if (wifiTable) wifiTable.style.display = "none";
    if (electricityContainer) electricityContainer.style.display = "none";

    // Function to toggle WiFi usage table
    function toggleExpandWifi() {
        if (wifiTable) {
            wifiTable.style.display = (wifiTable.style.display === "none") ? "table" : "none";
        }
    }

    // Function to toggle Electricity Meter table
    function toggleExpandElectricity() {
        if (electricityContainer) {
            electricityContainer.style.display = (electricityContainer.style.display === "none") ? "block" : "none";
        }
    }

    // Attach event listeners for toggling
    const wifiToggleHeader = document.querySelector(".toggle-header.pointer");
    const electricityToggleHeader = document.getElementById("electricity-toggle-header");

    if (wifiToggleHeader) {
        wifiToggleHeader.addEventListener("click", toggleExpandWifi);
    } else {
        console.warn("⚠️ No element found with class `.toggle-header.pointer`");
    }

    if (electricityToggleHeader) {
        electricityToggleHeader.addEventListener("click", toggleExpandElectricity);
    } else {
        console.warn("⚠️ No element found with ID `electricity-toggle-header`");
    }

    // ✅ Toggle Reference Section
    const referenceContainer = document.getElementById("reference-container");
    const referenceToggleHeader = document.getElementById("reference-toggle-header");

    if (referenceToggleHeader && referenceContainer) {
        referenceToggleHeader.addEventListener("click", function () {
            referenceContainer.style.display =
                (referenceContainer.style.display === "none") ? "block" : "none";
        });
    } else {
        console.warn("⚠️ Reference toggle elements not found.");
    }

    // ✅ Render Doughnut Charts Correctly
    document.querySelectorAll("canvas").forEach((canvas) => {
        let used = parseFloat(canvas.getAttribute("data-used")) || 0;
        let total = parseFloat(canvas.getAttribute("data-total")) || 100;
        let remaining = Math.max(0, total - used);
        let percentage = Math.round((remaining / total) * 100);

        let ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("❌ Canvas context not found!");
            return;
        }

        // Destroy existing chart if it exists
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }

        // ✅ Ensure proper dimensions
        canvas.style.width = "150px";
        canvas.style.height = "150px";

        // ✅ Create a new Chart.js doughnut chart
        canvas.chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [remaining, used], // Reversed order for correct rotation
                    backgroundColor: [
                        "#23A455", // ✅ Remaining (Green)
                        "rgba(50, 100, 180, 0.5)" // ✅ Used (Blue)
                    ],
                    borderWidth: 0,
                    cutout: "75%" // ✅ Thickness of the doughnut
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                rotation: 0, // ✅ Starts from the right (0°)
                circumference: 360, // ✅ Moves counterclockwise
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                let value = tooltipItem.raw;
                                return tooltipItem.dataIndex === 0
                                    ? `Remaining: ${value.toFixed(1)}GB`
                                    : `Used: ${value.toFixed(1)}GB`;
                            }
                        }
                    }
                },
                animation: {
                    onComplete: function () {
                        drawText(canvas.chartInstance, percentage);
                    }
                }
            },
            plugins: [{
                afterDraw: function (chart) {
                    drawText(chart, percentage);
                }
            }]
        });

        function drawText(chart, percentage) {
            let width = chart.width,
                height = chart.height,
                ctx = chart.ctx;

            ctx.restore();
            ctx.font = "bold 30px 'Open Sans', sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // ✅ Show percentage in the center
            ctx.fillText(`${percentage}%`, width / 2, height / 2 - 10);

            // ✅ Show "REMAINING" below
            ctx.font = "14px 'Open Sans', sans-serif";
            ctx.fillText("REMAINING", width / 2, height / 2 + 18);

            ctx.save();
        }
    });

    console.log("✅ JavaScript Loaded Successfully!");
});
