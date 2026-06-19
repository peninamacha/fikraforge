/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CMSData {
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_description: string;
  
  services_tagline: string;
  services_title_1: string;
  services_title_2: string;
  services_description: string;
  
  about_tagline: string;
  about_title_1: string;
  about_title_2: string;
  about_desc_1: string;
  about_desc_2: string;
  
  contact_tagline: string;
  contact_title: string;
  contact_description: string;
  contact_working_hours: string;
}

export const DEFAULT_CMS: CMSData = {
  hero_badge: "Technology company & innovation hub · Dar es Salaam",
  hero_title_1: "Forge the",
  hero_title_2: "Future.",
  hero_description: "We transform bold ideas into concrete digital products, secure cloud platforms, and physical mechanical prototypes. We blend code precision with material engineering to empower African creators and businesses.",
  
  services_tagline: "Core Service Offerings",
  services_title_1: "B2B Consultancy",
  services_title_2: "& Tech Production.",
  services_description: "At FikraForge Inc., we specialize in turning abstract requirements into highly-optimized, secure digital assets and physical assemblies ready for immediate market scale.",
  
  about_tagline: "About FikraForge",
  about_title_1: "Where ideas",
  about_title_2: "meet the forge.",
  about_desc_1: "FikraForge Inc. operates in Dar es Salaam, Tanzania as a premier high-tech design consultancy. We combine the agility of software engineering with the rigorous specifications of physical product modeling and legal IP protection.",
  about_desc_2: "We maintain our local rapid prototyping laboratory containing premium FDM 3D printing equipment, customized physical testing rigs, and automated manufacturing pipelines. Every project is crafted for optimal resource usage.",
  
  contact_tagline: "Initiate Briefing",
  contact_title: "Let's build something real.",
  contact_description: "Whether you have a custom mobile app to compile, physical CAD mechanisms to prototype, or patent applications to file, our team is ready to forge your vision.",
  contact_working_hours: "Our coordinates: Monday - Saturday, 08:30 AM - 06:00 PM (EAT). Physical Forge appointments scheduled via initial brief confirmation.",
};

export function getCMSData(): CMSData {
  if (typeof window === 'undefined') {
    return DEFAULT_CMS;
  }
  const stored = localStorage.getItem('fikra_cms_values');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CMS, ...parsed };
    } catch (e) {
      return DEFAULT_CMS;
    }
  }
  return DEFAULT_CMS;
}

export function saveCMSData(data: Partial<CMSData>): CMSData {
  const current = getCMSData();
  const updated = { ...current, ...data };
  if (typeof window === 'undefined') {
    return updated;
  }
  localStorage.setItem('fikra_cms_values', JSON.stringify(updated));
  // Dispatch event so other rendered components update reactively in the preview
  window.dispatchEvent(new CustomEvent('fikra_cms_updated', { detail: updated }));
  return updated;
}
