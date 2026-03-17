import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO DO SUPABASE
 * 
 * Para conectar ao seu banco de dados:
 * 1. Crie um projeto em https://supabase.com
 * 2. Vá em Project Settings > API
 * 3. Copie a 'Project URL' e a 'anon public' key para as constantes abaixo.
 */

// Use uma URL válida (mesmo que placeholder) para evitar o erro "Failed to construct 'URL'"
const supabaseUrl = 'https://seu-projeto-id.supabase.co'; 
const supabaseAnonKey = 'sua-chave-anon-publica';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
