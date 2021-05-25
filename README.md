# Recipe-Tutorials
Recap front-end project

## Description
An overall simple web-app made with Vanilla JS, HTML & CSS for reviewing recipes.

## Frontend methodologies used
- Flexbox
- Dynamic & validated generated content
- Responsive web design principles

## Technologies and libraries used
- HTML5
- CSS3
- ES6
- Lodash
- jQuery
- Slick carousel
- Toastr.js
- Firebase

# Overall Structure

## Home Page
![home](https://user-images.githubusercontent.com/50795013/119494255-c50b4d00-bd69-11eb-9ac0-243fee1e6154.png)
The homepage contains a main header present on all the pages, a banner with a featured recipe, a container with the recipe categories present in the db and finally a carousel of recipes from which the user can pick what he wants.

## Recipe Page
![recipe](https://user-images.githubusercontent.com/50795013/119494927-832ed680-bd6a-11eb-9ea8-5e792daeeb3e.png)
The recipe page is opened when the user clicks on a recipe from the carousel present in the main page.
This page contains a main container in which the description,picture and overall grade of the recipe is present.
At the bottom, the same carousel is present except the item that the user currently viewing.
A rating system is implemented in which the user can grade a recipe and leave a comment. The user can delete his comment later on if he decides so.

## Search Page
![search](https://user-images.githubusercontent.com/50795013/119495576-3697cb00-bd6b-11eb-9c0f-4777217c6cfc.png)
The search pages includes a grid of all the recipes present in the database along with some filters for cutting down unwanted results.

## Database
The chosen database for this particular project is Firebase database. A picture of the structure is attached below.
![image](https://user-images.githubusercontent.com/50795013/119494582-23d0c680-bd6a-11eb-8a08-6d1b23a6b85b.png)



