import { showModal } from "./renderUtils.js";

const setupPokemonMonitor = () => {
    $("#divResult div").each(function(){
        $(this).on('click', function(){
            showModal($(this).attr('pokemonid'));
        })
    });
}

const _setupPokemonMonitor = setupPokemonMonitor;
export {_setupPokemonMonitor as setupPokemonMonitor}