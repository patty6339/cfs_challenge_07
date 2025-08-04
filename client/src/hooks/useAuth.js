// client/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import * as authService from '../services/auth.service';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setCurrentUser(storedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (credentials) => {
    try {
      const user = await authService.signin(credentials);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const user = await authService.signup(userData);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };
};

// client/src/hooks/useTask.js
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          headers: { 'x-access-token': localStorage.getItem('token') }
        });
        setTasks(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const createTask = async (taskData) => {
    try {
      const response = await axios.post('/api/tasks', taskData, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setTasks([...tasks, response.data]);
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create task';
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await axios.put(`/api/tasks/${taskId}`, updates, {
        headers: { 'x-access-token': localStorage.getItem('token') }
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      return response.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update task';
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask
  };
};