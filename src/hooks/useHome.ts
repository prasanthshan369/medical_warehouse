import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home.service';

export const useHomeQuery = () => {
  return useQuery({
    queryKey: ['home-stats'],
    queryFn: () => homeService.fetchStats(),
    staleTime: 60_000, // 1 minute
  });
};
