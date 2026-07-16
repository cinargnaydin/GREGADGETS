export const siteConfig = {
  name: "Greenwich Gadgets",
  domain: "https://greenwichgadgets.com",
  title: "Greenwich Gadgets | Fast Repair, Buy/Sell, Accessories",
  description:
    "Trusted local gadget experts on Greenwich High Road for same-day repairs, honest pricing, and curated accessories.",
  address: {
    line1: "267 Greenwich High Rd",
    city: "London",
    area: "SE10 8NB",
    country: "UK",
  },
  contact: {
    phoneDisplay: "07340 327305",
    phoneHref: "tel:+447340327305",
    phone2Display: "07562 720358",
    phone2Href: "tel:+447562720358",
    whatsappHref: "https://wa.me/447340327305",
    email: "hello@greenwichgadgets.com",
    mapsHref: "https://maps.google.com/?q=267+Greenwich+High+Rd+London+SE10+8NB",
  },
  // Hand-maintained opening hours shown across the site.
  hours: [
    { day: "Mon-Fri", hours: "08:30 - 20:00" },
    { day: "Saturday", hours: "09:00 - 20:00" },
    { day: "Sunday", hours: "12:00 - 15:00" },
  ],
  trustPoints: [
    "Same-Day Repairs",
    "No-Obligation Quote",
    "Warranty-Backed Service",
    "50+ 5-star reviews",
  ],
  repairIssues: [
    "Cracked Screen",
    "Battery Drain",
    "Charging Port",
    "Camera / Face ID",
    "Water Damage",
    "Data Transfer",
  ],
  // Common laptop repairs the shop handles, shown on the repairs page and in booking.
  laptopIssues: [
    "Cracked / Faulty Screen",
    "Battery Replacement",
    "Keyboard Repair",
    "Won't Power On",
    "Slow / Upgrade (SSD/RAM)",
    "Virus / Software Fix",
    "Liquid Damage",
    "Data Recovery",
  ],
  // Suggestions for the booking form's device brand field (free text, not a hard list).
  phoneBrands: [
    "Apple iPhone",
    "Samsung",
    "Google Pixel",
    "Huawei",
    "Xiaomi",
    "OnePlus",
    "Sony",
    "Motorola",
    "Nokia",
    "Oppo",
  ],
  laptopBrands: [
    "Apple MacBook",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Acer",
    "Microsoft Surface",
    "MSI",
    "Samsung",
    "Huawei",
  ],
};

export const testimonials = [
  {
    quote:
      "My phone got reset without losing data in under 15 minutes. Incredibly kind and patient staff.",
    author: "Emma F. - Google Review",
  },
  {
    quote:
      "Super friendly owner replaced my iPhone swollen battery quickly for an affordable price.",
    author: "Rufus M. - Google Review",
  },
  {
    quote:
      "No hard sell, really straightforward, and very helpful with transferring everything from old to new.",
    author: "D L - Google Review",
  },
  {
    quote:
      "Really helpful, good range and reasonable prices. Beautiful perfumes too.",
    author: "Eve P. - Google Review",
  },
];

export const navLinks = [
  { href: "/repair-services", label: "Repairs" },
  { href: "/buy-sell", label: "Buy/Sell" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];
