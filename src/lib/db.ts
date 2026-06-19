/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProductPlatform, Competition, NewsArticle, Testimonial, TeamMember, ServiceItem, LabCapability } from '../types';
import { PRODUCTS, COMPETITIONS, NEWS, TESTIMONIALS, TEAM, SERVICES, LAB_CAPABILITIES } from '../data/fikraData';

// Extended types with optional approved flag
export interface DbProduct extends ProductPlatform {
  approved?: boolean;
}

export interface DbCompetition extends Competition {
  approved?: boolean;
}

export interface DbNewsArticle extends NewsArticle {
  approved?: boolean;
}

export interface DbTestimonial extends Testimonial {
  approved?: boolean;
  verified?: boolean;
  rating?: number; // fallback rating for reviews/feedbacks
  avatar?: string;
  date?: string;
}

export interface DbTeamMember extends TeamMember {
  approved?: boolean;
}

export interface DbServiceItem extends ServiceItem {
  approved?: boolean;
}

export interface DbLabCapability extends LabCapability {
  approved?: boolean;
}

// Event Dispatch Helper
function dispatchDbUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fikra_db_updated'));
  }
}

// 1. SERVICES
export function getServices(): DbServiceItem[] {
  if (typeof window === 'undefined') {
    return SERVICES.map(s => ({ ...s, approved: true }));
  }
  const stored = localStorage.getItem('fikra_services');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return SERVICES.map(s => ({ ...s, approved: true }));
    }
  }
  const initial = SERVICES.map(s => ({ ...s, approved: true }));
  localStorage.setItem('fikra_services', JSON.stringify(initial));
  return initial;
}

export function saveServices(list: DbServiceItem[]): DbServiceItem[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_services', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}

// 2. TEAM MEMBERS
export function getTeam(): DbTeamMember[] {
  if (typeof window === 'undefined') {
    return TEAM.map(t => ({ ...t, approved: true }));
  }
  const stored = localStorage.getItem('fikra_team_members');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return TEAM.map(t => ({ ...t, approved: true }));
    }
  }
  const initial = TEAM.map(t => ({ ...t, approved: true }));
  localStorage.setItem('fikra_team_members', JSON.stringify(initial));
  return initial;
}

export function saveTeam(list: DbTeamMember[]): DbTeamMember[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_team_members', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}

// 3. PRODUCTS (Portfolio section)
export function getProducts(): DbProduct[] {
  if (typeof window === 'undefined') {
    return PRODUCTS.map(p => ({ ...p, approved: true }));
  }
  const stored = localStorage.getItem('fikra_portfolio_items');
  if (stored) {
    try {
      let items = JSON.parse(stored) as DbProduct[];
      let changed = false;
      items = items.map(item => {
        const matchingFresh = PRODUCTS.find(p => p.id === item.id);
        if (matchingFresh) {
          if (!item.image || item.image.includes('placehold.co') || item.image.includes('placeholder')) {
            item.image = matchingFresh.image;
            changed = true;
          }
        }
        return item;
      });
      if (changed) {
        localStorage.setItem('fikra_portfolio_items', JSON.stringify(items));
      }
      return items;
    } catch (e) {
      return PRODUCTS.map(p => ({ ...p, approved: true }));
    }
  }
  
  // Also check if there were legacy overrides from previous layout builds
  const legacyStr = localStorage.getItem('override_products');
  let legacy: DbProduct[] = [];
  if (legacyStr) {
    try {
      legacy = JSON.parse(legacyStr).map((p: any) => ({ ...p, approved: true }));
    } catch (e) {}
  }

  const initial = [...PRODUCTS.map(p => ({ ...p, approved: true })), ...legacy];
  localStorage.setItem('fikra_portfolio_items', JSON.stringify(initial));
  return initial;
}

export function saveProducts(list: DbProduct[]): DbProduct[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_portfolio_items', JSON.stringify(list));
  // Keep legacy key in sync for safety in case some older code relies on it
  localStorage.setItem('override_products', JSON.stringify(list.filter(p => p.approved)));
  dispatchDbUpdate();
  return list;
}

// 4. COMPETITIONS
export function getCompetitions(): DbCompetition[] {
  if (typeof window === 'undefined') {
    return COMPETITIONS.map(c => ({ ...c, approved: true }));
  }
  const stored = localStorage.getItem('fikra_competitions');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return COMPETITIONS.map(c => ({ ...c, approved: true }));
    }
  }
  const initial = COMPETITIONS.map(c => ({ ...c, approved: true }));
  localStorage.setItem('fikra_competitions', JSON.stringify(initial));
  return initial;
}

export function saveCompetitions(list: DbCompetition[]): DbCompetition[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_competitions', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}

// 5. NEWS ARTICLES
export function getNews(): DbNewsArticle[] {
  if (typeof window === 'undefined') {
    return NEWS.map(n => ({ ...n, approved: true }));
  }
  const stored = localStorage.getItem('fikra_news_articles');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return NEWS.map(n => ({ ...n, approved: true }));
    }
  }
  const initial = NEWS.map(n => ({ ...n, approved: true }));
  localStorage.setItem('fikra_news_articles', JSON.stringify(initial));
  return initial;
}

export function saveNews(list: DbNewsArticle[]): DbNewsArticle[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_news_articles', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}

// 6. TESTIMONIALS / FEEDBACKS
export function getFeedbacks(): DbTestimonial[] {
  if (typeof window === 'undefined') {
    return TESTIMONIALS.map((t, idx) => ({
      ...t,
      id: t.id || `pre-${idx}`,
      approved: true,
      verified: true,
      rating: 5,
      date: 'Preloaded milestone'
    }));
  }
  const stored = localStorage.getItem('fikra_feedbacks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return TESTIMONIALS.map(t => ({ ...t, approved: true, verified: true, rating: 5, date: 'Preloaded' }));
    }
  }
  
  const initial = TESTIMONIALS.map((t, idx) => ({
    ...t,
    id: t.id || `pre-${idx}`,
    approved: true,
    verified: true,
    rating: 5,
    date: 'Preloaded milestone'
  }));
  localStorage.setItem('fikra_feedbacks', JSON.stringify(initial));
  return initial;
}

export function saveFeedbacks(list: DbTestimonial[]): DbTestimonial[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_feedbacks', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}

// 7. LAB CAPABILITIES
export function getLabCapabilities(): DbLabCapability[] {
  if (typeof window === 'undefined') {
    return LAB_CAPABILITIES.map(l => ({ ...l, approved: true }));
  }
  const stored = localStorage.getItem('fikra_lab_capabilities');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return LAB_CAPABILITIES.map(l => ({ ...l, approved: true }));
    }
  }
  const initial = LAB_CAPABILITIES.map(l => ({ ...l, approved: true }));
  localStorage.setItem('fikra_lab_capabilities', JSON.stringify(initial));
  return initial;
}

export function saveLabCapabilities(list: DbLabCapability[]): DbLabCapability[] {
  if (typeof window === 'undefined') return list;
  localStorage.setItem('fikra_lab_capabilities', JSON.stringify(list));
  dispatchDbUpdate();
  return list;
}
