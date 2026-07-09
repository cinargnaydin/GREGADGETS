export const LEAD_FUNNEL_PATH = '/get-started';

// The lead funnel is the single booking/quote entry point for the whole site.
// Every booking CTA routes here, so this is always on.
export const isLeadFunnelEnabled = true;

export function getLeadFunnelHref(fallbackHref: string) {
  return isLeadFunnelEnabled ? LEAD_FUNNEL_PATH : fallbackHref;
}
