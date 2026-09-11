/**
 * Case data for the "Work." section.
 *
 * Same three moments as the brief, tightened: the problem is one hook, what
 * I built carries the systems, and what changed leads with the figures, so
 * the payoff is readable at a glance instead of buried in a paragraph.
 *
 * Nothing is invented. Where a fact is still missing the text carries a
 * visible [MARCO: ...] placeholder that renders as-is.
 *
 * Shape of a case:
 *   kicker   small line above the title
 *   title    big title
 *   meta     muted one-liner (industry, place, years, role)
 *   problem  "The problem", one paragraph
 *   built    "What I built" -> { lead, systems? }
 *              a system may carry its own shots, so each one shows itself
 *   changed  "What changed" -> { metrics: [{value,label}], notes: [] }
 *   stack    array of tags, or omitted
 */

/* Captured from the apps themselves. The agency dashboard and planner ran
   against a local database seeded with fictional demo clients, so no real
   client data appears anywhere. */
import formStart from "../../assets/badv-form-start.webp";
import formQuestion from "../../assets/badv-form-question.webp";
import feedbackLoop from "../../assets/badv-questions.webp";
import plannerCalendar from "../../assets/badv-planner.webp";
import plannerPost from "../../assets/badv-post.webp";
import plannerApproval from "../../assets/badv-approval.webp";

/* The two live sites, captured as they are today. */
import spinAI from "../../assets/spin-ai.webp";
import eenveeInvito from "../../assets/eenvee-invito.webp";
import eenveeEditor from "../../assets/eenvee-editor.webp";
import eenveeRsvp from "../../assets/eenvee-rsvp.webp";
import eenveeDashboard from "../../assets/eenvee-dashboard.webp";

