import { Star } from 'lucide-react';

interface VideoProps {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  thumbnail: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
}

export function VideoCard({ id, youtubeId, title, channel, thumbnail, isFavorite, onToggleFavorite }: VideoProps) {
  return (
    <div className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500/50 transition-all shadow-lg hover:shadow-2xl hover:-translate-y-1 duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button 
          onClick={() => onToggleFavorite(id, isFavorite)}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-slate-900/40 backdrop-blur-md hover:bg-slate-900/80 transition-colors border border-white/10"
        >
          <Star className={`w-5 h-5 transition-transform active:scale-75 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-white font-semibold line-clamp-2 mb-1" title={title}>{title}</h3>
        <p className="text-slate-400 text-sm mb-4">{channel}</p>
        <a 
          href={`https://youtube.com/watch?v=${youtubeId}`} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
