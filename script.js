/*"Шестёрочка" Одна сеть супермаркетов просит вас реализовать кассу. 
Существуют товары, у которых есть артикул и цена (за шт. или за кг.). 
Товар может быть весовым или штучным. Товары хранятся в системе. Покупатель приходит на кассу. 
В первую очередь система предлагает пакет и их количество. Затем кассир вводит артикул и вес/количество товара. 
Если товар не найден, он не пробивается. При пробитии товара указывается стоимость товара и текущая сумма покупки. 
Кассир может отменить тот или иной товар, позиция отменяется целиком. При отмене к артикулу добавляется какой-то признак отмены. 
Необходимо посчитать сумму покупки.*/


function findOnStorage(storage, id)
{
	return storage.find(product => product._id === id);
}


function createOperation(id, name, num, cost, totalCost)
{
	let currentOperation = {_id: id, _name: name, _num: num, _cost: cost, _totalCost: totalCost};
	return currentOperation;
}


function findAndDeletePossition(operations, id)
{
	let indexToRemove = operations.findIndex(operation => operation._id === id);
	
	if (indexToRemove !== -1)
	{
		operations[indexToRemove]._totalCost*=-1;
		alert("Товар был успешно удалён");
		return operations[indexToRemove];
	}
	else
	{
		alert("Товар не был найден в чеке");
		return null;
	}
}


function getOperationInfo(operation)
{
	return "Артикул товара - " + operation._id + ";  Название - " + operation._name + ";  Кол-во (шт/кг) - " + operation._num + ";  Цена за (шт/кг) - " + 
	  parseFloat(operation._cost).toFixed(2) + ";  Стоимость покупки товара - " + parseFloat(operation._totalCost).toFixed(2) + '\r\n';
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


function showOperationsHistory(operations)
{	
	
	let res="";
	
	for (let i = 0; i < operations.length; i++)
	{
		if (operations[i]._totalCost >= 0)
		{
			res+=getOperationInfo(operations[i])+ "\r\n";
		}
	}
	alert(res);
}


function calculatePricePerKilo(weight, price)
{
	return (price*weight).toFixed(2);
}

function getIdToDelete(id) //получаем id без символа возврата
{
	return id.slice(1);
}


function calculatePacketCost(operations)
{
	
	if(confirm("Кассир: Добрый день. Пакет нужен? (да/нет)"))
	{
			
		let currentOperation = makeOperation({_id : "000", _name: "Пакет", _type: "шт", _cost: 5}); //добавляем пакет в чек
		operations.push(currentOperation);	
		return currentOperation._totalCost;
			
	}
	return 0;
}

function makeOperation(product) //совершаем покупку и получаем позицию в чеке
{
	let currentSum = 0, amount;
	
	if (product._type === "вес")
	{
		amount = prompt("Введите вес (в кг)");
		currentSum=parseFloat(calculatePricePerKilo(amount, product._cost));
	}
	else
	{
		amount = prompt("Введите количество");
		currentSum=product._cost*amount;
	}
	
	return createOperation(product._id, product._name, amount, product._cost, currentSum);
}


function makeOrder(storage, operations)
{
	const returnSymb = "-";
	let id = prompt("Введите артикул товара")
	let currentOperation;
	
	
	if (id[0] === returnSymb) //Если артикул начинается с символа отмены
	{
		currentOperation = findAndDeletePossition(operations, getIdToDelete(id)); //находим позицию
	}
	else
	{
		let product = findOnStorage(storage, id); //ищем продукт на складе
			
		if (product !== undefined) //если продукт есть на складе
		{	
			alert("Продукт: " + product._name + "; Цена: " + product._cost);
			currentOperation = makeOperation(product); //то добавляем его в чек
			operations.push(currentOperation);
		}
		else
		{
			alert("Товара нет на складе");
			return null;
		}
	}
	
	return currentOperation;
}


function cashier(storage)
{
	
	let sum = 0, operations = new Array(), currentSum = 0, currentOperation;
	
	currentSum = calculatePacketCost(operations)
	sum+=currentSum;
	
	showReceipt(currentSum, sum);
	
	do //цикл пока покупатель не захочет завершить покупку
	{	
		currentOperation = makeOrder(storage, operations);
		
		if (currentOperation !== null) //проверка на операцию возврата товара (если не нашли товар в чеке)
		{
			currentSum = currentOperation._totalCost;
			sum+=currentSum;
			showReceipt(currentSum, sum);
		}
		
		if (confirm("Хотите увидеть весь чек целиком (да/нет)"))
		{
			showOperationsHistory(operations);
		}
		
	} while(!confirm("Хотите закончить покупку (да/нет)"))
	
	currentSum = 0;
	showReceipt(currentSum, sum);
}



function store()
{
	const storage = [{_id : "001", _name: "Сок", _type: "шт", _cost: 80},
	{_id : "002", _name: "Яблоки", _type: "вес", _cost: 100}, 
	{_id : "003", _name: "Печенье", _type: "шт", _cost: 40}];
	
	cashier(storage);
	
	
}