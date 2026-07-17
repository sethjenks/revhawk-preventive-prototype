export type RiskLevel = "critical" | "high" | "moderate";

export type PestType = "ants" | "roaches" | "other";

export type PestActivityLevel = "low" | "moderate" | "high";

export type PestActivity = {
  pest: PestType;
  activity: PestActivityLevel;
};

export type CadenceStatus =
  | "on_track"
  | "overdue"
  | "quarter_ending"
  | "over_a_quarter";

export type DiscountOffer = {
  /** Percent of annual value, typically 10 */
  percent: number;
  /** True when deeper than 10% — requires manager approval */
  requiresManagerApproval?: boolean;
  label: string;
};

export type RescueStep = {
  text: string;
  /** Completing this step is bundled into the primary CTA (schedule check-in) */
  schedulesCheckIn?: boolean;
};

export type RescuePath = {
  id: "A" | "B" | "C";
  title: string;
  /** Estimated likelihood of retaining the customer (0–100) */
  retentionLikelihood: number;
  recommended?: boolean;
  /** Short line shown when the path is selected (before Start) */
  summary?: string;
  /** Checklist revealed after Start — CS/outreach only, never tech execution */
  steps?: RescueStep[];
  /** Example conversation opener — shown after Start when present */
  conversationStarter?: string;
  /** Primary disposition button label after Start */
  ctaLabel?: string;
  riskEmphasis?: boolean;
  /** Optional discount; free-first paths omit this */
  discount?: DiscountOffer;
};

export function pathCtaLabel(path: RescuePath): string {
  if (path.ctaLabel) return path.ctaLabel;
  if (path.steps?.some((step) => step.schedulesCheckIn)) {
    return "Preview FieldRoutes note & schedule check-in";
  }
  return "Preview FieldRoutes note";
}

export function retentionLikelihoodLabel(percent: number): string {
  return `Estimated ${percent}% likelihood of retaining this customer`;
}

export type WhySignal = {
  date: string;
  text: string;
  emphasize?: boolean;
};

export type ServiceSnapshot = {
  recentServiceCount: number;
  recentServiceWindowDays: number;
  daysSinceLastService: number;
  pestActivityNote: string;
  contractCadence: string;
  cadenceStatus: CadenceStatus;
  cadenceLabel: string;
};

export type Account = {
  id: string;
  name: string;
  email: string;
  phone: string;
  risk: RiskLevel;
  score: number;
  daysLeft?: number;
  /** Plain-language risk badge, e.g. "Critical · likely to cancel within 30 days" */
  riskLabel: string;
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
  /** Deep link to this customer's FieldRoutes account */
  fieldRoutesUrl: string;
  service: ServiceSnapshot;
  pestActivities: PestActivity[];
  /** Summarized complaint history when present */
  complaintSummary?: string;
  /** Billing issue when present, e.g. failed card */
  billingIssue?: string;
  why: WhySignal[];
  paths: RescuePath[];
  recommendedPathId: RescuePath["id"];
};

export function recommendedPath(account: Account): RescuePath {
  return (
    account.paths.find((p) => p.id === account.recommendedPathId) ??
    account.paths[0]
  );
}

