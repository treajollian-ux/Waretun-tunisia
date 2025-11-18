import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'TN'
  },
  load: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'offline'],
    default: 'active'
  },
  encryption: {
    type: String,
    default: 'AES-256-GCM'
  },
  publicKey: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    default: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to get available servers
serverSchema.statics.getAvailableServers = function() {
  return this.find({ 
    status: 'active',
    load: { $lt: 90 } // Less than 90% load
  }).sort({ load: 1 });
};

export default mongoose.model('Server', serverSchema);
