import { permanentRedirect } from "next/navigation";

// The lead funnel was removed; booking now lives at /book. Keep this route as a
// permanent (308) redirect so old links, bookmarks and indexed URLs still work.
export default function GetStartedPage() {
  permanentRedirect("/book");
}
