import express from 'express';
import fs from 'fs';

// Instanciamos un objeto express
const app = express();

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// Necesitamos que escuche en ese puerto
app.listen(4000, () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${4000}`);
});

// Función para leer datos del archivo pokemon.json
const readData = () => {
  try {
    const data = fs.readFileSync('./pokemon.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { pokemon: [] }; // Retorna un objeto vacío si el archivo no existe
  }
};

// Función para escribir datos en el archivo pokemon.json
const writeData = (data) => {
  try {
    fs.writeFileSync('./pokemon.json', JSON.stringify(data, null, 2)); // Formato legible
  } catch (error) {
    console.log(error);
  }
};

// Rutas

// Obtener todos los Pokémon
app.get('/pokemon', (req, res) => {
  const data = readData();
  res.json(data.pokemon);
});

// Obtener un Pokémon por nombre
app.get('/pokemon/:name', (req, res) => {
  const data = readData();
  const name = req.params.name;
  const pokemon = data.pokemon.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase());
  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).json({ message: 'Pokemon no encontrado' });
  }
});

// Agregar un nuevo Pokémon
app.post('/pokemon', (req, res) => {
  const data = readData();
  const body = req.body;

  // Validar que el cuerpo de la solicitud tenga los campos necesarios
  if (!body.name || !body.sprites || !body.abilities) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: name, sprites, abilities' });
  }

  // Verificar si el Pokémon ya existe
  const pokemonExistente = data.pokemon.find((pokemon) => pokemon.name.toLowerCase() === body.name.toLowerCase());
  if (pokemonExistente) {
    return res.status(400).json({ message: 'El Pokémon ya existe' });
  }

  // Crear un nuevo Pokémon
  const newPokemon = {
    name: body.name,
    sprites: body.sprites,
    abilities: body.abilities,
  };

  // Agregar el nuevo Pokémon al array
  data.pokemon.push(newPokemon);
  writeData(data);

  // Responder con el nuevo Pokémon
  res.status(201).json(newPokemon);
});

// Eliminar un Pokémon por nombre
app.delete('/pokemon/:name', (req, res) => {
  const data = readData();
  const name = req.params.name;

  // Buscar el índice del Pokémon
  const pokemonIndex = data.pokemon.findIndex((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase());

  // Si el Pokémon existe
  if (pokemonIndex !== -1) {
    // Eliminar el Pokémon del array
    data.pokemon.splice(pokemonIndex, 1);
    writeData(data);

    // Responder con un mensaje de éxito
    res.json({ message: 'Pokemon eliminado correctamente' });
  } else {
    // Si el Pokémon no existe, responder con un error
    res.status(404).json({ message: 'Pokemon no encontrado' });
  }
});