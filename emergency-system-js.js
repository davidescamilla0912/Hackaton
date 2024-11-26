class EmergencySystem {
    constructor() {
        this.emergencies = [];
        this.activeEmergencies = 0;
        this.availableResources = 10;
        this.averageResponse = 15;

        // Subtipos de emergencias
        this.subOptions = {
            medical: [
                { value: "pandemic", text: "Pandemia" },
                { value: "epidemic", text: "Epidemia" },
                { value: "outbreak", text: "Brote" },
                { value: "other", text: "otro" },
            ],
            natural: [
                { value: "earthquake", text: "Terremoto" },
                { value: "flood", text: "Inundación" },
                { value: "hurricane", text: "Huracán" },
                { value: "other", text: "otro" },
            ],
            technological: [
                { value: "industrial", text: "Accidente industrial" },
                { value: "power-outage", text: "Corte eléctrico" },
                { value: "data-breach", text: "Filtración de datos" },
                { value: "other", text: "otro" },
            ],
            security: [ 
                { value: "intrusion", text: "Intrusión" },
                { value: "assault", text: "Asalto" },
                { value: "vandalism", text: "Vandalismo" },
                { value: "other", text: "otro" },
            ],
        };

        this.initializeEventListeners();
        this.updateDashboard();
        this.initializeMap();
    }

    initializeEventListeners() {
        // Listener del formulario
        document.getElementById('emergencyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewEmergency();
        });

        // Listener del menú principal para los subtipos
        const mainMenu = document.getElementById("type");
        const subMenu = document.getElementById("sub-menu");
        const subMenuOptions = document.getElementById("sub-menu-options");

        mainMenu.addEventListener("change", (event) => {
            const selectedValue = event.target.value;

            // Limpiar las opciones previas
            subMenuOptions.innerHTML = "";

            if (this.subOptions[selectedValue]) {
                // Mostrar el submenú
                subMenu.style.display = "block";

                // Agregar opciones dinámicas
                this.subOptions[selectedValue].forEach(option => {
                    const opt = document.createElement("option");
                    opt.value = option.value;
                    opt.textContent = option.text;
                    subMenuOptions.appendChild(opt);
                });
            } else {
                // Ocultar el submenú si no hay opciones
                subMenu.style.display = "none";
            }
        });

        // Agregar un retraso para la búsqueda de dirección
        let typingTimeout;
        document.getElementById('location').addEventListener('input', (e) => {
            const address = e.target.value;

            // Limpiar el tiempo de espera anterior
            clearTimeout(typingTimeout);

            // Iniciar un nuevo tiempo de espera para buscar la dirección después de un breve retraso
            typingTimeout = setTimeout(() => {
                this.updateMapWithAddress(address);
            }, 1000); // 1 segundo de espera después de que el usuario deja de escribir
        });
    }

    handleNewEmergency() {
        const type = document.getElementById('type').value;
        const subtype = document.getElementById('sub-menu-options').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const priority = document.getElementById('priority').value;

        const emergency = {
            id: Date.now(),
            type,
            subtype,
            location,
            description,
            priority,
            status: 'active',
            timestamp: new Date().toLocaleString()
        };

        this.emergencies.unshift(emergency);
        this.activeEmergencies++;
        this.availableResources--;
        this.updateDashboard();
        this.renderEmergencies();
        this.resetForm();
    }

    updateDashboard() {
        document.getElementById('activeEmergencies').textContent = this.activeEmergencies;
        document.getElementById('availableResources').textContent = this.availableResources;
        document.getElementById('averageResponse').textContent = `${this.averageResponse} min`;
    }

    renderEmergencies() {
        const list = document.getElementById('emergencyList');
        list.innerHTML = '';

        this.emergencies.forEach(emergency => {
            const item = document.createElement('div');
            item.className = `emergency-item status-${emergency.priority}`;
            item.innerHTML = `
                <h3>${this.getEmergencyTypeText(emergency.type)} </h3>
                <p><strong>SubTipo:</strong> ${this.getEmergencySubtypeText(emergency.type, emergency.subtype)}</p>
                <p><strong>Ubicación:</strong> ${emergency.location}</p>
                <p><strong>Descripción:</strong> ${emergency.description}</p>
                <p><strong>Prioridad:</strong> ${this.getPriorityText(emergency.priority)}</p>
                <p><strong>Reportado:</strong> ${emergency.timestamp}</p>
                <button class="resolve-btn">Marcar como Resuelto</button>
            `;

            // Listener dinámico para marcar como resuelto
            item.querySelector('.resolve-btn').addEventListener('click', () => {
                this.resolveEmergency(emergency.id);
            });

            list.appendChild(item);
        });
    }

    resolveEmergency(id) {
        const index = this.emergencies.findIndex(e => e.id === id);
        if (index !== -1) {
            this.emergencies[index].status = 'resolved';
            this.activeEmergencies--;
            this.availableResources++;
            this.updateDashboard();
            this.renderEmergencies();
        }
    }

    getEmergencyTypeText(type) {
        const types = {
            medical: 'Emergencia Médica',
            natural: 'Desastre Natural',
            technological: 'Emergencia Tecnológica',
            security: 'Emergencia de Seguridad'
        };
        return types[type] || type;
    }

    getEmergencySubtypeText(type, subtype) {
        const subtypes = {
            medical: {
                pandemic: "Pandemia",
                epidemic: "Epidemia",
                outbreak: "Brote",
            },
            natural: {
                earthquake: "Terremoto",
                flood: "Inundación",
                hurricane: "Huracán",
            },
            technological: {
                industrial: "Accidente industrial",
                "power-outage": "Corte eléctrico",
                "data-breach": "Filtración de datos",
            },
            security: {
                intrusion: "Intrusión",
                assault: "Asalto",
                vandalism: "Vandalismo",
            }
        };
        return subtypes[type] && subtypes[type][subtype] ? subtypes[type][subtype] : subtype;
    }

    getPriorityText(priority) {
        const priorities = {
            high: 'Alta',
            medium: 'Media',
            low: 'Baja'
        };
        return priorities[priority] || priority;
    }

    resetForm() {
        document.getElementById('emergencyForm').reset();
        document.getElementById("sub-menu").style.display = "none"; // Ocultar submenú
    }

       // Inicialización del mapa
   initializeMap() {
    this.map = L.map('map').setView([10.9680, -74.8025], 13); // Coordenadas iniciales de Barranquilla

    // Cargar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Agregar un marcador al hacer clic en el mapa
    this.map.on('click', (e) => {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Eliminar el marcador anterior si existe
        if (this.selectedLocation) {
            this.map.removeLayer(this.selectedLocation);
        }

        // Agregar un nuevo marcador en la ubicación seleccionada
        this.selectedLocation = L.marker([lat, lng]).addTo(this.map);

        // Llamar a la función de geocodificación inversa
        this.reverseGeocode(lat, lng);
    });
}

