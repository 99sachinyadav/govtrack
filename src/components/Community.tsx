import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Heart, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface CommunityProps {
  projects: Project[];
}

export const Community: React.FC<CommunityProps> = ({ projects }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-gov-blue mb-2 tracking-tight">Citizen Community Feed</h2>
          <p className="text-gov-blue/50 font-medium">Collaborative oversight and ground-level reporting by verified citizens.</p>
        </div>
        <button className="gov-button-primary flex items-center gap-2 text-xs">
          <Camera className="w-4 h-4" />
          Post Ground Update
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Community Feed */}
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="gov-card overflow-hidden bg-white"
            >
              <div className="p-6 flex items-center justify-between border-b border-gov-blue/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gov-blue/5 border border-gov-blue/10 flex items-center justify-center font-bold text-gov-blue">
                    {project.citizenFeedback[0]?.userName[0] || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gov-blue">{project.citizenFeedback[0]?.userName || 'Anonymous Citizen'}</p>
                    <p className="text-[10px] text-gov-blue/40 font-bold flex items-center gap-1 uppercase tracking-wider">
                      <MapPin className="w-3 h-3" />
                      {project.location.address}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gov-green/10 border border-gov-green/20 text-[10px] font-bold text-gov-green uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Reporter
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gov-blue/70 leading-relaxed mb-6 font-medium">
                  {project.citizenFeedback[0]?.comment || "Just visited the site. The work seems to be progressing as per the timeline. Quality of materials used looks standard."}
                </p>
                <div className="aspect-video rounded-2xl bg-gov-bg overflow-hidden mb-6 relative group border border-gov-blue/5">
                  <img 
                    src={`https://picsum.photos/seed/report-${project.id}/800/450`} 
                    alt="Ground Report" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gov-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-xs font-bold text-white tracking-widest uppercase">Geo-tagged: {project.location.lat}, {project.location.lng}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 text-gov-blue/40 hover:text-gov-saffron transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs font-bold">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-gov-blue/40 hover:text-gov-blue transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-xs font-bold">8</span>
                    </button>
                    <button className="flex items-center gap-2 text-gov-blue/40 hover:text-gov-blue transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < 4 ? "text-gov-saffron fill-gov-saffron" : "text-gov-blue/10")} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="gov-card p-6 bg-white">
            <h3 className="text-lg font-display font-bold text-gov-blue mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-gov-saffron" />
              Top Contributors
            </h3>
            <div className="space-y-6">
              {[
                { name: 'Amit Kumar', points: 1250, reports: 45 },
                { name: 'Sonal Singh', points: 980, reports: 32 },
                { name: 'Vikram Rao', points: 840, reports: 28 },
                { name: 'Ananya Iyer', points: 720, reports: 21 },
              ].map((user, i) => (
                <div key={user.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gov-bg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gov-blue/5 flex items-center justify-center text-xs font-bold text-gov-blue border border-gov-blue/10">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gov-blue">{user.name}</p>
                      <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-wider">{user.reports} Reports Filed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gov-saffron">{user.points}</p>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest">Points</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-xl bg-gov-bg border border-gov-blue/5 text-[10px] font-bold text-gov-blue uppercase tracking-widest hover:bg-gov-blue hover:text-white transition-all">
              View Full Leaderboard
            </button>
          </div>

          <div className="gov-card p-6 bg-gov-blue text-white">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gov-saffron" />
              Integrity Rewards
            </h3>
            <p className="text-xs text-white/70 mb-8 leading-relaxed font-light">
              Active citizens who provide verified ground reports earn Integrity Points, which can be redeemed for public service benefits and priority grievance handling.
            </p>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gov-saffron/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-gov-saffron" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Balance</p>
                  <p className="text-2xl font-display font-bold text-white">450</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-gov-saffron hover:underline uppercase tracking-widest">Redeem</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
