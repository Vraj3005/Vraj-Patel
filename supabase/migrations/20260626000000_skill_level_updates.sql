-- Migration to alter skill_proficiency enum to support 'beginner'
ALTER TYPE public.skill_proficiency ADD VALUE IF NOT EXISTS 'beginner';
