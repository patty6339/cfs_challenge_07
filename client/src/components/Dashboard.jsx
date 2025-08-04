// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td 
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useTask } from '../hooks/useTask';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tasks, loading, error } = useTask();

  const [filters, setFilters] = useState({
    assignee: '',
    status: ''
  });

  const filteredTasks = tasks.filter(task => {
    const assigneeMatch = !filters.assignee || 
      task.assignee.toString() === filters.assignee;
    const statusMatch = !filters.status || 
      task.status === filters.status;
    return assigneeMatch && statusMatch;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <select 
          className="mr-2 p-2 border rounded"
          value={filters.assignee}
          onChange={(e) => setFilters({...filters, assignee: e.target.value})}
        >
          <option value="">All Assignees</option>
          {tasks.map(task => (
            <option key={task.assignee} value={task.assignee}>
              {task.assignee.username}
            </option>
          ))}
        </select>

        <select 
          className="p-2 border rounded"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option