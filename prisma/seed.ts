import {
  PrismaClient,
  ProjectStatus,
  MessageStatus,
  QuoteRequestStatus,
  Role,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IDS = {
  company: "seed_company_profile_001",
  clients: [
    "seed_client_001",
    "seed_client_002",
    "seed_client_003",
    "seed_client_004",
    "seed_client_005",
    "seed_client_006",
    "seed_client_007",
    "seed_client_008",
  ],
  statistics: [
    "seed_stat_001",
    "seed_stat_002",
    "seed_stat_003",
    "seed_stat_004",
    "seed_stat_005",
    "seed_stat_006",
  ],
  team: [
    "seed_team_001",
    "seed_team_002",
    "seed_team_003",
    "seed_team_004",
  ],
  milestones: [
    "seed_milestone_001",
    "seed_milestone_002",
    "seed_milestone_003",
    "seed_milestone_004",
    "seed_milestone_005",
  ],
  messages: ["seed_message_001", "seed_message_002"],
  quoteRequests: [
    "seed_quote_001",
    "seed_quote_002",
    "seed_quote_003",
  ],
  media: "seed_media_001",
  auditLog: "seed_audit_login_001",
} as const;

/** Demo media — avoid broken third-party hotlinks; prefer placehold CMS placeholders. */
const DEMO_MEDIA = {
  hero: "https://placehold.co/1600x900/12161A/C9A227?text=Northern+Meteor",
  covers: [
    "https://placehold.co/1200x800/12161A/C9A227?text=Project+01",
    "https://placehold.co/1200x800/1A1F24/C9A227?text=Project+02",
    "https://placehold.co/1200x800/12161A/C9A227?text=Project+03",
    "https://placehold.co/1200x800/1A1F24/C9A227?text=Project+04",
    "https://placehold.co/1200x800/12161A/C9A227?text=Project+05",
    "https://placehold.co/1200x800/1A1F24/C9A227?text=Project+06",
    "https://placehold.co/1200x800/12161A/C9A227?text=Project+07",
    "https://placehold.co/1200x800/1A1F24/C9A227?text=Project+08",
  ],
  gallery: [
    "https://placehold.co/1000x750/12161A/C9A227?text=Gallery+01",
    "https://placehold.co/1000x750/1A1F24/C9A227?text=Gallery+02",
    "https://placehold.co/1000x750/12161A/C9A227?text=Gallery+03",
    "https://placehold.co/1000x750/1A1F24/C9A227?text=Gallery+04",
    "https://placehold.co/1000x750/12161A/C9A227?text=Gallery+05",
    "https://placehold.co/1000x750/1A1F24/C9A227?text=Gallery+06",
  ],
} as const;

async function seedUsers() {
  const rounds = 12;
  const users = [
    {
      email: "admin@northernmeteor.com",
      name: "System Admin",
      role: Role.ADMIN,
      password: "Admin@12345!",
    },
    {
      email: "editor@northernmeteor.com",
      name: "Content Editor",
      role: Role.EDITOR,
      password: "Editor@12345!",
    },
  ];

  const results = [];
  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, rounds);
    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        passwordHash,
        active: true,
      },
      create: {
        email: user.email,
        name: user.name,
        role: user.role,
        passwordHash,
        active: true,
      },
    });
    results.push(record);
  }
  return results;
}

async function seedCompanyProfile() {
  const data = {
    nameAr: "النيزك الشمالي للمقاولات العامة والتجارة",
    nameEn: "Northern Meteor for General Contracting & Trading",
    shortNameAr: "النيزك الشمالي",
    shortNameEn: "Northern Meteor",
    shortDescriptionAr:
      "شركة متخصصة في تنفيذ مشاريع المقاولات والبناء والتصميم، وتقديم حلول متكاملة للمشاريع السكنية والتجارية والصناعية.",
    shortDescriptionEn:
      "A construction company specializing in contracting, building, design, and integrated solutions for residential, commercial, and industrial projects.",
    aboutAr:
      "النيزك الشمالي للمقاولات العامة والتجارة شركة متخصصة في تنفيذ مشاريع المقاولات والبناء والتصميم، وتقديم حلول متكاملة تلبي احتياجات المشاريع السكنية والتجارية والصناعية. نعمل وفق منهج يجمع بين الجودة في التنفيذ، الدقة في التخطيط، الالتزام بالمواعيد، والسلامة، مع التركيز على تقديم حلول عملية وموثوقة من مرحلة التصميم والتخطيط وحتى التنفيذ والتسليم.",
    aboutEn:
      "Northern Meteor for General Contracting & Trading is a construction company specializing in contracting, building, design, and integrated project solutions for residential, commercial, and industrial developments. We combine quality execution, precise planning, commitment to schedules, and safety to deliver practical and reliable solutions from design and planning through construction and final handover.",
    visionAr: "",
    visionEn: "",
    missionAr: "",
    missionEn: "",
    valuesAr:
      "الجودة في التنفيذ، الدقة في التخطيط، الالتزام بالمواعيد، والسلامة.",
    valuesEn:
      "Quality execution, precise planning, commitment to schedules, and safety.",
    experienceAr: null,
    experienceEn: null,
    capabilitiesAr:
      "المقاولات العامة، البناء، التصميم الهندسي والمعماري، المشاريع السكنية والتجارية والصناعية، التأهيل والتشطيب، وإدارة وتنفيذ المشاريع.",
    capabilitiesEn:
      "General contracting, building construction, architectural and engineering design, residential, commercial and industrial construction, renovation and finishing, and construction / project execution management.",
    safetyAr:
      "السلامة جزء أساسي من منهج التنفيذ في كل مراحل العمل.",
    safetyEn:
      "Safety is a core part of our delivery approach across project stages.",
    qualityAr:
      "نركز على الجودة في التنفيذ والدقة في التخطيط لضمان حلول عملية وموثوقة.",
    qualityEn:
      "We focus on quality execution and precise planning to deliver practical, reliable solutions.",
    whyUsAr:
      "منهج يجمع بين الجودة والدقة والالتزام بالمواعيد والسلامة من التصميم حتى التسليم.",
    whyUsEn:
      "An approach that combines quality, precision, schedule commitment, and safety from design through handover.",
    processAr:
      "التصميم والتخطيط ← التنفيذ ← التسليم، مع متابعة الجودة والسلامة.",
    processEn:
      "Design and planning → execution → handover, with ongoing quality and safety oversight.",
    phone: "+964 750 231 1521",
    email: null,
    addressAr: "العراق – أربيل – أبراج العدالة – F.-22 – رقم 14",
    addressEn: "Iraq – Erbil – Justice Towers – F.-22 No.14",
    latitude: 36.18181364663723,
    longitude: 43.97890180239019,
    logoUrl: "/images/logo-northern-meteor.png",
    faviconUrl: "/images/favicon-northern-meteor.png",
    linkedinUrl: null,
    facebookUrl: null,
    instagramUrl: null,
    youtubeUrl: null,
    heroImageUrl: "/images/hero-architecture.png",
  };

  return prisma.companyProfile.upsert({
    where: { id: IDS.company },
    update: data,
    create: { id: IDS.company, ...data },
  });
}

