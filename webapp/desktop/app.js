console.log("Desktop script is running");
/* CONSTANTS */
// Pages
const pages = ['home', 'portfolio', 'services', 'contact'];
// DOM Elements
const body = document.querySelector("body")
const navButtons = document.querySelectorAll("#nav-bar .btnGroup");
const page = document.querySelector(".page");
const nav = document.querySelector("#nav");
const navBar = document.querySelector("#nav-bar");
const butterfly = document.getElementById('butterfly');
const signature = document.getElementById('signature');
// Style Variables (Used for dynamic theming)
const tiles = ['--tile1', '--tile2', '--tile3']; 

function updatePageHTML(link) {
    fetch(link)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const newPageContent = doc.querySelector('.page');

            if (newPageContent) {
                page.innerHTML = newPageContent.innerHTML;
                main();
            } else {
                console.error('No element with class "page" found in the fetched HTML.');
            }
        })
        .catch(error => {
            console.error('Failed to fetch page:', error);
        });

}

function elementFromHTML(html){
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

// Persistent Listeners. These functions are not page specific.
function attachNAVListeners() {
    navButtons.forEach(navButton => {
        const matchedPage = pages.find(e => navButton.classList.contains(e));
        navButton.classList.remove("pressed");
        if (matchedPage == page.id) {
            navButton.classList.add("pressed");
        }
        navButton.addEventListener('click', function (event) {
            event.preventDefault();
            if (matchedPage == page.id) return;
            updatePageHTML(window.basePath + "pages/" + matchedPage.trim() + ".html");
            body.classList.replace(page.id, matchedPage.trim());
            page.id = matchedPage.trim();
            console.log(`navigated to ${page.id}`);
        },  { once: true }); // prevent multiple duplicate listeners
    });
}

// Parse project.json
let projects = []; // Variable to store the parsed JSON data
async function parseJSON() {
    try {
        const response = await fetch('/projects.json'); // Adjust the path as necessary
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        projects = await response.json(); // Parse JSON response
    } catch (error) {
        console.error('Error loading JSON:', error);
    }
}

// Butterfly
// Set inactive 
//butterfly.classList.add('inactive');
// Flutter on hover
signature.addEventListener('mouseover', () => {
    butterfly.classList.add('flutter');
})
signature.addEventListener('mouseout', () => {
    butterfly.classList.remove('flutter');
})

// Code for signature tile change
let currentTile = parseInt(localStorage.getItem('currentTile')) || 0; // Get saved tile index or default to 0

// Set the initial background tile from localStorage
document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);

// Make HTML Visible after JS Loads
document.body.classList.add(page.id);
document.body.classList.add('visible');

signature.addEventListener('click', () => {
    // Change the background tile
    currentTile = (currentTile + 1) % tiles.length; // Cycle to the next tile
    document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);

    // Save the current tile index in localStorage
    localStorage.setItem('currentTile', currentTile);
});