export const CASES = [
  {
    id: "basic-adv",
    accent: "#3b2ecc",
    kicker: "A company built from zero, and the systems that ran it",
    title: "Basic ADV",
    role: "Co-founder",
    context: "Digital agency, Naples, Italy",

    problem:
      "No clients, no processes, no team. I wrote the business plan, won a 100,000 euro launch grant from Invitalia, and incorporated the company on February 24, 2020. Eleven days later Italy went into lockdown.",

    built: {
      lead: "The operation itself, remotely: how we took a brief, how we scoped and priced, how work moved from designer to developer to client. Then three systems, because the bottlenecks kept showing up in the same places.",
      systems: [
        {
          title: "AI client intake",
          action: { kind: "try", label: "Try it" },
          body: "Every lead cost an hour of senior time on a discovery call, often for leads not worth pursuing. I replaced it with a conversational intake: one question at a time, each built on the answers already given. Weak leads filter themselves out.",
          shots: [
            {
              src: formStart,
              alt: "The intake entry: pick a service, then the sub-service, business field and budget",
              caption: "The client picks a service. That is what the first question is generated from.",
            },
            {
              src: formQuestion,
              alt: "One intake question with four options and a free text field",
              caption: "One question at a time, then a brief and a first action plan the team quotes from.",
            },
          ],
        },
        {
          title: "Questions that get better with use",
          body: "The engine behind the intake. It drafts a structured question set from a brief and the service docs, and improves from thumbs up and thumbs down, so the next set is sharper and less redundant.",
          shots: [
            {
              src: feedbackLoop,
              alt: "Generated question set in the dashboard, each question and each option rated with thumbs up or thumbs down",
              caption: "Every question and every option gets rated. The ratings feed the next set.",
            },
          ],
        },
        {
          title: "Editorial planner with approvals on record",
          body: "Monthly plans lived in Excel and email, and approvals happened by phone. Then someone would say “I never approved that.” Now every post sits on a calendar, every edit is a version, and the client approves the month on the record.",
          shots: [
            {
              src: plannerCalendar,
              alt: "Editorial planner month calendar, one row per client page, posts on their days",
              caption: "One row per page, one card per post. The green bar is the client approval, with name and timestamp.",
            },
            {
              src: plannerPost,
              alt: "Post editor with media, category, caption, page, date, sponsored toggle, status and notes",
              caption: "Notes split into client-facing and internal, so an internal comment can never reach the client.",
            },
            {
              src: plannerApproval,
              alt: "The client view of the plan, listing two approvals with dates and times",
              caption: "What the client sees: approved twice, both timestamps kept, and a flag when the plan changed since.",
            },
          ],
        },
      ],
    },

    changed: {
      metrics: [
        { value: "50+", label: "projects in under two years" },
        { value: "1 hour", label: "of senior time saved per lead" },
      ],
      notes: [
        "The discovery call disappeared for standard requests. Every brief came out in the same structure, so quality stopped depending on who took the call.",
        "Approvals, versions and delivery are on record for every client, every month. [MARCO: numero di clienti sul planner, post al mese]",
        "The agency is recognized nationally today, with work for ENAV, the Italian air navigation authority, and the Ministry of Foreign Affairs.",
      ],
    },

    stack: ["React", "Node", "MongoDB", "OpenAI API"],
  },

  {
    id: "dynamic-windows",
    accent: "#0d6152",
    kicker: "The field-to-office workflow",
    title: "Dynamic Windows System",
    role: "Operations",
    context: "Glazing and facade contractor, New York",

    problem:
      "Fifteen sites running at once, and no shared view between office and field. Updates moved by phone call. Schedules, manpower and job status lived wherever the person keeping them put them, so delays surfaced late, through whoever happened to ask.",

    built: {
      lead: "One workflow and one dashboard both sides worked from. Field crews updated job status from the site. The office saw delivery dates, schedules, manpower and inventory in real time, with project finances visible to management only. I built it around the questions people were already calling each other to ask, and left everything else out.",
    },

    changed: {
      metrics: [
        { value: "95%+", label: "on-time delivery across three years" },
        { value: "15", label: "concurrent sites" },
      ],
      notes: [
        "Status calls stopped, because the answer was already on screen. [MARCO: stima delle telefonate al giorno prima]",
        "Delays became visible while they were still small enough to fix.",
        "Included a full-block storefront for Cadillac in Manhattan and the facade package for a 33-story tower in Hoboken.",
      ],
    },

    diagram: "field-office",
  },

  {
    id: "spin-factor",
    accent: "#b0122b",
    kicker: "From three people to twenty",
    title: "Spin Factor",
    role: "Operations lead",
    context: "Political communication agency, Rome, Italy",

    problem:
      "Italy's leading political communication agency at its founding stage: three people, national clients arriving faster than the structure could handle, and election deadlines that do not move.",

    built: {
      lead: "The workflows and template systems the agency ran on, from scratch, so a lean team could work at the speed the environment demanded. I grew into the de facto operational lead, trained the people who came in, and used campaign performance data to decide where people and budget went when everything was urgent at once.",
    },

    diagram: "one-template",

    changed: {
      metrics: [
        { value: "3 \u2192 20", label: "team size I helped scale" },
        { value: "40+", label: "campaigns run on those systems" },
      ],
      notes: [
        "Campaigns for national stakeholders, including major parliamentary parties, under hard election-driven deadlines.",
        "[MARCO: la riga piu forte di tutta la card, se il fatto regge: nessuna scadenza elettorale mancata]",
      ],
    },

    /* A separate engagement, six years later. It belongs at the end, set
       apart, not woven through the operations story it has nothing to do
       with. */
    postscript: {
      label: "Postscript, 2026",
      text: "Years later they came back. I rebuilt their website, now live, with an AI assistant that answers questions about the agency and its services.",
      action: { kind: "live", href: "https://www.spinfactor.it", label: "Live" },
      shot: {
        src: spinAI,
        alt: "The Spin Factor site with Spinny, its AI assistant, answering a question about the agency",
        caption: "Spinny answering for the agency, on the site as it is today.",
      },
    },

    /* Same place as every other case: the footnote line at the bottom of
       the card. It describes the postscript directly above it. */
    stack: ["React", "Node", "OpenAI API"],
  },

  {
    id: "eenvee",
    accent: "#a34a00",
    kicker: "A product, from the first line to the app stores",
    title: "eenvee",
    actions: [{ kind: "live", href: "https://eenvee.com", label: "Live" }],
    role: "Founder",
    context: "Event management SaaS",

    problem:
      "A gap in the Italian market: event invitations and guest management still ran on paper, PDFs and WhatsApp threads, with no tool built for how people there actually communicate.",

    built: {
      lead: "The whole product, alone. Invitations and guest management delivered over WhatsApp, on Meta's Business Cloud API. A web app, a native mobile app on both stores, a reporting layer over the production database, and conversion tracking across the signup funnel.",
    },

    changed: {
      /* No honest figure to lead with here, so the claim itself does the
         work, and the platforms show rather than count. */
      statement: "The first in Italy to put the whole job in one place.",
      platforms: ["Web", "iOS", "Android"],
      metrics: [],
      notes: [
        "Every other portal covers a piece of it: the invitation, or the guest list, or the confirmations. eenvee carries all of it, and does each part faster.",
        "Live in production, with native apps on the App Store and Google Play.",
      ],
    },

    shots: [
      {
        src: eenveeInvito,
        alt: "A wedding invitation sliding out of its envelope, using the Unione template",
        caption:
          "What a guest gets: the envelope opens and the invitation comes out. One link, no app to install.",
      },
      {
        src: eenveeEditor,
        alt: "The event page editor: fonts, theme color, section management, phone and desktop preview",
        caption:
          "The editor behind it. Invitation, envelope and event page are three surfaces, each editable.",
      },
      {
        src: eenveeRsvp,
        alt: "Guest management: confirmations, guest counts, filters, and export to PDF or CSV",
        caption:
          "Confirmations come back sorted: who is coming, how many, and an export for the caterer.",
      },
      {
        src: eenveeDashboard,
        alt: "The dashboard listing events with the invitation preview and a response summary",
        caption: "Every event in one place, with the responses summarized on the card.",
      },
    ],
    stack: ["React", "Node", "Express", "MongoDB", "TypeScript", "Capacitor"],
  },
];
