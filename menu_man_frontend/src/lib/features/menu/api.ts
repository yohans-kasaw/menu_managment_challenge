import axios from 'axios';
import { MenuItem } from '../../types';  

const baseURL = process.env.NEXT_PUBLIC_APP_API_BASE_URL;
if (!baseURL) {
  throw new Error('API base URL not set');
}
const timeStamp = `?timestamp=${new Date().getTime()}`

export const fetchMenuTree = () => axios.get(`${baseURL}/menu/menu-tree${timeStamp}`);
export const fetchMenuItem = (id:number) => axios.get(`${baseURL}/menu/${id}{timeStamp}`);
export const createMenuItemApi = (menuItem: {parentId:number | null, name:string}) => axios.post(`${baseURL}/menu`, menuItem);
export const updateMenuItemApi = (id: number, updates: Partial<MenuItem>) => axios.put(`${baseURL}/menu/${id}`, updates);
export const deleteMenuItemApi = (id: number) => axios.delete(`${baseURL}/menu/${id}`);
