'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  // حالات البحث والفلترة
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'date-newest' | 'name-asc'>('default');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1200);

  const scrollRef = useRef<HTMLDivElement>(null);

  // قاعدة بيانات متجر Shopando الشاملة (منتجات مادية وبرمجيات)
  const initialProducts = useMemo(() => [
    { 
      id: 1, 
      titleAr: 'نظام Shopando الذكي للمتاجر', 
      titleEn: 'Shopando Enterprise POS & Admin', 
      category: 'software',
      categoryAr: 'برمجيات وأنظمة',
      categoryEn: 'Software & Systems',
      price: 299, 
      date: '2026-10-01', 
      tagAr: 'الأكثر مبيعاً',
      tagEn: 'Bestseller',
      specsAr: 'نظام إدارة متكامل، متوافق مع السحابة، يدعم تعدد اللغات، لوحة تحكم HEADIX.',
      specsEn: 'Full management system, cloud-compatible, multi-language, HEADIX dashboard.'
    },
    { 
      id: 2, 
      titleAr: 'سكربت متجر إلكتروني متكامل', 
      titleEn: 'Full E-Commerce Script Pro', 
      category: 'software',
      categoryAr: 'برمجيات وأنظمة',
      categoryEn: 'Software & Systems',
      price: 199, 
      date: '2026-10-05', 
      tagAr: 'جديد',
      tagEn: 'New',
      specsAr: 'مصمم بلغة حديثة، حماية عالية ضد الاختراق، جاهز لربط بوابات الدفع.',
      specsEn: 'Modern code, high security against breaches, ready for payment gateway integration.'
    },
    { 
      id: 3, 
      titleAr: 'سماعات لاسلكية عازلة للصوت', 
      titleEn: 'Pro Wireless Noise-Canceling Headphones', 
      category: 'electronics',
      categoryAr: 'إلكترونيات',
      categoryEn: 'Electronics',
      price: 149, 
      date: '2026-09-20', 
      tagAr: 'عرض خاص',
      tagEn: 'Special Offer',
      specsAr: 'عزل نشط للضوضاء ANC، بطارية تدوم 40 ساعة، صوت محيطي نقي.',
      specsEn: 'Active Noise Cancellation ANC, 40-hour battery life, pristine spatial audio.'
    },
    { 
      id: 4, 
      titleAr: 'ساعة ذكية متطورة Ultra', 
      titleEn: 'Smart Watch Ultra Edition', 
      category: 'electronics',
      categoryAr: 'إلكترونيات',
      categoryEn: 'Electronics',
      price: 220, 
      date: '2026-10-08', 
      tagAr: 'مميز',
      tagEn: 'Featured',
      specsAr: 'هيكل مقاوم للصدأ، قياس نبضات القلب ومستوى الأكسجين، شاشة AMOLED.',
      specsEn: 'Stainless steel body, heart rate & SpO2 monitoring, AMOLED display.'
    },
    { 
      id: 5, 
      titleAr: 'سترة شتوية أنيقة مقاومة للماء', 
      titleEn: 'Premium Waterproof Winter Jacket', 
      category: 'fashion',
      categoryAr: 'أزياء وموضة',
      categoryEn: 'Fashion & Style',
      price: 89, 
      date: '2026-09-15', 
      tagAr: 'موضة',
      tagEn: 'Trendy',
      specsAr: 'خامات أوروبية فاخرة، عزل حراري مزدوج، مقاومة كاملة للمياه والرياح.',
      specsEn: 'Premium European materials, double thermal insulation, waterproof & windproof.'
    },
    { 
      id: 6, 
      titleAr: 'ماكينة تحضير القهوة الذكية', 
      titleEn: 'Smart Espresso Coffee Machine', 
      category: 'home',
      categoryAr: 'مستلزمات منزلية',
      categoryEn: 'Home & Kitchen',
      price: 130, 
      date: '2026-10-02', 
      tagAr: 'حصري',
      tagEn: 'Exclusive',
      specsAr: 'ضغط استخلاص 20 بار، مطحنة حبوب مدمجة، شاشة تحكم باللمس.',
      specsEn: '20-bar extraction pressure, built-in bean grinder, touch control display.'
    },
  ], []);

  // تهيئة محرك البحث الذكي Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(initialProducts, {
      keys: ['titleAr', 'titleEn', 'categoryAr', 'categoryEn', 'specsAr', 'specsEn'],
      threshold: 0.4,
      ignoreLocation: true,
    });
  }, [initialProducts]);

  // فلترة وترتيب المنتجات
  const filteredProducts = useMemo(() => {
    let list = initialProducts;
    if (searchQuery.trim() !== '') {
      const fuseResults = fuse.search(searchQuery.trim());
      list = fuseResults.map((result) => result.item);
    }
    return list
      .filter((product) => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesPrice = product.price <= maxPriceFilter;
        return matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'date-newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'name-asc') {
          const nameA = lang === 'ar' ? a.titleAr : a.titleEn;
          const nameB = lang === 'ar' ? b.titleAr : b.titleEn;
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [searchQuery, selectedCategory, maxPriceFilter, sortBy, lang, initialProducts, fuse]);

  // التقليب التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // النصوص باللغتين
  const t = {
    ar: {
      storeName: 'Shopando',
      subTitle: 'متجر شامل: إلكترونيات، أزياء، منزل وبرمجيات',
      home: 'الرئيسية',
      products: 'المنتجات',
      categories: 'التصنيفات',
      about: 'من نحن',
      cart: 'السلة',
      login: 'تسجيل الدخول',
      heroTag: 'متجر إلكتروني شامل ومستقل',
      heroTitle1: 'تجوّل في عالم',
      heroDesc: 'منصة تسوق شاملة تجمع بين المنتجات المادية والعصرية، والحلول البرمجية والأنظمة الذكية بأفضل الأسعار وأعلى جودة.',
      shopNow: 'ابدأ التسوق الآن',
      features: 'استعراض المميزات',
      eliteOffers: 'الأكثر طلباً (تمرير تلقائي)',
      autoUpdating: '⚡ يتحدث تلقائياً',
      allProducts: 'استكشف كافة الأقسام والمنتجات',
      responsiveSub: 'تصفح أحدث المنتجات والبرمجيات المتاحة بكل سهولة.',
      searchPlaceholder: '🔍 ابحث عن أي منتج (مثال: متجر، سماعه، ستره، قهوة...)...',
      sortBy: 'الترتيب حسب:',
      sortDefault: 'الافتراضي',
      sortPriceAsc: 'السعر: من الأقل للأعلى ⬆️',
      sortPriceDesc: 'السعر: من الأعلى للأقل ⬇️',
      sortDateNewest: 'الأحدث وصولاً 🆕',
      sortNameAsc: 'أبجدياً (أ-ي)',
      maxPrice: 'الحد الأقصى للسعر:',
      reset: 'إعادة ضبط',
      noResults: 'عذراً، لم نجد أي منتجات تطابق بحثك أو الفلتر المحدد.',
      buy: 'شراء',
      addToCart: 'أضف للسلة',
      price: 'السعر',
      rights: 'جميع الحقوق محفوظة.',
      designedBy: 'تم التصميم والتطوير بواسطة شركة',
      privacy: 'الخصوصية',
      terms: 'الشروط والأحكام',
      support: 'الدعم الفني',
    },
    en: {
      storeName: 'Shopando',
      subTitle: 'General Store: Tech, Fashion, Home & Software',
      home: 'Home',
      products: 'Products',
      categories: 'Categories',
      about: 'About Us',
      cart: 'Cart',
      login: 'Sign In',
      heroTag: 'Comprehensive & Independent E-Commerce Store',
      heroTitle1: 'Explore the World of',
      heroDesc: 'A comprehensive department store bringing together physical products and digital software solutions in one place.',
      shopNow: 'Shop Now',
      features: 'Explore Features',
      eliteOffers: 'Popular & Featured (Auto-Scroll)',
      autoUpdating: '⚡ Live Auto-Scroll',
      allProducts: 'Explore All Departments & Items',
      responsiveSub: 'Browse the latest available products and software effortlessly.',
      searchPlaceholder: '🔍 Search anything (e.g., pos, jacket, watch, coffee...)...',
      sortBy: 'Sort by:',
      sortDefault: 'Default',
      sortPriceAsc: 'Price: Low to High ⬆️',
      sortPriceDesc: 'Price: High to Low ⬇️',
      sortDateNewest: 'Newest Arrivals 🆕',
      sortNameAsc: 'Alphabetical (A-Z)',
      maxPrice: 'Max Price:',
      reset: 'Reset Filters',
      noResults: 'Sorry, no products matched your search or filters.',
      buy: 'Buy Now',
      addToCart: 'Add to Cart',
      price: 'Price',
      rights: 'All rights reserved.',
      designedBy: 'Designed & Developed by',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      support: 'Technical Support',
    }
  }[lang];

  // إدارة النسق
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      if (theme === 'dark') setIsDark(true);
      else if (theme === 'light') setIsDark(false);
      else setIsDark(mediaQuery.matches);
    };
    updateTheme();
    if (theme === 'system') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const categoriesList = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'software', labelAr: '💻 برمجيات وأنظمة', labelEn: '💻 Software & Systems' },
    { key: 'electronics', labelAr: '🎧 إلكترونيات', labelEn: '🎧 Electronics' },
    { key: 'fashion', labelAr: '👕 أزياء وموضة', labelEn: '👕 Fashion' },
    { key: 'home', labelAr: '🏠 مستلزمات منزلية', labelEn: '🏠 Home Goods' },
  ];

  return (
    <div className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 relative ${isDark ? 'bg-[#050811] text-gray-100' : 'bg-[#f8fafc] text-gray-900'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
       {/* Navbar */}
       <header className={`sticky top-0 z-50 backdrop-blur-2xl border-b transition-colors duration-500 ${
        isDark 
          ? 'bg-gray-950/80 border-white/10 shadow-2xl shadow-black/60' 
          : 'bg-white/80 border-gray-200/80 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-orange-500 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-blue-500/20 shrink-0">
              S
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-blue-500 to-orange-400 bg-clip-text text-transparent">
                {t.storeName}
              </span>
              <span className={`block text-[9px] sm:text-[10px] font-medium tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t.subTitle}
              </span>
            </div>
          </div>
          
          <nav className={`hidden md:flex items-center gap-8 text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <a href="#" className="hover:text-blue-500 transition-colors">{t.home}</a>
            <a href="#" className="hover:text-blue-500 transition-colors">{t.products}</a>
            <a href="#" className="hover:text-blue-500 transition-colors">{t.categories}</a>
            <a href="#" className="hover:text-blue-500 transition-colors">{t.about}</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button 
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md transition-all ${
                isDark 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 text-orange-400' 
                  : 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-blue-600'
              }`}
            >
              🌐 {lang === 'ar' ? 'English' : 'عربي'}
            </button>

            <div className={`flex items-center p-0.5 sm:p-1 rounded-2xl border backdrop-blur-md ${
              isDark ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'
            }`}>
              <button onClick={() => setTheme('light')} className={`p-1.5 rounded-xl text-xs ${theme === 'light' ? 'bg-white text-blue-600 shadow-md font-black' : ''}`}>☀️</button>
              <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-xl text-xs ${theme === 'dark' ? 'bg-gray-800 text-orange-400 shadow-md font-black' : ''}`}>🌙</button>
            </div>

            <button className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              👤 <span className="hidden sm:inline">{t.login}</span>
            </button>

            <button className={`px-2.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold shadow-lg flex items-center gap-1.5 ${
              isDark ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
            }`}>
              🛒 <span className="hidden sm:inline">{t.cart}</span>
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-14 sm:py-24 px-4 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className={`px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold mb-4 inline-flex items-center gap-2 border ${
            isDark ? 'bg-white/5 border-white/10 text-orange-400' : 'bg-blue-50 border-blue-200 text-blue-600'
          }`}>
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            {t.heroTag}
          </span>

          <h1 className="text-3xl sm:text-6xl font-black mb-4 tracking-tight">
            {t.heroTitle1} <br/>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-400 bg-clip-text text-transparent">
              Shopando General Store
            </span>
          </h1>

          <p className={`text-sm sm:text-lg mb-6 max-w-2xl mx-auto font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t.heroDesc}
          </p>
        </div>
      </section>

      {/* Carousel Row */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
            <h2 className={`text-base sm:text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t.eliteOffers}
            </h2>
          </div>
          <span className="text-xs text-blue-500 font-bold">{t.autoUpdating}</span>
        </div>

        <div ref={scrollRef} className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {initialProducts.map((item) => (
            <div key={`carousel-${item.id}`} className={`min-w-[200px] sm:min-w-[250px] flex-shrink-0 rounded-2xl p-4 border snap-start ${
              isDark ? 'bg-white/[0.05] border-white/10' : 'bg-white border-gray-200 shadow-md'
            }`}>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                {lang === 'ar' ? item.tagAr : item.tagEn}
              </span>
              <div className={`w-full h-28 rounded-xl my-2 flex items-center justify-center font-bold text-xs p-2 text-center ${isDark ? 'bg-gray-900/60 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-500/10">
                <span className="text-sm font-black text-blue-500">${item.price}.00</span>
                <button className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white">{t.buy}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Filter & Fuzzy Search Section */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6 text-center sm:text-right">
          <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t.allProducts}
          </h2>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t.responsiveSub}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full py-4 px-5 pr-12 rounded-2xl border text-sm font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDark 
                ? 'bg-gray-900/80 border-white/10 text-white placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
            }`}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 font-bold text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : isDark 
                    ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {lang === 'ar' ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Filter Controls */}
        <div className={`p-4 rounded-2xl border mb-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t.maxPrice} <span className="text-orange-500">${maxPriceFilter}</span></span>
            <input 
              type="range" 
              min="30" 
              max="1200" 
              step="10" 
              value={maxPriceFilter} 
              onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
              className="w-32 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{t.sortBy}</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`py-2 px-3 rounded-xl border font-bold text-xs focus:outline-none ${
                isDark ? 'bg-gray-900 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <option value="default">{t.sortDefault}</option>
              <option value="price-asc">{t.sortPriceAsc}</option>
              <option value="price-desc">{t.sortPriceDesc}</option>
              <option value="date-newest">{t.sortDateNewest}</option>
              <option value="name-asc">{t.sortNameAsc}</option>
            </select>

            {(searchQuery || selectedCategory !== 'all' || maxPriceFilter !== 1200 || sortBy !== 'default') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setMaxPriceFilter(1200);
                  setSortBy('default');
                }}
                className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition"
              >
                {t.reset}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className={`text-center py-16 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
            <p className="text-3xl mb-2">🔍</p>
            <p className="font-bold text-sm">{t.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((item) => (
              <div 
                key={`grid-${item.id}`} 
                className={`group relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 border transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl flex flex-col justify-between ${
                  isDark 
                    ? 'bg-gradient-to-b from-white/[0.07] to-white/[0.02] border-white/10 shadow-2xl hover:border-blue-500/50' 
                    : 'bg-white border-gray-200 shadow-lg hover:border-blue-500/40'
                }`}
              >
                <div>
                  <span className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded-full text-[9px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {lang === 'ar' ? item.tagAr : item.tagEn}
                  </span>

                  <div className={`w-full h-28 sm:h-44 rounded-xl mb-3 flex items-center justify-center text-xs sm:text-sm font-bold text-center p-2 ${
                    isDark ? 'bg-gray-900/60 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span>{lang === 'ar' ? item.categoryAr : item.categoryEn}</span>
                  </div>

                  <h3 className={`font-bold text-xs sm:text-base mb-1 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {lang === 'ar' ? item.titleAr : item.titleEn}
                  </h3>
                  
                  <p className={`text-[10px] mt-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {lang === 'ar' ? item.specsAr : item.specsEn}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-500/10 mt-auto gap-1">
                  <div>
                    <span className={`text-[8px] block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.price}</span>
                    <span className="text-xs sm:text-lg font-black text-blue-500">${item.price}.00</span>
                  </div>
                  <button className="px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition">
                    {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className={`border-t py-6 mt-16 transition-colors duration-500 ${
        isDark ? 'bg-gray-950/90 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#" className="hover:text-blue-500 transition">{t.privacy}</a>
              <span>·</span>
              <a href="#" className="hover:text-blue-500 transition">{t.terms}</a>
              <span>·</span>
              <a href="#" className="hover:text-blue-500 transition">{t.support}</a>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 text-center">
              <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                Shopando © 2026 {t.rights}
              </p>

              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md text-xs font-bold ${
                isDark ? 'bg-white/5 border-white/10 text-blue-400' : 'bg-blue-50/50 border-blue-200 text-blue-700'
              }`}>
                <span>✨ {t.designedBy}</span>
                <span className="font-black text-orange-500">HEADIX</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}