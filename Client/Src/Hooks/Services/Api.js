import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const vpnAPI = {
  getServers: async () => {
    const response = await api.get('/servers');
    return response.data;
  },

  connect: async (serverId) => {
    const response = await api.post('/connect', { serverId });
    return response.data;
  },

  disconnect: async () => {
    const response = await api.post('/disconnect');
    return response.data;
  },

  getStatus: async () => {
    const response = await api.get('/status');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};

export default api;
