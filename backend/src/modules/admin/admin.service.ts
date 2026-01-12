import { Injectable, NotFoundException, ConflictException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, OrderStatus } from '../../constants/enums';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { Review, ReviewDocument } from '../review/schemas/review.schema';
import { LogService } from '../log/log.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly logService: LogService,
  ) {}

  async getDashboardStats() {
    const [userCount, productCount, orderCount, totalSalesResult, pendingOrders] = await Promise.all([
      this.userModel.countDocuments().exec(),
      this.productModel.countDocuments().exec(),
      this.orderModel.countDocuments().exec(),
      this.orderModel.aggregate([
        { $match: { status: OrderStatus.DELIVERED } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]).exec(),
      this.orderModel.countDocuments({ status: OrderStatus.PENDING }).exec()
    ]);

    return { 
      totalUsers: userCount, 
      productCount, 
      orderCount,
      totalSales: totalSalesResult[0]?.total || 0,
      pendingOrders
    };
  }

  async getRecentOrders() {
    const orders = await this.orderModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    const populatedOrders = await Promise.all(orders.map(async order => {
      const user = await this.userModel.findById(order.userId).exec();
      return {
        ...order.toObject(),
        user: user?.toObject(),
        total: Number(order.totalAmount)
      };
    }));

    return populatedOrders;
  }

  async getAllOrders() {
    const orders = await this.orderModel.find()
      .sort({ createdAt: -1 })
      .exec();

    const populatedOrders = await Promise.all(orders.map(async order => {
      const user = await this.userModel.findById(order.userId).exec();
      return {
        ...order.toObject(),
        user: user?.toObject(),
        total: Number(order.totalAmount)
      };
    }));

    return populatedOrders;
  }

  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users.map(u => u.toObject());
  }

  async getUsersPermissions() {
    const users = await this.userModel.find({}, 'name email role').exec();
    return users.map(u => u.toObject());
  }

  async updateUserPermissions(userId: string, data: { role: Role }) {
    return await this.userModel.findByIdAndUpdate(userId, { role: data.role }, { new: true }).exec();
  }

  async getUserDetails(userId: string) {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Manual population for relations
    const [orders, reviews] = await Promise.all([
      this.orderModel.find({ userId }).exec(),
      this.reviewModel.find({ userId }).exec(),
    ]);

    return {
      ...user.toObject(),
      orders: orders.map(o => o.toObject()),
      reviews: reviews.map(r => r.toObject()),
    };
  }

  async updateUser(userId: string, data: any) {
    return await this.userModel.findByIdAndUpdate(userId, data, { new: true }).exec();
  }

  async deleteUser(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { isActive: false, deletedAt: new Date() }).exec();
    return { success: true };
  }

  async getUserHistoric(userId: string) {
    return this.orderModel.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllProducts() {
    return this.productModel.find()
      .populate('categoryId') // Mongoose uses populate
      .sort({ createdAt: -1 })
      .exec();
  }

  async createProduct(adminId: string, data: any){
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const sku = data.sku || `SKU-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // Garantir que images esteja sincronizado com imageUrl
    const images = data.images || [];
    if (data.imageUrl && (!images.length || images[0].url !== data.imageUrl)) {
      images[0] = { url: data.imageUrl, isMain: true };
    }

    const product = new this.productModel({
      ...data,
      slug,
      sku,
      images,
      price: Number(data.price),
      stock: Number(data.stock),
      icms: data.icms !== undefined ? Number(data.icms) : 18,
      ipi: data.ipi !== undefined ? Number(data.ipi) : 5,
      pis: data.pis !== undefined ? Number(data.pis) : 1.65,
      cofins: data.cofins !== undefined ? Number(data.cofins) : 7.6,
    });

    return product.save();
  }

  async updateProduct(id: string, data: any) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    if (data.price) updateData.price = Number(data.price);
    if (data.stock) updateData.stock = Number(data.stock);
    if (data.icms !== undefined) updateData.icms = Number(data.icms);
    if (data.ipi !== undefined) updateData.ipi = Number(data.ipi);
    if (data.pis !== undefined) updateData.pis = Number(data.pis);
    if (data.cofins !== undefined) updateData.cofins = Number(data.cofins);

    // Sincronizar images com imageUrl no update
    if (data.imageUrl) {
      updateData.images = [{ url: data.imageUrl, isMain: true }];
    }

    return await this.productModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteProduct(id: string) {
    await this.productModel.findByIdAndUpdate(id, { isActive: false, deletedAt: new Date() }).exec();
    return { success: true };
  }

  async getAllCategories() {
    const categories = await this.categoryModel.find()
      .sort({ createdAt: -1 })
      .exec();

    // Em MongoDB, a contagem de produtos por categoria pode exigir uma agregação ou consulta separada
    // se não estivermos usando referências populadas. 
    // Por simplicidade, vamos retornar as categorias e o usuário pode lidar com a contagem se necessário.
    return categories.map(cat => cat.toObject());
  }

  async createCategory(adminId: string, data: any) {
    const existingCategory = await this.categoryModel.findOne({ name: data.name }).exec();
    if (existingCategory) {
      throw new ConflictException(`Categoria com o nome "${data.name}" já existe`);
    }

    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const category = new this.categoryModel({
      ...data,
      slug
    });
    return category.save();
  }

  async updateCategory(id: string, data: any) {
    if (data.name) {
      const existingCategory = await this.categoryModel.findOne({ 
        name: data.name,
        _id: { $ne: id }
      }).exec();

      if (existingCategory) {
        throw new ConflictException(`Categoria com o nome "${data.name}" já existe`);
      }
    }

    const updateData = { ...data };
    if (data.name) {
      updateData.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return await this.categoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteCategory(id: string) {
    const category = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return { success: true };
  }

  async getPaymentHistoric(id: string) {
    return this.orderModel.find({
      $or: [
        { _id: id },
        { userId: id }
      ]
    })
    .select('id totalAmount status paymentStatus paymentMethod createdAt')
    .exec();
  }

  async getActivityLogs(page: number, limit: number) {
    const { logs, total } = await this.logService.findPaginated(page, limit);

    const userIds = [...new Set(logs.map(log => log.userId))].filter(Boolean);
    const users = await this.userModel.find({
      _id: { $in: userIds }
    }).select('name email').exec();

    const userMap = new Map(users.map(user => [user.id, user]));

    const data = logs.map(log => ({
      ...log.toObject(),
      user: userMap.get(log.userId) || null
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
