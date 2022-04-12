const formatPokemonID = (pokemonID) => {
    let needsExtra1;
    let needsExtra2;

    if (pokemonID < 10) {
        needsExtra1 = true
    }

    if (pokemonID < 100) {
        needsExtra2 = true
    }

    let baseNumber = pokemonID;
    if(needsExtra1) {
        baseNumber = `0${baseNumber}`;
    }
    if(needsExtra2) {
        baseNumber = `0${baseNumber}`;
    }

    return baseNumber;
}

const _formatPokemonID = formatPokemonID;
export {_formatPokemonID as formatPokemonID}