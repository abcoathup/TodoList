pragma solidity 0.4.24;

// a TodoList smart contract with the following features:

// a Todo struct for a single Todo item (think about what you could store alongside a string 
// for the item’s description: maybe some metadata like a due date, or who owns the item)
// a container of Todos (an array or mapping)
// a function to add a new Todo
// getters for some variables (get all todos, get a specific property of a single todo)

contract TodoList {
  struct Todo {
    string value;
    bool active;
  }

  mapping (uint => Todo) internal todoList;

  uint public todoCount = 0;

  function addTodo(string memory value) public {
    todoCount++;
    todoList[todoCount].value = value;
    todoList[todoCount].active = true;
  }
  
  function setTodoActive(uint256 todoId, bool active) public {
    require(todoId <= todoCount, "Todo doesn't exist");

    todoList[todoId].active = active;
  }

  function setTodoValue(uint256 todoId, string memory value) public {
    require(todoId <= todoCount, "Todo doesn't exist");

    todoList[todoId].value = value;
  }

  function getTodoValue(uint256 todoId) public view returns (string memory) {
    require(todoId <= todoCount, "Todo doesn't exist");

    return todoList[todoId].value;
  }
  
  function getTodoActive(uint256 todoId) public view returns (bool) {
    require(todoId <= todoCount, "Todo doesn't exist");

    return todoList[todoId].active;
  }
}
