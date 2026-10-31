import { SUPPORT_EMAIL } from "../guide/constants";

export const APP_NAME = "ChemQuote AI";
export const LAST_UPDATED = "31 October 2026";
export { SUPPORT_EMAIL };

const GOOGLE_PERMISSIONS_URL = "https://myaccount.google.com/permissions";
const GOOGLE_POLICY_URL = "https://developers.google.com/terms/api-services-user-data-policy";

export const PRIVACY_SECTIONS = [
  {
    title: "What ChemQuote AI does",
    paragraphs: [
      "ChemQuote AI helps a sales team that sells chemicals. After you sign in with Google and allow Gmail access, it reads your new incoming emails, finds the ones where a customer asks for a price, works out which product and how much they want, and adds a label to those emails in your Gmail.",
    ],
  },
  {
    title: "What we access from your Google account",
    list: [
      "Your name, email address and profile picture, to sign you in and show your name in the app.",
      "Your Gmail messages and labels, through the gmail.modify permission. We use it to read each new email that arrives in your inbox, and to create one label (by default “pricing query”) and add it to price-request emails.",
    ],
    paragraphs: ["We do not send emails for you, delete emails, or change anything in your mailbox other than adding that label."],
  },
  {
    title: "What we store",
    list: [
      "For each email that arrives: the sender, subject, text, date, and the result of our analysis (whether it is a price request, the products and quantity found, and a short reason).",
      "Your product catalog: product names, item codes, formulas and the other names you enter.",
      "Your account details (name, email, picture, display name) and a token that lets the app keep reading your Gmail. The token is encrypted before it is saved.",
      "Your choices in the app, such as the label name and which emails you marked as read.",
    ],
  },
  {
    title: "Who sees your data",
    paragraphs: [
      "Only you can see your emails and catalog in the app. To read an email, we send its subject and text, together with your product list, to Google’s Gemini AI service, which returns the products and quantity it found. We do not sell your data, share it with advertisers, or use it to train AI models. We do not let people read your email, except where needed for security, to follow the law, or with your permission.",
    ],
  },
  {
    title: "Google API Services User Data Policy",
    paragraphs: [
      `ChemQuote AI’s use and transfer of information received from Google APIs to any other app will adhere to the Google API Services User Data Policy (${GOOGLE_POLICY_URL}), including the Limited Use requirements. Data from Gmail is used only to provide and improve the features you see in the app, is not transferred to others except as needed to provide those features, and is not used for advertising.`,
    ],
  },
  {
    title: "The public playground",
    paragraphs: [
      "The playground at /playground works without signing in and never connects to any inbox. To keep this free demo fair, we count requests per device and per network. We store only a scrambled code of your network address and of a device fingerprint, never the address or device details themselves. The products and email text you type are sent to the AI to produce a result and are not saved.",
    ],
  },
  {
    title: "Cookies",
    paragraphs: ["We use one cookie, a session cookie that keeps you signed in for up to 24 hours. We do not use advertising or tracking cookies."],
  },
  {
    title: "Keeping your data safe",
    paragraphs: [
      "Data is sent over HTTPS, your Google access token is encrypted, and every request is checked so you can only reach your own data. No system is perfectly secure, so please keep your Google account protected too.",
    ],
  },
  {
    title: "Your choices and deleting your data",
    list: [
      `You can stop ChemQuote AI from accessing Gmail at any time at ${GOOGLE_PERMISSIONS_URL}.`,
      `To have your account and all stored emails and catalog entries deleted, email ${SUPPORT_EMAIL} from the address you signed in with. We will delete them promptly.`,
    ],
  },
  {
    title: "Changes and contact",
    paragraphs: [`We may update this policy and will change the date above when we do. Questions? Email ${SUPPORT_EMAIL}.`],
  },
];

export const TERMS_SECTIONS = [
  {
    title: "Using the service",
    paragraphs: [
      `By signing in to or using ${APP_NAME} you agree to these terms. If you do not agree, please do not use it. You must be allowed to use the Google account you connect and have the right to let the app process the emails in it.`,
    ],
  },
  {
    title: "What the service does",
    paragraphs: [
      "ChemQuote AI reads emails in the Gmail account you connect, uses AI to find price requests, products and quantities, and labels matching emails. It is a hackathon project provided as is, and it may change or stop at any time.",
    ],
  },
  {
    title: "AI results can be wrong",
    paragraphs: [
      "The analysis is produced by an AI model and may miss a price request or misread a product or quantity. Always check important emails yourself before replying or quoting. We are not responsible for business decisions made from the results.",
    ],
  },
  {
    title: "Your responsibilities",
    list: [
      "Keep your Google account secure.",
      "Do not misuse the service, try to break it, overload it, or access data that is not yours.",
      "Do not use the playground to send unlawful content or to get around its limits.",
    ],
  },
  {
    title: "Your data",
    paragraphs: ["You keep ownership of your emails and catalog. How we handle them is described in the Privacy Policy. You can disconnect Gmail and ask us to delete your data at any time."],
  },
  {
    title: "No warranty and limited liability",
    paragraphs: [
      "The service is provided “as is” and “as available” without promises of accuracy, uptime or fitness for a particular purpose. To the fullest extent the law allows, we are not liable for indirect or consequential losses, or for lost profits, data or business arising from your use of the service.",
    ],
  },
  {
    title: "Ending your use",
    paragraphs: ["You can stop at any time by revoking Gmail access in your Google account. We may suspend access if these terms are broken or the service is shut down."],
  },
  {
    title: "Changes and contact",
    paragraphs: [`We may update these terms and will change the date above when we do. Questions? Email ${SUPPORT_EMAIL}.`],
  },
];
