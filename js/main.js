'use strict';

document.addEventListener('DOMContentLoaded', loadData);
window.onunload = saveData;

function ToDoList(options) {                                 // Конструктор объекта "Список"
	this.newToDo = options.newToDo;                          // Методы: добавляет новый "элемент списка" из "Input" в список
	this.list = options.list;                                //         удаляет завершенные "элементы" при клике "Удалить все завершенные"
	this.clearButton = options.clear;
	
	this.newToDo.addEventListener('change', this.addListItem.bind(this));
	this.clearButton.onclick = this.clearCompleted.bind(this);
}

ToDoList.prototype.addListItem = function() {                 
		if (this.newToDo.value != '') {
		    let listItem = new ListItem(this.newToDo.value);
			this.list.appendChild(listItem.li);
			this.newToDo.value = '';
			counter.count();
		}
}

ToDoList.prototype.clearCompleted = function() {
	let listLength = this.list.children.length;
	let listItems = this.list.getElementsByTagName('li');
	for (let i = listLength - 1; i >= 0; i--) {
		if (listItems[i].classList.contains('completed')) {
	       this.list.removeChild(listItems[i]);
		}
	}
	counter.count();                                                      // вызов метода другого объекта в своем. Не уверен, что это правильно.
}                                                                         // Как правильно не понял пока. Не нашел информации. ????????????

let toDoList = new ToDoList({newToDo: document.querySelector('.new-todo'),
                             list: document.querySelector('.todo-list'),
							 clear: document.querySelector('.clear-completed')});

function ListItem(options) {
  this.li = document.createElement('li');
  this.li.innerHTML = '<div class="view"><input class="toggle" type="checkbox"><label></label><button class="destroy"></button></div>';
  this.label = this.li.querySelector('label');
  this.destroyButton = this.li.querySelector('.destroy');                                // Конструктор объекта "элемент списка" (создание нового элемента)
  this.toggler = this.li.querySelector('.toggle');                                       // Методы: самоудаление "элемента списка" при клике по "х"
  this.label.textContent = options;                                                      //         изменение статуса "элемента" на завершенный и назад
                                                                                         //         при клике по "v"
  this.label.addEventListener('dblclick', this.edit.bind(this));                         //         редактирование значения "элемента списка"
  this.destroyButton.addEventListener('click', this.deleting.bind(this));
  this.toggler.addEventListener('click', this.toggle.bind(this));
}

ListItem.prototype.toggle = function() {
	this.li.classList.toggle('completed');
	counter.count();
}

ListItem.prototype.deleting = function() {
	this.li.parentElement.removeChild(this.li);
	counter.count();
}

ListItem.prototype.edit = function() {
	  let that = this;
	  this.li.classList.toggle('editing');
	  let input = document.createElement('input');
	  this.li.appendChild(input);
	  input.classList.add('edit');
	  let listStyle = getComputedStyle(this.li.parentElement);
      input.style.width = parseInt(listStyle.width) - 43 + 'px';
	  input.value = this.label.innerHTML;
	  input.focus();
	  input.addEventListener('blur', editingElem);
	  input.addEventListener('keypress', editingItem);
	  
	  function editingElem()  {
		if (input.value == '') {
		   that.deleting();
		  } else {
		    that.label.textContent = input.value;
			that.li.classList.toggle('editing');
			that.li.removeChild(input);
		      }
	    }
	
	    function editingItem(event)  {
		  if (event.keyCode === 13) {
		      input.blur();
		  }
	    }
}

function Counter(options) {                                                 // Конструктор объекта "Счетчик"
	this.list = options.list;                                               // 1 Метод: проверяет кол-во элементов в списке
	this.main = options.main;                                               //          проверяет кол-во завершенных элементов в списке
	this.footer = options.footer;                                           //          считает и выводит сколько элементов осталось
	this.clearCompleted = options.clearCompleted;                           //          прячет интерфейс списка, если элементов нет
	this.num = options.num;                                                 //          прячет "Удалить завершенные", если завершенных элементов нет
	this.toDoCount = options.toDoCount;                                     //          управляет кнопокой "Выделить все"
}                                                                           //          проверяет установленный фильтр

