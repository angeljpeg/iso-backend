import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormatosRevision, Revision } from './entities/revision.entity';
import { CreateRevisionDto } from './dto/create-revision';
import { SeguimientoCurso } from '@modules/ProgramacionSeguimientoCurso';

@Injectable()
export class RevisionService {
  constructor(
    @InjectRepository(Revision)
    private _revisionRepository: Repository<Revision>,
    @InjectRepository(SeguimientoCurso)
    private programacionSeguimientoCursoRepository: Repository<SeguimientoCurso>,
  ) {}

  async createRevision(_createRevisionDto: CreateRevisionDto): Promise<any> {}

  private async searchFormato(
    formato: FormatosRevision,
    formato_id: string,
  ): Promise<any> {
    if (formato === FormatosRevision.PROGRAMACION_SEGUIMIENTO_CURSO) {
      return this.programacionSeguimientoCursoRepository.findOne({
        where: { id: formato_id },
      });
    }

    return null;
  }
}