function main() {
    /* CONSTANTS */
    // Pages
    const homePage = document.getElementById('home');
    const portfolioPage = document.getElementById('portfolio');
    const contactPage = document.getElementById('contact');
    const servicesPage = document.getElementById('services');
    console.log("entered main loop");

    attachNAVListeners();

    // Redraw NAV
    navBar.classList.add('none');
    navBar.classList.remove('none');

    if (homePage) {
        // Code for WhatIDo Items
        // Select all items within the itemsContainer
        const items = document.querySelectorAll('.itemsContainer.whatIDo .item');

        // Add click event listener to each item
        items.forEach(item => {
            const hiddenClasses = document.querySelectorAll('.software, .hardware, .network, .hobbyist');

            // click to expand
            item.addEventListener('click', () => {
                // Check if the clicked item already has the 'pressed' class
                const isPressed = item.classList.contains('pressed');

                // Remove 'pressed' class from all items
                items.forEach(i => i.classList.remove('pressed'));
                hiddenClasses.forEach(i => i.classList.add('hidden'));

                // If the clicked item was not pressed, add 'pressed' class
                if (!isPressed) {
                    item.classList.add('pressed');
                }
            });
        });

    };
    if (portfolioPage) {
        // Code for Search Bar Functionality
        // Search-Bar
        const searchInputs = document.querySelectorAll("#search-bar input");
        let currentQuery = "";

        searchInputs.forEach(searchInput => {
            searchInput.addEventListener("change", function () {
                console.log(searchInput.value);
                currentQuery = searchInput.value;
                updateResults();
            })
        })

        // Filter-Bar
        // constants
        const tagsContainer = document.getElementById("tagsContainer");
        const allTag = document.getElementById("all");
        const featuredTag = document.getElementById("featured");
        const tags = ["all", "featured", "research", "software", "hardware", "network", "hobbyist", "automotive", "creative"];
        const currentTags = ["featured"];

        // functions
        function createTagElements() {
            tags.forEach(tag => {
                // tag onclick function
                function tagOnClick (element) {
                    console.log('clicked ' + element.id);
                    if (element.classList.contains("selected")) {
                        element.classList.remove("selected");
                    } else {
                        element.classList.add("selected");
                        if (element.id == "all") {
                            document.querySelectorAll(".tag.selected:not(#all)").forEach(tag => {
                                tag.classList.remove("selected");
                            })
                        }
                        if (element.id == "featured") {
                            document.querySelectorAll(".tag.selected:not(#featured)").forEach(tag => {
                                tag.classList.remove("selected");
                            })
                        }
                    }
                    updateResults();
                }

                // existing tags
                if (tag === "all") {
                    allTag.addEventListener('click', () => tagOnClick(allTag))
                    return; 
                }
                if (tag === "featured") {
                    featuredTag.addEventListener('click', () => tagOnClick(featuredTag))
                    return; 
                }

                const newTagElement = document.createElement("div");
                newTagElement.setAttribute("class", "tag subtext-small");
                newTagElement.setAttribute("id", `${tag}`);
                newTagElement.textContent = tag;
                newTagElement.addEventListener('click', () => tagOnClick(newTagElement))
                tagsContainer.appendChild(newTagElement);
            });
        }

        createTagElements();

        // Search Results
        parseJSON();

        function updateResults() {
            console.log("Updating results...");

            // filters json based on search
            console.log(currentQuery);
            let filteredProjects = projects;
            const normalizedQuery = currentQuery.trim().toLowerCase();
            const searchableKeys = ["title", "description"];
            const searchableArrayKeys = ["tags"];

            filteredProjects = projects.filter(item => {
                // Check string fields
                const stringMatch = searchableKeys.some(key =>
                    item[key]?.toLowerCase().includes(normalizedQuery)
                );
                // Check array fields
                const arrayMatch = searchableArrayKeys.some(key =>
                    item[key]?.some(tag =>
                        tag.toLowerCase().includes(normalizedQuery)
                    )
                );
                return stringMatch || arrayMatch;
            });
            console.log(filteredProjects);

            // Get the selected tags from elements with the class "tag selected"
            let selectedTags = document.querySelectorAll(".tag.selected:not(#all)");
            console.log(selectedTags);

            // Check if any tags are selected
            if (selectedTags.length == 0) {
                allTag.classList.add('selected');
            } else {
                allTag.classList.remove('selected');
            }
            if ([...selectedTags].some(tag => tag.id !== 'featured')) {
                featuredTag.classList.remove('selected');
                selectedTags = document.querySelectorAll(".tag.selected:not(#all)");
            }

            // Convert NodeList to an array of selected tag IDs for easier handling
            const selectedTagIds = Array.from(selectedTags).map(tag => tag.id);

            // Filter the projects based on whether their tags include any of the selected tags
            filteredProjects = filteredProjects.filter(entry => {
                // If the "all" tag is selected, include all projects without filtering
                if (allTag.classList.contains('selected')) {
                    return true;
                }
                // Check if any of the entry's tags match any of the selected tags
                return selectedTagIds.some(tag => entry.tags.includes(tag));
            });

            console.log(filteredProjects);

            const resultsContainer = document.querySelector('.itemsContainer.results-box');

            // Clear any existing items
            resultsContainer.innerHTML = '';

            // Check if filteredProjects is populated before creating items
            if (filteredProjects.length === 0) {
                console.error('No data available to create list items.');
                return;
            }

            // Iterate over the data and create complex list items
            filteredProjects.forEach(project => {
                let listItemHTML = `
                <div class="item" id="">
                    <span class="subheader text bold" id="expName">
                        ${project.title}
                    </span>
                    <div id="expTags">
                        <div class="itemsContainer tagsContainer"></div>
                    </div>
                    <span class="subtext-small text" id="expBlurb">${project.description}</span>
                </div>
                `;

                // Convert the string to an actual HTML element
                const template = document.createElement('div');
                template.innerHTML = listItemHTML.trim();

                // Get the .tagsContainer div inside the created element
                const tagsContainer = template.querySelector('.tagsContainer');

                // Add tags as <span> elements
                project.tags.forEach(tag => {
                    if (tag == "featured") {
                        return;
                    }
                    const tagEl = document.createElement('span');
                    tagEl.classList.add('tag', 'subtext-small');
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                });

                const listItem = template.firstChild; // Get the first actual element
                
                // Hover enlarge and highlight
                listItem.addEventListener('mouseover', () => {
                    listItem.style.backgroundColor = "hsla(0, 0%, 100%, .4)";
                    listItem.style.transform = "scale(1.05)";
                    listItem.style.transition = "transform 0.1s ease-in-out";
                });
                // Mouse out undo
                listItem.addEventListener('mouseout', () => {
                    listItem.style.backgroundColor = "";
                    listItem.style.transform = "scale(1)";
                });
                // Click play content
                listItem.addEventListener('click', () => {
                    const url = project.external_link;
                    if (url) {
                        window.open(url, '_blank');
                    }
                });

                // Append to the results container
                resultsContainer.appendChild(listItem); // Append to the list
            });
        }


        // Call the function to load items
        async function loadData() {
            await parseJSON(); // Wait for parsing to complete
            updateResults(); // Call function to update results or manipulate DOM
        }

        loadData();
    };
    if (servicesPage) {
        // Collapse boxes
        const boxes = document.querySelectorAll('.collapsible');
        boxes.forEach(box => {
            const items = box.querySelector('.expandable');
            box.addEventListener('click', () => {
            const isExpandable = !items.classList.contains('expanded');
            // Collapse all boxes
            boxes.forEach(b => {
                const otherItems = b.querySelector('.expandable');
                otherItems.classList.remove('expanded');
            });
            // If the clicked box was collapsed, expand it
            if (isExpandable) {
                items.classList.add('expanded');
            }
            });
        });
    }
    if (contactPage) {
        // Code for Contact-card Email
        const emailLink = document.getElementById('emailLink');
        const email = "JJLukose55@gmail.com"; // Your email address

        emailLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior

            // check if clipboard is available
            if (navigator.clipboard) {
                // Copy email to clipboard
                navigator.clipboard.writeText(email).then(() => {
                    console.log("Email address copied to clipboard!");
                    // Show a notification here
                    const modal = document.getElementById('contactDialog');
                    modal.showModal();
                    // Close Modal when clicking outside
                    modal.addEventListener("click", e => {
                        const dialogDimensions = modal.getBoundingClientRect()
                        if (
                            e.clientX < dialogDimensions.left ||
                            e.clientX > dialogDimensions.right ||
                            e.clientY < dialogDimensions.top ||
                            e.clientY > dialogDimensions.bottom
                        ) {
                            modal.close();
                        }
                    })
                }).catch(err => {
                    console.error("Failed to copy: ", err);
                    // Show a notification here
                    const modal = document.getElementById('contactDialog');
                    modal.showModal();
                    // Close Modal when clicking outside
                    modal.addEventListener("click", e => {
                        const dialogDimensions = modal.getBoundingClientRect()
                        if (
                            e.clientX < dialogDimensions.left ||
                            e.clientX > dialogDimensions.right ||
                            e.clientY < dialogDimensions.top ||
                            e.clientY > dialogDimensions.bottom
                        ) {
                            modal.close();
                        }
                    })
                });
            } else {
                console.error("Clipboard API is unavailable.");
            }

            // Redirect to the mail client
            //window.location.href = `mailto:${email}`;
        });

    };
}

main();