// Función para obtener la dirección a partir de las coordenadas (Geocodificación inversa)
reverseGeocode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                const address = `${data.address.road || ''} ${data.address.house_number || ''}, ${data.address.city || ''}, ${data.address.country || ''}`;
                
                // Actualizar el campo de ubicación con la dirección
                document.getElementById('location').value = address;
            } else {
                document.getElementById('location').value = 'Dirección no encontrada.';
            }
        })
        .catch(error => {
            console.error('Error al obtener la dirección:', error);
            alert('Hubo un error al intentar obtener la dirección.');
        });
}

// Actualizar el mapa con la dirección proporcionada (funcionalidad de geocodificación directa)
updateMapWithAddress(address) {
    const formattedAddress = address.trim().replace(/\s+/g, ' '); // Eliminar espacios extra

    // Realizar la búsqueda en Nominatim para obtener las coordenadas de la dirección
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(formattedAddress)}, Barranquilla, Colombia`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);

                // Centrar el mapa en las nuevas coordenadas
                this.map.setView([lat, lng], 13);

                // Colocar un marcador en la nueva ubicación
                if (this.selectedLocation) {
                    this.map.removeLayer(this.selectedLocation);
                }
                this.selectedLocation = L.marker([lat, lng]).addTo(this.map);

                // Actualizar el campo de ubicación con la dirección
                this.reverseGeocode(lat, lng);
            } else {
                alert("Dirección no encontrada en Barranquilla.");
            }
        })
        .catch(error => {
            console.error('Error al obtener la dirección:', error);
            alert('Hubo un error al intentar obtener la dirección.');
        });
}

// Redirigir al login si no hay sesión iniciada
checkLoginStatus() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html'; // Redirige al login si no está logueado
    }
}

// Función para cerrar sesión
logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html'; // Redirige al login después de cerrar sesión
}
}

// Inicializar la clase y verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function () {
const emergencySystem = new EmergencySystem();

// Verificar si el usuario está logueado al cargar la página
window.onload = function() {
    emergencySystem.checkLoginStatus();
};

// Función para cerrar sesión
document.getElementById('logout-btn').addEventListener('click', function () {
    emergencySystem.logout();
});

// Evento de búsqueda por dirección
document.getElementById('location').addEventListener('input', function () {
    const address = this.value;
    if (address.length > 3) {  // Solo buscar si la dirección tiene más de 3 caracteres
        emergencySystem.updateMapWithAddress(address);
    }
});
});