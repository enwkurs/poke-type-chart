import { useEffect, useState } from "react";

// https://pokeapi.co/api/v2/type?limit=21&offset=0
// name, url

/*
Thinking through the logic:

We have pokeapi.co/URL which points to a json file that contains a list of items. Each item contains two pieces of info:
name and url

We need to use an async function to fetch this list to bring that information into the script
In the script, the shape of this information is determined by an interface called typesList
This interface determines that name: and url: are both always expected to be a string

We use useState to control and access the data from that api list
pokemonTypesState is always representative of whatever the current state ( value ) is
setPokeMonTypesState controls what the value of pokemonTypesState is


*/

// Interface for type list
interface typesList {
    name: string,
    url: string,
};

// Interface for type information
interface typesInfo {
    name: string,
    damage_relations: {
        double_damage_from: { name: string, url: string }[],
        double_damage_to: { name: string, url: string }[],
        half_damage_from: { name: string, url: string }[],
        half_damage_to: { name: string, url: string }[],
        no_damage_from: { name: string, url: string }[],
        no_damage_to: { name: string, url: string }[],
    },
    sprites: {
        "generation-viii": { "legends-arceus": { name_icon: string } },
    }
}

// Main function
export function PokemonTypes() {

    const [ pokemonTypesState, setPokemonTypesState ] = useState<typesList[]>([]);
    const [ typesDetailsState, setTypesDetailsState ] = useState<typesInfo[]>([]);


    // Fetch Type List
    useEffect(
        () => {
            const abortController = new AbortController();
            const typesUrl = "https://pokeapi.co/api/v2/type?limit=21&offset=0";

            async function fetchTypesList() {
                const typesListResult = await fetch( typesUrl, { signal: abortController.signal });
                const typesListData: { results: typesList[] } = await typesListResult.json();

                const typesListDisplay = typesListData.results;
                setPokemonTypesState(typesListDisplay);
            }
            fetchTypesList();

            return () => abortController.abort();
        }, []);

    // Fetch Type Details ( a single object )
    useEffect(
        () => {
            if (pokemonTypesState.length === 0) return; // This is supposed to make this portion wait until the type list is loaded before doing anything.

            const abortController = new AbortController();

            async function fetchTypesDetails() {
                const allTypeDetails = await Promise.all(
                    // Promise here "promises" future values to allTypeDetails. These values will be obtained via fetching
                    // map typestate to be able to point to a url to fetch from
                    pokemonTypesState.map( async (type) => {
                        const typesDetailResults = await fetch(type.url, {signal: abortController.signal});
                        const typesDetailData: typesInfo = await typesDetailResults.json();
                        return typesDetailData;
                    })
                );

                setTypesDetailsState(allTypeDetails);
            }
            fetchTypesDetails();

            return () => abortController.abort();

        }, [pokemonTypesState]);

    return(
        <><div className="anotherdiv">
            { pokemonTypesState.map( (poketype, typeindex) => {
                const typeinfo = typesDetailsState[typeindex];
                if (!typeinfo) return null;

                return(
                    <div className="adiv">
                        <p>Pokemon Type: {poketype.name}</p>
                        <img src={typeinfo.sprites["generation-viii"]["legends-arceus"].name_icon} />
                        {typeinfo.damage_relations.no_damage_from.map( (nodamagefrom) => <p>No Damage From: {nodamagefrom.name}
                        

                        </p>)}
                    </div>
                )
            })}    
        </div></>
        )
    }
