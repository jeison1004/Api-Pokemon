import express from 'express'; 
import fs from 'fs';
import cors from 'cors'; // Importa el paquete cors

const app = express(); 
app.use(cors()); 
app.use(express.json()); 

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

app.post('/pokemon', (req, res) => {
  const data = readData();
  const body = req.body;

  // Validar que el cuerpo de la solicitud tenga los campos necesarios
  if (!body.name || !body.sprites || !body.types) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: name, sprites, types' });
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
    types: body.types, // Asegúrate de que el servidor también maneje los tipos correctamente
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
  const pokemonIndex = data.pokemon.findIndex((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase());
  if (pokemonIndex !== -1) {
    // Eliminar el Pokémon del array
    data.pokemon.splice(pokemonIndex, 1);
    writeData(data);
    res.json({ message: 'Pokemon eliminado correctamente' });
  } else {
    res.status(404).json({ message: 'Pokemon no encontrado' });
  }
});


app.listen(4000, () => {
  console.log(`Servidor escuchando en http://0.0.0.0:4000`);
});

app.patch('/pokemon/:name', (req, res) => {
  const data = readData();
  const name = req.params.name; 
  const body = req.body;


  if (!body.sprite && !body.types) {
      return res.status(400).json({ message: 'Faltan campos para actualizar: sprites o types' });
  }

 
  const pokemonExistente = data.pokemon.find((pokemon) => pokemon.name.toLowerCase() === name.toLowerCase());
  if (!pokemonExistente) {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
  }

  
  if (body.sprites) {
      pokemonExistente.sprites = body.sprites.json(); 
  }
  if (body.types) {
      pokemonExistente.types = body.types.json(); 
  }

  
  writeData(data);

  
  res.status(200).json(pokemonExistente);
});
