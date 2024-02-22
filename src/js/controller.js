import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import ResultsView from './views/ResultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update Resulte View to Mark Select Search Result
    ResultsView.update(model.getSearchResultsPage());

    // 1) update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) loading recipe
    await model.loadRecipe(id);

    // 3) rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResualts = async function () {
  try {
    ResultsView.renderSpinner();
    // 1)get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load search resualts
    await model.loadSearchResults(query);

    // 3) Render resualts
    //ResultsView.render(model.state.search.results); ALL results
    ResultsView.render(model.getSearchResultsPage());

    // 4) render the initioal pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render New resualts

  //ResultsView.render(model.state.search.results); ALL results
  ResultsView.render(model.getSearchResultsPage(goToPage));

  // 4) render the New pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update recipe servings ( in the state )
  model.updateServings(newServings);

  //updating the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recpie view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // upload the new data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recpie
    recipeView.render(model.state.recipe);

    // display success message
    addRecipeView.renderMessage();

    //render bookmark view
    recipeView.render(model.state.recipe);

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change id i url
    window.history.pushState(null, '', `${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResualts);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addhandlerUpload(controlAddRecipe);
  console.log('welcome');
};

init();
