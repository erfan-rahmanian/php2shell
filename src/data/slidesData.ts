export interface CodeSnippet {
  label: string;
  language: 'bash' | 'php' | 'c' | 'http' | 'splunk' | 'ini' | 'text';
  code: string;
}

export interface TableStructure {
  headers: string[];
  rows: string[][];
}

export interface SlideItem {
  id: number;
  sectionId: number;
  sectionTitle: string;
  storyStage: string;
  title: string;
  subtitle: string;
  keyTakeaway: string;
  bullets: string[];
  secondaryTitle?: string;
  secondaryBullets?: string[];
  codeBlocks?: CodeSnippet[];
  table?: TableStructure;
  diagramType: string;
  speakerNotes: string;
}

export interface SectionInfo {
  id: number;
  title: string;
  shortTitle: string;
  slideRange: [number, number];
}

export const SECTIONS: SectionInfo[] = [
  { id: 1, title: 'بخش اول: مقدمه و شناخت آسیب‌پذیری', shortTitle: '۱. مقدمه و معماری', slideRange: [1, 8] },
  { id: 2, title: 'بخش دوم: Root Cause و Memory Corruption', shortTitle: '۲. Root Cause و حافظه', slideRange: [9, 14] },
  { id: 3, title: 'بخش سوم: تحلیل CVEها و Attack Chain', shortTitle: '۳. تحلیل CVE و Exploit', slideRange: [15, 23] },
  { id: 4, title: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe', shortTitle: '۴. آزمایشگاه عملی', slideRange: [24, 28] },
  { id: 5, title: 'بخش پنجم: Detection و تحلیل SOC', shortTitle: '۵. تحلیل و پایش SOC', slideRange: [29, 37] },
  { id: 6, title: 'بخش ششم: Mitigation و Remediation', shortTitle: '۶. مهار و رفع نقص', slideRange: [38, 42] },
  { id: 7, title: 'بخش هفتم: نتیجه‌گیری و منابع', shortTitle: '۷. جمع‌بندی و منابع', slideRange: [43, 45] },
];

export const STORYLINE_STAGES: { label: string; slideId: number }[] = [
  { label: 'Introduction', slideId: 1 },
  { label: 'PHP Runtime Architecture', slideId: 5 },
  { label: 'Session Upload Progress', slideId: 6 },
  { label: 'Memory Management', slideId: 9 },
  { label: 'Bailout', slideId: 10 },
  { label: 'Dangling Pointer', slideId: 12 },
  { label: 'CVE Analysis', slideId: 15 },
  { label: 'Memory Disclosure', slideId: 19 },
  { label: 'ASLR Bypass', slideId: 20 },
  { label: 'RCE', slideId: 22 },
  { label: 'Lab Demonstration', slideId: 24 },
  { label: 'SOC Detection', slideId: 29 },
  { label: 'Incident Response', slideId: 37 },
  { label: 'Mitigation', slideId: 38 },
  { label: 'Conclusion', slideId: 43 },
];

export const SLIDES_DATA: SlideItem[] = [
  {
    id: 1,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Introduction',
    title: 'PHP2Shell: From Memory Corruption to Remote Code Execution',
    subtitle: 'تحلیل فنی دو آسیب‌پذیری بحرانی در PHP Runtime با شناسه‌های CVE-2026-109618 و CVE-2026-109619',
    keyTakeaway: 'بررسی عمیق زنجیره تبدیل خطای مدیریت حافظه در PHP Engine به اجرای کد از راه دور (Unauthenticated RCE) و راهکارهای تشخیص در SOC',
    bullets: [
      'PHP Runtime Internals و چرخه پردازش درخواست پیش از اجرای کد برنامه',
      'مکانیزم Session Upload Progress و پردازش Multipart/Form-Data',
      'مدیریت حافظه، شرایط Out Of Memory (OOM) و خروج اضطراری با Bailout / longjmp()',
      'ایجاد Dangling Pointer، رخداد Use-After-Free و افشای حافظه (Memory Disclosure)',
      'دور زدن ASLR (Address Space Layout Randomization) و رسیدن به Remote Code Execution',
      'بازسازی عملی در آزمایشگاه TryHackMe (نسخه هدف PHP 8.4.26 و اصلاح‌شده در PHP 8.4.27)',
      'تدوین شاخص‌های تشخیص (Detection Indicators)، Incident Response و Mitigation در مرکز عملیات امنیت (SOC)',
    ],
    diagramType: 'title-overview',
    speakerNotes:
      'در این ارائه تخصصی، مجموعه آسیب‌پذیری‌های موسوم به PHP2Shell شامل CVE-2026-109618 و CVE-2026-109619 را از دیدگاه مهندسی امنیت، تحلیل آسیب‌پذیری و عملیات SOC بررسی می‌کنیم. تمرکز ما بر درک دقیق این موضوع است که چگونه یک خطای مدیریت حافظه و وضعیت داخلی (Internal State) در سطح مفسر PHP می‌تواند بدون نیاز به هیچ‌گونه باگ در کد برنامه وب، به اجرای کد از راه دور (RCE) منجر شود.',
  },
  {
    id: 2,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Introduction',
    title: 'معرفی PHP2Shell و مشخصات امنیتی',
    subtitle: 'آسیب‌پذیری در سطح PHP Engine و مدیریت حافظه Request، مستقل از امنیت Source Code برنامه',
    keyTakeaway: 'حتی وب‌سایت‌هایی با Source Code کاملاً ایمن نیز در صورت استفاده از PHP Runtime آسیب‌پذیر در معرض خطر RCE قرار دارند.',
    bullets: [
      'PHP2Shell نامی است که برای مجموعه‌ای از آسیب‌پذیری‌های بحرانی در PHP Runtime به کار می‌رود که امکان Remote Code Execution را فراهم می‌کنند.',
      'منشأ آسیب‌پذیری در خود PHP Engine و نحوه مدیریت حافظه و وضعیت داخلی Request قرار دارد، نه لزوماً در کد Application.',
      'یک وب‌سایت ممکن است از نظر امنیتی به‌خوبی توسعه یافته باشد و هیچ باگ مستقیمی در Source Code نداشته باشد، اما به دلیل نسخه PHP در معرض خطر قرار بگیرد.',
      'هر دو آسیب‌پذیری اصلی از نظر Root Cause متفاوت هستند، اما هر دو از نقص مدیریت وضعیت داخلی PHP در شرایط خطا ناشی می‌شوند.',
    ],
    table: {
      headers: ['شاخص امنیتی (Metric)', 'مقدار و وضعیت (Specification)', 'توضیح فنی (Technical Impact)'],
      rows: [
        ['نوع آسیب‌پذیری', 'Remote Code Execution (RCE)', 'اجرای دستور دلخواه در سطح دسترسی Process وب‌سرور'],
        ['سطح دسترسی اولیه', 'بدون Authentication (Unauthenticated)', 'قابل بهره‌برداری از طریق ارسال درخواست HTTP از راه دور'],
        ['تعامل کاربر', 'بدون نیاز به User Interaction', 'اجرای کامل زنجیره به صورت خودکار توسط مهاجم'],
        ['سطح اثرگذاری (CIA)', 'Confidentiality, Integrity, Availability', 'افشای حافظه، دست‌کاری جریان اجرا و احتمال Crash کردن Worker'],
        ['شدت و امتیاز', 'Critical — CVSS v4.0: 9.2', 'ریسک بحرانی برای زیرساخت‌های دارای PHP آسیب‌پذیر'],
      ],
    },
    diagramType: 'security-profile',
    speakerNotes:
      'نکته کلیدی در اسلاید دوم تفکیک لایه Application از لایه Runtime است. با امتیاز CVSS v4.0 برابر با 9.2 و عدم نیاز به Authentication یا User Interaction، این آسیب‌پذیری‌ها هر سرویسی را که روی نسخه آسیب‌پذیر PHP اجرا می‌شود تهدید می‌کنند. هر دو CVE ریشه در مدیریت ناقص وضعیت داخلی در شرایط استثنایی دارند.',
  },
  {
    id: 3,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Introduction',
    title: 'چرا این آسیب‌پذیری مهم است؟ (معماری لایه‌ای وب)',
    subtitle: 'تفاوت آسیب‌پذیری‌های لایه Application با آسیب‌پذیری‌های زیرساختی در لایه PHP Runtime',
    keyTakeaway: 'امنیت Application بدون امنیت Runtime کامل نیست؛ نقص در لایه Runtime تمام برنامه‌های مستقر روی آن را تحت تأثیر قرار می‌دهد.',
    bullets: [
      'در معماری یک Web Application، امنیت سیستم تنها به کد برنامه وابسته نیست و ۶ لایه اصلی در اجرا نقش دارند: Operating System، Web Server (Apache/Nginx)، PHP Runtime، Framework (Laravel/Symfony)، Application Code و Database.',
      'در اغلب ارزیابی‌های امنیتی تمرکز صرفاً روی Application Code است (مانند SQL Injection، XSS، Authentication Bypass، Insecure File Upload و Broken Access Control).',
      'PHP2Shell ثابت می‌کند که یک آسیب‌پذیری در لایه PHP Runtime تمام Applicationهای متکی به آن Runtime را به خطر می‌اندازد.',
      'مثال عملی: اگر یک سازمان هم‌زمان از WordPress، Laravel و یک پورتال اختصاصی PHP روی یک PHP Runtime آسیب‌پذیر استفاده کند، سالم بودن کد هر سه برنامه مانع سوءاستفاده از نقص Runtime نخواهد شد.',
    ],
    diagramType: 'layer-stack',
    speakerNotes:
      'بسیاری از تیم‌های توسعه و امنیت تصور می‌کنند با انجام Code Review یا رفع باگ‌های OWASP Top 10 در کد Laravel یا WordPress، برنامه آن‌ها امن است. این اسلاید نشان می‌دهد که لایه ۳ (PHP Runtime) زیربنای لایه‌های ۴ و ۵ است و هرگونه نقص حافظه در آن، امنیت لایه‌های بالاتر را خنثی می‌کند.',
  },
  {
    id: 4,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Introduction',
    title: 'آشنایی با مفاهیم پایه در تحلیل PHP2Shell',
    subtitle: 'واژگان کلیدی معماری داخلی PHP و بهره‌برداری از آسیب‌پذیری‌های حافظه',
    keyTakeaway: 'درک دقیق زنجیره PHP2Shell نیازمند تسلط هم‌زمان بر مفاهیم Web Runtime و مفاهیم سطح پایین Memory Exploitation است.',
    bullets: [
      'PHP Runtime: محیط اجرایی PHP که مسئول پردازش Request، مدیریت حافظه، اجرای کد و مدیریت متغیرها و Objectها است.',
      'Zend Engine: موتور داخلی PHP که مسئول Compile و اجرای کد PHP و مدیریت ساختارهای داده و حافظه (Zend Memory Manager) است.',
      'Session & Multipart/Form-Data: مکانیزم نگهداری وضعیت کاربران بین Requestها و Content-Type استاندارد HTTP برای ارسال فایل و Form Data.',
      'Memory Corruption: وضعیتی که در آن ساختارها یا محتوای حافظه به شکل غیرمنتظره تغییر می‌کنند.',
      'Dangling Pointer: اشاره‌گری که همچنان به یک آدرس حافظه اشاره می‌کند، در حالی که حافظه مربوط به آن آزاد شده یا دیگر اعتبار ندارد.',
      'Use-After-Free (UAF): استفاده مجدد از حافظه پس از آزاد شدن آن در چرخه اجرای برنامه.',
      'Memory Disclosure & ASLR: افشای اطلاعات حافظه Process به موجودیت غیرمجاز که برای دور زدن مکانیزم تصادفی‌سازی آدرس‌های حافظه (ASLR) به کار می‌رود.',
      'Remote Code Execution (RCE): توانایی اجرای دستور یا کد دلخواه روی سیستم هدف.',
    ],
    diagramType: 'core-concepts-grid',
    speakerNotes:
      'این اسلاید نقش نقشه راه مفهومی را دارد. تحلیلگران SOC معمولاً با مفاهیم HTTP، Session و Multipart آشنا هستند و مهندسان Exploit با Heap، Dangling Pointer، UAF و ASLR کار می‌کنند. در PHP2Shell این دو حوزه مستقیماً به یکدیگر پیوند می‌خورند.',
  },
  {
    id: 5,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'PHP Runtime Architecture',
    title: 'معماری اجرای PHP در Web Server و جایگاه mod_php',
    subtitle: 'نحوه تعامل Apache Web Server، SAPIها و Zend Engine در پردازش درخواست‌ها',
    keyTakeaway: 'بخشی از پردازش Request در mod_php و PHP Runtime پیش از رسیدن به Application Code انجام می‌شود که بستر اصلی حمله PHP2Shell است.',
    bullets: [
      'PHP می‌تواند با معماری‌ها و Server API (SAPI)های متنوعی اجرا شود: Apache mod_php، PHP-FPM، CGI، FastCGI و FrankenPHP.',
      'در آزمایشگاه TryHackMe از معماری Apache همراه با mod_php استفاده شده است که در آن PHP مستقیماً داخل Process مربوط به Apache اجرا می‌شود.',
      'مسیر جریان داده: Client → HTTP Request → Apache Web Server → mod_php → PHP Runtime / Zend Engine → Application Code → HTTP Response.',
      'نکته حیاتی امنیتی: بخش قابل‌توجهی از پردازش اولیه Request (شامل تجزیه بدنه Multipart و مدیریت اولیه Session) قبل از اجرای Application Code در داخل PHP Runtime انجام می‌گیرد.',
    ],
    diagramType: 'apache-modphp-arch',
    speakerNotes:
      'در معماری Apache + mod_php، مفسر PHP به عنوان یک ماژول در فضای آدرس حافظه خود Apache Worker بارگذاری می‌شود. وقتی یک HTTP Request می‌رسد، پیش از آنکه حتی خط اول فایل index.php خوانده شود، لایه SAPI و PHP Runtime شروع به پردازش هدرها و بدنه درخواست می‌کنند.',
  },
  {
    id: 6,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Session Upload Progress',
    title: 'معرفی قابلیت Session Upload Progress در PHP',
    subtitle: 'مکانیزم داخلی PHP برای ثبت وضعیت پیشرفت آپلود فایل در Session به صورت پیش‌فرض',
    keyTakeaway: 'قابلیت session.upload_progress.enabled به صورت پیش‌فرض در PHP برابر با On است و با دریافت فیلد PHP_SESSION_UPLOAD_PROGRESS فعال می‌شود.',
    bullets: [
      'هدف طراحی قابلیت session.upload_progress در PHP، نمایش میزان پیشرفت Upload فایل‌های حجیم به کاربران در حین ارسال درخواست است.',
      'هنگامی که Browser فایلی را از طریق درخواست Multipart ارسال می‌کند، PHP اطلاعات پیشرفت (نام فایل، حجم کل، تعداد بایت‌های دریافت‌شده، وضعیت پیشرفت و اطلاعات Form) را در Session ذخیره می‌کند.',
      'ارسال یک درخواست HTTP با Content-Type از نوع multipart/form-data به همراه فیلد مشخص، این مکانیزم را در سطح Runtime فعال می‌سازد.',
      'نکته امنیتی: خود این قابلیت به تنهایی آسیب‌پذیر نیست؛ مشکل اصلی در نحوه مدیریت وضعیت داخلی PHP هنگام بروز شرایط خطا در حین پردازش Request است.',
    ],
    codeBlocks: [
      {
        label: 'php.ini — تنظیمات پیش‌فرض Session Upload Progress',
        language: 'ini',
        code: `; فعال بودن قابلیت به صورت پیش‌فرض در PHP
session.upload_progress.enabled = On

; نام پیش‌فرض Form Field برای فعال‌سازی ردیابی در حین آپلود
session.upload_progress.name = "PHP_SESSION_UPLOAD_PROGRESS"
session.upload_progress.prefix = "upload_progress_"
session.upload_progress.cleanup = On`,
      },
    ],
    diagramType: 'upload-progress-config',
    speakerNotes:
      'بسیاری از مدیران سرور نمی‌دانند که session.upload_progress.enabled به صورت پیش‌فرض در php.ini روشن (On) است. یعنی حتی اگر برنامه‌نویس هیچ کد خاصی برای آپلود ننوشته باشد، به محض اینکه مهاجم یک درخواست Multipart حاوی فیلد PHP_SESSION_UPLOAD_PROGRESS بفرستد، موتور PHP وارد مسیر کد مربوط به ثبت وضعیت آپلود در Session می‌شود.',
  },
  {
    id: 7,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Session Upload Progress',
    title: 'چرا Upload Progress از نظر امنیتی اهمیت دارد؟',
    subtitle: 'تحلیل زمان اجرای Upload Progress در مراحل ابتدایی پردازش Request Body',
    keyTakeaway: 'Attack Surface در سطح PHP Runtime قرار دارد؛ بنابراین برای بهره‌برداری نیازی به وجود فرم آپلود، لاگین یا آسیب‌پذیری در کد وب‌سایت نیست.',
    bullets: [
      'نکته کلیدی، زمان اجرای Upload Progress است: به محض دریافت درخواست multipart/form-data، موتور PHP شروع به خواندن Form Fieldها و فایل‌های ارسالی در بدنه درخواست می‌کند.',
      'ثبت اطلاعات Upload Progress در Session در مراحل اولیه پردازش Request و قبل از اجرای کد اصلی Application صورت می‌گیرد.',
      'در نتیجه، برای موفقیت مسیر حمله‌ای که به این مکانیزم وابسته است، هیچ نیازی به وجود Login Form یا Authentication در برنامه نیست.',
      'همچنین نیازی به Session Management اختصاصی در کد برنامه، File Upload Handler در اسکریپت PHP یا هرگونه آسیب‌پذیری در Source Code وب‌سایت وجود ندارد.',
    ],
    diagramType: 'pre-script-surface',
    speakerNotes:
      'در حملات وب کلاسیک، اگر بخواهیم از آسیب‌پذیری File Upload استفاده کنیم، برنامه هدف باید یک صفحه آپلود داشته باشد. اما در PHP2Shell، چون پردازش Multipart و Upload Progress در لایه SAPI/Runtime و پیش از اجرای اسکریپت انجام می‌شود، حتی یک فایل index.php که فقط عبارت OK را چاپ می‌کند نیز کل این مسیر کدی را در موتور PHP فعال می‌سازد.',
  },
  {
    id: 8,
    sectionId: 1,
    sectionTitle: 'بخش اول: مقدمه و شناخت آسیب‌پذیری',
    storyStage: 'Session Upload Progress',
    title: 'چرخه ۱۰ مرحله‌ای پردازش HTTP Request در PHP',
    subtitle: 'موقعیت دقیق آسیب‌پذیری پیش از مرحله اجرای اسکریپت برنامه (Application Script)',
    keyTakeaway: 'اگر آسیب‌پذیری در گام‌های ۴ و ۵ (پردازش بدنه Multipart و Upload Progress) رخ دهد، کد Application در گام ۸ حتی فرصت اجرا پیدا نمی‌کند.',
    bullets: [
      'گام ۱ تا ۳: دریافت HTTP Request توسط Web Server، تحویل Request به PHP SAPI و پردازش اولیه Headerها.',
      'گام ۴ و ۵ (ناحیه بحرانی PHP2Shell): پردازش Request Body به همراه تجزیه ساختار Multipart و اجرای مکانیزم Upload Progress.',
      'گام ۶ و ۷: آماده‌سازی Request Environment و مقداردهی اولیه متغیرها (Superglobals) و ساختارهای Session.',
      'گام ۸: اجرای Application Script (کد نوشته شده توسط توسعه‌دهنده وب).',
      'گام ۹ و ۱۰: تولید HTTP Response و در نهایت آزادسازی منابع (Shutdown / Cleanup) و پایان Request.',
      'ارتباط با PHP2Shell: مسیر سوءاستفاده کاملاً بر مراحل داخلی پردازش Request و مرحله Shutdown تکیه دارد، نه منطق تجاری Application.',
    ],
    diagramType: 'http-10stage-lifecycle',
    speakerNotes:
      'این دیاگرام ده مرحله‌ای به خوبی نشان می‌دهد چرا فایروال‌های برنامه‌محور (In-App WAF) یا کنترل‌های دسترسی داخل کد PHP (در مرحله ۸) نمی‌توانند جلوی رخداد خطا در مراحل ۴ و ۵ را بگیرند. خطای حافظه در مرحله ۵ رخ می‌دهد و مستقیم به مرحله ۱۰ (آزادسازی منابع و Shutdown) پرش می‌کند.',
  },
  {
    id: 9,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Memory Management',
    title: 'آشنایی با Memory Limit و شرایط Out Of Memory (OOM)',
    subtitle: 'نحوه عملکرد مکانیزم حفاظتی memory_limit در Zend Memory Manager',
    keyTakeaway: 'مکانیزم حفاظتی memory_limit برای جلوگیری از مصرف بیش از حد منابع طراحی شده، اما نحوه خروج اضطراری PHP هنگام رسیدن به OOM اهمیت امنیتی پیدا می‌کند.',
    bullets: [
      'PHP برای جلوگیری از مصرف بیش از حد حافظه توسط هر Request، دارای تنظیم حفاظتی به نام memory_limit است (برای مثال memory_limit = 128M).',
      'این تنظیم حداکثر میزان حافظه قابل تخصیص در Heap توسط یک Request را کنترل می‌کند.',
      'هنگامی که یک عملیات پردازشی باعث عبور مصرف حافظه از این سقف شود، PHP نمی‌تواند اجرای عادی را ادامه دهد و خطای Fatal ایجاد می‌کند.',
      'مسئله امنیتی در خود محدودیت حافظه نیست، بلکه در نحوه توقف عملیات جاری و خروج PHP از مسیر اجرای فعلی در لحظه وقوع Out Of Memory نهفته است.',
    ],
    codeBlocks: [
      {
        label: 'PHP Runtime Configuration & Fatal Error Output',
        language: 'ini',
        code: `; تنظیم محدودیت حافظه به ازای هر درخواست در php.ini
memory_limit = 128M

; پیام خطای تولید شده هنگام عبور از سقف مجاز حافظه:
Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 4096 bytes)`,
      },
    ],
    diagramType: 'memory-limit-oom',
    speakerNotes:
      'در نگاه اول، memory_limit یک ویژگی امنیتی و پایداری برای جلوگیری از Denial of Service است. اما وقتی در میانه یک عملیات حساس سیستمی (مثل مقداردهی اولیه ساختارهای داخلی Request یا کپی کردن داده‌های Multipart) تخصیص حافظه به سقف memory_limit برخورد می‌کند، موتور PHP ناگهان اجرای تابع فعلی را متوقف می‌کند.',
  },
  {
    id: 10,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Bailout',
    title: 'مفهوم Bailout و مکانیزم longjmp() در PHP Engine',
    subtitle: 'خروج اضطراری از مسیر اجرای فعلی هنگام بروز خطای بحرانی در سطح C',
    keyTakeaway: 'Bailout با استفاده از longjmp() پشته فراخوانی عادی را دور می‌زند؛ اگر مراحل Cleanup یا Reset جا بمانند، ساختارهای داخلی در وضعیت ناسازگار باقی می‌مانند.',
    bullets: [
      'PHP برای خروج اضطراری از مسیرهای اجرایی در زبان C هنگام وقوع خطاهای مهلک (مانند OOM)، از مکانیزمی به نام Bailout (`zend_bailout`) استفاده می‌کند.',
      'این مکانیزم بر پایه تابع استاندارد `longjmp()` در C پیاده‌سازی شده است که امکان پرش غیرخطی به یک نقطه بازیابی از پیش ثبت‌شده (`setjmp`) را فراهم می‌سازد.',
      'هنگامی که PHP با Out Of Memory مواجه می‌شود، اجرای کد فعلی را بلافاصله متوقف کرده و به حلقه اصلی مدیریت پایان درخواست بازمی‌گردد.',
      'نکته مهم: Bailout به‌خودی‌خود یک آسیب‌پذیری نیست؛ مشکل زمانی ایجاد می‌شود که این پرش اضطراری باعث شود برخی مراحل Cleanup یا Reset کردن Pointerها به شکل مورد انتظار اجرا نشوند.',
    ],
    codeBlocks: [
      {
        label: 'Zend Engine Bailout Mechanism (Conceptual C Flow)',
        language: 'c',
        code: `// در هنگام تخصیص حافظه توسط Zend Memory Manager:
void *emalloc(size_t size) {
    if (UNEXPECTED(AG(mm_heap)->real_size + size > AG(mm_heap)->limit)) {
        zend_error_noreturn(E_ERROR, "Allowed memory size exhausted");
        // درون zend_error_noreturn، تابع zend_bailout() فراخوانی می‌شود:
        // longjmp(*EG(bailout), FAILURE); -> پرش مستقیم و عبور از کدهای بعدی تابع فعلی!
    }
}`,
      },
    ],
    diagramType: 'bailout-longjmp',
    speakerNotes:
      'در زبان C، برخلاف زبان‌های سطح بالا که ساختار try/finally خودکار دارند، وقتی longjmp فراخوانی می‌شود، تمام فریم‌های میانی Stack بدون اجرای خطوط باقی‌مانده تابع دور زده می‌شوند. اگر تابعی در میانه تغییر یک متغیر سراسری یا اشاره‌گر باشد و ناگهان emalloc دچار OOM شود، خطوط کد بعدی که قرار بود وضعیت را پایدار کنند هرگز اجرا نمی‌شوند.',
  },
  {
    id: 11,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Bailout',
    title: 'تفاوت Normal Cleanup و Emergency Bailout',
    subtitle: 'مقایسه فرآیند کنترل‌شده آزادسازی منابع با قطع ناگهانی مسیر پاک‌سازی',
    keyTakeaway: 'Normal Cleanup یک فرآیند ۵ مرحله‌ای کنترل‌شده است، اما Emergency Bailout می‌تواند میان آزاد شدن حافظه و Reset شدن Pointer گسست ایجاد کند.',
    bullets: [
      'منابع نیازمند پاک‌سازی در پایان هر Request: Heap Allocations، Temporary Variables، Session Data، Internal Objects و Request-specific Structures.',
      'مسیر Normal Cleanup (سالم): ۱. شناسایی منابع ← ۲. آزادسازی حافظه ← ۳. Reset کردن Pointerهای مربوطه (NULL کردن) ← ۴. بازگشت وضعیت داخلی به حالت معتبر ← ۵. خاتمه Request.',
      'مسیر Emergency Bailout (ناقص): یک بخش از حافظه آزاد شده یا نیمه‌کاره رها شده است، اما به دلیل پرش ناگهانی، Pointer مربوطه هنوز Reset نشده و Process همچنان آدرس قدیمی را در حافظه نگه می‌دارد.',
      'پیامد مستقیم این گسست در پاک‌سازی، شکل‌گیری Dangling Pointer و باقی ماندن Stale State در حافظه Worker است.',
    ],
    diagramType: 'cleanup-vs-bailout',
    speakerNotes:
      'این اسلاید به صورت تصویری نشان می‌دهد چرا هماهنگی میان آزادسازی حافظه (Memory Deallocation) و بازنشانی وضعیت (State Reset) حیاتی است. در حالت عادی هر دو گام به ترتیب انجام می‌شوند، اما در مسیر اضطراری، گام سوم (Reset کردن اشاره‌گرها) ممکن است به خاطر ترتیب نادرست یا پرش Bailout انجام نشود.',
  },
  {
    id: 12,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Dangling Pointer',
    title: 'Dangling Pointer چیست؟ (بررسی وضعیت حافظه قبل و بعد از Free)',
    subtitle: 'نحوه تبدیل یک اشاره‌گر معتبر به اشاره‌گر معلق پس از آزادسازی بلوک حافظه',
    keyTakeaway: 'Dangling Pointer به اشاره‌گری گفته می‌شود که پس از اجرای free(Memory Block A) همچنان آدرس حافظه آزادشده را در خود نگه داشته است.',
    bullets: [
      'Pointer متغیری است که آدرس یک بخش مشخص از حافظه را نگهداری می‌کند (در حالت عادی: Pointer A → Memory Block A).',
      'پس از پایان استفاده، بلوک حافظه توسط مدیر حافظه آزاد می‌شود: `free(Memory Block A)` یا `efree()` در PHP.',
      'اگر پس از آزادسازی، مقدار Pointer به `NULL` تغییر نکند، همچنان به همان آدرس قبلی اشاره می‌کند: `Pointer A → Freed Memory`.',
      'دسترسی مجدد برنامه از طریق این Dangling Pointer می‌تواند منجر به Crash، Memory Corruption، Information Disclosure یا Arbitrary Code Execution شود.',
      'تفاوت مفهومی دقیق: Dangling Pointer توصیف‌کننده وضعیت خود اشاره‌گر نامعتبر است؛ در حالی که Use-After-Free زمانی رخ می‌دهد که برنامه عملاً از آن حافظه آزادشده دوباره استفاده کند.',
    ],
    diagramType: 'dangling-pointer-before-after',
    speakerNotes:
      'در این دیاگرام وضعیت حافظه را در سه فاز مقایسه می‌کنیم: فاز اول تخصیص معتبر است، فاز دوم لحظه اجرای free بدون پاک کردن اشاره‌گر است که Dangling Pointer را به وجود می‌آورد، و فاز سوم زمانی است که دسترسی مجدد به آن آدرس صورت می‌گیرد. تفکیک مفهومی Dangling Pointer و Use-After-Free یکی از نکات کلیدی فنی این اسلاید است.',
  },
  {
    id: 13,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Dangling Pointer',
    title: 'Use-After-Free (UAF) و ارتباط آن با PHP2Shell',
    subtitle: 'چرخه ۷ مرحله‌ای جایگزینی حافظه آزادشده در Heap و تفسیر نادرست داده جدید',
    keyTakeaway: 'هنگامی که حافظه آزادشده توسط Allocation جدیدی اشغال شود و برنامه با Pointer قدیمی به آن مراجعه کند، داده مهاجم به عنوان ساختار داخلی PHP تفسیر می‌شود.',
    bullets: [
      'گام ۱ تا ۳: Application یک Object در Heap ایجاد می‌کند ← Object دیگر نیاز نیست ← حافظه Object آزاد می‌شود (`Freed Chunk`).',
      'گام ۴ و ۵: Pointer قدیمی همچنان در وضعیت معلق باقی می‌ماند ← حافظه آزادشده در تخصیص بعدی توسط Allocation دیگری اشغال می‌گردد.',
      'گام ۶ و ۷: برنامه از Pointer قدیمی استفاده می‌کند ← داده جدید به اشتباه به عنوان Object قبلی تفسیر شده و مسیر Memory Disclosure یا Code Execution را باز می‌کند.',
      'طبقه‌بندی‌های استاندارد ضعف امنیتی (MITRE CWE) مرتبط با ریشه این آسیب‌پذیری‌ها:',
      'CWE-416: Use After Free | CWE-755: Improper Handling of Exceptional Conditions | CWE-824: Access of Uninitialized Pointer',
    ],
    diagramType: 'uaf-7step-heap',
    speakerNotes:
      'چرا Use-After-Free تا این حد برای مهاجمان ارزشمند است؟ زیرا مدیران حافظه (مانند Zend Memory Manager) برای بهینه‌سازی سرعت، بلوک‌های تازه آزادشده (Freed Chunks) را در لیست‌های Free List نگه می‌دارند و به اولین درخواست تخصیص هم‌اندازه بعدی تحویل می‌دهند. بنابراین مهاجم می‌تواند محتوای جدیدی را دقیقاً در همان آدرسی بنویسد که اشاره‌گر قدیمی به آن اشاره می‌کند.',
  },
  {
    id: 14,
    sectionId: 2,
    sectionTitle: 'بخش دوم: Root Cause و Memory Corruption',
    storyStage: 'Dangling Pointer',
    title: 'نقش Apache Prefork MPM و مکانیزم Worker Reuse',
    subtitle: 'چگونه وضعیت نامعتبر از Request 1 به Request 2 در همان Process منتقل می‌شود؟',
    keyTakeaway: 'در ترکیب Apache Prefork و mod_php، پردازشگر (Worker) پس از پایان هر Request بسته نمی‌شود و State نامعتبر باقی‌مانده در Request 1 مستقیماً Request 2 را آلوده می‌کند.',
    bullets: [
      'در مدل چندپردازشی Prefork در Apache، چندین Child Process ایجاد می‌شود و هر Process درخواست‌های متعددی را در طول عمر خود پردازش می‌کند.',
      'در معماری Apache Prefork + mod_php، مفسر PHP داخل Process آپاچی قرار دارد و Worker پس از اتمام هر Request لزوماً Restart نمی‌شود.',
      'سناریوی انتقال آلودگی: در Request 1 خطای حافظه رخ داده و یک Pointer یا State نامعتبر باقی می‌ماند ← Request 1 خاتمه می‌یابد ← Request 2 به همان Worker ارسال شده و با State آلوده قبلی کار می‌کند.',
      'نکته مهم آزمایشگاهی: در آزمایشگاه TryHackMe تعداد Workerها به ۱ عدد محدود شده تا رفتار Worker Reuse کاملاً قابل تکرار باشد؛ در محیط‌های Production واقعی با چندین Worker، مهاجم نیازمند ارسال چندین درخواست (Worker Rotation) است.',
    ],
    diagramType: 'prefork-worker-reuse',
    speakerNotes:
      'اگر هر درخواست HTTP در یک Process کاملاً مستقل اجرا می‌شد و در پایان درخواست کل Process از بین می‌رفت (مانند CGI سنتی)، باقی ماندن یک اشاره‌گر معلق در پایان Request 1 به Request 2 سرایت نمی‌کرد. اما برای کارایی بالا، وب‌سرورها از Worker Reuse استفاده می‌کنند و همین ویژگی باعث ماندگاری Stale State بین درخواست‌های متوالی می‌شود.',
  },
  {
    id: 15,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'CVE Analysis',
    title: 'معرفی و مقایسه دو آسیب‌پذیری اصلی PHP2Shell',
    subtitle: 'تفکیک فنی CVE-2026-109618 (OOM Corruption) و CVE-2026-109619 (Stale Global State)',
    keyTakeaway: 'هر دو CVE به مدیریت State و Bailout مرتبط هستند، اما مکانیزم Trigger و Root Cause آن‌ها در نحوه شکل‌گیری وضعیت نامعتبر متفاوت است.',
    bullets: [
      'CVE-2026-109618 (RCE via Out-of-Memory Corruption): مدیریت ناقص وضعیت داخلی PHP هنگام وقوع OOM در زمانی که برخی ساختارهای Request هنوز به طور کامل Initialize نشده‌اند و مسیر Shutdown با State نامعتبر اجرا می‌شود.',
      'CVE-2026-109619 (RCE via Stale Global State): باقی ماندن Stateهای داخلی متعلق به یک Request در سطح سراسری پس از آزاد شدن حافظه آن Request؛ به طوری که Request بعدی پیش از Reset شدن State از داده‌های قدیمی استفاده می‌کند.',
      'تذکر روش‌شناختی: نباید مراحل خاص یک اسکریپت PoC آزمایشگاهی (که ممکن است چند تکنیک را برای افشای حافظه و RCE ترکیب کند) با تعریف رسمی Root Cause هر CVE یکسان فرض کرد.',
    ],
    table: {
      headers: ['ویژگی تحلیلی', 'CVE-2026-109618', 'CVE-2026-109619'],
      rows: [
        ['عنوان رسمی', 'RCE via Out-of-Memory Corruption', 'RCE via Stale Global State'],
        ['ریشه اصلی (Root Cause)', 'وقوع OOM پیش از تکمیل مقداردهی اولیه ساختارهای Request', 'عدم بازنشانی کامل Global State پس از خطای مهلک و آزادسازی حافظه'],
        ['مرحله بروز خطا', 'دسترسی فرآیند Shutdown به ساختارهای نیمه‌کاره پس از Bailout', 'دسترسی Request بعدی در همان Worker به Reference/State باقی‌مانده'],
        ['CWE مرتبط اصلی', 'CWE-755 / CWE-824 (Uninitialized / Corrupt State)', 'CWE-416 (Use-After-Free via Stale Global Pointer)'],
      ],
    },
    diagramType: 'cve-comparison-overview',
    speakerNotes:
      'در این اسلاید مرز دقیق میان دو شناسه CVE را مشخص می‌کنیم. اولی (CVE-2026-109618) بر وقوع OOM در لحظه‌ای تمرکز دارد که ساختارهای حافظه درخواست هنوز به طور کامل مقداردهی اولیه نشده‌اند اما در معرض استفاده Shutdown قرار می‌گیرند؛ دومی (CVE-2026-109619) بر باقی ماندن متغیرهای وضعیتی سراسری بین دو درخواست متوالی تمرکز دارد.',
  },
  {
    id: 16,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'CVE Analysis',
    title: 'تحلیل عمیق CVE-2026-109618 (Out-of-Memory Corruption)',
    subtitle: 'وقوع Bailout پیش از تکمیل مقداردهی اولیه ساختارهای Request و تخریب حافظه در Shutdown',
    keyTakeaway: 'در CVE-2026-109618، شکست Allocation در میانه آماده‌سازی ساختارهای Request باعث می‌شود فرآیند Shutdown روی اشاره‌گرهای مقداردهی‌نشده یا ناقص عمل کند.',
    bullets: [
      'در برخی مسیرهای پردازش Request (به‌ویژه هنگام تجزیه Multipart)، اشاره‌گر به Request Memory پیش از آنکه ساختارهای درونی آن کاملاً Initialize شوند، در اختیار بخش‌های دیگر Runtime قرار می‌گیرد.',
      'اگر دقیقاً در همین پنجره زمانی، تخصیص حافظه به سقف `memory_limit` برخورد کند و شکست بخورد، PHP از طریق مسیر اضطراری Bailout خارج می‌شود.',
      'به دلیل پرش `longjmp()`، ساختار نیمه‌کاره (Partially Initialized State) در حافظه باقی می‌ماند.',
      'بلافاصله پس از Bailout، موتور PHP وارد فاز Shutdown می‌شود تا منابع Request را آزاد کند، اما به State نامعتبر و اشاره‌گرهای ناقص دسترسی پیدا می‌کند.',
      'این دسترسی نامعتبر منجر به Memory Corruption شده و در شرایط قابل بهره‌برداری، اجرای کد از راه دور (Unauthenticated RCE) را ممکن می‌سازد.',
    ],
    diagramType: 'cve-109618-deepdive',
    speakerNotes:
      'این اسلاید نشان می‌دهد چگونه یک الگوی برنامه‌نویسی خطرناک در C (ثبت آدرس یک ساختار در متغیر سراسری قبل از تکمیل مقداردهی تمام فیلدهای آن ساختار) در برخورد با OOM به یک آسیب‌پذیری بحرانی تبدیل می‌شود. حتی مکانیزم‌های حفاظتی مانند Memory Limit اگر با چرخه استثنا و Cleanup هماهنگ نباشند، خود به بخشی از Attack Surface تبدیل می‌شوند.',
  },
  {
    id: 17,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'CVE Analysis',
    title: 'تحلیل عمیق CVE-2026-109619 (Stale Global State)',
    subtitle: 'ماندگاری وضعیت داخلی یک Request در سطح Worker و رخداد Use-After-Free در درخواست بعدی',
    keyTakeaway: 'در CVE-2026-109619، قطع شدن مسیر عادی Cleanup مانع از Reset شدن Global State شده و Request بعدی در همان Worker به حافظه آزادشده قبلی دسترسی می‌یابد.',
    bullets: [
      'برخی Stateهای داخلی در مفسر PHP که مربوط به پردازش یک Request خاص هستند (مانند ساختارهای ردیابی `session.upload_progress`) در متغیرهای سطح ماژول یا Worker نگهداری می‌شوند.',
      'در چرخه طبیعی، پس از پایان هر Request این Stateها پاک‌سازی و Reset می‌شوند تا Worker برای درخواست بعدی آماده شود.',
      'اما اگر وقوع یک Fatal Error (مانند OOM) مسیر عادی Cleanup را قطع کند، حافظه Heap مربوط به درخواست آزاد می‌شود ولی Global State همچنان به آدرس قبلی اشاره می‌کند (Stale Reference).',
      'هنگامی که Request بعدی وارد همان Worker می‌شود، پیش از مقداردهی اولیه مجدد، به State قدیمی مراجعه کرده و آسیب‌پذیری Use-After-Free رقم می‌خورد.',
    ],
    diagramType: 'cve-109619-deepdive',
    speakerNotes:
      'در CVE-2026-109619، کلید ماجرا تضاد بین طول عمر حافظه درخواست (Request-scoped Heap که در پایان هر درخواست دور ریخته می‌شود) و طول عمر متغیر سراسری ماژول (Module/Worker-scoped Global State که بین درخواست‌ها زنده می‌ماند) است. وقتی Bailout رخ می‌دهد، حافظه درخواست آزاد می‌شود اما متغیر سراسری همچنان آدرس آن حافظه آزادشده را نگه می‌دارد.',
  },
  {
    id: 18,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'CVE Analysis',
    title: 'زنجیره ۱۰ مرحله‌ای حمله (Attack Chain) در PHP2Shell',
    subtitle: 'فلوچارت گام‌به‌گام تبدیل درخواست Multipart اولیه به اجرای کد از راه دور (RCE)',
    keyTakeaway: 'بهره‌برداری عملی در آزمایشگاه یک فرآیند ۱۰ مرحله‌ای زنجیره‌ای از ایجاد OOM و Stale Pointer تا افشای حافظه، دور زدن ASLR و انحراف جریان اجرا است.',
    bullets: [
      'مرحله ۱ و ۲: مهاجم یک درخواست HTTP از نوع Multipart ارسال می‌کند ← PHP در جریان Request Parsing، مکانیزم Upload Progress را فعال و پردازش می‌کند.',
      'مرحله ۳ و ۴: با ارسال ساختارهای حساب‌شده، شرایط Out Of Memory و پرش Bailout ایجاد می‌شود ← یک State یا Pointer نامعتبر در حافظه Worker باقی می‌ماند.',
      'مرحله ۵ و ۶: درخواست بعدی به همان Worker ارسال شده و باعث استفاده مجدد از حافظه/State می‌شود ← از طریق دست‌کاری طول Session ID، افشای حافظه (Memory Disclosure) رخ می‌دهد.',
      'مرحله ۷ و ۸: اطلاعات افشاشده از حافظه برای استخراج آدرس‌های پایه و دور زدن ASLR به کار می‌روند ← ساختارهای داخلی حافظه در Heap با آدرس‌های محاسبه‌شده بازنویسی می‌شوند.',
      'مرحله ۹ و ۱۰: جریان اجرای PHP (Control Flow) در مرحله Cleanup منحرف می‌شود ← اجرای دستور دلخواه (Unauthenticated RCE) با سطح دسترسی Worker به وقوع می‌پیوندد.',
    ],
    diagramType: 'attack-chain-10stage',
    speakerNotes:
      'این فلوچارت ۱۰ مرحله‌ای، ستون فقرات روایت فنی ارائه ماست. توجه کنید که چگونه حمله از یک تعامل کاملاً قانونی در پروتکل HTTP آغاز می‌شود، در گام‌های میانی وارد حوزه مدیریت حافظه و استخراج اطلاعات برای شکستن ASLR شده و در نهایت با بازنویسی اشاره‌گر تابع به اجرای دستور سیستمی می‌رسد.',
  },
  {
    id: 19,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'Memory Disclosure',
    title: 'Memory Disclosure از طریق هدر PHPSESSID',
    subtitle: 'نحوه نشت داده‌های مجاور حافظه Heap در هدر پاسخ Set-Cookie',
    keyTakeaway: 'تخریب ساختار داخلی Session ID باعث می‌شود PHP به جای خواندن یک رشته کوتاه، داده‌های مجاور در حافظه Heap را درون کوکی PHPSESSID به کلاینت بازگرداند.',
    bullets: [
      'در وضعیت عادی، Session ID در PHP دارای طول و ساختار کاراکتری مشخصی (معمولاً ۲۶ تا ۴۸ کاراکتر هگزادسیمال یا الفبایی) است.',
      'در مرحله ششم زنجیره بهره‌برداری آزمایشگاه، وضعیت نامعتبر ساختار رشته (`zend_string`) مربوط به Session ID باعث می‌شود فیلد طول رشته غیرعادی بزرگ تفسیر شود (Buffer Over-read).',
      'هنگامی که PHP هدر پاسخ `Set-Cookie: PHPSESSID=...` را تولید می‌کند، بایت‌های مجاور در حافظه Heap را نیز به عنوان بخشی از مقدار کوکی در HTTP Response قرار می‌دهد.',
      'داده‌های در معرض خطر در این نشت حافظه: Memory Addresses (اشاره‌گرهای داخلی برای شکستن ASLR)، Session Data سایر کاربران، Authentication Tokens، API Keys و Application Secrets.',
    ],
    codeBlocks: [
      {
        label: 'HTTP Response Header — مقایسه PHPSESSID عادی و حالت Memory Disclosure',
        language: 'http',
        code: `# حالت عادی (Normal Baseline):
HTTP/1.1 200 OK
Set-Cookie: PHPSESSID=a9f3c28d1e704b5a92c104f8e1a2b3c4; path=/

# حالت نشت حافظه (Memory Disclosure Anomaly):
HTTP/1.1 200 OK
Set-Cookie: PHPSESSID=a9f3c28d1e70...\x00\x00\x70\xd1\xa2\xc0\x00\x00...\x10\x1a\x91\xa4\xd1\x70\x00\x00...[+4096 bytes of leaked heap memory]`,
      },
    ],
    diagramType: 'phpsessid-leak',
    speakerNotes:
      'این اسلاید هم برای تیم Red Team و هم برای تیم SOC اهمیت حیاتی دارد. از دید مهاجم، هدر Set-Cookie کانال بازگشت (Exfiltration Channel) برای خواندن اشاره‌گرهای خام حافظه است. از دید تحلیلگر SOC، ظهور ناگهانی یک کوکی PHPSESSID با طول چند کیلوبایت در پاسخ سرور، یک شاخص تشخیص بسیار ارزشمند است.',
  },
  {
    id: 20,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'ASLR Bypass',
    title: 'ASLR چیست و چرا در برابر RCE اهمیت دارد؟',
    subtitle: 'مکانیزم Address Space Layout Randomization و نقش Memory Disclosure در خنثی‌سازی آن',
    keyTakeaway: 'ASLR آدرس پایه بخش‌های حافظه را در هر اجرا تصادفی می‌کند تا مهاجم نتواند از آدرس‌های ثابت استفاده کند، اما Memory Disclosure این تصادفی‌سازی را خنثی می‌سازد.',
    bullets: [
      'ASLR (Address Space Layout Randomization) مکانیزم دفاعی سیستم‌عامل‌های مدرن برای تصادفی‌سازی چیدمان فضای آدرس حافظه Process است.',
      'بخش‌های تحت پوشش ASLR عبارت‌اند از: Stack، Heap، Shared Libraries (مانند `libphp.so` و `libc.so`) و Executable Memory Regions.',
      'بدون وجود اطلاعات از وضعیت فعلی حافظه، تلاش مهاجم برای پرش به آدرس یک تابع سیستمی به دلیل تغییر Base Address در هر بار اجرای برنامه با شکست و Crash (SIGSEGV) روبه‌رو می‌شود.',
      'نقش Memory Disclosure: هنگامی که مهاجم بتواند حتی یک اشاره‌گر معتبر از Heap و یک اشاره‌گر از Shared Library را افشا کند، با کسر کردن Offset ثابت، آدرس پایه دقیق (`Base Address`) را محاسبه کرده و ASLR را دور می‌زند.',
    ],
    diagramType: 'aslr-concept',
    speakerNotes:
      'ASLR بر پایه یک راز استوار است: اینکه مهاجم نمی‌داند کتابخانه‌ها و Heap در چه آدرسی بارگذاری شده‌اند. به محض اینکه آسیب‌پذیری دارای قابلیت Memory Disclosure (یا Information Leak) باشد، این راز فاش شده و محافظت ASLR برای آن Process خاص از بین می‌رود.',
  },
  {
    id: 21,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'ASLR Bypass',
    title: 'ASLR Bypass در PoC آزمایشگاه و مقایسه دو اجرای متفاوت',
    subtitle: 'استخراج دو مرحله‌ای آدرس پایه Heap و کتابخانه libphp از داده‌های افشاشده',
    keyTakeaway: 'Exploit به جای حدس زدن آدرس‌ها، در دو مرحله chunk base (Heap) و libphp base را از نشت حافظه استخراج کرده و آدرس دقیق توابع هدف را محاسبه می‌کند.',
    bullets: [
      'در PoC آزمایشگاه TryHackMe، دور زدن ASLR طی دو مرحله مجزا با استفاده از Memory Disclosure انجام می‌گیرد:',
      'مرحله اول: استخراج Base Address مربوط به بخش Heap (`chunk base`) برای دانستن آدرس دقیق داده‌های تزریق‌شده توسط مهاجم.',
      'مرحله دوم: استخراج Base Address مربوط به کتابخانه اجرایی PHP (`libphp base`) برای محاسبه آدرس توابع داخلی و سیستمی.',
      'وابستگی محیطی: این محاسبات به Build، معماری، Layout حافظه و Offsetهای دقیق همان باینری وابسته است؛ بنابراین یک PoC ثابت الزاماً روی تمام نسخه‌ها و Buildهای PHP بدون تنظیم Offsetها کار نمی‌کند.',
    ],
    codeBlocks: [
      {
        label: 'Exploit Terminal Output — استخراج آدرس‌های پایه در اجرای آزمایشگاه',
        language: 'text',
        code: `[*] Stage 1: Triggering memory disclosure via corrupted session state...
[+] chunk base  = 0x70d1a2c00000   (Heap Region Base Address)
[+] libphp base = 0x70d1a4911000   (libphp.so Shared Library Base)
[*] Calculating target function and fake structure offsets dynamically...`,
      },
    ],
    diagramType: 'aslr-two-runs-bypass',
    speakerNotes:
      'در دیاگرام این اسلاید، دو اجرای مستقل از Process را در کنار هم مقایسه می‌کنیم. در اجرای اول آدرس libphp برابر 0x70d1a4911000 و در اجرای دوم آدرس کاملاً متفاوتی است. اسکریپت Exploit ابتدا آدرس افشاشده در همان لحظه را می‌خواند و سپس با جمع زدن Offset ثابت تابع هدف نسبت به ابتدای کتابخانه، به آدرس دقیق در همان اجرا دست می‌یابد.',
  },
  {
    id: 22,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'RCE',
    title: 'از Memory Corruption تا RCE (دست‌کاری HashTable و pDestructor)',
    subtitle: 'نحوه انحراف جریان اجرای برنامه (Control Flow Hijacking) در مرحله پاک‌سازی PHP',
    keyTakeaway: 'با بازنویسی اشاره‌گر تابع pDestructor در ساختار جعلی HashTable و قرار دادن آدرس تابع system()، عملیات Cleanup عادی PHP به اجرای دستور مهاجم تبدیل می‌شود.',
    bullets: [
      'پس از شکستن ASLR، هدف از خواندن حافظه به تغییر جریان اجرای برنامه (Control Flow Hijacking) تغییر می‌یابد.',
      'در موتور Zend، ساختار داده `HashTable` ستون فقرات نگهداری آرایه‌ها، متغیرهای Session و جدول نمادها است و هر `HashTable` دارای یک اشاره‌گر تابع به نام `pDestructor` است.',
      'وظیفه طبیعی `pDestructor`: هنگامی که یک `HashTable` در پایان کار پاک‌سازی می‌شود، PHP به ازای هر عنصر، تابع اشاره‌شده توسط `pDestructor` را با آرگومان آن عنصر فراخوانی می‌کند.',
      'در مسیر PoC آزمایشگاه، مهاجم یک ساختار `HashTable` دست‌کاری‌شده در حافظه می‌سازد که در آن `pDestructor` به آدرس تابع `system()` اشاره می‌کند و داده عنصر نیز رشته دستور موردنظر مهاجم است.',
      'نکته فنی مهم: این مکانیزم (`HashTable` + `pDestructor` → `system()`) مربوط به تکنیک بهره‌برداری در PoC آزمایشگاه است و تنها مسیر ممکن برای بهره‌برداری از PHP2Shell در تمام Buildها نیست.',
    ],
    codeBlocks: [
      {
        label: 'Zend HashTable Destructor Hijack (Conceptual Structure)',
        language: 'c',
        code: `struct _zend_array { // Zend HashTable
    zend_refcounted_h gc;
    uint32_t          nTableMask;
    Bucket           *arData;        // -> اشاره به رشته دستور مهاجم: "cat /f > /out/p1"
    uint32_t          nNumUsed;
    uint32_t          nTableSize;
    dtor_func_t       pDestructor;   // -> بازنویسی شده با آدرس system()!
};
// هنگام اجرای zend_hash_destroy(ht):
// ht->pDestructor(bucket_val)  ===>  system("cat /f > /out/p1");`,
      },
    ],
    diagramType: 'hashtable-pdestructor-rce',
    speakerNotes:
      'این اسلاید اوج فنی بخش بهره‌برداری است. در معماری شیءگرا یا ساختاریافته در C، استفاده از Function Pointerها درون ساختارهای داده بسیار رایج است. وقتی PHP در پایان درخواست می‌خواهد حافظه یک HashTable را مرتب و آزاد کند، بدون آنکه بداند ساختار توسط مهاجم بازنویسی شده، خودش تابع pDestructor را صدا می‌زند که اکنون همان تابع system() است.',
  },
  {
    id: 23,
    sectionId: 3,
    sectionTitle: 'بخش سوم: تحلیل CVEها و Attack Chain',
    storyStage: 'RCE',
    title: 'Remote Code Execution و تحلیل سطح دسترسی (Privilege Level)',
    subtitle: 'چرا اجرای موفق RCE به معنی دسترسی کاربر www-data است و نه الزاماً Root Access؟',
    keyTakeaway: 'سطح دسترسی حاصل از RCE دقیقاً برابر با مجوزهای Process اجرایی‌کننده PHP است؛ اجرای وب‌سرور با کاربر محدود www-data دامنه تخریب اولیه را مهار می‌کند.',
    bullets: [
      'پس از اجرای موفق Exploit، دستورات مهاجم در بستر Process مربوط به PHP یا Web Server اجرا می‌شوند.',
      'در محیط آزمایشگاه مبتنی بر Debian/Ubuntu، خروجی دستور `id` نشان‌دهنده اجرای کد با کاربر و گروه استاندارد `www-data` (UID=33, GID=33) است.',
      'پاسخ به یک ابهام رایج: آیا RCE به معنی Root Access است؟ خیر! RCE صرفاً به معنای توانایی اجرای کد روی سیستم هدف است و سطح دسترسی آن تابع مجوزهای Process آسیب‌پذیر است.',
      'اهمیت اصل Least Privilege: اگر Worker با دسترسی محدود `www-data` اجرا شود، مهاجم نیز در گام اول تنها همان دسترسی محدود را کسب می‌کند؛ اما اگر PHP به اشتباه با دسترسی `root` اجرا شده باشد، حمله بلافاصله به تسخیر کامل سیستم منجر می‌شود.',
    ],
    codeBlocks: [
      {
        label: 'Execution Proof Output on Target Container',
        language: 'bash',
        code: `$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)`,
      },
    ],
    diagramType: 'rce-privilege-wwwdata',
    speakerNotes:
      'در گزارش‌های مدیریتی و تحلیل‌های حادثه، بسیار مهم است که بین وقوع RCE و دسترسی Root تفکیک قائل شویم. مهاجم پس از کسب شل با کاربر www-data به فایل‌های وب‌سایت، متغیرهای محیطی، فایل‌های تنظیمات دیتابیس و نشست‌ها دسترسی دارد، اما برای دسترسی کامل به سیستم‌عامل نیازمند یک آسیب‌پذیری دیگر (Local Privilege Escalation) یا پیکربندی نادرست کانتینر است.',
  },
  {
    id: 24,
    sectionId: 4,
    sectionTitle: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe',
    storyStage: 'Lab Demonstration',
    title: 'معرفی معماری محیط آزمایشگاه TryHackMe',
    subtitle: 'بررسی اجزای زیرساختی ماشین هدف و نحوه دسترسی به سرویس آسیب‌پذیر',
    keyTakeaway: 'محیط آزمایشگاه شامل یک ماشین Ubuntu 24.04 است که کانتینر Docker با نام php2shell-target (مبتنی بر PHP 8.4.26 و Apache mod_php) را روی پورت محلی 8088 اجرا می‌کند.',
    bullets: [
      'سیستم‌عامل میزبان آزمایشگاه: Ubuntu 24.04 به همراه سرویس Docker.',
      'مشخصات کانتینر هدف: نام کانتینر `php2shell-target`، وب‌سرور Apache همراه با `mod_php` و نسخه آسیب‌پذیر `PHP 8.4.26`.',
      'آدرس سرویس HTTP هدف: `127.0.0.1:8088` در داخل ماشین آزمایشگاه.',
      'نکات عملیاتی اتصال: اتصال اولیه تحلیلگر به ماشین آزمایشگاه از طریق پروتکل SSH (روی پورت استاندارد ۲۲) انجام می‌شود و سپس تمام درخواست‌های تست Exploit از داخل خود ماشین به آدرس محلی `127.0.0.1:8088` ارسال می‌گردند (پورت 8088 مربوط به HTTP است نه SSH).',
    ],
    codeBlocks: [
      {
        label: 'SSH Connection to TryHackMe Lab Host',
        language: 'bash',
        code: `# اتصال از طریق SSH به ماشین اوبونتو آزمایشگاه (پورت ۲۲)
ssh ubuntu@MACHINE_IP

# بررسی وضعیت گوش دادن پورت محلی 8088 برای سرویس وب هدف
ss -tulpn | grep 8088`,
      },
    ],
    diagramType: 'lab-architecture',
    speakerNotes:
      'در این بخش وارد بازسازی گام‌به‌گام آزمایشگاه TryHackMe می‌شویم. معماری آزمایشگاه به گونه‌ای طراحی شده که سرویس آسیب‌پذیر درون یک کانتینر Docker روی پورت محلی 8088 قرار دارد تا محیط آزمایش کاملاً ایزوله و کنترل‌شده باشد.',
  },
  {
    id: 25,
    sectionId: 4,
    sectionTitle: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe',
    storyStage: 'Lab Demonstration',
    title: 'شناسایی Target و بررسی نسخه آسیب‌پذیر PHP',
    subtitle: 'اعتبارسنجی وضعیت کانتینر Docker و مقایسه نسخه 8.4.26 با نسخه اصلاح‌شده 8.4.27',
    keyTakeaway: 'بررسی مستقیم کانتینر php2shell-target نشان می‌دهد که ایمیج php:8.4.26-apache در حال اجراست که دقیقاً یک نسخه پایین‌تر از نسخه اصلاح‌شده 8.4.27 قرار دارد.',
    bullets: [
      'گام اول در ارزیابی محیط: مشاهده کانتینرهای فعال Docker و بررسی Image و وضعیت سلامت آن‌ها.',
      'گام دوم: اجرای دستور `php -v` درون کانتینر `php2shell-target` برای تأیید دقیق نسخه Runtime.',
      'نسخه مشاهده‌شده `PHP 8.4.26` در شاخه 8.4 قرار دارد که پیش از انتشار وصله امنیتی در نسخه `8.4.27` منتشر شده و در محدوده آسیب‌پذیر PHP2Shell قرار می‌گیرد.',
    ],
    codeBlocks: [
      {
        label: 'Docker Target Inspection & PHP Version Check',
        language: 'bash',
        code: `$ docker ps --format '{{.Names}} {{.Image}} {{.Status}}'
php2shell-target php:8.4.26-apache Up 14 minutes

$ docker exec php2shell-target php -v
PHP 8.4.26 (cli) (built: Oct 2026) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.4.26, Copyright (c) Zend Technologies`,
      },
    ],
    diagramType: 'lab-docker-target',
    speakerNotes:
      'هم در تست نفوذ و هم در ممیزی امنیتی SOC، اولین گام شناسایی دقیق نسخه باینری در حال اجراست. همان‌طور که در خروجی دستور docker exec می‌بینیم، نسخه Zend Engine و PHP برابر 8.4.26 است و ساخت آن Non-Thread-Safe (NTS) متناسب با معماری Apache Prefork است.',
  },
  {
    id: 26,
    sectionId: 4,
    sectionTitle: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe',
    storyStage: 'Lab Demonstration',
    title: 'بررسی Application Code و اثبات آسیب‌پذیری در سطح Runtime',
    subtitle: 'مشاهده کل کد منبع فایل index.php درون کانتینر هدف',
    keyTakeaway: 'کد برنامه هدف تنها شامل `<?php echo "OK\\n"; ?>` است؛ یعنی هیچ‌گونه منطق ورودی، آپلود فایل، دیتابیس یا باگ کدنویسی در لایه وب‌سایت وجود ندارد.',
    bullets: [
      'با ارسال یک درخواست ساده از طریق `curl` به آدرس `http://127.0.0.1:8088/index.php` تنها عبارت `OK` دریافت می‌شود.',
      'بررسی محتوای فایل `/var/www/html/index.php` درون کانتینر نشان می‌دهد که کل برنامه یک دستور چاپ یک‌خطی است.',
      'در این برنامه هیچ اثری از Authentication، File Upload Handler، Database Query، User Input Processing یا Application-level Vulnerability دیده نمی‌شود.',
      'نتیجه کلیدی: این آزمایش به شکل تجربی و غیرقابل‌انکار اثبات می‌کند که کل Attack Surface در خود PHP Runtime قرار دارد.',
    ],
    codeBlocks: [
      {
        label: 'Inspecting HTTP Response & Target Source Code',
        language: 'bash',
        code: `$ curl -s http://127.0.0.1:8088/index.php
OK

$ docker exec php2shell-target cat /var/www/html/index.php
<?php echo "OK\\n"; ?>`,
      },
    ],
    diagramType: 'lab-minimal-surface',
    speakerNotes:
      'این اسلاید یکی از تأثیرگذارترین بخش‌های نمایش عملی است. وقتی کد منبع برنامه هدف را باز می‌کنیم و می‌بینیم کل فایل index.php فقط 22 بایت است و صرفاً عبارت OK را چاپ می‌کند، برای هر مهندس امنیتی روشن می‌شود که اسکنرهای SAST (تحلیل استاتیک کد منبع برنامه) هیچ شانسی برای یافتن این آسیب‌پذیری ندارند.',
  },
  {
    id: 27,
    sectionId: 4,
    sectionTitle: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe',
    storyStage: 'Lab Demonstration',
    title: 'بررسی ساختار Exploit و اجرای اولیه آزمایش',
    subtitle: 'مشاهده مراحل اجرایی PoC از چرخش Worker و نشت حافظه تا اثبات اجرای کد',
    keyTakeaway: 'اجرای اسکریپت exploit.py به ترتیب مراحل Worker Rotation، استخراج آدرس پایه Heap، استخراج آدرس libphp و اجرای دستور با خروجی PROOF را به نمایش می‌گذارد.',
    bullets: [
      'فایل‌های PoC آزمایشگاه در مسیر `~/php2shell-bypass-aslr-exp` شامل اسکریپت اصلی `exploit.py`، مستندات `README.md` / `readme_en.md` و پوشه‌های `src`، `tools` و `out` قرار دارند.',
      'هنگام اجرای `python3 exploit.py -u http://127.0.0.1:8088/index.php`، اسکریپت به صورت خودکار مراحل زنجیره حمله را طی می‌کند:',
      '۱. Worker Rotation و آماده‌سازی وضعیت حافظه ← ۲. Heap Leak (`chunk base`) ← ۳. Shared Library Leak (`libphp base`) ← ۴. Exploitation Stage و بازنویسی ساختار حافظه ← ۵. Execution Proof.',
    ],
    codeBlocks: [
      {
        label: 'Running PoC Exploit in Authorized Lab Environment',
        language: 'bash',
        code: `$ ls -lah ~/php2shell-bypass-aslr-exp
exploit.py  README.md  readme_en.md  src/  tools/  out/

$ cd ~/php2shell-bypass-aslr-exp
$ python3 exploit.py -u http://127.0.0.1:8088/index.php
[+] Rotating worker & priming heap layout...
[+] chunk base = 0x70d1a2c00000
[+] libphp base = 0x70d1a4911000
[+] Triggering control flow hijack via corrupted destructor...
PROOF: uid=33(www-data) gid=33(www-data) groups=33(www-data)`,
      },
    ],
    diagramType: 'lab-exploit-execution',
    speakerNotes:
      'در خروجی اجرای اسکریپت exploit.py تمام تئوری‌هایی که در بخش‌های دوم و سوم بررسی کردیم به صورت عملی دیده می‌شوند: ابتدا چرخش و آماده‌سازی Worker، سپس نشت آدرس پایه Heap و آدرس پایه libphp برای شکستن ASLR، و در نهایت اجرای دستور id و بازگشت رشته PROOF.',
  },
  {
    id: 28,
    sectionId: 4,
    sectionTitle: 'بخش چهارم: بازسازی عملی آزمایشگاه TryHackMe',
    storyStage: 'Lab Demonstration',
    title: 'دریافت Flag و اثبات نهایی اجرای دستور دلخواه',
    subtitle: 'اجرای دستور سفارشی برای خواندن فایل /f و ذخیره خروجی در مسیر مشترک',
    keyTakeaway: 'اجرای موفق دستور `cat /f>/out/p1` اثبات می‌کند که ارتباط شبکه، زنجیره بهره‌برداری حافظه و اجرای دستور سیستمی با سطح دسترسی وب‌سرور به طور کامل برقرار است.',
    bullets: [
      'در سناریوی نهایی آزمایشگاه TryHackMe، فایل Flag در مسیر ریشه کانتینر (`/f`) قرار گرفته است.',
      'اسکریپت PoC با سوئیچ `-c` امکان ارسال دستور دلخواه شل و با سوئیچ `--proof-file` امکان بررسی فایل خروجی در دایرکتوری مشترک `out/` را فراهم می‌کند.',
      'این آزمایش سه گزاره فنی را اثبات می‌نماید: ۱. برقراری ارتباط کامل با سرویس HTTP هدف، ۲. موفقیت زنجیره Exploit در تبدیل خطای حافظه به اجرای دستور روی هدف، و ۳. اجرای Command با سطح دسترسی کاربر وب‌سرور (`www-data`).',
      'تأکید اخلاقی و قانونی: این دستورات صرفاً برای ماشین آزمایشگاهی مجاز TryHackMe طراحی شده‌اند و هرگز نباید روی سیستم‌های فاقد مجوز اجرا شوند.',
    ],
    codeBlocks: [
      {
        label: 'Custom Command Execution & Flag Verification',
        language: 'bash',
        code: `$ python3 exploit.py -u http://127.0.0.1:8088/index.php \\
    -c 'cat /f>/out/p1' \\
    --proof-file out/p1

[+] chunk base = 0x70d1a2c00000
[+] libphp base = 0x70d1a4911000
[+] Command executed successfully!
PROOF: THM{PHP2SHELL_RUNTIME_MEMORY_CORRUPTION_VERIFIED}`,
      },
    ],
    diagramType: 'lab-flag-proof',
    speakerNotes:
      'در این مرحله می‌بینیم که چگونه مهاجم بدون دریافت پاسخ مستقیم در بدنه HTTP، خروجی دستور شل را درون یک فایل در مسیر قابل دسترس می‌نویسد (یا در سناریوهای واقعی از طریق کانال‌های جانبی استخراج می‌کند). این رفتار ایجاد فایل و اجرای شل، دقیقاً همان ردپایی است که در بخش بعدی (SOC Detection) به سراغ شکار آن می‌رویم.',
  },
  {
    id: 29,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'نگاه مرکز عملیات امنیت (SOC) به PHP2Shell',
    subtitle: 'فراتر از اسکن نسخه: کشف زنجیره بهره‌برداری از طریق همبستگی ۴ منبع Telemetry',
    keyTakeaway: 'تشخیص دقیق PHP2Shell در SOC نیازمند همبستگی زمانی (Correlation) میان لاگ درخواست HTTP، هدر پاسخ، خطای حافظه PHP و درخت فرآیندهای سیستم‌عامل است.',
    bullets: [
      'از دیدگاه SOC، صرفاً دانستن اینکه کدام سرور نسخه آسیب‌پذیر دارد کافی نیست؛ تحلیلگر باید بتواند تلاش برای Exploitation و موفقیت احتمالی آن را در Telemetry شناسایی کند.',
      'چهار ستون اصلی داده برای شکار این حمله: ۱. HTTP Request Logs ← ۲. HTTP Response Headers ← ۳. PHP & Apache Error Logs ← ۴. Endpoint & Process Telemetry.',
      'سناریوی همبستگی زنجیره‌ای در SOC: دریافت یک Multipart POST غیرعادی ← ثبت یک کوکی `PHPSESSID` بسیار بزرگ در Response ← ثبت خطای Memory / Crash در PHP Worker ← ایجاد یک فرآیند فرزند `sh` یا `bash` توسط `apache2`.',
      'مشاهده هم‌زمان یا متوالی این چهار رخداد، نشانه بسیار قوی از وقوع بهره‌برداری موفق PHP2Shell است.',
    ],
    diagramType: 'soc-4pillar-telemetry',
    speakerNotes:
      'چرا نگاه تک‌بعدی در SOC شکست می‌خورد؟ چون هر یک از این علائم به تنهایی می‌تواند مثبت کاذب (False Positive) داشته باشد: درخواست Multipart در سایت‌های عادی وجود دارد و خطای OOM هم ممکن است به خاطر باگ برنامه‌نویسی رخ دهد. اما وقتی این چهار تکه پازل در فاصله چند ثانیه از یکدیگر رخ می‌دهند، قطعیت تشخیص به شدت بالا می‌رود.',
  },
  {
    id: 30,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'Detection Indicator شماره ۱: غیرعادی بودن PHPSESSID در Response',
    subtitle: 'شکار مرحله Memory Disclosure از طریق پایش طول و ساختار هدر Set-Cookie',
    keyTakeaway: 'افزایش ناگهانی طول کوکی PHPSESSID در هدر Set-Cookie پاسخ سرور و وجود بایت‌های غیرمنتظره نسبت به Baseline، شاخص کلیدی مرحله افشای حافظه است.',
    bullets: [
      'در مرحله Memory Disclosure، داده نشت‌یافته از Heap درون هدر پاسخ `Set-Cookie: PHPSESSID=...` به سمت مهاجم ارسال می‌شود.',
      'موارد کلیدی جهت پایش در لاگ‌های Reverse Proxy / WAF / Web Server: طول غیرعادی Cookie (مثلاً چند صد یا چند هزار بایت به جای ۳۲ کاراکتر استاندارد)، کاراکترهای خارج از الگوی هگزادسیمال/حروفی، و تکرار این پاسخ‌ها به یک Source IP مشخص.',
      'نکته عملیاتی بسیار مهم برای مهندسان SOC: لاگ‌های پیش‌فرض Apache/Nginx (`Combined Log Format`) معمولاً هدرهای Response مانند `Set-Cookie` را ثبت نمی‌کنند؛ بنابراین باید ثبت طول یا مقدار این هدر در Reverse Proxy، WAF یا ماژول لاگینگ فعال شود.',
      'هشدار تحلیلی: بزرگ بودن یک کوکی به تنهایی اثبات قطعی Exploitation نیست و باید در کنار درخواست‌های مشکوک و وضعیت Worker تحلیل شود.',
    ],
    codeBlocks: [
      {
        label: 'Nginx / Apache Log Configuration for Capturing Set-Cookie Length',
        language: 'ini',
        code: `# در Nginx: افزودن هدر Set-Cookie پاسخ به فرمت لاگ برای دیدپذیری SOC
log_format soc_extended '$remote_addr - [$time_local] "$request" $status '
                        'req_len=$request_length '
                        'set_cookie="$sent_http_set_cookie"';`,
      },
    ],
    diagramType: 'soc-ind1-phpsessid',
    speakerNotes:
      'یکی از مهم‌ترین نکات مهندسی Detection در این اسلاید، بحث Visibility Gap (شکاف دیدپذیری) است. اگر تیم SOC قانون تشخیصی برای طول PHPSESSID بنویسد اما وب‌سرور اصلاً فیلد sent_http_set_cookie را لاگ نکند، آن قانون هرگز فعال نخواهد شد. بنابراین تنظیم Reverse Proxy برای ثبت اندازه هدرهای پاسخ گامی ضروری است.',
  },
  {
    id: 31,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'Detection Indicator شماره ۲: درخواست‌های Multipart POST غیرعادی',
    subtitle: 'تحلیل آنومالی‌های ساختاری و حجمی در ترافیک ورودی HTTP',
    keyTakeaway: 'ارسال درخواست‌های حجیم multipart/form-data با تعداد بالای Partها یا حاوی فیلد PHP_SESSION_UPLOAD_PROGRESS به مسیرهایی که اصلاً قابلیت آپلود ندارند، یک الگوی مشکوک قوی است.',
    bullets: [
      'ویژگی‌های مشکوک در ساختار درخواست: تعداد بسیار زیاد Multipart Parts، تعداد غیرعادی Header در هر Part، تعدد Form Fieldها، حجم غیرمتعارف بدنه درخواست و حضور فیلد `PHP_SESSION_UPLOAD_PROGRESS`.',
      'ناهنجاری زمینه‌ای (Contextual Anomaly): ارسال درخواست `POST` با `Content-Type: multipart/form-data` به Endpointهایی که در منطق برنامه هیچ فرمی برای آپلود فایل ندارند (مانند `/index.php`، `/login.php` یا صفحات استاتیک PHP).',
      'فیلدهای ضروری جهت استخراج از HTTP Logs: `Source IP`، `Destination IP`، `HTTP Method`، `URI`، `Content-Type`، `Request Size`، `Response Status`، `User-Agent` و نرخ تکرار درخواست‌ها در واحد زمان.',
      'یادآوری تحلیلی: وجود Multipart یا Upload Progress در سایت‌هایی که واقعاً فرم آپلود دارند طبیعی است؛ تشخیص باید بر مبنای انحراف از Baseline و همبستگی با سایر شاخص‌ها باشد.',
    ],
    diagramType: 'soc-ind2-multipart',
    speakerNotes:
      'در یک حمله واقعی که روی سروری با چندین Worker اجرا می‌شود، مهاجم مجبور است ده‌ها یا صدها درخواست Multipart POST پیاپی به یک صفحه ساده بفرستد تا هم Heap را به سقف OOM برساند و هم به همان Worker آلوده برخورد کند. این حجم و نرخ تکرار درخواست‌های Multipart از یک IP به یک URI غیرمرتبط با آپلود، در لاگ‌های وب کاملاً متمایز است.',
  },
  {
    id: 32,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'Detection Indicator شماره ۳: خطاهای Out Of Memory و Crash در Workerها',
    subtitle: 'ردپای تخریب حافظه و Bailout در لاگ‌های خطای PHP، Apache و سیستم‌عامل',
    keyTakeaway: 'ثبت مکرر پیام‌های Allowed memory size exhausted، zend_mm_heap corrupted و سیگنال‌های SIGSEGV / SIGABRT هم‌زمان با درخواست‌های Multipart نشانه تلاش برای تخریب حافظه است.',
    bullets: [
      'شرایط OOM و دست‌کاری ساختارهای Heap در لاگ‌های PHP و Web Server پیام‌های خطای مشخصی به جا می‌گذارند:',
      'پیام‌های کلیدی: `Allowed memory size exhausted`، `Out of memory` و پیام بسیار مهم `zend_mm_heap corrupted` (نشان‌دهنده تشخیص تخریب ساختار مدیریت حافظه Zend).',
      'علائم سیستمی در سطح Process: وقوع PHP Worker Crash، ری‌استارت شدن مکرر Apache Child Process، دریافت سیگنال‌های `SIGSEGV` (Segmentation Fault - کد ۱۱) یا `SIGABRT` (کد ۶) و جهش ناگهانی در Error Rate (کدهای 500/502).',
      'منابع لاگ جهت بررسی: Apache Error Log، PHP Error Log، PHP-FPM Error Log، System Journal (`journalctl`)، Docker Container Logs و هسته سیستم‌عامل (`dmesg`).',
    ],
    codeBlocks: [
      {
        label: 'Apache & PHP Error Log Samples During Exploitation',
        language: 'text',
        code: `[Mon Nov 02 12:41:08.114021 2026] [php:error] [pid 412] [client 10.10.14.5:51392] PHP Fatal error: Allowed memory size of 134217728 bytes exhausted (tried to allocate 65536 bytes) in Unknown on line 0
zend_mm_heap corrupted
[Mon Nov 02 12:41:09.402918 2026] [core:notice] [pid 1] AH00052: child pid 412 exit signal Segmentation fault (11)`,
      },
    ],
    diagramType: 'soc-ind3-oom-crash',
    speakerNotes:
      'توجه ویژه‌ای به عبارت "in Unknown on line 0" در لاگ خطای PHP داشته باشید! وقتی خطای Allowed memory size exhausted در خط 0 از فایل Unknown ثبت می‌شود، یعنی خطا قبل از شروع اجرای اسکریپت PHP (در همان فاز Request Startup / Multipart Parsing) رخ داده است. این دقیقاً امضای فنی رخداد OOM در مرحله پیش از اسکریپت است.',
  },
  {
    id: 33,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'Detection Indicator شماره ۴: اجرای فرآیند غیرعادی (Process Execution)',
    subtitle: 'تحلیل درخت فرآیند (Process Tree) برای کشف اجرای شل و دستورات سیستمی توسط وب‌سرور',
    keyTakeaway: 'مشاهده فرآیند والد apache2 یا php-fpm که فرآیندهای فرزندی مانند sh، bash، id، whoami، curl یا wget را با کاربر www-data ایجاد می‌کند، قوی‌ترین شاهد وقوع RCE است.',
    bullets: [
      'پس از موفقیت مرحله آخر Exploit (فراخوانی `system()` از طریق `pDestructor`)، فرآیند وب‌سرور یک پروسه فرزند برای اجرای دستور ایجاد می‌کند.',
      'الگوی کلاسیک در درخت فرآیند: Parent Process برابر با `apache2` (یا `httpd` / `php-fpm`) و Child Process برابر با `sh` یا `bash` که دستوراتی نظیر `whoami`، `id`، `uname`، `cat`، `curl` یا `wget` را اجرا می‌نماید.',
      'پارامترهای حیاتی در بررسی Endpoint Telemetry (EDR / Sysmon for Linux / Auditd): `Parent Process`، `Child Process`، `User (www-data)`، `Full Command Line`، `Process Start Time`، `Executable Path`، `Network Connections` و `File Creation Events`.',
      'توجه به Context: برخی برنامه‌های خاص ممکن است به طور مجاز ابزارهای سیستمی را فراخوانی کنند؛ بنابراین شناخت Baseline رفتاری سرور ضروری است.',
    ],
    codeBlocks: [
      {
        label: 'Endpoint Process Tree Telemetry (Auditd / EDR View)',
        language: 'text',
        code: `systemd (pid=1, user=root)
 └── apache2 -DFOREGROUND (pid=19, user=root)
      └── apache2 -DFOREGROUND (pid=418, user=www-data)   <-- Compromised PHP Worker
           └── /bin/sh -c "cat /f>/out/p1" (pid=891, user=www-data)
                └── cat /f (pid=892, user=www-data)`,
      },
    ],
    diagramType: 'soc-ind4-process-tree',
    speakerNotes:
      'در لایه Endpoint، وقتی تابع system() در زبان C فراخوانی می‌شود، به صورت استاندارد "/bin/sh -c <command>" را اجرا می‌کند. بنابراین در سیستم‌های EDR، Auditd یا Sysmon for Linux، دیدن پروسه‌ای که والد آن apache2 است و با آرگومان /bin/sh -c اجرا شده، بلافاصله باید یک هشدار با اولویت بالا (High/Critical Severity Alert) تولید کند.',
  },
  {
    id: 34,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'معماری منابع Telemetry برای Investigation جامع',
    subtitle: 'همبستگی داده‌ها در ۵ لایه: Web، PHP، Endpoint، Infrastructure و Network',
    keyTakeaway: 'ترکیب داده‌های ۵ لایه زیرساختی باعث می‌شود تحلیلگر SOC از بررسی یک Alert منفرد و مبهم به یک Incident Investigation کامل و مستند دست یابد.',
    bullets: [
      '۱. Web Layer: شامل Apache Access Logs، Apache Error Logs، Nginx Logs، Reverse Proxy Logs و WAF Logs.',
      '۲. PHP Layer: شامل PHP Error Logs، PHP-FPM Logs، Runtime Configuration (`php.ini`) و Session Configuration.',
      '۳. Endpoint Layer: شامل Process Creation، Command Line، Parent-Child Relationship، File Creation و Network Connections.',
      '۴. Infrastructure Layer: شامل Docker Logs، Container Events، System Journal، میزان مصرف Memory/CPU و Worker Restart Events.',
      '۵. Network Layer: شامل HTTP Method، Content-Type، Request Size، Response Header، Source IP و Destination IP.',
    ],
    table: {
      headers: ['لایه Telemetry', 'منابع داده کلیدی', 'شواهد قابل استخراج در حمله PHP2Shell'],
      rows: [
        ['Web & Network Layer', 'Reverse Proxy, WAF, Access Logs', 'POSTهای Multipart پرتکرار، حجم بالا، هدر Set-Cookie غیرعادی بزرگ'],
        ['PHP Runtime Layer', 'PHP Error Log, php.ini', 'Allowed memory size exhausted in Unknown on line 0، فعال بودن upload_progress'],
        ['Infrastructure Layer', 'Docker Events, System Journal', 'zend_mm_heap corrupted، خروج Worker با سیگنال SIGSEGV (11)'],
        ['Endpoint Layer', 'EDR, Auditd, Sysmon for Linux', 'اجرای /bin/sh -c توسط apache2 با کاربر www-data و ساخت فایل خروجی'],
      ],
    },
    diagramType: 'soc-5layer-correlation',
    speakerNotes:
      'این جدول مرجع سریعی برای تیم‌های شکار تهدید (Threat Hunting) و پاسخ به رخداد (DFIR) است تا بدانند در هر لایه از زیرساخت به دنبال چه شواهدی بگردند و چگونه آن‌ها را بر اساس Timestamp و Source IP به هم متصل کنند.',
  },
  {
    id: 35,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'نگاشت رفتار حمله به چارچوب MITRE ATT&CK',
    subtitle: 'طبقه‌بندی تکنیک‌های مشاهده‌شده در زنجیره بهره‌برداری PHP2Shell',
    keyTakeaway: 'نگاشت MITRE ATT&CK باید صرفاً بر اساس رفتار واقعی مشاهده‌شده در صحنه رخداد (تکنیک‌های T1190، T1059.004 و T1005) انجام شود، نه صرفاً وجود یک شناسه CVE.',
    bullets: [
      'T1190 — Exploit Public-Facing Application (Initial Access): مهاجم از طریق ارسال بسته‌های دست‌کاری‌شده به سرویس وب قابل دسترس در شبکه، آسیب‌پذیری PHP Runtime را مورد بهره‌برداری قرار می‌دهد.',
      'T1059.004 — Command and Scripting Interpreter: Unix Shell (Execution): پس از انحراف جریان اجرا به تابع `system()`، دستورات مهاجم از طریق شل یونیکس (`/bin/sh` یا `/bin/bash`) اجرا می‌شوند.',
      'T1005 — Data from Local System (Collection): هنگامی که مهاجم پس از کسب RCE اقدام به خواندن فایل‌های محلی حساس (مانند `/f` در آزمایشگاه، یا فایل‌های `.env` و کلیدها در محیط واقعی) می‌کند.',
      'اصل کلیدی تحلیلی: صرف وجود CVE روی یک سرور به معنای رخداد هر سه تکنیک نیست؛ نگاشت در گزارش حادثه باید مستند به شواهد واقعی لاگ‌ها باشد.',
    ],
    table: {
      headers: ['شناسه تکنیک', 'نام تکنیک (MITRE ATT&CK)', 'تاکتیک (Tactic)', 'شاهد متناظر در آزمایشگاه PHP2Shell'],
      rows: [
        ['T1190', 'Exploit Public-Facing Application', 'Initial Access', 'ارسال Multipart POST مخرب به پورت 8088 و ایجاد OOM/UAF'],
        ['T1059.004', 'Unix Shell', 'Execution', 'فراخوانی system() و ایجاد پروسه فرزند /bin/sh زیرمجموعه apache2'],
        ['T1005', 'Data from Local System', 'Collection', 'اجرای دستور cat /f > /out/p1 و استخراج داده حساس محلی'],
      ],
    },
    diagramType: 'mitre-attack-mapping',
    speakerNotes:
      'در مستندسازی رخدادهای امنیتی در SOC، استفاده دقیق از چارچوب MITRE ATT&CK زبان مشترکی بین تحلیلگران سطح ۱، شکارچیان تهدید و مدیران امنیت ایجاد می‌کند. در اینجا سه تاکتیک دسترسی اولیه، اجرا و جمع‌آوری داده دقیقاً منطبق بر شواهد آزمایشگاه نگاشت شده‌اند.',
  },
  {
    id: 36,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'SOC Detection',
    title: 'نمونه Detection Logic و کوئری شکار تهدید در Splunk',
    subtitle: 'شناسایی منابع پرتکرار ارسال‌کننده درخواست‌های Multipart حجیم و همبستگی با خطاها',
    keyTakeaway: 'کوئری Splunk با تجمیع تعداد درخواست‌ها، مجموع بایت‌های ارسالی و مسیرهای هدف به ازای هر Source IP، ناهنجاری‌های ترافیک Multipart را آشکار می‌سازد.',
    bullets: [
      'هدف کوئری پایه: شناسایی آدرس‌های IP مبدأ (`src_ip`) که تعداد بالایی درخواست `POST` با `content_type="multipart/form-data"` و حجم غیرعادی به مسیرهای وب ارسال می‌کنند.',
      'پارامترهای تکمیلی برای ساخت Rule پیشرفته در SIEM: افزودن شرط بررسی تعداد Multipart Partها، وجود فیلد `PHP_SESSION_UPLOAD_PROGRESS`، طول هدر پاسخ `Set-Cookie` (`PHPSESSID`) و همبستگی زمانی با لاگ‌های خطای PHP Worker.',
      'نکته اجرایی: نام دقیق فیلدها (`content_type`، `request_bytes`، `uri_path`) به نحوه Parsing و CIM Mapping در محیط Splunk سازمان بستگی دارد و باید بومی‌سازی شود.',
    ],
    codeBlocks: [
      {
        label: 'Splunk SPL — Hunting Abnormal Multipart POST Activity',
        language: 'splunk',
        code: `index=web sourcetype=access_combined method=POST
| search content_type="multipart/form-data*"
| stats count as request_count
        sum(request_bytes) as total_bytes
        max(response_cookie_len) as max_phpsessid_len
        values(uri_path) as targeted_paths
        by src_ip
| where request_count > 15 OR total_bytes > 10485760 OR max_phpsessid_len > 256
| sort - total_bytes`,
      },
    ],
    diagramType: 'splunk-detection-query',
    speakerNotes:
      'این کوئری Splunk یک نقطه شروع عملیاتی عالی برای تیم Threat Hunting است. در خطوط اول درخواست‌های POST از نوع Multipart فیلتر می‌شوند و سپس با دستور stats، تعداد درخواست‌ها، مجموع حجم بایت‌های ارسالی و مسیرهای هدف به تفکیک هر IP محاسبه می‌گردند تا منابع مهاجم که در حال بمباران Workerها برای ایجاد OOM و نشت حافظه هستند شناسایی شوند.',
  },
  {
    id: 37,
    sectionId: 5,
    sectionTitle: 'بخش پنجم: Detection و تحلیل SOC',
    storyStage: 'Incident Response',
    title: 'گردش کار ۷ مرحله‌ای بررسی رخداد (SOC Investigation Workflow)',
    subtitle: 'پلی‌بوک عملیاتی تحلیلگر SOC هنگام مشاهده هشدار مشکوک به PHP2Shell',
    keyTakeaway: 'یک پلی‌بوک ساختاریافته ۷ مرحله‌ای از شناسایی دارایی و تحلیل Request/Response تا بررسی پروسه، ارزیابی اثر و مهار نهایی، واکنش سریع و بدون خطا را تضمین می‌کند.',
    bullets: [
      'مرحله ۱ (Asset Identification): شناسایی Web Server، نسخه دقیق PHP، نوع SAPI (`mod_php` یا `PHP-FPM`) و بررسی Container Image.',
      'مرحله ۲ (Request Analysis): بررسی درخواست‌های HTTP POST، نوع Multipart، حجم Request، تعداد Partها و وجود فیلد Upload Progress.',
      'مرحله ۳ (Response Analysis): بررسی هدر `Set-Cookie`، تحلیل طول `PHPSESSID`، هدرهای غیرعادی و مقایسه با Baseline.',
      'مرحله ۴ (Runtime Analysis): بررسی PHP Error Logs، رخدادهای OOM، کرش کردن Worker و ری‌استارت شدن Processها.',
      'مرحله ۵ (Endpoint Investigation): بررسی رابطه Parent-Child پروسه‌ها، اجرای Shell، آرگومان‌های Command Line، ساخت فایل و اتصالات شبکه.',
      'مرحله ۶ (Impact Assessment): بررسی دسترسی احتمالی به فایل‌های حساس، Credentials، Session Data، API Keys و حرکت جانبی (Lateral Movement).',
      'مرحله ۷ (Containment & Remediation): مسدودسازی مهاجم، Patch کردن PHP، ری‌استارت کامل Workerها و چرخش کلیدها/نشست‌های افشاشده.',
    ],
    diagramType: 'soc-7step-workflow',
    speakerNotes:
      'وقتی یک هشدار در ساعت ۳ بامداد در SOC فعال می‌شود، تحلیلگر نباید سردرگم شود که از کجا شروع کند. این فلوچارت ۷ مرحله‌ای دقیقاً ترتیب منطقی بررسی را مشخص می‌کند: اول می‌فهیم آیا هدف اصلاً PHP آسیب‌پذیر دارد یا خیر (گام ۱)، سپس ترافیک شبکه (گام ۲ و ۳)، بعد لاگ‌های خطای مفسر (گام ۴)، سپس شواهد اجرای کد در سیستم‌عامل (گام ۵) و در نهایت ارزیابی خسارت و مهار (گام ۶ و ۷).',
  },
  {
    id: 38,
    sectionId: 6,
    sectionTitle: 'بخش ششم: Mitigation و Remediation',
    storyStage: 'Mitigation',
    title: 'راهکار اصلی و قطعی: Patch Management و نسخه‌های اصلاح‌شده',
    subtitle: 'ارتقای PHP Runtime به نسخه‌های وصله‌شده و الزام ری‌استارت کردن تمام Workerها',
    keyTakeaway: 'تنها راهکار کامل و قطعی برای رفع هر دو آسیب‌پذیری CVE-2026-109618 و CVE-2026-109619، ارتقای PHP به نسخه‌های اصلاح‌شده (8.5.12، 8.4.27، 8.3.36، 8.2.35) و ری‌استارت کامل Workerها است.',
    bullets: [
      'به‌روزرسانی بسته PHP یا Base Image مورد استفاده در کانتینرهای Docker به نسخه‌های رسمی اصلاح‌شده تنها درمان ریشه‌ای این آسیب‌پذیری‌ها است.',
      'الزام حیاتی پس از نصب وصله: تمام Processها و Workerهای فعال (Apache، PHP-FPM و غیره) باید به طور کامل Restart شوند تا هیچ Process قدیمی با کد باینری آسیب‌پذیر در حافظه باقی نماند.',
      'نکته مهم درباره Security Backporting: در توزیع‌های سازمانی لینوکس (مانند RHEL، Ubuntu LTS و Debian)، ممکن است وصله امنیتی روی نسخه ظاهری قدیمی‌تر Backport شود؛ بنابراین بررسی `Package Changelog` و بولتن امنیتی توزیع ضروری است.',
    ],
    table: {
      headers: ['شاخه PHP (Branch)', 'نسخه آسیب‌پذیر در آزمایشگاه / قبل از وصله', 'نسخه اصلاح‌شده رسمی (Patched Release)', 'وضعیت ایمنی در برابر PHP2Shell'],
      rows: [
        ['PHP 8.5', '< 8.5.12', 'PHP 8.5.12', 'ایمن‌شده (Patched)'],
        ['PHP 8.4', '8.4.26 (نسخه هدف آزمایشگاه)', 'PHP 8.4.27', 'ایمن‌شده (Patched)'],
        ['PHP 8.3', '< 8.3.36', 'PHP 8.3.36', 'ایمن‌شده (Patched)'],
        ['PHP 8.2', '< 8.2.35', 'PHP 8.2.35', 'ایمن‌شده (Patched)'],
      ],
    },
    diagramType: 'patch-management-table',
    speakerNotes:
      'این جدول نسخه‌های اصلاح‌شده باید مستقیماً در اختیار تیم مدیریت آسیب‌پذیری (Vulnerability Management) و تیم DevOps قرار بگیرد. نکته بسیار مهم برای اسکنرهای آسیب‌پذیری که صرفاً بنر نسخه را می‌خوانند، موضوع Security Backport در توزیع‌هایی مثل Ubuntu یا Red Hat است که باید از طریق dpkg یا rpm changelog بررسی شود.',
  },
  {
    id: 39,
    sectionId: 6,
    sectionTitle: 'بخش ششم: Mitigation و Remediation',
    storyStage: 'Mitigation',
    title: 'Mitigation موقت: غیرفعال کردن Session Upload Progress',
    subtitle: 'کاهش سطح حمله در شرایطی که اعمال فوری Patch امکان‌پذیر نیست',
    keyTakeaway: 'تنظیم `session.upload_progress.enabled = 0` مسیرهای بهره‌برداری وابسته به Upload Progress را مسدود می‌کند، اما جایگزین کامل Patch برای تمام مسیرهای OOM نیست.',
    bullets: [
      'اگر به دلایل عملیاتی امکان ارتقای فوری باینری PHP وجود ندارد، اولین اقدام کاهش ریسک (Workaround)، غیرفعال کردن قابلیت Upload Progress در فایل تنظیمات PHP است.',
      'با قرار دادن `session.upload_progress.enabled = 0`، موتور PHP در هنگام دریافت درخواست‌های Multipart وارد مسیر ثبت وضعیت پیشرفت آپلود در Session نمی‌شود.',
      'محدودیت امنیتی مهم: این تنظیم صرفاً بردارهای حمله‌ای را که به `session.upload_progress` متکی هستند محدود می‌کند و تمام مسیرهای بالقوه Out-Of-Memory Corruption را پوشش نمی‌دهد.',
      'الزامات اجرایی: ۱. بررسی عدم وابستگی رابط کاربری برنامه به نوار پیشرفت آپلود بر پایه Session، و ۲. ری‌استارت کردن تمام PHP Workerها پس از اعمال تغییر.',
    ],
    codeBlocks: [
      {
        label: 'Disabling Upload Progress & Restarting Services',
        language: 'bash',
        code: `# ۱. افزودن یا ویرایش تنظیم در php.ini یا فایل کانفیگ SAPI:
session.upload_progress.enabled = 0

# ۲. ری‌استارت کامل وب‌سرور یا PHP-FPM برای اعمال تغییر و پاک شدن حافظه Workerها:
sudo systemctl restart apache2
# یا در معماری PHP-FPM:
sudo systemctl restart php8.4-fpm`,
      },
    ],
    diagramType: 'mitigation-upload-progress',
    speakerNotes:
      'در دنیای واقعی، گاهی ارتقای نسخه PHP در یک کلاستر بزرگ نیازمند پنجره تعمیراتی (Maintenance Window) و تست رگرسیون است. غیرفعال کردن session.upload_progress.enabled یک اقدام سریع و کم‌هزینه است که زنجیره استاندارد PoCهای متکی به این ویژگی را می‌شکند تا تیم زیرساخت فرصت اعمال Patch اصلی را پیدا کند.',
  },
  {
    id: 40,
    sectionId: 6,
    sectionTitle: 'بخش ششم: Mitigation و Remediation',
    storyStage: 'Mitigation',
    title: 'سایر اقدامات دفاع در عمق و کاهش ریسک (Defense-in-Depth)',
    subtitle: '۶ کنترل مکمل در لایه شبکه، سیستم‌عامل، پیکربندی و زیرساخت کانتینری',
    keyTakeaway: 'ترکیب محدودیت‌های Multipart در Reverse Proxy، اصل Least Privilege و مدیریت ایمیج‌های کانتینری، مقاومت زیرساخت را در برابر بهره‌برداری به شدت افزایش می‌دهد.',
    bullets: [
      '۱. محدود کردن Multipart Request: اگر Application یا مسیرهای خاصی به File Upload نیاز ندارند، درخواست‌های `multipart/form-data` را در لایه Reverse Proxy یا Network Edge مسدود کنید.',
      '۲. اعمال محدودیت روی Request Size و تعداد Partها: تنظیم دقیق `post_max_size`، `max_file_uploads` و `max_input_vars` به همراه محدودیت بدنه در Nginx/Apache.',
      '۳. اصل Least Privilege: اجرای حتمی PHP Worker با حداقل دسترسی لازم (کاربر غیرممتاز مانند `www-data`) و پرهیز مطلق از اجرا با دسترسی `root`.',
      '۴. ممیزی تنظیمات PHP: بازبینی دقیق پارامترهای Session، Upload و `memory_limit` متناسب با نیاز واقعی برنامه.',
      '۵. Restart منظم Workerها: توقف کامل Workerهای قدیمی پس از هرگونه تغییر Configuration یا Patch جهت پاک شدن هرگونه State قبلی در حافظه.',
      '۶. Container Image Management: بازسازی (Rebuild) و استقرار مجدد ایمیج‌های Docker و پادهای Kubernetes بر پایه Base Image اصلاح‌شده.',
    ],
    table: {
      headers: ['اقدام دفاعی (Control)', 'لایه پیاده‌سازی', 'نوع اثرگذاری امنیتی', 'جایگزین کامل Patch؟'],
      rows: [
        ['ارتقای PHP به 8.4.27 / 8.3.36 / 8.2.35', 'PHP Runtime / Container Image', 'رفع ریشه‌ای هر دو CVE در موتور Zend', 'بله (راهکار قطعی)'],
        ['session.upload_progress.enabled = 0', 'پیکربندی PHP (php.ini)', 'حذف بردار حمله مبتنی بر Session Upload Progress', 'خیر (Mitigation موقت)'],
        ['مسدودسازی/محدودسازی Multipart در Edge', 'Reverse Proxy / WAF', 'جلوگیری از رسیدن بسته‌های حجیم به PHP SAPI', 'خیر (لایه مکمل)'],
        ['اجرای Worker با کاربر محدود (Least Privilege)', 'OS / Container Security', 'محدود کردن سطح دسترسی مهاجم پس از وقوع RCE', 'خیر (کاهش خسارت Post-Exploit)'],
      ],
    },
    diagramType: 'risk-reduction-6controls',
    speakerNotes:
      'این اسلاید و جدول مقایسه‌ای آن به مدیران امنیت نشان می‌دهد که چگونه کنترل‌های پیشگیرانه (Preventive) و کنترل‌های کاهنده اثر (Mitigating) در کنار هم قرار می‌گیرند. به‌ویژه در محیط‌های Kubernetes، صرفاً اجرای apt upgrade داخل کانتینر در حال اجرا کافی نیست و باید ایمیج در پایپ‌لاین CI/CD بازسازی شود.',
  },
  {
    id: 41,
    sectionId: 6,
    sectionTitle: 'بخش ششم: Mitigation و Remediation',
    storyStage: 'Mitigation',
    title: 'چرا WAF به‌تنهایی کافی نیست؟ (تحلیل محل قرارگیری WAF)',
    subtitle: 'مقایسه WAF ماژولار داخل Runtime با WAF مستقل در لایه Reverse Proxy / Edge',
    keyTakeaway: 'WAFهایی که در سطح PHP یا Application اجرا می‌شوند به دلیل رخداد آسیب‌پذیری در مرحله پیش از اسکریپت دور زده می‌شوند، و WAFهای شبکه نیز جایگزین Patch نیستند.',
    bullets: [
      'محل اجرای WAF (Deployment Architecture) اهمیت تعیین‌کننده‌ای در اثربخشی آن در برابر PHP2Shell دارد.',
      'اگر WAF به صورت یک PHP Extension/Module یا کتابخانه داخل خود کد برنامه اجرا شود، ممکن است اصلاً فرصت بررسی درخواست‌هایی را که در فاز اولیه Request Parsing باعث OOM و Bailout می‌شوند پیدا نکند.',
      'در مقابل، یک Reverse Proxy یا WAF مستقل در لبه شبکه (پیش از رسیدن درخواست به PHP) می‌تواند الگوهای غیرعادی Multipart یا هدرهای مشکوک را فیلتر کند.',
      'با این حال چرا WAF شبکه هم کافی نیست؟ ۱. WAF جایگزین Patch نیست، ۲. امضاهای (Signatures) WAF ممکن است در برابر تغییرات شکل Request دور زده شوند، و ۳. مسدودسازی سخت‌گیرانه Multipart می‌تواند قابلیت آپلود قانونی کاربران را مختل کند.',
    ],
    diagramType: 'waf-placement-analysis',
    speakerNotes:
      'این اسلاید به یک باور اشتباه رایج در سازمان‌ها پاسخ می‌دهد که می‌گویند: «ما WAF داریم، پس نیازی به پچ فوری سرورها نیست». اولاً اگر WAF از نوع پلاگین وردپرس یا پکیج لاراول باشد، کاملاً بی‌اثر است چون کد حمله قبل از رسیدن به برنامه اجرا می‌شود. ثانیاً حتی WAF لبه شبکه نیز در برابر تکنیک‌های Evasion در پروتکل Multipart آسیب‌پذیر است.',
  },
  {
    id: 42,
    sectionId: 6,
    sectionTitle: 'بخش ششم: Mitigation و Remediation',
    storyStage: 'Mitigation',
    title: 'چرا آپدیت کردن WordPress یا Laravel کافی نیست؟',
    subtitle: 'تفاوت بنیادین میان Application Patch و Runtime Patch در مدیریت آسیب‌پذیری',
    keyTakeaway: 'به‌روزرسانی فریم‌ورک‌ها یا سیستم‌های مدیریت محتوا (Laravel، WordPress، Drupal) فقط کدهای PHP را تغییر می‌دهد و باینری آسیب‌پذیر PHP Runtime (مانند 8.4.26) همچنان آسیب‌پذیر باقی می‌ماند.',
    bullets: [
      'سناریوی واقعی در سازمان‌ها: یک شرکت از فریم‌ورک Laravel (یا سیستم‌های WordPress، Drupal و Joomla) روی مفسر `PHP 8.4.26` استفاده می‌کند.',
      'تیم توسعه با اجرای `composer update` یا آپدیت هسته وردپرس، فریم‌ورک و کتابخانه‌های برنامه را به آخرین نسخه ارتقا می‌دهد.',
      'خطای راهبردی: با این کار فقط فایل‌های اسکریپتی لایه Application به‌روزرسانی شده‌اند، اما باینری مفسر PHP (`libphp.so` یا `php-fpm`) همچنان نسخه آسیب‌پذیر `8.4.26` است.',
      'پیامد: برای رفع کامل PHP2Shell باید بسته سیستم‌عاملی یا ایمیج کانتینر PHP Runtime اصلاح شود، نه صرفاً کدهای Application.',
    ],
    diagramType: 'framework-vs-runtime-patch',
    speakerNotes:
      'تفاوت میان اجرای composer update (در سطح برنامه) و apt upgrade php / تغییر تگ ایمیج داکر (در سطح Runtime) باید به روشنی برای تیم‌های توسعه و عملیات تبیین شود. PHP2Shell در فایل‌های باینری کامپایل‌شده زبان C در موتور PHP قرار دارد، نه در فایل‌های .php پروژه.',
  },
  {
    id: 43,
    sectionId: 7,
    sectionTitle: 'بخش هفتم: نتیجه‌گیری و منابع',
    storyStage: 'Conclusion',
    title: '۱۰ درس کلیدی امنیتی از مطالعه موردی PHP2Shell',
    subtitle: 'نکات راهبردی برای مهندسان امنیت، تحلیلگران SOC و تیم‌های زیرساخت',
    keyTakeaway: 'از شناخت Attack Surface در لایه مفسر تا ضرورت همبستگی چندلایه در SOC؛ ۱۰ اصل بنیادین که از تحلیل فنی PHP2Shell استخراج می‌شوند.',
    bullets: [
      '۱. امنیت وب‌سایت فقط به Application Code محدود نمی‌شود و ۲. Runtime و Interpreter نیز بخش مهمی از Attack Surface هستند.',
      '۳. مدیریت نادرست Memory و Exception (مانند Bailout ناقص) می‌تواند به آسیب‌پذیری‌های بحرانی منجر شود.',
      '۴. Memory Disclosure می‌تواند اثربخشی مکانیزم دفاعی ASLR را از بین ببرد و ۵. Use-After-Free یکی از خطرناک‌ترین کلاس‌های Memory Corruption است.',
      '۶. اجرای موفق RCE الزاماً به معنی دسترسی Root نیست و سطح دسترسی تابع مجوزهای Process وب‌سرور است.',
      '۷. Detection مؤثر در SOC نیازمند Correlation میان Web Logs، Runtime Logs و Endpoint Telemetry است.',
      '۸. WAF به‌تنهایی نمی‌تواند تمام آسیب‌پذیری‌های Runtime را پوشش دهد.',
      '۹. Patch Management باید شامل PHP Runtime، Container Image و ری‌استارت کردن تمام Workerهای فعال باشد.',
      '۱۰. حتی Applicationهایی که از نظر Source Code کاملاً سالم و بدون باگ هستند ممکن است قربانی آسیب‌پذیری‌های Runtime شوند.',
    ],
    diagramType: 'ten-security-lessons',
    speakerNotes:
      'این ده درس، چکیده تمام مباحث فنی ۴۲ اسلاید گذشته است و می‌تواند به عنوان چک‌لیست ممیزی امنیتی در سازمان مورد استفاده قرار گیرد.',
  },
  {
    id: 44,
    sectionId: 7,
    sectionTitle: 'بخش هفتم: نتیجه‌گیری و منابع',
    storyStage: 'Conclusion',
    title: 'جمع‌بندی نهایی: A Secure Application Requires a Secure Runtime',
    subtitle: 'مرور کلی زنجیره تبدیل نقص مدیریت حافظه به RCE و اولویت‌های دفاعی',
    keyTakeaway: 'A secure application requires a secure runtime — امنیت پایدار نیازمند وصله کردن به‌موقع Runtime و دیدپذیری چندلایه در SOC است.',
    bullets: [
      'PHP2Shell نمونه‌ای شاخص از زنجیره‌ای است که در آن یک نقص در مدیریت حافظه و وضعیت داخلی Runtime در شرایط خطا، به یک حمله کامل Unauthenticated Remote Code Execution تبدیل می‌شود.',
      'این زنجیره از مراحل اولیه پردازش Request آغاز شده و با Memory Corruption، Memory Disclosure، شکستن ASLR و دست‌کاری جریان اجرای برنامه (`pDestructor`) تا اجرای دستور با سطح دسترسی Web Server ادامه می‌یابد.',
      'اولویت اول دفاعی: به‌روزرسانی فوری PHP به نسخه‌های اصلاح‌شده (8.5.12، 8.4.27، 8.3.36، 8.2.35) و Restart کردن تمام Workerها.',
      'اولویت اول پایش در SOC: ترکیب تله‌متری درخواست‌های Multipart، طول کوکی `PHPSESSID` در پاسخ، لاگ‌های خطای OOM/Heap و درخت فرآیندهای سیستم‌عامل.',
    ],
    diagramType: 'executive-summary-chain',
    speakerNotes:
      'پیام پایانی این ارائه روشن است: A secure application requires a secure runtime. هیچ برنامه‌ای در خلأ اجرا نمی‌شود و امنیت لایه‌های زیرین اجرای کد به اندازه امنیت خود کد برنامه حیاتی است.',
  },
  {
    id: 45,
    sectionId: 7,
    sectionTitle: 'بخش هفتم: نتیجه‌گیری و منابع',
    storyStage: 'Conclusion',
    title: 'منابع رسمی و References',
    subtitle: 'مستندات رسمی PHP، بولتن‌های امنیتی GitHub، CERT-EU، Red Hat و استانداردهای MITRE',
    keyTakeaway: 'فهرست کامل ۱۲ مرجع رسمی جهت پیگیری جزئیات فنی، وصله‌ها و استانداردهای طبقه‌بندی آسیب‌پذیری',
    bullets: [
      '1. PHP Official Security Advisory — https://www.php.net/archive/2026.php#2026-10-21-5',
      '2. PHP Official Changelog (PHP 8 Series) — https://www.php.net/ChangeLog-8.php',
      '3. GitHub Security Advisory (CVE-2026-109618) — https://github.com/php/php-src/security/advisories/GHSA-w8hw-w9fx-j79w',
      '4. GitHub Security Advisory (CVE-2026-109619) — https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp',
      '5. PHP 8.4.27 Release Announcement — https://news-web.php.net/php.announce/512',
      '6. Red Hat Security Advisory (PHP2Shell) — https://access.redhat.com/security/vulnerabilities/RHSB-2026-013',
      '7. CERT-EU Security Advisory 2026-018 — https://cert.europa.eu/publications/security-advisories/2026-018/',
      '8. MITRE CWE-416: Use After Free — https://cwe.mitre.org/data/definitions/416.html',
      '9. MITRE CWE-824: Access of Uninitialized Pointer — https://cwe.mitre.org/data/definitions/824.html',
      '10. MITRE ATT&CK T1190: Exploit Public-Facing Application — https://attack.mitre.org/techniques/T1190/',
      '11. MITRE ATT&CK T1059.004: Unix Shell — https://attack.mitre.org/techniques/T1059/004/',
      '12. TryHackMe — PHP2Shell Lab (منبع عملی بازسازی آزمایشگاه و مشاهده زنجیره Exploitation)',
    ],
    diagramType: 'references-official',
    speakerNotes:
      'تمامی ۱۲ منبع رسمی شامل اطلاعیه‌های امنیتی PHP، مخزن رسمی php-src در گیت‌هاب، هشدارهای CERT-EU و Red Hat، تعاریف CWE و تکنیک‌های MITRE ATT&CK در این اسلاید پایانی گردآوری شده‌اند تا تیم‌های امنیتی بتوانند مستندات مرجع را مستقیماً بررسی کنند.',
  },
];
