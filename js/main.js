'use strict';

const $ = (selector) => document.querySelector(selector); // I'm not sure if it's a good idea to add it as a global constant
document.addEventListener('DOMContentLoaded', loadData);
window.onunload = saveData;

//"ToDoList" object's constructor
// Methods: adds new "list item" from the Input field to the list;
// removes completed "items" by clicking on "Clear completed" button

class ToDoList {
  constructor(options) {
  this.newToDo = options.newToDo;
  this.list = options.list;
  this.clearButton = options.clear;

  this.newToDo.addEventListener('change', this.addListItem.bind(this));
  this.clearButton.onclick = this.clearCompleted.bind(this);
  }

  addListItem() {
    if (this.newToDo.value != '') {
      const listItem = new ListItem(this.newToDo.value);
      this.list.appendChild(listItem.li);
      this.newToDo.value = '';
      counter.count();
    }
  }

  clearCompleted() {
    const that = this;
    const listItems = this.list.querySelectorAll('li');
    listItems.forEach(function(item) {
      if (item.classList.contains('completed')) {
        that.list.removeChild(item);
      }
    });
  counter.count();
  }
}

const toDoList = new ToDoList({
  newToDo: $('.new-todo'),
  list: $('.todo-list'),
  clear: $('.clear-completed')
});

//"List item" object's constructor
//Methods: removes itself by clicking on "x" button;
//changes "item's" status from active to completed and back by clicking on checkbox;
// edits "list item's" content

class ListItem {
  constructor(options) { 
    this.li = document.createElement('li');
    this.li.innerHTML = '<div class="view"><input class="toggle" type="checkbox"><label></label><button class="destroy"></button></div>';
    this.label = this.li.querySelector('label');
    this.destroyButton = this.li.querySelector('.destroy');
    this.toggler = this.li.querySelector('.toggle');
    this.label.textContent = options;

    this.label.addEventListener('dblclick', this.edit.bind(this));
    this.destroyButton.addEventListener('click', this.deleting.bind(this));
    this.toggler.addEventListener('click', this.toggle.bind(this));
  }

  toggle() {
    this.li.classList.toggle('completed');
    counter.count();
  }

  deleting() {
    this.li.parentElement.removeChild(this.li);
    counter.count();
  }

  edit() {
    const that = this;
    this.li.classList.toggle('editing');
    const input = document.createElement('input');
    this.li.appendChild(input);
    input.classList.add('edit');
    const listStyle = getComputedStyle(this.li.parentElement);
    input.style.width = parseInt(listStyle.width) - 43 + 'px';
    input.value = this.label.innerHTML;
    input.focus();
    input.addEventListener('blur', editingElem);
    input.addEventListener('keypress', editingItem);

    function editingElem() {
      if (input.value == '') {
        that.deleting();
      } else {
        that.label.textContent = input.value;
        that.li.classList.toggle('editing');
        that.li.removeChild(input);
        }
    }

    function editingItem(event) {
      if (event.keyCode === 13) {
        input.blur();
      }
    }
  }
}

//"Counter" object's constructor
//It has 1 method that fulfils several actions:
//checks the total quantity of the items in the list;
//checks the quantity of completed items;
//counts and outputs the quantity of active items;
//hides the ToDoList's interface if there aren't any itmes;
//hides "Clear completed" button if there are no completed items;
//controls ""Select All" button behaviour;
//checks selected filter

class Counter {
  constructor(options) {
    this.list = options.list;
    this.main = options.main;
    this.footer = options.footer;
    this.clearCompleted = options.clearCompleted;
    this.num = options.num;
    this.toDoCount = options.toDoCount;
  }

  count() {
    this.listItemsCounter = this.list.children.length;
    this.listItemsCompleted = this.list.getElementsByClassName('completed').length;
    this.listItemsLeft = this.listItemsCounter - this.listItemsCompleted;
    this.num.textContent = this.listItemsLeft;
    this.selected = $('.selected');
    if (this.listItemsCounter === 0) {
      this.main.classList.add('hidden');
      this.footer.classList.add('hidden');
    } else {
      this.main.classList.remove('hidden');
      this.footer.classList.remove('hidden');
      }
    if (this.listItemsCompleted === 0) {
      this.clearCompleted.classList.add('hidden');
    } else {
      this.clearCompleted.classList.remove('hidden');
      }
    if (this.listItemsLeft === 1) {
      this.toDoCount.lastChild.data = ' дело осталось';
    } else {
      this.toDoCount.lastChild.data = ' дел осталось';
      }
    if (this.listItemsCompleted === this.listItemsCounter) {
      toggleAll.toggler.checked = true;
    } else {
      toggleAll.toggler.checked = false;
      }
    if (this.selected.classList.contains('active')) {
      showActive.set();
    } else if (this.selected.classList.contains('compl')) {
      showCompleted.set();
      } else {
        showAll.set();
        }
  }
}

