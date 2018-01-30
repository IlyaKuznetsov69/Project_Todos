'use strict';

let newToDo = document.querySelector('.new-todo');
let toDoList = document.querySelector('.todo-list');
let toggleAll = document.querySelector('.toggle-all');
let listItem = document.createElement('li');
let listItems = toDoList.getElementsByTagName('li');
let listData = toDoList.getElementsByTagName('label');
let listItemsCounter = 0;
let listItemsCompleted = 0;
let listItemsLeft = 0;
let data = {};
let filter; 
listItem.innerHTML = '<div class="view"><input class="toggle" type="checkbox"><label></label><button class="destroy"></button></div>';

document.addEventListener('DOMContentLoaded', loadData);
window.onunload = saveData;
newToDo.addEventListener('change', addListItem);
toggleAll.onclick = selectAll;
document.querySelector('.clear-completed').onclick = removeListItemsCompleted;
document.querySelector('.all').onclick = showAll;
document.querySelector('.active').onclick = showActive;
document.querySelector('.compl').onclick = showCompleted;

function addListItem() {
  if (newToDo.value != '') {
	let li = listItem.cloneNode(true);
    toDoList.appendChild(li);
    let label = li.querySelector('label');
    label.textContent = newToDo.value;
	label.addEventListener('dblclick', edit);
	newToDo.value = '';
	listItemsCounter += 1;
	toggleAll.checked = false;
	changeVisibilityMain();
	setActiveFilter();
	let destroyButton = li.querySelector('.destroy');
	destroyButton.addEventListener('click', deleting);
	li.querySelector('.toggle').addEventListener('click', toggler);
	listItemsLeftCount();
	return listItemsCounter;
	
	function deleting() {
	  if (li.classList.contains('completed')) {
	     listItemsCompleted -= 1;
         changeVisibilityCompleted();		  
	    }
      toDoList.removeChild(li);
	  listItemsCounter -= 1;
	  changeVisibilityMain();
	  listItemsLeftCount();
    }
	
	function edit() {
	  li.classList.toggle('editing');
	  let input = document.createElement('input');
	  li.appendChild(input);
	  input.classList.add('edit');
	  input.value = label.innerHTML;
	  input.focus();
	  input.addEventListener('blur', editingElem);
	  input.addEventListener('keypress', editingItem);
	  
	  function editingElem()  {
		if (input.value == '') {
		   deleting();
		} else {
		    label.textContent = input.value;
			li.classList.toggle('editing');
			li.removeChild(input);
		    }
		  }
	
	    function editingItem(event)  {
		  if (event.keyCode === 13) {
		    if (input.value == '') {
		      input.blur();
		    } else {
			    label.textContent = input.value;
			    li.classList.toggle('editing');
				input.removeEventListener('blur', editingElem);
				input.blur();
			    li.removeChild(input);
		      }
		  }
		  return
	    }
	}
	
	function toggler() {
      li.classList.toggle('completed');
	  if (li.classList.contains('completed')) {
	    listItemsCompleted += 1;
		changeVisibilityCompleted();
	  } else {
		  listItemsCompleted -= 1;
		  changeVisibilityCompleted();
	    }
      if (listItemsCompleted === listItemsCounter) {
           toggleAll.checked = true;
	    } else {
            toggleAll.checked = false;
		    }			
    }
  }
  return
}

function selectAll() {
	if (toggleAll.checked) {
	   for (let i = 0; i < listItems.length; i++) {
		listItems[i].classList.add('completed');
		listItems[i].querySelector('.toggle').checked = true;
	   }
	   listItemsCompleted = listItemsCounter;
	   changeVisibilityCompleted();
	} else {
		for (let i = 0; i < listItems.length; i++) {
		listItems[i].classList.remove('completed');
		listItems[i].querySelector('.toggle').checked = false;
		}
		listItemsCompleted = 0;
	    changeVisibilityCompleted();
	   }
}

function changeVisibilityMain() {
   if (listItemsCounter === 0) {
     document.querySelector('.main').classList.add('hidden');
	 document.querySelector('.footer').classList.add('hidden');
    } else {
       document.querySelector('.main').classList.remove('hidden');
	   document.querySelector('.footer').classList.remove('hidden');
       }
}

function changeVisibilityCompleted() {
   if (listItemsCompleted === 0) {
     document.querySelector('.clear-completed').classList.add('hidden');
    } else {
	    document.querySelector('.clear-completed').classList.remove('hidden');
	  }
	listItemsLeftCount();
	setActiveFilter();
}

function removeListItemsCompleted() {
	let listLength = listItems.length;
	for (let i = listLength - 1; i >= 0; i--) {
		if (listItems[i].classList.contains('completed')) {
	       toDoList.removeChild(listItems[i]);
	       listItemsCounter -= 1;
		}
	}
	listItemsCompleted = 0;
    changeVisibilityCompleted();		  
	changeVisibilityMain();
}
	
function listItemsLeftCount() {
   listItemsLeft = listItemsCounter - listItemsCompleted;
   document.querySelector('strong').textContent = listItemsLeft;
   if (listItemsLeft === 1) {
	   document.querySelector('.todo-count').lastChild.data = ' дело осталось';
   }  else {
         document.querySelector('.todo-count').lastChild.data = ' дел осталось';
        }		 
}

function showActive() {
	for (let i = 0; i < 3; i++) {
		document.querySelectorAll('.filter')[i].classList.remove('selected');
	}
	document.querySelector('.active').classList.add('selected');
	let listLength = listItems.length;
	for (let i = listLength - 1; i >= 0; i--) {
		if (listItems[i].classList.contains('completed')) {
	       listItems[i].classList.add('hidden');
		} else {
		     listItems[i].classList.remove('hidden');
		    }
	}
}

function showCompleted() {
	for (let i = 0; i < 3; i++) {
		document.querySelectorAll('.filter')[i].classList.remove('selected');
	}
	document.querySelector('.compl').classList.add('selected');
	let listLength = listItems.length;
	for (let i = listLength - 1; i >= 0; i--) {
		if (listItems[i].classList.contains('completed')) {
	       listItems[i].classList.remove('hidden');
		} else {
		     listItems[i].classList.add('hidden');
		    }
	}
}

function showAll() {
	for (let i = 0; i < 3; i++) {
		document.querySelectorAll('.filter')[i].classList.remove('selected');
	}
	document.querySelector('.all').classList.add('selected');
	let listLength = listItems.length;
	for (let i = listLength - 1; i >= 0; i--) {
	   listItems[i].classList.remove('hidden');
    }
}

function setActiveFilter() {
	if (document.querySelector('.selected').classList.contains('active')) {
	   showActive();
	} else if (document.querySelector('.selected').classList.contains('compl')) {
	       showCompleted();
		} else {
			  showAll();
		   }
}

function saveData() {
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
	for (let i = 0; i < ((localStorage.length - 1) / 2); i++) {
     data['data' + i] = localStorage.getItem('data' + i);
	 data['compl' + i] = localStorage.getItem('compl' + i);
	 newToDo.value = data['data' + i];
	 addListItem();
	 if (data['compl' + i] == 1) {
	    listItems[i].classList.add('completed');
	    listItems[i].querySelector('.toggle').checked = true;
	    listItemsCompleted += 1;
	    changeVisibilityCompleted();
	  }
     if (listItemsCompleted === listItemsCounter) {
           toggleAll.checked = true;
	    } else {
            toggleAll.checked = false;
		    }		
	}
	filter = localStorage.getItem('filter');
	document.querySelector('.all').classList.remove('selected');
	document.querySelector(filter).classList.add('selected');
	setActiveFilter();
}