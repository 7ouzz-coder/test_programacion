import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { Record } from './record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record]),
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [RecordsController],
  providers: [RecordsService],
  exports: [RecordsService],
})
export class RecordsModule {}