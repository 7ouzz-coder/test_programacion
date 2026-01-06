import { Controller, Post, Headers } from '@nestjs/common';
import { EtlService } from './etl.service';
import { JwtService } from '@nestjs/jwt';

@Controller('etl')
export class EtlController {
  constructor(
    private etlService: EtlService,
    private jwtService: JwtService,
  ) {}

  @Post('process')
  async processPdf(@Headers('authorization') auth: string) {
    try {
      console.log('Endpoint ETL llamado');
      
      // verificar token
      if(!auth) {
        throw new Error('No hay token');
      }

      const token = auth.replace('Bearer ', '');
      this.jwtService.verify(token);
      console.log('Token verificado');

      // procesar PDF
      const result = await this.etlService.processPdf();
      return result;
    } catch (error) {
      console.error('Error en endpoint ETL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}