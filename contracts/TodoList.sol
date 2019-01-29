pragma solidity 0.4.24;

// a TodoList smart contract with the following features:
// a Todo struct for a single Todo item (think about what you could store alongside a string 
// for the item’s description: maybe some metadata like a due date, or who owns the item)
// a container of Todos (an array or mapping)
// a function to add a new Todo
// getters for some variables (get all todos, get a specific property of a single todo)
//
// Update your TodoList smart contract with the following new features:

// add a boolean done property to your Todo struct
// add an address property to your Todo struct to mark the owner
// add a function modifier to restrict write access to some variables 
// (e.g. let only the owner of a todo mark a todo done)

contract TodoList {
  struct Todo {
    address owner;
    string value;
    bool done;
  }

  mapping (uint => Todo) internal todoList;

  uint public todoCount = 0;

  modifier onlyTodoOwner(uint256 todoId) {
    require(todoList[todoCount].owner == msg.sender, "Only Todo owner can call this function.");
    _;
  }

  function addTodo(string memory value) public {
    todoCount++;
    todoList[todoCount].owner = msg.sender;
    todoList[todoCount].value = value;
    todoList[todoCount].done = false;
  }
  
  function setTodoDone(uint256 todoId, bool done) public onlyTodoOwner(todoId) {
    require(todoId <= todoCount, "Todo doesn't exist");

    todoList[todoId].done = done;
  }

  function setTodoValue(uint256 todoId, string memory value) public onlyTodoOwner(todoId) {
    require(todoId <= todoCount, "Todo doesn't exist");

    todoList[todoId].value = value;
  }

  function getTodoOwner(uint256 todoId) public view returns (address) {
    require(todoId <= todoCount, "Todo doesn't exist");

    return todoList[todoId].owner;
  }

  function getTodoValue(uint256 todoId) public view returns (string memory) {
    require(todoId <= todoCount, "Todo doesn't exist");

    return todoList[todoId].value;
  }
  
  function getTodoDone(uint256 todoId) public view returns (bool) {
    require(todoId <= todoCount, "Todo doesn't exist");

    return todoList[todoId].done;
  }
}
