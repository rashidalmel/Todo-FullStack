const { createTodo, getTodos, updateTodo, deleteTodo } = require('../models/todo');

exports.getTodos = async (req, res) => {
  const { username } = req.query;
  try {
    const todos = await getTodos(username);
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTodo = async (req, res) => {
  const { username, title, description } = req.body;
  if (!username || !title || !description) return res.status(400).json({ message: 'All fields required' });
  try {
    await createTodo(username, title, description);
    res.status(201).json({ message: 'Todo created' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { username, title, description } = req.body;
  if (!username || !title || !description) return res.status(400).json({ message: 'All fields required' });
  try {
    await updateTodo(id, username, title, description);
    res.json({ message: 'Todo updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;
  try {
    await deleteTodo(id, username);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
