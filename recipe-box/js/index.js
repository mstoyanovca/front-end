"use strict";

var recipes = JSON.parse(localStorage.getItem('_mstoyanovca_recipes')) || [];
if (recipes.length === 0) {
  recipes = [{ "name": "Soup", "ingredients": ["Water", "Meat", "Eggs"] }, { "name": "Pizza", "ingredients": ["Dough", "Pepperoni", "Tomato sauce"] }, { "name": "Steak", "ingredients": ["Steak", "Sauce", " Spices"] }];
  localStorage.setItem('_mstoyanovca_recipes', JSON.stringify(recipes));
}
var Accordion = ReactBootstrap.Accordion;
var Panel = ReactBootstrap.Panel;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;
var HelpBlock = ReactBootstrap.HelpBlock;

// accordion of recipes:
var RecipesAccordion = React.createClass({
  displayName: "RecipesAccordion",

  render: function render() {
    return React.createElement(
      Accordion,
      null,
      this.props.recipes.map(function (recipe, i) {
        return React.createElement(
          Panel,
          { header: React.createElement(
              "span",
              { className: "link" },
              recipe.name
            ), eventKey: i },
          React.createElement(RecipePanel, { recipe: recipe })
        );
      })
    );
  }
});

// content of each panel of the accordion:
var RecipePanel = React.createClass({
  displayName: "RecipePanel",

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h4",
        { className: "text-center" },
        "Ingredients"
      ),
      React.createElement("hr", null),
      React.createElement(
        "ul",
        null,
        this.props.recipe.ingredients.map(function (ingredient) {
          return React.createElement(
            "li",
            null,
            ingredient
          );
        })
      ),
      React.createElement(
        "div",
        { className: "button-wrapper" },
        React.createElement(EditRecipeModal, { recipe: this.props.recipe })
      ),
      React.createElement(
        "div",
        { className: "button-wrapper" },
        React.createElement(DeleteRecipeModal, { recipe: this.props.recipe })
      )
    );
  }
});

// modals:
var AddRecipeModal = React.createClass({
  displayName: "AddRecipeModal",
  getInitialState: function getInitialState() {
    return {
      showModal: false,
      recipe: { name: "", ingredients: [] }
    };
  },
  close: function close() {
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
  },
  save: function save() {
    var name = this.refs.recipeForm.state.name;
    // validation:
    if (name.length === 0 || !/\S+/.test(name)) return;
    var ingredients = this.refs.recipeForm.state.ingredients.split(",");
    // avoid creating an array with a single empty string:
    if (ingredients.length === 1 && !/\S+/.test(ingredients[0])) ingredients = [];
    var recipe = { name: name, ingredients: ingredients };
    var existing = false;
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].name === recipe.name) {
        existing = true;
      }
    }
    if (existing) {
      alert("A recipe with the same name already exists!");
    } else {
      recipes.push(recipe);
      // persist:
      localStorage.setItem('_mstoyanovca_recipes', JSON.stringify(recipes));
      refresh();
      this.close();
    }
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        { bsStyle: "primary", onClick: this.open },
        "Add a Recipe"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Add a Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(RecipeForm, { ref: "recipeForm", recipe: this.state.recipe })
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { bsStyle: "default", onClick: this.close },
            "Cancel"
          ),
          React.createElement(
            Button,
            { bsStyle: "success", onClick: this.save },
            "Save"
          )
        )
      )
    );
  }
});

