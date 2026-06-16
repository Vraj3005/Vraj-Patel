export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectCategory =
  | 'client_software'
  | 'erp_system'
  | 'ecommerce'
  | 'ai_automation'
  | 'quant_research'
  | 'website'
  | 'dashboard';

export type PublishStatus = 'draft' | 'published' | 'archived';

export type ContactMessageStatus = 'new' | 'reviewed' | 'replied' | 'archived';

export type ChatMessageRole = 'user' | 'assistant' | 'system';

export type SkillProficiency = 'expert' | 'advanced' | 'intermediate';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          bio: string | null;
          cv_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          bio?: string | null;
          cv_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          bio?: string | null;
          cv_url?: string | null;
        };
      };
      skill_categories: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          display_order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          display_order?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          display_order?: number;
        };
      };
      skills: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          category_id: string;
          name: string;
          proficiency_level: SkillProficiency;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          category_id: string;
          name: string;
          proficiency_level?: SkillProficiency;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          category_id?: string;
          name?: string;
          proficiency_level?: SkillProficiency;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          category: ProjectCategory;
          featured: boolean;
          status: PublishStatus;
          banner_image_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          slug: string;
          title: string;
          short_description: string;
          description: string;
          category?: ProjectCategory;
          featured?: boolean;
          status?: PublishStatus;
          banner_image_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          slug?: string;
          title?: string;
          short_description?: string;
          description?: string;
          category?: ProjectCategory;
          featured?: boolean;
          status?: PublishStatus;
          banner_image_url?: string | null;
        };
      };
      project_features: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          project_id: string;
          feature_text: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id: string;
          feature_text: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id?: string;
          feature_text?: string;
        };
      };
      project_tech_stack: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          project_id: string;
          technology_name: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id: string;
          technology_name: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id?: string;
          technology_name?: string;
        };
      };
      project_links: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          project_id: string;
          label: string;
          url: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id: string;
          label: string;
          url: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id?: string;
          label?: string;
          url?: string;
        };
      };
      case_studies: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          project_id: string;
          problem_statement: string;
          implemented_solution: string;
          architecture_markdown: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id: string;
          problem_statement: string;
          implemented_solution: string;
          architecture_markdown?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          project_id?: string;
          problem_statement?: string;
          implemented_solution?: string;
          architecture_markdown?: string | null;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          author_id: string | null;
          slug: string;
          title: string;
          content: string;
          cover_image_url: string | null;
          status: PublishStatus;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_id?: string | null;
          slug: string;
          title: string;
          content: string;
          cover_image_url?: string | null;
          status?: PublishStatus;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_id?: string | null;
          slug?: string;
          title?: string;
          content?: string;
          cover_image_url?: string | null;
          status?: PublishStatus;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status: ContactMessageStatus;
          rate_limit_ip: string | null;
          spam_token_checked: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          status?: ContactMessageStatus;
          rate_limit_ip?: string | null;
          spam_token_checked?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          status?: ContactMessageStatus;
          rate_limit_ip?: string | null;
          spam_token_checked?: boolean;
        };
      };
      ai_chat_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string | null;
          user_ip: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string | null;
          user_ip?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string | null;
          user_ip?: string | null;
        };
      };
      ai_chat_messages: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          session_id: string;
          role: ChatMessageRole;
          content: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          session_id: string;
          role: ChatMessageRole;
          content: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          session_id?: string;
          role?: ChatMessageRole;
          content?: string;
        };
      };
      resume_downloads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_ip: string | null;
          referral_source: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_ip?: string | null;
          referral_source?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_ip?: string | null;
          referral_source?: string | null;
        };
      };
      testimonials: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          author_name: string;
          author_title: string;
          author_company: string | null;
          endorsement: string;
          author_avatar_url: string | null;
          status: PublishStatus;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_name: string;
          author_title: string;
          author_company?: string | null;
          endorsement: string;
          author_avatar_url?: string | null;
          status?: PublishStatus;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          author_name?: string;
          author_title?: string;
          author_company?: string | null;
          endorsement?: string;
          author_avatar_url?: string | null;
          status?: PublishStatus;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          event_name: string;
          event_data: Json | null;
          session_ip: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          event_name: string;
          event_data?: Json | null;
          session_ip?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          event_name?: string;
          event_data?: Json | null;
          session_ip?: string | null;
        };
      };
      admin_notes: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          admin_id: string;
          title: string;
          note_body: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          admin_id: string;
          title: string;
          note_body: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          admin_id?: string;
          title?: string;
          note_body?: string;
        };
      };
    };
  };
}
