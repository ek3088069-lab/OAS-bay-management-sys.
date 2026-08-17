import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  username: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    default: 'Technician',
  },
  action: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;
