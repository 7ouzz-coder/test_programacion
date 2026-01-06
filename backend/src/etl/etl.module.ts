import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EtlController } from './etl.controller';
import { EtlService } from './etl.service';
import { RecordsModule } from '../records/records.module';

@Module({
  imports: [
    RecordsModule,
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [EtlController],
  providers: [EtlService],
})
export class EtlModule {}