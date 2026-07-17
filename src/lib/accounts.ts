export type RiskLevel = "critical" | "high" | "moderate";

export type RescueStep = {
  text: string;
  /** Completing this step is bundled into the primary CTA (schedule check-in) */
  schedulesCheckIn?: boolean;
};

export type RescuePath = {
  id: "A" | "B" | "C";
  title: string;
  saveRate: number;
  costLabel: string;
  recommended?: boolean;
  /** Short line shown when the path is selected (before Start) */
  summary?: string;
  /** Checklist revealed after Start */
  steps?: RescueStep[];
  /** Opening script — only shown after Start when present */
  script?: string;
  /** Primary disposition button label after Start */
  ctaLabel?: string;
  riskEmphasis?: boolean;
};

export function pathCtaLabel(path: RescuePath): string {
  if (path.ctaLabel) return path.ctaLabel;
  if (path.steps?.some((step) => step.schedulesCheckIn)) {
    return "Log outreach and schedule check-in";
  }
  return "Log outreach";
}

export type WhySignal = {
  date: string;
  text: string;
  emphasize?: boolean;
};

export type Account = {
  id: string;
  name: string;
  email: string;
  risk: RiskLevel;
  score: number;
  daysLeft?: number;
  headline: string;
  summary: string;
  valueLabel: string;
  tenureLabel: string;
  agent: string | null;
  suggestedAction: string;
  primaryTrigger: string;
  mapImage: string;
  mapLabel: string;
  address: string;
  mapNote: string;
  why: WhySignal[];
  paths: RescuePath[];
  recommended: {
    title: string;
    saveRate: number;
    costLabel: string;
  };
};

