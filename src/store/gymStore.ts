import { create } from 'zustand';
import {
  offersSeed,
  pricingPlans,
  type User,
  userManagementSeed,
} from '../data/mockData';

type PlanEntity = {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
};

type OfferEntity = {
  id: number;
  name?: string;
  description?: string;
  validFrom?: string;
  validTo?: string;
  code?: string;
  discount?: string;
  validity?: string;
};

type FeatureFlags = Record<number, { showProducts: boolean; allowUpgrade: boolean; showOffers: boolean }>;

type AppConfig = {
  name: string;
  logo: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  locations: Array<{ id: string; name: string; address: string; phone: string; mapUrl?: string }>;
  timezone: string;
  currency: string;
  language: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  // Form helper properties
  facebook?: string;
  instagram?: string;
  twitter?: string;
};

type PublicPageConfig = {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    features: Array<{ title: string; description: string; image: string }>;
  };
  about: {
    title: string;
    description: string;
    image: string;
    stats: Array<{ label: string; value: string }>;
  };
  services: {
    title: string;
    description: string;
    services: Array<{ name: string; description: string; image: string; price?: string }>;
  };
  pricing: {
    title: string;
    subtitle: string;
    plans: Array<{ name: string; price: string; features: string[] }>;
  };
  testimonials: {
    title: string;
    testimonials: Array<{ name: string; role: string; content: string; avatar: string }>;
  };
  contact: {
    title: string;
    subtitle: string;
    image: string;
  };
  faqs: Array<{ question: string; answer: string }>;
};

type DesignTheme = {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  styles: {
    buttonStyle: 'rounded' | 'square' | 'pill';
    layout: 'centered' | 'wide' | 'minimal';
    typography: 'modern' | 'classic' | 'bold';
  };
};

type ProductEntity = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  description: string;
};

type GymState = {
  users: User[];
  plans: PlanEntity[];
  offers: OfferEntity[];
  products: ProductEntity[];
  featureFlags: FeatureFlags;
  appConfig: AppConfig;
  publicPageConfig: PublicPageConfig;
  designThemes: DesignTheme[];
  currentDesignTheme: string;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, user: Partial<User>) => void;
  deleteUser: (id: number) => void;
  addPlan: (plan: Omit<PlanEntity, 'id'>) => void;
  updatePlan: (id: string, patch: Partial<PlanEntity>) => void;
  deletePlan: (id: string) => void;
  addOffer: (offer: Omit<OfferEntity, 'id'>) => void;
  updateOffer: (id: number, patch: Partial<OfferEntity>) => void;
  deleteOffer: (id: number) => void;
  addProduct: (product: Omit<ProductEntity, 'id'>) => void;
  updateProduct: (id: string, patch: Partial<ProductEntity>) => void;
  deleteProduct: (id: string) => void;
  toggleFlag: (userId: number, key: 'showProducts' | 'allowUpgrade' | 'showOffers') => void;
  updateAppConfig: (config: Partial<AppConfig>) => void;
  updatePublicPageConfig: (config: Partial<PublicPageConfig>) => void;
  setDesignTheme: (themeId: string) => void;
};

