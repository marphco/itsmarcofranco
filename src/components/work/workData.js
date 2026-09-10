/**
 * Case data for the "Work." section.
 *
 * Every string here comes verbatim from the restructuring brief.
 * Nothing is invented: where a fact is still missing the text carries a
 * visible [MARCO: ...] placeholder that renders as-is in the UI.
 *
 * Shape of a case:
 *   kicker   small line above the title
 *   title    big title
 *   meta     muted one-liner (industry, place, years, role)
 *   problem  "The problem"
 *   built    "What I built"  -> { lead, systems? }
 *   changed  "What changed"  -> array of bullets
 *   note     muted note inside the card (optional)
 *   shots    screenshot strip (optional)
 *   stack    muted line at the bottom of the card (optional)
 */

/* Screenshots of the real thing. The site shots come straight from the
   agency site; the dashboard and planner were captured from the app itself,
   running on a local database seeded with the fictional demo clients that
   ship in the repo, so no real client data appears anywhere. */
import siteHero from "../../assets/badv-site-hero.webp";
import siteServices from "../../assets/badv-site-services.webp";
import siteDesktop from "../../assets/badv-site-desktop.webp";
import intakeQuestions from "../../assets/badv-questions.webp";
import plannerCalendar from "../../assets/badv-planner.webp";
import plannerPost from "../../assets/badv-post.webp";
import plannerApproval from "../../assets/badv-approval.webp";

