'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mail, CheckCircle, AlertCircle, Phone, Globe } from 'lucide-react';
import { PageTitleReveal } from '@/components/motion/page-transition';

// Contact form schemas using Zod validation
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [responseMsg, setResponseMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setResponseMsg('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setResponseMsg(result.message || 'Thank you! Your message was received.');
        reset();
      } else {
        throw new Error(result.error || 'Failed to submit form.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setResponseMsg(error instanceof Error ? error.message : 'Database sync failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 md:py-10 max-w-4xl mx-auto w-full flex flex-col gap-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 border-b border-card-border pb-6 shrink-0">
        <span className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-1.5 font-mono">
          <Mail className="h-4 w-4 text-foreground" /> Secure Communications
        </span>
        <PageTitleReveal className="text-3xl md:text-4xl font-medium font-serif text-foreground tracking-tight">
          Contact Vraj Patel
        </PageTitleReveal>
        <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-2xl font-medium">
          Recruiters, clients, and technical teams can use this secure portal to dispatch business opportunities, questions, or project inquiries directly to Vraj.
        </p>
      </div>

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Left Side: Contact detail cards */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <Card className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary font-mono">
                Direct Communication
              </span>
              <h3 className="text-sm font-bold text-foreground font-serif mt-1">Contact Coordinates</h3>
            </div>
            
            <div className="flex flex-col gap-3 border-t border-card-border pt-4">
              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider font-mono">Email</span>
                  <a href="mailto:patelvrajpatel30@gmail.com" className="text-xs text-foreground font-semibold hover:underline">
                    patelvrajpatel30@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-card-border/60 pt-3">
                <Phone className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider font-mono">Phone</span>
                  <a href="tel:+917990251191" className="text-xs text-foreground font-semibold hover:underline">
                    +91 79902 51191
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-card-border/60 pt-3">
                <Globe className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider font-mono">Location</span>
                  <span className="text-xs text-foreground font-semibold">
                    Gujarat, India
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-secondary font-medium border-t border-card-border pt-3">
              Checked daily within business hours. Relocation available.
            </p>
          </Card>

          <Card className="p-6 flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary font-mono">
              System Parameters
            </span>
            <h3 className="text-sm font-bold text-foreground font-serif">Availability Status</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-foreground">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Actively looking for roles</span>
            </div>
            <p className="text-[10px] text-secondary leading-relaxed font-medium">
              Open to Software Engineer, Full-Stack Developer, and Quant developer positions.
            </p>
          </Card>
        </div>

        {/* Right Side: Dynamic Form Area */}
        <div className="md:col-span-3">
          <Card className="p-6 md:p-8 flex flex-col gap-6 relative">
            <h3 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider border-b border-card-border pb-2">
              Communications Form
            </h3>

            {/* Display Response Message Box */}
            {submitStatus && (
              <div
                className={`flex gap-3 p-4 rounded-xl text-xs md:text-sm border ${
                  submitStatus === 'success'
                    ? 'bg-foreground/5 border-card-border text-foreground'
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}
              >
                {submitStatus === 'success' ? (
                  <CheckCircle className="h-5 w-5 shrink-0 text-foreground" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
                <span className="leading-relaxed font-semibold">{responseMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              
              {/* Row 1: Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-name" className="text-[10px] font-bold text-secondary font-mono uppercase tracking-wider">Your Name</label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Vraj Patel"
                    {...register('name')}
                    disabled={isSubmitting}
                    className={errors.name ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
                  />
                  {errors.name && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-email" className="text-[10px] font-bold text-secondary font-mono uppercase tracking-wider">Email Address</label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="name@company.com"
                    {...register('email')}
                    disabled={isSubmitting}
                    className={errors.email ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-semibold">{errors.email.message}</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-subject" className="text-[10px] font-bold text-secondary font-mono uppercase tracking-wider">Subject</label>
                <Input
                  id="contact-subject"
                  type="text"
                  placeholder="Full-stack Developer Opportunity"
                  {...register('subject')}
                  disabled={isSubmitting}
                  className={errors.subject ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
                />
                {errors.subject && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.subject.message}</span>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="contact-message" className="text-[10px] font-bold text-secondary font-mono uppercase tracking-wider">Message Description</label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell me about your tech stack requirements, project timelines, or interview details..."
                  {...register('message')}
                  disabled={isSubmitting}
                  className={errors.message ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''}
                />
                {errors.message && (
                  <span className="text-[10px] text-red-500 font-semibold">{errors.message.message}</span>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="mt-2 gap-2 flex items-center justify-center cursor-pointer font-bold"
              >
                {isSubmitting ? (
                  <>Sending Message...</>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Dispatch Secure Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}
