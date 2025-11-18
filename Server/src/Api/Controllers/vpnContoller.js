import { generateWireGuardConfig, startVPN, stopVPN } from '../../../vpn/wireguard.js';
import Server from '../../models/Server.js';

export const connectToVPN = async (req, res) => {
  try {
    const { serverId } = req.body;
    
    if (!serverId) {
      return res.status(400).json({ 
        success: false, 
        message: 'معرف الخادم مطلوب' 
      });
    }

    // Find the server
    const server = await Server.findById(serverId);
    if (!server) {
      return res.status(404).json({ 
        success: false, 
        message: 'الخادم غير موجود' 
      });
    }

    if (server.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'الخادم غير متاح حالياً' 
      });
    }

    // Generate WireGuard configuration
    const config = await generateWireGuardConfig(server);
    
    // Start VPN connection
    const connection = await startVPN(config, server);
    
    // Update server load
    server.load += 1;
    await server.save();

    res.json({
      success: true,
      message: 'تم الاتصال بنجاح',
      config: config,
      server: {
        id: server._id,
        name: server.name,
        location: server.location,
        country: server.country
      },
      connection
    });

  } catch (error) {
    console.error('Connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في الاتصال',
      error: error.message 
    });
  }
};

export const disconnectFromVPN = async (req, res) => {
  try {
    await stopVPN();
    
    res.json({
      success: true,
      message: 'تم قطع الاتصال بنجاح'
    });

  } catch (error) {
    console.error('Disconnection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'فشل في قطع الاتصال',
      error: error.message 
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    // This would check the actual VPN status from the system
    const status = {
      connected: false,
      duration: 0,
      server: null,
      ip: null
    };

    res.json({
      success: true,
      status
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'فشل في جلب حالة الاتصال',
      error: error.message 
    });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const stats = {
      upload: Math.floor(Math.random() * 1000),
      download: Math.floor(Math.random() * 5000),
      duration: Math.floor(Math.random() * 3600),
      connectedSince: new Date(Date.now() - Math.floor(Math.random() * 3600000))
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'فشل في جلب الإحصائيات',
      error: error.message 
    });
  }
};
