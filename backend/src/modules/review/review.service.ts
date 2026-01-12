import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    const { rating, comment, productId } = createReviewDto;
    const review = new this.reviewModel({
      rating,
      comment,
      productId,
      userId,
    });
    return review.save();
  }

  async findAll() {
    return this.reviewModel.find().exec();
  }

  async findByProduct(productId: string) {
    return this.reviewModel
      .find({ productId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewModel
      .findOneAndUpdate({ _id: id, userId }, updateReviewDto, { new: true })
      .exec();
    if (!review) throw new NotFoundException('Review not found or unauthorized');
    return review;
  }

  async remove(id: string, userId: string) {
    const result = await this.reviewModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!result) throw new NotFoundException('Review not found or unauthorized');
    return result;
  }

  async toggleLike(id: string, userId: string) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');

    const index = review.likes.indexOf(userId);
    if (index === -1) {
      review.likes.push(userId);
    } else {
      review.likes.splice(index, 1);
    }

    return review.save();
  }

  async addReply(id: string, userId: string, userName: string, comment: string) {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');

    review.replies.push({
      userId,
      userName,
      comment,
      createdAt: new Date(),
    });

    return review.save();
  }
}
