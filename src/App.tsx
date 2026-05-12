import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  Music, 
  Volume2, 
  VolumeX, 
  Send, 
  Copy, 
  Check, 
  Gift, 
  Users, 
  ChevronRight, 
  Sparkles,
  Share2,
  BookOpen,
  Camera,
  Info,
  CalendarDays
} from 'lucide-react';

// Interfaces
interface Greeting {
  id: string;
  name: string;
  status: 'hadir' | 'tidak_hadir' | 'ragu';
  message: string;
  timestamp: string;
}

export default function App() {
  // Opening / Invitation Cover State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Custom Guest Name from URL parameter
  const [guestName, setGuestName] = useState<string>('');
  
  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Copy to clipboard notification
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  
  // RSVP Guestbook state
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [formName, setFormName] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
  const [formMessage, setFormMessage] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  // Custom Invitation Link Generator
  const [customRecipient, setCustomRecipient] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Active Photo Gallery Category
  const [activeTab, setActiveTab] = useState<'all' | 'prewedding' | 'ceremony'>('all');
  
  // Selected Image for Lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Sound Track URL - Ed Sheeran Perfect
  const audioUrl = "https://archive.org/download/jovanpogi/Ed%20Sheeran%20Perfect.mp3";

  // Target Wedding Date (September 18, 2026)
  const targetDate = new Date("September 18, 2026 08:00:00").getTime();

  // Get parameters from URL (e.g. ?to=Bapak+Budi)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(decodeURIComponent(to));
    } else {
      setGuestName('Tamu Undangan Yang Terhormat');
    }

    // Load initial messages from local storage or set default ones
    const savedGreetings = localStorage.getItem('wedding_greetings');
    if (savedGreetings) {
      setGreetings(JSON.parse(savedGreetings));
    } else {
      const defaultGreetings: Greeting[] = [
        {
          id: '1',
          name: 'Sarah Amalia & Keluarga',
          status: 'hadir',
          message: 'Selamat Rian & Syifa! Semoga lancar sampai hari-H dan dilancarkan jalannya menuju ibadah terindah ini. Menjadi keluarga sakinah mawaddah warahmah.',
          timestamp: '1 hari yang lalu'
        },
        {
          id: '2',
          name: 'Budi Hartono',
          status: 'hadir',
          message: 'Sangat senang mendengar kabar bahagia ini. Pasti hadir bro Rian! Selamat menempuh hidup baru ya!',
          timestamp: '2 jam yang lalu'
        },
        {
          id: '3',
          name: 'Dinda Lestari',
          status: 'ragu',
          message: 'Selamat menempuh babak baru Rian dan Syifa. Mohon maaf jika nanti berhalangan hadir karena luar kota, tapi doa terbaik dari aku selalu menyertai kalian!',
          timestamp: 'Baru saja'
        }
      ];
      setGreetings(defaultGreetings);
      localStorage.setItem('wedding_greetings', JSON.stringify(defaultGreetings));
    }
  }, []);

  // Countdown clock effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Audio Playback control
  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsPlaying(true);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio play failed, user interaction needed first:", error);
      });
    }

    // Trigger floating pink hearts/confetti effect
    createHeartsConfetti();
  };

  const togglePlayMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => console.log(err));
      setIsPlaying(true);
    }
  };

  // Helper to trigger confetti petals
  const [petals, setPetals] = useState<Array<{id: number, left: number, delay: number, duration: number, size: number, type: number}>>([]);
  
  useEffect(() => {
    // Generate floating petals
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 5, // seconds
      duration: 6 + Math.random() * 10, // seconds
      size: 10 + Math.random() * 15, // pixels
      type: Math.floor(Math.random() * 3) // style
    }));
    setPetals(newPetals);
  }, []);

  const createHeartsConfetti = () => {
    // Temporary confetti burst
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    for (let i = 0; i < 60; i++) {
      const petal = document.createElement('div');
      petal.innerHTML = i % 2 === 0 ? '🌸' : '💖';
      petal.style.position = 'absolute';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.top = `-20px`;
      petal.style.fontSize = `${15 + Math.random() * 20}px`;
      petal.style.opacity = `${0.6 + Math.random() * 0.4}`;
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      petal.style.transition = `all ${3 + Math.random() * 4}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      container.appendChild(petal);

      setTimeout(() => {
        petal.style.top = '110vh';
        petal.style.left = `${parseFloat(petal.style.left) + (Math.random() * 200 - 100)}px`;
        petal.style.transform = `rotate(${Math.random() * 720}deg)`;
      }, 50);
    }

    setTimeout(() => {
      container.remove();
    }, 7000);
  };

  // Submit Guestbook Greeting
  const handleAddGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) {
      showNotification('Harap isi nama dan pesan Anda.');
      return;
    }

    const newGreeting: Greeting = {
      id: Date.now().toString(),
      name: formName.trim(),
      status: formStatus,
      message: formMessage.trim(),
      timestamp: 'Baru saja'
    };

    const updated = [newGreeting, ...greetings];
    setGreetings(updated);
    localStorage.setItem('wedding_greetings', JSON.stringify(updated));

    // Reset Form
    setFormName('');
    setFormMessage('');
    showNotification('Terima kasih! Ucapan Anda telah berhasil dikirim.');
    
    // Trigger happy confetti celebration
    createHeartsConfetti();
  };

  // Helper for showing small toast alerts
  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Copy Bank Account Number
  const copyToClipboard = (accountNo: string, name: string) => {
    navigator.clipboard.writeText(accountNo);
    setCopiedAccount(name);
    showNotification(`Nomor rekening ${name} berhasil disalin ke clipboard!`);
    setTimeout(() => {
      setCopiedAccount(null);
    }, 3000);
  };

  // Generate Custom Sharing Link
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRecipient.trim()) return;
    const formatted = encodeURIComponent(customRecipient.trim());
    const origin = window.location.origin + window.location.pathname;
    const finalLink = `${origin}?to=${formatted}`;
    setGeneratedLink(finalLink);
  };

  // Copy invitation link to WhatsApp
  const shareToWhatsApp = () => {
    if (!generatedLink) return;
    const waText = `Halo *${customRecipient}*, kami mengundang Anda untuk menghadiri acara pernikahan kami. Buka undangan digital resmi kami pada link berikut: \n\n${generatedLink}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen text-stone-800 font-sans-clean select-none relative overflow-x-hidden bg-rose-pattern">
      
      {/* Hidden Audio Element for Ed Sheeran Perfect */}
      <audio 
        ref={audioRef}
        src={audioUrl}
        loop
        preload="auto"
      />

      {/* Falling Petals Background Animation */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {petals.map((petal) => (
            <div
              key={petal.id}
              className="absolute text-pink-300 opacity-60"
              style={{
                left: `${petal.left}%`,
                top: `-40px`,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                fontSize: `${petal.size}px`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
                animationName: 'float-slow',
                transform: `rotate(${petal.id * 15}deg)`
              }}
            >
              {petal.type === 0 ? '🌸' : petal.type === 1 ? '💖' : '🍂'}
            </div>
          ))}
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-white border-pink-300 px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-pink-500 animate-spin" />
          <span className="text-sm font-semibold text-pink-700">{notification}</span>
        </div>
      )}

      {/* FLOATING MUSIC CONTROLLER */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {isPlaying && (
            <div className="hidden md:flex glass-pink px-4 py-2 rounded-full border border-pink-200/50 shadow-lg items-center gap-2 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <p className="text-xs font-semibold text-pink-700 font-serif-elegant whitespace-nowrap">
                ♫ Ed Sheeran - Perfect
              </p>
            </div>
          )}
          <button 
            onClick={togglePlayMusic}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-2xl flex items-center justify-center border-4 border-white hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer relative group"
            title="Nyalakan/Matikan Musik"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-6 h-6 animate-pulse" />
                <span className="absolute -inset-1 rounded-full border-2 border-pink-300 animate-ping opacity-30"></span>
              </>
            ) : (
              <VolumeX className="w-6 h-6 text-pink-100" />
            )}
          </button>
        </div>
      )}

      {/* =========================================================
          1. OPENING / COVER / SPLASH SCREEN
          ========================================================= */}
      {!isOpen ? (
        <div className="fixed inset-0 z-50 bg-gradient-to-b from-rose-50 via-white to-pink-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          
          {/* Aesthetic background graphics */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl -translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl translate-x-12 translate-y-12"></div>
          
          {/* Main Content card */}
          <div className="max-w-xl w-full glass-pink rounded-3xl p-8 md:p-12 shadow-2xl border border-white/80 relative z-10 flex flex-col items-center space-y-6">
            
            {/* Elegant Floral Header */}
            <div className="w-24 h-24 rounded-full bg-pink-100/60 flex items-center justify-center mb-2 animate-heart-beat">
              <Heart className="w-12 h-12 text-pink-500 fill-pink-300/40" />
            </div>

            <p className="tracking-[0.2em] text-pink-600 text-sm font-semibold uppercase">
              THE WEDDING INVITATION
            </p>

            <h1 className="text-5xl md:text-6xl text-pink-700 font-cursive py-2">
              Rian & Syifa
            </h1>

            <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>

            <div className="space-y-1">
              <p className="text-stone-500 text-xs uppercase tracking-widest">Kepad Yth. Bapak/Ibu/Saudara/i:</p>
              <div className="bg-white/95 px-6 py-3 rounded-2xl shadow-sm border border-pink-100 inline-block">
                <span className="font-serif-elegant font-bold text-lg text-pink-800">
                  {guestName}
                </span>
              </div>
            </div>

            <p className="text-stone-500 text-xs italic max-w-sm">
              *Tanpa mengurangi rasa hormat, kami mengundang Anda untuk bersama-sama merayakan hari bahagia kami.
            </p>

            {/* CTA Button to Open */}
            <button
              onClick={handleOpenInvitation}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-pink-300/50 transform hover:-translate-y-1 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <BookOpen className="w-5 h-5 animate-bounce" />
              <span>Buka Undangan</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Small note on Perfect Song */}
            <div className="flex items-center gap-2 text-pink-500/80 text-xs font-semibold">
              <Music className="w-4 h-4 animate-spin text-pink-400" />
              <span>Backsound: Perfect - Ed Sheeran</span>
            </div>

          </div>

          {/* Aesthetic watercolor-like floral borders */}
          <div className="absolute top-4 left-4 text-3xl opacity-30 select-none pointer-events-none">🌸🌿</div>
          <div className="absolute top-4 right-4 text-3xl opacity-30 select-none pointer-events-none">🌿🌸</div>
          <div className="absolute bottom-4 left-4 text-3xl opacity-30 select-none pointer-events-none">🌸🌿</div>
          <div className="absolute bottom-4 right-4 text-3xl opacity-30 select-none pointer-events-none">🌿🌸</div>
        </div>
      ) : (
        <div className="animate-fade-in-up">
          {/* =========================================================
              2. HERO HEADER SECTION
              ========================================================= */}
          <section className="relative min-h-screen flex flex-col justify-between bg-gradient-to-b from-rose-50 via-white to-pink-50 py-16 px-4 text-center">
            
            {/* Soft pink blur circles */}
            <div className="absolute top-20 left-10 w-48 h-48 bg-pink-100 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-rose-100 rounded-full blur-3xl opacity-60"></div>

            <div className="m-auto max-w-4xl space-y-8 relative z-10">
              
              <p className="tracking-[0.3em] text-pink-600 text-sm font-bold uppercase animate-pulse">
                WALIMATUL 'URSY
              </p>

              {/* Central Romantic Photo Frame */}
              <div className="relative inline-block mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-rose-300 rounded-full blur-xl opacity-40 scale-105 animate-pulse"></div>
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl transform hover:rotate-2 transition-transform duration-500">
                  <img 
                    src="/images/couple.jpg" 
                    alt="Rian and Syifa Prewedding" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback in case image didn't generate correctly
                      e.currentTarget.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>
                {/* Floating Heart over photo */}
                <span className="absolute -bottom-2 right-8 bg-pink-500 text-white p-3 rounded-full shadow-lg animate-bounce">
                  <Heart className="w-6 h-6 fill-white" />
                </span>
              </div>

              {/* Names */}
              <div className="space-y-2">
                <h2 className="text-6xl md:text-7xl text-pink-600 font-cursive">
                  Rian & Syifa
                </h2>
                <p className="text-stone-500 tracking-wider text-sm font-semibold max-w-lg mx-auto">
                  Kami mengundang Anda untuk bergabung merayakan penyatuan kudus cinta kami.
                </p>
              </div>

              {/* Interactive Countdown */}
              <div className="glass-pink border-pink-200/60 p-6 md:p-8 rounded-3xl shadow-xl max-w-xl mx-auto space-y-4">
                <p className="font-serif-elegant font-bold text-pink-800 text-lg flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  Menuju Hari Kebahagiaan
                </p>
                
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white/90 p-3 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="block text-2xl md:text-4xl font-serif-elegant font-bold text-pink-600">
                      {timeLeft.days}
                    </span>
                    <span className="text-xs text-stone-500 uppercase font-semibold">Hari</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="block text-2xl md:text-4xl font-serif-elegant font-bold text-pink-600">
                      {timeLeft.hours}
                    </span>
                    <span className="text-xs text-stone-500 uppercase font-semibold">Jam</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="block text-2xl md:text-4xl font-serif-elegant font-bold text-pink-600">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-xs text-stone-500 uppercase font-semibold">Menit</span>
                  </div>
                  <div className="bg-white/90 p-3 rounded-2xl border border-pink-100 shadow-sm">
                    <span className="block text-2xl md:text-4xl font-serif-elegant font-bold text-pink-600">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-xs text-stone-500 uppercase font-semibold">Detik</span>
                  </div>
                </div>

                <div className="bg-pink-100/50 py-2 px-4 rounded-xl text-xs text-pink-800 font-semibold inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Jumat, 18 September 2026</span>
                </div>
              </div>

            </div>

            {/* Scroll Indicator */}
            <div className="mt-8 animate-bounce flex flex-col items-center text-pink-500 gap-1 text-xs font-bold">
              <span>Scroll Ke Bawah</span>
              <div className="w-1 h-6 bg-pink-400 rounded-full"></div>
            </div>
          </section>


          {/* =========================================================
              3. BRIDE & GROOM PROFILE SECTION (MEMPELAI)
              ========================================================= */}
          <section className="py-20 px-4 bg-white relative">
            <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-pink-50 to-transparent"></div>
            
            <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              
              {/* Floral element */}
              <div className="text-pink-400 text-3xl">🌸 ❦ 🌸</div>
              
              <div className="space-y-3">
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Kedua Mempelai
                </h2>
                <p className="text-stone-500 text-sm max-w-lg mx-auto">
                  "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya."
                  <br /><span className="font-semibold text-pink-600 text-xs block mt-2">(QS. Ar-Rum: 21)</span>
                </p>
              </div>

              {/* Grid Groom & Bride */}
              <div className="grid md:grid-cols-2 gap-12 pt-8">
                
                {/* Groom Card */}
                <div className="glass-pink p-8 rounded-3xl border border-pink-100 shadow-lg hover:shadow-pink-200/50 transition-all duration-300 group flex flex-col items-center">
                  
                  {/* Groom Photo Frame */}
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-md mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" 
                      alt="Rian Adrianto" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-serif-elegant font-bold text-pink-800">
                    Rian Adrianto, S.Kom.
                  </h3>
                  <p className="text-pink-600 font-semibold text-sm mb-4">Mempelai Pria</p>

                  <div className="h-[1px] w-1/2 bg-pink-200 my-3"></div>

                  <p className="text-stone-600 text-sm leading-relaxed max-w-xs text-center">
                    Putra sulung dari pasangan terkasih:<br />
                    <span className="font-bold text-stone-700">Bapak Bambang Adrianto</span><br />
                    &<br />
                    <span className="font-bold text-stone-700">Ibu Endang Setyowati</span>
                  </p>

                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-6 flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full text-xs font-bold transition-colors"
                  >
                    <svg className="w-4 h-4 fill-pink-700" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    <span>@rian_adrianto</span>
                  </a>
                </div>

                {/* Bride Card */}
                <div className="glass-pink p-8 rounded-3xl border border-pink-100 shadow-lg hover:shadow-pink-200/50 transition-all duration-300 group flex flex-col items-center">
                  
                  {/* Bride Photo Frame */}
                  <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-md mb-6 transform group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300" 
                      alt="Syifa Salsabila" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-2xl font-serif-elegant font-bold text-pink-800">
                    Syifa Salsabila, S.E.
                  </h3>
                  <p className="text-pink-600 font-semibold text-sm mb-4">Mempelai Wanita</p>

                  <div className="h-[1px] w-1/2 bg-pink-200 my-3"></div>

                  <p className="text-stone-600 text-sm leading-relaxed max-w-xs text-center">
                    Putri bungsu dari pasangan terkasih:<br />
                    <span className="font-bold text-stone-700">Bapak Ahmad Salsabil</span><br />
                    &<br />
                    <span className="font-bold text-stone-700">Ibu Halimah Sadiah</span>
                  </p>

                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="mt-6 flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full text-xs font-bold transition-colors"
                  >
                    <svg className="w-4 h-4 fill-pink-700" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                    </svg>
                    <span>@syifa_salsabila</span>
                  </a>
                </div>

              </div>

            </div>
          </section>


          {/* =========================================================
              4. EVENT SCHEDULE / TIMELINE SECTION (ACARA)
              ========================================================= */}
          <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50 relative">
            <div className="max-w-5xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">THE CELEBRATION</p>
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Rangkaian Acara
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Dengan penuh rasa syukur, kami mengundang bapak/ibu sekalian pada waktu dan lokasi berikut:
                </p>
              </div>

              {/* Event Cards Grid */}
              <div className="grid md:grid-cols-2 gap-8 pt-6">
                
                {/* Akad Nikah Card */}
                <div className="bg-white/95 rounded-3xl p-8 shadow-xl border border-pink-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-0"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex bg-pink-100 text-pink-700 p-4 rounded-2xl">
                      <Heart className="w-8 h-8 fill-pink-300" />
                    </div>

                    <h3 className="text-2xl font-serif-elegant font-bold text-pink-800">
                      Akad Nikah
                    </h3>

                    <hr className="border-stone-100" />

                    <div className="space-y-4 text-stone-600 text-sm">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Hari & Tanggal</p>
                          <p>Jumat, 18 September 2026</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Waktu</p>
                          <p>08.00 - 10.00 WIB</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Tempat</p>
                          <p className="font-semibold">Masjid Agung Baiturrahman</p>
                          <p>Jl. Melati No. 12, Kebayoran Baru, Jakarta Selatan</p>
                        </div>
                      </div>
                    </div>

                    {/* Google Maps link & Action */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-center font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Lihat Google Maps</span>
                      </a>
                      <a 
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Akad+Nikah+Rian+%26+Syifa&dates=20260918T010000Z/20260918T030000Z&details=Selamat+menghadiri+Akad+Nikah+kami&location=Masjid+Agung+Baiturrahman`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-center font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Simpan Tanggal</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Resepsi Card */}
                <div className="bg-white/95 rounded-3xl p-8 shadow-xl border border-pink-100 relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -z-0"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex bg-pink-100 text-pink-700 p-4 rounded-2xl">
                      <Sparkles className="w-8 h-8 text-pink-500" />
                    </div>

                    <h3 className="text-2xl font-serif-elegant font-bold text-pink-800">
                      Resepsi Pernikahan
                    </h3>

                    <hr className="border-stone-100" />

                    <div className="space-y-4 text-stone-600 text-sm">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Hari & Tanggal</p>
                          <p>Jumat, 18 September 2026</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Waktu</p>
                          <p>11.00 - 16.00 WIB</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-stone-800">Tempat</p>
                          <p className="font-semibold">Grand Ballroom Rose Palace</p>
                          <p>Jl. Tulip Emas Indah Kav 44, Jakarta Selatan</p>
                        </div>
                      </div>
                    </div>

                    {/* Google Maps link & Action */}
                    <div className="pt-4 flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://maps.google.com" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-center font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Lihat Google Maps</span>
                      </a>
                      <a 
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Resepsi+Pernikahan+Rian+%26+Syifa&dates=20260918T040000Z/20260918T090000Z&details=Selamat+menghadiri+Resepsi+Pernikahan+kami&location=Grand+Ballroom+Rose+Palace`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-center font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Simpan Tanggal</span>
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Live Embedded Map Block */}
              <div className="bg-white p-4 rounded-3xl shadow-xl border border-pink-100 overflow-hidden">
                <div className="p-4 bg-pink-50/50 rounded-2xl flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-pink-600 shrink-0" />
                  <p className="text-xs text-pink-800 font-semibold">
                    Silakan gunakan peta interaktif di bawah ini untuk melihat rute perjalanan menuju lokasi dengan mudah.
                  </p>
                </div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.27367800041!2d106.80164627448834!3d-6.22760819376063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14e7a3ff9fd%3A0xb7ca44f77259f970!2sGelora%20Bung%20Karno%20Sports%20Complex!5e0!3m2!1sen!2sid!4v1714578129202!5m2!1sen!2sid" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0, borderRadius: '16px' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wedding Location Map"
                ></iframe>
              </div>

            </div>
          </section>


          {/* =========================================================
              5. GALLERY / PHOTO SLIDESHOW SECTION
              ========================================================= */}
          <section className="py-20 px-4 bg-white relative">
            <div className="max-w-6xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">OUR MOMENTS</p>
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Galeri Kebahagiaan
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Sekilas kisah indah perjalanan kasih kami yang kami abadikan dalam lensa kamera.
                </p>
              </div>

              {/* Photo Filter Tabs */}
              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'all' 
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md' 
                      : 'bg-stone-100 hover:bg-pink-50 text-stone-600'
                  }`}
                >
                  Semua Foto
                </button>
                <button 
                  onClick={() => setActiveTab('prewedding')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'prewedding' 
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md' 
                      : 'bg-stone-100 hover:bg-pink-50 text-stone-600'
                  }`}
                >
                  Pre-Wedding
                </button>
                <button 
                  onClick={() => setActiveTab('ceremony')}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === 'ceremony' 
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md' 
                      : 'bg-stone-100 hover:bg-pink-50 text-stone-600'
                  }`}
                >
                  Pertemuan Pertama
                </button>
              </div>

              {/* Photos Masonry/Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Photo 1: Generated Couple */}
                {(activeTab === 'all' || activeTab === 'prewedding') && (
                  <div 
                    onClick={() => setSelectedImage('/images/couple.jpg')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="/images/couple.jpg" 
                      alt="Couple photo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Photo 2: Generated Rings */}
                {(activeTab === 'all' || activeTab === 'prewedding') && (
                  <div 
                    onClick={() => setSelectedImage('/images/rings.jpg')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="/images/rings.jpg" 
                      alt="Rings Photo" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Photo 3: Unsplash Couple Walk */}
                {(activeTab === 'all' || activeTab === 'prewedding') && (
                  <div 
                    onClick={() => setSelectedImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" 
                      alt="Wedding Walk" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Photo 4: Unsplash Table / Decor */}
                {(activeTab === 'all' || activeTab === 'ceremony') && (
                  <div 
                    onClick={() => setSelectedImage('https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600" 
                      alt="Wedding Flower Decor" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Photo 5: Unsplash Cake */}
                {(activeTab === 'all' || activeTab === 'ceremony') && (
                  <div 
                    onClick={() => setSelectedImage('https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=600" 
                      alt="Wedding Cake" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Photo 6: Unsplash Couple Hug */}
                {(activeTab === 'all' || activeTab === 'prewedding') && (
                  <div 
                    onClick={() => setSelectedImage('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600')}
                    className="relative rounded-2xl overflow-hidden aspect-[3/4] shadow-md cursor-pointer group hover:-translate-y-1 transition-all duration-300"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" 
                      alt="Couple Hug" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* LIGHTBOX MODAL */}
            {selectedImage && (
              <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-6 right-6 text-white bg-white/20 hover:bg-white/30 rounded-full p-3 font-bold text-lg transition-colors cursor-pointer"
                >
                  ✕ Close
                </button>
                <div className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
                  <img 
                    src={selectedImage} 
                    alt="Enlarged gallery view" 
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>
              </div>
            )}
          </section>


          {/* =========================================================
              6. OUR LOVE STORY TIMELINE
              ========================================================= */}
          <section className="py-20 px-4 bg-rose-50/50 relative">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">OUR JOURNEY</p>
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Kisah Cinta Kami
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Tiap detak waktu membawa kami semakin dekat hingga takdir mempertemukan dalam sebuah ikatan suci.
                </p>
              </div>

              {/* Vertical Timeline */}
              <div className="relative border-l-2 border-pink-200/80 ml-4 md:ml-32 space-y-12 py-4">
                
                {/* Event 1 */}
                <div className="relative pl-8 md:pl-12">
                  <span className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-pink-400 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px]">
                    ❤
                  </span>
                  <div className="absolute left-[-110px] top-1.5 hidden md:block text-right w-24">
                    <span className="font-bold text-pink-600 text-lg">Maret 2022</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
                    <span className="md:hidden block text-xs font-bold text-pink-600 mb-1">Maret 2022</span>
                    <h4 className="text-lg font-bold text-pink-800 font-serif-elegant">Pertemuan Pertama (First Meet)</h4>
                    <p className="text-stone-600 text-sm mt-2">
                      Awal mulanya kami dipertemukan dalam proyek pekerjaan yang sama. Tak disangka, canda tawa dan pandangan pertama itu menumbuhkan ketertarikan satu sama lain.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative pl-8 md:pl-12">
                  <span className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-pink-400 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px]">
                    ❤
                  </span>
                  <div className="absolute left-[-110px] top-1.5 hidden md:block text-right w-24">
                    <span className="font-bold text-pink-600 text-lg">Juni 2024</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
                    <span className="md:hidden block text-xs font-bold text-pink-600 mb-1">Juni 2024</span>
                    <h4 className="text-lg font-bold text-pink-800 font-serif-elegant">Komitmen Bersama</h4>
                    <p className="text-stone-600 text-sm mt-2">
                      Setelah bertahun-tahun saling memahami visi & misi hidup, kami memutuskan untuk membawa hubungan ini ke arah yang lebih serius serta berkomitmen untuk membangun masa depan bersama.
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative pl-8 md:pl-12">
                  <span className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-pink-400 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px]">
                    ❤
                  </span>
                  <div className="absolute left-[-110px] top-1.5 hidden md:block text-right w-24">
                    <span className="font-bold text-pink-600 text-lg">Desember 2025</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
                    <span className="md:hidden block text-xs font-bold text-pink-600 mb-1">Desember 2025</span>
                    <h4 className="text-lg font-bold text-pink-800 font-serif-elegant">Lamaran (Engagement)</h4>
                    <p className="text-stone-600 text-sm mt-2">
                      Di hadapan keluarga besar tercinta, Rian secara resmi memohon restu dari orang tua Syifa untuk meminangnya sebagai pendamping hidup selama-lamanya.
                    </p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative pl-8 md:pl-12">
                  <span className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full bg-pink-400 border-4 border-white shadow-md flex items-center justify-center text-white text-[10px]">
                    💍
                  </span>
                  <div className="absolute left-[-110px] top-1.5 hidden md:block text-right w-24">
                    <span className="font-bold text-pink-600 text-lg">September 2026</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100">
                    <span className="md:hidden block text-xs font-bold text-pink-600 mb-1">September 2026</span>
                    <h4 className="text-lg font-bold text-pink-800 font-serif-elegant">Pernikahan Kudus (The Wedding)</h4>
                    <p className="text-stone-600 text-sm mt-2">
                      Hari yang dinanti pun tiba. Melalui ikatan pernikahan ini, kami memohon doa restu agar dipertemukan dalam mahligai rumah tangga yang dilimpahi rahmat-Nya.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </section>


          {/* =========================================================
              7. DIGITAL GIFT / WEDDING GIFT SECTION (AMPLOP DIGITAL)
              ========================================================= */}
          <section className="py-20 px-4 bg-white relative">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">DIGITAL GIFT</p>
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Kado Digital / Amplop Digital
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Bagi bapak/ibu yang ingin mengirimkan kado atau ucapan tali kasih, silakan gunakan metode transfer digital di bawah ini.
                </p>
              </div>

              {/* Bank Cards Grid */}
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                
                {/* Bank BCA Card */}
                <div className="glass-pink rounded-3xl p-6 border border-pink-200/50 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                      Bank BCA
                    </span>
                    <Gift className="w-8 h-8 text-pink-400" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-stone-500 font-bold uppercase">Nomor Rekening</p>
                    <div className="flex items-center justify-between bg-white/90 px-4 py-3 rounded-xl border border-pink-100">
                      <span className="font-mono text-lg font-bold text-stone-800 tracking-wider">
                        527 1234 5678
                      </span>
                      <button 
                        onClick={() => copyToClipboard('527 1234 5678', 'BCA - Rian Adrianto')}
                        className="text-pink-600 hover:text-pink-700 p-2 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                        title="Salin No Rekening"
                      >
                        {copiedAccount === 'BCA - Rian Adrianto' ? (
                          <Check className="w-5 h-5 text-green-500 animate-pulse" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-pink-800">a.n Rian Adrianto</p>
                  </div>

                  <hr className="border-stone-100" />

                  <p className="text-xs text-stone-500">
                    *Gunakan tombol salin untuk menyalin nomor rekening secara instan.
                  </p>
                </div>

                {/* Bank Mandiri Card */}
                <div className="glass-pink rounded-3xl p-6 border border-pink-200/50 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                      Mandiri
                    </span>
                    <Gift className="w-8 h-8 text-pink-400" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-stone-500 font-bold uppercase">Nomor Rekening</p>
                    <div className="flex items-center justify-between bg-white/90 px-4 py-3 rounded-xl border border-pink-100">
                      <span className="font-mono text-lg font-bold text-stone-800 tracking-wider">
                        123 00 12345 678
                      </span>
                      <button 
                        onClick={() => copyToClipboard('123 00 12345 678', 'Mandiri - Syifa Salsabila')}
                        className="text-pink-600 hover:text-pink-700 p-2 hover:bg-pink-100 rounded-lg transition-colors cursor-pointer"
                        title="Salin No Rekening"
                      >
                        {copiedAccount === 'Mandiri - Syifa Salsabila' ? (
                          <Check className="w-5 h-5 text-green-500 animate-pulse" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-pink-800">a.n Syifa Salsabila</p>
                  </div>

                  <hr className="border-stone-100" />

                  <p className="text-xs text-stone-500">
                    *Gunakan tombol salin untuk menyalin nomor rekening secara instan.
                  </p>
                </div>

              </div>

              {/* Physical Gift shipping option */}
              <div className="bg-stone-50 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto border border-pink-100 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                    <MapPin className="w-6 h-6" />
                  </span>
                  <div>
                    <h4 className="font-serif-elegant font-bold text-pink-800 text-lg">Kirim Kado Fisik / Hadiah</h4>
                    <p className="text-stone-500 text-xs">Alamat Pengiriman Kado Resmi Mempelai</p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-pink-100 text-sm text-stone-700 space-y-2">
                  <p className="font-semibold text-pink-700">Kediaman Mempelai Wanita:</p>
                  <p>Jl. Melati Raya No. 45, Blok C, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12130</p>
                  <p className="text-xs font-semibold text-stone-500">Penerima: Syifa Salsabila (0812-3456-7890)</p>
                </div>
              </div>

            </div>
          </section>


          {/* =========================================================
              8. GUEST BOOK / RSVP (BUKU TAMU & UCAPAN)
              ========================================================= */}
          <section className="py-20 px-4 bg-gradient-to-b from-white via-rose-50 to-white relative">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">WISH WALL & RSVP</p>
                <h2 className="text-4xl md:text-5xl font-serif-elegant font-bold text-pink-800">
                  Buku Tamu & RSVP
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Berikan doa restu, harapan manis, serta konfirmasi kehadiran Anda untuk menyempurnakan kebahagiaan kami.
                </p>
              </div>

              {/* RSVP Form and Message Wall Grid */}
              <div className="grid md:grid-cols-5 gap-8">
                
                {/* Left Form: Write greeting */}
                <div className="md:col-span-2 bg-white/95 rounded-3xl p-6 shadow-xl border border-pink-100 space-y-6">
                  <h4 className="text-lg font-serif-elegant font-bold text-pink-800 flex items-center gap-2">
                    <Send className="w-4 h-4 text-pink-500" />
                    Kirim Doa Restu
                  </h4>

                  <form onSubmit={handleAddGreeting} className="space-y-4">
                    
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-600 block">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Contoh: Sarah Amalia"
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                        required
                      />
                    </div>

                    {/* Presence status input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-600 block">Konfirmasi Kehadiran</label>
                      <select 
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as 'hadir' | 'tidak_hadir' | 'ragu')}
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                      >
                        <option value="hadir">🌸 Hadir (I will attend)</option>
                        <option value="tidak_hadir">💔 Berhalangan Hadir (I cannot attend)</option>
                        <option value="ragu">🤔 Masih Ragu / Belum Pasti</option>
                      </select>
                    </div>

                    {/* Message input */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-600 block">Pesan, Doa, & Harapan</label>
                      <textarea 
                        value={formMessage}
                        onChange={(e) => setFormMessage(e.target.value)}
                        rows={4}
                        placeholder="Tulis ucapan selamat & doa terbaik Anda di sini..."
                        className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm resize-none"
                        required
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md hover:shadow-pink-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Kirim Ucapan</span>
                    </button>

                  </form>
                </div>

                {/* Right Form: Display greetings list */}
                <div className="md:col-span-3 bg-white/95 rounded-3xl p-6 shadow-xl border border-pink-100 flex flex-col h-[500px]">
                  
                  <div className="flex items-center justify-between border-b border-pink-100 pb-4 mb-4">
                    <h4 className="text-lg font-serif-elegant font-bold text-pink-800 flex items-center gap-2">
                      <Users className="w-5 h-5 text-pink-500" />
                      Doa Restu Sahabat ({greetings.length})
                    </h4>
                    <span className="text-xs font-bold bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                      Live Updates
                    </span>
                  </div>

                  {/* Message List scroll box */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                    {greetings.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 space-y-2">
                        <Users className="w-12 h-12 stroke-[1.5]" />
                        <p className="text-sm">Belum ada ucapan dari tamu undangan.</p>
                        <p className="text-xs">Jadilah yang pertama menuliskan doa!</p>
                      </div>
                    ) : (
                      greetings.map((greeting) => (
                        <div 
                          key={greeting.id} 
                          className="bg-stone-50/70 p-4 rounded-2xl border border-pink-100 space-y-2 hover:bg-stone-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-pink-800">{greeting.name}</span>
                            
                            {/* Attendance Pill */}
                            {greeting.status === 'hadir' && (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                ✓ Hadir
                              </span>
                            )}
                            {greeting.status === 'tidak_hadir' && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                                ✕ Berhalangan
                              </span>
                            )}
                            {greeting.status === 'ragu' && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                ? Ragu
                              </span>
                            )}
                          </div>
                          
                          <p className="text-stone-600 text-sm leading-relaxed italic">
                            "{greeting.message}"
                          </p>

                          <div className="text-[10px] text-stone-400 text-right">
                            {greeting.timestamp}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>

            </div>
          </section>


          {/* =========================================================
              9. CUSTOM INVITATION LINK GENERATOR (BUAT LINK WHATSAPP)
              ========================================================= */}
          <section className="py-20 px-4 bg-white relative">
            <div className="max-w-4xl mx-auto space-y-12">
              
              <div className="text-center space-y-3">
                <p className="text-pink-600 uppercase tracking-[0.2em] text-xs font-bold">SHARE LOVE</p>
                <h2 className="text-3xl md:text-4xl font-serif-elegant font-bold text-pink-800">
                  Buat Link Undangan Kustom Anda Sendiri
                </h2>
                <p className="text-stone-500 text-sm max-w-md mx-auto">
                  Tuliskan nama teman atau kerabat Anda untuk mendapatkan link undangan kustom yang siap dikirim via WhatsApp.
                </p>
              </div>

              {/* Generator Card */}
              <div className="glass-pink rounded-3xl p-6 md:p-8 max-w-xl mx-auto border border-pink-200/50 shadow-xl space-y-6">
                
                <form onSubmit={handleGenerateLink} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-600 block">Nama Penerima Undangan</label>
                    <input 
                      type="text" 
                      value={customRecipient}
                      onChange={(e) => setCustomRecipient(e.target.value)}
                      placeholder="Contoh: Bapak Budi & Istri"
                      className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-pink-200 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                    <span>Generate Link Undangan</span>
                  </button>
                </form>

                {generatedLink && (
                  <div className="space-y-4 bg-white/95 p-4 rounded-2xl border border-pink-100 animate-fade-in-up">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-stone-500">Link Anda:</p>
                      <div className="bg-stone-50 p-3 rounded-xl text-xs font-mono break-all text-stone-700 select-all border border-pink-100">
                        {generatedLink}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => copyToClipboard(generatedLink, 'Link Undangan')}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Salin Link</span>
                      </button>
                      <button 
                        onClick={shareToWhatsApp}
                        className="bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Kirim ke WA</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </section>


          {/* =========================================================
              10. FOOTER & CLOSING STATEMENT
              ========================================================= */}
          <footer className="bg-gradient-to-b from-rose-50 to-pink-100 py-16 px-4 text-center relative border-t border-pink-200/40">
            <div className="max-w-xl mx-auto space-y-6">
              
              <div className="text-pink-500 text-3xl animate-heart-beat">💖</div>
              
              <p className="font-serif-elegant text-pink-800 text-sm italic max-w-sm mx-auto leading-relaxed">
                "Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami mengucapkan terima kasih yang sebesar-besarnya."
              </p>

              <div className="space-y-1">
                <p className="text-stone-500 text-xs uppercase tracking-widest">KAMI YANG BERBAHAGIA</p>
                <h3 className="text-4xl text-pink-600 font-cursive">Rian & Syifa</h3>
                <p className="text-stone-400 text-xs">Serta Seluruh Keluarga Besar Kedua Mempelai</p>
              </div>

              <div className="h-[1px] w-24 bg-pink-300 mx-auto my-6"></div>

              <div className="text-stone-400 text-[10px] space-y-1">
                <p>© 2026 Rian & Syifa Wedding Invitation. All rights reserved.</p>
                <p>Created with Love & Passion using React + Tailwind CSS</p>
              </div>

            </div>
          </footer>
        </div>
      )}

    </div>
  );
}