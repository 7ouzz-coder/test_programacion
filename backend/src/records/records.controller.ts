import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  Headers 
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { JwtService } from '@nestjs/jwt';

@Controller('records')
export class RecordsController {
  constructor(
    private recordsService: RecordsService,
    private jwtService: JwtService,
  ) {}

  private verifyToken(authHeader: string) {
    if (!authHeader) {
      throw new Error('No hay token');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.jwtService.verify(token);
  }

  @Get()
  async getAll(@Query() query: any, @Headers('authorization') auth: string) {
    try {
      this.verifyToken(auth);
      const records = await this.recordsService.getAllRecords(query);
      return records;
    } catch (error) {
      console.log('error en getAll:', error.message);
      return { error: error.message };
    }
  }

  @Get(':id')
  async getOne(@Param('id') id: string, @Headers('authorization') auth: string) {
    try{
      this.verifyToken(auth);
      const record = await this.recordsService.getRecordById(Number(id));
      return record;
    }catch(error){
      return { error: error.message };
    }
  }

  @Post()
  async create(@Body() body: any, @Headers('authorization') auth: string) {
    try {
      this.verifyToken(auth);
      console.log('creando record con body:', body);
      const record = await this.recordsService.createRecord(body);
      return record;
    } catch (error) {
      console.error('error creando:', error);
      return { error: error.message };
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Headers('authorization') auth: string,
  ) {
    try{
      this.verifyToken(auth);
      const record = await this.recordsService.updateRecord(Number(id), body);
      return record;
    }catch(error){
      return { error: error.message };
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Headers('authorization') auth: string) {
    try {
      this.verifyToken(auth);
      const result = await this.recordsService.deleteRecord(Number(id));
      return result;
    } catch (error) {
      return { error: error.message };
    }
  }
}