import {renderPokemon, renderPagination} from './modules/renderUtils.js';

$(document).ready(function() {
    renderPokemon(0);
    renderPagination();
});