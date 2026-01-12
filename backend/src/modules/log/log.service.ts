import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActivityLog, ActivityLogDocument } from './schemas/activity-log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(ActivityLog.name)
    private readonly activityLogModel: Model<ActivityLogDocument>,
  ) {}

  async createActivityLog(data: Partial<ActivityLog>): Promise<ActivityLogDocument> {
    const newLog = new this.activityLogModel(data);
    return newLog.save();
  }

  async findAll(): Promise<ActivityLogDocument[]> {
    return this.activityLogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findByUserId(userId: string): Promise<ActivityLogDocument[]> {
    return this.activityLogModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.activityLogModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.activityLogModel.countDocuments().exec(),
    ]);

    return { logs, total };
  }
}
