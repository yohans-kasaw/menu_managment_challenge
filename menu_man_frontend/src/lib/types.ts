export interface MenuItem {
  id: number;
  name: string;
  depth?: number;
  parentId?: number;
  parentData?: string;
  children?: MenuItem[];
}

export interface MenuState {
  items?: MenuItem[];
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  errorMessage: string;
}

