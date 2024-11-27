document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    const storedAdminUser = "admin"; // admin
    const storedAdminPassword = "admin123"; // Contraseña de admin


    
    if (username === storedAdminUser && password === storedAdminPassword) {
       
        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem('role', 'admin');      
        window.location.href = 'admin.html'; // Redirigir al dashboard de admin
    }
    
    else if (username && password) {
        
        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem('role', 'user');       
        window.location.href = 'emergency-system-html.html'; // Redirigir 
    } else {
        // Mostrar un mensaje de error si las credenciales son incorrectas
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
