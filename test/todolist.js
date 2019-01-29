const TodoList = require('Embark/contracts/TodoList');

const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');

let accounts;
let TodoListInstance;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "TodoList": {
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("TodoList", function () {
  beforeEach(async function() {
    TodoListInstance = await TodoList.deploy().send();
  });

  it("should have a todo count of 0", async function() {
    let count = await TodoListInstance.methods.todoCount().call();
    assert.ok(parseInt(count, 10) == 0);
  })

  it("should have a todo count of 1", async function() {
    await TodoListInstance.methods.addTodo("Test").send();

    let count = await TodoListInstance.methods.todoCount().call();
    assert.strictEqual(parseInt(count, 10), 1);
  })

  it("should have a todo count of 10", async function() {
    for (var i = 0; i < 10; i++) {
      await TodoListInstance.methods.addTodo("Test").send();
    }
    
    let count = await TodoListInstance.methods.todoCount().call();
    assert.strictEqual(parseInt(count, 10), 10);
  })

  it("should get a todo value", async function() {
    let value = "Test";
    
    await TodoListInstance.methods.addTodo(value).send();

    let _value = await TodoListInstance.methods.getTodoValue(1).call();
    assert.strictEqual(value, _value);
  })

  it("should get a todo done", async function() {
    await TodoListInstance.methods.addTodo("Test").send();

    let _done = await TodoListInstance.methods.getTodoDone(1).call();
    assert.strictEqual(false, _done);
  })

  it("should update a todo value when owner", async function() {
    let value = "Update";
    
    await TodoListInstance.methods.addTodo("Test").send();
    await TodoListInstance.methods.setTodoValue(1, value).send();

    let _value = await TodoListInstance.methods.getTodoValue(1).call();
    assert.strictEqual(value, _value);
  })

  it("should set a todo done to true when owner", async function() {
    await TodoListInstance.methods.addTodo("Test").send();
    await TodoListInstance.methods.setTodoDone(1, true).send();

    let _done = await TodoListInstance.methods.getTodoDone(1).call();
    assert.strictEqual(true, _done);
  })

  it("should set a todo done to false when owner", async function() {
    await TodoListInstance.methods.addTodo("Test").send();
    await TodoListInstance.methods.setTodoDone(1, true).send();
    await TodoListInstance.methods.setTodoDone(1, false).send();

    let _active = await TodoListInstance.methods.getTodoDone(1).call();
    assert.strictEqual(false, _active);
  })

  it("should fail to get a todo value for a todo that doesn't exist", async function() {
    await TodoListInstance.methods.addTodo("Test").send();

    await shouldFail.reverting(TodoListInstance.methods.getTodoValue(2).call());
  })

  it("should fail to get a todo done for a todo that doesn't exist", async function() {
    await TodoListInstance.methods.addTodo("Test").send();

    await shouldFail.reverting(TodoListInstance.methods.getTodoDone(2).call());
  })

  it("should fail to update a todo value for a todo that doesn't exist", async function() {
    await shouldFail.reverting(TodoListInstance.methods.setTodoValue(1, "Update").send());
  })

  it("should fail to update a todo done for a todo that doesn't exist", async function() {
    await shouldFail.reverting(TodoListInstance.methods.setTodoDone(1, true).send());
  })

  it("should fail to update a todo value when not owner", async function() {
    let value = "Update";
    
    await TodoListInstance.methods.addTodo("Test").send();
    await shouldFail.reverting(TodoListInstance.methods.setTodoValue(1, value).send({from:accounts[2]}));
  })

  it("should fail to set a todo done to true when not owner", async function() {
    await TodoListInstance.methods.addTodo("Test").send();
    await shouldFail.reverting(TodoListInstance.methods.setTodoDone(1, true).send({from:accounts[2]}));
  })

});
