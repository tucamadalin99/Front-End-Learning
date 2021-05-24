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
    apiDataRef.on("value", async snapshot => {
        allRecipes = await snapshot.val();
        let categories = [];

        if (allRecipes && allRecipes.length > 0) {
            allRecipes.forEach(result => {
                categories = [...categories, ...result.tags];
            })

            categories = _.uniq(categories);

            const categoriesContainer = document.querySelector(".categories-container");

            if (categories && categories.length > 0) {
                categories.forEach(ctg => {
                    const category = document.createElement("div");
                    category.className = "category";
                    const checkBox = document.createElement("input")
                    checkBox.type = "checkbox";
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
            }

            applyState(allRecipes);

            let featuredSwitch = document.getElementById("featured");
            featuredSwitch.addEventListener("click", () => {
                if (featuredSwitch.checked) {
                    applyState(allRecipes.filter(el => el.featured));
                }
                else {
                    applyState(allRecipes)
                }
            })
        }

    })
}