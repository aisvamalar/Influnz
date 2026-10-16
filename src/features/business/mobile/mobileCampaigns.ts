/**
 * Campaigns shown across the mobile business screens (list, workspace, analytics).
 */
import cafeImg from '../../../assets/campaigns/chennai-cafe.png';
import fashionImg from '../../../assets/campaigns/mumbai-fashion.png';
import techImg from '../../../assets/campaigns/bangalore-tech.png';
import festiveImg from '../../../assets/campaigns/delhi-festive.png';

export type Status = 'active' | 'pending' | 'draft' | 'completed';
export type Platform = 'Instagram' | 'YouTube';

export interface Campaign {
  id: number;
  name: string;
  status: Status;
  description: string;
  platform: Platform;
  dates: string;
  location: string;
  category: string;
  budget: number;
  spent: number;
  image: string;
}

export const CAMPAIGNS: Campaign[] = [
  { id: 1, name: 'Chennai Café Launch', status: 'active', description: 'Drive local store visits through Tamil-speaking food creators', platform: 'Instagram', dates: '30 Sep – 15 Oct 2026', location: 'Chennai • 15 km', category: 'Food & Beverage', budget: 150000, spent: 102000, image: cafeImg },
  { id: 2, name: 'Mumbai Fashion Drop', status: 'pending', description: 'Promote the new collection through fashion creators', platform: 'Instagram', dates: '10 Oct – 25 Oct 2026', location: 'Mumbai', category: 'Fashion', budget: 80000, spent: 20000, image: fashionImg },
  { id: 3, name: 'Bangalore Tech Event', status: 'pending', description: 'Event coverage and product showcases', platform: 'YouTube', dates: '20 Oct – 05 Nov 2026', location: 'Bangalore', category: 'Tech', budget: 60000, spent: 0, image: techImg },
  { id: 4, name: 'Delhi Festive Campaign', status: 'completed', description: 'Festive campaign with lifestyle creators', platform: 'Instagram', dates: '15 Sep – 30 Sep 2026', location: 'Delhi', category: 'Lifestyle', budget: 200000, spent: 194000, image: festiveImg },
  { id: 5, name: 'Diwali Collection', status: 'pending', description: 'Festive edit with lifestyle creators for the Diwali drop', platform: 'Instagram', dates: '18 Oct – 08 Nov 2026', location: 'Chennai', category: 'Lifestyle', budget: 200000, spent: 0, image: festiveImg },
  { id: 6, name: 'Summer Drinks', status: 'active', description: 'Cold-drink specials through food creators', platform: 'Instagram', dates: '01 Oct – 20 Oct 2026', location: 'Chennai • 10 km', category: 'Food & Beverage', budget: 80000, spent: 45000, image: 'https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=1200&q=80' },
];

export const STATUS_LABEL: Record<Status, string> = {
  active: 'Active',
  pending: 'Pending',
  draft: 'Draft',
  completed: 'Completed',
};