async function seedSiteSettings() {
  const settings: { key: string; value: string }[] = [
    { key: "defaultLocale", value: "ar" },
    { key: "maintenanceMode", value: "false" },
    {
      key: "seoDefaultTitleAr",
      value: "النيزك الشمالي | مقاولات عامة وتجارة",
    },
    {
      key: "seoDefaultTitleEn",
      value: "Northern Meteor | General Contracting & Trading",
    },
    {
      key: "seoDefaultDescriptionAr",
      value:
        "النيزك الشمالي للمقاولات العامة والتجارة — مقاولات وبناء وتصميم وحلول متكاملة للمشاريع السكنية والتجارية والصناعية في أربيل، العراق.",
    },
    {
      key: "seoDefaultDescriptionEn",
      value:
        "Northern Meteor for General Contracting & Trading — contracting, building, design, and integrated solutions for residential, commercial, and industrial projects in Erbil, Iraq.",
    },
    {
      key: "ogImageUrl",
      value: "/images/logo-northern-meteor.png",
    },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
}

async function seedStatistics() {
  const stats = [
    {
      id: IDS.statistics[0],
      labelAr: "سنوات خبرة (تجريبي)",
      labelEn: "Years of Experience (Demo)",
      value: "15+",
      sortOrder: 1,
    },
    {
      id: IDS.statistics[1],
      labelAr: "مشروع منجز (عينة)",
      labelEn: "Completed Projects (Sample)",
      value: "320+",
      sortOrder: 2,
    },
    {
      id: IDS.statistics[2],
      labelAr: "عميل وشريك (تجريبي)",
      labelEn: "Clients & Partners (Demo)",
      value: "85+",
      sortOrder: 3,
    },
    {
      id: IDS.statistics[3],
      labelAr: "مهندس وفني (عينة)",
      labelEn: "Engineers & Technicians (Sample)",
      value: "140+",
      sortOrder: 4,
    },
    {
      id: IDS.statistics[4],
      labelAr: "مدينة تغطية (تجريبي)",
      labelEn: "Cities Covered (Demo)",
      value: "12+",
      sortOrder: 5,
    },
    {
      id: IDS.statistics[5],
      labelAr: "ساعة تدريب سلامة (عينة)",
      labelEn: "Safety Training Hours (Sample)",
      value: "10,000+",
      sortOrder: 6,
    },
  ];

  for (const stat of stats) {
    await prisma.statistic.upsert({
      where: { id: stat.id },
      update: {
        labelAr: stat.labelAr,
        labelEn: stat.labelEn,
        value: stat.value,
        sortOrder: stat.sortOrder,
        published: false,
        archivedAt: null,
      },
      create: {
        ...stat,
        published: false,
      },
    });
  }
}

async function seedProjectCategories() {
  const categories = [
    {
      slug: "commercial",
      nameAr: "تجاري",
      nameEn: "Commercial",
      descriptionAr: "فئة تجريبية للمشاريع التجارية والمباني المكتبية.",
      descriptionEn: "Sample category for commercial and office building projects.",
      sortOrder: 1,
    },
    {
      slug: "civil",
      nameAr: "مدني",
      nameEn: "Civil",
      descriptionAr: "فئة تجريبية لأعمال الإنشاءات المدنية.",
      descriptionEn: "Sample category for civil construction works.",
      sortOrder: 2,
    },
    {
      slug: "infrastructure",
      nameAr: "بنية تحتية",
      nameEn: "Infrastructure",
      descriptionAr: "فئة تجريبية لمشاريع البنية التحتية.",
      descriptionEn: "Sample category for infrastructure projects.",
      sortOrder: 3,
    },
    {
      slug: "industrial",
      nameAr: "صناعي",
      nameEn: "Industrial",
      descriptionAr: "فئة تجريبية للمنشآت والمرافق الصناعية.",
      descriptionEn: "Sample category for industrial facilities.",
      sortOrder: 4,
    },
    {
      slug: "roads",
      nameAr: "طرق",
      nameEn: "Roads",
      descriptionAr: "فئة تجريبية لمشاريع الطرق والنقل.",
      descriptionEn: "Sample category for roads and transportation projects.",
      sortOrder: 5,
    },
  ];

  const map = new Map<string, string>();
  for (const category of categories) {
    const record = await prisma.projectCategory.upsert({
      where: { slug: category.slug },
      update: {
        nameAr: category.nameAr,
        nameEn: category.nameEn,
        descriptionAr: category.descriptionAr,
        descriptionEn: category.descriptionEn,
        sortOrder: category.sortOrder,
        published: true,
        archivedAt: null,
      },
      create: {
        ...category,
        published: true,
      },
    });
    map.set(category.slug, record.id);
  }
  return map;
}

async function seedClients() {
  const clients = [
    {
      id: IDS.clients[0],
      name: "Demo Partner Alpha",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client1",
      websiteUrl: "https://example.com/client1",
      sortOrder: 1,
    },
    {
      id: IDS.clients[1],
      name: "Demo Partner Beta",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client2",
      websiteUrl: "https://example.com/client2",
      sortOrder: 2,
    },
    {
      id: IDS.clients[2],
      name: "Sample Client Gamma",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client3",
      websiteUrl: "https://example.com/client3",
      sortOrder: 3,
    },
    {
      id: IDS.clients[3],
      name: "Sample Client Delta",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client4",
      websiteUrl: "https://example.com/client4",
      sortOrder: 4,
    },
    {
      id: IDS.clients[4],
      name: "Demo Partner Epsilon",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client5",
      websiteUrl: "https://example.com/client5",
      sortOrder: 5,
    },
    {
      id: IDS.clients[5],
      name: "Sample Client Zeta",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client6",
      websiteUrl: "https://example.com/client6",
      sortOrder: 6,
    },
    {
      id: IDS.clients[6],
      name: "Demo Partner Eta",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client7",
      websiteUrl: "https://example.com/client7",
      sortOrder: 7,
    },
    {
      id: IDS.clients[7],
      name: "Sample Client Theta",
      logoUrl: "https://placehold.co/200x80/12161A/C9A227?text=Client8",
      websiteUrl: "https://example.com/client8",
      sortOrder: 8,
    },
  ];

  const map = new Map<string, string>();
  for (const client of clients) {
    const record = await prisma.client.upsert({
      where: { id: client.id },
      update: {
        name: client.name,
        logoUrl: client.logoUrl,
        websiteUrl: client.websiteUrl,
        descriptionAr: "شريك تجريبي لأغراض العرض والتطوير — غير منشور.",
        descriptionEn: "Sample partner for demo purposes — unpublished.",
        sortOrder: client.sortOrder,
        published: false,
        archivedAt: null,
      },
      create: {
        id: client.id,
        name: client.name,
        logoUrl: client.logoUrl,
        websiteUrl: client.websiteUrl,
        descriptionAr: "شريك تجريبي لأغراض العرض والتطوير — غير منشور.",
        descriptionEn: "Sample partner for demo purposes — unpublished.",
        sortOrder: client.sortOrder,
        published: false,
      },
    });
    map.set(client.id, record.id);
  }
  return map;
}

async function seedServices() {
  const services = [
    {
      slug: "general-contracting",
      nameAr: "المقاولات العامة",
      nameEn: "General Contracting",
      descriptionAr:
        "تنفيذ وإدارة أعمال المقاولات العامة للمشاريع السكنية والتجارية والصناعية وفق منهج يجمع الجودة والتخطيط والسلامة.",
      descriptionEn:
        "Delivery and management of general contracting works for residential, commercial, and industrial projects with quality, planning, and safety at the core.",
      icon: "Building2",
      sortOrder: 1,
    },
    {
      slug: "building-construction",
      nameAr: "أعمال البناء والتشييد",
      nameEn: "Building Construction",
      descriptionAr:
        "أعمال البناء والتشييد من مراحل التنفيذ الإنشائي حتى استكمال الهيكل والتجهيزات الأساسية للمشروع.",
      descriptionEn:
        "Building and construction works from structural execution through core building completion for project delivery.",
      icon: "HardHat",
      sortOrder: 2,
    },
    {
      slug: "architectural-design",
      nameAr: "التصميم المعماري",
      nameEn: "Architectural Design",
      descriptionAr:
        "خدمات التصميم المعماري التي تترجم احتياجات المشروع إلى حلول عملية قابلة للتنفيذ.",
      descriptionEn:
        "Architectural design services that translate project needs into practical, buildable solutions.",
      icon: "PencilRuler",
      sortOrder: 3,
    },
    {
      slug: "engineering-technical-design",
      nameAr: "التصميم الهندسي والفني",
      nameEn: "Engineering & Technical Design",
      descriptionAr:
        "تصميم هندسي وفني يدعم التخطيط الدقيق والتنفيذ الموثوق عبر مراحل المشروع.",
      descriptionEn:
        "Engineering and technical design that supports precise planning and reliable execution across project stages.",
      icon: "DraftingCompass",
      sortOrder: 4,
    },
    {
      slug: "residential-construction",
      nameAr: "الإنشاءات السكنية",
      nameEn: "Residential Construction",
      descriptionAr:
        "حلول إنشائية للمشاريع السكنية مع التركيز على الجودة والالتزام بالمواعيد.",
      descriptionEn:
        "Construction solutions for residential developments with a focus on quality and schedule commitment.",
      icon: "Home",
      sortOrder: 5,
    },
    {
      slug: "commercial-construction",
      nameAr: "الإنشاءات التجارية",
      nameEn: "Commercial Construction",
      descriptionAr:
        "تنفيذ المشاريع التجارية بما يلبي متطلبات الاستخدام والتشغيل والكفاءة.",
      descriptionEn:
        "Delivery of commercial construction projects aligned with use, operations, and efficiency requirements.",
      icon: "Building",
      sortOrder: 6,
    },
    {
      slug: "industrial-construction",
      nameAr: "الإنشاءات الصناعية",
      nameEn: "Industrial Construction",
      descriptionAr:
        "أعمال إنشائية للمنشآت والمشاريع الصناعية وفق متطلبات السلامة والتنفيذ العملي.",
      descriptionEn:
        "Construction works for industrial facilities and projects with practical execution and safety requirements.",
      icon: "Factory",
      sortOrder: 7,
    },
    {
      slug: "renovation-rehabilitation",
      nameAr: "التأهيل وإعادة التأهيل",
      nameEn: "Renovation & Rehabilitation",
      descriptionAr:
        "تأهيل وإعادة تأهيل المباني والمنشآت القائمة لتحسين الأداء والاستخدام.",
      descriptionEn:
        "Renovation and rehabilitation of existing buildings and facilities to improve performance and use.",
      icon: "Hammer",
      sortOrder: 8,
    },
    {
      slug: "interior-finishing-works",
      nameAr: "أعمال الداخلية والتشطيبات",
      nameEn: "Interior & Finishing Works",
      descriptionAr:
        "أعمال التشطيبات والداخلية التي تكمل مرحلة التنفيذ وتجهّز المشروع للتسليم.",
      descriptionEn:
        "Interior and finishing works that complete execution and prepare projects for handover.",
      icon: "Paintbrush",
      sortOrder: 9,
    },
    {
      slug: "construction-management",
      nameAr: "إدارة الإنشاءات",
      nameEn: "Construction Management",
      descriptionAr:
        "إدارة عمليات الإنشاء والتنسيق الميداني لضمان سير العمل بجودة والتزام بالجداول.",
      descriptionEn:
        "Construction management and field coordination to keep delivery on quality and schedule.",
      icon: "ClipboardList",
      sortOrder: 10,
    },
    {
      slug: "project-execution",
      nameAr: "تنفيذ المشاريع",
      nameEn: "Project Execution",
      descriptionAr:
        "تنفيذ المشاريع من التخطيط إلى التسليم مع متابعة الجودة والسلامة في الموقع.",
      descriptionEn:
        "Project execution from planning through handover with ongoing quality and site safety oversight.",
      icon: "Workflow",
      sortOrder: 11,
    },
    {
      slug: "related-construction-development",
      nameAr: "خدمات إنشائية وتطويرية ذات صلة",
      nameEn: "Related Construction & Development Services",
      descriptionAr:
        "خدمات إنشائية وتطويرية مساندة تتكامل مع أعمال المقاولات والبناء والتصميم.",
      descriptionEn:
        "Related construction and development services that complement contracting, building, and design delivery.",
      icon: "Layers",
      sortOrder: 12,
    },
  ];

  const realSlugs = services.map((service) => service.slug);

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        nameAr: service.nameAr,
        nameEn: service.nameEn,
        descriptionAr: service.descriptionAr,
        descriptionEn: service.descriptionEn,
        icon: service.icon,
        sortOrder: service.sortOrder,
        published: true,
        isDemo: false,
        archivedAt: null,
      },
      create: {
        ...service,
        published: true,
        isDemo: false,
      },
    });
  }

  await prisma.service.updateMany({
    where: { slug: { notIn: realSlugs } },
    data: { published: false, isDemo: true },
  });
}

