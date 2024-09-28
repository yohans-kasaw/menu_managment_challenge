import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { CreateMenuItemDto } from '../dtos/create_menu_item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu.dto';
import { MenuItemModel } from '../models/menu.model';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMenuItemDto: CreateMenuItemDto): Promise<MenuItemModel> {
    const menuItem = await this.menuService.create(createMenuItemDto);
    return menuItem;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<MenuItemModel[]> {
    const menuItems = await this.menuService.findAll();
    return menuItems;
  }

  @Get('menu-tree')
  @HttpCode(HttpStatus.OK)
  async getMenuTree(): Promise<MenuItemModel[]> {
    const menuTree = await this.menuService.getMenuTree();
    return menuTree;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MenuItemModel> {
    const menuItem = await this.menuService.findOne(id);
    return menuItem;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItemModel> {
    const updatedMenuItem = await this.menuService.update(id, updateMenuItemDto);
    return updatedMenuItem;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.menuService.remove(id);
    // No content to return
  }
}
