
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);
  const [viewTodo, setViewTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Get username from localStorage (set after login)
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/api/todos?username=${encodeURIComponent(username)}`)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch todos');
        setLoading(false);
      });
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title || !description) return;
    if (editId) {
      // Update todo
      try {
        const res = await fetch(`http://localhost:5000/api/todos/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, title, description })
        });
        if (!res.ok) throw new Error();
        setTodos(todos.map(todo => todo.id === editId ? { ...todo, title, description } : todo));
        setEditId(null);
      } catch {
        setError('Failed to update todo');
      }
    } else {
      // Add todo
      try {
        const res = await fetch('http://localhost:5000/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, title, description })
        });
        if (!res.ok) throw new Error();
        // Get new todos from backend
        const todosRes = await fetch(`http://localhost:5000/api/todos?username=${encodeURIComponent(username)}`);
        setTodos(await todosRes.json());
      } catch {
        setError('Failed to add todo');
      }
    }
    setTitle('');
    setDescription('');
  };

  const handleEdit = (todo) => {
    setEditId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!res.ok) throw new Error();
      setTodos(todos.filter(todo => todo.id !== id));
      if (viewTodo && viewTodo.id === id) setViewTodo(null);
    } catch {
      setError('Failed to delete todo');
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-green-100 to-green-300 py-8">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-xl flex flex-col gap-6 border border-green-200">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-green-700 tracking-tight">Add Your Todo</h2>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-semibold mb-1">Todo:</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter todo"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={2}
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition">
            {editId ? 'Update' : 'Submit'}
          </button>
        </form>
        <h2 className="text-2xl font-bold text-center mt-6">Todos</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-t">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Todo</th>
                  <th className="py-2 px-4 border-b">Edit</th>
                  <th className="py-2 px-4 border-b">Delete</th>
                  <th className="py-2 px-4 border-b">View</th>
                </tr>
              </thead>
              <tbody>
                {todos.map(todo => (
                  <tr key={todo.id} className="text-center">
                    <td className="py-2 px-4 border-b">{todo.title}</td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => handleEdit(todo)} className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3z" /></svg>
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => { setShowDeleteModal(true); setDeleteId(todo.id); }} className="text-red-500 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button onClick={() => setViewTodo(todo)} className="text-blue-600 hover:underline font-semibold">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {viewTodo && (
          <div className="mt-6 p-4 border rounded bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Todo Details</h3>
            <p><span className="font-semibold">Title:</span> {viewTodo.title}</p>
            <p><span className="font-semibold">Description:</span> {viewTodo.description}</p>
            <button onClick={() => setViewTodo(null)} className="mt-2 text-blue-600 hover:underline">Close</button>
          </div>
        )}
        <button onClick={() => {
          localStorage.removeItem('username');
          navigate('/login');
        }} className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">Logout</button>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full border-2 border-red-500">
              <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 mr-2 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Are you sure you want to delete?
              </h3>
              <p className="text-center text-red-500 mb-6 font-semibold">This action cannot be undone.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => handleDelete(deleteId)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition shadow">Delete</button>
                <button onClick={() => { setShowDeleteModal(false); setDeleteId(null); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition shadow">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoList;