async function seedProjects(
  categoryIds: Map<string, string>,
  clientIds: readonly string[],
) {
  const projects: {
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr: string;
    summaryEn: string;
    descriptionAr: string;
    descriptionEn: string;
    locationAr: string;
    locationEn: string;
    coverImageUrl: string;
    categorySlug: string;
    clientIndex: number;
    status: ProjectStatus;
    featured: boolean;
    startDate: Date;
    completionDate?: Date;
    scopeAr: string;
    scopeEn: string;
    images: { url: string; altAr: string; altEn: string }[];
  }[] = [
    {
      slug: "sample-commercial-tower-demo",
      titleAr: "برج تجاري تجريبي — عرض",
      titleEn: "Sample Commercial Tower — Demo",
      summaryAr: "مشروع تجريبي لبرج مكاتب متعدد الاستخدامات — ليس مشروعاً حقيقياً.",
      summaryEn:
        "Sample mixed-use office tower project for demo purposes — not a real Northern Meteor project.",
      descriptionAr:
        "وصف تجريبي لبرج تجاري يوضح كيفية عرض تفاصيل المشروع في الموقع. جميع البيانات هنا لأغراض العرض والتطوير فقط.",
      descriptionEn:
        "Sample commercial tower description showing how project details appear on the site. All data here is for demo and development only.",
      locationAr: "الرياض (موقع تجريبي)",
      locationEn: "Riyadh (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[0],
      categorySlug: "commercial",
      clientIndex: 0,
      status: ProjectStatus.COMPLETED,
      featured: true,
      startDate: new Date("2022-03-01"),
      completionDate: new Date("2024-11-15"),
      scopeAr: "هيكل خرساني، واجهات، تشطيبات داخلية — نطاق تجريبي.",
      scopeEn: "Concrete structure, facade, interior finishes — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[0],
          altAr: "صورة موقع تجريبية ١",
          altEn: "Sample site photo 1",
        },
        {
          url: DEMO_MEDIA.gallery[1],
          altAr: "صورة موقع تجريبية ٢",
          altEn: "Sample site photo 2",
        },
        {
          url: DEMO_MEDIA.gallery[2],
          altAr: "صورة موقع تجريبية ٣",
          altEn: "Sample site photo 3",
        },
      ],
    },
    {
      slug: "demo-civil-complex",
      titleAr: "مجمع مدني تجريبي — عينة",
      titleEn: "Demo Civil Complex — Sample",
      summaryAr: "مجمع مدني تجريبي لعرض حالة التنفيذ الجاري.",
      summaryEn: "Demo civil complex used to showcase an in-progress status.",
      descriptionAr:
        "محتوى عينة لمجمع مدني يشمل أعمال أساسات وهياكل. هذا المشروع افتراضي ولا يمثل عملاً منفذاً فعلياً.",
      descriptionEn:
        "Sample civil complex content covering foundations and structures. This project is fictional and does not represent completed real work.",
      locationAr: "جدة (موقع تجريبي)",
      locationEn: "Jeddah (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[1],
      categorySlug: "civil",
      clientIndex: 1,
      status: ProjectStatus.IN_PROGRESS,
      featured: true,
      startDate: new Date("2024-06-01"),
      scopeAr: "أساسات، هيكل، أعمال ترابية — نطاق تجريبي.",
      scopeEn: "Foundations, structure, earthworks — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[1],
          altAr: "أعمال مدنية تجريبية",
          altEn: "Sample civil works",
        },
        {
          url: DEMO_MEDIA.gallery[3],
          altAr: "مرحلة تنفيذ تجريبية",
          altEn: "Sample construction phase",
        },
      ],
    },
    {
      slug: "sample-infrastructure-corridor",
      titleAr: "ممر بنية تحتية تجريبي — عرض",
      titleEn: "Sample Infrastructure Corridor — Demo",
      summaryAr: "مشروع بنية تحتية تجريبي يوضح شبكات الخدمات.",
      summaryEn: "Sample infrastructure corridor demonstrating utility networks.",
      descriptionAr:
        "وصف تجريبي لممر بنية تحتية يشمل شبكات المياه والصرف. البيانات للعرض فقط.",
      descriptionEn:
        "Demo infrastructure corridor description including water and drainage networks. Display-only sample data.",
      locationAr: "الدمام (موقع تجريبي)",
      locationEn: "Dammam (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[2],
      categorySlug: "infrastructure",
      clientIndex: 2,
      status: ProjectStatus.COMPLETED,
      featured: true,
      startDate: new Date("2021-01-10"),
      completionDate: new Date("2023-08-20"),
      scopeAr: "شبكات، غرف تفتيش، رصف داخلي — نطاق عينة.",
      scopeEn: "Networks, manholes, internal paving — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[2],
          altAr: "بنية تحتية تجريبية",
          altEn: "Sample infrastructure",
        },
        {
          url: DEMO_MEDIA.gallery[4],
          altAr: "أعمال شبكات تجريبية",
          altEn: "Sample utility works",
        },
        {
          url: DEMO_MEDIA.gallery[5],
          altAr: "تسليم تجريبي",
          altEn: "Sample handover view",
        },
      ],
    },
    {
      slug: "demo-industrial-warehouse",
      titleAr: "مستودع صناعي تجريبي — عينة",
      titleEn: "Demo Industrial Warehouse — Sample",
      summaryAr: "مستودع صناعي تجريبي بحالة مخطط.",
      summaryEn: "Demo industrial warehouse in planned status.",
      descriptionAr:
        "مشروع عينة لمنشأة صناعية/مستودع. لا يمثل مشروعاً حقيقياً لشركة النيزك الشمالي.",
      descriptionEn:
        "Sample industrial warehouse facility. Not a real Northern Meteor Construction project.",
      locationAr: "ينبع (موقع تجريبي)",
      locationEn: "Yanbu (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[3],
      categorySlug: "industrial",
      clientIndex: 3,
      status: ProjectStatus.PLANNED,
      featured: false,
      startDate: new Date("2026-02-01"),
      scopeAr: "هيكل معدني، أرضيات صناعية، خدمات أساسية — نطاق تجريبي.",
      scopeEn: "Steel structure, industrial flooring, basic services — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[3],
          altAr: "منشأة صناعية تجريبية",
          altEn: "Sample industrial facility",
        },
        {
          url: DEMO_MEDIA.gallery[0],
          altAr: "مخطط موقع تجريبي",
          altEn: "Sample site layout",
        },
      ],
    },
    {
      slug: "sample-highway-link-demo",
      titleAr: "وصلة طريق تجريبية — عرض",
      titleEn: "Sample Highway Link — Demo",
      summaryAr: "مشروع طرق تجريبي بحالة متوقفة مؤقتاً.",
      summaryEn: "Sample roads project currently on hold for demo.",
      descriptionAr:
        "محتوى تجريبي لوصلة طريق يوضح حالة ON_HOLD في لوحة التحكم والموقع العام.",
      descriptionEn:
        "Sample highway link content used to demonstrate ON_HOLD status in admin and public views.",
      locationAr: "القصيم (موقع تجريبي)",
      locationEn: "Qassim (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[4],
      categorySlug: "roads",
      clientIndex: 4,
      status: ProjectStatus.ON_HOLD,
      featured: false,
      startDate: new Date("2023-09-01"),
      scopeAr: "رصف، تصريف، لوحات إرشادية — نطاق عينة.",
      scopeEn: "Paving, drainage, wayfinding — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[4],
          altAr: "طريق تجريبي",
          altEn: "Sample roadway",
        },
        {
          url: DEMO_MEDIA.gallery[1],
          altAr: "أعمال رصف تجريبية",
          altEn: "Sample paving works",
        },
      ],
    },
    {
      slug: "demo-retail-plaza",
      titleAr: "ساحة تجارية تجريبية — عينة",
      titleEn: "Demo Retail Plaza — Sample",
      summaryAr: "ساحة تجارية تجريبية مكتملة للعرض في قسم المشاريع المميزة.",
      summaryEn: "Completed demo retail plaza for featured project listings.",
      descriptionAr:
        "مشروع تجريبي لساحة تجارية متعددة المحلات. جميع الصور والنصوص عينة.",
      descriptionEn:
        "Sample multi-unit retail plaza project. All images and copy are placeholders.",
      locationAr: "الخبر (موقع تجريبي)",
      locationEn: "Khobar (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[5],
      categorySlug: "commercial",
      clientIndex: 5,
      status: ProjectStatus.COMPLETED,
      featured: true,
      startDate: new Date("2020-05-01"),
      completionDate: new Date("2022-12-01"),
      scopeAr: "هيكل، تشطيبات، مواقف — نطاق تجريبي.",
      scopeEn: "Structure, finishes, parking — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[5],
          altAr: "ساحة تجارية تجريبية",
          altEn: "Sample retail plaza",
        },
        {
          url: DEMO_MEDIA.gallery[2],
          altAr: "واجهة تجريبية",
          altEn: "Sample facade",
        },
        {
          url: DEMO_MEDIA.gallery[0],
          altAr: "مساحة داخلية تجريبية",
          altEn: "Sample interior space",
        },
      ],
    },
    {
      slug: "sample-utility-upgrade-demo",
      titleAr: "تحديث مرافق تجريبي — عرض",
      titleEn: "Sample Utility Upgrade — Demo",
      summaryAr: "تحديث مرافق تجريبي قيد التنفيذ.",
      summaryEn: "Sample utility upgrade currently in progress.",
      descriptionAr:
        "وصف عينة لأعمال تحديث مرافق وبنية تحتية قائمة. للاستخدام التجريبي فقط.",
      descriptionEn:
        "Sample description for upgrading existing utilities and infrastructure. Demo use only.",
      locationAr: "الطائف (موقع تجريبي)",
      locationEn: "Taif (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[6],
      categorySlug: "infrastructure",
      clientIndex: 6,
      status: ProjectStatus.IN_PROGRESS,
      featured: false,
      startDate: new Date("2025-01-15"),
      scopeAr: "استبدال شبكات، إعادة تأهيل — نطاق تجريبي.",
      scopeEn: "Network replacement, rehabilitation — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[0],
          altAr: "تحديث مرافق تجريبي",
          altEn: "Sample utility upgrade",
        },
        {
          url: DEMO_MEDIA.gallery[3],
          altAr: "أعمال حفر تجريبية",
          altEn: "Sample excavation works",
        },
      ],
    },
    {
      slug: "demo-community-center",
      titleAr: "مركز مجتمعي تجريبي — عينة",
      titleEn: "Demo Community Center — Sample",
      summaryAr: "مركز مجتمعي تجريبي مخطط للعرض في حالة PLANNED.",
      summaryEn: "Demo community center planned for PLANNED status display.",
      descriptionAr:
        "مشروع عينة لمركز مجتمعي مدني. العناوين والملخصات توضح أنه محتوى تجريبي.",
      descriptionEn:
        "Sample civil community center project. Titles and summaries clearly mark this as demo content.",
      locationAr: "أبها (موقع تجريبي)",
      locationEn: "Abha (Sample Location)",
      coverImageUrl: DEMO_MEDIA.covers[7],
      categorySlug: "civil",
      clientIndex: 7,
      status: ProjectStatus.PLANNED,
      featured: false,
      startDate: new Date("2026-06-01"),
      scopeAr: "مبنى رئيسي، مواقف، تنسيق موقع — نطاق عينة.",
      scopeEn: "Main building, parking, softscape — sample scope.",
      images: [
        {
          url: DEMO_MEDIA.gallery[1],
          altAr: "مركز مجتمعي تجريبي",
          altEn: "Sample community center",
        },
        {
          url: DEMO_MEDIA.gallery[4],
          altAr: "تصور موقع تجريبي",
          altEn: "Sample site concept",
        },
      ],
    },
  ];

  for (const project of projects) {
    const categoryId = categoryIds.get(project.categorySlug);
    const clientId = clientIds[project.clientIndex];

    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        titleAr: project.titleAr,
        titleEn: project.titleEn,
        summaryAr: project.summaryAr,
        summaryEn: project.summaryEn,
        descriptionAr: project.descriptionAr,
        descriptionEn: project.descriptionEn,
        locationAr: project.locationAr,
        locationEn: project.locationEn,
        coverImageUrl: project.coverImageUrl,
        clientId,
        categoryId,
        status: project.status,
        startDate: project.startDate,
        completionDate: project.completionDate ?? null,
        featured: false,
        published: false,
        isDemo: true,
        scopeAr: project.scopeAr,
        scopeEn: project.scopeEn,
        seoTitleAr: `${project.titleAr} | عينة`,
        seoTitleEn: `${project.titleEn} | Sample`,
        seoDescriptionAr: project.summaryAr,
        seoDescriptionEn: project.summaryEn,
        archivedAt: null,
      },
      create: {
        slug: project.slug,
        titleAr: project.titleAr,
        titleEn: project.titleEn,
        summaryAr: project.summaryAr,
        summaryEn: project.summaryEn,
        descriptionAr: project.descriptionAr,
        descriptionEn: project.descriptionEn,
        locationAr: project.locationAr,
        locationEn: project.locationEn,
        coverImageUrl: project.coverImageUrl,
        clientId,
        categoryId,
        status: project.status,
        startDate: project.startDate,
        completionDate: project.completionDate,
        featured: false,
        published: false,
        isDemo: true,
        scopeAr: project.scopeAr,
        scopeEn: project.scopeEn,
        seoTitleAr: `${project.titleAr} | عينة`,
        seoTitleEn: `${project.titleEn} | Sample`,
        seoDescriptionAr: project.summaryAr,
        seoDescriptionEn: project.summaryEn,
      },
    });

    await prisma.projectImage.deleteMany({ where: { projectId: record.id } });

    await prisma.projectImage.createMany({
      data: project.images.map((image, index) => ({
        projectId: record.id,
        url: image.url,
        altAr: image.altAr,
        altEn: image.altEn,
        sortOrder: index + 1,
      })),
    });
  }
}

