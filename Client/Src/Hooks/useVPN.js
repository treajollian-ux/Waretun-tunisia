import React, { createContext, useContext, useState, useEffect } from 'react';
import { vpnAPI } from '../services/api';
import { io } from 'socket.io-client';

const VPNContext = createContext();

export const useVPN = () => {
  const context = useContext(VPNContext);
  if (!context) {
    throw new Error('useVPN must be used within a VPNProvider');
  }
  return context;
};

export const VPNProvider = ({ children }) => {
  const [connection, setConnection] = useState({
    connected: false,
    server: null,
    config: null,
    stats: { upload: 0, download: 0, duration: 0 }
  });
  const [servers, setServers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.io connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('vpn-status', (data) => {
      setConnection(prev => ({
        ...prev,
        stats: data.stats
      }));
    });

    newSocket.on('connection-update', (data) => {
      setConnection(prev => ({
        ...prev,
        connected: data.connected,
        server: data.server
      }));
    });

    return () => newSocket.close();
  }, []);

  const loadServers = async () => {
    try {
      const serverList = await vpnAPI.getServers();
      setServers(serverList);
    } catch (error) {
      console.error('Failed to load servers:', error);
    }
  };

  const connect = async (serverId) => {
    try {
      const result = await vpnAPI.connect(serverId);
      setConnection({
        connected: true,
        server: result.server,
        config: result.config,
        stats: { upload: 0, download: 0, duration: 0 }
      });
      
      // Start VPN connection (this would interface with system VPN)
      await startVPNConnection(result.config);
      
      return result;
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      await vpnAPI.disconnect();
      await stopVPNConnection();
      setConnection({
        connected: false,
        server: null,
        config: null,
        stats: { upload: 0, download: 0, duration: 0 }
      });
    } catch (error) {
      console.error('Disconnection failed:', error);
      throw error;
    }
  };

  const startVPNConnection = async (config) => {
    // This would interface with the system's VPN client
    // For web, this might download a config file
    console.log('Starting VPN connection with config:', config);
    
    // Download config file for user
    const blob = new Blob([config], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'waretun.conf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const stopVPNConnection = async () => {
    console.log('Stopping VPN connection');
    // Interface with system VPN client to disconnect
  };

  const value = {
    connection,
    servers,
    connect,
    disconnect,
    loadServers
  };

  return (
    <VPNContext.Provider value={value}>
      {children}
    </VPNContext.Provider>
  );
};
