import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { RecordsService } from '../records/records.service';

@Injectable()
export class EtlService {
  constructor(private recordsService: RecordsService) { }

  async processPdf() {
    console.log('=================================');
    console.log('Iniciando proceso ETL...');
    console.log('=================================');

    try {
      let pdfPath = path.join(process.cwd(), '..', 'data', 'data.pdf');
      if (!fs.existsSync(pdfPath)) {
        pdfPath = path.join(process.cwd(), '..', 'data', 'Data.pdf');
      }

      console.log('Buscando PDF en:', pdfPath);
      console.log('Existe?', fs.existsSync(pdfPath));

      const datosExtraidos = await this.extractPdfData(pdfPath) as any[];
      console.log('Datos extraídos del PDF:', datosExtraidos.length);
      if (datosExtraidos.length > 0) {
        console.log('Primer dato:', datosExtraidos[0]);
      }

      const datosNormalizados = this.normalizeData(datosExtraidos);
      console.log('Datos normalizados:', datosNormalizados.length);

      const resultado = await this.recordsService.insertMany(datosNormalizados);
      console.log('Proceso completado!');

      return {
        success: true,
        message: 'Proceso completado exitosamente',
        stats: {
          extracted: datosExtraidos.length,
          normalized: datosNormalizados.length,
          inserted: resultado.inserted,
          updated: resultado.updated,
        },
      };
    } catch (error) {
      console.error('ERROR en ETL:', error.message);
      console.error(error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  private async extractPdfData(pdfPath: string) {
    if (!fs.existsSync(pdfPath)) {
      throw new Error('No se encontró el archivo PDF en: ' + pdfPath);
    }

    console.log('Leyendo archivo PDF con pdf-parse...');

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdf = require('pdf-parse');

    const data = await pdf(dataBuffer);

    console.log('PDF parseado correctamente');
    console.log('Total páginas:', data.numpages);
    console.log('Texto extraído length:', data.text.length);

    const registros = this.parseText(data.text);
    return registros;
  }

  private parseText(text: string) {
    let records: any[] = [];
    const lineas = text.split('\n');

    console.log('Total de líneas:', lineas.length);

    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i].trim();

      if (!linea || linea.length < 20) continue;

      // Saltar headers y títulos
      if (linea.includes('Source ID') || linea.includes('Categoría') ||
        linea.includes('Reporte') || linea.includes('Transacciones')) {
        continue;
      }

      // Regex para formato concatenado: INV-2025-00111-10-2025Servicios$1.666canceladoDescripción
      const match = linea.match(/^(INV-\d+-\d+)(\d{2}-\d{2}-\d{4})([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\$?([\d.,]+)(activo|pendiente|completado|cancelado)(.*)$/);

      if (match) {
        const record = {
          sourceId: match[1],
          date: match[2],
          category: match[3],
          amount: '$' + match[4],
          status: match[5],
          description: match[6] || '',
        };

        records.push(record);

        if (records.length % 10 === 0) {
          console.log('Extraídos hasta ahora:', records.length);
        }
      }
    }

    console.log('Total registros extraídos:', records.length);
    if (records.length > 0) {
      console.log('Primer registro extraído:', records[0]);
      console.log('Último registro extraído:', records[records.length - 1]);
    }
    return records;
  }

  private normalizeData(rawData: any[]) {
    let normalized: any[] = [];
    console.log('Normalizando datos...');

    for (let i = 0; i < rawData.length; i++) {
      const record = rawData[i];
      try {
        const normalizedRecord = {
          sourceId: this.normalizeSourceId(record.sourceId, i),
          date: this.normalizeDate(record.date),
          category: this.normalizeCategory(record.category),
          amount: this.normalizeAmount(record.amount),
          status: this.normalizeStatus(record.status),
          description: record.description || '',
        };
        normalized.push(normalizedRecord);
      } catch (error) {
        console.error('Error normalizando registro', i, ':', error.message);
      }
    }
    return normalized;
  }

  private normalizeSourceId(sourceId: string, index: number): string {
    if (!sourceId || sourceId.trim() === '') {
      return `AUTO-${Date.now()}-${index}`;
    }
    return sourceId.trim().toUpperCase();
  }

  private normalizeDate(dateStr: string): string {
    if (!dateStr) {
      let today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        let day = parts[0].padStart(2, '0');
        let month = parts[1].padStart(2, '0');
        let year = parts[2];
        if (year.length === 2) {
          year = '20' + year;
        }
        return `${year}-${month}-${day}`;
      }
    }

    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        let day = parts[0].padStart(2, '0');
        let month = parts[1].padStart(2, '0');
        let year = parts[2];
        if (year.length === 2) {
          year = '20' + year;
        }
        return `${year}-${month}-${day}`;
      }
    }
    return dateStr;
  }

  private normalizeCategory(category: string): string {
    if (!category) return 'Sin Categoría';
    const words = category.trim().toLowerCase().split(' ');
    let capitalized = words.map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalized.join(' ');
  }

  private normalizeAmount(amount: any): number {
    if (typeof amount === 'number') {
      return Math.abs(amount);
    }
    let cleaned = String(amount)
      .replace(/[$€£¥]/g, '')
      .replace(/,/g, '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .trim();
    let parsed = parseFloat(cleaned);
    if (isNaN(parsed)) {
      console.warn('No se pudo parsear monto:', amount, '- usando 0');
      return 0;
    }
    return Math.abs(parsed);
  }

  private normalizeStatus(status: string): string {
    if (!status) return 'pendiente';
    let normalized = status.trim().toLowerCase();
    if (normalized === 'activo' || normalized === 'active') return 'activo';
    if (normalized === 'completado' || normalized === 'completed' || normalized === 'completo') return 'completado';
    if (normalized === 'pendiente' || normalized === 'pending') return 'pendiente';
    if (normalized === 'cancelado' || normalized === 'cancelled' || normalized === 'canceled') return 'cancelado';
    return 'pendiente';
  }
}