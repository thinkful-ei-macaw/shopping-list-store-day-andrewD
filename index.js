const store = {
  items: [
    { id: cuid(), name: 'apples', checked: false, edit: false },
    { id: cuid(), name: 'oranges', checked: false, edit: false },
    { id: cuid(), name: 'milk', checked: true, edit: false },
    { id: cuid(), name: 'bread', checked: false, edit: false }
  ],
  hideCheckedItems: false
};

const generateItemElement = function (item) {
  let itemTitle = `<span class='shopping-item shopping-item__checked'>${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
    <span class='shopping-item'>${item.name}</span>
    `;
  }

  // Updating the DOM when edit is clicked

  let itemEdit = `<span class='shopping-item'>
  <input type="text" name="shopping-list-edit" class="js-shopping-list-edit" value="${item.name}">`;

  if(item.edit) {
    itemTitle = itemEdit;
  }


  return `
    <li class='js-item-element' data-item-id='${item.id}'>
      ${itemTitle}
      <div class='shopping-item-controls'>
        <button class='shopping-item-toggle js-item-toggle'>
          <span class='button-label'>check</span>
        </button>
        <button class='shopping-item-delete js-item-delete'>
          <span class='button-label'>delete</span>
        </button>

        <button class='shopping-item-edit  js-item-edit'>
          <span class='button-label'>edit</span>
        </button>
      </div>
    </li>`;
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  
  return items.join('');
};

/**
 * Render the shopping list in the DOM
 */
const render = function () {
  // Set up a copy of the store's items in a local 
  // variable 'items' that we will reassign to a new
  // version if any filtering of the list occurs.
  let items = [...store.items];
  // If the `hideCheckedItems` property is true, 
  // then we want to reassign filteredItems to a 
  // version where ONLY items with a "checked" 
  // property of false are included.
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }

  /**
   * At this point, all filtering work has been 
   * done (or not done, if that's the current settings), 
   * so we send our 'items' into our HTML generation function
   */
  const shoppingListItemsString = generateShoppingItemsString(items);

  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const addItemToShoppingList = function (itemName) {
  store.items.push({ id: cuid(), name: itemName, checked: false });
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    render();
  });
};

const toggleCheckedForListItem = function (id) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.checked = !foundItem.checked;
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    toggleCheckedForListItem(id);
    render();
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

/**
 * Responsible for deleting a list item.
 * @param {string} id 
 */
const deleteListItem = function (id) {
  // As with 'addItemToShoppingLIst', this 
  // function also has the side effect of
  // mutating the global store value.
  //
  // First we find the index of the item with 
  // the specified id using the native
  // Array.prototype.findIndex() method. 
  const index = store.items.findIndex(item => item.id === id);
  // Then we call `.splice` at the index of 
  // the list item we want to remove, with 
  // a removeCount of 1.
  store.items.splice(index, 1);
};

const handleDeleteItemClicked = function () {
  // Like in `handleItemCheckClicked`, 
  // we use event delegation.
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    // Delete the item.
    deleteListItem(id);
    // Render the updated shopping list.
    render();
  });
};

// Generate an input in place of the ${itemTitle} within the rendered html(maybe with a submit next to it?)
const toggleEditProperty = function (id) {
  // find index of item.id in items array
  const editableItem = store.items.find(item => item.id === id);
  editableItem.edit = !editableItem.edit;
};

const handleEditItemClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    // Get the index of the item in store.items.
    const id = getItemIdFromElement(event.currentTarget);
    console.log(id);
    
    toggleEditProperty(id);
    render();
    // Grab the value from the input and assign it as that item's name in the store

  });
};

/**
 * Toggles the store.hideCheckedItems property
 */
const toggleCheckedItemsFilter = function () {
  store.hideCheckedItems = !store.hideCheckedItems;
};

/**
 * Places an event listener on the checkbox 
 * for hiding completed items.
 */
const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    toggleCheckedItemsFilter();
    render();
  });
};

const updateItemAfterEdit = function (id, newName) {
  const foundItem = store.items.find(item => item.id === id);
  foundItem.name = newName;
};

const handleEditItemSubmit = function () {
  $('.js-shopping-list').on('keypress', '.js-shopping-list-edit', event => {
    if(event.which === 13) {
      event.preventDefault();
      const id = getItemIdFromElement(event.currentTarget);
      const newItemName = $('.js-shopping-list-edit').val();
      updateItemAfterEdit(id, newItemName);
      
      toggleEditProperty(id);
      render();
      
    }
  });
};

const handleShoppingList = function () {
  render();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleFilterClick();
  handleEditItemClicked();
  handleEditItemSubmit();
};

// when the page loads, call `handleShoppingList`
$(handleShoppingList);