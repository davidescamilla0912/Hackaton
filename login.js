document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Obtener los valores del formulario
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Verificación de las credenciales almacenadas en el localStorage
    const storedUser = localStorage.getItem(username);

    if (storedUser && storedUser === password) {
        // Si las credenciales son correctas
        localStorage.setItem('isLoggedIn', 'true'); // Guardar estado de sesión
        window.location.href = 'emergency-system-html.html'; // Redirigir a la página de emergencias
    } else {
        // Mostrar un mensaje de error
        document.getElementById("error-message").style.display = "block";
    }
});

document.getElementById("show-register").addEventListener("click", function() {
    document.getElementById("login-container").style.display = "none";
    document.getElementById("register-container").style.display = "block";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("register-container").style.display = "none";
    document.getElementById("login-container").style.display = "block";
});

document.getElementById("registerForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;

    // Verificar si el usuario ya está registrado
    if (localStorage.getItem(newUsername)) {
        alert("El usuario ya existe. Por favor, elige otro nombre.");
    } else {
        // Guardar las credenciales en localStorage
        localStorage.setItem(newUsername, newPassword);
        alert("Usuario registrado con éxito");
        document.getElementById("register-container").style.display = "none";
        document.getElementById("login-container").style.display = "block";
    }
});
