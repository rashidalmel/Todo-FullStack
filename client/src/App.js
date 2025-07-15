
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import TodoList from './TodoList';


function App() {
  const username = localStorage.getItem('username');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todolist" element={username ? <TodoList /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={username ? "/todolist" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
