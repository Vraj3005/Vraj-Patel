'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DeveloperConsole from '@/components/console/developer-console';
import {
  LayoutDashboard,
  Briefcase,
  Award,
  BookOpen,
  Mail,
  MessageSquare,
  Download,
  Activity,
  LogOut,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  Terminal,
  ShieldCheck,
  Monitor,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  User,
  RefreshCw
} from 'lucide-react';

// --------------------------------------------------------------------
// Type Definitions & Interfaces
// --------------------------------------------------------------------
interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

interface ChatSession {
  id: string;
  created_at: string;
  title: string;
  user_ip: string;
  messages: ChatMessage[];
}

interface ProjectData {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description?: string;
  shortDescription?: string;
  description: string;
  status: string;
  featured: boolean;
  banner_image_url?: string;
  image?: string;
  created_at?: string;
}

interface SkillData {
  id: string;
  name: string;
  category?: string;
  category_id?: string;
  proficiency_level: 'expert' | 'advanced' | 'intermediate';
  created_at?: string;
}

interface BlogData {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  cover_image_url?: string;
  created_at?: string;
}

interface DownloadData {
  id: string;
  created_at: string;
  user_ip: string;
  referral_source: string;
}

interface AnalyticsData {
  id: string;
  created_at: string;
  event_name: string;
  event_data: unknown;
  session_ip: string;
}

interface DashboardStats {
  projects: number;
  skills: number;
  inquiries: number;
  chats: number;
  blogs: number;
  downloads: number;
  analytics: number;
}

