const totalPokemons = 151;
const totalPages = 10;

(async() => {
  const fs = require('fs');
  const pokemonsIds = Array.from({length: totalPokemons}, (_,i) => i + 1);
  let fileContent = pokemonsIds.map(
    id => `/pokemons/${id}`
  ).join('\n');

  for (let i = 1; i <= totalPages; i++) {
    fileContent += `\n/pokemons/page/${i}`

  }

  const pokemonNameList = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalPokemons}`).then(resp => resp.json());

  fileContent += '\n';
  fileContent += pokemonNameList.results.map(pokemon => `/pokemons/${pokemon.name}`).join('\n');

  fs.writeFileSync('routes.txt', fileContent);
})();
