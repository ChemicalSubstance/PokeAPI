const formatMoves = (movesRegistry) => {
    const moveAmount = Object.keys(movesRegistry).length;
    let finalString = "";

    for (let moveIndex = 0; moveIndex < moveAmount; moveIndex++) {
        const moveName = movesRegistry[moveIndex]['ability'].name;
        finalString += ` ${moveIndex + 1} - ${moveName}. `;
    }

    return finalString
}

const formatStats = (statsRegistry) => {
    return `
       HP: ${statsRegistry[0]['base_stat']} \n
       ATK: ${statsRegistry[1]['base_stat']} \n
       DEF: ${statsRegistry[2]['base_stat']} \n
       SP_ATK: ${statsRegistry[3]['base_stat']} \n
       SP_DEF: ${statsRegistry[4]['base_stat']} \n
       SPD: ${statsRegistry[5]['base_stat']} \n
    `
}

const _formatMoves = formatMoves;
const _formatStats = formatStats;

export {
    _formatMoves as formatMoves,
    _formatStats as formatStats
}