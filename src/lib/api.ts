import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  timeout: 10_000,
})

export interface Todo {
  userId: number
  id: number
  title: string
  completed: boolean
}

export async function fetchTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/todos')
  return data
}