Counter.prototype.count = function() {
   this.listItemsCounter = this.list.children.length;
   this.listItemsCompleted = this.list.getElementsByClassName('completed').length;
   this.listItemsLeft = this.listItemsCounter - this.listItemsCompleted;
   this.num.textContent = this.listItemsLeft;
   this.selected = document.querySelector('.selected');
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
    }  else {
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

let counter = new Counter({list: document.querySelector('.todo-list'),
                           main: document.querySelector('.main'),
                           footer: document.querySelector('.footer'),
						   clearCompleted: document.querySelector('.clear-completed'),
	                       num: document.querySelector('strong'),
						   toDoCount: document.querySelector('.todo-count')});

function ToggleAll(options) {                                                          // Конструктор объекта "Кнопка выделить все элементы"
	this.toggler = options.toggler;                                                    // Метод: Отмечает все элементы как завершенные и назад при клике
	this.listItems = options.list.getElementsByTagName('li');                          //        по кнопке "Выделить все"
	
	this.toggler.onclick = this.selectAll.bind(this);
}

ToggleAll.prototype.selectAll = function() {
	if (this.toggler.checked) {
	   for (let i = 0; i < this.listItems.length; i++) {
		this.listItems[i].classList.add('completed');
		this.listItems[i].querySelector('.toggle').checked = true;
	   }
	} else {
		for (let i = 0; i < this.listItems.length; i++) {
		this.listItems[i].classList.remove('completed');
		this.listItems[i].querySelector('.toggle').checked = false;
		}
	   }
	counter.count();
}

let toggleAll = new ToggleAll({toggler: document.querySelector('.toggle-all'), list: document.querySelector('.todo-list')});

function Filter() {                                                                      // Конструктор класса "Фильтр"
	this.filters = document.querySelectorAll('.filter');                                 // Метод: устанавливает текущий фильтр при клике на кнопку
	this.list = document.querySelector('.todo-list');
	this.listItems = this.list.getElementsByTagName('li');
}

Filter.prototype.setFilter = function() {
	for (let i = 0; i < this.filters.length; i++) {
		this.filters[i].classList.remove('selected');
	}
	this.filter.classList.add('selected');
}

function ShowAll(options) {                                                              // Конструктор объекта "Показать все" (наследует от класса фильтр)
	Filter.apply(this, arguments);                                                       // Метод: наследуется от класса "фильтр" + отображает список
	this.filter = options.filter;                                                        //        в соответствии с выбранным фильтром
	
	this.filter.addEventListener('click', this.set.bind(this));
}

ShowAll.prototype = Object.create(Filter.prototype);

ShowAll.prototype.set = function() {
	Filter.prototype.setFilter.apply(this);
	for (let i = this.listItems.length - 1; i >= 0; i--) {
	   this.listItems[i].classList.remove('hidden');
    }
}

let showAll = new ShowAll({filter: document.querySelector('.all')});

function ShowActive(options) {                                                     // Конструктор объекта "Показать В процессе" (наследует от класса фильтр)
	Filter.apply(this, arguments);                                                 // Метод: см выше.
	this.filter = options.filter;
	
	this.filter.addEventListener('click', this.set.bind(this));
}

ShowActive.prototype = Object.create(Filter.prototype);

ShowActive.prototype.set = function() {
	Filter.prototype.setFilter.apply(this);
	for (let i = this.listItems.length - 1; i >= 0; i--) {
		if (this.listItems[i].classList.contains('completed')) {
	       this.listItems[i].classList.add('hidden');
		} else {
		     this.listItems[i].classList.remove('hidden');
		    }
	}
}

let showActive = new ShowActive({filter: document.querySelector('.active')});

function ShowCompleted(options) {                                                  // Конструктор объекта "Показать завершенные" (наследует от класса фильтр)
	Filter.apply(this, arguments);                                                 // Метод: см выше
	this.filter = options.filter;
	
	this.filter.addEventListener('click', this.set.bind(this));
}

ShowCompleted.prototype = Object.create(Filter.prototype);

ShowCompleted.prototype.set = function() {
	Filter.prototype.setFilter.apply(this);
	for (let i = this.listItems.length - 1; i >= 0; i--) {
		if (this.listItems[i].classList.contains('completed')) {
	       this.listItems[i].classList.remove('hidden');
		} else {
		     this.listItems[i].classList.add('hidden');
		    }
	}
}

let showCompleted = new ShowCompleted({filter: document.querySelector('.compl')});

function saveData() {                                                                       // Оставил как было раньше. Нет ясности как это обычно делается.
   let listData = document.querySelector('.todo-list').getElementsByTagName('label');       // Можно создать объект, но надо ли?
   let listItems = document.querySelector('.todo-list').getElementsByTagName('li');
   localStorage.clear();
   for (let i = 0; i < listData.length; i++) {
     localStorage.setItem('data' + i, listData[i].textContent);
	 if (listItems[i].classList.contains('completed')) {
	    localStorage.setItem('compl' + i, 1);
	 } else {
		 localStorage.setItem('compl' + i, 0);
	    } 
   }
   if (document.querySelector('.selected').classList.contains('active')) {
	   localStorage.setItem('filter', '.active');
	} else if (document.querySelector('.selected').classList.contains('compl')) {
	       localStorage.setItem('filter', '.compl');
		} else {
			  localStorage.setItem('filter', '.all');
		   }
}

function loadData() {
	let data = [];
	let listItems = document.querySelector('.todo-list').getElementsByTagName('li');
	for (let i = 0; i < ((localStorage.length - 1) / 2); i++) {
     data['data' + i] = localStorage.getItem('data' + i);
	 data['compl' + i] = localStorage.getItem('compl' + i);
	 toDoList.newToDo.value = data['data' + i];
	 toDoList.addListItem();
	 if (data['compl' + i] == 1) {
	    listItems[i].classList.add('completed');
	    listItems[i].querySelector('.toggle').checked = true;
	  }		
	}
	let filter = localStorage.getItem('filter');
	document.querySelector('.all').classList.remove('selected');
    if (filter) {	
	document.querySelector(filter).classList.add('selected'); 
	} else {
		document.querySelector('.all').classList.add('selected');
	    }
	counter.count();
}