import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationController } from './controller/donation.controller';
import { DonationService } from './service/donation.service';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { DonationEntity } from './entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonationEntity, CampaignEntity]),
    HttpModule,
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
