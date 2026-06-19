/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Mail, Landmark, Globe, Check, Star, Quote, Image as ImageIcon } from 'lucide-react';
import { getCMSData, CMSData } from '../lib/cms';
import { getFeedbacks, saveFeedbacks, DbTestimonial } from '../lib/db';


interface FeedbackItem {
  id: number | string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  avatarInitials?: string;
  approved?: boolean;
}

export default function ContactSection() {
  const [cms, setCms] = useState<CMSData>(getCMSData);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CMSData>;
      if (customEvent.detail) {
        setCms(customEvent.detail);
      }
    };
    window.addEventListener('fikra_cms_updated', handleUpdate);
    return () => {
      window.removeEventListener('fikra_cms_updated', handleUpdate);
    };
  }, []);

  // Contact Form States
  const [formData, setFormData] = useState({ name: '', email: '', type: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Quick Feedback Star States
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRole, setFeedbackRole] = useState('');
  const [feedbackImage, setFeedbackImage] = useState('');
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Live submitted feedbacks list loaded dynamically from localStorage or defaults
  const [feedbacks, setFeedbacks] = useState<DbTestimonial[]>(getFeedbacks);
  const [highlightForm, setHighlightForm] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#quick-feedback-form') {
        setHighlightForm(true);
        // Delay slightly top-level to allow full page layout computation
        setTimeout(() => {
          const el = document.getElementById('quick-feedback-form');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
        const timer = setTimeout(() => {
          setHighlightForm(false);
        }, 4500);
        return () => clearTimeout(timer);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  // On mount, load Feedbacks from localStorage or use defaults
  useEffect(() => {
    const handleDbUpdate = () => {
      setFeedbacks(getFeedbacks());
    };
    window.addEventListener('fikra_db_updated', handleDbUpdate);
    return () => {
      window.removeEventListener('fikra_db_updated', handleDbUpdate);
    };
  }, []);

  const enquiryTypes = [
    'Software Development',
    'Product Design & Engineering',
    'IP & Patent Consulting',
    'Innovation Strategy',
    'Social Media Management',
    'Partnership',
    'Other'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Construct new inquiry item
    const newInquiry = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      type: formData.type || 'Other Enquiry',
      message: formData.message,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending'
    };

    // Load existing or use custom default set as initial seed
    const existingStr = localStorage.getItem('fikra_inquiries');
    let inquiries = [];
    if (existingStr) {
      try {
        inquiries = JSON.parse(existingStr);
      } catch (err) {}
    } else {
      inquiries = [
        {
          id: 101,
          name: "Baraka Joseph",
          email: "baraka@gmail.com",
          type: "Software Development",
          message: "Habari! We are looking to develop a secure Flutter multi-device client for Tanzanian farmers. We need offline fallback storage capabilities.",
          date: "Jun 15, 2026, 02:32 PM",
          status: "Pending"
        },
        {
          id: 102,
          name: "Upendo Mwanjali",
          email: "upendo@tanzaniacocoa.org",
          type: "IP & Patent Consulting",
          message: "We want to consult on patenting our cocoa processing gear mechanics at BRELA. We have the CAD models ready and want to formulate a robust NDA schema.",
          date: "Jun 16, 2026, 09:15 AM",
          status: "Reviewed"
        },
        {
          id: 103,
          name: "Kipingu Paul",
          email: "kipingupaul@outlook.com",
          type: "Product Design & Engineering",
          message: "Design a physical IoT logging sensor case for our utility containers in DSM port. It should be rapid-printed using heavy-duty ABS filament.",
          date: "Jun 16, 2026, 11:24 AM",
          status: "Archived"
        }
      ];
    }

    inquiries.unshift(newInquiry);
    localStorage.setItem('fikra_inquiries', JSON.stringify(inquiries));

    // Simulate API Submission toast
    setTimeout(() => {
      setFormSubmitted(true);
      setFormData({ name: '', email: '', type: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 600);
  };

  const calculateInitials = (fullName: string): string => {
    if (!fullName) return "U";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultString = reader.result as string;
        setProfilePreview(resultString);
        setFeedbackImage(resultString);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || rating === 0 || !feedbackText) return;
    
    const initials = calculateInitials(feedbackName);
    const newFeedback: DbTestimonial = {
      id: String(Date.now()),
      author: feedbackName,
      role: feedbackRole || 'Workspace Contributor',
      avatar: feedbackImage,
      avatarInitials: initials,
      rating: rating,
      text: feedbackText,
      date: 'Just now',
      approved: false, // Under admin moderation
      verified: false
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    saveFeedbacks(updated);
    setFeedbackSubmitted(true);

    // Reset fields
    setFeedbackName('');
    setFeedbackRole('');
    setFeedbackImage('');
    setProfilePreview('');
    setFeedbackText('');
    setRating(0);

    setTimeout(() => {
      setFeedbackSubmitted(false);
    }, 4500);
  };

  const contactBlocks = [
    { label: 'Email Enquiries', val: 'info@fikraforge.com', action: 'mailto:info@fikraforge.com', icon: <Mail className="w-4 h-4 text-[#C94A1A]" /> },
    { label: 'Corporate HQ', val: 'Dar es Salaam, Tanzania', icon: <Landmark className="w-4 h-4 text-[#C94A1A]" /> },
    { label: 'Online Platform', val: 'fikraforge.com', action: 'https://fikraforge.com', icon: <Globe className="w-4 h-4 text-[#C94A1A]" /> },
    { label: 'Legal Incorporation', val: 'BRELA Registar · Dar es Salaam', icon: <Globe className="w-4 h-4 text-[#C94A1A]" /> }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start py-4">
      
      {/* Left Column: Contact coordinates details */}
      <div className="lg:col-span-5 flex flex-col justify-start">
        <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
          {cms.contact_tagline}
        </span>
        <h2 className="font-sans font-black text-4xl md:text-5xl tracking-tighter leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/45 mb-6">
          {cms.contact_title}
        </h2>
        <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-sm mb-8">
          {cms.contact_description}
        </p>

        {/* Contact info blocks */}
        <div className="flex flex-col gap-6">
          {contactBlocks.map((block, idx) => (
            <div key={idx} className="flex gap-4 items-start border-l-2 border-white/5 pl-4 hover:border-[#C94A1A] transition-all duration-300">
              <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 flex items-center justify-center mt-0.5">
                {block.icon}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/35 block mb-1">
                  {block.label}
                </span>
                {block.action ? (
                  <a
                    href={block.action}
                    className="font-sans text-sm text-white/80 hover:text-white underline decoration-[#C94A1A]/50 hover:decoration-[#C94A1A] transition-colors"
                  >
                    {block.val}
                  </a>
                ) : (
                  <span className="font-sans text-sm text-white/80">
                    {block.val}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Working Hours Coordinate SLA note from CMS */}
        {cms.contact_working_hours && (
          <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/40 leading-relaxed font-mono">
            <span className="text-[#C94A1A] font-semibold block mb-1">OPERATIONAL COORDINATES</span>
            {cms.contact_working_hours}
          </div>
        )}
      </div>

      {/* Right Column: Interaction form panel & quick feedback */}
      <div className="lg:col-span-7 flex flex-col gap-8 relative">
        <div className="bg-[#111113]/80 border border-white/[0.04] p-6 md:p-8 rounded-[32px] relative overflow-hidden">
          
          <span className="text-[10px] font-semibold tracking-[4px] text-[#C94A1A] uppercase block mb-3 pl-3 border-l-2 border-[#C94A1A] font-mono">
            Project Proposal
          </span>
          <h3 className="font-sans font-black text-2xl md:text-3xl tracking-tight text-white mb-6">
            Consultation Form
          </h3>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Your Full Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Baraka Joseph"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] focus:ring-1 focus:ring-[#C94A1A]/10 transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Your Email Address:</label>
                <input
                  type="email"
                  placeholder="e.g. baraka@gmail.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] focus:ring-1 focus:ring-[#C94A1A]/10 transition-colors w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Inquiry Specialization:</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:dark:text-white focus:border-[#C94A1A] transition-colors w-full"
              >
                <option value="">-- Choose Specialization Section --</option>
                {enquiryTypes.map((t, idx) => (
                  <option key={idx} value={t} className="bg-[#050505] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Project Scope Specs:</label>
              <textarea
                placeholder="Describe your design specifications, production timelines, and IP copyrights expectations..."
                required
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] focus:ring-1 focus:ring-[#C94A1A]/10 transition-colors w-full h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C94A1A] to-[#E0531E] hover:from-[#E0531E] hover:to-[#F57C00] text-white font-sans font-semibold text-xs md:text-sm px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-md shadow-[#C94A1A]/10 self-start active:scale-95 border-0 mt-2"
            >
              Submit Project Form
            </button>
          </form>

          {/* Form success toast */}
          {formSubmitted && (
            <div className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade shadow-xl z-50">
              <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mb-4">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-semibold text-white text-lg mb-2">Message Received Successfully</h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm">
                Thank you for contacting FikraForge Inc. We will analyze your specifications and respond via email within 24 working hours.
              </p>
            </div>
          )}
        </div>

        {/* Quick Review Feedback Form WITH Name & Image Upload fields */}
        <div 
          id="quick-feedback-form" 
          className={`bg-[#111113]/80 border p-5 md:p-6 rounded-[24px] relative overflow-hidden text-left transition-all duration-500 ${
            highlightForm ? 'border-[#C94A1A] animate-pulse-custom-highlight' : 'border-white/[0.04]'
          }`}
        >
          <span className="text-[10px] font-mono uppercase tracking-[4px] text-[#C94A1A] block mb-2 pl-3 border-l-2 border-[#C94A1A]">
            Quick Feedback
          </span>
          <h4 className="font-sans font-bold text-xs md:text-sm text-white/95 mb-4 leading-normal">
            Satisfied exploring our digital forge? Submit a real-time review below!
          </h4>

          <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
            {/* Display data Name and Role fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Your Name (Required):</label>
                <input
                  type="text"
                  placeholder="e.g. Juma Kassim"
                  required
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Your Affiliation / Role:</label>
                <input
                  type="text"
                  placeholder="e.g. Developer / Artist"
                  value={feedbackRole}
                  onChange={(e) => setFeedbackRole(e.target.value)}
                  className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors w-full"
                />
              </div>
            </div>

            {/* Profile Avatar Options: File Upload and URL option */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Local File Upload Component */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">
                  1. Upload Profile Photo:
                </label>
                <div className="flex items-center gap-3">
                  <label 
                    htmlFor="feedback-avatar-upload"
                    className="flex-grow cursor-pointer flex items-center justify-center gap-2 bg-[#0c0c0e]/80 border border-dashed border-white/15 hover:border-[#C94A1A] p-2.5 rounded-xl text-xs text-white/60 hover:text-white transition-all select-none"
                  >
                    <ImageIcon className="w-4 h-4 text-[#C94A1A]" />
                    <span>Choose Image File</span>
                    <input
                      type="file"
                      id="feedback-avatar-upload"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  {profilePreview && (
                    <div className="relative shrink-0">
                      <img 
                        src={profilePreview} 
                        alt="Preview" 
                        className="w-10 h-10 rounded-full object-cover border border-[#C94A1A] bg-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProfilePreview('');
                          setFeedbackImage('');
                        }}
                        className="absolute -top-1 -right-1 bg-[#C94A1A] hover:bg-[#E0531E] rounded-full text-[8px] w-4.5 h-4.5 flex items-center justify-center border-0 text-white font-sans font-bold select-none cursor-pointer"
                        title="Remove uploaded image"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* URL fallback field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">
                  2. Or Photo URL:
                </label>
                <input
                  type="url"
                  placeholder="Paste direct .jpg / .png image URL"
                  value={feedbackImage.startsWith('data:') ? '' : feedbackImage}
                  onChange={(e) => {
                    setFeedbackImage(e.target.value);
                    setProfilePreview(''); // Clear file preview if they type a URL
                  }}
                  className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors w-full text-white/70"
                />
              </div>
            </div>

            {/* Stars rating selection */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Your Forge Rating (1 - 5 Stars):</span>
              <div className="flex gap-1.5 my-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = hoverRating ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="bg-transparent border-0 p-0.5 cursor-pointer text-xl transition-all focus:outline-none"
                      aria-label={`Submit ${star} star`}
                    >
                      <Star
                        className={`w-5 h-5 md:w-6 md:h-6 stroke-1 transition-all ${
                          active 
                            ? 'fill-[#C94A1A] stroke-[#C94A1A] scale-110' 
                            : 'stroke-white/20 hover:stroke-white/45'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review feedback text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Review Comment:</label>
              <textarea
                placeholder="What can we refine to make this workspace stand out further?"
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="bg-[#0c0c0e]/80 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] focus:ring-1 focus:ring-[#C94A1A]/10 transition-colors w-full resize-none h-[64px]"
              />
            </div>

            <button
              type="submit"
              disabled={rating === 0 || !feedbackName || !feedbackText}
              className={`font-sans font-semibold text-xs px-5 py-3 rounded-full self-start border-0 bg-[#C94A1A] text-white cursor-pointer select-none active:scale-95 transition-all ${
                rating === 0 || !feedbackName || !feedbackText 
                  ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/30' 
                  : 'hover:bg-[#E0531E]'
              }`}
            >
              Publish Testimonial Review
            </button>
          </form>

          {/* Feedback success toast */}
          {feedbackSubmitted && (
            <div className="absolute inset-0 bg-[#0c0c0e]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 animate-fade">
              <span className="text-2xl mb-2">✨</span>
              <p className="font-sans text-xs text-[#34D399] leading-relaxed font-bold">
                ✓ Review Submitted Successfully!
              </p>
              <p className="font-sans text-[10px] text-white/50 text-wrap mt-1">
                Your testimony has been added to our queue and is subject to admin moderation. It will publish live on FikraForge once approved!
              </p>
            </div>
          )}
        </div>

        {/* Real-Time Live Feedbacks Board Display shelf */}
        <div className="mt-4 text-left">
          <span className="text-[10px] font-mono uppercase tracking-[4px] text-white/40 block mb-4">
            Live Feedbacks Board ({feedbacks.filter(f => (f as any).approved !== false).length})
          </span>
          
          <div className="flex flex-col gap-4 max-h-[380px] overflow-y-auto pr-1">
            {feedbacks.filter(f => (f as any).approved !== false).map((fb) => (
              <div 
                key={fb.id} 
                className="bg-[#111113]/60 border border-white/[0.04] p-4 rounded-2xl flex flex-col gap-3 relative hover:border-[#C94A1A]/20 transition-all duration-300 animate-fade"
              >
                <Quote className="w-6 h-6 text-[#C94A1A]/5 absolute top-3 right-3" />
                
                {/* Header author and star ratings */}
                <div className="flex items-center gap-3">
                  {fb.avatar ? (
                    <img 
                      src={fb.avatar} 
                      alt={fb.author} 
                      className="w-8 h-8 rounded-full object-cover border border-white/5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C94A1A] to-[#F57C00] flex items-center justify-center text-[10px] font-bold text-white font-mono shrink-0 shadow shadow-black">
                      {fb.avatarInitials}
                    </div>
                  )}

                  <div className="flex-grow">
                    <h5 className="font-sans text-xs font-bold text-white leading-none mb-1 flex items-center flex-wrap gap-1.5">
                      {fb.author}
                      {(fb as any).verified && (
                        <span className="inline-flex items-center text-[7px] font-mono tracking-widest bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 rounded-sm px-1 py-0.5 uppercase font-bold" title="Verified FikraForge partner client">
                          ✓ Verified
                        </span>
                      )}
                    </h5>
                    <p className="text-[9px] text-white/40 leading-none">{fb.role}</p>
                  </div>

                  {/* Testimonial Stars representation */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < fb.rating ? 'fill-[#C94A1A] text-[#C94A1A]' : 'text-white/10'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Testimonial text */}
                <p className="text-xs text-white/70 italic font-light leading-relaxed pl-1 font-serif">
                  &ldquo;{fb.text}&rdquo;
                </p>

                <div className="text-[9px] font-mono text-white/30 text-right">
                  Submittal log: {fb.date}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
