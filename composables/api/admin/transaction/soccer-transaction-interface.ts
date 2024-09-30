export interface SoccerDailyAvailabilityInterface {
  master_availability?: number;
  status: string;
  rateName?: string;
  rateAvailability: RateAvailabilityInterface[];
}

export interface RateAvailabilityInterface {
  time: number;
  price: number;
  status: string;
  reservedBy?: {
    hour: number;
    hp?: string;
    status: string;
    name: string;
    receipt_no: string;
    expired?: string;
    expired_timezone?: string;
  };
}
