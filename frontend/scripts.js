document.getElementById('buscar').addEventListener('click', function () {
    const nombrePokemon = document.getElementById('entrada').value.trim().toLowerCase();
    if (nombrePokemon) {
        buscarPokemon(nombrePokemon); 
    } else {
        alert('Por favor, ingresa el nombre de un Pokémon.');
    }
});

async function buscarPokemon(nombre) {
    try {
        // Hacer la solicitud al servidor
        const response = await fetch(`http://localhost:4000/pokemon/${nombre}`);

        // Verificar si la respuesta fue exitosa (código 200-299)
        if (!response.ok) {
            throw new Error(`No se pudo encontrar el Pokémon: ${response.statusText}`);
        }

        // Si la respuesta es exitosa, procesar el JSON
        const pokemon = await response.json();

        // Actualizar la UI con la información del Pokémon
        document.getElementById('nombre_pokemon').textContent = pokemon.name.toUpperCase();
        const imagenPokemon = document.getElementById('imagen_pokemon');
        imagenPokemon.src = pokemon.sprites.front_default;
        imagenPokemon.alt = pokemon.name;

        const tiposContainer = document.getElementById('tipos');
        tiposContainer.innerHTML = pokemon.types.map(type =>
            `<div class="tipo-${type}">${type.toUpperCase()}</div>`
        ).join('');

    } catch (error) {
        console.error('Error al buscar el Pokémon:', error);
        alert(`Hubo un error: ${error.message}`);
        // Limpiar los datos si hubo un error
        document.getElementById('nombre_pokemon').textContent = '';
        document.getElementById('imagen_pokemon').src = 'img/silueta.png';
        document.getElementById('tipos').innerHTML = '<div class="silueta"></div><div class="silueta"></div>';
    }
}


// Mostrar datos en el formulario para editar
document.getElementById('editar').addEventListener('click', function () {
    const nombrePokemon = document.getElementById('nombre_pokemon').textContent.toLowerCase();
    if (nombrePokemon) {
        document.getElementById('nombre_formulario').value = nombrePokemon;
        document.getElementById('imagen_formulario').value = document.getElementById('imagen_pokemon').src;
        document.getElementById('tipos_formulario').value = Array.from(document.getElementById('tipos').children)
            .map(p => p.textContent.toLowerCase()).join(', ');
        document.getElementById('titulo_formulario').textContent = 'Editar Pokémon';
    } else {
        alert('No hay ningún Pokémon seleccionado para editar.');
    }
});

// Preparar formulario para añadir nuevo
document.getElementById('añadir').addEventListener('click', function () {
    document.getElementById('nombre_formulario').value = '';
    document.getElementById('imagen_formulario').value = '';
    document.getElementById('tipos_formulario').value = '';
    document.getElementById('titulo_formulario').textContent = 'Añadir Pokémon';
});

// Eliminar
document.getElementById('eliminar').addEventListener('click', function () {
    eliminarPokemon();
});

// Guardar (crear o actualizar)
document.getElementById('guardar').addEventListener('click', async function () {
    const nombre = document.getElementById('nombre_formulario').value.trim().toLowerCase();
    const imagen = document.getElementById('imagen_formulario').value.trim();
    const habilidades = document.getElementById('tipos_formulario').value.trim().split(',').map(t => t.trim());
    const tipos = document.getElementById('tipos_formulario').value.trim().split(',').map(t => t.trim());


    // Validación de campos
    if (!nombre || !imagen || habilidades.length === 0) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear el objeto pokemon para enviar al servidor
    const pokemon = {
        name: nombre,  // Nombre del Pokémon
        sprites: {
            front_default: imagen,  // Imagen del Pokémon
        },
        abilities: habilidades,  // Habilidades del Pokémon (en lugar de types)
    };

    try {
        // Enviar los datos al servidor utilizando POST
        const response = await fetch(`http://localhost:4000/pokemon`, {
            method: 'POST',  // Usamos POST para agregar un nuevo Pokémon
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pokemon),  // Convertimos el objeto pokemon en formato JSON
        });

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            alert('Pokémon guardado correctamente.');
            buscarPokemon(nombre);  // Buscar el Pokémon recién agregado
        } else {
            const errorData = await response.json();
            throw new Error(`Error al guardar el Pokémon: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al guardar el Pokémon.');
    }
});

// Eliminar Pokémon
async function eliminarPokemon() {
    alert("Culo");
    const nombrePokemon = document.getElementById('nombre_pokemon').textContent.toLowerCase();
    if (!nombrePokemon) {
        alert('No hay ningún Pokémon seleccionado.');
        return;
    }

    if (confirm(`¿Estás seguro de que quieres eliminar a ${nombrePokemon}?`)) {
        try {
            const response = await fetch(`http://localhost:4000/pokemon/${nombrePokemon}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Pokémon eliminado correctamente.');
                document.getElementById('nombre_pokemon').textContent = '';
                document.getElementById('imagen_pokemon').src = 'img/silueta.png';
                document.getElementById('tipos').innerHTML = '<div class="silueta"></div><div class="silueta"></div>';
            } else {
                throw new Error('Error al eliminar el Pokémon');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al eliminar el Pokémon.');
        }
    }
}

// Cancelar acción
document.getElementById('cancelar').addEventListener('click', function () {
    document.getElementById('nombre_formulario').value = '';
    document.getElementById('imagen_formulario').value = '';
    document.getElementById('tipos_formulario').value = '';
    document.getElementById('titulo_formulario').textContent = 'Añadir Pokémon';
});

document.getElementById('editar').addEventListener('click', async function(event) {
    event.preventDefault();

    // Captura el nombre del Pokémon a editar
    const nombrePokemon = document.getElementById('nombre_formulario').value; 
    const imagen = document.getElementById('imagen_formulario').value;
    const tipos = document.getElementById('tipos_formulario').value.split(',').map(tipo => tipo.trim());

    const data = {};
    if (imagen) {
        data.sprites = { front_default: imagen }; 
    }
    if (tipos.length > 0) {
        data.types = tipos;
    }

    try {
        const response = await fetch(`http://localhost:4000/pokemon/${nombrePokemon}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const updatedPokemon = await response.json();
        console.log('Pokémon actualizado:', updatedPokemon);
        alert('Pokémon actualizado exitosamente');
        

    } catch (error) {
        console.error('Error al actualizar Pokémon:', error);
        // alert('Error final del catch: ' + error.message);
        console.error('Error final del catch: ' + error.message);
        console.error('Error final del catch sin messa: ' + error);
    }
});