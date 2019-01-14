//import modal from './src/js/modal';

let parseJSON = null;


/*const xhr = new XMLHttpRequest();

const parse = () => {
	xhr.onreadystatechange = () => {
		if (xhr.status == 200 && xhr.readyState){

		let resp = xhr.response;
		parseJSON = JSON.parse(resp);
		return parseJSON;
		};
	};


	xhr.open("GET", "tatata2.json", true);
	xhr.send();
};

console.log(parse());
*/

parseJSON = {"cards":[{"col":0,"title":"title0","blocks":[{"blockId":0,"title":0},{"blockId":1,"title":0}]},
{"col":1,"title":"title0","blocks":[{"blockId":2,"title":0}]}]}

function createDate (){
	let date = new Date();
	const dateNow = date.toLocaleDateString();
	const time = date.toLocaleTimeString();
	const dateDefault = dateNow + " " + time;
	return dateDefault;
};

//drag functions
function dragOver(e){
    e.preventDefault();
    return false;
};

function dragStart(e){
   e.dataTransfer.setData("text", this.id)
};

 function drop (e){
	e.preventDefault();
	const data = e.dataTransfer.getData("text");
	this.appendChild(document.getElementById(data));
};

//find max Id in array
function findMaxId(){

	let idArr=[];
	let columnArr = [];


	for (let i = 0; i < parseJSON.cards.length; i++){

		for (let j = 0; j < parseJSON.cards[i].blocks.length; j++){

			idArr.push(parseJSON.cards[i].blocks[j].blockId);

		};
	};

	for (var i = 0; i < parseJSON.cards.length; i++){
		columnArr.push(parseJSON.cards[i]);
	};

	let maxId = idArr.reduce(function(prev, current) {
		if (prev > current){
			return prev;
		} else {
			return current;
	}});

	return +maxId;

};

//add new row 
function addRow(){
	const dateDefault = createDate();
	let title = 'default title'
	let maxId = findMaxId();
	maxId = +maxId + 1;
	let createdCard = createCard(title, dateDefault, maxId);

	let prevRowNumber = document.querySelector('.row').lastChild.getAttribute('data-col');
	prevRowNumber = +prevRowNumber + 1;
	let newRow = createRow(prevRowNumber, title);
	
	//let doneNewRow = newRow.appendChild(createdCard)
	let row = document.querySelector('.row');
	newRow.appendChild(createdCard);
	row.appendChild(newRow);
	const newColumn = {col:prevRowNumber,title: title,blocks:[{blockId:maxId,title:0}]};
	parseJSON.cards.push(newColumn);
	console.log(parseJSON)
	
};

//add new card function
function addCard(e){

	const dateDefault = createDate();
	let maxId = findMaxId();
	maxId += 1;
	let title = prompt('Enter title', 'title')
	let createdCard = createCard(title, dateDefault, maxId);
	e.target.parentNode.parentNode.parentNode.appendChild(createdCard);
	const currentCol = e.target.parentNode.parentNode.parentNode.getAttribute('data-col');
	
	for (let i = 0; i < parseJSON.cards.length; i++){
        const pushCard = {blockId: maxId, title: title};

        if (i == currentCol){
            parseJSON.cards[i].blocks.push(pushCard);
        };
    };
};

//create row
function createRow(col, title){
	let row = document.createElement('div');
	let rowTitle = document.createElement('h3');
	rowTitle.innerHTML = title;
	row.addEventListener('drop', drop);
	row.addEventListener('dragover', dragOver);
	rowTitle.className = 'text-center mt-3';
	row.className = 'col-sm-6 border border-info';
	row.setAttribute('data-col', col);	
	row.appendChild(rowTitle);
	return row;
};


//create card function
function createCard(cardTitle, date, id){
	const card = document.createElement('div');
	card.className = 'card mb-3 mt-3 align-items-center';

	const cardBody = document.createElement('div');
	cardBody.className = 'card-body';

	const heading = document.createElement('h5');
	heading.className = 'card-title';
	heading.innerHTML = cardTitle;

	const divDate = document.createElement('div');
	divDate.id = 'date';

	const paragpaph = document.createElement('p');
	paragpaph.innerHTML = date;

	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'btn btn-primary mr-3 mb-3 mb-md-0';
	btn.setAttribute('data-toggle', 'modal');
	btn.setAttribute('data-target', '#modalCards');
	btn.innerHTML = '...';

	const btnAddRow = document.createElement('button');
	btnAddRow.type = 'button';
	btnAddRow.className = 'btn btn-primary add-row';
	btnAddRow.innerHTML = 'Add row';
	btnAddRow.addEventListener('click', addRow)


	const btnAddCard = document.createElement('button');
	btnAddCard.type = 'button';
	btnAddCard.className = 'btn btn-primary add-card';
	btnAddCard.innerHTML = 'Add new card';
	btnAddCard.addEventListener('click', addCard)


	divDate.appendChild(paragpaph);
	cardBody.appendChild(heading);
	cardBody.appendChild(divDate);
	cardBody.appendChild(btn);
	cardBody.appendChild(btnAddCard);

	card.appendChild(btnAddRow);
	card.appendChild(cardBody);
	card.id = id;
	card.setAttribute('draggable', true)
	card.addEventListener('dragover', dragOver);
	card.addEventListener('dragstart', dragStart);
	return card;
};

//create DomTree
function createDomTree(parseJSON){
	const dateDefault = createDate();
	for (let i = 0; i < parseJSON.cards.length; i++){
		const classRow = document.querySelector('.row')
		//classRow.title = parseJSON.cards[i].title;
		let column = classRow.appendChild(createRow(parseJSON.cards[i].col, parseJSON.cards[i].title));

		for (let j = 0; j < parseJSON.cards[i].blocks.length;j++){
			let newCard = createCard(parseJSON.cards[i].blocks[j].title, dateDefault, parseJSON.cards[i].blocks[j].blockId);
			column.appendChild(newCard);
		};

	};
};

createDomTree(parseJSON);