async function seedTeamMembers() {
  const members = [
    {
      id: IDS.team[0],
      nameAr: "أحمد العتيبي (تجريبي)",
      nameEn: "Ahmed Al-Otaibi (Demo)",
      positionAr: "مدير عام — دور تجريبي",
      positionEn: "General Manager — Demo Role",
      bioAr: "عضو فريق تجريبي لأغراض عرض صفحة الفريق.",
      bioEn: "Sample team member for demo team page purposes.",
      imageUrl: "https://placehold.co/400x400/12161A/C9A227?text=Team1",
      linkedin: "https://example.com/linkedin/ahmed-alotaibi",
      email: "ahmed.demo@example-northernmeteor.com",
      sortOrder: 1,
    },
    {
      id: IDS.team[1],
      nameAr: "نورة الشمري (تجريبي)",
      nameEn: "Noura Al-Shammari (Demo)",
      positionAr: "مديرة المشاريع — دور تجريبي",
      positionEn: "Projects Director — Demo Role",
      bioAr: "ملف تجريبي لمديرة مشاريع في محتوى العرض.",
      bioEn: "Sample projects director profile used in demo content.",
      imageUrl: "https://placehold.co/400x400/12161A/C9A227?text=Team2",
      linkedin: "https://example.com/linkedin/noura-alshammari",
      email: "noura.demo@example-northernmeteor.com",
      sortOrder: 2,
    },
    {
      id: IDS.team[2],
      nameAr: "خالد الحربي (تجريبي)",
      nameEn: "Khaled Al-Harbi (Demo)",
      positionAr: "مهندس مدني أول — دور تجريبي",
      positionEn: "Senior Civil Engineer — Demo Role",
      bioAr: "عضو عينة يوضح التخصصات الهندسية في الموقع.",
      bioEn: "Sample member illustrating engineering specialties on the site.",
      imageUrl: "https://placehold.co/400x400/12161A/C9A227?text=Team3",
      linkedin: "https://example.com/linkedin/khaled-alharbi",
      email: "khaled.demo@example-northernmeteor.com",
      sortOrder: 3,
    },
    {
      id: IDS.team[3],
      nameAr: "سارة القحطاني (تجريبي)",
      nameEn: "Sara Al-Qahtani (Demo)",
      positionAr: "مسؤولة الجودة والسلامة — دور تجريبي",
      positionEn: "Quality & Safety Lead — Demo Role",
      bioAr: "ملف تجريبي لدور الجودة والسلامة.",
      bioEn: "Sample quality and safety lead profile for the demo.",
      imageUrl: "https://placehold.co/400x400/12161A/C9A227?text=Team4",
      linkedin: "https://example.com/linkedin/sara-alqahtani",
      email: "sara.demo@example-northernmeteor.com",
      sortOrder: 4,
    },
  ];

  for (const member of members) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {
        nameAr: member.nameAr,
        nameEn: member.nameEn,
        positionAr: member.positionAr,
        positionEn: member.positionEn,
        bioAr: member.bioAr,
        bioEn: member.bioEn,
        imageUrl: member.imageUrl,
        linkedin: member.linkedin,
        email: member.email,
        sortOrder: member.sortOrder,
        published: false,
        isDemo: true,
        archivedAt: null,
      },
      create: {
        ...member,
        published: false,
        isDemo: true,
      },
    });
  }
}

