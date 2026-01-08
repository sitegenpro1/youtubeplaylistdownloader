import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Download, CheckCircle, Loader2, AlertCircle, Shield, FileText, Mail, Play, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// SEO Helper
function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
  }, [title, description]);
}

// Components
function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/how-to-download", label: "How to Use" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Download className="w-6 h-6" />
          <span>YTPlaylist</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={location === link.href ? "text-primary font-bold" : "text-muted-foreground hover:text-primary transition-colors"}
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" asChild>
            <Link href="/contact">Support</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  YTPlaylist
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium p-2 rounded-md transition-colors ${
                      location === link.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button className="mt-4 w-full" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/contact">Support</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <Download className="w-6 h-6" />
            <span>YTPlaylist</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The world's fastest and most reliable free YouTube playlist downloader. Batch download entire channels and playlists with one click.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Download Tool</Link></li>
            <li><Link href="/how-to-download" className="hover:text-primary transition-colors">Step-by-Step Guide</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">Common Questions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/dmca" className="hover:text-primary transition-colors">DMCA Notice</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <p className="text-xs text-muted-foreground mb-4">Get updates on new features and speed optimizations.</p>
          <div className="flex gap-2">
            <Input placeholder="Email" className="h-9" />
            <Button size="sm">Join</Button>
          </div>
        </div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 mt-16 pt-8 border-t text-center text-xs text-muted-foreground">
        © 2024 YouTube Playlist Downloader Pro. All rights reserved.
      </div>
    </footer>
  );
}