const counter = new Counter({
  list: $('.todo-list'),
  main: $('.main'),
  footer: $('.footer'),
  clearCompleted: $('.clear-completed'),
  num: $('strong'),
  toDoCount: $('.todo-count')
});

//"Select All button" object's constructor
//Method: Marks all the items in the list as completed and back by clicking on it 

class ToggleAll {
  constructor(options) {
    this.toggler = options.toggler;
    this.list = options.list;

    this.toggler.onclick = this.selectAll.bind(this);
  }

  selectAll() {
    const listItems = this.list.querySelectorAll('li');
    if (this.toggler.checked) {
      listItems.forEach(function(item) {
        item.classList.add('completed');
        item.querySelector('.toggle').checked = true;
      });
    } else {
      listItems.forEach(function(item) {
        item.classList.remove('completed');
        item.querySelector('.toggle').checked = false;
        });
      }
    counter.count();
  }
}

const toggleAll = new ToggleAll({
  toggler: $('.toggle-all'),
  list: $('.todo-list')
});

//Constructor of the class "Filter"
//Method: sets current filter by clicking on the button

class Filter {
  constructor(options) {
    this.filters = document.querySelectorAll('.filter');
	   this.list = $('.todo-list');
	   this.listItems = this.list.querySelectorAll('li');
    this.filter = options.filter;

    this.filter.addEventListener('click', this.set.bind(this));
  }

  setFilter() {
		  this.filters.forEach(function(item) {
      item.classList.remove('selected');
	   });
	   this.filter.classList.add('selected');
    this.listItems = this.list.querySelectorAll('li');
  }
}

class ShowAll extends Filter {

  set() {
    super.setFilter();
    this.listItems.forEach(function(item) {
      item.classList.remove('hidden');
    });
  }
}

const showAll = new ShowAll({filter: $('.all')});

class ShowActive extends Filter {

  set() {
    super.setFilter();
    this.listItems.forEach(function(item) {
      if (item.classList.contains('completed')) {
        item.classList.add('hidden');
      } else {
        item.classList.remove('hidden');
        }
    });
  }
}

const showActive = new ShowActive({filter: $('.active')});

class ShowCompleted extends Filter {

  set() {
    super.setFilter();
    this.listItems.forEach(function(item) {
      if (item.classList.contains('completed')) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
        }
    });
  }
}

const showCompleted = new ShowCompleted({filter: $('.compl')});

//I left it here as it used to be, using ordinary functions for saving/loading data.
//I'm not sure if it's necessary to create objects here.
//The logic of the functions is completely rebuilt though.

function saveData() {
  const saveList = $('.todo-list').innerHTML;
  localStorage.clear();
  localStorage.setItem('list', saveList);
  if ($('.selected').classList.contains('active')) {
    localStorage.setItem('filter', '.active');
  } else if ($('.selected').classList.contains('compl')) {
    localStorage.setItem('filter', '.compl');
    } else {
      localStorage.setItem('filter', '.all');
      }
}

function loadData() {
  const data = localStorage.getItem('list');
  const savedList = document.createElement('ul');
  savedList.innerHTML = data;
  const savedItems = savedList.querySelectorAll('li');
  savedItems.forEach(function(item) {
    toDoList.newToDo.value = item.querySelector('label').innerHTML;
    toDoList.addListItem();
    if (item.classList.contains('completed')) {
      $('.todo-list').lastChild.classList.add('completed');
      $('.todo-list').lastChild.querySelector('.toggle').checked = true;
    }
  });
  const filter = localStorage.getItem('filter');
  $('.all').classList.remove('selected');
  if (filter) {
    $(filter).classList.add('selected');
  } else {
    $('.all').classList.add('selected');
    }
  counter.count();
}