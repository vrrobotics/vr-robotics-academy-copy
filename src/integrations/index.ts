// Export Supabase CRUD service with alias for backward compatibility
import { SupabaseCrudService } from '../lib/supabaseCrud';

// Export the Supabase service
export { SupabaseCrudService };

// Alias for backward compatibility with existing imports expecting BaseCrudService
export const BaseCrudService = SupabaseCrudService;

// Mock useMember hook for backward compatibility
export const useMember = () => {
  return {
    member: null,
    isLoading: false,
    error: null
  };
};


