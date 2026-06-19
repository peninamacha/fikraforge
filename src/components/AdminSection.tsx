/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  Trash2, 
  Check, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  Layers, 
  Award, 
  Plus, 
  Mail, 
  Star, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  FileCheck,
  Zap,
  Briefcase,
  FileText,
  Save,
  Undo
} from 'lucide-react';
import { getCMSData, saveCMSData, DEFAULT_CMS, CMSData } from '../lib/cms';
import { 
  getProducts, saveProducts, DbProduct,
  getFeedbacks, saveFeedbacks, DbTestimonial,
  getServices, saveServices, DbServiceItem,
  getTeam, saveTeam, DbTeamMember,
  getCompetitions, saveCompetitions, DbCompetition,
  getNews, saveNews, DbNewsArticle,
  getLabCapabilities, saveLabCapabilities, DbLabCapability
} from '../lib/db';

interface InquiryItem {
  id: number | string;
  name: string;
  email: string;
  type: string;
  message: string;
  date: string;
  status: 'Pending' | 'Active Callback' | 'Reviewed' | 'Archived';
}

export default function AdminSection() {
  // Sec Guard states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);

  // Nav inside Admin Panel
  const [activeTab, setActiveTab] = useState<'kpis' | 'inquiries' | 'feedbacks' | 'products' | 'services' | 'team' | 'studio' | 'competitions' | 'news' | 'cms'>('cms');

  // Load and live synchronize states from localStorage
  const [cmsValues, setCmsValues] = useState<CMSData>(getCMSData);

  // Database managed fields
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [feedbacks, setFeedbacks] = useState<DbTestimonial[]>([]);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [services, setServices] = useState<DbServiceItem[]>([]);
  const [team, setTeam] = useState<DbTeamMember[]>([]);
  const [competitions, setCompetitions] = useState<DbCompetition[]>([]);
  const [news, setNews] = useState<DbNewsArticle[]>([]);
  const [capabilities, setCapabilities] = useState<DbLabCapability[]>([]);

  // 1. Product Form States
  const [newProdName, setNewProdName] = useState('');
  const [newProdIcon, setNewProdIcon] = useState('🛸');
  const [newProdCategory, setNewProdCategory] = useState('Digital · SaaS · Lab');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStatus, setNewProdStatus] = useState<'live' | 'development' | 'concept'>('concept');
  const [newProdTags, setNewProdTags] = useState('Lab Registry, Premium System');

  // 2. Service Form States
  const [newServiceNo, setNewServiceNo] = useState('06');
  const [newServiceName, setNewServiceName] = useState('');

  // 3. Team Form States
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('Lead Specialist');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newTeamInitials, setNewTeamInitials] = useState('TZ');

  // 4. Competitions Form States
  const [newCompTitle, setNewCompTitle] = useState('');
  const [newCompType, setNewCompType] = useState('Hackathon Spark');
  const [newCompPrize, setNewCompPrize] = useState('Tsh 5,000,000 / $2,000');
  const [newCompDeadline, setNewCompDeadline] = useState('October 30, 2026');
  const [newCompStatus, setNewCompStatus] = useState<'live' | 'upcoming' | 'past'>('live');
  const [newCompStatusText, setNewCompStatusText] = useState('Sponsor Pool Active');
  const [newCompDesc, setNewCompDesc] = useState('');

  // 5. News Form States
  const [newNewsTitle, setNewNewsTitle] = useState('');
  const [newNewsBody, setNewNewsBody] = useState('');
  const [newNewsDate, setNewNewsDate] = useState('17');
  const [newNewsMonthYear, setNewNewsMonthYear] = useState('JUN 2026');
  const [newNewsCategory, setNewNewsCategory] = useState<DbNewsArticle['category']>('Milestone');

  // 6. Capabilities Form States
  const [newCapIcon, setNewCapIcon] = useState('⚙️');
  const [newCapName, setNewCapName] = useState('');
  const [newCapDetail, setNewCapDetail] = useState('');

  const [prodSuccessMsg, setProdSuccessMsg] = useState('');

  // Info notification states
  const [toastMessage, setToastMessage] = useState<string>('');

  // Auto-clear toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // On mount or change, sync state
  const loadDatabase = () => {
    // 1. Inquiries
    const storedInquiries = localStorage.getItem('fikra_inquiries');
    if (storedInquiries) {
      try {
        setInquiries(JSON.parse(storedInquiries));
      } catch (e) {}
    } else {
      const defaultInquiries: InquiryItem[] = [
        {
          id: 101,
          name: "Baraka Joseph",
          email: "baraka@gmail.com",
          type: "Software Development",
          message: "Habari! We are looking to develop a secure Flutter multi-device client for Tanzanian farmers. We need offline fallback storage capabilities.",
          date: "Jun 15, 2026, 02:32 PM",
          status: 'Pending'
        },
        {
          id: 102,
          name: "Upendo Mwanjali",
          email: "upendo@tanzaniacocoa.org",
          type: "IP & Patent Consulting",
          message: "We want to consult on patenting our cocoa processing gear mechanics at BRELA. We have the CAD models ready and want to formulate a robust NDA schema.",
          date: "Jun 16, 2026, 09:15 AM",
          status: 'Reviewed'
        },
        {
          id: 103,
          name: "Kipingu Paul",
          email: "kipingupaul@outlook.com",
          type: "Product Design & Engineering",
          message: "Design a physical IoT logging sensor case for our utility containers in DSM port. It should be rapid-printed using heavy-duty ABS filament.",
          date: "Jun 16, 2026, 11:24 AM",
          status: 'Archived'
        }
      ];
      localStorage.setItem('fikra_inquiries', JSON.stringify(defaultInquiries));
      setInquiries(defaultInquiries);
    }

    // Dynamic database entities loading from central src/lib/db.ts API
    setFeedbacks(getFeedbacks());
    setProducts(getProducts());
    setServices(getServices());
    setTeam(getTeam());
    setCompetitions(getCompetitions());
    setNews(getNews());
    setCapabilities(getLabCapabilities());
  };

  useEffect(() => {
    loadDatabase();
    // Check if previously logged in this session
    const loggedStr = sessionStorage.getItem('fikra_admin_auth');
    if (loggedStr === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Passcode login validation
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuth = passcode.trim().toLowerCase();
    
    // Pro keys: 'admin' or 'forge'
    if (cleanAuth === 'admin' || cleanAuth === 'forge' || cleanAuth === 'forge2026') {
      setIsAuthenticated(true);
      setPasscodeError('');
      sessionStorage.setItem('fikra_admin_auth', 'true');
      triggerToast('Forge Crypt Vault decrypted successfully. Welcome back, Architect.');
    } else {
      setPasscodeError('Invalid credentials. Clearance level insufficient.');
    }
  };

  // Demo direct pass bypass for ease of use in preview
  const handleDemoBypass = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('fikra_admin_auth', 'true');
    triggerToast('Authorized via Demo Override Bypass.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('fikra_admin_auth');
  };

  // Update specific Inquiry status
  const updateInquiryStatus = (id: number | string, newStatus: InquiryItem['status']) => {
    const updated = inquiries.map(inq => {
      if (inq.id === id) {
        return { ...inq, status: newStatus };
      }
      return inq;
    });
    setInquiries(updated);
    localStorage.setItem('fikra_inquiries', JSON.stringify(updated));
    triggerToast(`Inquiry status modified to "${newStatus}"`);
  };

  // Delete Inquiry
  const deleteInquiry = (id: number | string) => {
    const filtered = inquiries.filter(inq => inq.id !== id);
    setInquiries(filtered);
    localStorage.setItem('fikra_inquiries', JSON.stringify(filtered));
    triggerToast('Inquiry request purged from databases.');
  };

  // Toggle feedback visibility permission
  const toggleFeedbackApproval = (id: number | string) => {
    const updated = feedbacks.map(fb => {
      if (fb.id === id) {
        const currentApproved = fb.approved !== false; // Default true if undefined
        return { ...fb, approved: !currentApproved };
      }
      return fb;
    });
    setFeedbacks(updated);
    saveFeedbacks(updated);
    triggerToast('Review approval parameter modified.');
  };

  // Toggle feedback verified badge
  const toggleFeedbackVerified = (id: number | string) => {
    const updated = feedbacks.map(fb => {
      if (fb.id === id) {
        return { ...fb, verified: !fb.verified };
      }
      return fb;
    });
    setFeedbacks(updated);
    saveFeedbacks(updated);
    triggerToast('Review client verification badge toggled.');
  };

  // Delete Feedback
  const deleteFeedback = (id: number | string) => {
    const filtered = feedbacks.filter(fb => fb.id !== id);
    setFeedbacks(filtered);
    saveFeedbacks(filtered);
    triggerToast('Visitor testimonial purged.');
  };

  // Clipboard copy reply draft builder
  const handleCopyInquiryReplyDraft = (inq: InquiryItem) => {
    const replyTemplate = `Subject: Inquiry Mapped - FikraForge Labs Office [#${inq.id}]

Dear ${inq.name},

Thank you for contacting FikraForge Labs. Our coordination partners have received your briefing details regarding:

- Specialization: ${inq.type}
- Submitted Message: "${inq.message}"

We have logged this inside our active workspace. A corresponding technical coordinator will review this briefing and schedule a virtual roadmap callback to your email (${inq.email}) within 24 working hours.

--
Kind regards,
FikraForge System Registrar
Forge Center · Dar es Salaam`;

    navigator.clipboard.writeText(replyTemplate).then(() => {
      triggerToast(`Response draft mapped for ${inq.name}! Copied to clipboard.`);
    }).catch(() => {
      triggerToast('Clipboard copy restricted by sandbox browser, template ready.');
    });
  };

  // Products CRUD handlers
  const toggleProductApproval = (id: string) => {
    const updated = products.map(p => {
      if (p.id === id) {
        return { ...p, approved: p.approved === false ? true : false };
      }
      return p;
    });
    setProducts(updated);
    saveProducts(updated);
    triggerToast('Product approval parameter changed.');
  };

  const deleteProduct = (id: string) => {
    const filtered = products.filter(p => p.id !== id);
    setProducts(filtered);
    saveProducts(filtered);
    triggerToast('Product item purged from portfolio master index.');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) {
      triggerToast('Registration failed: Required fields empty.');
      return;
    }

    const newProd: DbProduct = {
      id: 'prod-' + Date.now(),
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc,
      icon: newProdIcon,
      status: newProdStatus,
      tags: newProdTags.split(',').map(t => t.trim()).filter(Boolean),
      approved: true
    };

    const updated = [...products, newProd];
    setProducts(updated);
    saveProducts(updated);

    setNewProdName('');
    setNewProdDesc('');
    setNewProdIcon('🛸');
    setNewProdCategory('Digital · SaaS · Lab');
    setNewProdStatus('concept');
    setNewProdTags('Lab Registry, Premium System');

    setProdSuccessMsg(`"${newProd.name}" registered successfully!`);
    triggerToast(`"${newProd.name}" registered successfully.`);
    setTimeout(() => {
      setProdSuccessMsg('');
    }, 4000);
  };

  // Services CRUD handlers
  const toggleServiceApproval = (id: string) => {
    const updated = services.map(s => s.id === id ? { ...s, approved: s.approved === false } : s);
    setServices(updated);
    saveServices(updated);
    triggerToast('Service visibility modified.');
  };

  const deleteService = (id: string) => {
    const filtered = services.filter(s => s.id !== id);
    setServices(filtered);
    saveServices(filtered);
    triggerToast('Service catalog item deleted.');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    const item: DbServiceItem = {
      id: 'srv-' + Date.now(),
      num: newServiceNo,
      name: newServiceName,
      approved: true
    };
    const updated = [...services, item];
    setServices(updated);
    saveServices(updated);
    setNewServiceName('');
    triggerToast('Service registered successfully.');
  };

  // Team Member CRUD handlers
  const toggleTeamApproval = (id: string) => {
    const updated = team.map(t => t.id === id ? { ...t, approved: t.approved === false } : t);
    setTeam(updated);
    saveTeam(updated);
    triggerToast('Team member approval status toggled.');
  };

  const deleteTeam = (id: string) => {
    const filtered = team.filter(t => t.id !== id);
    setTeam(filtered);
    saveTeam(filtered);
    triggerToast('Team member removed.');
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName || !newTeamDesc) return;
    const item: DbTeamMember = {
      id: 'team-' + Date.now(),
      name: newTeamName,
      role: newTeamRole,
      description: newTeamDesc,
      avatarInitials: newTeamInitials,
      approved: true
    };
    const updated = [...team, item];
    setTeam(updated);
    saveTeam(updated);
    setNewTeamName('');
    setNewTeamDesc('');
    triggerToast('New team member registered.');
  };

  // Competitions CRUD handlers
  const toggleCompetitionApproval = (id: string) => {
    const updated = competitions.map(c => c.id === id ? { ...c, approved: c.approved === false } : c);
    setCompetitions(updated);
    saveCompetitions(updated);
    triggerToast('Competition challenge presentation status toggled.');
  };

  const deleteCompetition = (id: string) => {
    const filtered = competitions.filter(c => c.id !== id);
    setCompetitions(filtered);
    saveCompetitions(filtered);
    triggerToast('Competition removed.');
  };

  const handleAddCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompTitle || !newCompDesc) return;
    const item: DbCompetition = {
      id: 'comp-' + Date.now(),
      title: newCompTitle,
      type: newCompType,
      prize: newCompPrize,
      deadline: newCompDeadline,
      status: newCompStatus,
      statusText: newCompStatusText,
      description: newCompDesc,
      approved: true
    };
    const updated = [...competitions, item];
    setCompetitions(updated);
    saveCompetitions(updated);
    setNewCompTitle('');
    setNewCompDesc('');
    triggerToast('Challenge competition posted successfully.');
  };

  // News Chronicles CRUD handlers
  const toggleNewsApproval = (id: string) => {
    const updated = news.map(n => n.id === id ? { ...n, approved: n.approved === false } : n);
    setNews(updated);
    saveNews(updated);
    triggerToast('News chronicle presentation toggled.');
  };

  const deleteNews = (id: string) => {
    const filtered = news.filter(n => n.id !== id);
    setNews(filtered);
    saveNews(filtered);
    triggerToast('Chronicle post removed.');
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle || !newNewsBody) return;
    const item: DbNewsArticle = {
      id: 'news-' + Date.now(),
      title: newNewsTitle,
      body: newNewsBody,
      date: newNewsDate,
      monthYear: newNewsMonthYear,
      category: newNewsCategory,
      approved: true
    };
    const updated = [...news, item];
    setNews(updated);
    saveNews(updated);
    setNewNewsTitle('');
    setNewNewsBody('');
    triggerToast('Chronicle milestone added.');
  };

  // Lab Capabilities CRUD handlers
  const toggleCapabilityApproval = (id: string) => {
    const updated = capabilities.map(c => c.id === id ? { ...c, approved: c.approved === false } : c);
    setCapabilities(updated);
    saveLabCapabilities(updated);
    triggerToast('Forge capability visibility parameter changed.');
  };

  const deleteCapability = (id: string) => {
    const filtered = capabilities.filter(c => c.id !== id);
    setCapabilities(filtered);
    saveLabCapabilities(filtered);
    triggerToast('Forge capability index deleted.');
  };

  const handleAddCapability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCapName || !newCapDetail) return;
    const item: DbLabCapability = {
      id: 'cap-' + Date.now(),
      icon: newCapIcon,
      name: newCapName,
      detail: newCapDetail,
      approved: true
    };
    const updated = [...capabilities, item];
    setCapabilities(updated);
    saveLabCapabilities(updated);
    setNewCapName('');
    setNewCapDetail('');
    triggerToast('New Forge lab capability item compiled.');
  };

  // Calculate metrics
  const totalInquiries = inquiries.length;
  const pendingInquiries = inquiries.filter(i => i.status === 'Pending').length;
  const reviewedInquiries = inquiries.filter(i => i.status === 'Reviewed').length;
  
  const totalReviews = feedbacks.length;
  const approvedReviews = feedbacks.filter(f => f.approved !== false).length;
  const unapprovedReviews = feedbacks.filter(f => f.approved === false).length;
  const avgRating = totalReviews > 0 
    ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1) 
    : '5.0';

  // Categories breakdown
  const categoryCounts: { [key: string]: number } = {};
  inquiries.forEach(inq => {
    categoryCounts[inq.type] = (categoryCounts[inq.type] || 0) + 1;
  });

  // Security Unauthenticated Screen (Passcode Gate)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 animate-fade">
        <div className="bg-[#0c0c0e]/95 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
          {/* Top orange gradient bar */}
          <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-[#C94A1A] via-amber-500 to-[#F57C00]" />
          
          <div className="flex flex-col items-center text-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 relative">
              <Lock className="w-5 h-5 text-[#C94A1A]" />
              <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full" />
            </div>
            
            <div>
              <h2 className="font-sans font-bold text-lg text-white tracking-wide">AUTHENTICATE SYSTEM</h2>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-[2px] mt-1">FIKRAFORGE CREDENTIAL GATEWAY</p>
            </div>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 text-left relative">
              <label className="text-[9px] font-mono text-white/45 uppercase tracking-wider">Secure Access Token / Passcode:</label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter vault secret"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  className="bg-[#050505]/90 border border-white/10 rounded-xl py-3 px-4 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors w-full font-mono text-center tracking-[4px]"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer p-1 text-white/40 hover:text-white transition-colors"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-white/40 font-sans mt-1 text-center">
                * Default bypass passcode is <code className="font-mono bg-white/5 text-amber-500 px-1 py-0.5 rounded text-[9px]">admin</code> or <code className="font-mono bg-white/5 text-amber-500 px-1 py-0.5 rounded text-[9px]">forge</code>
              </p>
            </div>

            {passcodeError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2.5 rounded-xl font-mono flex items-center gap-2 animate-fade">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <span>{passcodeError}</span>
              </div>
            )}

            <button
              type="submit"
              className="mt-2 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl transition-all w-full select-none cursor-pointer border-0 active:scale-95 shadow shadow-[#C94A1A]/20"
            >
              Unlock Vault Console
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-white/5" />
              <span className="text-[8px] font-mono text-white/30 uppercase bg-[#0c0c0e] px-2.5 relative z-10 tracking-widest">
                PREVIEW BYPASS OVERRIDE
              </span>
            </div>

            <button
              type="button"
              onClick={handleDemoBypass}
              className="bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 font-sans text-xs py-2.5 rounded-xl transition-all w-full select-none cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Quick Bypass</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Security Authenticated Screen (Dashboard Room Panel)
  return (
    <div className="max-w-6xl mx-auto py-4 px-1 animate-fade">
      {/* Toast Notification HUD */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[250] bg-[#121215] border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-widest p-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Panel Header Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-extrabold tracking-widest text-[8px] px-1.5 py-0.5 rounded uppercase">
              Clearance Level 1
            </span>
            <span className="text-white/40 font-mono text-xs">·</span>
            <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" /> Live Connected
            </span>
          </div>
          <h1 className="font-sans font-black text-2xl text-white tracking-tight mt-1 uppercase">
            Architect control room
          </h1>
          <p className="font-mono text-[10px] text-white/40 tracking-wider uppercase mt-0.5">
            B2B CONSULTATION & TESTING WORKSPACE HUB
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <button
            onClick={loadDatabase}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Refresh Synced Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-sans font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            Secure Lock Out
          </button>
        </div>
      </div>

      {/* Internal Navigation Ribbon */}
      <div className="flex border-b border-white/5 mb-6 gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
        <button
          onClick={() => setActiveTab('cms')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'cms'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Page Copy CMS
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 relative ${
            activeTab === 'inquiries'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Inquiries
          {pendingInquiries > 0 && (
            <span className="absolute -top-1.5 -right-1 bg-white text-[#C94A1A] text-[7.5px] font-bold font-mono px-1 rounded-full aspect-square min-w-[13px] flex items-center justify-center border border-[#C94A1A]">
              {pendingInquiries}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('feedbacks')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'feedbacks'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Testimonials ({feedbacks.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'products'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Portfolio ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'services'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Services ({services.length})
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'team'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Team ({team.length})
        </button>

        <button
          onClick={() => setActiveTab('studio')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'studio'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Lab Capabilities ({capabilities.length})
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'competitions'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          Competitions ({competitions.length})
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'news'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          News Milestones ({news.length})
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`font-sans text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer select-none shrink-0 ${
            activeTab === 'kpis'
              ? 'text-white bg-[#C94A1A] shadow shadow-[#C94A1A]/20'
              : 'text-white/50 hover:text-white hover:bg-white/[0.02]/40'
          }`}
        >
          KPI Insights
        </button>
      </div>

      {/* METRIC TAB CONTENT */}
      {activeTab === 'kpis' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade">
          
          {/* TOP SUMMARY SCORECARDS CARD BOXES */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:col-span-12">
            
            <div className="bg-[#111113]/55 border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Inquiry Submissions</span>
              <div className="flex items-baseline mt-2 gap-2">
                <span className="text-3xl font-black text-white">{totalInquiries}</span>
                <span className="text-[9px] font-mono text-amber-400 font-bold uppercase">({pendingInquiries} Urgent Pending)</span>
              </div>
              <div className="absolute -right-3 -bottom-3 text-white/[0.01] font-sans font-black text-6xl select-none uppercase pointer-events-none">
                CRM
              </div>
            </div>

            <div className="bg-[#111113]/55 border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Forge Ratings Score</span>
              <div className="flex items-baseline mt-2 gap-2">
                <span className="text-3xl font-black text-white">{avgRating}</span>
                <span className="text-orange-500 font-normal text-sm">★</span>
                <span className="text-[9px] font-mono text-white/30 uppercase">({totalReviews} client reviews)</span>
              </div>
              <div className="absolute -right-3 -bottom-3 text-white/[0.01] font-sans font-black text-6xl select-none uppercase pointer-events-none">
                FEED
              </div>
            </div>

            <div className="bg-[#111113]/55 border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Approved Testimonials</span>
              <div className="flex items-baseline mt-2 gap-2">
                <span className="text-3xl font-black text-white">{approvedReviews}</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">/ {totalReviews} Tot</span>
              </div>
              <div className="absolute -right-3 -bottom-3 text-white/[0.01] font-sans font-black text-6xl select-none uppercase pointer-events-none">
                LIVE
              </div>
            </div>

            <div className="bg-[#111113]/55 border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider block">Product Active Add-ons</span>
              <div className="flex items-baseline mt-2 gap-2">
                <span className="text-3xl font-black text-white">{products.length}</span>
                <span className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Overrides active</span>
              </div>
              <div className="absolute -right-3 -bottom-3 text-white/[0.01] font-sans font-black text-6xl select-none uppercase pointer-events-none">
                SPEC
              </div>
            </div>

          </div>

          {/* CRM INQUIRY DENSE GRAPHIC */}
          <div className="md:col-span-12 lg:col-span-8 bg-[#111113]/55 border border-white/[0.04] p-6 rounded-3xl backdrop-blur-sm">
            <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-2">Category distribution breakdown</h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-6">Inbound client interest by specialization field</p>
            
            {totalInquiries === 0 ? (
              <p className="font-mono text-[10px] text-white/30 italic text-center py-10 bg-black/10 rounded-xl">No inquiry categories detected yet. Seed database is empty.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const percent = Math.round((count / totalInquiries) * 100);
                  return (
                    <div key={cat} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-white/80 font-bold">{cat}</span>
                        <span className="text-[#C94A1A] font-extrabold">{count} inquiry ({percent}%)</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#C94A1A] to-amber-500 h-full rounded-full transition-all duration-500 hover:brightness-110"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* METRIC INFORMATION & SYSTEM STATS SIDEBAR */}
          <div className="md:col-span-12 lg:col-span-4 bg-[#111113]/55 border border-white/[0.04] p-6 rounded-3xl p-5 flex flex-col gap-5 backdrop-blur-sm">
            <div>
              <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">Workspace metadata</h3>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wider mt-0.5">Physical telemetry metrics</p>
            </div>

            <div className="flex flex-col gap-3 font-mono text-[10px]">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">HOST LOCATION</span>
                <span className="text-white font-bold">Cloud Run Sandbox</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">PORT TARGET</span>
                <span className="text-[#C94A1A] font-bold">3000 (Proxy Active)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">SYSTEM TIMESTAMP</span>
                <span className="text-white font-bold">2026-06-17 Active</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/40">AUTHENTICATED IN</span>
                <span className="text-amber-500 font-bold">SessionStorage Secure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">COMPLIANT VER.</span>
                <span className="text-white font-bold">Vite SPA Render Match</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3 text-left">
              <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-sans font-bold text-xs text-white uppercase leading-none mb-1">Professional SLA Guarantee</h5>
                <p className="text-[10px] text-white/50 leading-relaxed font-light font-sans">
                  The controls configured in this dashboard live synchronize using localStorage to deliver reliable performance testing in under 2ms.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* INQUIRIES TAB CONTENT */}
      {activeTab === 'inquiries' && (
        <div className="flex flex-col gap-4 animate-fade">
          <div className="flex justify-between items-center bg-[#111113]/55 border border-white/[0.04] px-4.5 py-3 rounded-2xl">
            <span className="text-[10px] font-mono uppercase tracking-[2px] text-white/40">
              Inquiries list ({inquiries.length} totallogged)
            </span>
            <div className="text-[10px] text-white/30 font-mono">
              Double-click actions to register status modifications
            </div>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-[#111113]/55 border border-white/[0.04] p-12 rounded-3xl text-center">
              <MessageSquare className="w-8 h-8 text-white/25 mx-auto mb-3" />
              <p className="font-mono text-xs text-white/40 italic">Inquiries mailbox is currently empty.</p>
              <p className="font-sans text-[10px] text-white/30 text-wrap mt-1">Submit a briefing client request using the Contact tab to view it populated.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4.5">
              {inquiries.map((inq) => {
                // Color map for badge
                const statusColor = 
                  inq.status === 'Pending' ? 'bg-[#C94A1A]/10 border-[#C94A1A]/35 text-[#C94A1A]' :
                  inq.status === 'Active Callback' ? 'bg-amber-500/10 border-amber-500/35 text-amber-400' :
                  inq.status === 'Reviewed' ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' :
                  'bg-white/5 border-white/10 text-white/40';

                return (
                  <div 
                    key={inq.id} 
                    className="bg-[#111113]/55 border border-white/[0.04] rounded-3xl p-5 hover:border-white/10 transition-all flex flex-col gap-4 relative"
                  >
                    {/* Upper row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-sans font-black text-white text-sm">{inq.name}</h4>
                          <span className="text-white/25 font-mono text-xs">·</span>
                          <span className="font-mono text-[9px] text-[#C94A1A] font-bold tracking-wide uppercase bg-[#C94A1A]/5 px-2 py-0.5 rounded-full border border-[#C94A1A]/15">
                            {inq.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/45 font-mono mt-1 select-all">{inq.email}</p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-wrap mt-1 sm:mt-0">
                        {/* Status badge representation */}
                        <span className={`inline-flex items-center text-[8px] font-mono tracking-wider px-2.5 py-1 rounded border font-semibold ${statusColor}`}>
                          ● {inq.status}
                        </span>
                        
                        <span className="text-[9px] font-mono text-white/30">{inq.date}</span>
                      </div>
                    </div>

                    {/* Middle brief text message block */}
                    <div className="bg-[#050505]/80 border border-white/5 px-4.5 py-3.5 rounded-2xl font-sans text-xs text-white/80 leading-relaxed max-h-[140px] overflow-y-auto font-light font-serif whitespace-pre-wrap">
                      &rdquo;{inq.message}&rdquo;
                    </div>

                    {/* Lower action triggers panel */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/[0.01] p-2 rounded-2xl border border-white/[0.02]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest mr-1">Modify State:</span>
                        
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'Pending')}
                          className="bg-transparent border border-white/5 hover:border-[#C94A1A] hover:bg-[#C94A1A]/5 text-[9px] font-mono text-white/50 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          Pending
                        </button>
                        
                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'Active Callback')}
                          className="bg-transparent border border-white/5 hover:border-amber-500 hover:bg-amber-500/5 text-[9px] font-mono text-white/50 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          SLA Callback
                        </button>

                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'Reviewed')}
                          className="bg-transparent border border-white/5 hover:border-emerald-500 hover:bg-emerald-500/5 text-[9px] font-mono text-white/50 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          Reviewed
                        </button>

                        <button
                          onClick={() => updateInquiryStatus(inq.id, 'Archived')}
                          className="bg-transparent border border-white/5 hover:border-white/20 hover:bg-white/5 text-[9px] font-mono text-white/50 hover:text-white px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          Archive
                        </button>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleCopyInquiryReplyDraft(inq)}
                          className="bg-white/5 border border-white/10 hover:border-white/20 select-none text-[9px] font-mono uppercase tracking-wider text-white/70 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                          title="Generate and copy official responsive email reply text to clipboard for this enquiry"
                        >
                          <Copy className="w-3 h-3 text-[#C94A1A]" />
                          <span>Draft Response</span>
                        </button>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-2 rounded-xl cursor-pointer transition-all"
                          title="Purge Inbound Submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* FEEDBACKS TAB CONTENT */}
      {activeTab === 'feedbacks' && (
        <div className="flex flex-col gap-4 animate-fade">
          <div className="bg-[#111113]/55 border border-white/[0.04] p-4.5 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[2px] text-white/40 block">
                Public review board feedback items ({feedbacks.length})
              </span>
              <p className="font-sans text-[10px] text-white/45 mt-0.5 leading-relaxed font-light">
                Toggle the Approval toggle to hide reviews from public rendering, or Verified Badge to show client credentials.
              </p>
            </div>
            <div className="text-[10px] text-white/30 font-mono text-right shrink-0">
              * Live synchronised with LocalDB
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <div className="bg-[#111113]/55 border border-white/[0.04] p-12 rounded-3xl text-center">
              <Star className="w-8 h-8 text-white/25 mx-auto mb-3" />
              <p className="font-mono text-xs text-white/40 italic">No community feedbacks loaded.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {feedbacks.map((fb) => {
                const isApproved = fb.approved !== false;
                return (
                  <div 
                    key={fb.id}
                    className={`bg-[#111113]/55 border border-white/[0.04] rounded-3xl p-5 flex flex-col justify-between gap-5 transition-all relative ${
                      !isApproved ? 'opacity-55 brightness-75 bg-red-950/[0.02] border-dashed border-red-500/15' : ''
                    }`}
                  >
                    {!isApproved && (
                      <span className="absolute top-3.5 right-3.5 bg-red-500/10 border border-red-500/20 text-red-500 font-mono text-[7px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                        Hidden Offline
                      </span>
                    )}

                    {/* Top Row Author Header */}
                    <div>
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        {fb.avatar ? (
                          <img 
                            src={fb.avatar} 
                            alt={fb.author} 
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C94A1A] to-[#F57C00] flex items-center justify-center text-xs font-bold text-white font-mono shrink-0 shadow shadow-black">
                            {fb.avatarInitials || 'U'}
                          </div>
                        )}

                        <div className="flex-grow min-w-0">
                          <h5 className="font-sans text-xs font-black text-white leading-none mb-1 text-ellipsis overflow-hidden">
                            {fb.author}
                          </h5>
                          <p className="text-[9px] text-white/40 leading-none mr-2 text-ellipsis overflow-hidden">
                            {fb.role}
                          </p>
                        </div>

                        {/* Star visual */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: fb.rating }).map((_, i) => (
                            <span key={i} className="text-[#C94A1A] text-xs">★</span>
                          ))}
                        </div>
                      </div>

                      {/* Content feedback text */}
                      <p className="text-xs text-white/70 italic font-light leading-relaxed font-serif pt-3 whitespace-pre-wrap">
                        &ldquo;{fb.text}&rdquo;
                      </p>
                    </div>

                    {/* Admin Actions row */}
                    <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-white/5 bg-white/[0.01] p-1.5 rounded-xl border border-white/[0.02]">
                      <div className="flex items-center gap-1.5">
                        {/* Approval live toggle */}
                        <button
                          onClick={() => toggleFeedbackApproval(fb.id)}
                          className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                            isApproved 
                              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400 hover:bg-emerald-500/15' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                          }`}
                          title={isApproved ? "Unapprove / Hide review" : "Approve & publish review live"}
                        >
                          {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Verification badge toggle */}
                        <button
                          onClick={() => toggleFeedbackVerified(fb.id)}
                          className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                            fb.verified 
                              ? 'bg-amber-500/10 border-amber-500/35 text-amber-400 hover:bg-amber-500/15' 
                              : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                          }`}
                          title="Toggle Verified Maker Badge"
                        >
                          <Award className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-mono text-white/20 select-none">
                          ID: {String(fb.id).slice(-4)}
                        </span>
                        
                        <button
                          onClick={() => deleteFeedback(fb.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                          title="Purge review from local database"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PORTFOLIO MANAGER TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Joinery Portfolio Blueprint
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Insert a new product into the active catalogue
            </p>

            <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Product Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TanzanSettle"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Category prefix:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fintech · SaaS"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide font-sans">Visual Icon:</label>
                  <select
                    value={newProdIcon}
                    onChange={(e) => setNewProdIcon(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors cursor-pointer select-none"
                  >
                    <option value="💡">💡 Idea Spark</option>
                    <option value="🏠">🏠 PropTech Case</option>
                    <option value="🛰️">🛰️ Satellite Core</option>
                    <option value="🎵">🎵 Music Stream</option>
                    <option value="📡">📡 Telemetry Grid</option>
                    <option value="💳">💳 Mobile Money Payment</option>
                    <option value="🌿">🌿 Eco Tech</option>
                    <option value="⚙️">⚙️ Mechanical Hardware</option>
                    <option value="🛸">🛸 Advanced Special</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Maturity Status:</label>
                  <select
                    value={newProdStatus}
                    onChange={(e) => setNewProdStatus(e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors cursor-pointer select-none"
                  >
                    <option value="live">Live Platform</option>
                    <option value="development">In Development (SLA Active)</option>
                    <option value="concept">Physical Hardware Concept</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Intro Description (Brief):</label>
                <textarea
                  required
                  placeholder="Summarize the core briefing of this artifact..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white h-[60px] resize-none focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Comma Separated Tags:</label>
                <input
                  type="text"
                  placeholder="e.g. React Core, MicroServices, BRELA filed"
                  value={newProdTags}
                  onChange={(e) => setNewProdTags(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-mono"
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Assemble & Publish Portfolio Item
              </button>

              {prodSuccessMsg && (
                <div className="mt-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] p-2.5 rounded-xl font-mono flex items-center gap-2 animate-fade">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{prodSuccessMsg}</span>
                </div>
              )}
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Portfolio Index ({products.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Toggle visibility to approve or hide portfolio items across the website
            </p>

            {products.length === 0 ? (
              <div className="py-12 bg-black/20 rounded-2xl text-center border border-white/5 border-dashed">
                <Layers className="w-8 h-8 text-white/15 mx-auto mb-2" />
                <p className="font-mono text-xs text-white/35 italic">No products registered.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                {products.map((prod) => {
                  const isApproved = prod.approved !== false;
                  return (
                    <div 
                      key={prod.id}
                      className={`bg-black/50 border p-3 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                        !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl select-none bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{prod.icon}</span>
                        <div className="min-w-0">
                          <h5 className="font-sans font-black text-xs text-white leading-none mb-1 truncate">{prod.name}</h5>
                          <p className="text-[9px] font-mono text-white/45 uppercase leading-none truncate">{prod.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="bg-[#C94A1A]/10 border border-[#C94A1A]/30 text-[#C94A1A] font-mono text-[7px] uppercase font-bold px-1 py-0.5 rounded tracking-wider">
                          {prod.status}
                        </span>

                        {/* Approval Toggle (Hide/Show) */}
                        <button
                          onClick={() => toggleProductApproval(prod.id)}
                          className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                            isApproved 
                              ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                              : 'bg-white/5 border-white/10 text-white/45'
                          }`}
                          title={isApproved ? "Hide from website" : "Approve & publish"}
                        >
                          {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                          title="Purge product entirely"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SERVICES MANAGER TAB */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Append Service Category
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Add a specialized architectural consulting service vertical
            </p>

            <form onSubmit={handleAddService} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Category Index Code No:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 06"
                  value={newServiceNo}
                  onChange={(e) => setNewServiceNo(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Service Name / Title / Domain:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Core Deployment"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans"
                />
              </div>

              <button
                type="submit"
                className="mt-2 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Register Service Catalog
              </button>
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Services Index ({services.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Toggle approval state or delete consulting divisions from the layout
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
              {services.map((srv) => {
                const isApproved = srv.approved !== false;
                return (
                  <div 
                    key={srv.id}
                    className={`bg-black/50 border p-3.5 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                      !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#C94A1A] font-bold bg-[#C94A1A]/5 tracking-widest px-2.5 py-1.5 rounded-xl border border-[#C94A1A]/10">
                        {srv.num}
                      </span>
                      <h5 className="font-sans font-bold text-xs text-white leading-normal">{srv.name}</h5>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => toggleServiceApproval(srv.id)}
                        className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isApproved 
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/45'
                        }`}
                        title={isApproved ? "Hide service vertical" : "Publish service vertical"}
                      >
                        {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteService(srv.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                        title="Purge service category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* TEAM MEMBERS MANAGER TAB */}
      {activeTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Register Team Member
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Approve and list a new engineer, designer or lead coordinator
            </p>

            <form onSubmit={handleAddTeam} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Developer Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neema Shayo"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Avatar Initials:</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. NS"
                    value={newTeamInitials}
                    onChange={(e) => setNewTeamInitials(e.target.value.toUpperCase())}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-mono tracking-widest"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Title / Office Role:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Contracts Engineer"
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Short Description (Mission & Craft):</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Specialises in zero-disclosure BRELA protocol checks and multi-signature security systems on-chain."
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none focus:outline-none focus:border-[#C94A1A] transition-colors leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                className="mt-1 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Register Team Associate
              </button>
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Team Members ({team.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Approve and manage visibilities of team member columns on the active website
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[410px] overflow-y-auto pr-1">
              {team.map((member) => {
                const isApproved = member.approved !== false;
                return (
                  <div 
                    key={member.id}
                    className={`bg-black/50 border p-3 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                      !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C94A1A] to-[#F57C00] flex items-center justify-center text-xs font-bold text-white font-mono shrink-0 shadow shadow-black">
                        {member.avatarInitials || 'TZ'}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-sans font-black text-xs text-white leading-none mb-1 truncate">{member.name}</h5>
                        <p className="text-[9px] font-mono text-[#C94A1A] uppercase tracking-wide leading-none truncate">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleTeamApproval(member.id)}
                        className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isApproved 
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/45'
                        }`}
                        title={isApproved ? "Hide from About section" : "Publish to About section"}
                      >
                        {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteTeam(member.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                        title="Delete team associate profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* LAB CAPABILITIES / STUDIO TAB */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Append Studio Capability
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Add a dynamic hardware or testing SLA capability onto the Design Studio
            </p>

            <form onSubmit={handleAddCapability} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Category Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CNC Mill 5-Axis"
                    value={newCapName}
                    onChange={(e) => setNewCapName(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide font-sans">Lab Icon:</label>
                  <select
                    value={newCapIcon}
                    onChange={(e) => setNewCapIcon(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors cursor-pointer select-none"
                  >
                    <option value="⚙️">⚙️ Standard Machine</option>
                    <option value="🎛️">🎛️ Controller HUD</option>
                    <option value="📐">📐 Spatial Measure</option>
                    <option value="🪐">🪐 Aerospace Special</option>
                    <option value="🧪">🧪 Chemical Labs</option>
                    <option value="🦾">🦾 Robotics SLA</option>
                    <option value="🖥️">🖥️ Supercomputing Core</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Detailed Specifications / Bounds:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. SLA rapid stereolithography 3D printer for medical grade resin structures, bound volume 180mm x 180mm."
                  value={newCapDetail}
                  onChange={(e) => setNewCapDetail(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none focus:outline-none focus:border-[#C94A1A] transition-colors leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                className="mt-1 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Register Studio Capability
              </button>
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Studio Capabilities ({capabilities.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Approve or hide industrial capabilities within the Design Studio laboratory vertical
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {capabilities.map((cap) => {
                const isApproved = cap.approved !== false;
                return (
                  <div 
                    key={cap.id}
                    className={`bg-black/50 border p-3 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                      !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{cap.icon}</span>
                      <div className="min-w-0">
                        <h5 className="font-sans font-black text-xs text-white leading-none mb-1 truncate">{cap.name}</h5>
                        <p className="text-[9px] font-sans text-white/45 leading-none truncate">{cap.detail}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => toggleCapabilityApproval(cap.id)}
                        className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isApproved 
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/45'
                        }`}
                        title={isApproved ? "Hide capability vertical" : "Publish capability vertical"}
                      >
                        {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteCapability(cap.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                        title="Delete capability index"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* COMPETITIONS TAB */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Append Hackathon / Competition
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Launch a community engineering challenge or research call
            </p>

            <form onSubmit={handleAddCompetition} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Competition Heading Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BRELA Industrial Design Call"
                  value={newCompTitle}
                  onChange={(e) => setNewCompTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Prizes Package / Fund:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tsh 10,000,000 / $4,000"
                    value={newCompPrize}
                    onChange={(e) => setNewCompPrize(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Deadline Date:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. November 15, 2026"
                    value={newCompDeadline}
                    onChange={(e) => setNewCompDeadline(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Type Label:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IoT Hackathon"
                    value={newCompType}
                    onChange={(e) => setNewCompType(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">State Status:</label>
                  <select
                    value={newCompStatus}
                    onChange={(e) => setNewCompStatus(e.target.value as any)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors cursor-pointer"
                  >
                    <option value="live">Live (Apply Now)</option>
                    <option value="upcoming">Upcoming (Review Draft)</option>
                    <option value="past">Past (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Status Description Text:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Submissions Open on BRELA standards"
                  value={newCompStatusText}
                  onChange={(e) => setNewCompStatusText(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Brief / Challenge Tasks Target:</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Design a physical automated machine safety layout following ISO-9001 specs..."
                  value={newCompDesc}
                  onChange={(e) => setNewCompDesc(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none focus:outline-none focus:border-[#C94A1A] transition-colors leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                className="mt-1 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Assemble & Publish Challenge
              </button>
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Competitions Directory ({competitions.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Manage hackathons, eligibility status, or delete items from the database
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {competitions.map((comp) => {
                const isApproved = comp.approved !== false;
                return (
                  <div 
                    key={comp.id}
                    className={`bg-black/50 border p-3.5 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                      !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-amber-500/10 border border-amber-500/35 text-amber-500 text-[7px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold font-mono">
                          {comp.status}
                        </span>
                        <h5 className="font-sans font-black text-xs text-white leading-none truncate">{comp.title}</h5>
                      </div>
                      <p className="text-[9px] font-mono text-white/45 leading-none truncate mt-1">
                        Prize Fund: <span className="text-[#C94A1A] font-bold">{comp.prize}</span> · Deadline: {comp.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleCompetitionApproval(comp.id)}
                        className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isApproved 
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/45'
                        }`}
                        title={isApproved ? "Hide competition" : "Publish competition"}
                      >
                        {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteCompetition(comp.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                        title="Delete competition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* NEWS CHRONICLES TAB */}
      {activeTab === 'news' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade text-left">
          
          {/* REGISTRATION FORM PANEL */}
          <div className="lg:col-span-5 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm self-start">
            <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C94A1A]" /> Append Chronicle / Milestone
            </h3>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Publish a chronological progress log or product news flash
            </p>

            <form onSubmit={handleAddNews} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Chronicle Headline Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FikraForge Secures BRELA Multi-device CAD Filing"
                  value={newNewsTitle}
                  onChange={(e) => setNewNewsTitle(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Date (Day Number):</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 17"
                    value={newNewsDate}
                    onChange={(e) => setNewNewsDate(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Month & Year Label:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JUN 2026"
                    value={newNewsMonthYear}
                    onChange={(e) => setNewNewsMonthYear(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Chronicle Category:</label>
                <select
                  value={newNewsCategory}
                  onChange={(e) => setNewNewsCategory(e.target.value as any)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors cursor-pointer"
                >
                  <option value="Milestone">Milestone Integration</option>
                  <option value="Product">Product Launch</option>
                  <option value="Studio">Studio Insight</option>
                  <option value="General">General Broadcast</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-mono text-white/45 uppercase tracking-wide">Chronicle Brief Summary Content:</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write a clear timeline briefing explaining the core milestone achievements..."
                  value={newNewsBody}
                  onChange={(e) => setNewNewsBody(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white resize-none focus:outline-none focus:border-[#C94A1A] transition-colors leading-relaxed font-sans"
                />
              </div>

              <button
                type="submit"
                className="mt-1 bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-semibold text-xs py-3 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow shadow-[#C94A1A]/20"
              >
                Assemble & Log Milestone
              </button>
            </form>
          </div>

          {/* LIST AND MANAGEMENT PANEL */}
          <div className="lg:col-span-7 bg-[#111113]/55 border border-white/[0.04] p-5 rounded-3xl backdrop-blur-sm">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-sans font-black text-xs text-white uppercase tracking-wider">
                Manage Chronicles Feed ({news.length})
              </h3>
              <span className="text-[9px] font-mono text-white/30 uppercase">Local Storage DB</span>
            </div>
            <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-5">
              Approve or temporarily hide news cards from rendering on the live timelines
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
              {news.map((n) => {
                const isApproved = n.approved !== false;
                return (
                  <div 
                    key={n.id}
                    className={`bg-black/50 border p-3.5 rounded-2xl flex items-center justify-between text-left gap-3 animate-fade ${
                      !isApproved ? 'opacity-40 border-dashed border-red-500/20 bg-red-950/[0.02]' : 'border-white/5'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#C94A1A]/10 border border-[#C94A1A]/35 text-[#C94A1A] text-[7.5px] uppercase tracking-wider px-1 py-0.5 rounded font-bold font-mono">
                          {n.category}
                        </span>
                        <h5 className="font-sans font-black text-xs text-white leading-none truncate">{n.title}</h5>
                      </div>
                      <p className="text-[9px] font-mono text-white/45 leading-none mt-1">
                        Timeline Date: {n.date} {n.monthYear}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleNewsApproval(n.id)}
                        className={`border p-1.5 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                          isApproved 
                            ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-400' 
                            : 'bg-white/5 border-white/10 text-white/45'
                        }`}
                        title={isApproved ? "Hide chronicle card" : "Publish chronicle card"}
                      >
                        {isApproved ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => deleteNews(n.id)}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 p-1.5 rounded-lg cursor-pointer transition-all"
                        title="Delete news article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* PAGE COPY CMS EDITOR TAB */}
      {activeTab === 'cms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade text-left">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-[#111113]/55 border border-white/[0.04] p-6 rounded-3xl backdrop-blur-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div>
                  <h3 className="font-sans font-black text-base text-white uppercase tracking-wider">
                    Website Page Content Manager
                  </h3>
                  <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mt-1">
                    Live edit all front-facing subtitles, headings, and description blocks
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm("Restore entire page copy to original factory copy?")) {
                        const updated = saveCMSData(DEFAULT_CMS);
                        setCmsValues(updated);
                        triggerToast("CMS page copy reverted to pristine defaults successfully!");
                      }
                    }}
                    type="button"
                    className="inline-flex items-center gap-1 bg-white/5 hover:bg-white/10 text-white/70 font-sans text-[10px] px-3 py-1.5 rounded-lg border border-white/10 transition-colors uppercase font-mono cursor-pointer"
                    title="Undo all modifications and revert copy to template defaults"
                  >
                    <Undo className="w-3.5 h-3.5" /> Revert Defaults
                  </button>
                </div>
              </div>

              {/* Form container */}
              <div className="flex flex-col gap-6">
                
                {/* 1. HERO TAB ACCORDION GROUP */}
                <div className="border border-white/5 bg-black/30 rounded-2xl p-4.5">
                  <h4 className="font-sans font-bold text-xs text-[#C94A1A] uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    1. Hero Section Landing Copy
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Glowing Hub Badge Label:</label>
                      <input
                        type="text"
                        value={cmsValues.hero_badge}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, hero_badge: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Heading Line 1 (White Title):</label>
                        <input
                          type="text"
                          value={cmsValues.hero_title_1}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, hero_title_1: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-bold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Heading Line 2 (Vibrant Title):</label>
                        <input
                          type="text"
                          value={cmsValues.hero_title_2}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, hero_title_2: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-bold text-[#C94A1A]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Main Hero Narrative Intro:</label>
                      <textarea
                        rows={3}
                        value={cmsValues.hero_description}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, hero_description: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. SERVICES TAB ACCORDION GROUP */}
                <div className="border border-white/5 bg-black/30 rounded-2xl p-4.5">
                  <h4 className="font-sans font-bold text-xs text-[#C94A1A] uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    2. Service Offerings Copy
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Services Group Side Tagline:</label>
                      <input
                        type="text"
                        value={cmsValues.services_tagline}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, services_tagline: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Group Title Core line:</label>
                        <input
                          type="text"
                          value={cmsValues.services_title_1}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, services_title_1: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Group Title Extension line:</label>
                        <input
                          type="text"
                          value={cmsValues.services_title_2}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, services_title_2: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-semibold text-[#C94A1A]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Services Overview Paragraph:</label>
                      <textarea
                        rows={3}
                        value={cmsValues.services_description}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, services_description: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. ABOUT ACCORDION GROUP */}
                <div className="border border-white/5 bg-black/30 rounded-2xl p-4.5">
                  <h4 className="font-sans font-bold text-xs text-[#C94A1A] uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    3. About Us / Story Copy
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">About Section Top Tagline:</label>
                      <input
                        type="text"
                        value={cmsValues.about_tagline}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, about_tagline: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Story Title Line 1 (White Title):</label>
                        <input
                          type="text"
                          value={cmsValues.about_title_1}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, about_title_1: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-semibold"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Story Title Line 2 (Vibrant Title):</label>
                        <input
                          type="text"
                          value={cmsValues.about_title_2}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, about_title_2: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-semibold text-[#c94a1a]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Establishment Paragraph 1:</label>
                      <textarea
                        rows={3}
                        value={cmsValues.about_desc_1}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, about_desc_1: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Rapid Prototyping Laboratory Paragraph 2:</label>
                      <textarea
                        rows={3}
                        value={cmsValues.about_desc_2}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, about_desc_2: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. CONTACT ACCORDION GROUP */}
                <div className="border border-white/5 bg-black/30 rounded-2xl p-4.5">
                  <h4 className="font-sans font-bold text-xs text-[#C94A1A] uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                    4. Contact & SLA Copy
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Contact Section Badge Label:</label>
                        <input
                          type="text"
                          value={cmsValues.contact_tagline}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, contact_tagline: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Contact Title Label:</label>
                        <input
                          type="text"
                          value={cmsValues.contact_title}
                          onChange={(e) => setCmsValues(prev => ({ ...prev, contact_title: e.target.value }))}
                          className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Briefing Description Text:</label>
                      <textarea
                        rows={3}
                        value={cmsValues.contact_description}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, contact_description: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-sans leading-relaxed resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-white/40 uppercase tracking-wide">Detailed Working Hours Coordinates SLA footnote:</label>
                      <textarea
                        rows={2}
                        value={cmsValues.contact_working_hours}
                        onChange={(e) => setCmsValues(prev => ({ ...prev, contact_working_hours: e.target.value }))}
                        className="bg-black/50 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C94A1A] transition-colors font-mono tracking-tight leading-relaxed resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Action save trigger */}
                <button
                  onClick={() => {
                    const saved = saveCMSData(cmsValues);
                    setCmsValues(saved);
                    triggerToast("New CMS front-facing page copy saved and compiled successfully!");
                  }}
                  type="button"
                  className="w-full bg-[#C94A1A] hover:bg-[#E0531E] text-white font-sans font-black text-xs uppercase py-4 rounded-xl cursor-pointer select-none transition-all active:scale-95 border-0 shadow-lg shadow-[#C94A1A]/25 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Front-page Copy Configurations
                </button>

              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#111113]/55 border border-white/[0.04] p-6 rounded-3xl backdrop-blur-sm">
              <h4 className="font-sans font-black text-xs text-white uppercase tracking-wider mb-1">
                Live CMS Monitor
              </h4>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-wide mb-6">
                Active context synchronizers
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase">Dynamic Dispatch: Online</span>
                  </div>
                  <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light">
                    Every keystroke on the left edits the local blueprint context. Saving triggers a secure broadcast event across the page viewport instantly!
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-left text-xs space-y-2">
                  <h5 className="font-mono text-[9px] text-white/45 uppercase font-bold tracking-wide">Current Payload Size:</h5>
                  <div className="font-mono text-[10px] text-[#C94A1A] font-semibold bg-[#C94A1A]/5 border border-[#C94A1A]/20 p-2 rounded-lg">
                    {JSON.stringify(cmsValues).length} Bytes
                  </div>
                  <p className="text-[10px] text-white/30 font-light leading-relaxed">
                    Serialized representation is stored in localized sandboxed safe systems for maximum retention.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
