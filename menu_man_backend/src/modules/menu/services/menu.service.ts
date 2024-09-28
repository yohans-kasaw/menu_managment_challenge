import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuItemDto } from '../dtos/create_menu_item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu.dto';
import { MenuItemModel } from '../models/menu.model';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItemModel> {
    const { name, parentId } = createMenuItemDto;

    if (parentId !== undefined && parentId !== null) {
      // Check if parentId exists
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent menu item with id ${parentId} does not exist.`,
        );
      }
    }

    return this.prisma.menuItem.create({
      data: {
        name,
        parentId,
      },
    });
  }

  async findAll(): Promise<MenuItemModel[]> {
    return this.prisma.menuItem.findMany({
      include: {
        children: true,
      },
    });
  }

  async getMenuTree(): Promise<MenuItemModel[]> {
    const menuItems = await this.prisma.menuItem.findMany({
      orderBy: { id: 'asc' },
    });

    const menuItemMap = new Map<number, MenuItemModel>();
    menuItems.forEach((item) => {
      menuItemMap.set(item.id, {
        ...item,
        children: [],
        depth: 0, // Initialize depth to 0
      });
    });

    const roots: MenuItemModel[] = [];

    menuItemMap.forEach((item) => {
      if (item.parentId) {
        const parent = menuItemMap.get(item.parentId);
        if (parent) {
          item.depth = parent.depth + 1;
          parent.children!.push(item);
        } else {
          // If parent doesn't exist, treat as root
          roots.push(item);
        }
      } else {
        // Root item
        roots.push(item);
      }
    });

    return roots;
  }

  async findOne(id: number): Promise<MenuItemModel> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} does not exist.`);
    }
    return menuItem;
  }

  private async isDescendant(childId: number, parentId: number): Promise<boolean> {
    if (childId === parentId) return true;
    const parent = await this.prisma.menuItem.findUnique({
      where: { id: parentId },
      select: { parentId: true },
    });
    if (!parent || !parent.parentId) return false;
    return this.isDescendant(childId, parent.parentId);
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItemModel> {
    const { parentId } = updateMenuItemDto;

    // Check if the menu item to update exists
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} does not exist.`);
    }

    if (parentId !== undefined) {
      if (parentId === id) {
        throw new BadRequestException('Cannot set parentId to itself.');
      }
      // Check if parentId exists
      const parent = await this.prisma.menuItem.findUnique({
        where: { id: parentId },
      });
      if (!parent) {
        throw new NotFoundException(
          `Parent menu item with id ${parentId} does not exist.`,
        );
      }

      // Check for cycles using optimized recursive function
      const hasCycle = await this.isDescendant(id, parentId);
      if (hasCycle) {
        throw new BadRequestException(
          'Cannot set parentId to a descendant of the menu item (cycle detected).',
        );
      }
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateMenuItemDto,
    });
  }

  async remove(id: number): Promise<void> {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} does not exist.`);
    }

    // Optional: Handle cascading deletes based on Prisma schema
    await this.prisma.menuItem.delete({
      where: { id },
    });
  }
}
