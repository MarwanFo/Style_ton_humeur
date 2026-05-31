import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  icon?: string;

  @IsInt()
  @Min(1)
  thresholdDays: number;
}