export const ACCOUNTS: Account[] = [
  {
    id: "hernandez",
    name: "Hernandez Residence",
    email: "j.hernandez@example.com",
    risk: "critical",
    score: 86,
    daysLeft: 45,
    headline: "Hernandez Residence is about to give up on us.",
    summary:
      "Three failed visits. Maria feels unheard — and accounts like hers cancel within 45 days.",
    valueLabel: "$1,240",
    tenureLabel: "14mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "3 re-services in 30 days",
    mapImage: "/card-visuals/satellite-residential-hernandez.jpg",
    mapLabel: "1428 Cedar Lane",
    address: "1428 Cedar Lane",
    mapNote:
      "Hernandez Residence · $1,240/yr · 14 mo. Focus re-inspect on east fence line before next visit.",
    why: [
      {
        date: "May 12",
        text: "CSAT fell 9 → 4 — our strongest churn predictor",
      },
      {
        date: "Jun 03",
        text: "Third callback for the same ants — cancel pattern 4-to-1",
      },
      {
        date: "Jun 28",
        text: 'Tech Marcus T.: "She said we keep sending someone new and nothing changes."',
        emphasize: true,
      },
    ],
    recommended: {
      title: "Senior tech takeover",
      saveRate: 78,
      costLabel: "$180",
    },
    paths: [
      {
        id: "A",
        title: "Senior tech takeover",
        saveRate: 78,
        costLabel: "$180",
        recommended: true,
        summary:
          "Assign Marcus T. to own the east-fence ant issue with a 48-hr follow-up.",
        steps: [
          { text: "Assign Marcus T. as owner — no new techs on this account" },
          { text: "Re-inspect east fence line on next visit" },
          { text: "Apply gel + barrier treatment" },
          { text: "48-hour follow-up call by Marcus" },
          { text: "Day-14 check-in by you", schedulesCheckIn: true },
        ],
        script:
          "Mrs. Hernandez, I've read every note from all three visits. You shouldn't have had to explain this three times — so I won't ask you to again.",
      },
      {
        id: "B",
        title: "Manager call + credit",
        saveRate: 54,
        costLabel: "$310",
        summary: "Manager apology call with a service credit to buy time.",
        steps: [
          { text: "Manager calls within 24 hours" },
          { text: "Apply $310 goodwill credit" },
          { text: "Confirm next visit window with customer" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        saveRate: 21,
        costLabel: "risk $1,240",
        riskEmphasis: true,
        summary: "No outreach now — monitor for further CSAT drop.",
        steps: [
          { text: "Leave account in watch queue" },
          { text: "Re-score in 7 days" },
          { text: "Escalate if another callback lands" },
        ],
      },
    ],
  },
  {
    id: "blue-ridge",
    name: "Brooks Residence",
    email: "m.brooks@example.com",
    risk: "high",
    score: 72,
    headline: "Brooks Residence is shopping a competitor quote.",
    summary:
      "Competitor offer + pricing pushback. Last contact Jul 1 — suggested: Problem Solve.",
    valueLabel: "$1,180",
    tenureLabel: "8mo",
    agent: "Stephanie White",
    suggestedAction: "Problem Solve",
    primaryTrigger: "Competitor quote mentioned",
    mapImage: "/card-visuals/satellite-residential-blue-ridge.jpg",
    mapLabel: "918 Maple Court",
    address: "918 Maple Court",
    mapNote:
      "Brooks Residence · $1,180/yr · 8 mo. Competitor quote in play — win back on service.",
    why: [
      {
        date: "Jun 22",
        text: "Homeowner referenced a competitor quote on a pricing call",
      },
      {
        date: "Jun 28",
        text: "Pricing pushback logged on renewal discussion",
      },
      {
        date: "Jul 01",
        text: "Last contact — Stephanie White; no save offer applied yet",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Competitive match + retention call",
      saveRate: 64,
      costLabel: "$120",
    },
    paths: [
      {
        id: "A",
        title: "Competitive match + retention call",
        saveRate: 64,
        costLabel: "$120",
        recommended: true,
        summary:
          "Stephanie matches the competitor quote and walks the service difference.",
        steps: [
          { text: "Stephanie owns the retention call" },
          { text: "Match competitor quote for 2 quarters" },
          { text: "Add quarterly service audit" },
        ],
        script:
          "I saw you mentioned a competitor quote — before you decide, I want to walk through what we'd match and what we'd improve on service, not just price.",
      },
      {
        id: "B",
        title: "Manager goodwill credit",
        saveRate: 48,
        costLabel: "$180",
        summary: "One-time credit without locking a competitive match.",
        steps: [
          { text: "Manager goodwill call" },
          { text: "Apply $180 credit" },
          { text: "Schedule 30-day check-in", schedulesCheckIn: true },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        saveRate: 18,
        costLabel: "risk $1,180",
        riskEmphasis: true,
        summary: "Hold off — re-engage if renewal window opens.",
        steps: [
          { text: "Park in watch queue" },
          { text: "Flag at renewal −14 days" },
        ],
      },
    ],
  },
  {
    id: "patel",
    name: "Patel Family",
    email: "r.patel@example.com",
    risk: "high",
    score: 68,
    headline: "Patel Family has missed two payments.",
    summary:
      "Missed payment + late invoice. No recent contact — suggested: Problem Solve.",
    valueLabel: "$890",
    tenureLabel: "22mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "2 missed payments",
    mapImage: "/card-visuals/satellite-residential-patel.jpg",
    mapLabel: "610 Briarwood Lane",
    address: "610 Briarwood Lane",
    mapNote: "Patel Family · $890/yr · 22 mo. Long-tenure home · billing friction.",
    why: [
      { date: "Jun 10", text: "First missed payment on quarterly plan" },
      { date: "Jun 24", text: "Second missed payment · late invoice notice sent" },
      {
        date: "Jul 02",
        text: "No agent outreach logged — account still unassigned",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Billing reset + autopay enroll",
      saveRate: 71,
      costLabel: "$90",
    },
    paths: [
      {
        id: "A",
        title: "Billing reset + autopay enroll",
        saveRate: 71,
        costLabel: "$90",
        recommended: true,
        summary: "Clear late fees, reset due date, enroll autopay by text.",
        steps: [
          { text: "Waive late fees" },
          { text: "Set new due date" },
          { text: "Enroll autopay over text" },
          { text: "Day-7 confirmation" },
        ],
        script:
          "I'm calling about the two missed payments — not to pressure you, but to make sure nothing on our side is making this harder than it should be.",
      },
      {
        id: "B",
        title: "Payment plan offer",
        saveRate: 52,
        costLabel: "$0 now",
        summary: "Split remaining balance across two cycles.",
        steps: [
          { text: "Offer 2-cycle payment plan" },
          { text: "Confirm first installment date" },
          { text: "Send plan summary text" },
        ],
      },
      {
        id: "C",
        title: "Collections path",
        saveRate: 15,
        costLabel: "risk $890",
        riskEmphasis: true,
        summary: "Route to collections after one final notice.",
        steps: [
          { text: "Send final notice" },
          { text: "Hand off to collections in 10 days" },
        ],
      },
    ],
  },
  {
    id: "sunrise",
    name: "Nguyen Residence",
    email: "a.nguyen@example.com",
    risk: "high",
    score: 61,
    headline: "Nguyen Residence is stuck in a support backlog.",
    summary:
      "Support ticket backlog. Last contact Jun 30 — suggested: Lock-in.",
    valueLabel: "$960",
    tenureLabel: "31mo",
    agent: "Devon Pain",
    suggestedAction: "Lock-in",
    primaryTrigger: "Support ticket backlog",
    mapImage: "/card-visuals/satellite-residential-sunrise.jpg",
    mapLabel: "4410 Desert Bloom Rd",
    address: "4410 Desert Bloom Rd",
    mapNote:
      "Nguyen Residence · $960/yr · 31 mo. Open scheduling tickets — close before renewal.",
    why: [
      { date: "Jun 18", text: "Support ticket opened — scheduling conflict" },
      { date: "Jun 25", text: "Second ticket escalated · still unresolved" },
      {
        date: "Jun 30",
        text: "Devon Pain last contact — promised a lock-in follow-up",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Priority ticket close + lock-in",
      saveRate: 69,
      costLabel: "$90",
    },
    paths: [
      {
        id: "A",
        title: "Priority ticket close + lock-in",
        saveRate: 69,
        costLabel: "$90",
        recommended: true,
        summary: "Devon closes open tickets, then offers a 12-mo lock-in.",
        steps: [
          { text: "Devon closes tickets in 48 hrs" },
          { text: "Dedicated tech for next 2 visits" },
          { text: "Present 12-mo lock-in offer" },
        ],
        script:
          "Devon asked me to own your open tickets personally — I'm not going to ask you to re-explain anything already in the thread.",
      },
      {
        id: "B",
        title: "Service credit only",
        saveRate: 41,
        costLabel: "$150",
        summary: "Apply credit without a lock-in conversation.",
        steps: [
          { text: "Apply $150 service credit" },
          { text: "Confirm tickets still in queue" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        saveRate: 22,
        costLabel: "risk $960",
        riskEmphasis: true,
        summary: "Let tickets clear through normal queue.",
        steps: [
          { text: "Leave in support queue" },
          { text: "Revisit if SLA breaches" },
        ],
      },
    ],
  },
  {
    id: "okafor",
    name: "Okafor Residence",
    email: "c.okafor@example.com",
    risk: "high",
    score: 58,
    headline: "Okafor Residence left a public review.",
    summary:
      "Negative review, sentiment risk. No recent contact — suggested: Problem Solve.",
    valueLabel: "$720",
    tenureLabel: "5mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "Negative public review",
    mapImage: "/card-visuals/satellite-residential-okafor.jpg",
    mapLabel: "227 Willow Bend",
    address: "227 Willow Bend",
    mapNote: "Okafor Residence · $720/yr · 5 mo. Early tenure · public sentiment risk.",
    why: [
      { date: "Jun 20", text: "Service visit scored poorly in post-visit survey" },
      { date: "Jun 27", text: "Negative public review published" },
      {
        date: "Jul 01",
        text: "No outreach logged — still unassigned",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Recovery visit + review response",
      saveRate: 66,
      costLabel: "$150",
    },
    paths: [
      {
        id: "A",
        title: "Recovery visit + review response",
        saveRate: 66,
        costLabel: "$150",
        recommended: true,
        summary: "Senior re-service plus a drafted public reply.",
        steps: [
          { text: "Schedule senior tech re-service" },
          { text: "Send personal apology note" },
          { text: "Draft public review reply for approval" },
        ],
        script:
          "I read your review before calling — you shouldn't have had to go public to get our attention, and I want to fix what went wrong.",
      },
      {
        id: "B",
        title: "Credit + manager call",
        saveRate: 45,
        costLabel: "$220",
        summary: "Manager apology with credit; no re-service yet.",
        steps: [
          { text: "Manager call within 24 hrs" },
          { text: "Apply $220 credit" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        saveRate: 19,
        costLabel: "risk $720",
        riskEmphasis: true,
        summary: "No outreach — monitor for further reviews.",
        steps: [
          { text: "Watch social mentions" },
          { text: "Escalate on second review" },
        ],
      },
    ],
  },
  {
    id: "whitfield",
    name: "Whitfield Residence",
    email: "j.whitfield@example.com",
    risk: "moderate",
    score: 54,
    headline: "Whitfield Residence is pushing back on the price increase.",
    summary:
      "Pricing pushback. Last contact Jun 29 — suggested: Appease.",
    valueLabel: "$1,420",
    tenureLabel: "19mo",
    agent: "Marcus Thompson",
    suggestedAction: "Appease",
    primaryTrigger: "Price increase pushback",
    mapImage: "/card-visuals/satellite-residential-whitfield.jpg",
    mapLabel: "55 Oak Hollow Dr",
    address: "55 Oak Hollow Dr",
    mapNote:
      "Whitfield Residence · $1,420/yr · 19 mo. Price sensitivity at renewal.",
    why: [
      { date: "Jun 15", text: "Renewal notice included 8% price increase" },
      { date: "Jun 22", text: "Homeowner replied with pushback on increase" },
      {
        date: "Jun 29",
        text: "Marcus Thompson last contact — appeasement pending",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Hold rate + yard audit",
      saveRate: 58,
      costLabel: "$0 increase",
    },
    paths: [
      {
        id: "A",
        title: "Hold rate + yard audit",
        saveRate: 58,
        costLabel: "$0 increase",
        recommended: true,
        summary: "Freeze the increase and offer a complimentary yard audit.",
        steps: [
          { text: "Freeze increase for 2 quarters" },
          { text: "Schedule complimentary yard audit" },
          { text: "Marcus owns the relationship going forward" },
        ],
        script:
          "Marcus flagged your price-increase concern — I want to walk the numbers with you and find a hold that still works for both of us.",
      },
      {
        id: "B",
        title: "Partial increase + credit",
        saveRate: 44,
        costLabel: "4% increase",
        summary: "Meet in the middle at 4% with a one-time credit.",
        steps: [
          { text: "Propose 4% increase" },
          { text: "Apply one-time credit" },
          { text: "Confirm in writing" },
        ],
      },
      {
        id: "C",
        title: "Proceed with increase",
        saveRate: 28,
        costLabel: "risk $1,420",
        riskEmphasis: true,
        summary: "Hold the 8% increase and document the decision.",
        steps: [
          { text: "Confirm increase stands" },
          { text: "Send renewal packet" },
        ],
      },
    ],
  },
  {
    id: "chen",
    name: "Chen Residence",
    email: "l.chen@example.com",
    risk: "moderate",
    score: 49,
    headline: "Chen Residence hit a service issue in month 3.",
    summary:
      "Early tenure service issues. Suggested action: Do Nothing — watch for now.",
    valueLabel: "$540",
    tenureLabel: "3mo",
    agent: null,
    suggestedAction: "Do Nothing",
    primaryTrigger: "Early tenure service issue",
    mapImage: "/card-visuals/satellite-residential-chen.jpg",
    mapLabel: "802 Ridgeview Ct",
    address: "802 Ridgeview Ct",
    mapNote: "Chen Residence · $540/yr · 3 mo. Early tenure · single service issue.",
    why: [
      { date: "Jun 08", text: "Onboarded — quarterly residential plan" },
      { date: "Jun 21", text: "Service issue flagged on second visit" },
      {
        date: "Jul 01",
        text: "Model suggests watch — no outreach required yet",
        emphasize: true,
      },
    ],
    recommended: {
      title: "Light check-in text",
      saveRate: 42,
      costLabel: "$0",
    },
    paths: [
      {
        id: "A",
        title: "Light check-in text",
        saveRate: 42,
        costLabel: "$0",
        recommended: true,
        summary: "One personal check-in — no credit unless they ask.",
        steps: [
          { text: "Send one personal check-in text" },
          { text: "Offer optional re-inspect" },
          { text: "No credit unless requested" },
        ],
        script:
          "I noticed the service note from your second visit — checking in early so a small issue doesn't become the reason you leave.",
      },
      {
        id: "B",
        title: "Complimentary re-inspect",
        saveRate: 51,
        costLabel: "$95",
        summary: "Proactive free re-inspect before they ask.",
        steps: [
          { text: "Schedule complimentary re-inspect" },
          { text: "Confirm window by text" },
        ],
      },
      {
        id: "C",
        title: "Do nothing",
        saveRate: 35,
        costLabel: "watch only",
        summary: "Leave in watch — model says no outreach yet.",
        steps: [
          { text: "Keep in watch queue" },
          { text: "Re-score at day 30" },
        ],
      },
    ],
  },
];
