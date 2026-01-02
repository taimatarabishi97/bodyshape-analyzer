import { supabase } from './supabase';

export interface AdminSession {
  userId: string;
  email: string;
}

/**
 * Sign in admin user with Supabase Auth
 */
export async function signInAdmin(email: string, password: string): Promise<AdminSession | null> {
  if (!supabase) {
    throw new Error('Supabase not configured');
  }

  try {
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Sign in error:', error);
      return null;
    }

    if (!data.user) {
      return null;
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_metadata')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    if (adminError || !adminData) {
      // User is not an admin
      await supabase.auth.signOut();
      return null;
    }

    return {
      userId: data.user.id,
      email: data.user.email || '',
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
}

/**
 * Sign out admin user
 */
export async function signOutAdmin(): Promise<void> {
  if (!supabase) {
    return;
  }

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Get current admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  if (!supabase) {
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_metadata')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (adminError || !adminData) {
      return null;
    }

    return {
      userId: session.user.id,
      email: session.user.email || '',
    };
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated as admin
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null;
}