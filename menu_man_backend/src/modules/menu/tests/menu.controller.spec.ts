import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from '../controllers/menu.controller';
import { MenuService } from '../services/menu.service';
import { CreateMenuItemDto } from '../dtos/create_menu_item.dto';
import { UpdateMenuItemDto } from '../dtos/update-menu.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('MenuController', () => {
  let menuController: MenuController;
  let menuService: MenuService;

  beforeEach(async () => {
    const mockMenuService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      getMenuTree: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: mockMenuService,
        },
      ],
    }).compile();

    menuController = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(menuController).toBeDefined();
  });

  describe('create', () => {
    it('should create a menu item', async () => {
      const createDto: CreateMenuItemDto = { name: 'New Menu', parentId: null };
      const expectedResult = { id: 1, ...createDto };

      jest
        .spyOn(menuService, 'create')
        .mockResolvedValue(expectedResult as any);

      const result = await menuController.create(createDto);
      expect(result).toEqual(expectedResult);
      expect(menuService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw NotFoundException if parent menu item does not exist', async () => {
      const createDto: CreateMenuItemDto = { name: 'New Menu', parentId: 99 };

      jest
        .spyOn(menuService, 'create')
        .mockRejectedValue(
          new NotFoundException(`Parent menu item with id 99 does not exist.`),
        );

      await expect(menuController.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(menuService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw the original error on unexpected errors', async () => {
      const createDto: CreateMenuItemDto = { name: 'New Menu', parentId: null };
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(menuService, 'create').mockRejectedValue(unexpectedError);

      await expect(menuController.create(createDto)).rejects.toThrow(
        unexpectedError,
      );
      expect(menuService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of menu items', async () => {
      const expectedResult = [
        { id: 1, name: 'Menu 1', parentId: null },
        { id: 2, name: 'Menu 2', parentId: 1 },
      ];

      jest
        .spyOn(menuService, 'findAll')
        .mockResolvedValue(expectedResult as any);

      const result = await menuController.findAll();
      expect(result).toEqual(expectedResult);
      expect(menuService.findAll).toHaveBeenCalled();
    });

    it('should throw the original error if service.findAll throws an unexpected error', async () => {
      const unexpectedError = new Error('Failed to retrieve menu items');

      jest.spyOn(menuService, 'findAll').mockRejectedValue(unexpectedError);

      await expect(menuController.findAll()).rejects.toThrow(unexpectedError);
      expect(menuService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single menu item', async () => {
      const expectedResult = {
        id: 1,
        name: 'Menu 1',
        parentId: null,
        children: [],
      };

      jest
        .spyOn(menuService, 'findOne')
        .mockResolvedValue(expectedResult as any);

      const result = await menuController.findOne(1);
      expect(result).toEqual(expectedResult);
      expect(menuService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if menu item does not exist', async () => {
      jest
        .spyOn(menuService, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`Menu item with id 99 does not exist.`),
        );

      await expect(menuController.findOne(99)).rejects.toThrow(
        NotFoundException,
      );
      expect(menuService.findOne).toHaveBeenCalledWith(99);
    });

    it('should throw the original error on unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(menuService, 'findOne').mockRejectedValue(unexpectedError);

      await expect(menuController.findOne(1)).rejects.toThrow(unexpectedError);
      expect(menuService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a menu item', async () => {
      const updateDto: UpdateMenuItemDto = { name: 'Updated Menu' };
      const expectedResult = { id: 1, name: 'Updated Menu', parentId: null };

      jest
        .spyOn(menuService, 'update')
        .mockResolvedValue(expectedResult as any);

      const result = await menuController.update(1, updateDto);
      expect(result).toEqual(expectedResult);
      expect(menuService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if menu item does not exist', async () => {
      const updateDto: UpdateMenuItemDto = { name: 'Updated Menu' };

      jest
        .spyOn(menuService, 'update')
        .mockRejectedValue(
          new NotFoundException(`Menu item with id 99 does not exist.`),
        );

      await expect(menuController.update(99, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(menuService.update).toHaveBeenCalledWith(99, updateDto);
    });

    it('should throw BadRequestException if service.update throws BadRequestException', async () => {
      const updateDto: UpdateMenuItemDto = { parentId: 1 };

      jest
        .spyOn(menuService, 'update')
        .mockRejectedValue(
          new BadRequestException('Cannot set parentId to itself.'),
        );

      await expect(menuController.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(menuService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw BadRequestException if service.update creates a cycle', async () => {
      const updateDto: UpdateMenuItemDto = { parentId: 2 };

      jest
        .spyOn(menuService, 'update')
        .mockRejectedValue(
          new BadRequestException(
            'Cannot set parentId to a descendant of the menu item (cycle detected).',
          ),
        );

      await expect(menuController.update(1, updateDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(menuService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw the original error on unexpected errors', async () => {
      const updateDto: UpdateMenuItemDto = { name: 'Updated Menu' };
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(menuService, 'update').mockRejectedValue(unexpectedError);

      await expect(menuController.update(1, updateDto)).rejects.toThrow(
        unexpectedError,
      );
      expect(menuService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a menu item successfully', async () => {
      // Since the controller's remove method returns void, we don't expect any return value
      jest.spyOn(menuService, 'remove').mockResolvedValue(undefined);

      await expect(menuController.remove(1)).resolves.toBeUndefined();
      expect(menuService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if menu item does not exist', async () => {
      jest
        .spyOn(menuService, 'remove')
        .mockRejectedValue(
          new NotFoundException(`Menu item with id 99 does not exist.`),
        );

      await expect(menuController.remove(99)).rejects.toThrow(
        NotFoundException,
      );
      expect(menuService.remove).toHaveBeenCalledWith(99);
    });

    it('should throw the original error on unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(menuService, 'remove').mockRejectedValue(unexpectedError);

      await expect(menuController.remove(1)).rejects.toThrow(unexpectedError);
      expect(menuService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getMenuTree', () => {
    it('should return the root menu items with nested children', async () => {
      const expectedResult = [
        {
          id: 1,
          depth: 0,
          name: 'Root Menu',
          parentId: null,
          children: [
            {
              id: 2,
              depth: 1,
              name: 'Child Menu',
              parentId: 1,
              children: [],
            },
          ],
        },
      ];

      jest
        .spyOn(menuService, 'getMenuTree')
        .mockResolvedValue(expectedResult as any);

      const result = await menuController.getMenuTree();
      expect(result).toEqual(expectedResult);
      expect(menuService.getMenuTree).toHaveBeenCalled();
    });

    it('should throw the original error if service.getMenuTree throws an unexpected error', async () => {
      const unexpectedError = new Error('Failed to retrieve menu tree');

      jest.spyOn(menuService, 'getMenuTree').mockRejectedValue(unexpectedError);

      await expect(menuController.getMenuTree()).rejects.toThrow(
        unexpectedError,
      );
      expect(menuService.getMenuTree).toHaveBeenCalled();
    });
  });
});
