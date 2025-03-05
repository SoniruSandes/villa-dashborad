document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page reload

    // Get input values
    let username = document.querySelector("input[name='username']").value.trim();
    let password = document.querySelector("input[name='password']").value.trim();

    // Hardcoded user credentials
    let users = {
        "250216Dimi": "14&2x",
        "Dimitri216": "14&2x"
    };

    // Check if credentials match
    if (users[username] && users[username] === password) {
        alert("Login Successful!");
        window.location.href = "https://villa-unw.vercel.app/Dimi1600202025.html";
    } else {
        alert("Login Failed: Invalid username or password");
    }
});
