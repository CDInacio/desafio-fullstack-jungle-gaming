import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 10;

  @IsOptional()
  @Type(() => String)
  sortBy?: string = "createdAt";

  @IsOptional()
  @Type(() => String)
  sortOrder?: "ASC" | "DESC" = "DESC";
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationQuery {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
