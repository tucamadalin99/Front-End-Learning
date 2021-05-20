var firebaseConfig = {
    apiKey: "AIzaSyDAURzkKmtpLsBGNYYt1Sj6-pTmk7lh6Wg",
    authDomain: "ibm-frontend.firebaseapp.com",
    databaseURL: "https://ibm-frontend-default-rtdb.firebaseio.com",
    projectId: "ibm-frontend",
    storageBucket: "ibm-frontend.appspot.com",
    messagingSenderId: "185203005676",
    appId: "1:185203005676:web:b77b0a61affd56af9c6dc9",
    measurementId: "G-0LV3RBN6J8"
};
import initSlick from './slickInit.js';

const checkImageExists = (imageUrl, callBack) => {
    var imageData = new Image();
    imageData.onload = () => {
        callBack(true);
    };
    imageData.onerror = () => {
        callBack(false);
    };
    imageData.src = imageUrl;
}

window.onload = () => {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    const user = {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password")
    }
    let userCart = {};
    if (user.password === "user" && user.username === "user" && user.id !== null) {
        console.log(user);
        const dbRef = firebase.database().ref(`${user.id}`);
        dbRef.on('value', async (snapshot) => {
            userCart = await snapshot.val();
            document.querySelector(".cart-link").childNodes[1].nodeValue = `Cart ($${userCart.cartPrice.toFixed(2)})`
        })
    } else {
        console.log("Auth failed, no user in local storage");
    }

    let apiDataRef = firebase.database().ref("api");
    let data = [];
    let bannerPic = document.querySelector(".banner");
    let tagsContainer = document.querySelector(".tags-container");
    let recipeContainer = document.querySelector(".recipe-content");
    let categoriesContainer = document.querySelector(".cards-container")
    //Selects data from firebase and adds the html elements accordingly
    apiDataRef.on('value', async (snapshot) => {
        data = await snapshot.val();

        if (
            data
            && data.results
            && data.results[0]
        ) {

            if (data.results[0].imageUrl) {
                bannerPic.style.backgroundImage = `url(${data.results[0].imageUrl})`;
            } else {
                console.log("No data is present in db for imageUrl.");
            }

            if (tagsContainer) {

                if (
                    data.results[0].tags
                    && data.results[0].tags.length > 0
                ) {
                    tagsContainer.innerHTML =
                        `<span>
                    <img src="assets/svg/tag.svg" class="tag-svg" alt="Tag icon"/>
                    </span>`;
                    data.results[0].tags.forEach(tag => {
                        if (tag) {
                            tagsContainer.innerHTML += `<span class="tags">${tag}</span>`;
                        }
                    })
                }

            } else {
                console.log("The recipeContent container had an error.");
            }

            if (data.results[0].name
                && tagsContainer) {

                tagsContainer.insertAdjacentHTML("afterend", `<h1 class="title">${data.results[0].name}</h1>`);

            }
            if (data.results[0].description
                && recipeContainer) {

                recipeContainer.insertAdjacentHTML("beforeend",
                    `<p class="description">${data.results[0].description}</p>`
                );
            }
        }
        let categories = [];
        data.results.forEach(result => {
            categories = [...categories, ...result.tags];
        })

        categories = _.uniq(categories);
        if (categories.length > 0) {
            categoriesContainer.insertAdjacentHTML('afterbegin',
                `<div class="row" id="row"></div>`
            );
            let row = document.getElementById(`row`);
            categories.forEach(el => {
                checkImageExists(`./assets/categories/${el}.png`, (existsImage) => {
                    if (existsImage == true) {
                        row.insertAdjacentHTML('afterbegin',
                            `<div class="categories">
                            <img class="category-img" src="./assets/categories/${el}.png" alt="${el} Image">
                            <h3 class="category-title">${el}</h3>
                            </div>`
                        );
                    }
                    else {
                        row.insertAdjacentHTML('afterbegin',
                            `<div class="categories">
                            <div class="acronym">${el[0]}</div>
                            <h3 class="category-title">${el}</h3>
                            </div>`
                        );
                    }
                });
            })
        }

        //Pushes a maximum of the first 12 featured=true items into the carousel-wrapper
        let carouselWrapper = document.querySelector(".carousel-wrapper");
        const featuredItems = data.results.filter(item => item.featured);
        const MAX_CAROUSEL_ITEMS = 12;

        if (featuredItems.length > 0) {
            let currentItemsCount = 0;
            featuredItems.forEach(item => {
                if (currentItemsCount <= MAX_CAROUSEL_ITEMS) {
                    carouselWrapper.insertAdjacentHTML("afterbegin",
                        `<div class="carousel-col">
                <img class="recipe-img" src="${item.imageUrl}"
                    alt="Recipe picture">
                <div class="tags-container tags-carousel">
                </div>
                <h1 class="title-carousel-itm">${item.name}</h1>
                <p class="description">${item.description}</p>
                    </div>`
                    )
                    let carouselColTags = document.querySelector(".tags-carousel");
                    carouselColTags.innerHTML += `<img src="assets/svg/tag.svg" class="tag-svg" alt="Tag icon" />`;
                    item.tags.forEach(tag => {
                        carouselColTags.innerHTML += `<span class="tags">${tag}</span>`;
                    })
                    currentItemsCount++;

                }
            })
            //Imported function initializing slick-carousel
            initSlick();
        }

    })
}