export const useGymStore = create<GymState>((set) => ({
  users: userManagementSeed as unknown as User[],
  plans: pricingPlans,
  offers: offersSeed,
  products: [
    { id: "p1", name: "Whey Protein Isolated", category: "Supplements", price: 59.99, stock: 45, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400", description: "Premium quality whey protein for muscle recovery." },
    { id: "p2", name: "Gym Performance Tee", category: "Apparel", price: 24.99, stock: 120, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400", description: "Breathable moisture-wicking fabric for intense workouts." },
    { id: "p3", name: "Resistance Bands Set", category: "Equipment", price: 19.99, stock: 15, image: "https://images.unsplash.com/photo-1598289431512-b97b0917a63e?auto=format&fit=crop&q=80&w=400", description: "Complete set of 5 resistance levels for home or gym." },
  ],
  featureFlags: {
    1: { showProducts: true, allowUpgrade: true, showOffers: true },
    2: { showProducts: true, allowUpgrade: true, showOffers: false },
  },
  appConfig: {
    name: "FitHub Gym",
    logo: "/logo.png",
    description: "Your ultimate fitness destination with state-of-the-art equipment and expert trainers.",
    contactEmail: "info@fithub.com",
    contactPhone: "+1 (555) 123-4567",
    contactAddress: "123 Fitness Street, Health City, HC 12345",
    locations: [
      { id: "1", name: "Main Branch - Downtown", address: "123 Fitness St, Downtown", phone: "+1 555-0101" },
      { id: "2", name: "Westside Branch", address: "456 West Blvd, Westside", phone: "+1 555-0102" },
    ],
    timezone: "UTC+0",
    currency: "USD",
    language: "English",
    socialLinks: {
      facebook: "https://facebook.com/fithub",
      instagram: "https://instagram.com/fithub",
      twitter: "https://twitter.com/fithub",
    },
  },
  publicPageConfig: {
    home: {
      heroTitle: "Transform Your Body, Transform Your Life",
      heroSubtitle: "Join the ultimate fitness community with state-of-the-art equipment and expert guidance.",
      heroImage: "/hero-image.jpg",
      features: [
        { title: "Expert Trainers", description: "Certified professionals to guide your fitness journey", image: "/trainer.jpg" },
        { title: "Modern Equipment", description: "Latest fitness technology for optimal results", image: "/equipment.jpg" },
        { title: "Flexible Hours", description: "24/7 access to our premium facilities", image: "/hours.jpg" },
      ],
    },
    about: {
      title: "About FitHub Gym",
      description: "We are committed to helping you achieve your fitness goals with personalized training programs and a supportive community.",
      image: "/about-image.jpg",
      stats: [
        { label: "Members", value: "10,000+" },
        { label: "Trainers", value: "50+" },
        { label: "Years Experience", value: "15+" },
      ],
    },
    services: {
      title: "Our Services",
      description: "Comprehensive fitness solutions tailored to your needs",
      services: [
        { name: "Personal Training", description: "One-on-one sessions with certified trainers", image: "/personal-training.jpg", price: "$50/session" },
        { name: "Group Classes", description: "High-energy group fitness classes", image: "/group-classes.jpg", price: "$20/class" },
        { name: "Nutrition Counseling", description: "Expert guidance on nutrition and diet", image: "/nutrition.jpg", price: "$30/session" },
      ],
    },
    pricing: {
      title: "Membership Plans",
      subtitle: "Choose the perfect plan for your fitness journey",
      plans: [
        { name: "Basic", price: "$29/month", features: ["Gym Access", "Locker Room", "Basic Equipment"] },
        { name: "Premium", price: "$49/month", features: ["All Basic Features", "Group Classes", "Personal Training (2x/month)"] },
        { name: "VIP", price: "$79/month", features: ["All Premium Features", "Unlimited Personal Training", "Nutrition Counseling"] },
      ],
    },
    testimonials: {
      title: "What Our Members Say",
      testimonials: [
        { name: "Sarah Johnson", role: "Member since 2022", content: "FitHub changed my life! The trainers are amazing and the community is so supportive.", avatar: "/sarah.jpg" },
        { name: "Mike Chen", role: "Member since 2021", content: "Best gym I've ever been to. Clean facilities, great equipment, and excellent service.", avatar: "/mike.jpg" },
        { name: "Emma Davis", role: "Member since 2023", content: "The group classes are incredible! I've never felt more motivated to work out.", avatar: "/emma.jpg" },
      ],
    },
    contact: {
      title: "Get In Touch",
      subtitle: "Ready to start your fitness journey? Contact us today!",
      image: "/contact-image.jpg",
    },
    faqs: [
      { question: "What are your operating hours?", answer: "We are open 24/7 for all premium and VIP members. Basic members have access from 5 AM to 11 PM." },
      { question: "Do you offer personal training?", answer: "Yes, we have a team of certified personal trainers ready to help you reach your goals." },
      { question: "Can I freeze my membership?", answer: "Members can freeze their accounts for up to 3 months per year for medical or travel reasons." },
    ],
  },
  designThemes: [
    {
      id: "modern",
      name: "Modern & Clean",
      description: "Minimalist design with clean lines and modern aesthetics",
      preview: "/theme-modern.jpg",
      colors: {
        primary: "#3B82F6",
        secondary: "#1F2937",
        accent: "#F59E0B",
        background: "#FFFFFF",
        text: "#111827",
      },
      styles: {
        buttonStyle: "rounded",
        layout: "centered",
        typography: "modern",
      },
    },
    {
      id: "vibrant",
      name: "Vibrant & Energetic",
      description: "Bold colors and dynamic design to energize your visitors",
      preview: "/theme-vibrant.jpg",
      colors: {
        primary: "#EF4444",
        secondary: "#7C3AED",
        accent: "#10B981",
        background: "#FEF3C7",
        text: "#1F2937",
      },
      styles: {
        buttonStyle: "pill",
        layout: "wide",
        typography: "bold",
      },
    },
    {
      id: "classic",
      name: "Classic & Professional",
      description: "Timeless design with professional appearance",
      preview: "/theme-classic.jpg",
      colors: {
        primary: "#374151",
        secondary: "#6B7280",
        accent: "#D97706",
        background: "#F9FAFB",
        text: "#111827",
      },
      styles: {
        buttonStyle: "square",
        layout: "minimal",
        typography: "classic",
      },
    },
  ],
  currentDesignTheme: "modern",
  addUser: (user) => set((state) => ({ users: [...state.users, { ...user, id: Date.now() }] })),
  updateUser: (id, user) => set((state) => ({ users: state.users.map((u) => (u.id === id ? { ...u, ...user } : u)) })),
  deleteUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
  addPlan: (plan) =>
    set((state) => ({
      plans: [...state.plans, { ...plan, id: `${plan.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` }],
    })),
  updatePlan: (id, patch) => set((state) => ({ plans: state.plans.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  deletePlan: (id) => set((state) => ({ plans: state.plans.filter((p) => p.id !== id) })),
  addOffer: (offer) => set((state) => ({ offers: [...state.offers, { ...offer, id: Date.now() }] })),
  updateOffer: (id, patch) => set((state) => ({ offers: state.offers.map((o) => (o.id === id ? { ...o, ...patch } : o)) })),
  deleteOffer: (id) => set((state) => ({ offers: state.offers.filter((o) => o.id !== id) })),
  addProduct: (product) => set((state) => ({ products: [...state.products, { ...product, id: `p-${Date.now()}` }] })),
  updateProduct: (id, patch) => set((state) => ({ products: state.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
  deleteProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  toggleFlag: (userId, key) =>
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        [userId]: {
          showProducts: true,
          allowUpgrade: true,
          showOffers: true,
          ...state.featureFlags[userId],
          [key]: !state.featureFlags[userId]?.[key],
        },
      },
    })),
  updateAppConfig: (config) => set((state) => ({ appConfig: { ...state.appConfig, ...config } })),
  updatePublicPageConfig: (config) => set((state) => ({ publicPageConfig: { ...state.publicPageConfig, ...config } })),
  setDesignTheme: (themeId) => set(() => ({ currentDesignTheme: themeId })),
}));
