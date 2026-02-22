import { Member } from ".";
import { supabase } from "../../src/lib/supabase";

/**
 * Retrieves the current authenticated member using Supabase Auth.
 * Returns user information in Member format if authenticated, otherwise null.
 */
export const getCurrentMember = async (): Promise<Member | null> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.log("==== No member found");
      return null;
    }

    // Optionally, transform Supabase User object to the expected Member type
    // Adjust mapping here as needed
    const member: Member = {
      // Example properties, adjust as needed to match your Member interface
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    };

    return member;
  } catch (err) {
    console.log(err);
    return null;
  }
};
