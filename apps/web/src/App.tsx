import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { BrandLayout } from "./layouts/BrandLayout";
import { CreatorLayout } from "./layouts/CreatorLayout";
import { GuestOnly, RequireRole } from "./routes/guards";
import AssistantPanel from "./features/assistant/AssistantPanel";
import BusinessDashboard from "./features/business/BusinessDashboard";
import CampaignsPage from "./features/campaigns/CampaignsPage";
import EarningsPage from "./features/earnings/EarningsPage";
import FeedPage from "./features/feed/FeedPage";
import LandingPage from "./features/marketing/LandingPage";
import PortraitPage from "./features/portrait/PortraitPage";
import SignInPage from "./features/auth/SignInPage";

/**
 * One app, three audiences (BUILD_PLAN D13):
 *
 *   guest    → public landing, no app chrome
 *   creator  → sidebar app: the campaign feed, portrait, earnings, assistant
 *   brand    → dashboard, responsive down to a phone browser
 *
 * This is the whole product. The native app comes later and is derived from
 * these screens — so anything built here is the source, not a preview.
 *
 * Routes are Romanian because they are user-visible; everything else stays
 * English (CLAUDE.md §Conventions). The guards only shape navigation — the
 * gateway re-checks the role on every request.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <GuestOnly>
              <LandingPage />
            </GuestOnly>
          }
        />
        <Route
          path="/intra"
          element={
            <GuestOnly>
              <SignInPage />
            </GuestOnly>
          }
        />

        {/* Creator */}
        <Route
          element={
            <RequireRole role="creator">
              <CreatorLayout />
            </RequireRole>
          }
        >
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/campanii" element={<CampaignsPage />} />
          <Route path="/profil" element={<PortraitPage />} />
          <Route path="/castiguri" element={<EarningsPage />} />
          <Route path="/asistent" element={<AssistantPanel />} />
        </Route>

        {/* Brand */}
        <Route
          element={
            <RequireRole role="brand">
              <BrandLayout />
            </RequireRole>
          }
        >
          <Route path="/brand" element={<BusinessDashboard />} />
          <Route path="/brand/analize" element={<BusinessDashboard />} />
          <Route path="/brand/creatori" element={<BusinessDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
