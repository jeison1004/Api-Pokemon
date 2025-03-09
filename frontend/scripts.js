// Escuchar el evento click del botón "Buscar Pokemon"
document.getElementById('buscar').addEventListener('click', function () {
    const nombrePokemon = document.getElementById('entrada').value.trim().toLowerCase();
    if (nombrePokemon) {
        buscarPokemon(nombrePokemon); // Llama a la función para buscar el Pokémon
    } else {
        alert('Por favor, ingresa el nombre de un Pokémon.');
    }
});

// Función para buscar un Pokémon por nombre
async function buscarPokemon(nombre) {
    try {
        // Ruta relativa al archivo JSON (desde la carpeta frontend)
        const response = await fetch('../pokemon.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        const data = await response.json();

        // Buscar el Pokémon por nombre
        const pokemon = data.pokemon.find(p => p.name.toLowerCase() === nombre);
        if (pokemon) {
            // Mostrar el nombre del Pokémon
            document.getElementById('nombre_pokemon').textContent = pokemon.name.toUpperCase();

            // Mostrar la imagen del Pokémon
            const imagenPokemon = document.getElementById('imagen_pokemon');
            imagenPokemon.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">`;

            // Mostrar las habilidades del Pokémon
            const habilidadesPokemon = document.getElementById('habilidades_del_pokemon');
            habilidadesPokemon.innerHTML = pokemon.abilities
                .map(ability => `<p>${ability}</p>`)
                .join('');
        } else {
            // Si el Pokémon no existe, muestra un mensaje
            alert('Pokémon no encontrado.');
            // Limpia los contenedores
            document.getElementById('nombre_pokemon').textContent = '';
            document.getElementById('imagen_pokemon').innerHTML = '';
            document.getElementById('habilidades_del_pokemon').innerHTML = '';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al cargar los datos.');
    }
}