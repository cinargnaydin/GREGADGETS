# Greenwich Gadgets, Tech Nest, and Central Stock System Sales Playbook

Prepared for: Cinar Gunaydin and Mert Seker  
Client side: Atal and Ihtisham  
Current date: 8 July 2026  
Next meeting: Greenwich Gadgets handover visit on 9 July 2026  
Primary objective: Close the centralized multi-store stock system at around GBP 5,000-6,000 without creating more disconnected one-off websites.

## Executive Summary

The sale should not be framed as "another website" or "students doing cheap tech work." The correct frame is:

> We used the Greenwich Gadgets website as the trust-building first project. It proves we can turn customer demand into an operational workflow: online booking, quote capture, Google Calendar, email/SMS notifications, and admin management. The next business problem is bigger: if Greenwich Gadgets, Tech Nest, the third store, and the fourth store are managed separately, stock becomes messy, time-consuming, and expensive. The next phase should be one centralized stock system that connects the stores and future websites.

The target close is a defined MVP at GBP 5,950, paid in milestones. The anchor should be GBP 6,500 because UK custom software benchmarks put even simple internal tools around GBP 10,000-30,000, while business-grade web systems often sit much higher. The reason they get GBP 5,000-6,000 is not because the work is small. It is because they are an existing client, the scope is tightly controlled, and this is a founder-led pilot relationship for Cinar and Mert.

The sale should happen in four moves:

1. Finish Greenwich Gadgets professionally and collect the remaining website payment.
2. Ask operational questions about stock, store transfers, and the fourth shop.
3. Show that Tech Nest should not be built as an isolated site.
4. Close the central stock system as the next phase with a written scope, payment plan, and acceptance checklist.

## Current Situation

### What has already happened

- Greenwich Gadgets commissioned the first website for GBP 450.
- They paid a GBP 200 deposit.
- The website includes customer-facing pages, quote capture, booking flow, email/notification handling, Google Calendar integration, and an admin appointment/schedule area in the codebase.
- The current Greenwich Gadgets work is a trust project. They are checking whether Cinar and Mert can deliver.
- Tech Nest is expected next.
- The bigger client vision is a centralized stock system for three stores now and a fourth store opening soon.
- Atal and Ihtisham appear to be the key client-side decision makers.

### What the Greenwich Gadgets code actually proves

Verified in the project folder:

- Next.js 16.2.1 application.
- Quote request API using Resend email.
- Booking widget with date, time, customer details, and confirmation state.
- Appointment booking API with:
  - input validation,
  - past-date protection,
  - Firestore/Firebase appointment storage when configured,
  - Google Calendar busy-slot check,
  - Google Calendar event creation,
  - optional Twilio SMS confirmation,
  - customer and admin email notifications.
- Admin appointment list and delete/cancel flow.
- Admin schedule settings for weekly hours and date overrides.
- Release docs for Vercel deployment, SEO, structured data, mobile CTAs, analytics, monitoring, and launch checks.

Important: this is not yet a real multi-store inventory system. It is proof that you can connect a public website to operational workflows. Use that as the bridge.

## Public Research Notes

Use these points if the client asks "who are you actually working under?" or "why should we trust you with the main system?"

### AI Tech Builders

Public sources support the following:

- AI Tech Builders describes itself as a venture creator building high-impact AI companies.
- Its website says it is London-headquartered and building 10 AI-enabled companies within three years.
- It says its method is to discover and shape ideas, build and iterate working MVPs, and launch/scale with sales, positioning, branding, capital, talent, partnerships, and playbooks.
- The website lists London, Seattle, and Istanbul.
- Companies House lists AI TECH BUILDERS LTD as an active UK private limited company, incorporated on 22 May 2025, with software-related SIC codes including software publishing and business/domestic software development.
- LinkedIn describes AI Tech Builders as a London-based company builder in software development with 11-50 employees.

How to say it:

> We work under the AI Tech Builders ecosystem, which is a London-based AI venture builder. We are not just making a website and disappearing. We have access to product, software, AI, and startup-building resources around us. For you, that means the system can start small but be built with the right foundations.

What not to say:

> We are students, so we are cheap.

Better:

> You are getting founder-led pricing because we are already close to the business, we want the long-term relationship, and we can move faster than a traditional agency. The tradeoff is that we must keep the MVP scope clear.

### Global Scale Ventures