async function seedCompanyMilestones() {
  const milestones = [
    {
      id: IDS.milestones[0],
      year: 2010,
      titleAr: "التأسيس",
      titleEn: "Foundation",
      descriptionAr:
        "انطلقت الشركة بتركيز على المقاولات العامة المنضبطة والقيادة المسؤولة للمشاريع — محطة تجريبية.",
      descriptionEn:
        "Established with a focus on disciplined general contracting and accountable project leadership — demo milestone.",
      sortOrder: 1,
    },
    {
      id: IDS.milestones[1],
      year: 2014,
      titleAr: "التوسع القطاعي",
      titleEn: "Sector Growth",
      descriptionAr:
        "توسعت القدرة عبر النطاقات التجارية والمدنية والبنية التحتية بأنظمة ميدانية أقوى — محطة تجريبية.",
      descriptionEn:
        "Expanded delivery across commercial, civil, and infrastructure scopes with stronger field systems — demo milestone.",
      sortOrder: 2,
    },
    {
      id: IDS.milestones[2],
      year: 2018,
      titleAr: "أنظمة التشغيل",
      titleEn: "Operating Systems",
      descriptionAr:
        "ترسيخ ضوابط التخطيط والجودة والسلامة لدعم الأعمال متعددة التخصصات — محطة تجريبية.",
      descriptionEn:
        "Formalized planning, quality, and HSE controls to support complex multi-discipline work — demo milestone.",
      sortOrder: 3,
    },
    {
      id: IDS.milestones[3],
      year: 2022,
      titleAr: "نضج التسليم",
      titleEn: "Delivery Maturity",
      descriptionAr:
        "بناء سمعة في التنسيق الواضح والتقارير الشفافة والتسليم الموثوق — محطة تجريبية.",
      descriptionEn:
        "Built a reputation for clear coordination, transparent reporting, and dependable handover — demo milestone.",
      sortOrder: 4,
    },
    {
      id: IDS.milestones[4],
      year: 2025,
      titleAr: "نظرة للمستقبل",
      titleEn: "Looking Ahead",
      descriptionAr:
        "مواصلة تعزيز القدرات والكفاءات والأساليب لمشاريع الجيل القادم — محطة تجريبية.",
      descriptionEn:
        "Continuing to strengthen capability, talent, and methods for the next generation of projects — demo milestone.",
      sortOrder: 5,
    },
  ];

  for (const milestone of milestones) {
    await prisma.companyMilestone.upsert({
      where: { id: milestone.id },
      update: {
        year: milestone.year,
        titleAr: milestone.titleAr,
        titleEn: milestone.titleEn,
        descriptionAr: milestone.descriptionAr,
        descriptionEn: milestone.descriptionEn,
        sortOrder: milestone.sortOrder,
        published: false,
      },
      create: {
        ...milestone,
        published: false,
      },
    });
  }
}

