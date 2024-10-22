// SPA Dynamic Page Loader
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script is running");
    let pageElement = document.querySelector(".page");

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
                pageElement.innerHTML = newPageContent.innerHTML;
                main();
                attachListeners();
            } else {
                console.error('No element with class "page" found in the fetched HTML.');
            }
        })
        .catch(error => {
            console.error('Failed to fetch page:', error);
        });

    }

    function attachListeners() {
        const navButtons = document.querySelectorAll("#nav-bar .btnGroup");
        navButtons.forEach(navButton => {
            navButton.addEventListener('click', function(event) {
                event.preventDefault();
                if (navButton.classList.contains('home') && pageElement.id != "home") {
                    pageElement.id = "home";
                    updatePageHTML("/pages/home.html");
                } else if (navButton.classList.contains('work') && pageElement.id != "work") {
                    pageElement.id = "work";
                    updatePageHTML("/pages/work.html");
                } else if (navButton.classList.contains('contact') && pageElement.id != "contact") {
                    pageElement.id = "contact";
                    updatePageHTML("/pages/contact.html");
                }
                console.log(`navigated to ${pageElement.id}`);
            });
        });
    }

    pageElement.id = "home";
    updatePageHTML("/pages/home.html");
});

function main(){
    // Persistent Listeners. These functions are not page specific.

    // Parse project.json
    let projects = []; // Variable to store the parsed JSON data

    async function parseJSON() {        
        try {
            const response = await fetch('/../projects.json'); // Adjust the path as necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            projects = await response.json(); // Parse JSON response
        } catch (error) {
            console.error('Error loading JSON:', error);
        }
    }

    // Code for signature tile change
    const signature = document.getElementById('signature');
    const tiles = ['--tile1', '--tile2', '--tile3']; // Custom property names
    let currentTile = parseInt(localStorage.getItem('currentTile')) || 0; // Get saved tile index or default to 0

    // Set the initial background tile from localStorage
    document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);

    // Make HTML Visible after JS Loads
    document.body.classList.add('visible');

    signature.addEventListener('click', () => {
        // Change the background tile
        currentTile = (currentTile + 1) % tiles.length; // Cycle to the next tile
        document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);

        // Save the current tile index in localStorage
        localStorage.setItem('currentTile', currentTile);
    });

    // Code for updating professional vs personal theme
    const themes = ['pro', 'per'];
    let currentTheme = parseInt(localStorage.getItem('currentTheme')) || 0;

    // Function to apply the saved theme globally
    function applyTheme(index) {
        let root = document.documentElement;

        root.classList.remove(`${themes[(index + 1) % themes.length]}`);
        root.classList.add(`${themes[index]}`);

        let hidden = document.querySelectorAll(`.${themes[(index + 1) % themes.length]}`);
        let shown = document.querySelectorAll(`.${themes[index]}`);

        hidden.forEach(element => {
            element.classList.add('hidden')
        });

        shown.forEach(element => {
            element.classList.remove('hidden')
        });

        // Make the page content visible after JS loads
        document.body.classList.add('visible');
    }

    // Apply the saved theme on every page load
    applyTheme(currentTheme);


    // Page specific EventListener Generation
    const homePage = document.getElementById('home');
    const workPage = document.getElementById('work');
    const contactPage = document.getElementById('contact');

    if (homePage) {
        // Code for WhatIDo Items
        // Select all items within the itemsContainer
        const items = document.querySelectorAll('.itemsContainer.whatIDo .item');
        const subsections = document.querySelectorAll('.subsection');

        // Add click event listener to each item
        items.forEach(item => {
            const hiddenClasses = document.querySelectorAll('.software, .hardware, .network, .hobbyist');
            const currentShownCLass = document.querySelectorAll(`.${item.id}`);

            item.addEventListener('click', () => {
                // Check if the clicked item already has the 'pressed' class
                const isPressed = item.classList.contains('pressed');

                // Remove 'pressed' class from all items
                items.forEach(i => i.classList.remove('pressed'));
                // Hide subsections
                subsections.forEach(i => i.classList.add('hidden'));

                hiddenClasses.forEach(i => i.classList.add('hidden'));

                // If the clicked item was not pressed, add 'pressed' class
                if (!isPressed) {
                    item.classList.add('pressed');
                    // Show subsections
                    subsections.forEach(i => i.classList.remove('hidden'));

                    currentShownCLass.forEach(i => i.classList.remove('hidden'));
                }
            });
        });

    };
    if (workPage) {
        // Code for P-Theme Buttons
        const themeButtons = document.querySelectorAll('#ptheme-bar .btnGroup');

        // Clear all pressed states (defaults to none pressed)
        themeButtons.forEach(theme => theme.classList.remove('pressed'));

        // Apply 'pressed' class to the corresponding button based on `currentTheme`
        let currentTheme = parseInt(localStorage.getItem('currentTheme')) || 0;
        if (themeButtons[currentTheme]) {
            themeButtons[currentTheme].classList.add('pressed');
        }

        // Add click event listener to each theme button
        themeButtons.forEach((theme, index) => {
            theme.addEventListener('click', () => {
                // Remove 'pressed' class from all themes
                themeButtons.forEach(i => i.classList.remove('pressed'));

                // Add 'pressed' class to the clicked theme
                theme.classList.add('pressed');

                // Update the currentTheme and apply the theme
                localStorage.setItem('currentTheme', index);
                currentTheme = parseInt(localStorage.getItem('currentTheme')) || 0;
                applyTheme(currentTheme);
                // Update Tags
                tags.forEach(tag => {
                    const currentTagElement = document.getElementById(`${tag}`);
                    updateTagContent(currentTagElement);
                })
                // Update Results 
                updateResults();
                

            });
        });

        // Code for Search Bar Functionality
        // Search-Bar
        // Filter-Box
        const filterBox = document.getElementById("filter-box");
        const filterBar = document.getElementById("filter-bar");

        filterBox.addEventListener('click', () => {
            const isPressed = filterBox.classList.contains("pressed");

            if (isPressed) {
                filterBox.classList.remove("pressed");
                filterBar.classList.add("hidden");
                filterBar.parentElement.style.gridTemplateAreas = "'one one two' 'four four four'";
            }
            else {
                filterBox.classList.add("pressed");
                filterBar.classList.remove("hidden");
                filterBar.parentElement.style.gridTemplateAreas = "'one one two' 'three three three' 'four four four'";
            }
        })
        // Filter-Bar
        // constants
        const tagsContainer = document.getElementById("tagsContainer");
        const tags = ["all", "Pro", "per", "software", "hardware", "network", "hobbyist", "automotive", "creative"];
        const currentTags = ["all"];

        // functions
        function flipCase(word) {
            const isCapitalized = word.charAt(0) == word.charAt(0).toUpperCase();
            if (isCapitalized) {
                return word.charAt(0).toLowerCase() + word.slice(1);
            }
            else {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
        }

        function updateTagContent(tagElement) {
            if (tagElement.id != "Pro" && tagElement.id != "per") {
                if (currentTheme) {
                    tagElement.textContent = `${tagElement.id}`;
                }
                else {
                    tagElement.textContent = `${flipCase(tagElement.id)}`;
                }
            } else {
                tagElement.textContent = `${tagElement.id}`
            };
        };

        function createTagElements() {
            tags.forEach(tag => {
                const newTagElement = document.createElement("div");
                newTagElement.setAttribute("class", "tag");
                newTagElement.setAttribute("id", `${tag}`);
                
                tagsContainer.appendChild(newTagElement);

                updateTagContent(newTagElement);
            });
        }
        
        createTagElements();

        // Search Results
        parseJSON();
        
        function updateResults() {
            console.log("Updating results...");
        
            const resultsContainer = document.querySelector('.itemsContainer.results-box');
        
            // Clear any existing items
            resultsContainer.innerHTML = '';
        
            // Check if projects is populated before creating items
            if (projects.length === 0) {
                console.error('No data available to create list items.');
                return;
            }
        
            // Iterate over the data and create complex list items
            projects.forEach(project => {
                let listItemHTML = `
                <div class="item" id="">
                    <div class="image results-box shadowed_box" id="expImage"></div>
                    <span class="subheader text pro" id="expName">
                        ${project.title}
                    </span>
                    <div id="expTags">
                        <div class="itemsContainer tagsContainer">
                            <span class="subtext text pro tag" id="expStatus">${project.status}</span>
                            <span class="subtext text pro tag" id="expHours">${project.hours}</span>
                            <span class="subtext text pro tag" id="expDate">${project.date}</span>
                        </div>
                        <div class="itemsContainer tagsContainer hidden">
                            <span class="subtext-small text pro tag" id="">tag</span>
                            <span class="subtext-small text pro tag" id="">tag</span>
                            <span class="subtext-small text pro tag" id="">tag</span>
                        </div>
                    </div>
                    <span class="subtext-small text pro" id="expBlurb">${project.description}</span>
                </div>
                `;

                // Optionally modify for current theme
                if (currentTheme) {
                    listItemHTML = `
                        <div class="item" id="">
                            <div class="image results-box shadowed_box" id="expImage"></div>
                            <span class="subheader text per" id="expName">
                                ${flipCase(project.title)}
                            </span>
                            <div id="expTags">
                                <div class="itemsContainer tagsContainer">
                                    <span class="subtext text per tag" id="expStatus">${flipCase(project.status)}</span>
                                    <span class="subtext text per tag" id="expHours">${flipCase(project.hours)}</span>
                                    <span class="subtext text per tag" id="expDate">${flipCase(project.date)}</span>
                                </div>
                                <div class="itemsContainer tagsContainer hidden">
                                    <span class="subtext-small text per tag" id="">tag</span>
                                    <span class="subtext-small text per tag" id="">tag</span>
                                    <span class="subtext-small text per tag" id="">tag</span>
                                </div>
                            </div>
                            <span class="subtext-small text per" id="expBlurb">${flipCase(project.description)}</span>
                        </div>
                        `;
                };
        
                resultsContainer.innerHTML += listItemHTML; // Append to the list
            });
        }
        
        
        // Call the function to load items
        async function loadData() {
            await parseJSON(); // Wait for parsing to complete
            updateResults(); // Call function to update results or manipulate DOM
        }

        loadData();
    };
    if (contactPage) {
        // Code for Contact-card Email
        const emailLink = document.getElementById('emailLink');
        const email = "JJLukose55@gmail.com"; // Your email address

        emailLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior

            // Copy email to clipboard
            navigator.clipboard.writeText(email).then(() => {
                console.log("Email address copied to clipboard!");
                // Optionally show a notification here
            }).catch(err => {
                console.error("Failed to copy: ", err);
            });

            // Redirect to the mail client
            //window.location.href = `mailto:${email}`;
        });

    };
}