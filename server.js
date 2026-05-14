const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pokemon/:name', async (req, res) => {
    const {name} = req.params;

    try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
        const response = await axios.get(url);
        const pokemon = response.data;

        const dados = {
            name: pokemon.name,
            id: pokemon.id,
            tipos: pokemon.types.map(type => type.type.name),
            altura: pokemon.height / 10 + 'm',
            peso: pokemon.weight / 10 + 'kg',
            imagem: pokemon.sprites.other['official-artwork'].front_default,
            habilidades: pokemon.abilities.map(ability => ability.ability.name),
        };

        res.json(dados);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({error: 'Pokémon não encontrado'});
        } else {
            res.status(500).json({error: 'Erro ao buscar dados do Pokémon'});
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});