async function seedContactMessages() {
  const messages = [
    {
      id: IDS.messages[0],
      name: "Demo Inquirer",
      email: "demo.inquirer@example.com",
      phone: "+966 50 000 0001",
      company: "Sample Inquiry Co.",
      subject: "Sample project inquiry (UNREAD)",
      message:
        "This is a sample unread contact message for admin inbox testing. Please ignore — demo data only.",
      status: MessageStatus.UNREAD,
    },
    {
      id: IDS.messages[1],
      name: "Sample Visitor",
      email: "sample.visitor@example.com",
      phone: "+966 50 000 0002",
      company: "Demo Visitor LLC",
      subject: "Sample partnership question (READ)",
      message:
        "This is a sample read contact message used to exercise the READ status in the admin panel. Demo content only.",
      status: MessageStatus.READ,
    },
  ];

  for (const message of messages) {
    await prisma.contactMessage.upsert({
      where: { id: message.id },
      update: {
        name: message.name,
        email: message.email,
        phone: message.phone,
        company: message.company,
        subject: message.subject,
        message: message.message,
        status: message.status,
      },
      create: message,
    });
  }
}

async function seedQuoteRequests() {
  const requests = [
    {
      id: IDS.quoteRequests[0],
      company: "Demo Development Group",
      name: "Sara Al-Harbi",
      email: "sara.demo@example.com",
      phone: "+966 50 100 2001",
      projectType: "Commercial fit-out",
      budget: "SAR 2–4M",
      location: "Riyadh",
      timeline: "Q4 2026",
      message:
        "Sample NEW quote request for a commercial interior package. Demo data only.",
      attachmentUrl: null as string | null,
      status: QuoteRequestStatus.NEW,
      notes: null as string | null,
    },
    {
      id: IDS.quoteRequests[1],
      company: "Sample Infrastructure LLC",
      name: "Omar Demo",
      email: "omar.demo@example.com",
      phone: "+966 50 100 2002",
      projectType: "Civil works",
      budget: "SAR 8–12M",
      location: "Dammam",
      timeline: "2027",
      message:
        "Sample IN_REVIEW quote request used to exercise admin status workflows.",
      attachmentUrl: null,
      status: QuoteRequestStatus.IN_REVIEW,
      notes: "Demo note: awaiting drawings package.",
    },
    {
      id: IDS.quoteRequests[2],
      company: "Archived Demo Co.",
      name: "Lina Sample",
      email: "lina.sample@example.com",
      phone: null,
      projectType: "Maintenance",
      budget: null,
      location: "Jeddah",
      timeline: null,
      message: "Sample ARCHIVED quote request for filter testing.",
      attachmentUrl: null,
      status: QuoteRequestStatus.ARCHIVED,
      notes: "Closed — demo archive.",
    },
  ];

  for (const request of requests) {
    await prisma.quoteRequest.upsert({
      where: { id: request.id },
      update: {
        company: request.company,
        name: request.name,
        email: request.email,
        phone: request.phone,
        projectType: request.projectType,
        budget: request.budget,
        location: request.location,
        timeline: request.timeline,
        message: request.message,
        attachmentUrl: request.attachmentUrl,
        status: request.status,
        notes: request.notes,
      },
      create: request,
    });
  }
}

