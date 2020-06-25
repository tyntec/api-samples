import { IsString, IsArray, IsNotEmpty, ArrayMaxSize } from 'class-validator';

export class InitConversationDto {
  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMaxSize(2)
  @IsString({ each: true })
  templateParams: string[];
}
