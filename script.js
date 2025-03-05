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

    if (wifiToggleHeader) wifiToggleHeader.addEventListener("click", toggleExpandWifi);
    if (electricityToggleHeader) electricityToggleHeader.addEventListener("click", toggleExpandElectricity);

    // ✅ FIX: Toggle Reference Section
    const referenceContainer = document.getElementById("reference-container");
    const referenceToggleHeader = document.getElementById("reference-toggle-header");

    if (referenceToggleHeader) {
        referenceToggleHeader.addEventListener("click", function () {
            referenceContainer.style.display = 
                (referenceContainer.style.display === "none") ? "block" : "none";
        });
    }

    // ✅ Render Doughnut Charts Correctly
    document.querySelectorAll("canvas").forEach((canvas) => {
        let used = parseFloat(canvas.getAttribute("data-used")) || 0;
        let total = parseFloat(canvas.getAttribute("data-total")) || 100;
        let remaining = Math.max(0, total - used);

        let ctx = canvas.getContext("2d");

        // Destroy existing chart if it exists
        if (canvas.chartInstance) {
            canvas.chartInstance.destroy();
        }

        // ✅ Fix Flattening Issue: Ensure correct aspect ratio
        canvas.style.width = "150px"; // Adjust as needed
        canvas.style.height = "150px"; // Adjust as needed

        // ✅ Create a new Chart.js doughnut chart
        canvas.chartInstance = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [{
                    data: [used, remaining],
                    backgroundColor: [
                        "rgba(50, 100, 180, 0.5)", // ✅ Used (semi-transparent blue)
                        "#23A455" // ✅ Remaining (vibrant green)
                    ],
                    borderWidth: 0,  // ✅ Removes extra white border
                    borderRadius: [0,50], // ✅ Rounded edges ONLY on remaining part
                    
                    cutout: "75%" // ✅ Adjust thickness of the ring
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // ✅ Fix Flattening Issue
                rotation: -90, // ✅ Starts from the top
                circumference: 360, // ✅ Full-circle doughnut
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false } // ✅ Hide tooltips
                },
                animation: {
                    onComplete: function () {
                        drawText(canvas.chartInstance, remaining);
                    }
                }
            },
            plugins: [{
                afterDraw: function (chart) {
                    drawText(chart, remaining);
                }
            }]
        });

        function drawText(chart, remaining) {
            let width = chart.width,
                height = chart.height,
                ctx = chart.ctx;

            ctx.restore();
            ctx.font = "bold 30px 'Open Sans', sans-serif"; // ✅ Larger font for GB value
            ctx.fillStyle = "#ffffff"; // ✅ White text
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Draw remaining GB value
            ctx.fillText(`${remaining.toFixed(1)}GB`, width / 2, height / 2 - 10);

            // Draw "REMAINING" below
            ctx.font = "14px 'Open Sans', sans-serif"; 
            ctx.fillText("REMAINING", width / 2, height / 2 + 18);
            
            ctx.save();
        }
    });
});
