document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinksMobile = document.getElementById('navLinksMobile');

    if (menuToggle && navLinksMobile) {
        menuToggle.addEventListener('click', () => {
            navLinksMobile.classList.toggle('hidden');
            navLinksMobile.classList.toggle('flex');
            const icon = menuToggle.querySelector('svg') || menuToggle.querySelector('i');
            if (icon) {
                if (navLinksMobile.classList.contains('flex')) {
                    icon.setAttribute('data-lucide', 'x');
                } else {
                    icon.setAttribute('data-lucide', 'menu');
                }
                lucide.createIcons();
            }
        });
    }

    // FAQ Accordion
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const icon = toggle.querySelector('i');
            const isHidden = content.classList.contains('hidden');
            
            // Hide all first
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-toggle i').forEach(i => i.setAttribute('data-lucide', 'chevron-down'));
            
            if (isHidden) {
                content.classList.remove('hidden');
                if (icon) icon.setAttribute('data-lucide', 'chevron-up');
            }
            lucide.createIcons();
        });
    });

    // Tool Logic
    const urlInput = document.getElementById('playlistUrl');
    const extractBtn = document.getElementById('extractBtn');
    const resultsSection = document.getElementById('resultsSection');
    const playlistTitle = document.getElementById('playlistTitle');
    const videoCount = document.getElementById('videoCount');
    const videoList = document.getElementById('videoList');
    const downloadAllBtn = document.getElementById('downloadAllBtn');
    const progressDisplay = document.getElementById('progressDisplay');
    const overallProgressBar = document.getElementById('overallProgressBar');
    const progressText = document.getElementById('progressText');
    const completionDisplay = document.getElementById('completionDisplay');

    let currentPlaylist = null;

    if (extractBtn) {
        extractBtn.addEventListener('click', () => {
            const url = urlInput.value;
            if (!url.includes('list=')) {
                alert('Please enter a valid YouTube Playlist URL');
                return;
            }

            extractBtn.innerHTML = '<i data-lucide="loader" class="animate-spin mr-2"></i> Analyzing...';
            lucide.createIcons();
            extractBtn.disabled = true;

            setTimeout(() => {
                currentPlaylist = {
                    title: 'Professional Masterclass 2024',
                    count: 12,
                    videos: Array.from({ length: 12 }, (_, i) => ({
                        id: i + 1,
                        title: `Module ${i + 1}: Industry Leading Techniques`,
                        status: 'pending'
                    }))
                };

                renderPlaylist(currentPlaylist);
                resultsSection.classList.remove('hidden');
                extractBtn.innerHTML = 'Start Now';
                extractBtn.disabled = false;
                
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 2000);
        });
    }

    function renderPlaylist(playlist) {
        playlistTitle.textContent = playlist.title;
        videoCount.textContent = playlist.count;
        videoList.innerHTML = '';

        playlist.videos.forEach(video => {
            const item = document.createElement('div');
            item.className = 'p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors';
            item.innerHTML = `
                <div class="flex items-center gap-6 flex-1 min-w-0">
                    <span class="text-slate-300 font-black text-2xl group-hover:text-blue-200">${String(video.id).padStart(2, '0')}</span>
                    <div class="flex-1 min-w-0">
                        <p class="font-bold text-slate-800 truncate pr-8 group-hover:text-blue-600 transition-colors">${video.title}</p>
                        <div id="pb-container-${video.id}" class="hidden mt-3 w-full max-w-md">
                            <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div id="pb-${video.id}" class="bg-blue-600 h-full w-0 transition-all duration-100"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-4 min-w-[140px] justify-end" id="status-${video.id}">
                    <span class="text-[10px] font-black text-slate-400 tracking-widest uppercase">Queued</span>
                </div>
            `;
            videoList.appendChild(item);
        });
        lucide.createIcons();
    }

    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async () => {
            downloadAllBtn.classList.add('hidden');
            progressDisplay.classList.remove('hidden');
            
            for (let i = 0; i < currentPlaylist.videos.length; i++) {
                const video = currentPlaylist.videos[i];
                const statusEl = document.getElementById(`status-${video.id}`);
                const pbContainer = document.getElementById(`pb-container-${video.id}`);
                const pb = document.getElementById(`pb-${video.id}`);
                
                progressText.textContent = `Processing ${i + 1}/${currentPlaylist.count}`;
                statusEl.innerHTML = '<span class="text-[10px] font-black text-blue-600 tracking-widest uppercase animate-pulse">Downloading</span>';
                pbContainer.classList.remove('hidden');
                
                for (let p = 0; p <= 100; p += 10) {
                    await new Promise(r => setTimeout(r, 100));
                    pb.style.width = `${p}%`;
                    const overall = ((i * 100) + p) / currentPlaylist.count;
                    overallProgressBar.style.width = `${overall}%`;
                }

                statusEl.innerHTML = '<i data-lucide="check-circle" class="text-green-600 w-6 h-6"></i>';
                lucide.createIcons();
            }

            progressDisplay.classList.add('hidden');
            completionDisplay.classList.remove('hidden');
            completionDisplay.classList.add('flex');
            lucide.createIcons();
        });
    }
});