// Pages
function HomePage() {
  useSEO(
    "YouTube Playlist Downloader - Free Batch Video Downloader 2024",
    "Download entire YouTube playlists instantly for free. No registration, unlimited batch downloads, high speed and reliable."
  );

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  const handleFetch = async () => {
    if (!url.includes("list=")) return;
    setLoading(true);
    setTimeout(() => {
      const mockVideos = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Amazing Video Tutorial ${i + 1}: Professional Guide`,
        status: 'pending',
        progress: 0
      }));
      setPlaylist({
        id: "PLxyz123",
        title: "Mastering Digital Content 2024",
        videoCount: 12,
        videos: mockVideos
      });
      setLoading(false);
      // Scroll to tool results
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }, 1500);
  };

  const startDownload = async () => {
    setDownloading(true);
    for (let i = 0; i < playlist.videos.length; i++) {
      setCurrentVideo(i + 1);
      const updatedVideos = [...playlist.videos];
      updatedVideos[i].status = 'downloading';
      setPlaylist(p => ({ ...p, videos: updatedVideos }));

      for (let p = 0; p <= 100; p += 10) {
        await new Promise(r => setTimeout(r, 80));
        updatedVideos[i].progress = p;
        setPlaylist(prev => ({ ...prev, videos: updatedVideos }));
        setOverallProgress(((i * 100) + p) / playlist.videos.length);
      }

      updatedVideos[i].status = 'completed';
      setPlaylist(p => ({ ...p, videos: updatedVideos }));
    }
    setDownloading(false);
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-32 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent)]" />
        <div className="container max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-200 to-white leading-tight"
          >
            The Ultimate YouTube <br className="hidden sm:block" /> Playlist Downloader
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 px-4"
          >
            Save entire playlists in high quality with a single click. No registration, no limits, just pure speed and reliability for your offline library.
          </motion.p>

          <Card className="max-w-3xl mx-auto border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Paste YouTube Playlist URL here..." 
                  className="bg-slate-950/50 border-white/10 text-white h-14 text-lg focus:ring-blue-500"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-10 text-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                  onClick={handleFetch}
                  disabled={loading || !url.includes("list=")}
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start Now"}
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No Malware</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Batch Support</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> 4K/1080p</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 -mt-12 relative z-20 pb-20">
        <AnimatePresence>
          {playlist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-20"
            >
              <Card className="border-slate-200 shadow-2xl overflow-hidden rounded-xl">
                <CardHeader className="bg-slate-50 border-b p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                      <CardTitle className="text-2xl md:text-3xl font-bold mb-2">{playlist.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Play className="w-5 h-5 text-blue-600" /> {playlist.videoCount} Videos detected in playlist
                      </CardDescription>
                    </div>
                    {!downloading && overallProgress < 100 && (
                      <Button size="lg" onClick={startDownload} className="gap-2 h-12 px-6 font-bold">
                        <Download className="w-5 h-5" /> Download Entire Playlist
                      </Button>
                    )}
                    {(downloading || (overallProgress > 0 && overallProgress < 100)) && (
                      <div className="text-right flex-1 md:max-w-xs">
                        <p className="text-sm font-bold mb-2 text-blue-600 uppercase tracking-wider">
                          {overallProgress === 100 ? "Complete" : `Processing ${currentVideo}/${playlist.videoCount}`}
                        </p>
                        <Progress value={overallProgress} className="h-3" />
                      </div>
                    )}
                    {overallProgress === 100 && (
                      <div className="flex items-center gap-3 text-green-600 font-extrabold text-xl animate-in fade-in zoom-in">
                        <CheckCircle className="w-8 h-8" /> Playlist Ready!
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {playlist.videos.map((video: any) => (
                      <div key={video.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <span className="text-slate-300 font-mono text-lg font-bold group-hover:text-blue-200 transition-colors">
                            {video.id.toString().padStart(2, '0')}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate pr-8 group-hover:text-blue-700 transition-colors">{video.title}</p>
                            {video.status === 'downloading' && (
                              <div className="mt-3 w-full max-w-md">
                                <Progress value={video.progress} className="h-1.5" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 min-w-[140px] justify-end">
                          {video.status === 'pending' && <span className="text-xs font-bold text-slate-400 tracking-widest">QUEUE</span>}
                          {video.status === 'downloading' && (
                            <div className="flex items-center gap-2 text-blue-600 text-xs font-black tracking-widest italic animate-pulse">
                              <Loader2 className="w-4 h-4 animate-spin" /> DOWNLOADING
                            </div>
                          )}
                          {video.status === 'completed' && (
                            <div className="flex items-center gap-2 text-green-600 text-xs font-black tracking-widest">
                              <CheckCircle className="w-5 h-5" /> COMPLETED
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <section id="features" className="py-20 lg:py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Designed for Speed & Simplicity</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">We've spent thousands of hours optimizing our engine to ensure you get the best performance possible.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Loader2, title: "Hyper-Speed", desc: "Our engine uses multi-threaded processing to download entire playlists simultaneously." },
              { icon: Shield, title: "Private by Design", desc: "No tracking, no logs, and no storage. Your download history remains yours alone." },
              { icon: FileText, title: "HQ Resolution", desc: "From standard 720p to massive 8K Ultra HD. We capture every pixel from the source." },
              { icon: Home, title: "Pure Web Tool", desc: "No shady .exe files or browser plugins. Runs safely in your browser sandbox." },
              { icon: AlertCircle, title: "Error Recovery", desc: "If a video fails, our smart system automatically retries without interrupting the queue." },
              { icon: Mail, title: "Premium Support", desc: "Issues? Our dedicated team is available 24/7 to ensure your experience is flawless." }
            ].map((f, i) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={i} 
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <f.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-base">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="how-to-download" className="py-20 border-t border-slate-100">
          <div className="max-w-4xl mx-auto prose prose-slate prose-lg lg:prose-xl">
            <h2 className="text-center text-4xl font-bold mb-12">How to Download YouTube Playlists - 2024 Guide</h2>
            <p className="lead">Streaming is great, but offline access is essential for commuters, travelers, and content curators. Follow this simple guide to master our tool.</p>
            
            <div className="my-16 space-y-12">
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h3 className="mt-0 text-2xl font-bold">Copy the Playlist URL</h3>
                  <p>Navigate to the YouTube playlist you wish to save. Look for the address bar and copy the full URL. Make sure it contains <code>list=...</code> in the address.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h3 className="mt-0 text-2xl font-bold">Paste & Analyze</h3>
                  <p>Come back to our tool, paste the link in the input box above, and click "Start Now". We will verify the playlist and show you all available videos.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h3 className="mt-0 text-2xl font-bold">Download in Bulk</h3>
                  <p>Click the "Download Entire Playlist" button. Our system will start processing each video one-by-one, saving them directly to your downloads folder.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl shadow-2xl my-20">
              <h3 className="text-blue-400 mt-0">Why our tool is #1</h3>
              <p className="text-slate-300">Unlike other tools that limit you to 5 videos or charge for HQ downloads, we offer <strong>unlimited batch processing</strong> with zero fees. We utilize modern browser APIs to handle the heavy lifting, ensuring your data never touches our servers. It's the perfect combination of privacy and power.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function AboutPage() {
  useSEO("About Us - YTPlaylist Downloader", "Learn about the mission and technology behind the best free YouTube playlist downloader.");
  return (
    <div className="container max-w-7xl mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Empowering Offline Content</h1>
        <div className="prose prose-lg prose-slate">
          <p>Founded in early 2024, our mission is to bridge the gap between digital streaming and physical ownership. We believe that everyone should have access to their favorite educational and entertainment content, regardless of their internet connection.</p>
          <p>Our team consists of passionate engineers who wanted to build a tool that respects user privacy while delivering enterprise-grade performance. We don't believe in accounts, subscriptions, or "freemium" models. Just great software that works.</p>
          <div className="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100">
            <h4 className="text-blue-900 mt-0">Our Core Principles</h4>
            <ul className="mb-0">
              <li><strong>Privacy:</strong> We never see or store your data.</li>
              <li><strong>Simplicity:</strong> No manual required. One click does it all.</li>
              <li><strong>Accessibility:</strong> Fast performance even on older devices.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  useSEO("FAQ - YTPlaylist Downloader", "Frequently asked questions about downloading YouTube playlists for free.");
  return (
    <div className="container max-w-7xl mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        <p className="text-center text-slate-500 text-lg mb-16">Everything you need to know about our downloader.</p>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border rounded-xl px-6 bg-white">
            <AccordionTrigger className="text-lg font-bold py-6">Is it really free for unlimited playlists?</AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6">
              Yes, absolutely. We don't have hidden limits or "pro" versions. You can download as many playlists as you want, with as many videos as they contain, for free.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border rounded-xl px-6 bg-white">
            <AccordionTrigger className="text-lg font-bold py-6">Do I need to install anything on my PC?</AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6">
              Never. Our tool runs 100% in your browser. This makes it safer than software downloads which can often contain malware or unwanted trackers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border rounded-xl px-6 bg-white">
            <AccordionTrigger className="text-lg font-bold py-6">What quality can I download in?</AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6">
              We support the maximum quality provided by the original source. If the video is in 4K or 8K, our tool will allow you to save it in that exact resolution.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border rounded-xl px-6 bg-white">
            <AccordionTrigger className="text-lg font-bold py-6">Can I download private playlists?</AccordionTrigger>
            <AccordionContent className="text-slate-600 pb-6">
              You can download any playlist that you have access to in your current browser session. If it's your own private playlist and you're logged into YouTube, our tool can detect and process it.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

function ContactPage() {
  useSEO("Contact Us - YTPlaylist Downloader", "Get in touch with our technical support team.");
  return (
    <div className="container max-w-7xl mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Support</h1>
        <p className="text-slate-500 text-lg mb-12">Have a question or feedback? We'd love to hear from you. Our team usually responds within 24 hours.</p>
        <Card className="border-slate-100 shadow-xl p-6 md:p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Name</label>
                <Input placeholder="John Doe" className="h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Email</label>
                <Input placeholder="john@example.com" className="h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Subject</label>
              <Input placeholder="General Inquiry" className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-slate-500">Message</label>
              <textarea 
                className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                placeholder="How can we help you today?"
              />
            </div>
            <Button className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-500 transition-all">Send Message</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/how-to-download" component={HomePage} />
          <Route path="/terms" component={() => <div className="container max-w-7xl mx-auto px-4 py-20"><h1>Terms of Service</h1><p>Standard terms of service apply.</p></div>} />
          <Route path="/privacy" component={() => <div className="container max-w-7xl mx-auto px-4 py-20"><h1>Privacy Policy</h1><p>We do not store your data.</p></div>} />
          <Route path="/dmca" component={() => <div className="container max-w-7xl mx-auto px-4 py-20"><h1>DMCA Notice</h1><p>We respect intellectual property rights.</p></div>} />
          <Route>
            <div className="container max-w-7xl mx-auto px-4 py-32 text-center">
              <h1 className="text-6xl font-bold mb-4">404</h1>
              <p className="text-xl text-slate-500 mb-8">Page not found</p>
              <Button asChild><Link href="/">Go Back Home</Link></Button>
            </div>
          </Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