Public sources describe Global Scale Ventures as a London-based early-stage investment fund focused on AI, biotech, and climate tech, with hands-on operational support and ecosystem access.

How to say it:

> AI Tech Builders operates in a serious venture-building environment, not as a random freelance setup. We are applying that builder mindset here: start with the exact workflow, build the core system, test it inside the shop, then scale it across stores.

### Cinar and Mert Public Positioning

Public LinkedIn search results show Cinar Gunaydin and Mert Seker connected with Revint, a data infrastructure and analytics company focused on turning past wins into next-account sales actions. Public search did not reliably verify Cinar and Mert as listed AI Tech Builders team members on the public AI Tech Builders pages.

How to handle this:

- Do not oversell personal public profiles.
- If asked, say:

> Public profiles do not always show every project we work on. The important part for this project is that Cinar owns product and client workflow, Mert owns engineering, and we have access to the AI Tech Builders environment when the project needs more support.

## Market and Pricing Reality

### Why GBP 5,000-6,000 is a strong price for them

Public UK software pricing research shows:

- Simple internal tools are commonly benchmarked around GBP 10,000-30,000.
- Customer-facing web applications can sit around GBP 30,000-80,000.
- API/system integration work can also run into the GBP 5,000-50,000 range depending on complexity.
- UK day rates for software roles often reach hundreds of pounds per day.

This means a GBP 5,000-6,000 custom multi-store stock MVP is not expensive. It is a controlled founder-led pilot price.

### SaaS alternatives are not the same as this proposal

There are existing retail inventory products:

- ChannelWeave shows pricing from GBP 49/month for one location, GBP 149/month for up to five locations, and from GBP 399/month for enterprise/custom needs.
- Selro shows plans around GBP 79/month, GBP 150/month, and GBP 300/month plus VAT, with order/SKU/user limits and possible extras.
- Larger retail ERP/inventory systems focus on one stock truth, transfers, replenishment, POS/ecommerce sync, reporting, and often quote-based implementation.

The client may ask: "Why not just use one of those?"

Answer:

> You can use an off-the-shelf system if your business is ready to adapt to that system. But your situation is not just inventory. You have existing stores, different websites, current habits, family decision-making, and a fourth shop opening. Our value is to build the simplest version around your exact workflow first, then decide later whether to expand, integrate, or migrate to a larger platform.

### Inventory value argument

Retail inventory software exists to centralize product tracking, sync stock across channels in real time, prevent overselling, track stock by location, manage transfers/returns, trigger low-stock alerts, and support reporting/replenishment. For a business with three shops and a fourth opening, this is not "nice to have." It becomes the operating layer.

## Core Sales Positioning

### One sentence

> We should not build Greenwich Gadgets, Tech Nest, and the other shops as separate islands. The next phase should be one central stock system that all stores and websites read from.

### The business case

Without central stock:

- Staff need to call or message between stores to check availability.
- Products can be sold in one place while another store thinks they are still available.
- The fourth shop adds more confusion.
- Website stock cannot be trusted.
- Atal and Ihtisham become the manual "system" between stores.
- Every new website creates another admin burden.

With central stock:

- One product list.
- Stock by store.
- Fast updates from mobile/laptop.
- Transfers between shops.
- Low-stock alerts.
- One admin place for all stores.
- Websites can show accurate availability or controlled "contact us" stock status.
- Later expansion into POS, supplier orders, barcode scanning, reporting, and AI forecasting becomes possible.

### Strategic frame for Atal and Ihtisham

> The website brings customers in. The stock system stops the business becoming chaotic when those customers start asking, "Which shop has it?"

## Cultural and Trust Strategy

Use this carefully. Do not stereotype. Treat it as a trust and risk lens.

The client side is a Pakistani family-run retail context operating in London. Public business culture guides generally emphasize that Pakistani business relationships often rely heavily on trust, respect, hierarchy, personal rapport, and patience. UK business culture is usually more agenda-driven, evidence-based, and outcome-focused.

The practical strategy:

- Start with respect and relationship, not a hard pitch.
- Let Atal and Ihtisham feel in control.
- Do not embarrass anyone by saying their current system is bad.
- Ask how they currently manage stock and let them describe the pain.
- Use the Greenwich delivery as proof.
- Use a written plan to satisfy the UK business side.
- Use warm confidence, not aggressive closing.

Suggested tone:

> You already have the vision. We are just turning it into a system that can grow with the shops.

Avoid:

> Your current way is wrong.

Say:

> The current way works while the business is smaller. But with the fourth shop, the same method will create more pressure on you.

## Sales Psychology to Use

### 1. Reciprocity

Give value before asking for the bigger deal:

- Clean handover of Greenwich Gadgets.
- Explain exactly what was built.
- Show the client where bookings go.
- Give a simple next-phase map.

Script:

> Before we talk about the next phase, I want you to feel fully comfortable with what has been delivered here.

### 2. Authority

Authority should come from proof, not arrogance:

- Show the live website.
- Show booking to email/calendar.
- Show the admin flow.
- Mention AI Tech Builders only as support context.
- Mention market pricing only when pricing comes up.

Script:

> We are product and engineering people. We do not want to sell you random features. We want to build the operational system in the right order.

### 3. Commitment and Consistency

They already said the future vision is to manage all shops from one place. Bring them back to that.

Script:

> Last time you explained the real goal: managing stock across all locations from one place. That is exactly why we should not make Tech Nest another separate admin system.

### 4. Social Proof

Do not overclaim. Use Greenwich itself as the proof.

Script:

> The first proof is not another case study. It is this site. You gave us the first project, and now you can see the workflow working.

### 5. Scarcity

Use real scarcity only:

- Founder-led pricing is limited because Cinar and Mert are personally involved.
- This price works only with clear scope and fast access to data.
- If the scope grows, price grows.

Script:

> We can keep this at the founder-led price because we are doing the first system directly with you. If this becomes an open-ended retail ERP, it is not a GBP 6,000 project anymore.

### 6. Loss Aversion

Focus on the cost of waiting:

> The risk is not only paying for software. The bigger risk is opening the fourth shop with no shared stock truth, then paying later to clean up four separate systems.

### 7. Anchoring

Anchor to the market before presenting your price:

> In the UK, even basic custom internal tools often start around GBP 10,000-30,000. For a normal agency, a multi-location stock system with website integration would not be a GBP 5,000 job. We can offer this around GBP 5,950 because we are already working with you, we want the long-term relationship, and we are keeping the MVP tight.

## Meeting Flow for 9 July 2026

### Goal of the visit

Primary goal:

- Get Greenwich Gadgets accepted.
- Collect remaining GBP 250 if appropriate.
- Secure agreement for the centralized stock system as the next paid phase.

Secondary goal:

- If they are not ready to sign the full project, close a paid blueprint/discovery sprint that is credited toward the build.

### Recommended agenda

1. Greeting and relationship warm-up.
2. Greenwich Gadgets walkthrough.
3. Booking/appointment/email/calendar/admin proof.
4. Confirm remaining fixes or handover checklist.
5. Ask about domain ownership and deployment access.
6. Transition to Tech Nest and stock.
7. Discovery questions about the stores.
8. Present the central stock plan.
9. Present price and payment plan.
10. Close next step.

### Opening script

> Atal, before we talk about anything new, I want to walk you through Greenwich Gadgets properly. I want you to see what the customer sees, what happens when someone books or requests a quote, and what you can manage after handover.

### Handover transition

> This first site was the trust step. It proves we can deliver the customer-facing side and connect it to operations. But from what you told us, the real business problem is not only websites. It is managing stock across Greenwich Gadgets, Tech Nest, the third shop, and now the fourth shop.

### Central system transition

> My honest recommendation is that we should not build Tech Nest as a completely separate website with a separate stock/admin setup. That would create the same problem again. We should build Tech Nest with the central stock system in mind from day one.

### Price setup

> To be transparent, a normal UK agency would price even a simple internal system much higher than this. We are able to do founder-led pricing because we are already working together and we want this as a long-term relationship. But the scope must be clear.

### Close script

> The proposal is GBP 5,950 for the defined central stock MVP. We split it into milestones so you are not paying everything upfront. If you are happy with the direction, the next step is a GBP 1,500 project start payment, then we run the workflow/data blueprint and start building from there.

## Discovery Questions

Use these before pitching too hard. The goal is to make them explain the pain.

### Store setup

- How many stores are open today?
- Where is the fourth store opening?
- Will all shops sell the same products, or does each shop have different categories?
- Who currently decides where stock goes?
- Who physically updates stock numbers?
- How often do products move between shops?
- Do staff call each other to check stock?

### Product and SKU reality

- Roughly how many products/SKUs do you have?
- Do you have barcodes already?
- Are products mostly phones, accessories, repairs, perfumes, vapes, or mixed categories?
- Do you track serial numbers for phones?
- Do you need condition grading for used devices?
- Do you need warranty tracking?