async function seedMedia() {
  await prisma.media.upsert({
    where: { id: IDS.media },
    update: {
      fileName: "demo-construction-hero.jpg",
      url: DEMO_MEDIA.hero,
      mimeType: "image/jpeg",
      size: 245760,
      altAr: "صورة وسائط تجريبية لموقع إنشائي",
      altEn: "Sample media asset of a construction site",
      archivedAt: null,
    },
    create: {
      id: IDS.media,
      fileName: "demo-construction-hero.jpg",
      url: DEMO_MEDIA.hero,
      mimeType: "image/jpeg",
      size: 245760,
      altAr: "صورة وسائط تجريبية لموقع إنشائي",
      altEn: "Sample media asset of a construction site",
    },
  });
}

async function seedAuditLog(adminUserId: string) {
  await prisma.auditLog.upsert({
    where: { id: IDS.auditLog },
    update: {
      userId: adminUserId,
      action: "LOGIN",
      entity: "User",
      entityId: adminUserId,
      metadata: {
        source: "seed",
        note: "Sample LOGIN audit entry for admin — no credentials stored",
        ip: "127.0.0.1",
        userAgent: "prisma-seed/1.0",
      },
    },
    create: {
      id: IDS.auditLog,
      userId: adminUserId,
      action: "LOGIN",
      entity: "User",
      entityId: adminUserId,
      metadata: {
        source: "seed",
        note: "Sample LOGIN audit entry for admin — no credentials stored",
        ip: "127.0.0.1",
        userAgent: "prisma-seed/1.0",
      },
    },
  });
}

