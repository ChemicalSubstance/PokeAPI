import { formatPokemonID } from "./formattingUtils.js";
import { getMaxPages } from "./mathUtils.js";
import { setupPokemonMonitor } from "./eventUtils.js";
import { formatMoves, formatStats } from "./stringUtils.js";

const renderPokemon = (pageArgument) => {
    $('#divResult').empty();

    const startingIndex = (20 * pageArgument);
    const endIndex = (startingIndex + 20);
    const existsInCache = localStorage.getItem('regionCache') != undefined;

    function handleRendering() {
        const pokemonEntries = JSON.parse(localStorage.getItem('regionCache'));

        for (let pokemonIndex = startingIndex; pokemonIndex < endIndex; pokemonIndex++) {
            try {
                const currentPokemon = pokemonEntries[pokemonIndex];
                const pokemonData = currentPokemon['pokemon_species'];
                const formattedPokemonID = formatPokemonID(pokemonIndex + 1);
                const pokemonSprite = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${formattedPokemonID}.png`;
    
                $('#divResult').append(`
                    <div class='card' pokemonID=${pokemonIndex + 1} style='animation-fill-mode: fowards; animation: fadeInAnimation ease .7s'>
                        <h3>${pokemonData.name}</h3>
                        <img src='${pokemonSprite}'>
                        <kbd>${formattedPokemonID}</kbd>
                    </div>
                `)
            } catch(err) {
                console.error(`Er ging iets fout terwijl we de pokemon aan het renderen waren: ${err}`);
            }
        }

        setupPokemonMonitor();  
    }

    if(!existsInCache) {
        fetch(`https://pokeapi.co/api/v2/pokedex/1`)
        .then(res => res.json())
        .then(data => {
            if(data != undefined) {
                localStorage.setItem('regionCache', JSON.stringify(data['pokemon_entries']));
                handleRendering()
            }
        })
        .catch(err => {console.error(err);});
    } else {
        handleRendering()
    }
}

const showModal = (pokemonID) => {
    const pokemonModal = $("#pokemonModal")
    pokemonModal.attr('style', 'display: block !important;')

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonID}`)
    .then(res => res.json())
    .then(data => {
        const formattedPokemonID = formatPokemonID(pokemonID);
        const pokemonSprite = `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${formattedPokemonID}.png`;

        $("#modalPokemonName").text(`Naam: ${data['species'].name}`)
        $("#modalPokemonType").text(`Type: ${data['types'][0]['type'].name}`)
        $("#modalPokemonMoves").text(formatMoves(data['abilities']))
        $("#modalPokemonStats").text(formatStats(data['stats']))
        $("#modalPokemonImage").attr('src', pokemonSprite)
    })

    $("#toggleModal").on('click', () => {
        $("#pokemonModal").attr('style', 'display: none !important;')
    })

    $('.modalNavigation').empty()
    $('.modalNavigation').append(`
        <button class="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mr-4" id="modalPrevious">
            Prev
        </button>

        <button class="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ml-4" id="modalNext">
            Next
        </button>
    `)

    const modalNext = document.querySelector('#modalNext');
    const modalPrevious = document.querySelector('#modalPrevious');

    modalNext.addEventListener('click', nextHandler);
    modalPrevious.addEventListener('click', previousHandler);

    function nextHandler() {
        if(pokemonID < 897) {
            modalNext.removeEventListener('click', nextHandler);
            modalPrevious.removeEventListener('click', previousHandler);
            showModal(parseInt(pokemonID) + 1);
        }
    }

    function previousHandler() {
        if(pokemonID != 1) {
            modalNext.removeEventListener('click', nextHandler);
            modalPrevious.removeEventListener('click', previousHandler)
            showModal(parseInt(pokemonID) - 1);
        }
    }
}

const renderPagination = () => {
    $(".pagination").empty();

    const maxPages = getMaxPages(897)
    let currentPage = 0;

    $(".pagination").append(`
        <div class="flex flex-col items-center">

            <span class="text-sm text-gray-700 dark:text-gray-400">
                Showing <span class="font-semibold text-gray-900 dark:text-black" id='startIndexLabel'>${currentPage * 20}</span> to <span class="font-semibold text-gray-900 dark:text-black" id='endIndexLabel'>${currentPage * 20 + 20}</span> of <span class="font-semibold text-gray-900 dark:text-black">897</span> Entries
            </span>

            <div class="inline-flex mt-2 xs:mt-0">
                <button class="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mr-4" id='paginationPrevious'>
                    Prev
                </button>

                <button class="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ml-4" id='paginationNext'>
                    Next
                </button>
            </div>
        </div>
    `)

    function updateAttributes(currentPage) {
        $("#startIndexLabel").text(currentPage * 20);
        $("#endIndexLabel").text(currentPage * 20 + 20);
    }

    $("#paginationNext").on('click', function() {
        if(currentPage != maxPages) {
            currentPage++;
            renderPokemon(currentPage);
            updateAttributes(currentPage);
        }
    })

    $("#paginationPrevious").on('click', function() {
        if(currentPage != 0) {
            currentPage--;
            renderPokemon(currentPage);
            updateAttributes(currentPage);
        }
    })
}

const _renderPokemon = renderPokemon;
const _renderPagination = renderPagination;
const _showModal = showModal;

export {
    _renderPokemon as renderPokemon,
    _renderPagination as renderPagination,
    _showModal as showModal
}