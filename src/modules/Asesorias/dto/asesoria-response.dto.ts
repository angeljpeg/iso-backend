import { ApiProperty } from '@nestjs/swagger';
import { Asesoria } from '../entities/asesoria.entity';

export class AsesoriaResponseDto {
  @ApiProperty({
    description: 'Lista de asesorías',
    type: [Asesoria],
  })
  data: Asesoria[];

  @ApiProperty({
    example: 25,
    description: 'Total de asesorías encontradas',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'Página actual',
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Número de elementos por página',
  })
  limit: number;
}
