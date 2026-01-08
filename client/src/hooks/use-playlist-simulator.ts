import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  progress: number;
}

export function usePlaylistSimulator() {
  const [url, setUrl] = useState('');
  const [playlistId, setPlaylistId] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentDownloadIndex, setCurrentDownloadIndex] = useState(-1);
  const { toast } = useToast();
  
  // Ref to handle cancellation if needed, though simple simulation here
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPlaylist = () => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid YouTube playlist URL.",
      });
      return;
    }

    // Simulate API delay
    setIsProcessing(true);
    setTimeout(() => {
      // Mock Data Generation
      const mockVideos: VideoItem[] = Array.from({ length: Math.floor(Math.random() * 8) + 5 }).map((_, i) => ({
        id: `vid-${i}`,
        title: [
          "Complete React Tutorial for Beginners - Part " + (i + 1),
          "Advanced TypeScript Patterns - Module " + (i + 1),
          "LoFi Hip Hop Mix - Study Session " + (i + 1),
          "Web Development Roadmap 2024 - Step " + (i + 1),
          "UI/UX Design Masterclass - Chapter " + (i + 1)
        ][i % 5],
        duration: `${Math.floor(Math.random() * 10) + 2}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
        status: 'pending',
        progress: 0
      }));

      setVideos(mockVideos);
      setPlaylistId("PL" + Math.random().toString(36).substr(2, 9));
      setIsProcessing(false);
      toast({
        title: "Playlist Found!",
        description: `Successfully loaded ${mockVideos.length} videos.`,
      });
    }, 1500);
  };

  const startDownload = async () => {
    if (videos.length === 0) return;
    
    // Reset statuses if restarting
    setVideos(prev => prev.map(v => ({ ...v, status: 'pending', progress: 0 })));
    setCurrentDownloadIndex(0);

    // Process queue
    for (let i = 0; i < videos.length; i++) {
      setCurrentDownloadIndex(i);
      
      // Update status to downloading
      setVideos(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'downloading' } : v));
      
      // Simulate download progress
      await simulateVideoDownload(i);
      
      // Mark complete
      setVideos(prev => prev.map((v, idx) => idx === i ? { ...v, status: 'completed', progress: 100 } : v));

      // Trigger browser download for the first one only (demo)
      if (i === 0) {
        try {
          const blob = new Blob(["This is a simulated video file content."], { type: "text/plain" });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `${videos[i].title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (e) {
          toast({
            variant: "destructive",
            title: "Download Blocked",
            description: "Your browser blocked the automatic download. Please allow downloads for this site.",
          });
        }
      }
    }
    
    setCurrentDownloadIndex(-1); // Done
    toast({
      title: "All Done!",
      description: "Playlist download completed successfully.",
    });
  };

  const simulateVideoDownload = (index: number): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setVideos(prev => prev.map((v, idx) => idx === index ? { ...v, progress } : v));
      }, 200);
    });
  };

  return {
    url,
    setUrl,
    playlistId,
    videos,
    isProcessing,
    currentDownloadIndex,
    fetchPlaylist,
    startDownload
  };
}
