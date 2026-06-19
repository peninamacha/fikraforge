/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProductPlatform {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  icon: string;
  price?: string;
  url?: string;
  tags?: string[];
  status: 'live' | 'development' | 'concept';
  image?: string;
}

export interface Competition {
  id: string;
  title: string;
  status: 'live' | 'upcoming' | 'past';
  statusText: string;
  description: string;
  partners?: string[];
  prize: string;
  deadline: string;
  type: string;
}

export interface NewsArticle {
  id: string;
  date: string;
  monthYear: string;
  title: string;
  body: string;
  category: 'Milestone' | 'Product' | 'Studio' | 'General';
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role: string;
  avatarInitials: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarInitials: string;
}

export interface ServiceItem {
  id: string;
  num: string;
  name: string;
}

export interface LabCapability {
  id: string;
  icon: string;
  name: string;
  detail: string;
}
