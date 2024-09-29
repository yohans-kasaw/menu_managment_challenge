import { createAsyncThunk } from '@reduxjs/toolkit';
import { MenuItem } from '../../types';
import * as api from './api';
import axios from 'axios';

export const fetchMenuTree = createAsyncThunk(
  'menu/fetchTree',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchMenuTree();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchMenuItem = createAsyncThunk(
  'menu/fetch',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.fetchMenuItem(id);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const createMenuItem = createAsyncThunk(
  'menu/create',
  async (menuItem: {parentId:number | null, name:string}, { rejectWithValue }) => {
    try {
      const response = await api.createMenuItemApi(menuItem);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateMenuItem = createAsyncThunk(
  'menu/update',
  async ({ id, updates }: { id: number; updates: Partial<MenuItem> }, { rejectWithValue }) => {
    try {
      const response = await api.updateMenuItemApi(id, updates);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const deleteMenuItem = createAsyncThunk(
  'menu/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.deleteMenuItemApi(id);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