### Current system

- Are you using Excel, notes, WhatsApp, POS software, paper, or memory?
- Does each store currently know what the other stores have?
- What happens when one shop sells an item that another shop also thinks is available?
- How do you count stock at the end of the week/month?
- What is the most annoying stock task right now?

### Website connection

- Should the websites show exact stock, "in stock", "low stock", or "contact store"?
- Should customers reserve products online?
- Should online customers choose collection from a store?
- Should staff be able to hide products from the website?

### Decision and money

- If the system saves staff time and prevents mistakes, who needs to approve the project?
- Would you prefer a smaller MVP first or the full system from day one?
- Would a milestone payment plan make this easier?

## Recommended Offer

### Main offer: Centralized Stock System MVP

Price:

- Target close: GBP 5,950.
- Opening anchor: GBP 6,500.
- Negotiation floor for full MVP: GBP 5,500.
- Absolute floor: GBP 5,000 only if scope is reduced.

Positioning:

> This is not a full enterprise ERP. This is the first operational stock system that gives you one shared stock truth across the shops and connects the websites in a controlled way.

### Included scope

- Central product database.
- Store/location model for three current stores plus fourth store.
- Admin login.
- User roles for owners/managers/staff.
- Add/edit products.
- Stock quantity by store.
- Stock movement history.
- Inter-store transfer records.
- Manual stock adjustment with reason.
- Search/filter products.
- Low-stock flag or alert.
- CSV import/export for initial migration and backup.
- Basic dashboard:
  - total products,
  - low-stock items,
  - stock by location,
  - recent movements.
- Website connection plan for Greenwich Gadgets and Tech Nest:
  - product visibility,
  - availability status,
  - "contact us" or "reserve" flow if agreed.
- Training session for Atal/Ihtisham/staff.
- Handover document.
- 30 days post-launch support for bugs inside agreed scope.

### Excluded unless separately quoted

- Full POS/till replacement.
- Payment processing.
- Barcode hardware purchase.
- Advanced barcode scanning workflows.
- Accounting/Xero/QuickBooks integration.
- Supplier purchase order automation.
- AI demand forecasting.
- Full ecommerce checkout.
- Marketplace integrations like Amazon/eBay.
- Historical data cleanup beyond agreed CSV import.
- Unlimited design changes to all websites.
- Unlimited support after 30 days.
- Any third-party software, SMS, email, hosting, domain, or payment provider fees.

### Why exclusions matter

Say this if they ask why some things are excluded:

> We are protecting both sides. If everything is included, the project becomes unclear and never ends. If we define the first system properly, you get something useful in weeks, not months.

## Payment Plan

### Recommended four-payment plan

Total: GBP 5,950

1. GBP 1,500 project start payment on signature.
2. GBP 1,500 after workflow map, data model, and clickable/admin prototype approval.
3. GBP 2,000 after working pilot for one store with product/stock/transfer flow.
4. GBP 950 after multi-store rollout, training, and handover.

Why this works:

- Client does not pay all upfront.
- You get enough cash to start seriously.
- Milestones are tied to concrete deliverables.
- Final payment is not tied to vague "everything works" wording.

### Cleaner three-payment option

Total: GBP 5,950

1. GBP 2,000 upfront.
2. GBP 2,000 after working MVP pilot.
3. GBP 1,950 after acceptance checklist and handover.

### Lower-price fallback

If they push hard:

> We can do GBP 5,000, but not for the full version. At GBP 5,000 we would start with two stores, core stock movements, CSV import/export, and one website connection. The remaining locations or advanced workflow would be phase two.

Do not reduce price without reducing scope.

## Acceptance Checklist

Use this instead of saying "fully working."

The project is accepted when:

- Atal/Ihtisham can log in.
- There are at least four locations configured.
- Staff can add/edit a product.
- Staff can update stock for a product at a selected store.
- Staff can record a transfer from one store to another.
- The stock history shows who changed what and when.
- Low-stock products can be identified.
- CSV import/export works for the agreed format.
- Greenwich Gadgets or Tech Nest can display agreed product/availability status from the central system.
- At least one training session is completed.
- Handover notes are delivered.
- Critical bugs found during agreed acceptance testing are fixed.

## Timeline

### Phase 0: 9 July 2026 handover and close

Deliver:

- Greenwich Gadgets walkthrough.
- Confirm domain/deployment ownership.
- Confirm remaining GBP 250 for site if appropriate.
- Present central stock proposal.
- Secure project start payment or discovery sprint.

### Phase 1: Discovery and workflow blueprint, 2-4 business days

Deliver:

- Current workflow map.
- Product/category/SKU model.
- Store/location model.
- User role model.
- MVP acceptance checklist.
- Final scope lock.

### Phase 2: Prototype and data model, 4-6 business days

Deliver:

- Admin wireframe/prototype.
- Database schema.
- Product and location CRUD.
- Initial import format.

### Phase 3: Core stock MVP, 8-12 business days

Deliver:

- Product management.
- Stock by store.
- Transfer records.
- Adjustment reasons.
- History/audit.
- Low-stock status.
- Basic dashboard.

### Phase 4: Website connection, 4-8 business days

Deliver:

- Greenwich Gadgets/Tech Nest product availability connection.
- Public stock display rules.
- Reserve/contact flow if in scope.

### Phase 5: Pilot, training, and rollout, 4-8 business days

Deliver:

- One-store pilot.
- Fix critical workflow issues.
- Roll out additional stores.
- Train owners/staff.
- Handover.

Expected total:

- 4-6 weeks if content, product data, access, and decisions are provided quickly.
- 6-8 weeks if data is messy, decision-making is slow, or extra website/product work is added.

## Tech Nest Strategy

Do not let Tech Nest become a separate disconnected website.

Recommended wording:

> We can still build the Tech Nest website, but we should structure it so it reads from the central stock system later. Otherwise we will charge you for Tech Nest now, then charge again to undo disconnected work.

Suggested Tech Nest package:

- Website/front-end design and pages.
- Product/category structure aligned with the stock system.
- No separate stock admin.
- Tech Nest goes live with either:
  - simple lead/WhatsApp flow first, or
  - product availability from central system if stock MVP is ready.

Commercial strategy:

- Keep Tech Nest website as a separate smaller deliverable if needed.
- But close the central stock system as the main strategic project.
- If they insist Tech Nest comes first, make them agree the central system architecture before Tech Nest build begins.

## Objection Handling

### "It is expensive."

Response:

> I understand. But this is not a brochure website. This is the operating system for multiple shops. A UK agency would usually price this much higher. We are keeping it around GBP 5,950 because we already know the business and we are keeping the first version tight.

Then ask:

> Is the concern the total price, or the payment timing?

If timing:

> We can split it into milestones.

If total:

> We can reduce the first phase scope, but I do not want to promise the full system at a price where we cannot deliver it properly.

### "Can we do Tech Nest first and stock later?"

Response:

> We can, but we should not build Tech Nest in a way that creates another separate admin system. The smart move is to define the stock structure now, even if Tech Nest goes live first.

### "Can we use Excel?"

Response:

> Excel works when one person is updating one sheet carefully. It becomes risky when several staff across several shops need real-time stock. The fourth shop is the point where manual stock becomes the bottleneck.

### "Can we use an existing software?"

Response:

> Yes, and we should compare that honestly. Existing tools are good if your workflow fits them. Our proposal is to build the simplest custom layer around how your shops actually work, then we can decide later whether to integrate with a larger system.

### "I need to ask my brother."

Response:

> That makes sense. Should we walk through the plan with both of you now, so the decision is not based only on price but on scope, timeline, and what is included?

If brother is not there:

> I can leave you with the one-page summary. The only thing I would ask is that we do not start Tech Nest separately until we confirm the stock-system direction.

### "Can you guarantee it?"

Response:

> We guarantee the agreed acceptance checklist, not unlimited future ideas. If the checklist is met, the project is complete. If you want more features after using it, we scope phase two.

### "Can you do it cheaper?"

Response:

> We can make the first phase smaller. I do not want to reduce the price and keep the same promise, because that is how software projects fail.

### "What if staff do not use it?"

Response:

> That is exactly why we start with the core workflow and train the staff. The system must be simpler than WhatsApp and paper for daily use. If it is not, it will fail.

### "What if the websites are not ready?"

Response:

> The stock system can start internally first. The websites can connect after the product and stock data are stable.

## Cinar and Mert Roles

### Cinar's role in the meeting

Own:

- Business framing.
- Client empathy.
- Product workflow.
- Scope boundaries.
- Pricing conversation.
- Close.

Cinar should say:

> My job is to make sure we build the right system for how you actually run the shops, not just a technical system that looks good.

### Mert's role in the meeting

Own:

- Technical confidence.
- Feasibility.
- Timeline realism.
- Data/access requirements.
- Explaining why central architecture matters.

Mert should say:

> Technically, the important decision is to avoid separate stock systems. If we create one source of truth, the websites and stores can connect to it cleanly.

### How Cinar and Mert should work together in the room

- Cinar asks business questions.
- Mert confirms technical feasibility.
- Cinar discusses price and scope.
- Mert avoids adding features casually.
- If the client asks for extra features, Mert says:

> Possible, but we should decide whether that belongs in MVP or phase two.

## What Not To Say

Do not say:

- "We are students so we can do it cheap."
- "This is easy."
- "We can do everything."
- "No maintenance is needed."
- "It will definitely be done in two weeks."
- "Pay whatever you want."
- "We will build Tech Nest separately now and connect it later somehow."

Say instead:

- "Founder-led pricing."
- "Controlled MVP."
- "Clear acceptance checklist."
- "One source of truth."
- "Phase one now, phase two after usage."
- "We can keep the price low only if the scope is clear."

## One-Page Client Proposal

You can copy this into a message or print it.

### Proposal: Centralized Stock System MVP

Objective:

Create one central stock system for Greenwich Gadgets, Tech Nest, current stores, and the fourth store, so owners and staff can manage products, locations, stock levels, and transfers from one place.

Why now:

The first Greenwich Gadgets website proves the digital customer journey. The next risk is operational: as the business expands to more stores, disconnected stock management will create mistakes, delays, and duplicated work.

Included:

- Central product database.
- Stock by store/location.
- Product add/edit/search.
- Inter-store transfers.
- Stock movement history.
- Low-stock visibility.
- CSV import/export.
- Admin users/roles.
- Basic dashboard.
- Website stock connection plan for Greenwich Gadgets and Tech Nest.
- Training and handover.
- 30 days bug support after launch.

Timeline:

- Discovery and workflow blueprint: 2-4 business days.
- Prototype/data model: 4-6 business days.
- Core MVP build: 8-12 business days.
- Website connection and rollout: 1-2 weeks.
- Expected total: 4-6 weeks, depending on data/access/decision speed.

Investment:

- GBP 5,950 fixed for defined MVP scope.

Payment plan:

- GBP 1,500 to start.
- GBP 1,500 after blueprint/prototype approval.
- GBP 2,000 after working one-store pilot.
- GBP 950 after rollout, training, and handover.

Next step:

Approve the MVP scope, pay the project start payment, and schedule the workflow/data session.

## Short WhatsApp Follow-Up Template

Hi Atal, good seeing you today. As discussed, the Greenwich Gadgets website was the first trust/delivery step. The bigger opportunity is to avoid building each shop as a separate system and instead create one central stock system for Greenwich Gadgets, Tech Nest, the other shops, and the fourth location.

Our recommended MVP is GBP 5,950 split into milestones:

1. GBP 1,500 to start,
2. GBP 1,500 after blueprint/prototype,
3. GBP 2,000 after one-store pilot,
4. GBP 950 after rollout/training/handover.

This gives you one product/stock database, stock by store, transfers, stock history, low-stock visibility, CSV import/export, and a website connection plan for Greenwich Gadgets and Tech Nest. The key point is not to build Tech Nest as another disconnected system.

## Email Follow-Up Template

Subject: Central stock system plan for Greenwich Gadgets + Tech Nest

Hi Atal,

Thanks again for your time today.

The main recommendation is simple: instead of building Greenwich Gadgets, Tech Nest, and future stores as separate systems, we should create one central stock system that all stores and websites can use.

The first Greenwich Gadgets website proves the customer-facing workflow. The next business issue is operational: as you expand to three stores and a fourth location, stock needs one shared source of truth.

Our proposed MVP includes:

- central product database,
- stock by store/location,
- product management,
- inter-store transfers,
- stock movement history,
- low-stock visibility,
- CSV import/export,
- admin users,
- basic dashboard,
- website connection plan for Greenwich Gadgets and Tech Nest,
- training and handover.

The investment is GBP 5,950 for the defined MVP scope, split into milestone payments:

- GBP 1,500 to start,
- GBP 1,500 after blueprint/prototype approval,
- GBP 2,000 after one-store pilot,
- GBP 950 after rollout, training, and handover.

