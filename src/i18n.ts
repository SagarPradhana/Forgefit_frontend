import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "settings": "Settings",
      "profile": "Profile",
      "logout": "Logout",
      "login": "Login",
      "register": "Register",
      "home": "Home",
      "about": "About",
      "services": "Services",
      "contact": "Contact",
      "pricing": "Pricing",
      "testimonials": "Testimonials",

      // Navigation
      "admin": "Admin",
      "user": "User",
      "attendance": "Attendance",
      "users": "Users",
      "products": "Products",
      "offers": "Offers",
      "subscription": "Subscription",
      "subscriptions": "Subscriptions",
      "payments": "Payments",
      "features": "Features",
      "notifications": "Notifications",

      // Dashboard
      "totalUsers": "Total Users",
      "activeUsers": "Active Users",
      "revenue": "Revenue",
      "growth": "Growth",

      // Forms
      "email": "Email",
      "password": "Password",
      "confirmPassword": "Confirm Password",
      "firstName": "First Name",
      "lastName": "Last Name",
      "phone": "Phone",
      "submit": "Submit",
      "cancel": "Cancel",
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete",

      // Messages
      "loading": "Loading...",
      "error": "Error",
      "success": "Success",
      "noData": "No data available",
      "confirmDelete": "Are you sure you want to delete this item?",

      // Gym specific
      "gymManagement": "Gym Management",
      "fitnessJourney": "Start Your Fitness Journey",
      "joinNow": "Join Now",
      "getStarted": "Get Started",
    }
  },
  hi: {
    translation: {
      // Common
      "welcome": "स्वागत है",
      "dashboard": "डैशबोर्ड",
      "settings": "सेटिंग्स",
      "profile": "प्रोफ़ाइल",
      "logout": "लॉग आउट",
      "login": "लॉग इन",
      "register": "रजिस्टर",
      "home": "होम",
      "about": "हमारे बारे में",
      "services": "सेवाएं",
      "contact": "संपर्क",
      "pricing": "मूल्य निर्धारण",
      "testimonials": "प्रशंसापत्र",

      // Navigation
      "admin": "एडमिन",
      "user": "उपयोगकर्ता",
      "attendance": "उपस्थिति",
      "users": "उपयोगकर्ता",
      "products": "उत्पाद",
      "offers": "ऑफर",
      "subscription": "सब्सक्रिप्शन",
      "subscriptions": "सब्सक्रिप्शन्स",
      "payments": "भुगतान",
      "features": "सुविधाएं",
      "notifications": "सूचनाएं",

      // Dashboard
      "totalUsers": "कुल उपयोगकर्ता",
      "activeUsers": "सक्रिय उपयोगकर्ता",
      "revenue": "राजस्व",
      "growth": "वृद्धि",

      // Forms
      "email": "ईमेल",
      "password": "पासवर्ड",
      "confirmPassword": "पासवर्ड की पुष्टि करें",
      "firstName": "पहला नाम",
      "lastName": "अंतिम नाम",
      "phone": "फोन",
      "submit": "सबमिट",
      "cancel": "रद्द करें",
      "save": "सेव करें",
      "edit": "संपादित करें",
      "delete": "मिटाएं",

      // Messages
      "loading": "लोड हो रहा है...",
      "error": "त्रुटि",
      "success": "सफलता",
      "noData": "कोई डेटा उपलब्ध नहीं",
      "confirmDelete": "क्या आप वाकई इस आइटम को मिटाना चाहते हैं?",

      // Gym specific
      "gymManagement": "जिम प्रबंधन",
      "fitnessJourney": "अपनी फिटनेस यात्रा शुरू करें",
      "joinNow": "अभी जुड़ें",
      "getStarted": "शुरू करें",
    }
  },
  or: {
    translation: {
      // Common
      "welcome": "ସ୍ଵାଗତ",
      "dashboard": "ଡ୍ୟାସବୋର୍ଡ",
      "settings": "ସେଟିଂସ",
      "profile": "ପ୍ରୋଫାଇଲ",
      "logout": "ଲଗଆଉଟ",
      "login": "ଲଗଇନ",
      "register": "ରେଜିଷ୍ଟର",
      "home": "ହୋମ",
      "about": "ଆମ ବିଷୟରେ",
      "services": "ସେବାଗୁଡ଼ିକ",
      "contact": "ଯୋଗାଯୋଗ",
      "pricing": "ମୂଲ୍ୟ ନିର୍ଧାରଣ",
      "testimonials": "ପ୍ରଶଂସାପତ୍ର",

      // Navigation
      "admin": "ଆଡମିନ",
      "user": "ଉପଯୋଗକର୍ତ୍ତା",
      "attendance": "ଉପସ୍ଥିତି",
      "users": "ଉପଯୋଗକର୍ତ୍ତାମାନେ",
      "products": "ଉତ୍ପାଦଗୁଡ଼ିକ",
      "offers": "ଅଫରଗୁଡ଼ିକ",
      "subscription": "ସବସ୍କ୍ରିପସନ",
      "subscriptions": "ସବସ୍କ୍ରିପସନଗୁଡ଼ିକ",
      "payments": "ଦେୟ",
      "features": "ବୈଶିଷ୍ଟ୍ୟଗୁଡ଼ିକ",
      "notifications": "ବିଜ୍ଞପ୍ତିଗୁଡ଼ିକ",

      // Dashboard
      "totalUsers": "ମୋଟ ଉପଯୋଗକର୍ତ୍ତା",
      "activeUsers": "ସକ୍ରିୟ ଉପଯୋଗକର୍ତ୍ତା",
      "revenue": "ରାଜସ୍ୱ",
      "growth": "ବୃଦ୍ଧି",

      // Forms
      "email": "ଇମେଲ",
      "password": "ପାସୱାର୍ଡ",
      "confirmPassword": "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
      "firstName": "ପ୍ରଥମ ନାମ",
      "lastName": "ଶେଷ ନାମ",
      "phone": "ଫୋନ",
      "submit": "ଦାଖଲ କରନ୍ତୁ",
      "cancel": "ରଦ୍ଦ କରନ୍ତୁ",
      "save": "ସେଭ କରନ୍ତୁ",
      "edit": "ସମ୍ପାଦନା କରନ୍ତୁ",
      "delete": "ଡିଲିଟ କରନ୍ତୁ",

      // Messages
      "loading": "ଲୋଡ୍ ହେଉଛି...",
      "error": "ତ୍ରୁଟି",
      "success": "ସଫଳତା",
      "noData": "କୌଣସି ଡାଟା ଉପଲବ୍ଧ ନାହିଁ",
      "confirmDelete": "ଆପଣ ନିଶ୍ଚିତ କି ଏହି ଆଇଟମକୁ ଡିଲିଟ କରିବାକୁ ଚାହାଁନ୍ତି?",

      // Gym specific
      "gymManagement": "ଜିମ୍ ପରିଚାଳନା",
      "fitnessJourney": "ଆପଣଙ୍କ ଫିଟନେସ୍ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
      "joinNow": "ଏବେ ଯୋଗ ଦିଅନ୍ତୁ",
      "getStarted": "ଆରମ୍ଭ କରନ୍ତୁ",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;