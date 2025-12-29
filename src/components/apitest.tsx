import { useState, useEffect } from 'react';

export function Pokemon() {

    type PokemonData = {
        name: string,
        id: number,
        sprite: string,
    };

    const [ isLoading, setLoading ] = useState(true);
    const [ pokeData, setPokeData ] = useState<PokemonData[] > ([]);
    // Example:   const [data, setData] = useState<Movie[]>([]);
    // Example: useState<Movie[]>([]);
    // Explanation: “Create a piece of memory for this component that will hold a list of movies. Start with an empty list.”
    // Movie[] “This value must be an array of Movie objects.”
    // [] The starting value.
    
    const getPokemonData = async () => {
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
            const json = await response.json();
            setPokeData([
                { id: json.id,
                name: json.species.name,
                sprite: json.sprites.front_default, }
            ]); } catch (error) { 
                console.error(error); } finally {
                    setLoading(false); // Changes the state of setLoading to false
                }
    };

    useEffect( () => {
        // Create an anonymous function inside useEffect
        getPokemonData(); // Call the variable i made inside this function to do what?
    }, []); // What does the empty [] do?

// Example:
/* 
  return (
    <View style={{flex: 1, padding: 24}}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={({id}) => id}
          renderItem={({item}) => (
            <Text>
              {item.title}, {item.releaseYear}
            </Text>
          )}
        />
      )}
    </View>
*/
// No idea what any of that is except maybe shortcuts for various html and css. How to make it work in ways I already understand?
// First part is a ternary to check for loading state?
// Element rendering goes inside the ternary?

return(
    <>
    {isLoading ? (<p>Loading...</p>) : (
        // Data from type goes in here somehow
        // name, nadex, type
        // example seems to have used a lot of pre-made components that i don't know what are
        // Map the data?

        pokeData.map((data) => (
            <div>
                <p>{data.name}</p>
                <p>{data.id}</p>
                <img src={data.sprite} />
            </div>
        ))
    )}
    </>
)

}
