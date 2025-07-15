const db = require('../config/db');

const createTodo = async (username, title, description) => {
  const [result] = await db.execute(
    'INSERT INTO todos (username, title, description) VALUES (?, ?, ?)',
    [username, title, description]
  );
  return result;
};

const getTodos = async (username) => {
  const [rows] = await db.execute('SELECT * FROM todos WHERE username = ?', [username]);
  return rows;
};

const updateTodo = async (id, username, title, description) => {
  const [result] = await db.execute(
    'UPDATE todos SET title = ?, description = ? WHERE id = ? AND username = ?',
    [title, description, id, username]
  );
  return result;
};

const deleteTodo = async (id, username) => {
  const [result] = await db.execute(
    'DELETE FROM todos WHERE id = ? AND username = ?',
    [id, username]
  );
  return result;
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
