const menuIcon = document.querySelector('.ThreeLineBar img'); // Select the image inside
const sideBar = document.querySelector('.sideBar');

// Ensure sidebar starts hidden
// sideBar.style.display = 'none';

menuIcon.addEventListener('click', (e) => {
    // Toggle sidebar visibility
    sideBar.style.right = 0;
    e.stopPropagation();
});

document.body.addEventListener('click', (e) => {
    if(!e.target.classList.contains('sideBar')){
        sideBar.style.right = '-150px';
    }
});





// menuIcon.addEventListener('click', (e) => {
//     // Toggle sidebar visibility
//     if (sideBar.style.display === 'none') {
//         sideBar.style.display = 'block';
//     } else {
//         sideBar.style.display = 'none';
//     }

//     e.stopPropagation();
// });

// document.body.addEventListener('click', (e) => {
//     if(!e.target.classList.contains('sideBar')){
//         sideBar.style.display = 'none';
//     }
// });