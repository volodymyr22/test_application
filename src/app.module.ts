import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { CampaignModule } from './campaign/campaign.module';
import { DonationModule } from './donation/donation.module';

import { typeormConfig } from './db/config/typeorm.config';

@Module({
  imports: [
    CampaignModule,
    TypeOrmModule.forRoot(typeormConfig),
    ScheduleModule.forRoot(),
    DonationModule,
  ],
})
export class AppModule {}
