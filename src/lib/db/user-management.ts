
import { supabaseAdmin } from '../supabase';

export const createCreatorUser = async () => {
  try {
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'kavaloncorp@gmail.com')
      .single();

    if (existingUser) {
      return { success: false, message: 'El usuario ya existe' };
    }

    // Register the user in auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'kavaloncorp@gmail.com',
      password: 'Jose1879.',
      email_confirm: true
    });

    if (authError) throw authError;

    // Get the creator role id
    const { data: creatorRole, error: roleError } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'creator')
      .single();

    if (roleError) throw roleError;

    // Create the user record
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        id: authUser.user.id,
        name: 'Creator',
        email: 'kavaloncorp@gmail.com',
        role_id: creatorRole.id,
      }]);

    if (userError) throw userError;

    return { success: true, message: 'Usuario creador configurado correctamente' };
  } catch (error) {
    console.error('Error creating creator user:', error);
    return { success: false, message: 'Error al crear el usuario creador: ' + error };
  }
};