// --------------------------------------------------------------------
// Validation Schemas via Zod
// --------------------------------------------------------------------
const projectFormSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  slug: z.string().min(2, 'Slug is required.').regex(/^[a-z0-9-_]+$/, 'Lowercase, numbers, dashes only.'),
  category: z.enum([
    'Client Software', 'ERP Systems', 'E-commerce', 'AI Automation', 
    'Quant Research', 'Websites', 'Dashboards'
  ]),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  image: z.string().min(3, 'Featured image path is required.'),
  status: z.enum(['Live', 'Private', 'In Development']),
  featured: z.boolean(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const skillFormSchema = z.object({
  name: z.string().min(1, 'Skill name is required.'),
  category: z.enum(['Languages', 'Frontend Development', 'Backend & APIs', 'Databases & Systems']),
  proficiency_level: z.enum(['expert', 'advanced', 'intermediate']),
});

type SkillFormValues = z.infer<typeof skillFormSchema>;

const blogFormSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  slug: z.string().min(3, 'Slug is required.').regex(/^[a-z0-9-_]+$/, 'Lowercase, numbers, dashes only.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
  status: z.enum(['draft', 'published', 'archived']),
  cover_image_url: z.string().optional().or(z.string().max(0)),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

// --------------------------------------------------------------------
// Main Component
// --------------------------------------------------------------------
export default function AdminDashboard() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'skills' | 'blogs' | 'inquiries' | 'chats' | 'downloads' | 'analytics'>('overview');
  
  // States holding collections
  const [stats, setStats] = useState<DashboardStats>({ projects: 0, skills: 0, inquiries: 0, chats: 0, blogs: 0, downloads: 0, analytics: 0 });
  const [projectsList, setProjectsList] = useState<ProjectData[]>([]);
  const [skillsList, setSkillsList] = useState<SkillData[]>([]);
  const [blogsList, setBlogsList] = useState<BlogData[]>([]);
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [downloadsList, setDownloadsList] = useState<DownloadData[]>([]);
  const [analyticsList, setAnalyticsList] = useState<AnalyticsData[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChatSessionId, setSelectedChatSessionId] = useState<string | null>(null);
  
  // Notification states
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // Modals management
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [activeEditingProject, setActiveEditingProject] = useState<ProjectData | null>(null);
  
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [activeEditingSkill, setActiveEditingSkill] = useState<SkillData | null>(null);

  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [activeEditingBlog, setActiveEditingBlog] = useState<BlogData | null>(null);

  // Forms setup
  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { title: '', slug: '', category: 'Websites', shortDescription: '', description: '', image: '', status: 'In Development', featured: false },
  });

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: { name: '', category: 'Languages', proficiency_level: 'advanced' },
  });

  const blogForm = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: { title: '', slug: '', content: '', status: 'draft', cover_image_url: '' },
  });

  // Toast Helper
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // 1. Verify User Credentials
  const checkAuth = useCallback(async () => {
    try {
      if (!isSupabaseConfigured) {
        // Dev offline validation
        const cookies = typeof document !== 'undefined' ? document.cookie : '';
        if (cookies.includes('sb-mock-session=true')) {
          setAdminEmail(prev => prev !== 'patelvrajpatel30@gmail.com' ? 'patelvrajpatel30@gmail.com' : prev);
          setIsLoading(prev => prev !== false ? false : prev);
          return;
        }
        router.push('/admin/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== 'patelvrajpatel30@gmail.com') {
        router.push('/admin/login');
        return;
      }
      setAdminEmail(prev => prev !== user.email ? (user.email || '') : prev);
      setIsLoading(prev => prev !== false ? false : prev);
    } catch (err) {
      console.error('Auth verification error:', err);
      router.push('/admin/login');
    }
  }, [router]);

  // 2. Fetch Tab Content dynamically
  const fetchTabContent = useCallback(async (tabName: string) => {
    try {
      const res = await fetch(`/api/admin/data?type=${tabName}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || `Failed to fetch ${tabName}`);
      
      const warningHeader = res.headers.get('x-supabase-warning');
      if (warningHeader === 'tables-missing') {
        triggerToast('Database tables not initialized in Supabase. Falling back to local database. Please execute migrations.', 'error');
      }
      
      if (tabName === 'overview') {
        setStats(payload.stats);
      } else if (tabName === 'projects') {
        setProjectsList(payload.data || []);
      } else if (tabName === 'skills') {
        setSkillsList(payload.data || []);
      } else if (tabName === 'blogs') {
        setBlogsList(payload.data || []);
      } else if (tabName === 'inquiries') {
        setInquiriesList(payload.data || []);
      } else if (tabName === 'chats') {
        setChatSessions(payload.data || []);
        if (payload.data?.length > 0 && !selectedChatSessionId) {
          setSelectedChatSessionId(payload.data[0].id);
        }
      } else if (tabName === 'downloads') {
        setDownloadsList(payload.data || []);
      } else if (tabName === 'analytics') {
        setAnalyticsList(payload.data || []);
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Telemetry sync failure';
      triggerToast(message, 'error');
    }
  }, [selectedChatSessionId]);

  // Handle Tab Switch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && adminEmail) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchTabContent(activeTab);
    }
  }, [activeTab, isLoading, adminEmail, fetchTabContent]);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      } else {
        document.cookie = 'sb-mock-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
      triggerToast('Terminal connection closed successfully.');
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // 3. Modals & Forms Handlers
  // A. Projects
  const openProjectModal = (proj: ProjectData | null = null) => {
    setActiveEditingProject(proj);
    if (proj) {
      // Map categories and status strings
      const categoryMap: Record<string, string> = {
        'client_software': 'Client Software',
        'erp_system': 'ERP Systems',
        'ecommerce': 'E-commerce',
        'ai_automation': 'AI Automation',
        'quant_research': 'Quant Research',
        'website': 'Websites',
        'dashboard': 'Dashboards'
      };
      
      const statusMap: Record<string, string> = {
        'published': 'Live',
        'draft': 'In Development',
        'archived': 'Private'
      };

      projectForm.reset({
        title: proj.title,
        slug: proj.slug,
        category: (categoryMap[proj.category] || proj.category) as ProjectFormValues['category'],
        shortDescription: proj.short_description || proj.shortDescription || '',
        description: proj.description,
        image: proj.banner_image_url || proj.image || '',
        status: (statusMap[proj.status] || proj.status) as ProjectFormValues['status'],
        featured: proj.featured || false,
      });
    } else {
      projectForm.reset({ title: '', slug: '', category: 'Websites', shortDescription: '', description: '', image: '', status: 'In Development', featured: false });
    }
    setProjectModalOpen(true);
  };

  const handleProjectSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    try {
      const isEdit = !!activeEditingProject;
      const method = isEdit ? 'PUT' : 'POST';
      const bodyPayload = isEdit 
        ? { id: activeEditingProject.id, ...values }
        : values;

      const res = await fetch('/api/admin/data?type=projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit project parameters.');

      triggerToast(`Project parameter trace ${isEdit ? 'updated' : 'inserted'} successfully.`);
      setProjectModalOpen(false);
      fetchTabContent('projects');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Project submission failed';
      triggerToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This is irreversible.')) return;
    try {
      const res = await fetch(`/api/admin/data?type=projects&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project.');
      triggerToast('Project record deleted.');
      fetchTabContent('projects');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete project';
      triggerToast(message, 'error');
    }
  };

  const handleToggleProjectStatus = async (proj: ProjectData) => {
    try {
      const nextStatus = proj.status === 'published' ? 'draft' : 'published';
      const res = await fetch('/api/admin/data?type=projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: proj.id, status: nextStatus }),
      });
      if (!res.ok) throw new Error('Toggle status failed.');
      triggerToast('Project deployment state toggled.');
      fetchTabContent('projects');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Toggle status failed';
      triggerToast(message, 'error');
    }
  };

  // B. Skills
  const openSkillModal = (sk: SkillData | null = null) => {
    setActiveEditingSkill(sk);
    if (sk) {
      skillForm.reset({
        name: sk.name,
        category: (sk.category || 'Languages') as SkillFormValues['category'],
        proficiency_level: sk.proficiency_level,
      });
    } else {
      skillForm.reset({ name: '', category: 'Languages', proficiency_level: 'advanced' });
    }
    setSkillModalOpen(true);
  };

  const handleSkillSubmit = async (values: SkillFormValues) => {
    setIsSubmitting(true);
    try {
      const isEdit = !!activeEditingSkill;
      const method = isEdit ? 'PUT' : 'POST';
      const bodyPayload = isEdit 
        ? { id: activeEditingSkill.id, ...values }
        : values;

      const res = await fetch('/api/admin/data?type=skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit skill details.');

      triggerToast(`Skill metrics ${isEdit ? 'updated' : 'inserted'} successfully.`);
      setSkillModalOpen(false);
      fetchTabContent('skills');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Skill submission failed';
      triggerToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Delete this skill metric?')) return;
    try {
      const res = await fetch(`/api/admin/data?type=skills&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete skill.');
      triggerToast('Skill index deleted.');
      fetchTabContent('skills');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete skill';
      triggerToast(message, 'error');
    }
  };

  // C. Blogs
  const openBlogModal = (blog: BlogData | null = null) => {
    setActiveEditingBlog(blog);
    if (blog) {
      blogForm.reset({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        status: blog.status,
        cover_image_url: blog.cover_image_url || '',
      });
    } else {
      blogForm.reset({ title: '', slug: '', content: '', status: 'draft', cover_image_url: '' });
    }
    setBlogModalOpen(true);
  };

  const handleBlogSubmit = async (values: BlogFormValues) => {
    setIsSubmitting(true);
    try {
      const isEdit = !!activeEditingBlog;
      const method = isEdit ? 'PUT' : 'POST';
      const bodyPayload = isEdit 
        ? { id: activeEditingBlog.id, ...values }
        : values;

      const res = await fetch('/api/admin/data?type=blogs', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit research note.');

      triggerToast(`Research note ${isEdit ? 'updated' : 'published'} successfully.`);
      setBlogModalOpen(false);
      fetchTabContent('blogs');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Blog submission failed';
      triggerToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this research note?')) return;
    try {
      const res = await fetch(`/api/admin/data?type=blogs&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete blog.');
      triggerToast('Research note deleted.');
      fetchTabContent('blogs');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Deletion failed';
      triggerToast(message, 'error');
    }
  };

  // D. Contact submissions
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this inquiry communication?')) return;
    try {
      const res = await fetch(`/api/admin/data?type=inquiries&id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inquiry.');
      triggerToast('Recruiter inquiry logs removed.');
      fetchTabContent('inquiries');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete inquiry';
      triggerToast(message, 'error');
    }
  };

  // Search & Filter filterings
  const filteredProjects = projectsList.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSkills = skillsList.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBlogs = blogsList.filter(b =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInquiries = inquiriesList.filter(i =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChatSession = chatSessions.find(s => s.id === selectedChatSessionId);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
        <RefreshCw className="h-8 w-8 text-foreground animate-spin" />
        <span className="text-xs text-secondary font-mono tracking-widest uppercase">Authorizing Admin Console...</span>
      </div>
    );
  }

  return (
    <div className="py-4 md:py-8 flex flex-col md:flex-row gap-6 items-start max-w-7xl mx-auto w-full min-h-[calc(100vh-140px)]">
      
      {/* Toast popup */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl border shadow-xl font-mono text-xs ${
              toastType === 'success'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-red-500/5 text-red-500 border-red-500/20'
            }`}
          >
            {toastType === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Sidebar Control Deck */}
      <Card className="w-full md:w-64 p-4 shrink-0 flex flex-col gap-6 bg-card-bg/95 border-card-border">
        <div className="flex items-center gap-2 border-b border-card-border pb-4">
          <div className="h-8 w-8 rounded-lg bg-foreground/5 border border-card-border flex items-center justify-center text-foreground font-mono font-bold">
            VP
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-foreground font-mono">Control Node</span>
            <span className="text-[10px] text-secondary font-mono">vraj.patel()</span>
          </div>
        </div>

        {/* Tab directory */}
        <nav className="flex flex-col gap-1 flex-1">
          <button
            onClick={() => { setActiveTab('overview'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Overview Dashboard
          </button>
          
          <button
            onClick={() => { setActiveTab('projects'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <Briefcase className="h-4 w-4" /> Manage Projects
          </button>

          <button
            onClick={() => { setActiveTab('skills'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <Award className="h-4 w-4" /> Skill Matrix
          </button>

          <button
            onClick={() => { setActiveTab('blogs'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <BookOpen className="h-4 w-4" /> Research Notes
          </button>

          <button
            onClick={() => { setActiveTab('inquiries'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <Mail className="h-4 w-4" /> Recruiter Leads ({stats.inquiries})
          </button>

          <button
            onClick={() => { setActiveTab('chats'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'chats'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <MessageSquare className="h-4 w-4" /> AI Telemetry
          </button>

          <button
            onClick={() => { setActiveTab('downloads'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'downloads'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <Download className="h-4 w-4" /> Resume Downloads ({stats.downloads})
          </button>

          <button
            onClick={() => { setActiveTab('analytics'); setSearchTerm(''); }}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-foreground/5 text-foreground border-l-2 border-foreground'
                : 'text-secondary hover:text-foreground hover:bg-foreground/[0.02]'
            }`}
          >
            <Activity className="h-4 w-4" /> Event Stream
          </button>
        </nav>

        {/* Footer profile & logout */}
        <div className="border-t border-card-border pt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5 px-2">
            <span className="text-[9px] font-bold text-secondary font-mono uppercase">Authorized Identity</span>
            <span className="text-[10px] text-foreground font-semibold font-mono truncate">{adminEmail}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="sm"
            className="flex items-center justify-center gap-1.5 font-bold cursor-pointer text-red-500 hover:bg-red-500/5 hover:border-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" /> Disconnect Terminal
          </Button>
        </div>
      </Card>

      {/* 2. Main Terminal Content Area */}
      <div className="flex-1 w-full min-h-[500px]">
        
        {/* TAB: Overview */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-card-border pb-4">
              <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-secondary" /> Overview Dashboard
              </h1>
              <p className="text-xs text-secondary mt-1">Real-time status summaries of portfolio components and visitor activities.</p>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-secondary font-mono flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> Projects
                </span>
                <span className="text-xl font-bold font-mono text-foreground">{stats.projects}</span>
                <span className="text-[10px] text-secondary font-mono">Total cases published</span>
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-secondary font-mono flex items-center gap-1">
                  <Award className="h-3 w-3" /> Skill Elements
                </span>
                <span className="text-xl font-bold font-mono text-foreground">{stats.skills}</span>
                <span className="text-[10px] text-secondary font-mono">Expert/advanced levels</span>
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-secondary font-mono flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Inquiries
                </span>
                <span className="text-xl font-bold font-mono text-foreground">{stats.inquiries}</span>
                <span className="text-[10px] text-secondary font-mono">Recruiter mail messages</span>
              </Card>

              <Card className="p-4 flex flex-col gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-secondary font-mono flex items-center gap-1">
                  <Download className="h-3 w-3" /> Resume Downloads
                </span>
                <span className="text-xl font-bold font-mono text-foreground">{stats.downloads}</span>
                <span className="text-[10px] text-secondary font-mono">CV downloads triggers</span>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Quick Status Block */}
              <Card className="p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold font-mono uppercase border-b border-card-border pb-2 text-foreground">
                  System Health Metrics
                </h3>
                <div className="flex flex-col gap-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Supabase Status</span>
                    <span className="text-foreground font-bold flex items-center gap-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${isSupabaseConfigured ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                      {isSupabaseConfigured ? 'Live Network Connected' : 'Local Fallback Storage'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Gemini Assistant</span>
                    <span className="text-foreground font-bold flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" /> Operational
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary">Security Policies</span>
                    <span className="text-foreground font-bold flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4 text-green-500" /> RLS Active
                    </span>
                  </div>
                </div>
              </Card>

              {/* Developer identity summary */}
              <Card className="p-5 flex flex-col gap-4">
                <h3 className="text-xs font-bold font-mono uppercase border-b border-card-border pb-2 text-foreground">
                  Developer Identity Card
                </h3>
                <div className="flex flex-col gap-2.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-secondary">Full Name</span>
                    <span className="text-foreground font-bold">Vraj Patel</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Academic Institution</span>
                    <span className="text-foreground font-bold">Nirma University</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Coursework Status</span>
                    <span className="text-foreground font-bold">4th-Year Undergrad (CSE)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: Projects */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div>
                <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-secondary" /> Manage Case Studies
                </h1>
                <p className="text-xs text-secondary mt-1">Publish and edit the project catalog displaying on the portfolio UI.</p>
              </div>
              <Button
                onClick={() => openProjectModal(null)}
                variant="primary"
                size="sm"
                className="flex items-center gap-1 font-bold cursor-pointer text-xs"
              >
                <Plus className="h-4 w-4" /> Add Case Study
              </Button>
            </div>

            {/* Filter search bar */}
            <div className="flex gap-2 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search projects by title or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs py-2 rounded-xl border-card-border"
              />
            </div>

            {/* Projects table */}
            {filteredProjects.length > 0 ? (
              <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg/60">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-foreground/[0.02] text-secondary">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => {
                      const isPub = p.status === 'published' || p.status === 'Live';
                      return (
                        <tr key={p.id} className="border-b border-card-border hover:bg-foreground/[0.01]">
                          <td className="p-4 font-bold text-foreground">{p.title}</td>
                          <td className="p-4 text-secondary">{p.category}</td>
                          <td className="p-4">
                            <Badge variant={isPub ? 'primary' : 'outline'} className="text-[9px] py-0.5">
                              {isPub ? 'Published' : 'Draft / Private'}
                            </Badge>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleProjectStatus(p)}
                              title={isPub ? 'Unpublish' : 'Publish'}
                              className="p-1.5 text-secondary hover:text-foreground rounded-lg border border-card-border bg-card-bg hover:bg-foreground/5 cursor-pointer"
                            >
                              {isPub ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => openProjectModal(p)}
                              className="p-1.5 text-secondary hover:text-foreground rounded-lg border border-card-border bg-card-bg hover:bg-foreground/5 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="p-1.5 text-secondary hover:text-red-500 rounded-lg border border-card-border bg-card-bg hover:bg-red-500/5 hover:border-red-500/10 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="py-20 text-center border-dashed border-card-border flex flex-col items-center justify-center">
                <Briefcase className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground font-mono uppercase">No projects cataloged</h4>
                <p className="text-xs text-secondary mt-1 max-w-xs font-medium">Click &quot;Add Case Study&quot; to populate your database.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB: Skills */}
        {activeTab === 'skills' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div>
                <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" /> Skill Index Management
                </h1>
                <p className="text-xs text-secondary mt-1">Manage technical expertise levels displayed in the skill matrices.</p>
              </div>
              <Button
                onClick={() => openSkillModal(null)}
                variant="primary"
                size="sm"
                className="flex items-center gap-1 font-bold cursor-pointer text-xs"
              >
                <Plus className="h-4 w-4" /> Add Skill Metric
              </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search skills by name or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs py-2 rounded-xl border-card-border"
              />
            </div>

            {/* Skills Table */}
            {filteredSkills.length > 0 ? (
              <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg/60">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-foreground/[0.02] text-secondary">
                      <th className="p-4">Skill Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Proficiency Level</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSkills.map((s) => (
                      <tr key={s.id} className="border-b border-card-border hover:bg-foreground/[0.01]">
                        <td className="p-4 font-bold text-foreground">{s.name}</td>
                        <td className="p-4 text-secondary">{s.category || 'Unassigned'}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-[9px] py-0.5 uppercase tracking-wide">
                            {s.proficiency_level}
                          </Badge>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <button
                            onClick={() => openSkillModal(s)}
                            className="p-1.5 text-secondary hover:text-foreground rounded-lg border border-card-border bg-card-bg hover:bg-foreground/5 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(s.id)}
                            className="p-1.5 text-secondary hover:text-red-500 rounded-lg border border-card-border bg-card-bg hover:bg-red-500/5 hover:border-red-500/10 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="py-20 text-center border-dashed border-card-border flex flex-col items-center justify-center">
                <Award className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground font-mono uppercase">No skills records found</h4>
                <p className="text-xs text-secondary mt-1 max-w-xs font-medium">Add a skill to display in your profile page.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB: Blogs */}
        {activeTab === 'blogs' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-card-border pb-4">
              <div>
                <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-secondary" /> Research & Blogs
                </h1>
                <p className="text-xs text-secondary mt-1">Publish research notes, quant models documentation, or logs summaries.</p>
              </div>
              <Button
                onClick={() => openBlogModal(null)}
                variant="primary"
                size="sm"
                className="flex items-center gap-1 font-bold cursor-pointer text-xs"
              >
                <Plus className="h-4 w-4" /> Create Note
              </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search research notes by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs py-2 rounded-xl border-card-border"
              />
            </div>

            {/* Blogs Table */}
            {filteredBlogs.length > 0 ? (
              <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg/60">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-foreground/[0.02] text-secondary">
                      <th className="p-4">Title</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map((b) => {
                      const isPublished = b.status === 'published';
                      return (
                        <tr key={b.id} className="border-b border-card-border hover:bg-foreground/[0.01]">
                          <td className="p-4 font-bold text-foreground">{b.title}</td>
                          <td className="p-4 text-secondary">/{b.slug}</td>
                          <td className="p-4">
                            <Badge variant={isPublished ? 'primary' : 'outline'} className="text-[9px] py-0.5">
                              {b.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                            <button
                              onClick={() => openBlogModal(b)}
                              className="p-1.5 text-secondary hover:text-foreground rounded-lg border border-card-border bg-card-bg hover:bg-foreground/5 cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(b.id)}
                              className="p-1.5 text-secondary hover:text-red-500 rounded-lg border border-card-border bg-card-bg hover:bg-red-500/5 hover:border-red-500/10 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="py-20 text-center border-dashed border-card-border flex flex-col items-center justify-center">
                <BookOpen className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground font-mono uppercase">No research logs compiled</h4>
                <p className="text-xs text-secondary mt-1 max-w-xs font-medium">Draft dynamic developer logs to display on the blog site.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-card-border pb-4">
              <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                <Mail className="h-5 w-5 text-secondary" /> Recruiter Inquiries ({filteredInquiries.length})
              </h1>
              <p className="text-xs text-secondary mt-1 font-mono">Historical mailbox communications logged securely in database.</p>
            </div>

            {/* Search */}
            <div className="flex gap-2 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                <Search className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search leads by name, email or subject keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-xs py-2 rounded-xl border-card-border"
              />
            </div>

            {/* List */}
            {filteredInquiries.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredInquiries.map((msg) => (
                  <Card key={msg.id} className="p-5 flex flex-col gap-4 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border pb-3 text-xs font-mono font-bold">
                      <div className="flex flex-wrap items-center gap-4 text-foreground">
                        <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-secondary" /> {msg.name}</span>
                        <span className="flex items-center gap-1.5 text-secondary"><Mail className="h-3.5 w-3.5" /> {msg.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-secondary flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(msg.created_at)}</span>
                        <button
                          onClick={() => handleDeleteInquiry(msg.id)}
                          className="p-1 text-secondary hover:text-red-500 rounded-md border border-card-border hover:bg-red-500/5 transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 font-mono">
                      <h4 className="text-xs font-bold text-foreground">Subject: {msg.subject}</h4>
                      <p className="text-xs text-secondary leading-relaxed p-4 bg-foreground/[0.02] border border-card-border rounded-xl">
                        {msg.message}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="py-20 text-center border-dashed border-card-border flex flex-col items-center justify-center">
                <Mail className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground font-mono uppercase">Inbox completely empty</h4>
                <p className="text-xs text-secondary mt-1 max-w-xs font-medium">When recruiter submissions arrive, they will list in this folder.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB: AI Telemetry Conversations */}
        {activeTab === 'chats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left Column */}
            <div className="md:col-span-1 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              <div className="text-xs font-semibold text-secondary flex items-center gap-1.5 font-mono mb-1">
                <Terminal className="h-4 w-4 text-foreground animate-pulse" /> AI logs directory: {chatSessions.length} active
              </div>

              {chatSessions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {chatSessions.map((session) => {
                    const isSelected = session.id === selectedChatSessionId;
                    return (
                      <button
                        key={session.id}
                        onClick={() => setSelectedChatSessionId(session.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                          isSelected
                            ? 'bg-foreground/5 border-foreground text-foreground'
                            : 'bg-card-bg border-card-border hover:border-foreground/15 text-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[9px] font-bold font-mono">
                          <span className="flex items-center gap-1 text-secondary uppercase">
                            <Monitor className="h-3 w-3" /> {session.user_ip || '127.0.0.1'}
                          </span>
                          <span className="flex items-center gap-1 text-secondary">
                            <Clock className="h-3 w-3" /> {formatDate(session.created_at)}
                          </span>
                        </div>
                        
                        <span className="text-xs font-bold font-mono line-clamp-1">
                          {session.title || 'Conversation Session'}
                        </span>

                        <div className="text-[10px] font-bold text-secondary font-mono flex items-center gap-1 border-t border-card-border/40 pt-2">
                          <MessageSquare className="h-3 w-3" /> {session.messages?.length || 0} messages
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-xs text-secondary font-mono text-center py-10 bg-card-bg rounded-xl border border-card-border">
                  No telemetry sessions recorded.
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
              {selectedChatSession ? (
                <Card className="p-0 overflow-hidden flex flex-col h-[550px] relative border-card-border bg-card-bg">
                  <div className="p-4 border-b border-card-border bg-foreground/[0.02] flex justify-between items-center z-10 relative">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold font-mono text-secondary uppercase tracking-wider">Active Dialogue Trace</span>
                      <h3 className="text-xs font-bold text-foreground line-clamp-1 font-mono">{selectedChatSession.title}</h3>
                    </div>
                    <div className="text-[9px] font-mono font-bold text-secondary flex flex-col items-end shrink-0">
                      <span>IP: {selectedChatSession.user_ip || '127.0.0.1'}</span>
                      <span>ID: {selectedChatSession.id.substring(0, 8)}...</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 scrollbar-thin">
                    {selectedChatSession.messages && selectedChatSession.messages.length > 0 ? (
                      selectedChatSession.messages.map((message, idx) => {
                        const isUser = message.role === 'user';
                        return (
                          <div
                            key={idx}
                            className={`flex flex-col gap-1 max-w-[85%] ${
                              isUser ? 'self-end items-end' : 'self-start items-start'
                            }`}
                          >
                            <span className="text-[9px] font-bold font-mono text-secondary uppercase px-1">
                              {isUser ? 'Visitor' : 'Assistant'}
                            </span>
                            <div
                              className={`rounded-xl px-3.5 py-2.5 text-xs font-mono leading-relaxed ${
                                isUser
                                  ? 'bg-foreground text-background font-medium border border-foreground rounded-tr-none'
                                  : 'bg-foreground/[0.03] text-foreground border border-card-border rounded-tl-none'
                              }`}
                            >
                              {message.content.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-xs text-secondary font-mono">
                        No dialog logs retrieved for this session.
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card className="h-[550px] border-dashed border-card-border bg-card-bg flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-1 font-mono">Select a Trace Session</h3>
                  <p className="text-xs text-secondary max-w-xs leading-relaxed font-medium font-mono">
                    Select a conversation log block on the left panel to review message exchanges.
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB: Downloads */}
        {activeTab === 'downloads' && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-card-border pb-4">
              <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                <Download className="h-5 w-5 text-secondary" /> Resume Downloads Logs ({downloadsList.length})
              </h1>
              <p className="text-xs text-secondary mt-1">Audit log traces tracking recruiter clicks on Vraj Patel&apos;s CV download actions.</p>
            </div>

            {downloadsList.length > 0 ? (
              <div className="border border-card-border rounded-xl overflow-hidden bg-card-bg/60">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-card-border bg-foreground/[0.02] text-secondary">
                      <th className="p-4">Visitor IP</th>
                      <th className="p-4">Referral Source</th>
                      <th className="p-4 text-right">Download Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {downloadsList.map((d) => (
                      <tr key={d.id} className="border-b border-card-border hover:bg-foreground/[0.01]">
                        <td className="p-4 font-bold text-foreground">{d.user_ip || '127.0.0.1'}</td>
                        <td className="p-4 text-secondary">{d.referral_source || 'Direct Website Clicks'}</td>
                        <td className="p-4 text-right text-secondary">{formatDate(d.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="py-20 text-center border-dashed border-card-border flex flex-col items-center justify-center">
                <Download className="h-10 w-10 text-secondary mb-3 animate-pulse" />
                <h4 className="text-xs font-bold text-foreground font-mono uppercase">No download events logged</h4>
                <p className="text-xs text-secondary mt-1 max-w-xs font-medium">Download audits populate when users trigger CV requests.</p>
              </Card>
            )}
          </div>
        )}

        {/* TAB: Analytics */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col gap-6">
            <div className="border-b border-card-border pb-4">
              <h1 className="text-xl font-mono text-foreground flex items-center gap-2">
                <Activity className="h-5 w-5 text-secondary" /> Unified Operations Console
              </h1>
              <p className="text-xs text-secondary mt-1 font-mono">Real-time telemetry stream including system logs, security audits, and admin activity metrics.</p>
            </div>

            <DeveloperConsole adminMode={true} />
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------
          MODALS & FORM REGISTRATION POPUPS
      -------------------------------------------------------------------- */}
      
      {/* MODAL: Project Creator/Editor */}
      <AnimatePresence>
        {projectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card-bg/95 border border-card-border p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-card-border pb-3 mb-4 font-mono">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase">
                  <Terminal className="h-4 w-4" /> {activeEditingProject ? 'Edit Case Study Parameter' : 'Register New Case Study'}
                </span>
                <button
                  onClick={() => setProjectModalOpen(false)}
                  className="p-1 hover:bg-foreground/5 text-secondary hover:text-foreground rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={projectForm.handleSubmit(handleProjectSubmit)} className="flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Project Title</label>
                    <Input
                      type="text"
                      placeholder="e.g. ConstructionOS ERP"
                      {...projectForm.register('title')}
                      className="rounded-lg text-xs py-2 border-card-border"
                    />
                    {projectForm.formState.errors.title && (
                      <span className="text-[10px] text-red-500 font-bold">{projectForm.formState.errors.title.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">URL Slug</label>
                    <Input
                      type="text"
                      placeholder="e.g. constructionos-erp"
                      {...projectForm.register('slug')}
                      className="rounded-lg text-xs py-2 border-card-border"
                    />
                    {projectForm.formState.errors.slug && (
                      <span className="text-[10px] text-red-500 font-bold">{projectForm.formState.errors.slug.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Category</label>
                    <select
                      {...projectForm.register('category')}
                      className="rounded-lg text-xs py-2.5 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono"
                    >
                      <option value="Client Software">Client Software</option>
                      <option value="ERP Systems">ERP Systems</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="AI Automation">AI Automation</option>
                      <option value="Quant Research">Quant Research</option>
                      <option value="Websites">Websites</option>
                      <option value="Dashboards">Dashboards</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Deployment Status</label>
                    <select
                      {...projectForm.register('status')}
                      className="rounded-lg text-xs py-2.5 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono"
                    >
                      <option value="Live">Live / Active</option>
                      <option value="In Development">In Development</option>
                      <option value="Private">Private / Offline</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 justify-center pt-5 pl-2">
                    <label className="flex items-center gap-2 text-secondary font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        {...projectForm.register('featured')}
                        className="rounded border-card-border accent-foreground cursor-pointer"
                      />
                      <span>Featured Dashboard Bento</span>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Banner Image Path</label>
                  <Input
                    type="text"
                    placeholder="e.g. /images/projects/constructionos.webp"
                    {...projectForm.register('image')}
                    className="rounded-lg text-xs py-2 border-card-border"
                  />
                  {projectForm.formState.errors.image && (
                    <span className="text-[10px] text-red-500 font-bold">{projectForm.formState.errors.image.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Short Summary Tagline</label>
                  <Input
                    type="text"
                    placeholder="One-sentence description of what this project compiles into..."
                    {...projectForm.register('shortDescription')}
                    className="rounded-lg text-xs py-2 border-card-border"
                  />
                  {projectForm.formState.errors.shortDescription && (
                    <span className="text-[10px] text-red-500 font-bold">{projectForm.formState.errors.shortDescription.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Full Summary Description</label>
                  <textarea
                    placeholder="Comprehensive description of the application target objectives..."
                    rows={4}
                    {...projectForm.register('description')}
                    className="rounded-lg text-xs py-2 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono resize-none"
                  />
                  {projectForm.formState.errors.description && (
                    <span className="text-[10px] text-red-500 font-bold">{projectForm.formState.errors.description.message}</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-card-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setProjectModalOpen(false)}
                    className="cursor-pointer font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    className="cursor-pointer font-bold"
                  >
                    {isSubmitting ? 'Writing Parameters...' : activeEditingProject ? 'Commit Parameter Changes' : 'Publish Project'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Skill Creator/Editor */}
      <AnimatePresence>
        {skillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-card-bg/95 border border-card-border p-6 rounded-2xl shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-card-border pb-3 mb-4 font-mono">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase">
                  <Terminal className="h-4 w-4" /> {activeEditingSkill ? 'Edit Skill parameters' : 'Index New Skill Metric'}
                </span>
                <button
                  onClick={() => setSkillModalOpen(false)}
                  className="p-1 hover:bg-foreground/5 text-secondary hover:text-foreground rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={skillForm.handleSubmit(handleSkillSubmit)} className="flex flex-col gap-4 font-mono text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Skill Name</label>
                  <Input
                    type="text"
                    placeholder="e.g. Go (Golang), Kubernetes, Next.js"
                    {...skillForm.register('name')}
                    className="rounded-lg text-xs py-2 border-card-border"
                  />
                  {skillForm.formState.errors.name && (
                    <span className="text-[10px] text-red-500 font-bold">{skillForm.formState.errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Category Block</label>
                  <select
                    {...skillForm.register('category')}
                    className="rounded-lg text-xs py-2.5 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono"
                  >
                    <option value="Languages">Languages</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Backend & APIs">Backend & APIs</option>
                    <option value="Databases & Systems">Databases & Systems</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Proficiency Rank</label>
                  <select
                    {...skillForm.register('proficiency_level')}
                    className="rounded-lg text-xs py-2.5 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono"
                  >
                    <option value="expert">Expert (Standard/Lead)</option>
                    <option value="advanced">Advanced (Proficient)</option>
                    <option value="intermediate">Intermediate (Competent)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-card-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setSkillModalOpen(false)}
                    className="cursor-pointer font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    className="cursor-pointer font-bold"
                  >
                    {isSubmitting ? 'Indexing...' : activeEditingSkill ? 'Update Index' : 'Register Skill'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Blog Creator/Editor */}
      <AnimatePresence>
        {blogModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-card-bg/95 border border-card-border p-6 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center border-b border-card-border pb-3 mb-4 font-mono">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase">
                  <Terminal className="h-4 w-4" /> {activeEditingBlog ? 'Edit Research Log' : 'Publish Research Note'}
                </span>
                <button
                  onClick={() => setBlogModalOpen(false)}
                  className="p-1 hover:bg-foreground/5 text-secondary hover:text-foreground rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={blogForm.handleSubmit(handleBlogSubmit)} className="flex flex-col gap-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Note Title</label>
                    <Input
                      type="text"
                      placeholder="e.g. GARCH Modeling for Options skews"
                      {...blogForm.register('title')}
                      className="rounded-lg text-xs py-2 border-card-border"
                    />
                    {blogForm.formState.errors.title && (
                      <span className="text-[10px] text-red-500 font-bold">{blogForm.formState.errors.title.message}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">URI Slug</label>
                    <Input
                      type="text"
                      placeholder="e.g. options-skew-garch"
                      {...blogForm.register('slug')}
                      className="rounded-lg text-xs py-2 border-card-border"
                    />
                    {blogForm.formState.errors.slug && (
                      <span className="text-[10px] text-red-500 font-bold">{blogForm.formState.errors.slug.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Cover Image URL</label>
                    <Input
                      type="text"
                      placeholder="/images/blog/cover.webp"
                      {...blogForm.register('cover_image_url')}
                      className="rounded-lg text-xs py-2 border-card-border"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-secondary font-bold">Publication Status</label>
                    <select
                      {...blogForm.register('status')}
                      className="rounded-lg text-xs py-2.5 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono"
                    >
                      <option value="draft">Draft (Saved private)</option>
                      <option value="published">Published (Public site feed)</option>
                      <option value="archived">Archived (Deprioritized)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-secondary font-bold">Note Body Markdown / Text</label>
                  <textarea
                    placeholder="Draft complete technical findings or system log parameters..."
                    rows={8}
                    {...blogForm.register('content')}
                    className="rounded-lg text-xs py-2 px-3 border border-card-border bg-card-bg text-foreground outline-none font-mono resize-none"
                  />
                  {blogForm.formState.errors.content && (
                    <span className="text-[10px] text-red-500 font-bold">{blogForm.formState.errors.content.message}</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-card-border pt-4 mt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setBlogModalOpen(false)}
                    className="cursor-pointer font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    className="cursor-pointer font-bold"
                  >
                    {isSubmitting ? 'Writing Note...' : activeEditingBlog ? 'Commit Updates' : 'Publish Research Note'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
