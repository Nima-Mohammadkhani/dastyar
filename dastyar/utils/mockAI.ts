const greetings = ['سلام', 'hello', 'hi', 'درود', 'هلو', 'خوبی', 'چطوری'];
const codeKeywords = ['کد', 'برنامه', 'پایتون', 'جاوا', 'javascript', 'python', 'code', 'function', 'کلاس', 'class'];
const mathKeywords = ['محاسبه', 'جمع', 'ضرب', 'تقسیم', 'عدد', 'فرمول', 'ریاضی', 'math', 'حساب'];
const explainKeywords = ['توضیح', 'چیه', 'چیست', 'یعنی چی', 'چطور', 'چگونه', 'explain', 'what is', 'how'];
const translationKeywords = ['ترجمه', 'translate', 'معنی', 'انگلیسی', 'فارسی', 'english'];
const thankKeywords = ['ممنون', 'مرسی', 'thanks', 'thank', 'ممنونم', 'خوب بود', 'عالی'];

function contains(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

export function generateAIResponse(query: string): string {
  const q = query.toLowerCase().trim();

  if (contains(q, greetings)) {
    const options = [
      'سلام! خوشحالم که اینجایی. چطور می‌تونم کمکت کنم؟',
      'درود! آماده‌ام تا بهترین پاسخ رو بهت بدم. سوالت چیه؟',
      'سلام سلام! بپرس، جواب میدم 😊',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (contains(q, thankKeywords)) {
    const options = [
      'خوشحالم که تونستم کمک کنم! اگه سوال دیگه‌ای داری بپرس.',
      'ممنون که وقت گذاشتی. هر وقت سوال داشتی در خدمتتم.',
      'با کمال میل! 🙌',
    ];
    return options[Math.floor(Math.random() * options.length)];
  }

  if (contains(q, codeKeywords)) {
    return `می‌تونم در مورد کدنویسی کمکت کنم. برای اینکه بهترین پاسخ رو بدم، لطفاً بیشتر توضیح بده:

- چه زبان برنامه‌نویسی؟
- چه مشکلی داری؟
- کدت رو اشتراک‌گذاری کن تا بررسی کنم

من با Python، JavaScript، TypeScript، Go، Java و اکثر زبون‌های معروف آشنام.`;
  }

  if (contains(q, mathKeywords)) {
    return `برای حل مسائل ریاضی اینجام! سوالت رو کامل بنویس تا مرحله‌به‌مرحله حلش کنم. اگه فرمول یا نمودار هم نیاز داری بگو.`;
  }

  if (contains(q, translationKeywords)) {
    return `خوشحال میشم ترجمه کنم! متنی که می‌خوای ترجمه بشه رو بنویس و بگو از چه زبانی به چه زبانی ترجمه بشه.`;
  }

  if (contains(q, explainKeywords)) {
    return `سوال خوبیه! بذار توضیح بدم:

این موضوع یه مفهوم مهمه که خیلی کاربرد داره. برای درک بهتر، می‌تونم مثال بزنم و مرحله به مرحله جلو برم. می‌خوای بیشتر توضیح بدم یا جنبه خاصی رو بررسی کنیم؟`;
  }

  const genericResponses = [
    `پرسش جالبیه! بذار از چند زاویه نگاهش کنیم:\n\n۱. اول باید بدونیم که چه هدفی داریم\n۲. بعد بهترین رویکرد رو انتخاب کنیم\n۳. و در نهایت به نتیجه مطلوب برسیم\n\nآیا می‌خوای بیشتر در این مورد صحبت کنیم؟`,
    `سوال خوبیه. جواب کوتاهش اینه که باید با توجه به شرایط تصمیم گرفت. اگه بیشتر توضیح بدی بهتر می‌تونم کمک کنم.`,
    `این یه موضوع مهمه که خیلی‌ها باهاش سروکار دارن. پیشنهادم اینه که اول کلیات رو مشخص کنیم و بعد وارد جزئیات بشیم. بیشتر بگو تا بتونم دقیق‌تر پاسخ بدم.`,
    `جالبه! من می‌تونم از تجربه‌ام کمک کنم. بذار ببینم بهترین راه‌حل چیه...\n\nاگه اطلاعات بیشتری بدی، جواب دقیق‌تری می‌تونم بدم.`,
    `ممنون که پرسیدی. این سوال جنبه‌های مختلفی داره که ارزش بررسی داره. آماده‌ام مفصل‌تر توضیح بدم — فقط بگو از کجا شروع کنیم.`,
  ];

  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}
