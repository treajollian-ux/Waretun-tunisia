import React, { useState, useEffect } from 'react';
import { useVPN } from '../hooks/useVPN';

const ServerList = () => {
  const { servers, connection, connect, loadServers } = useVPN();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await loadServers();
      setLoading(false);
    };
    initialize();
  }, []);

  const getServerFlag = (country) => {
    const flags = {
      'TN': '🇹🇳',
      'FR': '🇫🇷',
      'DE': '🇩🇪',
      'US': '🇺🇸'
    };
    return flags[country] || '🌐';
  };

  if (loading) {
    return <div className="loading">جاري تحميل الخوادم...</div>;
  }

  return (
    <div className="server-list">
      <h2>📡 الخوادم المتاحة</h2>
      <div className="servers-grid">
        {servers.map(server => (
          <div key={server.id} className={`server-card ${
            connection.connected && connection.server?.id === server.id ? 'active' : ''
          }`}>
            <div className="server-header">
              <span className="server-flag">{getServerFlag(server.country)}</span>
              <h3>{server.name}</h3>
            </div>
            
            <div className="server-info">
              <p>📍 {server.location}</p>
              <p>⚡ الحمل: {server.load}%</p>
              <p>🛡️ {server.encryption}</p>
              <p className={`status ${server.status}`}>
                {server.status === 'active' ? '🟢 نشط' : '🔴 غير متاح'}
              </p>
            </div>

            <button
              onClick={() => connect(server.id)}
              disabled={server.status !== 'active' || 
                       (connection.connected && connection.server?.id === server.id)}
              className="btn btn-secondary"
            >
              {connection.connected && connection.server?.id === server.id 
                ? '✅ متصل' 
                : '🔗 الاتصال'
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerList;