var EditRecipeModal = React.createClass({
  displayName: "EditRecipeModal",
  getInitialState: function getInitialState() {
    return {
      showModal: false
    };
  },
  close: function close() {
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
  },
  update: function update() {
    var oldName = this.props.recipe.name;
    var name = this.refs.recipeForm.state.name;
    // validation:
    if (name.length === 0 || !/\S+/.test(name)) return;
    var ingredients = this.refs.recipeForm.state.ingredients.split(",");
    // avoid creating an array with a single empty string:
    if (ingredients.length === 1 && !/\S+/.test(ingredients[0])) ingredients = [];
    var recipe = { name: name, ingredients: ingredients };
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].name === oldName) {
        recipes[i] = recipe;
        break;
      }
    }
    // persist:
    localStorage.setItem('_mstoyanovca_recipes', JSON.stringify(recipes));
    refresh();
    this.close();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        { bsStyle: "default", bsSize: "small", onClick: this.open },
        "Edit"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close },
        React.createElement(
          Modal.Header,
          { closeButton: true },
          React.createElement(
            Modal.Title,
            null,
            "Edit Recipe"
          )
        ),
        React.createElement(
          Modal.Body,
          null,
          React.createElement(RecipeForm, { ref: "recipeForm", recipe: this.props.recipe })
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { bsStyle: "default", onClick: this.close },
            "Cancel"
          ),
          React.createElement(
            Button,
            { bsStyle: "success", onClick: this.update },
            "Save"
          )
        )
      )
    );
  }
});

// recipe form, built in into the recipe add/edit modals:
var RecipeForm = React.createClass({
  displayName: "RecipeForm",
  getInitialState: function getInitialState() {
    return {
      name: this.props.recipe.name,
      ingredients: this.props.recipe.ingredients.toString()
    };
  },
  getValidationState: function getValidationState() {
    if (this.state.name.length > 0 && /\S+/.test(this.state.name)) return 'success';else if (length === 0) return 'error';
  },
  handleNameChange: function handleNameChange(e) {
    this.setState({ name: e.target.value });
  },
  handleIngredientsChange: function handleIngredientsChange(e) {
    this.setState({ ingredients: e.target.value });
  },
  render: function render() {
    return React.createElement(
      "form",
      null,
      React.createElement(
        FormGroup,
        { controlId: "name", validationState: this.getValidationState() },
        React.createElement(
          ControlLabel,
          null,
          "Recipe Name"
        ),
        React.createElement(FormControl, { type: "text",
          value: this.state.name,
          placeholder: "Enter recipe name",
          onChange: this.handleNameChange
        }),
        React.createElement(FormControl.Feedback, null),
        React.createElement(
          HelpBlock,
          null,
          "Name can not be empty."
        )
      ),
      React.createElement(
        FormGroup,
        { controlId: "ingredients" },
        React.createElement(
          ControlLabel,
          null,
          "Ingredients"
        ),
        React.createElement(FormControl, { componentClass: "textarea",
          value: this.state.ingredients,
          placeholder: "Enter ingredients, separated by commas",
          onChange: this.handleIngredientsChange
        })
      )
    );
  }
});

var DeleteRecipeModal = React.createClass({
  displayName: "DeleteRecipeModal",
  getInitialState: function getInitialState() {
    return {
      showModal: false
    };
  },
  close: function close() {
    this.setState({ showModal: false });
  },
  open: function open() {
    this.setState({ showModal: true });
  },
  delete: function _delete() {
    for (var i = 0; i < recipes.length; i++) {
      if (recipes[i].name === this.props.recipe.name) {
        recipes.splice(i, 1);
        break;
      }
    }
    // persist:
    localStorage.setItem('_mstoyanovca_recipes', JSON.stringify(recipes));
    refresh();
    this.close();
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Button,
        { bsStyle: "danger", bsSize: "small", onClick: this.open },
        "Delete"
      ),
      React.createElement(
        Modal,
        { show: this.state.showModal, onHide: this.close, bsSize: "small" },
        React.createElement(
          Modal.Header,
          null,
          React.createElement(
            Modal.Title,
            null,
            "Delete this recipe?"
          )
        ),
        React.createElement(
          Modal.Footer,
          null,
          React.createElement(
            Button,
            { bsStyle: "default", bsSize: "small", onClick: this.close },
            "Cancel"
          ),
          React.createElement(
            Button,
            { bsStyle: "danger", bsSize: "small", onClick: this.delete },
            "Delete"
          )
        )
      )
    );
  }
});

// update the screen:
function refresh() {
  ReactDOM.render(React.createElement(
    "div",
    null,
    React.createElement(RecipesAccordion, { recipes: recipes }),
    React.createElement(AddRecipeModal, null)
  ), document.getElementById("body"));
}

refresh();