export const CASES = [
  {
    id: "basic-adv",
    accent: "#3b2ecc",
    kicker: "A company built from zero, and the systems that ran it",
    title: "Basic ADV",
    meta: "Digital agency. Naples, Italy. 2020 to 2021. Co-founder.",
    problem:
      "Starting an agency with no clients, no processes and no team. I wrote the business plan, won a 100,000 euro launch grant from Invitalia, the Italian agency for business development, and incorporated the company on February 24, 2020. Eleven days later Italy went into lockdown.",
    built: {
      lead: "The operation itself, remotely: how we took a brief, how we scoped and priced, how work moved from designer to developer to client, and the playbooks that kept fifty projects consistent when volume grew faster than the team. Then three systems, because the bottlenecks kept showing up in the same places.",
      systems: [
        {
          title: "AI client intake",
          action: { kind: "try", href: "/intake", label: "Try it" },
          body: "Every new lead needed a discovery call, about an hour of senior time, and too often on leads not worth pursuing. I replaced the form and the call with a conversational intake: the client picks a service, then answers one question at a time, each generated from the service chosen and the answers already given. A separate scoring step keeps only the most relevant question, so the flow stays short and never asks what it already knows. At the end it writes a brief in the agency's format and a first action plan the team quotes from. Weak leads filter themselves out before anyone is involved.",
        },
        {
          title: "Onboarding questions that get better with every use",
          body: "The engine behind the intake. It drafts a structured question set from a brief and the service docs, grouped by topic and priority, and improves from thumbs up and thumbs down so the next set is clearer, less redundant and better scoped.",
        },
        {
          title: "Editorial planner with approvals on record",
          body: "Monthly social plans for every client used to live in Excel and email, and approvals happened by phone. Then someone would say “I never approved that.” I built a planner where every post sits on a calendar, every edit is a version you can restore, the client approves the month with the full history kept, an access log proves the client actually opened the plan, and operators get notified when something changes. The argument about what was approved is over.",
        },
      ],
    },
    changed: [
      "The discovery call disappeared for standard requests, and with it an hour of senior time per lead.",
      "Every brief came out in the same structure. Quality stopped depending on who took the call.",
      "Approvals, versions and delivery are on record for every client, every month. [MARCO: numero di clienti sul planner, post al mese]",
      "More than fifty projects delivered in under two years. Today the agency is recognized nationally, with work for ENAV, the Italian air navigation authority, and the Ministry of Foreign Affairs.",
    ],
    shots: [
      {
        src: siteHero,
        alt: "The Basic ADV site, dark hero with the agency wordmark",
        caption: "The agency site the intake sits inside.",
      },
      {
        src: siteServices,
        alt: "The service section of the agency site",
        caption:
          "Where a lead starts: the client picks a service, and that choice is what the first question is generated from.",
      },
      {
        src: siteDesktop,
        alt: "A section of the agency site laid out as a desktop with project folders",
        caption: "The work section, built as a desktop you drag through.",
      },
      {
        src: intakeQuestions,
        alt: "Generated question set in the dashboard, each question and option rated with thumbs up or down",
        caption:
          "The generated question set, rated question by question. Italian interface: each block is one question with its options, and the thumbs feed the next set.",
      },
      {
        src: plannerCalendar,
        alt: "Editorial planner month calendar, one row per client page, posts on their days",
        caption:
          "The planner. One row per page, one card per post. The green bar at the top reads: plan approved by the client, with the name and the timestamp.",
      },
      {
        src: plannerPost,
        alt: "Post editor with media, category, caption, page, date, sponsored toggle, status and notes",
        caption:
          "A post open. Notes split into client-facing and internal, so an internal comment can never reach the client.",
      },
      {
        src: plannerApproval,
        alt: "The client view of the plan, listing two approvals with dates and times",
        caption:
          "What the client sees. Approved twice, both on record with the timestamp, and a warning that the plan changed since the last approval.",
      },
    ],
    stack: "Built alone. React, Node, MongoDB, OpenAI API.",
  },

  {
    id: "dynamic-windows",
    accent: "#0d6152",
    kicker: "The field-to-office workflow",
    title: "Dynamic Windows System",
    meta: "Glazing and facade contractor. New York. 2021 to 2024.",
    problem:
      "Fifteen or more sites at once, office and field crews with no shared view of what was happening. Updates moved by phone call. Schedules, manpower and job status lived in different places depending on who kept them, and delays were discovered late, by whoever happened to ask.",
    built: {
      lead: "A shared workflow and dashboard both sides worked from. Field crews updated job status from the site. The office saw delivery dates, schedules, manpower and inventory in real time. Project finances sat in the same system, visible to management only. I designed it around the questions people were actually calling each other to ask, and left everything else out.",
    },
    changed: [
      "Status calls stopped, because the answer was already on screen. [MARCO: stima delle telefonate al giorno prima]",
      "Delays became visible while they were still small enough to fix.",
      "Across three years and fifteen concurrent sites, including a full-block storefront for Cadillac in Manhattan and the facade package for a 33-story tower in Hoboken, on-time delivery stayed above 95%.",
    ],
    note: "The system belongs to the company, so there is nothing to click here. The result is the case.",
    diagram: "field-office",
  },

  {
    id: "spin-factor",
    accent: "#b0122b",
    kicker: "From three people to twenty",
    title: "Spin Factor",
    meta: "Political communication agency. Rome, Italy. 2018 to 2020, and again in 2026.",
    problem:
      "Italy's leading political communication agency at its founding stage: three people, national clients arriving faster than the structure could handle, and election deadlines that do not move.",
    built: {
      lead: "The workflows and template systems the agency ran on, from scratch, so a lean team could operate at the speed and volume the environment demanded. I grew into the de facto operational lead, helped scale the team from three to twenty, and trained the people who came in. When everything was urgent at once, I used campaign performance data to decide where people and budget went.",
    },
    changed: [
      "Operations across 40 or more simultaneous campaigns for national stakeholders, including major parliamentary parties, under hard election-driven deadlines.",
      "[MARCO: cosa reggeva il team prima dei sistemi e cosa dopo]",
      {
        text: "Years later they came back. In 2026 I rebuilt their website, now live, with an AI assistant that answers questions about the agency and its services.",
        action: {
          kind: "live",
          href: "https://www.spinfactor.it",
          label: "Live",
        },
      },
    ],
    shots: [
      { pending: "Live site, screen 1 of 2" },
      { pending: "Live site, screen 2 of 2" },
    ],
    stack: "Site built alone. React, Node, OpenAI API.",
  },

  {
    id: "eenvee",
    accent: "#a34a00",
    kicker: "A product, from the first line to the app stores",
    title: "eenvee",
    meta: "Event management SaaS. 2024 to present. Founder.",
    problem:
      "A gap in the Italian market: event invitations and guest management still ran on paper, PDFs and WhatsApp threads, with no tool built for how people there actually communicate.",
    built: {
      lead: "The whole product, alone. Invitations and guest management delivered through WhatsApp, on Meta's WhatsApp Business Cloud API. A web app and a native mobile app on the App Store and Google Play. A reporting layer over the production database and conversion tracking across the signup funnel.",
    },
    changed: [
      {
        text: "The product is live in production.",
        action: {
          kind: "live",
          href: null,
          label: "Live",
          pending: "[MARCO: URL di eenvee]",
        },
      },
      "[MARCO: una riga sullo stato attuale, con parole tue]",
    ],
    shots: [
      { pending: "Product, screen 1 of 3" },
      { pending: "Product, screen 2 of 3" },
      { pending: "Mobile app, screen 3 of 3" },
    ],
    stack: "Built alone. React, Node, Express, MongoDB, TypeScript, Capacitor.",
  },
];
