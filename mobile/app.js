// Style Variables (Used for dynamic theming)
const tiles = ['--tile1', '--tile2', '--tile3']; 
const signature = document.getElementById('signature');

// Code for signature tile change
let currentTile = parseInt(localStorage.getItem('currentTile')) || 0; // Get saved tile index or default to 0
// Set the initial background tile from localStorage
document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);

signature.addEventListener('click', () => {
    // Change the background tile
    currentTile = (currentTile + 1) % tiles.length; // Cycle to the next tile
    document.documentElement.style.setProperty('--bgTile', `var(${tiles[currentTile]})`);
    // Save the current tile index in localStorage
    localStorage.setItem('currentTile', currentTile);
});