import { Product, ClientResult, HeroImage, Testimonial } from './types';

export const DEFAULT_HERO_IMAGES: HeroImage[] = [
  {
    id: 'h1',
    url: 'https://images.unsplash.com/photo-1560060141-7b9018741ced?q=80&w=2669&auto=format&fit=crop', // Pink aesthetic salon/hair
    position: '50% 50%'
  },
  {
    id: 'h2',
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2669&auto=format&fit=crop', // Woman with smooth hair
    position: '50% 50%'
  }
];

export const SEED_CLIENT_RESULTS: ClientResult[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=600&auto=format&fit=crop',
    handle: '@sarah_beauty',
    tag: '#Transformation'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600&auto=format&fit=crop',
    handle: '@lisa_hair',
    tag: '#Brillance'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a294208b4?q=80&w=600&auto=format&fit=crop',
    handle: '@maria_style',
    tag: '#Keratin'
  }
];

export const SEED_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    text: "Mes cheveux n'ont jamais été aussi lisses et brillants. C'est magique !",
    author: "Sarah M.",
    role: "Cliente vérifiée",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    slug: 'ribeiros-liss-keratin',
    name: { fr: "Ribeiro's Liss Keratin Protein", ar: 'بروتين الكيراتين المعالج ريبيرو ليس' },
    shortDescription: { 
      fr: 'Lissage brésilien professionnel pour des cheveux lisses et brillants.', 
      ar: 'تمليس برازيلي احترافي يمنح شعرك نعومة فائقة ولمعاناً لا يضاهى.' 
    },
    descriptionBlocks: {
      fr: [
        { id: '1', type: 'text', content: 'Transformez vos cheveux avec notre traitement à la kératine pure. Résultats impeccables dès la première application.' },
        { id: '2', type: 'image', content: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2669&auto=format&fit=crop' },
        { id: '3', type: 'text', content: 'Mode d\'emploi: Appliquer mèche par mèche, laisser poser, puis lisser.' }
      ],
      ar: [
        { id: '1', type: 'text', content: 'حولي مظهر شعرك بالكامل مع علاج الكيراتين النقي. نتائج مثالية وملمس حريري من التطبيق الأول.' },
        { id: '2', type: 'image', content: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2669&auto=format&fit=crop' },
        { id: '3', type: 'text', content: 'طريقة الاستخدام: يوزع المنتج خصلة بخصلة، يترك ليتفاعل، ثم يتم تمليس الشعر بالمكواة.' }
      ]
    },
    price: 195.00,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1935&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1780&auto=format&fit=crop'
    ],
    category: 'Lissage',
    variations: [
      { id: 'v1', name: '1L Pro', price: 195.00, stock: 50 },
      { id: 'v2', name: 'Kit 100ml', price: 45.00, stock: 100 }
    ],
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'masque-renaissance',
    name: { fr: 'Masque Capillaire Renaissance', ar: 'قناع رينيسانس المرمم' },
    shortDescription: { 
      fr: 'Hydratation intense 500ml. Répare les cheveux abîmés.', 
      ar: 'ترطيب عميق (500 مل). يعيد الحيوية للشعر التالف والمجهد.' 
    },
    descriptionBlocks: {
      fr: [{ id: '1', type: 'text', content: 'Formule riche en vitamines et huiles exotiques pour une douceur extrême.' }],
      ar: [{ id: '1', type: 'text', content: 'تركيبة غنية بالفيتامينات والزيوت الاستوائية النادرة لنعومة فائقة وتغذية عميقة.' }]
    },
    price: 39.95,
    images: [
      'https://images.unsplash.com/photo-1571781565036-d3f7595ca814?q=80&w=1887&auto=format&fit=crop'
    ],
    category: 'Soins',
    variations: [],
    isFeatured: true,
  },
   {
    id: '3',
    slug: 'serum-blueberry',
    name: { fr: 'Sérum Blueberry Éclat', ar: 'سيروم التوت البري للإشراق' },
    shortDescription: { 
      fr: 'Brillance, protection et douceur. Finition parfaite.', 
      ar: 'لمعان فوري، حماية فائقة ونعومة حريرية. اللمسة النهائية المثالية.' 
    },
    descriptionBlocks: {
      fr: [{ id: '1', type: 'text', content: 'Quelques gouttes suffisent pour sublimer votre coiffure et protéger de la chaleur.' }],
      ar: [{ id: '1', type: 'text', content: 'بضع قطرات كافية لتعزيز جمال تسريحتك وحماية شعرك من حرارة التصفيف.' }]
    },
    price: 33.45,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop'
    ],
    category: 'Soins',
    variations: [],
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'shampoing-equilibre',
    name: { fr: 'Shampoing Équilibre', ar: 'شامبو التوازن اللطيف' },
    shortDescription: { 
      fr: 'Douceur 450ml. Pour cuir chevelu sensible.', 
      ar: 'تنظيف لطيف (450 مل). مثالي لفروة الرأس الحساسة.' 
    },
    descriptionBlocks: {
      fr: [{ id: '1', type: 'text', content: 'Nettoie en douceur sans agresser.' }],
      ar: [{ id: '1', type: 'text', content: 'ينظف الشعر بعمق ولطف دون أن يسبب الجفاف أو التهيج.' }]
    },
    price: 35.99,
    images: [
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=1888&auto=format&fit=crop'
    ],
    category: 'Shampoing',
    variations: [],
    isFeatured: true,
  }
];

