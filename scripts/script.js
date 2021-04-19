/*"Шестёрочка" Одна сеть супермаркетов просит вас реализовать кассу. 
Существуют товары, у которых есть артикул и цена (за шт. или за кг.). 
Товар может быть весовым или штучным. Товары хранятся в системе. Покупатель приходит на кассу. 
В первую очередь система предлагает пакет и их количество. Затем кассир вводит артикул и вес/количество товара. 
Если товар не найден, он не пробивается. При пробитии товара указывается стоимость товара и текущая сумма покупки. 
Кассир может отменить тот или иной товар, позиция отменяется целиком. При отмене к артикулу добавляется какой-то признак отмены. 
Необходимо посчитать сумму покупки.*/


//Классы
function Product(id, name, type, cost)
{

	this.id = id;
    this.name = name;
	this.type = type;
	this.cost = cost;

  this.getProductInfo = () =>
  {
    return this.id + '\r\n' + this.name + '\r\n' + this.type + '\r\n' + this.cost;
  }
}
//////

function Operation(id, name, num, cost, totalCost)
{

	this.id = id;
	this.name = name;
	this.num = num;
	this.cost = cost;
    this.totalCost = totalCost;
  
  this.getInfo = () => 
  {
	  return "Артикул товара - " + this.id + ";  Название - " + this.name + ";  Кол-во (шт/кг) - " + this.num + ";  Цена за (шт/кг) - " + 
	  parseFloat(this.cost).toFixed(2) + ";  Стоимость покупки товара - " + parseFloat(this.totalCost).toFixed(2) + '\r\n';
  }

}


//***************************

function makeStorage(n)
{
	const storage = new Array();
	for (let i = 0; i<n; i++)
	{
		id = (prompt("Введите числовой код " + (i+1) + "-го наименования"));
		name = (prompt("Введите название " + (i+1) + "-го наименования"));
		type = (prompt("Введите тип " + (i+1) + "-го наименования (шт или вес)"));
		cost = (prompt("Введите цену " + (i+1) + "-го наименования"));
		
		product = new Product(id, name, type, cost);
	
		storage.push(product);
	}
	return storage;
}

function getFromStorage(storage, id)
{
	for (const product of storage)
	{
		if (product.id === id)
		{
			alert("Название товара - " + product.name);
			return product;
		}
	}
	return null;
}


function showReceipt(currentSum, sum)
{
	if (currentSum == 0)
	{
		alert("Сум: " + sum.toFixed(2));
	}
	else
	{
		alert("Тек: " + currentSum.toFixed(2) + "\r\nИтого: " + sum.toFixed(2));
	}
}


function makeOperation(id, name, num, cost, totalCost)
{
	let currentOperation = new Operation(id, name, num, cost, totalCost);
	return currentOperation;
}


function findAndDeletePossition(operations, id)
{
	console.log(operations);
	for (const operation of operations)
	{
		if (operation.id === id)
		{
			alert("Позиция удалена");
			operation.id = "-";
			
			return operation.totalCost;
		}
	}
	alert("Позиция не найдена");
	return 0;
}


function showOperationsHistory(operations)
{
	
	let res="";
	for (const operation of operations)
	{
		if (operation.id!=="-")
		{
			res+=operation.getInfo()+ "\r\n";
		}
	}
	alert(res);
}


function isActionAccepted(value)
{
	return ["да", "д", "yes", "y"].indexOf(value) > -1;
}


function calculatePricePerKilo(weight, price)
{
	return (price*weight).toFixed(2);
}


function getPacketCost(operations)
{
	const packetPrice = 5;
	const answer = prompt("Кассир: Добрый день. Пакет нужен? (да/нет)");
	
	if(isActionAccepted(answer))
	{
			let num = prompt("Сколько пакетов?");
			let totalCost = num*packetPrice;;
			operations.push(makeOperation(0, "пакет", num, packetPrice, totalCost));
			return totalCost;
	}
	return 0;
}

function makeOrder(product)
{
	let currentSum = 0, amount;
	
	if (product.type == "вес")
	{
		amount = prompt("Введите вес (в кг)");
		currentSum=parseFloat(calculatePricePerKilo(amount, product.cost));
	}
	else if (product.type == "шт")
	{
		amount = prompt("Введите количество");
		currentSum=product.cost*amount;
	}
	
	if (currentSum!=0)
	{
		return makeOperation(product.id, product.name, amount, product.cost, currentSum);
	}
	
	return null;
}

function cashier(storage)
{
	
	let sum = 0, operations = new Array(), currentSum = 0, currentOperation;
	
	sum+=getPacketCost(operations);
	
	showReceipt(currentSum, sum);
	
	let id;
	const returnSymb = "-"; //-001 - отмена покупки
	
	do
	{	
		currentSum = 0;
		id = prompt("Введите артикул товара")
		
		if (id[0] === returnSymb) //Если артикул начинается с символа отмены
		{
			sum-=findAndDeletePossition(operations, id.slice(1));
		}
		else
		{
			let product = getFromStorage(storage, id); //берем продукт со склада
			console.log(product);
			
			if (product !== null)
			{	
				currentOperation = makeOrder(product);
				
				if (currentOperation !== null)
				{
					currentSum = currentOperation.totalCost;
					sum+=currentSum;
					operations.push(currentOperation);
				}
			}
		}
		
		if (isActionAccepted(prompt("Хотите увидеть весь чек целиком (да/нет)")))
		{
			showOperationsHistory(operations);
		}
		showReceipt(currentSum, sum);
		
	} while(!isActionAccepted(prompt("Хотите закончить покупку (да/нет)")))
	
	currentSum = 0;
	showReceipt(currentSum, sum);
}



function store()
{
	let n = prompt("Введите колличество наименований товара");
	
	
	let id,name,type,cost, product;
	
	
	const storage = makeStorage(n);
	
	cashier(storage);
	
	
}