import { useState, useEffect } from "react";

export function PokemonTypes() {

    type typesData = {
        typename: string,
        strongvs: string,
        weakvs: string,
    };

    const [ isLoading, setLoading ] = useState(true);
    const [ typeData, setTypeData ] = useState<typesData[]> ([]);

    const getTypeData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/type/')
            const json = await response.json();

            const apiData = json.results.map(
                (type: any) => fetch(type.url).then(response => response.json())
            )

            const allTypes = await Promise.all(apiData)
            setTypeData(allTypes)
        }
    }

    useEffect( () => {
        getTypeData();
    }, [])

    return(
    <>
    {isLoading ? (<p>Loading...</p>) : 
        ( typeData.map((data) => (
            <div>
                
            </div>
        ))
    )}
    </>
)

}