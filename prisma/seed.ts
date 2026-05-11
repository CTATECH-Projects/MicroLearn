import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

interface QuizData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonData {
  title: string;
  description: string;
  content: string;
  duration: number;
  quizzes: QuizData[];
}

interface TrackData {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: LessonData[];
}

const SEED_DATA: TrackData[] = [
  {
    id: "cybersecurity-basics",
    title: "Cybersecurity Basics",
    description:
      "Learn essential cybersecurity concepts to protect yourself online",
    icon: "🛡️",
    color: "#3B4FFF",
    lessons: [
      {
        title: "Understanding Passwords",
        description: "Learn how to create and manage strong passwords",
        content:
          "Passwords are the first line of defense against unauthorized access. A strong password should be at least 12 characters long, include uppercase and lowercase letters, numbers, and special characters. Never share your passwords or reuse them across multiple accounts.",
        duration: 5,
        quizzes: [
          {
            question:
              "What is the minimum recommended length for a strong password?",
            options: [
              "6 characters",
              "8 characters",
              "12 characters",
              "16 characters",
            ],
            correctAnswer: 2,
            explanation:
              "A strong password should be at least 12 characters long to provide adequate security.",
          },
          {
            question: "Which of these is a strong password?",
            options: ["password123", "Admin@2024!", "qwerty", "aaaaaaaaa"],
            correctAnswer: 1,
            explanation:
              "Strong passwords include uppercase, lowercase, numbers, and special characters.",
          },
          {
            question: "Should you reuse passwords across different accounts?",
            options: [
              "Yes, for convenience",
              "No, use unique passwords",
              "Only for important accounts",
              "Only on secure sites",
            ],
            correctAnswer: 1,
            explanation:
              "Always use unique passwords for different accounts to prevent widespread compromise if one is breached.",
          },
          {
            question:
              "What should you do if you suspect a password is compromised?",
            options: [
              "Wait a few days",
              "Change it immediately",
              "Tell your friends",
              "Ignore it",
            ],
            correctAnswer: 1,
            explanation:
              "Immediately change your password if you suspect it has been compromised.",
          },
          {
            question:
              "Which is safer: sharing a password with a trusted person or using a password manager?",
            options: [
              "Sharing with trusted person",
              "Using a password manager",
              "Both are equally safe",
              "Neither is safe",
            ],
            correctAnswer: 1,
            explanation:
              "Using a password manager is safer than sharing passwords, even with trusted individuals.",
          },
        ],
      },
      {
        title: "Recognizing Phishing Attacks",
        description: "Identify and avoid phishing scams",
        content:
          "Phishing is a social engineering attack where attackers trick you into revealing sensitive information. Common signs include suspicious sender addresses, urgent language, requests for passwords, and links that don't match the supposed sender.",
        duration: 6,
        quizzes: [
          {
            question: "What is phishing?",
            options: [
              "A fishing technique",
              "A social engineering attack",
              "A type of software",
              "A computer virus",
            ],
            correctAnswer: 1,
            explanation:
              "Phishing is a social engineering attack where attackers attempt to deceive users into revealing sensitive information.",
          },
          {
            question: "Which sign indicates a phishing email?",
            options: [
              "Professional formatting",
              "Sender's real name",
              "Urgent language requesting action",
              "Company logo",
            ],
            correctAnswer: 2,
            explanation:
              "Phishing emails often use urgent language to pressure you into taking action without thinking.",
          },
          {
            question:
              "What should you do if you receive a suspicious email from your bank?",
            options: [
              "Click the link to verify",
              "Call the bank using the number on the email",
              "Contact your bank using a known phone number",
              "Reply with your information",
            ],
            correctAnswer: 2,
            explanation:
              "Always contact your bank directly using a known phone number, not information provided in the email.",
          },
          {
            question:
              "Can phishing emails look exactly like legitimate emails?",
            options: [
              "No, they always look suspicious",
              "Yes, they can be very convincing",
              "Only sometimes",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Modern phishing attacks can be very convincing and closely mimic legitimate emails.",
          },
          {
            question: "What is the safest action with a suspicious link?",
            options: [
              "Click it carefully",
              "Hover over it to see the real URL",
              "Delete the email",
              "Forward it to others",
            ],
            correctAnswer: 2,
            explanation:
              "The safest action is to delete the email or report it as phishing.",
          },
        ],
      },
      {
        title: "Two-Factor Authentication",
        description: "Secure your accounts with 2FA",
        content:
          "Two-factor authentication (2FA) adds an extra layer of security by requiring a second form of verification. This could be a code from your phone, a biometric scan, or a physical security key.",
        duration: 4,
        quizzes: [
          {
            question: "What is two-factor authentication?",
            options: [
              "Using two passwords",
              "A second password",
              "Verification using two different methods",
              "Two email addresses",
            ],
            correctAnswer: 2,
            explanation:
              "Two-factor authentication requires verification using two different methods, such as password and a code.",
          },
          {
            question: "Which is NOT a valid 2FA method?",
            options: [
              "SMS code",
              "Authenticator app",
              "Longer password",
              "Biometric scan",
            ],
            correctAnswer: 2,
            explanation:
              "A longer password is still just one factor. Valid 2FA methods require a second independent factor.",
          },
          {
            question: "Is 2FA really necessary?",
            options: [
              "No, passwords are enough",
              "Yes, it significantly increases security",
              "Only for banking",
              "Only for social media",
            ],
            correctAnswer: 1,
            explanation:
              "Two-factor authentication significantly increases security for any account, not just specific types.",
          },
          {
            question:
              "What should you do if you lose access to your 2FA method?",
            options: [
              "Create a new account",
              "Keep the backup codes safe",
              "Contact account support",
              "Both B and C",
            ],
            correctAnswer: 3,
            explanation:
              "Keep backup codes safe and contact support if you lose access to ensure account recovery.",
          },
          {
            question: "Which 2FA method is most secure?",
            options: [
              "SMS codes",
              "Email codes",
              "Hardware security keys",
              "All are equally secure",
            ],
            correctAnswer: 2,
            explanation:
              "Hardware security keys are considered the most secure form of 2FA.",
          },
        ],
      },
      {
        title: "Secure Browsing Habits",
        description: "Browse the internet safely",
        content:
          "Safe browsing habits include checking for HTTPS, avoiding public WiFi for sensitive tasks, using a VPN, and keeping your browser updated. Be cautious about what you download and which sites you visit.",
        duration: 5,
        quizzes: [
          {
            question: "What does HTTPS indicate?",
            options: [
              "A faster connection",
              "An encrypted connection",
              "A secure website",
              "A government website",
            ],
            correctAnswer: 1,
            explanation:
              "HTTPS indicates an encrypted connection between your browser and the website.",
          },
          {
            question: "Is it safe to enter passwords on public WiFi?",
            options: [
              "Yes, if the site is popular",
              "No, use a VPN or wait",
              "Yes, always safe",
              "Only on social media",
            ],
            correctAnswer: 1,
            explanation:
              "Avoid entering passwords on public WiFi without a VPN, as data can be intercepted.",
          },
          {
            question: "What is a VPN?",
            options: [
              "A virus protection tool",
              "A Virtual Private Network",
              "A password manager",
              "An email service",
            ],
            correctAnswer: 1,
            explanation:
              "A VPN (Virtual Private Network) encrypts your internet traffic and masks your location.",
          },
          {
            question: "Should you keep your browser updated?",
            options: [
              "No, it slows things down",
              "Yes, updates fix security vulnerabilities",
              "Only once a year",
              "It doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Browser updates are critical as they patch security vulnerabilities.",
          },
          {
            question: "What should you do before downloading a file?",
            options: [
              "Download it immediately",
              "Check the source and scan for malware",
              "Ask a friend",
              "Nothing special",
            ],
            correctAnswer: 1,
            explanation:
              "Always verify the source and scan downloads for malware before opening them.",
          },
        ],
      },
      {
        title: "Social Engineering Tactics",
        description: "Understand manipulation techniques",
        content:
          "Social engineering uses psychological manipulation to trick people into revealing confidential information. Common tactics include pretexting, baiting, tailgating, and authority figures. Being aware of these tactics is your best defense.",
        duration: 6,
        quizzes: [
          {
            question: "What is social engineering?",
            options: [
              "Using social media",
              "Psychological manipulation to gain access",
              "Engineering social events",
              "Building social networks",
            ],
            correctAnswer: 1,
            explanation:
              "Social engineering uses psychological manipulation to trick people into revealing sensitive information.",
          },
          {
            question: "What is pretexting?",
            options: [
              "Posting on social media",
              "Creating a false scenario to gain trust",
              "Protecting secrets",
              "Testing software",
            ],
            correctAnswer: 1,
            explanation:
              "Pretexting is creating a false scenario or pretext to trick someone into revealing information.",
          },
          {
            question:
              "A stranger claims to be IT support and asks for your password. What should you do?",
            options: [
              "Give them your password",
              "Verify their identity through official channels",
              "Hang up immediately",
              "Ask them technical questions",
            ],
            correctAnswer: 1,
            explanation:
              "Always verify someone's identity through official channels before providing any information.",
          },
          {
            question: "What is tailgating?",
            options: [
              "Following someone on social media",
              "Physically following someone into a secure area",
              "Tracking online activity",
              "Email hacking",
            ],
            correctAnswer: 1,
            explanation:
              "Tailgating is following someone into a restricted area without authorization.",
          },
          {
            question: "How can you protect yourself from social engineering?",
            options: [
              "Trust everyone",
              "Question unusual requests",
              "Share all information",
              "Never call companies",
            ],
            correctAnswer: 1,
            explanation:
              "Always question unusual requests and verify identities before sharing sensitive information.",
          },
        ],
      },
      {
        title: "Data Privacy Essentials",
        description: "Protect your personal information",
        content:
          "Data privacy involves understanding what information companies collect, how it's used, and your rights. Review privacy policies, limit data sharing, and be mindful of what personal information you make public.",
        duration: 5,
        quizzes: [
          {
            question: "What is data privacy?",
            options: [
              "Keeping the internet private",
              "Your right to control personal information",
              "Using private browsers",
              "Deleting your accounts",
            ],
            correctAnswer: 1,
            explanation:
              "Data privacy is your right to control what personal information is collected and how it's used.",
          },
          {
            question: "Should you read privacy policies?",
            options: [
              "No, they are too long",
              "Yes, to understand data collection",
              "Only for banking sites",
              "Never necessary",
            ],
            correctAnswer: 1,
            explanation:
              "Privacy policies explain how your data is collected, used, and protected.",
          },
          {
            question: "What should you avoid posting on social media?",
            options: [
              "Photos",
              "Your location",
              "Sensitive personal information",
              "All of the above",
            ],
            correctAnswer: 2,
            explanation:
              "Avoid posting sensitive personal information that could be used against you.",
          },
          {
            question: "What is GDPR?",
            options: [
              "A security software",
              "European privacy regulation",
              "A password manager",
              "An email service",
            ],
            correctAnswer: 1,
            explanation:
              "GDPR is a European Union regulation that protects personal data and privacy rights.",
          },
          {
            question: "How often should you review your privacy settings?",
            options: [
              "Never",
              "Once a year",
              "Regularly, when policies change",
              "Only if you have problems",
            ],
            correctAnswer: 2,
            explanation:
              "Regularly review privacy settings as companies often update their policies and settings change.",
          },
        ],
      },
      {
        title: "Mobile Device Security",
        description: "Secure your smartphones and tablets",
        content:
          "Mobile devices need protection through strong lock codes, app permissions, regular updates, and careful downloads. Avoid rooting or jailbreaking devices, use mobile antivirus, and enable remote wipe features.",
        duration: 5,
        quizzes: [
          {
            question: "What is the first step in mobile security?",
            options: [
              "Buying a case",
              "Setting a strong lock code",
              "Installing apps",
              "Turning it off",
            ],
            correctAnswer: 1,
            explanation:
              "A strong lock code is the first defense protecting all data on your device.",
          },
          {
            question: "Should you jailbreak or root your device?",
            options: [
              "Yes, for more features",
              "No, it removes security protections",
              "Only on older devices",
              "It doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Jailbreaking or rooting removes important security protections from your device.",
          },
          {
            question: "What should you check before installing an app?",
            options: [
              "Only the price",
              "Permissions it requests",
              "Only the rating",
              "Nothing special",
            ],
            correctAnswer: 1,
            explanation:
              "Check what permissions an app requests to ensure it only needs necessary access.",
          },
          {
            question: "What is a mobile antivirus for?",
            options: [
              "Speeding up your phone",
              "Detecting malware",
              "Clearing storage",
              "Organizing apps",
            ],
            correctAnswer: 1,
            explanation:
              "Mobile antivirus helps detect and remove malware threats from your device.",
          },
          {
            question: "What should you do if you lose your phone?",
            options: [
              "Do nothing",
              "Use remote wipe to erase data",
              "Post about it online",
              "Wait and hope",
            ],
            correctAnswer: 1,
            explanation:
              "Use remote wipe features to erase sensitive data if your phone is lost or stolen.",
          },
        ],
      },
      {
        title: "Home Network Security",
        description: "Protect your WiFi and connected devices",
        content:
          "Secure your home network by changing default router passwords, using WPA3 encryption, disabling WPS, enabling firewalls, and keeping router firmware updated. Separate guest networks and monitor connected devices.",
        duration: 4,
        quizzes: [
          {
            question: "What is the strongest WiFi encryption standard?",
            options: ["WEP", "WPA", "WPA2", "WPA3"],
            correctAnswer: 3,
            explanation:
              "WPA3 is the latest and most secure WiFi encryption standard.",
          },
          {
            question: "Should you use your router's default password?",
            options: [
              "Yes, it's preset",
              "No, change it immediately",
              "Only on guest network",
              "Doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Always change the default router password as default credentials are widely known.",
          },
          {
            question: "What is WPS?",
            options: [
              "WiFi Protected Setup",
              "WiFi Security Protocol",
              "Wireless Password Service",
              "Windows Power System",
            ],
            correctAnswer: 0,
            explanation:
              "WPS (WiFi Protected Setup) is convenient but has security vulnerabilities and should be disabled.",
          },
          {
            question: "Should you have a guest network?",
            options: [
              "No, it's unnecessary",
              "Yes, for visitors",
              "Only for business",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "A guest network allows visitors to connect without accessing your main network.",
          },
          {
            question: "How often should you update router firmware?",
            options: [
              "Never needed",
              "When you remember",
              "Regularly, as updates are released",
              "Only when it breaks",
            ],
            correctAnswer: 2,
            explanation:
              "Router firmware updates often include security patches and should be applied regularly.",
          },
        ],
      },
      {
        title: "Incident Response Basics",
        description: "What to do when security issues occur",
        content:
          "If you suspect a security breach, act quickly: change passwords, monitor accounts, report to relevant parties, document the incident, and seek professional help if needed. Have a plan before an incident occurs.",
        duration: 5,
        quizzes: [
          {
            question:
              "What is the first step if you notice unauthorized account activity?",
            options: [
              "Panic",
              "Change your password immediately",
              "Ignore it",
              "Tell everyone",
            ],
            correctAnswer: 1,
            explanation:
              "Immediately change your password to regain control of your account.",
          },
          {
            question: "Should you document a security incident?",
            options: [
              "No, just move on",
              "Yes, for reference and reporting",
              "Only if it's serious",
              "Never necessary",
            ],
            correctAnswer: 1,
            explanation:
              "Document security incidents with dates, times, and details for reporting and analysis.",
          },
          {
            question: "Who should you notify about a data breach?",
            options: [
              "Only your friends",
              "The affected organization",
              "Social media",
              "Nobody",
            ],
            correctAnswer: 1,
            explanation:
              "Contact the affected organization immediately to report the breach.",
          },
          {
            question: "Should you check your credit after a breach?",
            options: [
              "No, it doesn't help",
              "Yes, monitor for unauthorized activity",
              "Only if money was involved",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Monitor your credit and accounts for unauthorized activity after a breach.",
          },
          {
            question:
              "Should you seek professional help for serious incidents?",
            options: [
              "No, handle it yourself",
              "Yes, especially for significant breaches",
              "Only for businesses",
              "Never needed",
            ],
            correctAnswer: 1,
            explanation:
              "Seek professional cybersecurity help for serious security incidents.",
          },
        ],
      },
      {
        title: "Staying Informed",
        description: "Keep up with security news and updates",
        content:
          "Follow reputable cybersecurity sources, subscribe to security newsletters, stay updated on vulnerabilities, and participate in security awareness training. Continuous learning is essential in the ever-evolving security landscape.",
        duration: 3,
        quizzes: [
          {
            question: "Why is staying informed about security important?",
            options: [
              "It's boring",
              "Threats constantly evolve",
              "Only for experts",
              "Never necessary",
            ],
            correctAnswer: 1,
            explanation:
              "Security threats and techniques constantly evolve, requiring ongoing education.",
          },
          {
            question: "Which are good sources for security news?",
            options: [
              "Random blogs",
              "Reputable security organizations",
              "Social media rumors",
              "All sources equally",
            ],
            correctAnswer: 1,
            explanation:
              "Follow reputable security organizations for accurate and reliable information.",
          },
          {
            question: "What is a security vulnerability?",
            options: [
              "A company policy",
              "A weakness that can be exploited",
              "A type of antivirus",
              "A password",
            ],
            correctAnswer: 1,
            explanation:
              "A vulnerability is a weakness in software or systems that can be exploited by attackers.",
          },
          {
            question: "Should you participate in security training?",
            options: [
              "No, it's a waste of time",
              "Yes, it increases awareness",
              "Only if required",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Security training significantly increases awareness and reduces human error.",
          },
          {
            question: "What should you do about software vulnerabilities?",
            options: [
              "Ignore them",
              "Apply patches as soon as available",
              "Wait a few months",
              "Disable the software",
            ],
            correctAnswer: 1,
            explanation:
              "Apply security patches promptly to protect against known vulnerabilities.",
          },
        ],
      },
    ],
  },
  {
    id: "ai-literacy",
    title: "AI Literacy",
    description: "Understand artificial intelligence and machine learning",
    icon: "🤖",
    color: "#0D9488",
    lessons: [
      {
        title: "What is Artificial Intelligence?",
        description: "Introduction to AI concepts",
        content:
          "Artificial Intelligence refers to computer systems designed to perform tasks that typically require human intelligence. These include learning from experience, recognizing patterns, understanding language, and making decisions.",
        duration: 5,
        quizzes: [
          {
            question: "What is artificial intelligence?",
            options: [
              "A robot",
              "Computer systems performing human-like tasks",
              "A programming language",
              "A video game",
            ],
            correctAnswer: 1,
            explanation:
              "AI refers to computer systems designed to perform tasks requiring human-like intelligence.",
          },
          {
            question: "Which is an example of AI?",
            options: [
              "A calculator",
              "A chatbot",
              "A light switch",
              "A pencil",
            ],
            correctAnswer: 1,
            explanation:
              "Chatbots are AI systems that understand and generate human language.",
          },
          {
            question: "Does AI require human involvement?",
            options: [
              "No, it's completely autonomous",
              "Yes, humans create and guide AI",
              "Only sometimes",
              "Never",
            ],
            correctAnswer: 1,
            explanation: "Humans design, train, and oversee AI systems.",
          },
          {
            question: "What is a key capability of modern AI?",
            options: ["Flying", "Learning from data", "Cooking", "Sports"],
            correctAnswer: 1,
            explanation:
              "Modern AI excels at learning patterns from large amounts of data.",
          },
          {
            question: "Is AI just for technology companies?",
            options: [
              "Yes",
              "No, it's used across many industries",
              "Only for entertainment",
              "Only for research",
            ],
            correctAnswer: 1,
            explanation:
              "AI is now used across healthcare, finance, education, and many other industries.",
          },
        ],
      },
      {
        title: "Machine Learning Basics",
        description: "How machines learn from data",
        content:
          "Machine Learning is a subset of AI where systems learn from data without explicit programming. The system improves performance through experience. Common types include supervised learning, unsupervised learning, and reinforcement learning.",
        duration: 6,
        quizzes: [
          {
            question: "What is machine learning?",
            options: [
              "Teaching robots to exercise",
              "Systems learning from data",
              "A type of computer",
              "Programming language",
            ],
            correctAnswer: 1,
            explanation:
              "Machine learning allows systems to learn patterns from data.",
          },
          {
            question: "What is supervised learning?",
            options: [
              "Learning with a teacher present",
              "Learning from labeled data",
              "Learning in a classroom",
              "Learning alone",
            ],
            correctAnswer: 1,
            explanation:
              "Supervised learning uses labeled training data where the correct answers are provided.",
          },
          {
            question: "What happens when ML systems get more data?",
            options: [
              "They get slower",
              "They usually improve",
              "They break",
              "Nothing changes",
            ],
            correctAnswer: 1,
            explanation:
              "More data typically helps ML systems make better predictions.",
          },
          {
            question: "Can ML systems make mistakes?",
            options: [
              "No, they're perfect",
              "Yes, they can make errors",
              "Only rarely",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "ML systems can make mistakes, especially with new or unusual data.",
          },
          {
            question: "What is unsupervised learning used for?",
            options: [
              "Following instructions",
              "Finding patterns in unlabeled data",
              "Teaching robots",
              "Video games",
            ],
            correctAnswer: 1,
            explanation:
              "Unsupervised learning finds patterns in data without predefined labels.",
          },
        ],
      },
      {
        title: "Neural Networks and Deep Learning",
        description: "Understanding neural networks",
        content:
          "Neural networks are inspired by biological brains and consist of interconnected nodes. Deep learning uses multiple layers of neural networks to process complex patterns. These power many modern AI applications like image recognition and language models.",
        duration: 6,
        quizzes: [
          {
            question: "What is a neural network?",
            options: [
              "A computer network",
              "Interconnected nodes inspired by brains",
              "A type of internet",
              "A phone service",
            ],
            correctAnswer: 1,
            explanation:
              "Neural networks are computational models inspired by biological neural structures.",
          },
          {
            question: "What is deep learning?",
            options: [
              "Learning while diving",
              "Multiple layers of neural networks",
              "Complex psychology",
              "Philosophy",
            ],
            correctAnswer: 1,
            explanation:
              "Deep learning uses multiple layers of neural networks to model complex patterns.",
          },
          {
            question: "What are nodes in a neural network?",
            options: ["People", "Processing units", "Computers", "Networks"],
            correctAnswer: 1,
            explanation:
              "Nodes are computational units that process and pass information.",
          },
          {
            question: "Can neural networks be used for image recognition?",
            options: ["No", "Yes, very effectively", "Only text", "Never"],
            correctAnswer: 1,
            explanation:
              "Deep neural networks excel at image recognition and computer vision tasks.",
          },
          {
            question: "How do neural networks learn?",
            options: [
              "From rules",
              "By adjusting connection weights",
              "From humans",
              "Randomly",
            ],
            correctAnswer: 1,
            explanation:
              "Neural networks learn by adjusting the weights of connections between nodes.",
          },
        ],
      },
      {
        title: "Natural Language Processing",
        description: "AI understanding and generating language",
        content:
          "Natural Language Processing (NLP) enables computers to understand and generate human language. Applications include translation, sentiment analysis, chatbots, and voice assistants. Modern transformers like GPT have revolutionized NLP capabilities.",
        duration: 5,
        quizzes: [
          {
            question: "What is Natural Language Processing?",
            options: [
              "Teaching languages",
              "AI processing human language",
              "Speed speaking",
              "Translation only",
            ],
            correctAnswer: 1,
            explanation:
              "NLP enables computers to understand and process human language.",
          },
          {
            question: "Which is an NLP application?",
            options: [
              "Physical exercise",
              "Email spam filtering",
              "Building construction",
              "Cooking",
            ],
            correctAnswer: 1,
            explanation:
              "Spam filtering uses NLP to understand email content and classify it.",
          },
          {
            question: "What is sentiment analysis?",
            options: [
              "Feeling emotions",
              "Analyzing emotion in text",
              "Psychology",
              "Philosophy",
            ],
            correctAnswer: 1,
            explanation:
              "Sentiment analysis determines whether text expresses positive or negative sentiment.",
          },
          {
            question: "How do language models like ChatGPT work?",
            options: [
              "They memorize answers",
              "They predict next words based on patterns",
              "They search databases",
              "Magic",
            ],
            correctAnswer: 1,
            explanation:
              "Language models predict the next word based on patterns learned from training data.",
          },
          {
            question: "Can AI translate between languages?",
            options: [
              "No",
              "Yes, using NLP",
              "Only similar languages",
              "Never accurately",
            ],
            correctAnswer: 1,
            explanation:
              "Modern NLP systems can translate between languages with increasing accuracy.",
          },
        ],
      },
      {
        title: "Computer Vision",
        description: "AI interpreting images and video",
        content:
          "Computer vision enables machines to interpret visual information. Applications include facial recognition, object detection, medical imaging, and autonomous vehicles. Convolutional neural networks are especially powerful for vision tasks.",
        duration: 5,
        quizzes: [
          {
            question: "What is computer vision?",
            options: [
              "Seeing with computers",
              "AI interpreting visual information",
              "Watching videos",
              "Photography",
            ],
            correctAnswer: 1,
            explanation:
              "Computer vision enables machines to understand and analyze images and video.",
          },
          {
            question: "Which is a computer vision application?",
            options: [
              "Reading emails",
              "Facial recognition",
              "Typing documents",
              "Listening to music",
            ],
            correctAnswer: 1,
            explanation:
              "Facial recognition uses computer vision to identify people in images.",
          },
          {
            question: "What are some challenges in computer vision?",
            options: [
              "None",
              "Lighting, angles, occlusion",
              "Only theory",
              "No challenges exist",
            ],
            correctAnswer: 1,
            explanation:
              "Computer vision faces challenges with varied lighting, angles, and partially hidden objects.",
          },
          {
            question: "Can AI detect medical issues from images?",
            options: ["No", "Yes, in some cases", "Only theory", "Never"],
            correctAnswer: 1,
            explanation:
              "AI can assist in medical diagnosis by analyzing X-rays, CT scans, and other medical images.",
          },
          {
            question: "Are autonomous vehicles using computer vision?",
            options: [
              "No",
              "Yes, extensively",
              "Only sometimes",
              "Not necessary",
            ],
            correctAnswer: 1,
            explanation:
              "Autonomous vehicles rely heavily on computer vision to understand the road environment.",
          },
        ],
      },
      {
        title: "AI Bias and Fairness",
        description: "Understanding bias in AI systems",
        content:
          "AI systems can inherit biases from training data and design choices, leading to unfair outcomes. Bias can come from skewed data, flawed assumptions, or historical inequities. Addressing bias requires diverse data, careful design, and ongoing monitoring.",
        duration: 5,
        quizzes: [
          {
            question: "What is bias in AI?",
            options: [
              "Personal opinions",
              "Systematic unfairness in AI decisions",
              "Preferences",
              "Choosing sides",
            ],
            correctAnswer: 1,
            explanation:
              "Bias in AI refers to systematic errors that lead to unfair or discriminatory outcomes.",
          },
          {
            question: "Can AI systems be biased?",
            options: [
              "No, they're neutral",
              "Yes, they can inherit human biases",
              "Only sometimes",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "AI systems can inherit and amplify biases present in training data.",
          },
          {
            question: "Where does AI bias come from?",
            options: [
              "Nowhere",
              "Biased training data, flawed design",
              "Only from companies",
              "Always unavoidable",
            ],
            correctAnswer: 1,
            explanation:
              "Bias can originate from skewed training data, flawed assumptions, or design choices.",
          },
          {
            question: "How can we reduce AI bias?",
            options: [
              "Ignore it",
              "Use diverse, representative data",
              "Add more data randomly",
              "Nothing can be done",
            ],
            correctAnswer: 1,
            explanation:
              "Using diverse, representative training data helps reduce bias in AI systems.",
          },
          {
            question: "Why is fairness in AI important?",
            options: [
              "It's not",
              "To prevent discrimination",
              "Only for entertainment",
              "Never important",
            ],
            correctAnswer: 1,
            explanation:
              "Fairness in AI is crucial to prevent discriminatory and harmful outcomes.",
          },
        ],
      },
      {
        title: "AI Ethics and Responsibility",
        description: "Ethical considerations in AI development",
        content:
          "As AI becomes more powerful, ethical considerations become crucial. Key issues include transparency, accountability, privacy, and the impact on employment. Responsible AI development requires considering societal implications.",
        duration: 4,
        quizzes: [
          {
            question: "What is AI ethics?",
            options: [
              "Personal morality",
              "Responsible and fair AI use",
              "A philosophy",
              "Not important",
            ],
            correctAnswer: 1,
            explanation:
              "AI ethics focuses on ensuring AI systems are developed and used responsibly.",
          },
          {
            question: "Is transparency important in AI?",
            options: [
              "No",
              "Yes, users should understand AI decisions",
              "Only for companies",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Transparency helps users understand how AI systems make decisions.",
          },
          {
            question: "Should there be regulations for AI?",
            options: [
              "No regulations needed",
              "Yes, to ensure safety and fairness",
              "Only for military",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Regulations help ensure AI systems are safe, fair, and beneficial to society.",
          },
          {
            question: "What is accountability in AI?",
            options: [
              "Not important",
              "Responsibility for AI decisions",
              "Only for errors",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Accountability means having clear responsibility for AI systems and their outcomes.",
          },
          {
            question: "Can AI impact employment?",
            options: [
              "No",
              "Yes, automation can affect jobs",
              "Only temporarily",
              "Not applicable",
            ],
            correctAnswer: 1,
            explanation:
              "AI automation can impact employment patterns and workforce needs.",
          },
        ],
      },
      {
        title: "AI in Everyday Life",
        description: "How AI affects our daily routines",
        content:
          "AI is increasingly integrated into everyday applications: smartphone assistants, recommendation systems, email filtering, GPS navigation, and smart home devices. Understanding these applications helps you use technology more effectively and safely.",
        duration: 4,
        quizzes: [
          {
            question: "Which uses AI in everyday life?",
            options: [
              "Pencils",
              "Smartphone assistants",
              "Paper books",
              "Chairs",
            ],
            correctAnswer: 1,
            explanation:
              "Smartphone assistants like Siri and Google Assistant use AI technology.",
          },
          {
            question: "How do video recommendations work?",
            options: [
              "Random selection",
              "Based on ML analysis of viewing history",
              "Always new content",
              "User choice only",
            ],
            correctAnswer: 1,
            explanation:
              "Recommendation systems use ML to suggest content based on user behavior.",
          },
          {
            question: "What does GPS navigation use?",
            options: [
              "Only maps",
              "Maps plus AI for traffic prediction",
              "Magic",
              "Human observation",
            ],
            correctAnswer: 1,
            explanation:
              "Modern GPS uses AI to predict traffic and suggest optimal routes.",
          },
          {
            question: "Are smart home devices using AI?",
            options: [
              "No",
              "Yes, for voice recognition and automation",
              "Only basic automation",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Smart home devices use AI for voice recognition and intelligent automation.",
          },
          {
            question: "How does spam email filtering work?",
            options: [
              "Manual reading",
              "ML classifying emails",
              "Random filtering",
              "User only",
            ],
            correctAnswer: 1,
            explanation:
              "Email systems use ML to identify and filter spam messages.",
          },
        ],
      },
      {
        title: "Future of AI",
        description: "What's next for artificial intelligence",
        content:
          "The future of AI includes potential advances like artificial general intelligence (AGI), quantum computing, and increasingly autonomous systems. However, challenges remain including safety, alignment with human values, and societal adaptation.",
        duration: 5,
        quizzes: [
          {
            question: "What is Artificial General Intelligence (AGI)?",
            options: [
              "Current AI",
              "AI with human-level general intelligence",
              "Gaming AI",
              "Always available",
            ],
            correctAnswer: 1,
            explanation:
              "AGI refers to AI systems with human-level intelligence across all tasks.",
          },
          {
            question: "What challenges does future AI face?",
            options: [
              "None",
              "Safety, alignment, societal impact",
              "Only technical",
              "No challenges",
            ],
            correctAnswer: 1,
            explanation:
              "Future AI must address safety, human alignment, and societal implications.",
          },
          {
            question: "Could AI surpass human intelligence?",
            options: [
              "No, impossible",
              "Possibly in narrow domains",
              "Already has",
              "Never will",
            ],
            correctAnswer: 1,
            explanation:
              "AI has already surpassed humans in narrow domains like chess and Go.",
          },
          {
            question: "What is the AI alignment problem?",
            options: [
              "Arranging AI",
              "Ensuring AI goals match human values",
              "Computer setup",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "AI alignment refers to ensuring AI systems pursue goals consistent with human values.",
          },
          {
            question: "How should society prepare for advanced AI?",
            options: [
              "Do nothing",
              "Education, regulation, research",
              "Ban AI",
              "Hope for best",
            ],
            correctAnswer: 1,
            explanation:
              "Society should invest in education, thoughtful regulation, and responsible research.",
          },
        ],
      },
      {
        title: "Learning Resources and Getting Started",
        description: "Your AI learning journey",
        content:
          "Start your AI journey with online courses, research papers, and practical projects. Platforms offer beginner to advanced content. Consider learning programming, statistics, and mathematics foundations for deeper understanding.",
        duration: 3,
        quizzes: [
          {
            question: "What skills help with AI?",
            options: [
              "None needed",
              "Programming, statistics, math",
              "Only theory",
              "Nothing helps",
            ],
            correctAnswer: 1,
            explanation:
              "Programming, statistics, and mathematics are foundational skills for AI.",
          },
          {
            question: "Can beginners learn about AI?",
            options: [
              "No",
              "Yes, with appropriate resources",
              "Only experts",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Many beginner-friendly resources exist for learning about AI concepts.",
          },
          {
            question: "Where can you learn AI?",
            options: [
              "Nowhere",
              "Online courses, universities, books",
              "Only universities",
              "Not possible",
            ],
            correctAnswer: 1,
            explanation:
              "Numerous online platforms, universities, and resources teach AI fundamentals.",
          },
          {
            question: "Should you experiment with AI projects?",
            options: [
              "No",
              "Yes, hands-on learning is valuable",
              "Only theory",
              "Never practical",
            ],
            correctAnswer: 1,
            explanation:
              "Hands-on projects significantly improve understanding of AI concepts.",
          },
          {
            question: "Is AI knowledge becoming important?",
            options: [
              "No",
              "Yes, increasingly in many fields",
              "Only for experts",
              "Not relevant",
            ],
            correctAnswer: 1,
            explanation:
              "Understanding AI is becoming increasingly valuable across many professions.",
          },
        ],
      },
    ],
  },
  {
    id: "productivity-focus",
    title: "Productivity and Focus",
    description: "Master time management and concentration",
    icon: "⚡",
    color: "#C0541A",
    lessons: [
      {
        title: "Understanding Productivity",
        description: "What productivity really means",
        content:
          "Productivity isn't about doing more—it's about achieving meaningful results with available time and energy. Effective productivity involves prioritization, focus, and aligning tasks with your goals.",
        duration: 4,
        quizzes: [
          {
            question: "What is true productivity?",
            options: [
              "Doing more tasks",
              "Achieving meaningful results",
              "Working longer hours",
              "Being busy",
            ],
            correctAnswer: 1,
            explanation:
              "Productivity is about achieving significant results, not just staying busy.",
          },
          {
            question: "Is productivity the same for everyone?",
            options: [
              "Yes",
              "No, it's personal",
              "Only for workers",
              "Never relevant",
            ],
            correctAnswer: 1,
            explanation:
              "Productivity depends on individual goals, roles, and circumstances.",
          },
          {
            question: "What's a common productivity mistake?",
            options: [
              "Setting goals",
              "Confusing busyness with productivity",
              "Taking breaks",
              "Planning",
            ],
            correctAnswer: 1,
            explanation: "Many confuse being busy with being productive.",
          },
          {
            question: "Should you track productivity?",
            options: [
              "No",
              "Yes, to identify patterns",
              "Only sometimes",
              "Never helpful",
            ],
            correctAnswer: 1,
            explanation:
              "Tracking productivity helps identify what works for you.",
          },
          {
            question: "How does energy level affect productivity?",
            options: [
              "It doesn't",
              "Significantly—work when energized",
              "Always the same",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Working during peak energy hours significantly improves productivity.",
          },
        ],
      },
      {
        title: "Goal Setting and Planning",
        description: "Set effective goals and create plans",
        content:
          "SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) provide clarity and motivation. Break large goals into smaller milestones. Regular planning sessions help you stay aligned with your objectives.",
        duration: 5,
        quizzes: [
          {
            question: "What does SMART stand for?",
            options: [
              "Simple, Motivating, Achievable, Realistic, Timed",
              "Specific, Measurable, Achievable, Relevant, Time-bound",
              "Small, Major, Ambitious, Real, Timed",
              "Structured, Mindful, Active, Realistic, Targeted",
            ],
            correctAnswer: 1,
            explanation:
              "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound.",
          },
          {
            question: "Why break large goals into smaller ones?",
            options: [
              "Waste time",
              "Makes progress visible and achievable",
              "Confuses you",
              "No reason",
            ],
            correctAnswer: 1,
            explanation:
              "Smaller milestones provide motivation and help track progress.",
          },
          {
            question: "Should your goals be challenging?",
            options: [
              "No, too easy",
              "Yes, but achievable",
              "Always impossible",
              "Doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Goals should challenge you while remaining achievable with effort.",
          },
          {
            question: "How often should you review goals?",
            options: [
              "Never",
              "Regularly, like weekly or monthly",
              "Only once",
              "Yearly only",
            ],
            correctAnswer: 1,
            explanation:
              "Regular reviews help you stay accountable and adjust as needed.",
          },
          {
            question: "What's important about goal deadlines?",
            options: [
              "They don't matter",
              "They create urgency and accountability",
              "Always arbitrary",
              "Unnecessary",
            ],
            correctAnswer: 1,
            explanation:
              "Deadlines create urgency and help you prioritize your actions.",
          },
        ],
      },
      {
        title: "The Pomodoro Technique",
        description: "Using focused work intervals",
        content:
          "The Pomodoro Technique uses 25-minute focused work intervals (pomodoros) followed by 5-minute breaks. This method combats procrastination and mental fatigue. After 4 pomodoros, take a longer 15-30 minute break.",
        duration: 4,
        quizzes: [
          {
            question: "How long is a Pomodoro?",
            options: ["15 minutes", "25 minutes", "45 minutes", "60 minutes"],
            correctAnswer: 1,
            explanation: "A standard Pomodoro is 25 minutes of focused work.",
          },
          {
            question: "What's the break after one Pomodoro?",
            options: ["1 minute", "5 minutes", "15 minutes", "30 minutes"],
            correctAnswer: 1,
            explanation: "After each Pomodoro, take a 5-minute break.",
          },
          {
            question: "When do you take a longer break?",
            options: [
              "Never",
              "After 2 Pomodoros",
              "After 4 Pomodoros",
              "Whenever tired",
            ],
            correctAnswer: 2,
            explanation:
              "Take a longer 15-30 minute break after completing 4 Pomodoros.",
          },
          {
            question: "Does the Pomodoro Technique eliminate distractions?",
            options: [
              "Never",
              "It helps minimize distractions",
              "Doesn't help",
              "Always fails",
            ],
            correctAnswer: 1,
            explanation:
              "The technique helps minimize distractions during focused periods.",
          },
          {
            question: "Can you customize Pomodoro timing?",
            options: [
              "No",
              "Yes, adapt to your needs",
              "Only shortening",
              "Should never",
            ],
            correctAnswer: 1,
            explanation:
              "You can adjust timings based on your personal preferences and work style.",
          },
        ],
      },
      {
        title: "Managing Distractions",
        description: "Create a distraction-free environment",
        content:
          "Minimize digital distractions by silencing notifications, using focus apps, and keeping your workspace organized. Physical environment matters: reduce noise, control temperature, and eliminate visual clutter.",
        duration: 5,
        quizzes: [
          {
            question: "What's the biggest distraction for most people?",
            options: [
              "Noise",
              "Phones and notifications",
              "Hunger",
              "Temperature",
            ],
            correctAnswer: 1,
            explanation:
              "Digital notifications are among the most common distractions.",
          },
          {
            question: "Should you silence notifications?",
            options: [
              "No",
              "Yes, during focused work",
              "Only emails",
              "Never helps",
            ],
            correctAnswer: 1,
            explanation:
              "Silencing notifications helps maintain focus during work sessions.",
          },
          {
            question: "Does workspace organization matter?",
            options: [
              "No",
              "Yes, it reduces distractions",
              "Only slightly",
              "Doesn't help",
            ],
            correctAnswer: 1,
            explanation:
              "An organized workspace reduces mental load and distractions.",
          },
          {
            question: "Can background music help focus?",
            options: [
              "Never",
              "For some people, yes",
              "Always distracting",
              "Doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Background music can help some people focus while distracting others.",
          },
          {
            question: "What about social media during work?",
            options: [
              "Keep it open",
              "Check occasionally",
              "Disable or block during work",
              "Check every 5 min",
            ],
            correctAnswer: 2,
            explanation:
              "Blocking social media during work sessions improves focus.",
          },
        ],
      },
      {
        title: "Prioritization Methods",
        description: "Deciding what matters most",
        content:
          "Methods like the Eisenhower Matrix help categorize tasks as urgent/important. The 80/20 rule suggests 80% of results come from 20% of efforts. Prioritization requires understanding impact and deadlines.",
        duration: 5,
        quizzes: [
          {
            question: "What is the Eisenhower Matrix?",
            options: [
              "A name",
              "Categorizing tasks by urgency/importance",
              "A math tool",
              "A company",
            ],
            correctAnswer: 1,
            explanation:
              "The Eisenhower Matrix categorizes tasks by urgency and importance.",
          },
          {
            question: "What is the 80/20 rule?",
            options: [
              "Vague concept",
              "80% of results from 20% of efforts",
              "A percentage",
              "Random numbers",
            ],
            correctAnswer: 1,
            explanation:
              "The Pareto principle states 80% of results typically come from 20% of efforts.",
          },
          {
            question: "Should urgent tasks always be first?",
            options: [
              "Yes always",
              "No, consider importance too",
              "Never",
              "Doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Important but non-urgent tasks often deserve higher priority than urgent but unimportant ones.",
          },
          {
            question: "What's a priority vs. a distraction?",
            options: [
              "Same thing",
              "Priorities align with goals, distractions don't",
              "No difference",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Priorities contribute to your goals; distractions pull you away from them.",
          },
          {
            question: "How often should you reprioritize?",
            options: [
              "Never",
              "Daily or when circumstances change",
              "Weekly only",
              "Once a year",
            ],
            correctAnswer: 1,
            explanation:
              "Regular reprioritization keeps you focused on what matters most.",
          },
        ],
      },
      {
        title: "Time Blocking",
        description: "Schedule time for specific activities",
        content:
          "Time blocking involves scheduling specific blocks of time for particular tasks or activities. This technique prevents context switching, ensures important tasks get done, and provides structure to your day.",
        duration: 4,
        quizzes: [
          {
            question: "What is time blocking?",
            options: [
              "Avoiding time",
              "Scheduling time for specific activities",
              "Wasting time",
              "Breaking things",
            ],
            correctAnswer: 1,
            explanation:
              "Time blocking assigns specific time periods to particular tasks or activities.",
          },
          {
            question: "Why schedule breaks in time blocks?",
            options: [
              "Waste time",
              "Rest improves focus",
              "Unnecessary",
              "Don't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Breaks help refresh your mind and maintain sustained focus.",
          },
          {
            question: "Should you be flexible with time blocks?",
            options: [
              "No flexibility",
              "Mostly firm, flexible when needed",
              "Always change them",
              "No structure",
            ],
            correctAnswer: 1,
            explanation:
              "Time blocks provide structure but should allow flexibility for emergencies.",
          },
          {
            question: "What happens when you block time for focus?",
            options: [
              "Confusing",
              "Better concentration",
              "Wasted time",
              "Nothing changes",
            ],
            correctAnswer: 1,
            explanation:
              "Protected focus time significantly improves concentration and output quality.",
          },
          {
            question: "Can time blocking improve work-life balance?",
            options: [
              "No",
              "Yes, by scheduling personal time",
              "Only for work",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Time blocking for personal activities helps maintain healthy work-life balance.",
          },
        ],
      },
      {
        title: "Energy Management",
        description: "Work with your natural rhythms",
        content:
          "Everyone has peak energy periods when they're most productive. Chronotypes determine whether you're a morning person or night owl. Matching important tasks to your peak energy windows maximizes output.",
        duration: 4,
        quizzes: [
          {
            question: "What is a chronotype?",
            options: [
              "A time period",
              "Your natural sleep/wake pattern",
              "A watch",
              "Random",
            ],
            correctAnswer: 1,
            explanation:
              "Your chronotype determines your natural sleep/wake cycle and peak energy times.",
          },
          {
            question: "Should you schedule important tasks during peak energy?",
            options: ["No", "Yes, absolutely", "Doesn't matter", "Avoid it"],
            correctAnswer: 1,
            explanation:
              "Schedule cognitively demanding work during your peak energy hours.",
          },
          {
            question: "What's an energy dip common for most?",
            options: [
              "Morning",
              "Afternoon, typically 2-3pm",
              "Late night",
              "Never happens",
            ],
            correctAnswer: 1,
            explanation:
              "Most people experience a significant energy dip in the early afternoon.",
          },
          {
            question: "Can caffeine solve all energy issues?",
            options: [
              "Always",
              "It helps but isn't the solution",
              "Never works",
              "Harmful",
            ],
            correctAnswer: 1,
            explanation:
              "Caffeine can help but working with natural rhythms is more effective.",
          },
          {
            question: "How does sleep affect productivity?",
            options: [
              "Irrelevant",
              "Significantly—poor sleep reduces productivity",
              "No effect",
              "Only nighttime",
            ],
            correctAnswer: 1,
            explanation:
              "Quality sleep is foundational for sustained focus and productivity.",
          },
        ],
      },
      {
        title: "Dealing with Procrastination",
        description: "Overcome delays and start tasks",
        content:
          "Procrastination often stems from anxiety, perfectionism, or task aversion. Solutions include breaking tasks into smaller parts, setting accountability, using implementation intentions, and addressing underlying emotions.",
        duration: 5,
        quizzes: [
          {
            question: "Why do people procrastinate?",
            options: [
              "Laziness only",
              "Anxiety, perfectionism, aversion",
              "Bad character",
              "Rare",
            ],
            correctAnswer: 1,
            explanation:
              "Procrastination often stems from emotional regulation issues, not laziness.",
          },
          {
            question: "What's an effective anti-procrastination strategy?",
            options: [
              "Try harder",
              "Break tasks into smaller steps",
              "Ignore it",
              "Shame yourself",
            ],
            correctAnswer: 1,
            explanation:
              "Breaking large tasks into smaller, manageable steps reduces procrastination.",
          },
          {
            question: "Should you address emotions behind procrastination?",
            options: [
              "No",
              "Yes, identify and address feelings",
              "Never",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Understanding the emotions behind procrastination is key to overcoming it.",
          },
          {
            question: "What is an implementation intention?",
            options: [
              "Random idea",
              "If-then plan to take action",
              "A wish",
              "Never helps",
            ],
            correctAnswer: 1,
            explanation:
              'Implementation intentions ("If X happens, then I\'ll do Y") help reduce procrastination.',
          },
          {
            question: "Can accountability help with procrastination?",
            options: ["No", "Yes, very much", "Harmful", "Irrelevant"],
            correctAnswer: 1,
            explanation:
              "External accountability significantly reduces procrastination.",
          },
        ],
      },
      {
        title: "Saying No Effectively",
        description: "Protect your time and priorities",
        content:
          "Saying no is essential for maintaining focus and preventing burnout. Effective refusals are respectful, clear, and don't require extensive justification. Practice saying no to protect your priorities.",
        duration: 3,
        quizzes: [
          {
            question: "Is saying no important for productivity?",
            options: [
              "No",
              "Yes, it protects your priorities",
              "Only for managers",
              "Unnecessary",
            ],
            correctAnswer: 1,
            explanation:
              "Saying no strategically protects time for what matters most.",
          },
          {
            question: "Should a no require extensive explanation?",
            options: [
              "Always",
              "No, keep it brief",
              "Only sometimes",
              "Never no",
            ],
            correctAnswer: 1,
            explanation:
              'A simple "no" or "I can\'t right now" is often sufficient.',
          },
          {
            question: "What happens if you say yes to everything?",
            options: [
              "More productivity",
              "Overcommitment and reduced quality",
              "More money",
              "Happiness",
            ],
            correctAnswer: 1,
            explanation:
              "Saying yes to everything leads to overcommitment and reduced effectiveness.",
          },
          {
            question: "Can you say no professionally?",
            options: [
              "Never",
              "Yes, respectfully",
              "Only to friends",
              "Never appropriate",
            ],
            correctAnswer: 1,
            explanation:
              "Professional nos are respectful and might offer alternatives.",
          },
          {
            question: "Should you practice saying no?",
            options: [
              "No need",
              "Yes, it gets easier",
              "Pointless",
              "Difficult always",
            ],
            correctAnswer: 1,
            explanation:
              "Practicing saying no makes it easier and more natural.",
          },
        ],
      },
      {
        title: "Measuring Progress",
        description: "Track and celebrate achievements",
        content:
          "Measurement provides motivation and identifies what's working. Track metrics relevant to your goals, review regularly, celebrate wins, and adjust strategies based on data. Progress visualization builds momentum.",
        duration: 4,
        quizzes: [
          {
            question: "Why measure productivity?",
            options: [
              "Unnecessary",
              "Identifies patterns and motivates",
              "Too much work",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Measurement helps identify what works and provides motivation.",
          },
          {
            question: "Should you celebrate small wins?",
            options: [
              "No, waste time",
              "Yes, it builds momentum",
              "Only big wins",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Celebrating small wins maintains motivation and momentum.",
          },
          {
            question: "What makes a good productivity metric?",
            options: [
              "Random numbers",
              "Measurable, relevant to goals",
              "Anything counts",
              "None matter",
            ],
            correctAnswer: 1,
            explanation:
              "Good metrics are specific, measurable, and aligned with your goals.",
          },
          {
            question: "How often should you review progress?",
            options: [
              "Never",
              "Weekly or monthly",
              "Yearly",
              "When feeling bad",
            ],
            correctAnswer: 1,
            explanation:
              "Regular reviews (weekly/monthly) help you stay on track.",
          },
          {
            question: "Should you adjust based on progress data?",
            options: [
              "No",
              "Yes, optimize what works",
              "Never change",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Use data to optimize your approach and double down on what works.",
          },
        ],
      },
    ],
  },
  {
    id: "career-digital-confidence",
    title: "Career and Digital Confidence",
    description: "Build professional presence and digital skills",
    icon: "💼",
    color: "#6B7280",
    lessons: [
      {
        title: "Building Your Professional Brand",
        description: "Create a strong professional presence",
        content:
          "Your professional brand encompasses your online presence, reputation, and how you're perceived. Maintain consistent messaging across platforms, showcase your expertise, and align your digital presence with your career goals.",
        duration: 5,
        quizzes: [
          {
            question: "What is a professional brand?",
            options: [
              "A company logo",
              "Your professional reputation and presence",
              "A trademark",
              "Marketing",
            ],
            correctAnswer: 1,
            explanation:
              "Your professional brand is how you're perceived professionally across platforms.",
          },
          {
            question: "Why does online presence matter?",
            options: [
              "It doesn't",
              "Employers and clients often research you online",
              "Only for influencers",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Employers and clients commonly research candidates online.",
          },
          {
            question: "Should your online presence be consistent?",
            options: [
              "No",
              "Yes, consistent messaging strengthens your brand",
              "Only on one site",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Consistency across platforms strengthens your professional brand.",
          },
          {
            question: "Can social media hurt your career?",
            options: [
              "Never",
              "Yes, if unprofessional content is shared",
              "Only helps",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Unprofessional social media content can damage career opportunities.",
          },
          {
            question: "Should you showcase your expertise?",
            options: [
              "No",
              "Yes, through content and projects",
              "Only verbally",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Demonstrating expertise through content builds credibility and opportunities.",
          },
        ],
      },
      {
        title: "LinkedIn Mastery",
        description: "Optimize your LinkedIn profile",
        content:
          "LinkedIn is crucial for professional networking. Optimize your profile with a professional photo, compelling headline, strong summary, and relevant skills. Engage with content, build genuine connections, and maintain regular activity.",
        duration: 5,
        quizzes: [
          {
            question: "How important is LinkedIn for careers?",
            options: [
              "Not important",
              "Very important—it's a professional hub",
              "Only for job hunting",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "LinkedIn is essential for professional networking and opportunities.",
          },
          {
            question: "What's a key LinkedIn profile component?",
            options: [
              "Random interests",
              "Professional photo and compelling headline",
              "Jokes",
              "Nothing matters",
            ],
            correctAnswer: 1,
            explanation:
              "A professional photo and clear headline are crucial profile elements.",
          },
          {
            question: "Should your headline just be your job title?",
            options: [
              "Yes",
              "No, make it compelling and specific",
              "Doesn't matter",
              "Never list title",
            ],
            correctAnswer: 1,
            explanation:
              "Use your headline to highlight your value and specialization.",
          },
          {
            question: "How should you approach LinkedIn connections?",
            options: [
              "Connect with everyone",
              "Build genuine, strategic connections",
              "Avoid connections",
              "All equal",
            ],
            correctAnswer: 1,
            explanation:
              "Focus on building genuine connections with people relevant to your field.",
          },
          {
            question: "Should you engage on LinkedIn?",
            options: [
              "No",
              "Yes, comment, share, and network",
              "Only lurk",
              "Passive only",
            ],
            correctAnswer: 1,
            explanation:
              "Active engagement increases visibility and networking opportunities.",
          },
        ],
      },
      {
        title: "Digital Communication Skills",
        description: "Master professional online communication",
        content:
          "Professional communication online differs from casual chat. Master email etiquette, clear written communication, professional tone, and appropriate response times. These skills are critical in remote and hybrid work environments.",
        duration: 5,
        quizzes: [
          {
            question: "Why is email etiquette important?",
            options: [
              "Not important",
              "It reflects professionalism and credibility",
              "Doesn't matter",
              "Only for old people",
            ],
            correctAnswer: 1,
            explanation:
              "Email communication is often a first impression and reflection of professionalism.",
          },
          {
            question: "What's a key email best practice?",
            options: [
              "Very casual tone",
              "Clear subject, concise content",
              "No punctuation",
              "Emojis everywhere",
            ],
            correctAnswer: 1,
            explanation:
              "Clear subject lines and concise messages improve email effectiveness.",
          },
          {
            question: "How quickly should you respond to professional emails?",
            options: [
              "Whenever",
              "Within 24 hours typically",
              "Days later",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Responding within 24 hours demonstrates professionalism and respect.",
          },
          {
            question: "Is tone important in written communication?",
            options: [
              "No",
              "Yes, it's often misinterpreted",
              "Doesn't matter",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Written communication lacks tone cues, making clarity especially important.",
          },
          {
            question: "When should you use instant messaging vs email?",
            options: [
              "Same thing",
              "Instant for quick questions, email for important items",
              "All email",
              "All messaging",
            ],
            correctAnswer: 1,
            explanation:
              "Choose appropriate channels based on message importance and urgency.",
          },
        ],
      },
      {
        title: "Remote Work Excellence",
        description: "Thrive in remote and hybrid environments",
        content:
          "Remote work requires discipline, clear communication, and self-motivation. Establish routines, maintain boundaries between work and personal life, communicate proactively, and build relationships despite distance.",
        duration: 4,
        quizzes: [
          {
            question: "What's crucial for remote work success?",
            options: [
              "Watching TV",
              "Self-discipline and clear communication",
              "Sleeping in",
              "No structure",
            ],
            correctAnswer: 1,
            explanation:
              "Remote work requires self-motivation and proactive communication.",
          },
          {
            question: "Should you over-communicate in remote teams?",
            options: [
              "No",
              "Yes, more than in-person",
              "Keep silent",
              "Equal communication",
            ],
            correctAnswer: 1,
            explanation:
              "Remote teams benefit from more frequent communication to stay aligned.",
          },
          {
            question: "How do you build relationships remotely?",
            options: [
              "Can't be done",
              "Virtual meetings, chat, finding common interests",
              "Never possible",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Remote relationships build through consistent communication and finding commonalities.",
          },
          {
            question: "Should you create work-life boundaries at home?",
            options: [
              "No",
              "Yes, separate workspace and hours",
              "Work all time",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Boundaries prevent burnout and maintain work-life balance.",
          },
          {
            question: "What helps avoid remote work isolation?",
            options: [
              "More isolation",
              "Regular communication and virtual social activities",
              "Work alone",
              "Quit remote",
            ],
            correctAnswer: 1,
            explanation:
              "Proactive communication and virtual team activities combat isolation.",
          },
        ],
      },
      {
        title: "Continuous Learning and Skill Development",
        description: "Stay relevant through ongoing growth",
        content:
          "Technology and professional landscapes constantly evolve. Commit to continuous learning through courses, certifications, reading, and practical projects. Developing new skills keeps you competitive and opens opportunities.",
        duration: 5,
        quizzes: [
          {
            question: "Why is continuous learning important?",
            options: [
              "It's not",
              "Industries change; learning keeps you relevant",
              "One education enough",
              "Never needed",
            ],
            correctAnswer: 1,
            explanation:
              "Continuous learning ensures you remain competitive as industries evolve.",
          },
          {
            question: "What's a good learning approach?",
            options: [
              "All theory",
              "Mix of theory and practical projects",
              "All projects",
              "Never learn",
            ],
            correctAnswer: 1,
            explanation:
              "Combining theory with hands-on practice maximizes learning effectiveness.",
          },
          {
            question: "Should you pursue certifications?",
            options: [
              "No",
              "When relevant to your goals",
              "Always pursue all",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Relevant certifications can enhance credentials and career prospects.",
          },
          {
            question: "How much time should learning take?",
            options: [
              "None",
              "Regular time, ideally 5+ hours/week",
              "All your time",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Regular learning time prevents skills from becoming outdated.",
          },
          {
            question: "Where can you learn new skills?",
            options: [
              "Nowhere",
              "Online courses, books, mentors, communities",
              "Only universities",
              "Not possible",
            ],
            correctAnswer: 1,
            explanation:
              "Multiple resources exist for skill development in today's world.",
          },
        ],
      },
      {
        title: "Navigating Career Changes",
        description: "Successfully transition between roles",
        content:
          "Career changes require strategic planning. Assess your strengths, research new fields, develop relevant skills, network in your target industry, and build a transition plan. Leverage transferable skills while acquiring new ones.",
        duration: 5,
        quizzes: [
          {
            question: "Should career changes be carefully planned?",
            options: [
              "No planning needed",
              "Yes, strategic planning increases success",
              "Impossible to plan",
              "Random better",
            ],
            correctAnswer: 1,
            explanation:
              "Strategic planning significantly improves the success of career transitions.",
          },
          {
            question: "What are transferable skills?",
            options: [
              "None exist",
              "Skills applicable across different roles",
              "Career specific",
              "Never transfer",
            ],
            correctAnswer: 1,
            explanation:
              "Transferable skills like communication and leadership apply across careers.",
          },
          {
            question: "How important is networking in career changes?",
            options: [
              "Not important",
              "Very important—it opens opportunities",
              "Irrelevant",
              "Can't help",
            ],
            correctAnswer: 1,
            explanation:
              "Networking in target fields reveals opportunities and builds connections.",
          },
          {
            question: "Can you change careers without new education?",
            options: [
              "Never",
              "Sometimes, leveraging transferable skills",
              "Always impossible",
              "Rare",
            ],
            correctAnswer: 1,
            explanation:
              "Transferable skills sometimes enable transitions without additional formal education.",
          },
          {
            question: "What's a red flag in career planning?",
            options: [
              "Having a plan",
              "Making dramatic changes without research",
              "Learning new skills",
              "Networking",
            ],
            correctAnswer: 1,
            explanation:
              "Dramatic career moves without research often lead to regret.",
          },
        ],
      },
      {
        title: "Networking Effectively",
        description: "Build meaningful professional relationships",
        content:
          "Effective networking focuses on building genuine relationships, not collecting contacts. Attend industry events, contribute meaningfully to communities, offer value to others, and maintain consistent relationships over time.",
        duration: 4,
        quizzes: [
          {
            question: "What's the foundation of effective networking?",
            options: [
              "Collecting business cards",
              "Building genuine relationships",
              "Self-promotion",
              "Manipulation",
            ],
            correctAnswer: 1,
            explanation:
              "Genuine relationships form the foundation of meaningful professional networks.",
          },
          {
            question: "Should you offer value when networking?",
            options: [
              "No, only take",
              "Yes, give before asking",
              "Never give",
              "Always take",
            ],
            correctAnswer: 1,
            explanation:
              "Offering value to others creates reciprocity and stronger relationships.",
          },
          {
            question: "How do you maintain professional relationships?",
            options: [
              "One-time contact",
              "Regular, meaningful interactions",
              "Never touch base",
              "Once yearly",
            ],
            correctAnswer: 1,
            explanation:
              "Regular contact keeps relationships strong and relevant.",
          },
          {
            question: "Where should you network?",
            options: [
              "Nowhere",
              "Industry events, online communities, conferences",
              "Only online",
              "Only in-person",
            ],
            correctAnswer: 1,
            explanation:
              "Multiple channels exist for effective networking—both online and in-person.",
          },
          {
            question: "Can introverts network effectively?",
            options: [
              "Never",
              "Yes, using strategies that suit them",
              "Only extroverts",
              "Impossible",
            ],
            correctAnswer: 1,
            explanation:
              "Introverts can network effectively through their preferred methods.",
          },
        ],
      },
      {
        title: "Managing Your Digital Reputation",
        description: "Control your online narrative",
        content:
          "Your digital reputation impacts opportunities. Regularly search yourself online, address negative content proactively, cultivate positive digital presence, and monitor what's being said about you. Privacy settings protect personal information.",
        duration: 4,
        quizzes: [
          {
            question: "How important is digital reputation?",
            options: [
              "Not important",
              "Very important—it affects opportunities",
              "Only for famous people",
              "Irrelevant",
            ],
            correctAnswer: 1,
            explanation:
              "Digital reputation significantly impacts professional opportunities.",
          },
          {
            question: "What's a good reputation maintenance habit?",
            options: [
              "Ignore it",
              "Regularly search yourself and address issues",
              "Hope for best",
              "Do nothing",
            ],
            correctAnswer: 1,
            explanation:
              "Proactive monitoring helps you address reputation issues early.",
          },
          {
            question: "Should you use privacy settings?",
            options: [
              "No",
              "Yes, to protect personal information",
              "Never",
              "Doesn't matter",
            ],
            correctAnswer: 1,
            explanation:
              "Privacy settings control what's publicly visible about you.",
          },
          {
            question: "Can you recover from online mistakes?",
            options: [
              "Never",
              "Yes, with thoughtful actions",
              "Never possible",
              "Permanent damage",
            ],
            correctAnswer: 1,
            explanation:
              "Mistakes can be addressed through transparency and positive future actions.",
          },
          {
            question: "Should you respond to negative comments?",
            options: [
              "Always argue",
              "Thoughtfully when appropriate",
              "Never respond",
              "Get angry online",
            ],
            correctAnswer: 1,
            explanation:
              "Thoughtful, professional responses show maturity and can rebuild reputation.",
          },
        ],
      },
      {
        title: "Salary Negotiation and Compensation",
        description: "Advocate for fair compensation",
        content:
          "Negotiation is a normal part of employment. Research market rates, understand your value, practice negotiation, and present data-backed requests. Compensation includes salary, benefits, flexibility, and professional development.",
        duration: 4,
        quizzes: [
          {
            question: "Is salary negotiation appropriate?",
            options: [
              "No",
              "Yes, it's expected and professional",
              "Only for men",
              "Inappropriate",
            ],
            correctAnswer: 1,
            explanation:
              "Salary negotiation is a normal and expected part of employment.",
          },
          {
            question: "Why should you research market rates?",
            options: [
              "Unnecessary",
              "To make informed, data-backed requests",
              "Doesn't help",
              "Wrong to know",
            ],
            correctAnswer: 1,
            explanation:
              "Market research provides data to support compensation requests.",
          },
          {
            question: "Should you mention other offers?",
            options: [
              "Never",
              "Only if genuine and relevant",
              "Always",
              "As threats",
            ],
            correctAnswer: 1,
            explanation:
              "Mention other genuine offers factually to demonstrate your market value.",
          },
          {
            question: "Is compensation only salary?",
            options: [
              "Yes",
              "No, includes benefits, flexibility, development",
              "Only benefits",
              "Salary only",
            ],
            correctAnswer: 1,
            explanation:
              "Total compensation includes salary, benefits, flexibility, and growth opportunities.",
          },
          {
            question: "What if your negotiation request is denied?",
            options: [
              "Accept quietly",
              "Understand reasons and plan next steps",
              "Quit immediately",
              "Never negotiate",
            ],
            correctAnswer: 1,
            explanation:
              "Understand the reasoning and plan future negotiations or career moves.",
          },
        ],
      },
      {
        title: "Workplace Communication and Influence",
        description: "Communicate effectively and build influence",
        content:
          "Influence comes through clear communication, active listening, demonstrated expertise, and integrity. Learn to persuade ethically, provide constructive feedback, present ideas effectively, and collaborate productively.",
        duration: 5,
        quizzes: [
          {
            question: "What builds workplace influence?",
            options: [
              "Authority only",
              "Expertise, listening, integrity, communication",
              "Manipulation",
              "Power",
            ],
            correctAnswer: 1,
            explanation:
              "Genuine influence comes from demonstrated competence and ethical behavior.",
          },
          {
            question: "Why is active listening important?",
            options: [
              "Not important",
              "Shows respect and improves understanding",
              "Wastes time",
              "Never useful",
            ],
            correctAnswer: 1,
            explanation:
              "Active listening demonstrates respect and leads to better collaboration.",
          },
          {
            question: "How should you present ideas?",
            options: [
              "Vague and uncertain",
              "Clear, data-backed, with anticipated questions",
              "Confused",
              "Never present",
            ],
            correctAnswer: 1,
            explanation:
              "Prepare clear presentations with supporting data for maximum impact.",
          },
          {
            question: "Is constructive feedback important?",
            options: [
              "No",
              "Yes, it helps improvement",
              "Only criticism",
              "Never helpful",
            ],
            correctAnswer: 1,
            explanation:
              "Constructive feedback supports growth and team development.",
          },
          {
            question: "Can you build influence without authority?",
            options: [
              "No",
              "Yes, through expertise and relationships",
              "Impossible",
              "Never",
            ],
            correctAnswer: 1,
            explanation:
              "Influence exists independent of formal authority through credibility.",
          },
        ],
      },
    ],
  },
];

async function main() {
  try {
    console.log("Starting database seed...");

    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.quiz.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.learningTrack.deleteMany();

    let totalQuizzes = 0;

    // Seed tracks and lessons
    for (const track of SEED_DATA) {
      console.log(`Creating track: ${track.title}`);

      const createdTrack = await prisma.learningTrack.create({
        data: {
          id: track.id,
          title: track.title,
          description: track.description,
          icon: track.icon,
          color: track.color,
          lessons_count: track.lessons.length,
        },
      });

      // Create lessons for this track
      for (let i = 0; i < track.lessons.length; i++) {
        const lesson = track.lessons[i];
        console.log(`  Creating lesson: ${lesson.title}`);

        const createdLesson = await prisma.lesson.create({
          data: {
            id: `${track.id}-lesson-${i + 1}`,
            track_id: track.id,
            title: lesson.title,
            description: lesson.description,
            content: lesson.content,
            duration: lesson.duration,
            order: i + 1,
          },
        });

        // Create quizzes for this lesson
        if (lesson.quizzes && Array.isArray(lesson.quizzes)) {
          for (let j = 0; j < lesson.quizzes.length; j++) {
            const quiz = lesson.quizzes[j];
            await prisma.quiz.create({
              data: {
                lesson_id: createdLesson.id,
                question: quiz.question,
                options: quiz.options,
                correct_answer: quiz.correctAnswer,
                explanation: quiz.explanation,
                order: j + 1,
              },
            });
            totalQuizzes++;
          }
        }
      }
    }

    console.log("Database seed completed successfully!");
    console.log(`✅ Created ${SEED_DATA.length} tracks`);
    console.log(
      `✅ Created ${SEED_DATA.reduce(
        (acc, t) => acc + t.lessons.length,
        0
      )} lessons`
    );
    console.log(`✅ Created ${totalQuizzes} quizzes`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