async function main() {
  console.log("Seeding Northern Meteor demo data...");

  const users = await seedUsers();
  console.log(`✓ Users (${users.length})`);

  await seedCompanyProfile();
  console.log("✓ CompanyProfile");

  await seedSiteSettings();
  console.log("✓ SiteSettings");

  await seedStatistics();
  console.log("✓ Statistics (6)");

  const categoryIds = await seedProjectCategories();
  console.log("✓ ProjectCategories (5)");

  const clients = await seedClients();
  console.log(`✓ Clients (${clients.size})`);

  await seedServices();
  console.log("✓ Services (12 real + unpublished legacy demos)");

  await seedProjects(categoryIds, IDS.clients);
  console.log("✓ Projects (8) with ProjectImages");

  await seedTeamMembers();
  console.log("✓ TeamMembers (4)");

  await seedCompanyMilestones();
  console.log("✓ CompanyMilestones (5)");

  await seedContactMessages();
  console.log("✓ ContactMessages (2)");

  await seedQuoteRequests();
  console.log("✓ QuoteRequests (3)");

  await seedMedia();
  console.log("✓ Media (1)");

  const admin = users.find((u) => u.email === "admin@northernmeteor.com");
  if (!admin) {
    throw new Error("Admin user missing after seed");
  }
  await seedAuditLog(admin.id);
  console.log("✓ AuditLog (LOGIN sample)");

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
