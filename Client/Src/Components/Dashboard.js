import React from 'react';
import { useVPN } from '../hooks/useVPN';
import Stats from './Stats';

const Dashboard = () => {
  const { 
    connection, 
    connect, 
    disconnect, 
 servers 
  } = useVPN();

  const handleQuickConnect = async () => {
    const bestServer = servers.find(server => server.country === 'TN') || servers[0];
    if (bestServer) {
      await connect(bestServer.id);
    }
  };

  return (
    <div className="dashboard">
      <div className="status-card">
        <div className={`status-indicator ${connection.connected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          <span>{connection.connected ? 'متصل' : 'غير متصل'}</span>
        </div>

        {connection.connected ? (
          <>
            <div className="connection-info">
              <h3>🛰️ متصل بـ {connection.server?.name}</h3>
              <p>📍 {connection.server?.location}</p>
            </div>
            <button 
              onClick={disconnect}
              className="btn btn-danger"
            >
              🔌 قطع الاتصال
            </button>
          </>
        ) : (
          <>
            <div className="quick-connect">
              <h3>⚡ اتصال سريع</h3>
              <p>اتصال تلقائي بأفضل خادم متاح</p>
              <button 
                onClick={handleQuickConnect}
                className="btn btn-primary"
                disabled={servers.length === 0}
              >
                🔗 الاتصال الآن
              </button>
            </div>
          </>
        )}
      </div>

      <Stats />
    </div>
  );
};

export default Dashboard;