export const CATEGORY_TRANSLATIONS: Record<string, { fr: string, ar: string }> = {
  'Lissage': { fr: 'Lissage', ar: 'تمليس وعلاج' },
  'Soins': { fr: 'Soins', ar: 'عناية وترطيب' },
  'Shampoing': { fr: 'Shampoing', ar: 'شامبو وبلسم' },
  'All': { fr: 'Tout', ar: 'الكل' }
};

export const TRANSLATIONS = {
  fr: {
    home: 'Accueil',
    boutique: 'Boutique',
    renaissance: 'La Marque',
    contact: 'Contact',
    cart: 'Panier',
    search: 'Rechercher...',
    addToCart: 'Ajouter au panier',
    outOfStock: 'Rupture',
    selectOption: 'Choisir une option',
    description: 'En détail',
    relatedProducts: 'Complétez votre routine',
    featured: 'Nos coups de cœur',
    heroTitle: 'L\'Excellence des Soins Brésiliens',
    heroSubtitle: 'Ribeiro\'s Liss : Résultats impeccables dès la première application.',
    discover: 'Découvrir la gamme',
    checkout: 'Paiement sécurisé',
    total: 'Total',
    subtotal: 'Sous-total',
    shipping: 'Livraison',
    free: 'Offerte',
    placeOrder: 'Valider ma commande',
    customerInfo: 'Vos coordonnées',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    address: 'Adresse complète',
    phone: 'Téléphone',
    orderConfirmation: 'Commande confirmée !',
    orderId: 'Réf. commande',
    backToShop: 'Retour au shop',
    admin: 'Admin',
    adminDashboard: 'Dashboard',
    orders: 'Commandes',
    products: 'Catalogue',
    messages: 'Inbox',
    reviews: 'Avis Photo',
    status: 'État',
    actions: 'Actions',
    login: 'Login',
    testimonials: 'Elles l\'ont adopté',
    faq: 'Questions Fréquentes',
    submit: 'Envoyer le message',
    subject: 'Objet',
    message: 'Votre message',
    contactSuccess: 'Message envoyé !',
    copyright: '© 2024 WAHIBASHOP. Tous droits réservés.',
    topBar: '✨ Envois rapides dans toute l\'Europe et à l\'International 🌍',
    orderWhatsApp: 'Commander via WhatsApp',
    settings: 'Slider Images',
    new: 'Nouveau',
    view: 'Voir',
    print: 'Imprimer',
    addReview: 'Ajouter un résultat',
    handle: 'Nom / Instagram',
    tag: 'Tag / Hashtag',
    adjustImage: 'Ajuster l\'image',
    dragToAdjust: 'Faites glisser pour ajuster le cadrage',
    save: 'Enregistrer',
    cancel: 'Annuler',
    adminLogin: 'Connexion Admin',
    password: 'Mot de passe',
    enter: 'Entrer',
    logout: 'Déconnexion',
    wrongPassword: 'Mot de passe incorrect',
  },
  ar: {
    home: 'الرئيسية',
    boutique: 'المتجر',
    renaissance: 'قصتنا',
    contact: 'تواصل معنا',
    cart: 'حقيبة التسوق',
    search: 'بحث...',
    addToCart: 'إضافة إلى الحقيبة',
    outOfStock: 'نفذت الكمية',
    selectOption: 'تحديد الخيار',
    description: 'التفاصيل',
    relatedProducts: 'أكملي روتين العناية',
    featured: 'مختاراتنا المميزة',
    heroTitle: 'فخامة العناية البرازيلية',
    heroSubtitle: 'ريبيرو ليس: نتائج مبهرة وملمس حريري من الاستخدام الأول.',
    discover: 'اكتشفي المجموعة',
    checkout: 'إتمام الشراء',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    free: 'مجاني',
    placeOrder: 'تأكيد الطلب',
    customerInfo: 'بيانات العميل',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    address: 'العنوان الكامل',
    phone: 'رقم الهاتف',
    orderConfirmation: 'تم استلام طلبك بنجاح!',
    orderId: 'رقم الطلب',
    backToShop: 'متابعة التسوق',
    admin: 'الإدارة',
    adminDashboard: 'لوحة التحكم',
    orders: 'الطلبات',
    products: 'المنتجات',
    messages: 'الرسائل',
    reviews: 'صور العملاء',
    status: 'الحالة',
    actions: 'إجراءات',
    login: 'تسجيل الدخول',
    testimonials: 'آراء عميلاتنا',
    faq: 'الأسئلة الشائعة',
    submit: 'إرسال',
    subject: 'الموضوع',
    message: 'نص الرسالة',
    contactSuccess: 'تم الإرسال بنجاح!',
    copyright: '© 2024 WAHIBASHOP. جميع الحقوق محفوظة.',
    topBar: '✨ شحن سريع ومضمون لكافة أنحاء أوروبا والعالم 🌍',
    orderWhatsApp: 'الطلب عبر واتساب',
    settings: 'صور العرض',
    new: 'جديد',
    view: 'عرض',
    print: 'طباعة',
    addReview: 'إضافة نتيجة',
    handle: 'الاسم / انستغرام',
    tag: 'هاشتاغ',
    adjustImage: 'تعديل الصورة',
    dragToAdjust: 'اسحب لضبط التمركز',
    save: 'حفظ',
    cancel: 'إلغاء',
    adminLogin: 'دخول الإدارة',
    password: 'كلمة المرور',
    enter: 'دخول',
    logout: 'خروج',
    wrongPassword: 'كلمة المرور غير صحيحة',
  }
};