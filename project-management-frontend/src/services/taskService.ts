import { TaskDto } from "../@api";
import api from "./api";

// Fetch all tasks
export const getAllTasks = async (): Promise<TaskDto[]> => {
  try {
    const res = await api.get("/tasks");
    return res.data;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};

// Fetch a task by ID
export const getTaskById = async (id: number): Promise<TaskDto> => {
  try {
    const res = await api.get(`/tasks/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching task with id ${id}:`, err);
    throw err;
  }
};

// Create a new task
export const createTask = async (task: TaskDto): Promise<TaskDto> => {
  try {
    const res = await api.post("/tasks", task);
    return res.data;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

// Update an existing task
export const updateTask = async (id: number, task: TaskDto): Promise<TaskDto> => {
  try {
    const res = await api.put(`/tasks/${id}`, task);
    return res.data;
  } catch (err) {
    console.error(`Error updating task with id ${id}:`, err);
    throw err;
  }
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (err) {
    console.error(`Error deleting task with id ${id}:`, err);
    throw err;
  }
};

// Fetch tasks by project ID
export const getTasksByProjectId = async (projectId: number): Promise<TaskDto[]> => {
  try {
    const res = await api.get(`/tasks/project/${projectId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching tasks for project ${projectId}:`, err);
    throw err;
  }
};