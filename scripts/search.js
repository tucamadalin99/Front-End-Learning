import { firebaseConfig, login } from "../scripts/auth.js";

const applyState = (data) => {
    const gridContainer = document.querySelector(".grid-container");

    gridContainer.innerHTML = "";
    data.forEach(recipe => {
        const item = document.createElement("div");
        item.className = "recipe-item";

        const img = document.createElement("div");
        img.className = "item-img";
        img.style.backgroundImage = `url(${recipe.imageUrl})`;

        const content = document.createElement("div");
        content.className = "item-content";

        const title = document.createElement("h3");
        title.className = "item-title";
        title.textContent = recipe.name;

        const viewBtn = document.createElement("button");
        viewBtn.className = "view-btn";
        viewBtn.textContent = "view";
        viewBtn.addEventListener("click", () => {
            const queryParam = `?id=${data.indexOf(recipe)}`;
            window.location.href = `./recipe.html` + queryParam;
        })

        item.appendChild(img);
        content.appendChild(title);
        content.appendChild(viewBtn);
        item.appendChild(content);
        gridContainer.appendChild(item);
    })

}

window.onload = () => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    login();
    let apiDataRef = firebase.database().ref(`api/results`);
    let allRecipes = [];
    const categoriesContainer = document.querySelector(".categories-container");
    apiDataRef.on("value", async snapshot => {
        allRecipes = await snapshot.val();
        let categories = [];

        if (allRecipes && allRecipes.length > 0) {
            allRecipes.forEach(result => {
                categories = [...categories, ...result.tags];
            })

            categories = _.uniq(categories);


            if (categories && categories.length > 0) {
                categories.forEach(ctg => {
                    const category = document.createElement("div");
                    category.className = "category";
                    const checkBox = document.createElement("input");
                    checkBox.className = "input-checkbox"
                    checkBox.type = "checkbox";
                    checkBox.id = ctg;
                    checkBox.name = ctg;
                    checkBox.value = ctg;
                    category.appendChild(checkBox);
                    const label = document.createElement("label");
                    label.className = "labels";
                    label.htmlFor = ctg;
                    label.textContent = ctg;
                    category.appendChild(label);
                    categoriesContainer.appendChild(category);
                })
                var queryString = decodeURIComponent(window.location.search);
                let searchedItem = queryString.split("=")[1];
                if (searchedItem) {
                    let searchedCriteria = document.getElementById(searchedItem);
                    searchedCriteria.checked = true;
                    let filteredByRedirect = [];
                    allRecipes.forEach(recipe => {
                        recipe.tags.forEach(tag => {
                            if (tag === searchedItem) {
                                filteredByRedirect.push(recipe);
                            }
                        })
                    })
                    applyState(filteredByRedirect);
                } else {
                    applyState(allRecipes);
                }
            }



            let checkboxes = document.querySelectorAll(".input-checkbox");
            let filters = [];
            let filteredRecipes = [];
            let featuredSwitch = document.getElementById("featured");
            featuredSwitch.addEventListener("click", () => {
                if (featuredSwitch.checked && filters.length > 0) {
                    applyState(filteredRecipes.filter(el => el.featured))
                }
                if (featuredSwitch.checked && filters.length == 0) {
                    applyState(allRecipes.filter(el => el.featured));
                }
                if (!featuredSwitch.checked && filters.length > 0) {
                    applyState(filteredRecipes)
                }
                if (!featuredSwitch.checked && filters.length == 0) {
                    applyState(allRecipes)
                }
            })

            checkboxes.forEach(cb => {
                cb.addEventListener("change", () => {
                    if (cb.checked) {
                        filters.push(cb.value);
                    } else {
                        filters = filters.filter(el => el !== cb.value);
                    }
                    if (filters.length > 0) {
                        filteredRecipes = [];
                        filters.forEach(filter => {
                            allRecipes.forEach(recipe => {
                                recipe.tags.forEach(tag => {
                                    if (tag === filter) {
                                        filteredRecipes.push(recipe);
                                    }
                                })
                            })
                        })
                        filteredRecipes = _.uniq(filteredRecipes);
                        applyState(filteredRecipes);
                    } else {
                        filteredRecipes = [];
                        if (featuredSwitch.checked) {
                            applyState(allRecipes.filter(el => el.featured))
                        } else {
                            applyState(allRecipes);
                        }
                    }
                })
            })
        }

    })
}