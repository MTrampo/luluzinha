CREATE TABLE public.profiles (
  -- O ID deve ser idêntico ao do Auth para o vínculo funcionar
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  
  -- Dados básicos
  full_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT NULL,
  
  -- Timestamps básicos
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar a segurança para que um usuário não mude o perfil do outro
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil" 
ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);