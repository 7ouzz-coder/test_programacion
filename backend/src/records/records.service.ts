import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Record } from './record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
  ) {}

  async getAllRecords(filters: any) {
    console.log('filtros recibidos:', filters);
    
    const query = this.recordRepository.createQueryBuilder('record');

    if (filters.category) {
      query.andWhere('record.category = :category', { 
        category: filters.category 
      });
    }

    if (filters.status) {
      query.andWhere('record.status = :status', { 
        status: filters.status 
      });
    }

    if (filters.search) {
      query.andWhere(
        '(record.sourceId LIKE :search OR record.description LIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    query.orderBy('record.date', 'DESC');

    let page = filters.page || 1;
    let limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit);

    const [records, total] = await query.getManyAndCount();
    console.log('encontrados:', total);

    return {
      data: records,
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getRecordById(id: number) {
    const record = await this.recordRepository.findOne({ 
      where: { id } 
    });

    if (!record) {
      throw new Error('Record no encontrado');
    }

    return record;
  }

  async createRecord(data: any) {
    console.log('creando record:', data);
    
    const existing = await this.recordRepository.findOne({
      where: { sourceId: data.sourceId },
    });

    if(existing) {
      throw new Error('Ya existe un record con ese sourceId');
    }

    let record = new Record();
    record.sourceId = data.sourceId;
    record.date = data.date;
    record.category = data.category;
    record.amount = data.amount;
    record.status = data.status;
    record.description = data.description || '';

    const saved = await this.recordRepository.save(record);
    console.log('record creado con id:', saved.id);
    
    return saved;
  }

  async updateRecord(id: number, data: any) {
    console.log('actualizando record:', id);
    
    const record = await this.getRecordById(id);

    if(data.sourceId) record.sourceId = data.sourceId;
    if(data.date) record.date = data.date;
    if(data.category) record.category = data.category;
    if(data.amount) record.amount = data.amount;
    if(data.status) record.status = data.status;
    if(data.description !== undefined) record.description = data.description;

    const updated = await this.recordRepository.save(record);
    console.log('actualizado');
    
    return updated;
  }

  async deleteRecord(id: number) {
    const record = await this.getRecordById(id);
    await this.recordRepository.remove(record);
    console.log('eliminado record:', id);
    
    return { message: 'Record eliminado correctamente' };
  }

  async createOrUpdate(data: any) {
    const existing = await this.recordRepository.findOne({
      where: { sourceId: data.sourceId },
    });

    if (existing) {
      existing.date = data.date;
      existing.category = data.category;
      existing.amount = data.amount;
      existing.status = data.status;
      existing.description = data.description || '';
      return await this.recordRepository.save(existing);
    } else {
      let record = new Record();
      record.sourceId = data.sourceId;
      record.date = data.date;
      record.category = data.category;
      record.amount = data.amount;
      record.status = data.status;
      record.description = data.description || '';
      return await this.recordRepository.save(record);
    }
  }

  async insertMany(records: any[]) {
    let inserted = 0;
    let updated = 0;

    console.log('insertando', records.length, 'records...');

    for (let i = 0; i < records.length; i++) {
      const recordData = records[i];
      
      const existing = await this.recordRepository.findOne({
        where: { sourceId: recordData.sourceId },
      });

      if (existing) {
        existing.date = recordData.date;
        existing.category = recordData.category;
        existing.amount = recordData.amount;
        existing.status = recordData.status;
        existing.description = recordData.description || '';
        await this.recordRepository.save(existing);
        updated++;
      } else {
        let record = new Record();
        record.sourceId = recordData.sourceId;
        record.date = recordData.date;
        record.category = recordData.category;
        record.amount = recordData.amount;
        record.status = recordData.status;
        record.description = recordData.description || '';
        await this.recordRepository.save(record);
        inserted++;
      }
      
      if((i+1) % 10 === 0){
        console.log('procesados:', i+1);
      }
    }

    console.log('resultado:', inserted, 'insertados,', updated, 'actualizados');

    return { inserted, updated };
  }
}