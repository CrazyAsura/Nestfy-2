import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../constants/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() { 
    return this.adminService.getDashboardStats();
  }

  @Get('orders')
  getAllOrders() {
    return this.adminService.getAllOrders();
  }

  @Get('orders/recent')
  getRecentOrders() {
    return this.adminService.getRecentOrders();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('users/permissions')
  getPermissions() { 
    return this.adminService.getUsersPermissions(); 
  }

  @Patch('users/permissions/:id/update')
  updatePermissions(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUserPermissions(id, data);
  }

  @Get('users/:id')
  getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id/update')
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Delete('users/:id/delete')
  deleteUser(@Param('id') id: string) { 
    return this.adminService.deleteUser(id); 
  }

  @Get('users/:id/historic')
  getUserHistoric(@Param('id') id: string) { 
    return this.adminService.getUserHistoric(id); 
  }

  // Products Management
  @Get('products')
  getProducts() { 
    return this.adminService.getAllProducts();
  }

  @Post('products/:id/post') // O 'id' aqui pode ser o ID do admin que está criando
  createProduct(@Param('id') adminId: string, @Body() data: any) {
    return this.adminService.createProduct(adminId, data);
  }

  @Put('products/:id/update')
  updateProduct(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProduct(id, data);
  }

  @Delete('products/:id/delete')
  deleteProduct(@Param('id') id: string) { 
    return this.adminService.deleteProduct(id); 
  }

  // Category Management
  @Get('categories')
  getCategories() { 
    return this.adminService.getAllCategories(); 
  }

  @Post('categories/:id/post')
  createCategory(@Param('id') adminId: string, @Body() data: any) {
    return this.adminService.createCategory(adminId, data);
  }

  @Put('categories/:id/update')
  updateCategory(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateCategory(id, data);
  }

  @Delete('categories/:id/delete')
  deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  // Payment
  @Get('payment/:id/historic')
  getPaymentHistoric(@Param('id') id: string) { 
    return this.adminService.getPaymentHistoric(id); 
  }

  // Activity Logs
  @Get('activity-logs')
  getActivityLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getActivityLogs(
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
    );
  }
}
