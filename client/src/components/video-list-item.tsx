import { VideoItem } from "@/hooks/use-playlist-simulator";
import { Check, Loader2, PlayCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface VideoListItemProps {
  video: VideoItem;
  index: number;
}

export function VideoListItem({ video, index }: VideoListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        relative overflow-hidden p-4 rounded-xl border transition-all duration-300
        ${video.status === 'downloading' 
          ? 'bg-primary/5 border-primary/20 shadow-lg shadow-primary/5' 
          : 'bg-card border-border/50 hover:border-border'}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Status Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2
          ${video.status === 'completed' ? 'bg-green-100 border-green-500 text-green-600' : ''}
          ${video.status === 'downloading' ? 'bg-primary/10 border-primary text-primary' : ''}
          ${video.status === 'pending' ? 'bg-muted border-border text-muted-foreground' : ''}
        `}>
          {video.status === 'completed' && <Check className="w-5 h-5" />}
          {video.status === 'downloading' && <Loader2 className="w-5 h-5 animate-spin" />}
          {video.status === 'pending' && <span className="text-xs font-bold">{index + 1}</span>}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate pr-4" title={video.title}>
            {video.title}
          </h4>
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {video.duration}
            </span>
            <span className="capitalize">{video.status === 'downloading' ? `Downloading... ${Math.round(video.progress)}%` : video.status}</span>
          </div>
        </div>

        {/* Play Icon (Decorative) */}
        <PlayCircle className="w-5 h-5 text-muted-foreground/30" />
      </div>

      {/* Progress Bar (Only visible when downloading) */}
      {video.status === 'downloading' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${video.progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
}
