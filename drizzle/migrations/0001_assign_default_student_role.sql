CREATE OR REPLACE FUNCTION public.assign_default_student_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER profiles_assign_default_role AFTER INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.assign_default_student_role();