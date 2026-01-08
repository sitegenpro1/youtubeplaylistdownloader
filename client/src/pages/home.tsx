import { useState } from "react";
import { usePlaylistSimulator } from "@/hooks/use-playlist-simulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VideoListItem } from "@/components/video-list-item";
import { FeatureCard } from "@/components/feature-card";
import { FAQAccordion } from "@/components/faq-accordion";
import { 
  Download, 
  Youtube, 
  Zap, 
  ShieldCheck, 
  Smartphone,
  ArrowRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const {
    url,
    setUrl,
    playlistId,
    videos,
    isProcessing,
    currentDownloadIndex,
    fetchPlaylist,
    startDownload
  } = usePlaylistSimulator();

  const isDownloading = currentDownloadIndex !== -1;
  const isComplete = videos.length > 0 && videos.every(v => v.status === 'completed');

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 Now Available
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
              YouTube Playlist <br className="hidden md:block" />
              <span className="text-gradient">Downloader</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The fastest way to save entire playlists. Paste your link below and let our engine handle the rest. Simple, free, and unlimited.
            </p>
          </motion.div>

          {/* Input Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto bg-card p-2 rounded-2xl shadow-2xl border border-border/50 flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-grow">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Youtube className="w-5 h-5" />
              </div>
              <Input 
                className="h-14 pl-12 pr-4 text-lg border-0 bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50"
                placeholder="Paste YouTube Playlist URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isProcessing || isDownloading}
              />
            </div>
            <Button 
              size="lg" 
              className="h-14 px-8 text-lg font-semibold rounded-xl shrink-0 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={fetchPlaylist}
              disabled={isProcessing || isDownloading || !url}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  Get Playlist <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>

          <p className="mt-4 text-sm text-muted-foreground/60">
            Supports public and unlisted playlists. No registration required.
          </p>
        </div>
      </section>

      {/* --- PLAYLIST CONTENT SECTION --- */}
      <AnimatePresence>
        {playlistId && (
          <section className="py-12 bg-muted/30 border-y border-border/50">
            <div className="container max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Header Info */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-1">Ready to Download</h2>
                    <p className="text-muted-foreground">Found {videos.length} videos in this playlist</p>
                  </div>
                  
                  {!isComplete ? (
                    <Button 
                      size="lg"
                      onClick={startDownload}
                      disabled={isDownloading}
                      className={`
                        min-w-[200px] h-12 text-lg font-semibold rounded-xl shadow-md transition-all
                        ${isDownloading ? 'opacity-80' : 'hover:scale-105 hover:shadow-lg'}
                      `}
                    >
                      {isDownloading ? (
                        <span className="flex items-center">
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing {currentDownloadIndex + 1}/{videos.length}
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Download className="w-5 h-5 mr-2" />
                          Download All ({videos.length})
                        </span>
                      )}
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-6 py-3 rounded-xl border border-green-200">
                      <CheckCircle2 className="w-6 h-6" />
                      All Downloads Complete!
                    </div>
                  )}
                </div>

                {/* Progress Bar (Overall) */}
                {isDownloading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-muted-foreground">
                      <span>Overall Progress</span>
                      <span>{Math.round(((currentDownloadIndex) / videos.length) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentDownloadIndex) / videos.length) * 100}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                      />
                    </div>
                  </div>
                )}

                {/* Video List */}
                <div className="space-y-3">
                  {videos.map((video, idx) => (
                    <VideoListItem key={video.id} video={video} index={idx} />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </AnimatePresence>

      {/* --- FEATURES GRID --- */}
      <section className="py-24 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why choose our downloader?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've optimized every step of the process to provide the smoothest experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap}
              title="Lightning Fast"
              description="Our optimized engine processes playlist data in milliseconds, getting you to your content faster than ever before."
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Secure & Private"
              description="We respect your privacy. No data is stored on our servers, and all processing happens directly in your browser."
            />
            <FeatureCard 
              icon={Smartphone}
              title="Mobile Optimized"
              description="Full functionality on the go. Our responsive design ensures a perfect experience on iOS and Android devices."
            />
          </div>
        </div>
      </section>

      {/* --- HOW TO USE --- */}
      <section className="py-24 bg-secondary/30 border-y border-border/50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to offline freedom</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Copy Link", text: "Go to YouTube and copy the URL of the playlist you want to download." },
              { step: "02", title: "Paste URL", text: "Paste the link into the input box above and click 'Get Playlist'." },
              { step: "03", title: "Download", text: "Review the video list and click 'Download All' to save them to your device." }
            ].map((item, i) => (
              <div key={i} className="relative p-8 bg-card rounded-2xl border border-border shadow-sm">
                <div className="text-6xl font-bold text-border/40 absolute top-4 right-4 pointer-events-none">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-muted-foreground relative z-10">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-24 bg-background">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <FAQAccordion />
        </div>
      </section>

      {/* --- DMCA / FOOTER --- */}
      <footer className="bg-foreground text-background py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">PlaylistDownloader</h3>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                The best tool for saving your favorite educational and entertainment playlists for offline viewing. Simple, fast, and free.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal & DMCA</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                This tool is intended for personal use only. Users must respect the intellectual property rights of content creators. 
                We do not host any files on our servers. All downloads are simulated for demonstration purposes in this specific deployment.
                By using this tool, you agree to our Terms of Service.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2024 PlaylistDownloader. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
