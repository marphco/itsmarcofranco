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
 *   title    big title
 *   meta     muted one-liner (industry, place, years, role)
 *   problem  "The situation", one paragraph. The heading is deliberately
 *            neutral: the site is public, and three of these four are
 *            other people's companies. It describes a state, not a fault.
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
import formPlan from "../../assets/badv-action-plan.webp";
import feedbackLoop from "../../assets/badv-questions.webp";
import plannerCalendar from "../../assets/badv-planner.webp";
import plannerPost from "../../assets/badv-post.webp";
import plannerAccessLog from "../../assets/badv-access-log.webp";
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
    title: "Basic ADV",
    role: "Co-founder, creative operations and project lead",
    context: "Digital agency, Naples, Italy",

    problem:
      "No clients, no processes, no team. I wrote the business plan, won a 100,000 euro launch grant from Invitalia, the Italian agency for business development, and incorporated the company two weeks before Italy went into lockdown.",

    built: {
      /* The systems are not repairs for a bad start: they are what you build
         once there is enough volume to pay for them. Building them on day one
         would have been the mistake. */
      lead: "I designed the operation itself: how we took a brief, how we scoped and priced, how work moved from designer to developer to client. Once the volume justified it, I built three systems on top of that.",
      systems: [
        {
          title: "AI client intake",
          action: { kind: "try", label: "Try it" },
          body: "A discovery call costs an hour of senior time, and plenty of them go to leads nobody should be quoting. I replaced it with a conversational intake: one question at a time, each built on the answers already given. Weak leads filter themselves out before anyone is involved.",
          shots: [
            {
              src: formStart,
              alt: "The intake entry: pick a service, then the sub-service, business field and budget",
              caption: "The client picks a service. That is what the first question is generated from.",
            },
            {
              src: formQuestion,
              alt: "One intake question with four options and a free text field",
              caption: "One question at a time, each built on what came before.",
            },
            {
              src: formPlan,
              alt: "The generated action plan in the dashboard: the client's answers read back, with what the intake could not establish listed separately",
              caption:
                "What the team opens: the client's own words on what they want and who has to be convinced, what the date is for, and the four things they never said that change the quote.",
            },
          ],
        },
        {
          title: "Questions that get better with use",
          body: "The engine behind the intake. It drafts a structured question set from a brief and the service docs, and learns from thumbs up and thumbs down, so each set is sharper than the one before it.",
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
          body: "Agencies run monthly plans on spreadsheets and email, and take approvals over the phone. That holds until a client says \u201cI never approved that.\u201d I put every post on a calendar, every edit into a version you can restore, and the client's approval on the record, with the history kept.",
          shots: [
            {
              src: plannerCalendar,
              alt: "Editorial planner month calendar, one row per client page, posts on their days",
              caption: "One row per page, one card per post. The green bar is the client approval, with name and timestamp.",
            },
            {
              src: plannerPost,
              alt: "Post editor with media, category, caption, page, date, sponsored toggle, status, undo and redo, and notes",
              caption:
                "A post open, with undo, redo and its own history. Notes split into client-facing and internal, so an internal comment can never reach the client.",
            },
            {
              src: plannerAccessLog,
              alt: "The plan history panel, listing sends and the times the client opened the plan",
              caption:
                "The access log: who opened the plan and when. That is what settles an argument about whether the client saw it.",
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
        { value: "40", label: "clients running on the planner" },
        { value: "400+", label: "posts a month through it" },
      ],
      notes: [
        "The discovery call disappeared for standard requests, and with it about an hour of senior time per lead. Every brief came out in the same structure, whoever picked it up.",
        "Every approval and every version on record, for every client, every month.",
        "The agency is recognized nationally today, with work for ENAV, the Italian air navigation authority, and the Ministry of Foreign Affairs.",
      ],
    },

    stack: ["React", "Node", "MongoDB", "OpenAI API"],
  },

  {
    id: "dynamic-windows",
    accent: "#0d6152",
    title: "Dynamic Windows System",
    role: "Project and operations coordinator",
    context: "Glazing and facade contractor, New York",

    problem:
      "Fifteen sites ran at once. The office and the field each kept their own records, so whoever tracked a schedule, a delivery or a crew was the only one who knew where it stood. By the time the office heard, the site had already moved on.",

    built: {
      lead: "I put both sides on one workflow and one dashboard. Crews updated job status from the site, and every change went out as a notification, so the people it affected knew before they thought to ask. The office watched delivery dates, schedules, manpower and inventory move in real time, while project finances stayed visible to management alone.",
    },

    changed: {
      metrics: [
        { value: "95%+", label: "on-time delivery across three years" },
        { value: "15", label: "sites on one dashboard" },
      ],
      notes: [
        "The office planned across every site at once, not one at a time.",
        "Delays became visible while they were still small enough to fix.",
        "Those sites included a full-block Cadillac storefront in Manhattan and the complete facade package for The Wave, a 33-story tower in Hoboken.",
      ],
    },

    diagram: "field-office",
  },

  {
    id: "spin-factor",
    accent: "#b0122b",
    title: "Spin Factor",
    role: "Campaign operations manager",
    context: "Political communication agency, Rome, Italy",

    problem:
      "When I joined, Italy's leading political communication agency was three people. National clients were arriving faster than the structure could absorb them, against election deadlines that do not move.",

    built: {
      lead: "I built the workflows and template systems the agency ran on, from scratch, so a lean team could work at the speed the environment demanded. When everything was urgent at once, I used performance data to decide where the people and the budget went.",
    },

    diagram: "one-template",

    changed: {
      metrics: [
        { value: "3 \u2192 20", label: "team size I helped scale" },
        { value: "40+", label: "campaigns run on those systems" },
      ],
      notes: [
        "The clients were national stakeholders, including major parliamentary parties.",
        "I moved from running campaigns to running the operation itself. The people I trained ran them.",
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
    title: "eenvee",
    actions: [{ kind: "live", href: "https://eenvee.com", label: "Live" }],
    role: "Founder",
    context: "Event management SaaS",

    problem:
      "A gap in the Italian market: event invitations and guest management still ran on paper, PDFs and WhatsApp threads, with no tool built for how people there actually communicate.",

    built: {
      lead: "I built the whole product alone. Invitations and guest management are delivered over WhatsApp, on Meta's Business Cloud API, and around that sit a web app, a native mobile app on both stores, a reporting layer over the production database, and conversion tracking across the signup funnel.",
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
