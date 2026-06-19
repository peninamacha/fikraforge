/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Music, 
  Globe, 
  Home, 
  MessageSquare, 
  Coins, 
  Settings, 
  Printer, 
  Monitor, 
  Lightbulb, 
  Lock, 
  ClipboardList, 
  FolderGit, 
  Satellite, 
  Radio, 
  Leaf, 
  HelpCircle,
  Award,
  Sliders,
  Ruler,
  Orbit,
  FlaskConical,
  Cpu
} from 'lucide-react';

interface FikraIconProps {
  icon: string;
  className?: string;
}

export default function FikraIcon({ icon, className = "w-5 h-5 text-[#E0531E]" }: FikraIconProps) {
  // Strip potential extra spaces or formatting
  const key = icon.trim();

  switch (key) {
    case '🎵':
      return <Music className={className} />;
    case '🌍':
      return <Globe className={className} />;
    case '🏠':
      return <Home className={className} />;
    case '💬':
      return <MessageSquare className={className} />;
    case '💰':
      return <Coins className={className} />;
    case '⚙️':
      return <Settings className={className} />;
    case '🖨️':
      return <Printer className={className} />;
    case '🖥️':
      return <Monitor className={className} />;
    case '💡':
      return <Lightbulb className={className} />;
    case '🔒':
      return <Lock className={className} />;
    case '📋':
      return <ClipboardList className={className} />;
    case '🛰️':
      return <Satellite className={className} />;
    case '📡':
      return <Radio className={className} />;
    case '💳':
      return <Coins className={className} />;
    case '🌿':
      return <Leaf className={className} />;
    case '🛸':
      return <FolderGit className={className} />;
    case '🎛️':
      return <Sliders className={className} />;
    case '📐':
      return <Ruler className={className} />;
    case '🪐':
      return <Orbit className={className} />;
    case '🧪':
      return <FlaskConical className={className} />;
    case '🦾':
      return <Cpu className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}
