import { DonationEntity } from 'src/donation/entities/donation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CampainStatus } from '../../types/campaign_status.enum';
import { OwnerEntity } from './owner.entity';

@Entity({ name: 'campaigns' })
export class CampaignEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'double' })
  goal: number;

  @Column({ type: 'date' })
  expires_at: Date;

  @ManyToOne(() => OwnerEntity, (owner) => owner.campaigns)
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerEntity;
  @Column({ type: 'enum', enum: CampainStatus })
  status: CampainStatus;

  @OneToMany(() => DonationEntity, (donation) => donation.campaignId)
  donations: DonationEntity[];
  @Column({})
  currency: string;
}
