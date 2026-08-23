alter table public.health_habits
  add constraint health_habits_user_name_type_unique
  unique (user_id, name, habit_type);
