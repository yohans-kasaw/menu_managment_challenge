import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  parentId?: number;
}