export const ACCOUNTS: Account[] = [
  {
    id: "hernandez",
    name: "Hernandez Residence",
    email: "j.hernandez@example.com",
    phone: "(512) 555-0142",
    risk: "critical",
    score: 86,
    daysLeft: 45,
    riskLabel: "Critical · likely to cancel within 30 days",
    headline: "Hernandez Residence is about to give up on us.",
    summary:
      "Maria has called back three times about the same ant issue, and her CSAT dropped from 9 to 4. She says rotating technicians make her feel unheard, putting the account at immediate risk.",
    valueLabel: "$1,240",
    tenureLabel: "14mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "3 re-services in 30 days",
    mapImage: "/card-visuals/satellite-residential-hernandez.jpg",
    mapLabel: "1428 Cedar Lane",
    address: "1428 Cedar Lane",
    mapNote:
      "Hernandez Residence · $1,240/yr · 14 mo. East fence line ants flagged in tech notes — own the relationship before next visit.",
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/hernandez-1428",
    service: {
      recentServiceCount: 3,
      recentServiceWindowDays: 30,
      daysSinceLastService: 19,
      pestActivityNote:
        'Tech Marcus T.: "She said we keep sending someone new and nothing changes." Activity high on east fence.',
      contractCadence: "Monthly",
      cadenceStatus: "on_track",
      cadenceLabel: "On monthly cadence",
    },
    pestActivities: [{ pest: "ants", activity: "high" }],
    complaintSummary:
      "3 callbacks in 30 days for the same ant issue; CSAT fell 9 → 4.",
    why: [
      {
        date: "Current",
        text: "High ant activity remains along the east fence",
      },
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
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Dedicated owner + apology outreach",
        retentionLikelihood: 78,
        recommended: true,
        summary:
          "Assign Marcus T. as sole owner, call with full context, and schedule a Day-14 check-in. No tech treatment instructions from this desk.",
        steps: [
          {
            text: "Assign Marcus T. as account owner — no rotating techs",
          },
          {
            text: "Log east-fence ant history in FieldRoutes notes for the next visit",
          },
          {
            text: "Call within 24 hours with that context (apology + ownership)",
          },
          { text: "Day-14 check-in by you", schedulesCheckIn: true },
        ],
        conversationStarter:
          "Mrs. Hernandez, I've read every note from all three visits. You shouldn't have had to explain this three times — so I won't ask you to again.",
      },
      {
        id: "B",
        title: "Manager call + 10% goodwill credit",
        retentionLikelihood: 54,
        discount: {
          percent: 10,
          label: "10% goodwill credit (~$124)",
        },
        summary:
          "Manager apology call with an optional 10% credit to buy time while ownership is fixed.",
        steps: [
          { text: "Manager calls within 24 hours" },
          { text: "Offer 10% goodwill credit if needed to keep the conversation open" },
          { text: "Confirm next visit window with customer" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        retentionLikelihood: 21,
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
    phone: "(512) 555-0187",
    risk: "high",
    score: 72,
    daysLeft: 28,
    riskLabel: "High · likely to cancel within 30 days",
    headline: "Brooks Residence is shopping a competitor quote.",
    summary:
      "Brooks mentioned a competitor quote after pushing back on renewal pricing. No retention offer or follow-up has been logged since July 1.",
    valueLabel: "$1,180",
    tenureLabel: "8mo",
    agent: "Stephanie White",
    suggestedAction: "Problem Solve",
    primaryTrigger: "Competitor quote mentioned",
    mapImage: "/card-visuals/satellite-residential-blue-ridge.jpg",
    mapLabel: "918 Maple Court",
    address: "918 Maple Court",
    mapNote:
      "Brooks Residence · $1,180/yr · 8 mo. Competitor quote in play — win back on service and relationship.",
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/brooks-918",
    service: {
      recentServiceCount: 2,
      recentServiceWindowDays: 90,
      daysSinceLastService: 41,
      pestActivityNote:
        "Last tech note: light ant trails near patio; no roach activity.",
      contractCadence: "Quarterly",
      cadenceStatus: "quarter_ending",
      cadenceLabel: "Quarter ending · service due soon",
    },
    pestActivities: [{ pest: "ants", activity: "moderate" }],
    complaintSummary: "Pricing pushback on renewal; competitor quote mentioned.",
    why: [
      {
        date: "Current",
        text: "Moderate ant activity; quarterly service due soon",
      },
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
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Retention call + service differentiators",
        retentionLikelihood: 64,
        recommended: true,
        summary:
          "Stephanie owns the call, walks service value vs. the competitor, and documents preferences — free-first, no field work from this desk.",
        steps: [
          { text: "Stephanie owns the retention call" },
          {
            text: "Document service differentiators and customer preferences for the next visit",
          },
          { text: "Confirm next visit window preference" },
        ],
        conversationStarter:
          "I saw you mentioned a competitor quote — before you decide, I want to walk through what we'd match on relationship and service, not just price.",
      },
      {
        id: "B",
        title: "Manager goodwill + 10% credit",
        retentionLikelihood: 48,
        discount: {
          percent: 10,
          label: "10% credit (~$118)",
        },
        summary: "One-time 10% credit without locking a deep competitive match.",
        steps: [
          { text: "Manager goodwill call" },
          { text: "Offer 10% credit if needed" },
          { text: "Schedule 30-day check-in", schedulesCheckIn: true },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        retentionLikelihood: 18,
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
    phone: "(512) 555-0119",
    risk: "high",
    score: 68,
    riskLabel: "High · billing friction risking cancel",
    headline: "Patel Family has missed two payments.",
    summary:
      "Patel's card failed twice, leaving a late quarterly invoice. No one has reached out to learn whether the payment issue is accidental or a sign they may leave.",
    valueLabel: "$890",
    tenureLabel: "22mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "2 missed payments",
    mapImage: "/card-visuals/satellite-residential-patel.jpg",
    mapLabel: "610 Briarwood Lane",
    address: "610 Briarwood Lane",
    mapNote: "Patel Family · $890/yr · 22 mo. Long-tenure home · billing friction.",
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/patel-610",
    service: {
      recentServiceCount: 1,
      recentServiceWindowDays: 90,
      daysSinceLastService: 78,
      pestActivityNote: "No pest activity flagged in recent tech notes.",
      contractCadence: "Quarterly",
      cadenceStatus: "overdue",
      cadenceLabel: "Quarterly cadence overdue",
    },
    pestActivities: [{ pest: "roaches", activity: "low" }],
    billingIssue: "Card on file failed twice · late invoice notice sent",
    why: [
      {
        date: "Current",
        text: "Quarterly service overdue",
      },
      { date: "Jun 10", text: "First missed payment on quarterly plan" },
      { date: "Jun 24", text: "Second missed payment · late invoice notice sent" },
      {
        date: "Jul 02",
        text: "No agent outreach logged — account still unassigned",
        emphasize: true,
      },
    ],
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Billing reset + autopay enroll",
        retentionLikelihood: 71,
        recommended: true,
        summary: "Clear late fees, reset due date, enroll autopay by text — no discount required.",
        steps: [
          { text: "Waive late fees" },
          { text: "Set new due date" },
          { text: "Enroll autopay over text" },
          { text: "Day-7 confirmation call or text" },
        ],
        conversationStarter:
          "I'm calling about the two missed payments — not to pressure you, but to make sure nothing on our side is making this harder than it should be.",
      },
      {
        id: "B",
        title: "Payment plan offer",
        retentionLikelihood: 52,
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
        retentionLikelihood: 15,
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
    phone: "(512) 555-0164",
    risk: "high",
    score: 61,
    riskLabel: "High · unresolved tickets before renewal",
    headline: "Nguyen Residence is stuck in a support backlog.",
    summary:
      "Two scheduling tickets remain unresolved after Devon promised a follow-up. Their renewal is approaching while the account is still stuck in support.",
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
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/nguyen-4410",
    service: {
      recentServiceCount: 2,
      recentServiceWindowDays: 90,
      daysSinceLastService: 55,
      pestActivityNote:
        "Tech note: recurring ants in kitchen; customer asked for consistent tech.",
      contractCadence: "Bi-monthly",
      cadenceStatus: "on_track",
      cadenceLabel: "On bi-monthly cadence",
    },
    pestActivities: [{ pest: "ants", activity: "moderate" }],
    complaintSummary:
      "2 open scheduling tickets; customer promised a lock-in follow-up that never landed.",
    why: [
      {
        date: "Current",
        text: "Moderate ant activity continues in the kitchen; customer requested a consistent tech",
      },
      { date: "Jun 18", text: "Support ticket opened — scheduling conflict" },
      { date: "Jun 25", text: "Second ticket escalated · still unresolved" },
      {
        date: "Jun 30",
        text: "Devon Pain last contact — promised a lock-in follow-up",
        emphasize: true,
      },
    ],
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Priority ticket close + lock-in conversation",
        retentionLikelihood: 69,
        recommended: true,
        summary:
          "Devon closes open tickets, assigns a dedicated tech on the next two scheduled visits, then offers a 12-mo lock-in.",
        steps: [
          { text: "Devon closes tickets in 48 hrs" },
          {
            text: "Assign dedicated tech on next 2 scheduled visits",
          },
          { text: "Present 12-mo lock-in offer on the call" },
        ],
        conversationStarter:
          "Devon asked me to own your open tickets personally — I'm not going to ask you to re-explain anything already in the thread.",
      },
      {
        id: "B",
        title: "Apology call + 10% credit",
        retentionLikelihood: 41,
        discount: {
          percent: 10,
          label: "10% credit (~$96)",
        },
        summary: "Apply a 10% credit without a lock-in conversation.",
        steps: [
          { text: "Offer 10% service credit if needed" },
          { text: "Confirm tickets still owned and closing" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        retentionLikelihood: 22,
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
    phone: "(512) 555-0138",
    risk: "high",
    score: 58,
    riskLabel: "High · public review may drive cancel",
    headline: "Okafor Residence left a public review.",
    summary:
      "Okafor posted a negative public review after a poorly rated service visit. No one has followed up, making this early-tenure account especially vulnerable.",
    valueLabel: "$720",
    tenureLabel: "5mo",
    agent: null,
    suggestedAction: "Problem Solve",
    primaryTrigger: "Negative public review",
    mapImage: "/card-visuals/satellite-residential-okafor.jpg",
    mapLabel: "227 Willow Bend",
    address: "227 Willow Bend",
    mapNote: "Okafor Residence · $720/yr · 5 mo. Early tenure · public sentiment risk.",
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/okafor-227",
    service: {
      recentServiceCount: 2,
      recentServiceWindowDays: 60,
      daysSinceLastService: 27,
      pestActivityNote:
        "Post-visit survey and review cite roaches returning after service.",
      contractCadence: "Monthly",
      cadenceStatus: "on_track",
      cadenceLabel: "On monthly cadence",
    },
    pestActivities: [{ pest: "roaches", activity: "high" }],
    complaintSummary:
      "Poor post-visit survey + negative public review; no outreach since.",
    why: [
      {
        date: "Current",
        text: "High roach activity; customer reports pests returning after service",
      },
      { date: "Jun 20", text: "Service visit scored poorly in post-visit survey" },
      { date: "Jun 27", text: "Negative public review published" },
      {
        date: "Jul 01",
        text: "No outreach logged — still unassigned",
        emphasize: true,
      },
    ],
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Apology outreach + review response",
        retentionLikelihood: 66,
        recommended: true,
        summary:
          "Personal apology call, draft public reply, and flag priority on the next scheduled visit — no complimentary re-service from this desk.",
        steps: [
          { text: "Call within 24 hours with a personal apology" },
          { text: "Send personal apology note / text follow-up" },
          { text: "Draft public review reply for approval" },
          {
            text: "Flag priority / context on next scheduled visit in FieldRoutes",
          },
        ],
        conversationStarter:
          "I read your review before calling — you shouldn't have had to go public to get our attention, and I want to fix what went wrong.",
      },
      {
        id: "B",
        title: "Manager call + 10% credit",
        retentionLikelihood: 45,
        discount: {
          percent: 10,
          label: "10% credit (~$72)",
        },
        summary: "Manager apology with optional 10% credit.",
        steps: [
          { text: "Manager call within 24 hrs" },
          { text: "Offer 10% credit if needed" },
        ],
      },
      {
        id: "C",
        title: "Watch and wait",
        retentionLikelihood: 19,
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
    phone: "(512) 555-0171",
    risk: "moderate",
    score: 54,
    riskLabel: "Moderate · price pushback at renewal",
    headline: "Whitfield Residence is pushing back on the price increase.",
    summary:
      "Whitfield pushed back on the 8% renewal increase. Marcus last contacted them June 29, but the pricing concern is still unresolved.",
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
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/whitfield-55",
    service: {
      recentServiceCount: 1,
      recentServiceWindowDays: 90,
      daysSinceLastService: 94,
      pestActivityNote: "No active pest complaints in recent notes.",
      contractCadence: "Quarterly",
      cadenceStatus: "over_a_quarter",
      cadenceLabel: "Over a quarter since last service",
    },
    pestActivities: [
      { pest: "ants", activity: "low" },
      { pest: "roaches", activity: "low" },
    ],
    why: [
      {
        date: "Current",
        text: "Over a quarter since last service",
      },
      { date: "Jun 15", text: "Renewal notice included 8% price increase" },
      { date: "Jun 22", text: "Homeowner replied with pushback on increase" },
      {
        date: "Jun 29",
        text: "Marcus Thompson last contact — appeasement pending",
        emphasize: true,
      },
    ],
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Hold rate + retention call",
        retentionLikelihood: 58,
        recommended: true,
        summary:
          "Freeze the increase for two quarters and confirm in writing — Marcus owns the relationship. No complimentary field work.",
        steps: [
          { text: "Freeze increase for 2 quarters" },
          { text: "Confirm hold in writing" },
          { text: "Marcus owns the relationship going forward" },
        ],
        conversationStarter:
          "Marcus flagged your price-increase concern — I want to walk the numbers with you and find a hold that still works for both of us.",
      },
      {
        id: "B",
        title: "Partial increase + 10% one-time credit",
        retentionLikelihood: 44,
        discount: {
          percent: 10,
          label: "10% one-time credit (~$142)",
        },
        summary: "Meet in the middle at 4% with a one-time 10% credit.",
        steps: [
          { text: "Propose 4% increase" },
          { text: "Offer one-time 10% credit if needed" },
          { text: "Confirm in writing" },
        ],
      },
      {
        id: "C",
        title: "Proceed with increase",
        retentionLikelihood: 28,
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
    phone: "(512) 555-0126",
    risk: "moderate",
    score: 49,
    riskLabel: "Moderate · early tenure watch",
    headline: "Chen Residence hit a service issue in month 3.",
    summary:
      "Chen reported an issue after only their second service visit. The signal is moderate, but an early check-in could keep a small concern from becoming a cancellation.",
    valueLabel: "$540",
    tenureLabel: "3mo",
    agent: null,
    suggestedAction: "Do Nothing",
    primaryTrigger: "Early tenure service issue",
    mapImage: "/card-visuals/satellite-residential-chen.jpg",
    mapLabel: "802 Ridgeview Ct",
    address: "802 Ridgeview Ct",
    mapNote: "Chen Residence · $540/yr · 3 mo. Early tenure · single service issue.",
    fieldRoutesUrl: "https://fieldroutes.example.com/customers/chen-802",
    service: {
      recentServiceCount: 2,
      recentServiceWindowDays: 90,
      daysSinceLastService: 26,
      pestActivityNote:
        "Second-visit note: ants near foundation; customer asked a few questions.",
      contractCadence: "Quarterly",
      cadenceStatus: "on_track",
      cadenceLabel: "On quarterly cadence",
    },
    pestActivities: [{ pest: "ants", activity: "moderate" }],
    why: [
      {
        date: "Current",
        text: "Moderate ant activity near the foundation noted on the second visit",
      },
      { date: "Jun 08", text: "Onboarded — quarterly residential plan" },
      { date: "Jun 21", text: "Service issue flagged on second visit" },
      {
        date: "Jul 01",
        text: "Model suggests watch — no outreach required yet",
        emphasize: true,
      },
    ],
    recommendedPathId: "A",
    paths: [
      {
        id: "A",
        title: "Light check-in text",
        retentionLikelihood: 42,
        recommended: true,
        summary:
          "One personal check-in — document the concern and help with the next regular visit. No credit unless they ask.",
        steps: [
          { text: "Send one personal check-in text" },
          { text: "Document their concern in FieldRoutes notes" },
          {
            text: "Offer scheduling help for the next regular visit",
          },
        ],
        conversationStarter:
          "I noticed the service note from your second visit — checking in early so a small issue doesn't become the reason you leave.",
      },
      {
        id: "B",
        title: "Manager check-in call",
        retentionLikelihood: 51,
        summary: "Proactive manager call — no complimentary re-inspect.",
        steps: [
          { text: "Manager check-in call within 48 hrs" },
          { text: "Confirm next scheduled visit works for them" },
        ],
      },
      {
        id: "C",
        title: "Do nothing",
        retentionLikelihood: 35,
        summary: "Leave in watch — model says no outreach yet.",
        steps: [
          { text: "Keep in watch queue" },
          { text: "Re-score at day 30" },
        ],
      },
    ],
  },
];
