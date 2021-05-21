import initSlick from '../scripts/slickInit.js';
import firebaseConfig from '../scripts/auth.js';

window.onload = () => {
    var queryString = decodeURIComponent(window.location.search);
    let recipeId = queryString.split("=")[1];
    const user = {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password")
    }
    let userCart = {};
    const submitBtn = document.getElementById("submit");
    let userInput = {};
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();


    let apiDataRef = firebase.database().ref(`api/results`);
    let data = [];

    apiDataRef.once('value').then(snapshot => {
        data = snapshot.val();
        //Inserting recipe data into the page
        if (data && data[recipeId]) {
            const recipeContent = document.querySelector(".content");

            const recipeTitle = document.createElement("h1");
            recipeTitle.className = "recipe-title"
            recipeTitle.textContent = data[recipeId].name;
            recipeContent.appendChild(recipeTitle);

            const recipeImg = document.createElement("div");
            recipeImg.className = "recipe-img";
            recipeImg.style.backgroundImage = `url(${data[recipeId].imageUrl})`;
            recipeContent.appendChild(recipeImg);

            const recipeTagsContainer = document.createElement("div");
            recipeTagsContainer.className = "tags-container";
            const leftBar = document.createElement("div");
            leftBar.className = "left-bar";
            const rightBar = document.createElement("div");
            rightBar.className = "right-bar";
            const tags = document.createElement("div");
            tags.className = "tags-all";
            recipeTagsContainer.appendChild(leftBar);
            recipeTagsContainer.appendChild(tags);
            recipeTagsContainer.appendChild(rightBar);
            recipeContent.appendChild(recipeTagsContainer);
            tags.innerHTML += `<span>
                    <img src="../assets/svg/tag.svg" class="tag-svg" alt="Tag icon"/>
                    </span>`;
            data[recipeId].tags.forEach(tag => {
                tags.innerHTML += `<span class="tags">${tag}</span>`;
            })

            const recipeDescription = document.createElement("p");
            recipeDescription.className = "description";
            recipeDescription.textContent = data[recipeId].description;
            recipeContent.appendChild(recipeDescription);

            const carouselWrapper = document.querySelector(".carousel-wrapper");
            let featuredItems = data.filter(item => item.featured);
            const MAX_CAROUSEL_ITEMS = 12;
            const MAX_DESCRIPTION_CHARS = 50;

            if (featuredItems.length > 0) {
                //Removes the already selected item displayed on the page
                featuredItems.splice(recipeId, 1);
                featuredItems = featuredItems.length > MAX_CAROUSEL_ITEMS ?
                    featuredItems.slice(MAX_CAROUSEL_ITEMS) : featuredItems;

                featuredItems.forEach(item => {
                    carouselWrapper.insertAdjacentHTML("afterbegin",
                        `<div class="carousel-col">
                <img class="recipe-img" src="${item.imageUrl}"
                    alt="Recipe picture">
                <div class="tags-carousel">
                </div>
                <h1 class="title-carousel-itm">${item.name}</h1>
                <p class="description">${item.description}</p>
                    </div>`
                    )
                    let carouselColTags = document.querySelector(".tags-carousel");
                    carouselColTags.innerHTML += `<img src="../assets/svg/tag.svg" class="tag-svg" alt="Tag icon" />`;
                    item.tags.forEach(tag => {
                        carouselColTags.innerHTML += `<span class="tags">${tag}</span>`;
                    })
                })
                console.log(data);

                initSlick(carouselWrapper);

            }
        }

    })

    let starsRating = document.querySelectorAll(".star");

    starsRating.forEach(star => {
        star.addEventListener("click", () => {
            userInput.grade = [...starsRating].indexOf(star) + 1;
            starsRating.forEach(star => {
                star.style.backgroundImage = `url("../assets/rating/star-outline.png")`
            })
            for (let i = 0; i <= [...starsRating].indexOf(star); i++) {
                starsRating[i].style.backgroundImage = `url("../assets/rating/star.png")`;
            }
        })
    })

    if (user.password === "user" && user.username === "user" && user.id !== null) {
        const dbRef = firebase.database().ref(`${user.id}`);
        dbRef.on('value', async (snapshot) => {
            userCart = await snapshot.val();
            document.querySelector(".cart-link").childNodes[1].nodeValue =
                `Cart ($${userCart.cartPrice.toFixed(2)})`
            submitBtn.disabled = false;

            submitBtn.addEventListener("click", (e) => {
                e.preventDefault();
                userInput.comment = document.querySelector(".review-input").value;
                if (!userInput.grade) {
                    toastr.error("You must pick a grade between 1 and 5 stars.")
                }
                else if (!userInput.comment) {
                    toastr.error("You have to provide a comment")
                }
                else {
                    userInput.userID = user.id;
                    apiDataRef.child(`${recipeId}/comments`).push(userInput);
                    toastr.success("Your comment was posted!");
                }
            })
        })
    } else {
        console.log("Auth failed, no user in local storage");
    }

    let commentsRef = firebase.database().ref(`api/results/${recipeId}/comments`);

    commentsRef.on("value", async (snapshot) => {
        let reviews = [];

        const commentsContainer = document.querySelector(".comments");
        if (commentsContainer.innerHTML) {
            commentsContainer.innerHTML = "";
        }
        await snapshot.forEach(el => {
            reviews.push(el.val())
        })

        reviews.forEach(review => {
            let newComment = document.createElement("div");
            newComment.className = "comment";
            let content = document.createElement("p");
            content.className = "comment-text";
            content.textContent = review.comment;
            if (review.userID === user.id) {
                let deleteBtn = document.createElement("button");
                deleteBtn.className = "delete-btn";
                deleteBtn.textContent = "x";
                newComment.appendChild(deleteBtn);
            }
            newComment.appendChild(content);
            commentsContainer.appendChild(newComment);
        })
    })

}