Expected delivery is 4-6 weeks depending on access, product data, and decision speed.

The next step is to approve the MVP scope and run the workflow/data session.

Best,  
Cinar

## Pre-Meeting Checklist

Before going to Greenwich Gadgets:

- Open the site locally/production if available.
- Test booking flow.
- Test quote/contact flow.
- Know exactly where booking emails/calendar events go.
- Prepare domain ownership question.
- Prepare remaining payment conversation for GBP 250.
- Keep the central stock proposal open on laptop.
- Print or have ready the one-page proposal.
- Agree with Mert:
  - opening price,
  - target price,
  - floor,
  - exclusions,
  - who speaks when.
- Do not improvise new features in the room.

## Domain Ownership Script

> I asked about domain ownership because we want to avoid future problems. If the domain, hosting, email, and website are controlled properly, you own the asset and we can support it cleanly. For the next system, access and ownership need to be clear from the beginning.

## If They Are Ready To Close

Say:

> Perfect. The clean way to do this is: today we confirm the scope, you pay the GBP 1,500 project start payment, and we schedule the workflow/data session. After that we send the final blueprint and start the build.

Then stop talking. Let them answer.

## If They Are Interested But Not Ready

Offer a paid blueprint:

> If you do not want to commit to the full build today, we can do a GBP 750 stock-system blueprint. We map the stores, products, workflow, and technical plan. If you proceed with the full system within 14 days, we credit that GBP 750 toward the GBP 5,950 build.

This keeps momentum and avoids free consulting.

## If They Only Want Tech Nest Website Now

Say:

> We can do Tech Nest next, but I strongly recommend we first define the stock system architecture. Otherwise Tech Nest becomes another separate website, and later we will need to redo work to connect it.

Then propose:

- Tech Nest website starts after a 1-2 day stock architecture session.
- The Tech Nest product/category structure matches the future central system.
- No separate inventory/admin panel is built for Tech Nest.

## Internal Negotiation Ladder

Opening:

- GBP 6,500 for central stock MVP.

Target:

- GBP 5,950.

Acceptable:

- GBP 5,500 if paid quickly and scope remains full but tightly controlled.

Reduced scope:

- GBP 5,000 only if phase one is reduced.

Do not accept:

- Less than GBP 5,000 for full central stock MVP.
- No deposit.
- "Start now and we pay later."
- Unlimited support.
- Unlimited features.
- Vague final payment trigger.

## Final Closing Line

> You already know where the business is going: more shops, more products, more stock movement. If we build each website separately, the system gets messy. If we build the central stock system now, every next shop becomes easier. Greenwich Gadgets proved the trust. This is the main system.

## Sources Used

Local project sources:

- `README.md`
- `DEPLOYMENT.md`
- `RELEASE_CHECKLIST.md`
- `package.json`
- `src/app/api/appointments/book/route.ts`
- `src/app/api/appointments/available-slots/route.ts`
- `src/lib/google-calendar.ts`
- `src/content/schedule.ts`

No PDF files were found in the Greenwich Gadgets project folder during this review.

Public web sources:

- AI Tech Builders official website: https://www.aitechbuilders.com/
- AI Tech Builders, Companies House: https://find-and-update.company-information.service.gov.uk/company/16468245
- AI Tech Builders LinkedIn: https://www.linkedin.com/company/ai-tech-builders
- Global Scale Ventures LinkedIn: https://uk.linkedin.com/company/global-scale-ventures
- Revint LinkedIn: https://www.linkedin.com/company/leadac-ai
- Red Eagle Tech UK bespoke software cost guide: https://redeagle.tech/blog/bespoke-software-cost-uk
- Shopify retail inventory software guide: https://www.shopify.com/blog/retail-inventory-software
- ChannelWeave pricing: https://www.channelweave.com/pricing
- Selro pricing: https://www.selro.co.uk/pricing
- Stok.ly multi-location retail ERP page: https://www.stok.ly/erp-for-multi-location-retail/
- Cialdini principles of persuasion: https://www.influenceatwork.com/7-principles-of-persuasion/
- Harvard Program on Negotiation price anchoring guide: https://www.pon.harvard.edu/daily/negotiation-skills-daily/price-anchoring-101/
- Commisceo Pakistan business culture guide: https://commisceo-global.com/country-guides/pakistan-guide/
- Commisceo UK business culture guide: https://commisceo-global.com/country-guides/uk-guide/

