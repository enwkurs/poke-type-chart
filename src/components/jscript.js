async function fetchTypesList(url) {

    // Fetch main list of types
    try {
        const typeslist = await fetch(url);
        if (!typeslist.ok) throw new Error(`Error fetching types list.`); // Check for fetch error, throw if error

        // Turn fetched data into json
        const typeslistjson = await typeslist.json();

        // Fetch all type details - Includes name, damage relations, sprites, etc
        const typedetails = await Promise.all(
            // Map data from types list to fetch from
            typeslistjson.results.map(async poketype => {
                const alltyperesults = await fetch(poketype.url);
                if (!alltyperesults.ok) throw new Error(`Error fetching type details for ${poketype.name} or ${poketype.url}`);
                return alltyperesults.json();
            })
        );

        // Look for element in HTML elements to render to
        // const htmlrender = document.querySelector('#typecontainer'); // main container RESTORE THIS IF I BREAK IT
        const htmlrender = document.querySelector("#typegrids"); // THIS IS NEW

        // THIS IS NEW FOR THE 3 COLUMN METHOD
        const columns = [
            document.querySelector("#typecontainer"),
            document.querySelector("#typecol2"),
            document.querySelector("#typecol3"),
        ];
        // -----------------------------------------

        if (!htmlrender) return; // If htmlrender is not found, skip to return

        // Get name and damage relations info using the typedetails promise
        typedetails.forEach((typeinfo, i) => {
            // Create a div that holds everything from each type as its own group
            const typeholder = document.createElement("div");
            typeholder.className = "typeholder";

            // Create a div to hold Main type titles
            const typeheader = document.createElement("div");
            typeheader.className = "typeheader";
            typeheader.addEventListener("click", function() {
                typecard.classList.toggle("hide");
                typeholder.classList.toggle("showbg");
            });

            // Create a div to hold each type's details in its own card
            const typecard = document.createElement("div");
            typecard.classList.add("hide", "typecard");

            const damagerelations = typeinfo.damage_relations; // Variable that contains the damage_relations portion of the json
            const typename = typeinfo.name; // Variable that contains the name of each type
            const spriteurl = typeinfo.sprites["generation-ix"]["scarlet-violet"].name_icon;

            // Main type = The type whos info is being viewed
            // Example: Main type normal, then show damage relations to normal

            // h2 Title for Main Type
            // const nameh2 = document.createElement("h2");
            // nameh2.className = "nameh2";
            // nameh2.textContent = typename;
            // typeheader.appendChild(nameh2);

            // Sprite for Main type
            const namesprite = document.createElement("img");
            namesprite.className = "namesprite";
            namesprite.src = spriteurl;
            typeheader.appendChild(namesprite);

            // Loop over damage_relations
            Object.entries(damagerelations).forEach(([typeofrelation, relationslist]) => {
                if (relationslist.length === 0) return;

                // Create a div to group damage relations text together with images
                const relationcontainer = document.createElement("div");
                relationcontainer.className = "relationcontainer";

                const relationpara = document.createElement("p");
                relationpara.className = "relationpara";
                relationpara.textContent = `${typeofrelation.replace(/_/g, ' ')
                                            .replace(/\b\w/g, firstletter => firstletter.toUpperCase())}:`;
                                            // \b\w means "the first character of each word"

                relationcontainer.appendChild(relationpara);

                // Create element that holds sprites in relation
                const relspritecontainer = document.createElement("div");
                relspritecontainer.className = "relspritecontainer";
                
                relationslist.forEach(relation => {
                    // const typesinrel = document.createElement("p");
                    // typesinrel.className = "typesinrel";
                    // typesinrel.textContent = `${relation.name}`
                    // htmlrender.appendChild(typesinrel);

                    // use find() to get sprites for related damage instead of fetching again
                    const reltypedetails = typedetails.find(relatedtype => relatedtype.name === relation.name);
                    const relatedspriteurl = reltypedetails.sprites["generation-ix"]["scarlet-violet"].name_icon;


                    
                    const spritesinrel = document.createElement("img");
                    spritesinrel.className = "spritesinrel";
                    spritesinrel.src = relatedspriteurl;
                    relspritecontainer.appendChild(spritesinrel);
                    relationcontainer.appendChild(relspritecontainer);
                    
                    typecard.appendChild(relationcontainer);
                });
            });



            // Trying to append things in the place  I want

            typeholder.appendChild(typeheader);
            typeholder.appendChild(typecard);

            columns[i % 3].appendChild(typeholder);

            // htmlrender.appendChild(typeholder);
        });

    } catch (error) {
        console.error('There was an error with the site:', error);
    }
}

// Run the script to make it show on the page
fetchTypesList('https://pokeapi.co/api/v2/type?limit=18&offset=0');


// Need a container to hold the relationpara together with the relsprite so they can be separated a bit more in css
// typecard >
// relationcontainer >
// - relationpara
// - relspritecontainer
