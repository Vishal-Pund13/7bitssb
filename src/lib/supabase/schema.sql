-- ============================================================
-- SSB Research Journal — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  body jsonb,
  category text[] DEFAULT '{}',
  source_name text,
  source_url text,
  cover_image_url text,
  published boolean DEFAULT false,
  read_time_minutes integer DEFAULT 1,
  india_angle text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Key terms table
CREATE TABLE IF NOT EXISTS key_terms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  term text NOT NULL,
  definition text NOT NULL,
  category text,
  article_ids uuid[] DEFAULT '{}'
);

-- GD Topics table
CREATE TABLE IF NOT EXISTS gd_topics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  difficulty text CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
  suggested_points text[] DEFAULT '{}',
  related_article_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- RLS Policies
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gd_topics ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public can read published articles"
  ON articles FOR SELECT
  USING (published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin full access articles"
  ON articles FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read key_terms"
  ON key_terms FOR SELECT
  USING (true);

CREATE POLICY "Admin full access key_terms"
  ON key_terms FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Public can read gd_topics"
  ON gd_topics FOR SELECT
  USING (true);

CREATE POLICY "Admin full access gd_topics"
  ON gd_topics FOR ALL
  USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Public can read article images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

CREATE POLICY "Auth users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'article-images' AND auth.role() = 'authenticated');

CREATE POLICY "Auth users can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'article-images' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — Global Strategic Choke Points Article
-- ============================================================

-- Insert key terms first
INSERT INTO key_terms (term, definition, category) VALUES
('Strait of Hormuz', 'A narrow waterway between Oman and Iran connecting the Persian Gulf to the Gulf of Oman. Nearly 20% of global oil trade passes through it, making it one of the world''s most critical energy chokepoints.', 'Geopolitics'),
('LNG', 'Liquefied Natural Gas — natural gas that has been cooled to −162°C to become a liquid for ease of transport. Traded globally via specialized tanker ships.', 'Economy'),
('Choke Point', 'A strategic narrow passage (maritime strait, canal, or land corridor) through which a disproportionate volume of global trade, energy, or military movement flows — making it a high-value target in geopolitical competition.', 'Geopolitics'),
('Bab el-Mandeb', 'Arabic for "Gate of Grief" — a strait between Yemen and Djibouti connecting the Red Sea to the Gulf of Aden. A key transit point for Europe–Asia trade via the Suez Canal route.', 'Geopolitics'),
('Suez Canal', 'An artificial canal in Egypt connecting the Mediterranean Sea to the Red Sea, enabling ships to avoid circumnavigating Africa. Handles ~12% of global trade.', 'Geopolitics'),
('Panama Canal', 'A 80-km ship canal in Panama connecting the Atlantic and Pacific Oceans. Handles ~5% of global maritime trade, critical for US East Coast–Asia routes.', 'Geopolitics'),
('Taiwan Strait', 'A 180-km wide strait separating Taiwan from mainland China. ~50% of global container shipping and critical semiconductor supply chains transit this waterway.', 'Defence'),
('EUV Lithography', 'Extreme Ultraviolet Lithography — advanced semiconductor manufacturing technology using extremely short wavelengths to print nanoscale circuit patterns. ASML (Netherlands) holds near-monopoly on EUV machines.', 'Science & Tech'),
('Rare Earth Elements', 'A group of 17 metallic elements (incl. neodymium, dysprosium) critical for defence electronics, EV motors, wind turbines, and precision-guided munitions. China controls ~85% of global production.', 'Science & Tech'),
('Subsea Cables', 'Undersea fiber-optic cables carrying ~95% of global internet and financial data. Over 400 such cables span the ocean floors, passing through chokepoints vulnerable to sabotage.', 'Science & Tech'),
('IOR', 'Indian Ocean Region — a geopolitically vital maritime zone spanning Africa''s east coast, the Middle East, South Asia, and Southeast Asia. India considers it its primary strategic neighborhood.', 'Defence'),
('QUAD', 'Quadrilateral Security Dialogue — an informal strategic forum between India, USA, Australia, and Japan aimed at maintaining a free and open Indo-Pacific. Revived in 2017 amid China''s assertiveness.', 'Defence'),
('Blue Water Navy', 'A naval force capable of sustained operations in deep, open ocean waters far from home shores. Indicator of a nation''s global power-projection capability. India is developing this capability.', 'Defence'),
('SLOC', 'Sea Lanes of Communication — established maritime routes used for trade and naval movement. Control of SLOCs is a core objective of naval strategy; disrupting them can cripple an adversary''s economy.', 'Defence'),
('Ton-Mile Demand', 'A shipping metric = cargo tonnage × distance sailed. Rising ton-mile demand indicates longer shipping routes (e.g., due to chokepoint avoidance), increasing freight costs and emissions.', 'Economy'),
('High-Bandwidth Memory', 'HBM — advanced memory chips stacked vertically to achieve extreme data-transfer speeds. Essential for AI training chips (GPUs). South Korea (SK Hynix, Samsung) dominates production.', 'Science & Tech')
ON CONFLICT DO NOTHING;

-- Insert the article
WITH term_ids AS (
  SELECT array_agg(id) as ids FROM key_terms
  WHERE term IN (
    'Strait of Hormuz', 'LNG', 'Choke Point', 'Bab el-Mandeb', 'Suez Canal',
    'Panama Canal', 'Taiwan Strait', 'EUV Lithography', 'Rare Earth Elements',
    'Subsea Cables', 'IOR', 'QUAD', 'Blue Water Navy', 'SLOC',
    'Ton-Mile Demand', 'High-Bandwidth Memory'
  )
)
INSERT INTO articles (
  title, slug, excerpt, category, source_name, source_url,
  published, read_time_minutes, india_angle,
  body
) VALUES (
  'Global Strategic Choke Points: Controlling the Arteries of World Power',
  'global-strategic-choke-points',
  'An in-depth analysis of how maritime choke points, semiconductor supply chains, and undersea cable networks shape 21st-century geopolitical power — and what India must do to secure its strategic interests.',
  ARRAY['Geopolitics', 'Defence', 'India Focus'],
  'World Economic Forum',
  'https://www.weforum.org',
  true,
  12,
  'India is uniquely positioned at the intersection of critical maritime chokepoints — the Strait of Hormuz, Bab el-Mandeb, and the Malacca Strait all funnel trade into the Indian Ocean Region, India''s primary strategic domain. With 95% of India''s trade by volume and 70% by value moving via sea, securing SLOCs is not optional — it is existential. The QUAD partnership directly addresses China''s "String of Pearls" encirclement strategy. India''s planned third aircraft carrier (INS Vishal) and nuclear submarine fleet signal a serious Blue Water Navy ambition. For SSB aspirants: India''s maritime doctrine, the Indo-Pacific strategy, and QUAD are high-frequency interview topics.',
  '{
    "type": "doc",
    "content": [
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [{"type": "text", "text": "Introduction: Why Chokepoints Define Power"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "In an era of deglobalisation rhetoric, the physical geography of trade has never mattered more. Six maritime straits and two artificial canals account for the transit of over 60% of global traded goods by value. These chokepoints — narrow passages where geography compresses the flow of commerce, energy, and military movement — are the silent arteries of the modern world economy."}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "The 2024–2025 Houthi missile campaign targeting Red Sea shipping demonstrated, in real time, what analysts had long theorised: a non-state actor with anti-ship missiles can reroute global supply chains, add 14 days to Europe–Asia transit times, and spike freight rates by 300% — simply by threatening one chokepoint."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [{"type": "text", "text": "The Major Maritime Chokepoints"}]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": "1. Strait of Hormuz — The Oil Jugular"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "Roughly 20 million barrels of oil per day — approximately 20% of global petroleum trade — passes through this 33-km-wide strait between Iran and Oman. For Gulf LNG exporters like Qatar, it is the only exit route. Iran has repeatedly threatened to mine or block the Strait during periods of tension with the US or Israel. A 30-day closure would trigger the largest energy shock since 1973."}]
      },
      {
        "type": "blockquote",
        "content": [{"type": "paragraph", "content": [{"type": "text", "text": "\"Whoever controls Hormuz holds a gun to the head of the global economy.\" — Retired US Admiral James Stavridis"}]}]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": "2. Bab el-Mandeb — The Gate of Grief"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "The 29-km strait between Yemen and Djibouti is where the Red Sea meets the Gulf of Aden. Some 6.2 million barrels of oil and 8% of global LNG shipments pass daily. When Houthi attacks forced major carriers (Maersk, MSC, CMA CGM) to reroute around the Cape of Good Hope in late 2023, ton-mile demand spiked, port congestion in Europe worsened, and just-in-time manufacturing chains frayed."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": "3. Taiwan Strait — The Silicon Chokepoint"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "The Taiwan Strait is simultaneously a maritime and technological chokepoint. Geographically, ~50% of global container traffic transits it. But more critically, Taiwan''s TSMC produces over 90% of the world''s advanced chips (below 5nm). A Chinese blockade — even without kinetic conflict — would halt global electronics production within 6 months. The US CHIPS Act ($52 billion) and India''s semiconductor incentive scheme are direct responses to this vulnerability."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [{"type": "text", "text": "Beyond Maritime: The Digital and Material Chokepoints"}]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": "Undersea Cable Vulnerabilities"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "Over 400 subsea cables carry 95% of international internet traffic and virtually all international financial transactions. The Baltic Sea cable-cutting incidents of 2023–24 (attributed to Russian sabotage) highlighted a critical vulnerability. Key chokepoints include the Luzon Strait (Philippines), the Strait of Malacca, and the Red Sea shelf — where cables converge in narrow corridors."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 3},
        "content": [{"type": "text", "text": "Rare Earths and Semiconductor Supply Chains"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "China controls 85% of rare earth element processing and 60% of gallium/germanium production — materials essential for defence electronics, EV motors, and precision-guided munitions. In July 2023, China imposed export restrictions on gallium and germanium, sending shock waves through Western defence industries. Similarly, South Korea''s SK Hynix and Samsung dominate high-bandwidth memory production, creating a geographic chokepoint in AI chip supply chains."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [{"type": "text", "text": "Strategic Implications for the Indo-Pacific"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "The concentration of chokepoints in the Indo-Pacific is not coincidental — it is the product of geography, history, and the pattern of global industrialisation. China''s Belt and Road Initiative can be read as a systematic attempt to build alternative routes (land corridors, deep-water ports) that bypass US-controlled or US-influenced chokepoints. The China-Pakistan Economic Corridor (CPEC) and the Gwadar Port directly target this strategic logic — giving China direct access to the IOR bypassing the Malacca Strait."}]
      },
      {
        "type": "heading",
        "attrs": {"level": 2},
        "content": [{"type": "text", "text": "Policy Responses: Diversification and Resilience"}]
      },
      {
        "type": "paragraph",
        "content": [{"type": "text", "text": "Nations and corporations are responding to chokepoint vulnerabilities with three strategies: (1) Route diversification — investing in Arctic shipping lanes, trans-African pipelines, and overland rail; (2) Stockpiling — the US Strategic Petroleum Reserve, China''s state grain reserves, and Taiwan''s chip fab diversification all reflect this logic; (3) Military presence — the proliferation of naval bases near chokepoints (US in Bahrain/Diego Garcia, China in Djibouti/Gwadar, France in Djibouti) is the clearest signal of how seriously states take chokepoint control."}]
      }
    ]
  }'::jsonb
);

-- Link key terms to article
UPDATE key_terms
SET article_ids = array_append(article_ids, (SELECT id FROM articles WHERE slug = 'global-strategic-choke-points'))
WHERE term IN (
  'Strait of Hormuz', 'LNG', 'Choke Point', 'Bab el-Mandeb', 'Suez Canal',
  'Panama Canal', 'Taiwan Strait', 'EUV Lithography', 'Rare Earth Elements',
  'Subsea Cables', 'IOR', 'QUAD', 'Blue Water Navy', 'SLOC',
  'Ton-Mile Demand', 'High-Bandwidth Memory'
);

-- Add a GD Topic based on the article
INSERT INTO gd_topics (title, difficulty, suggested_points, related_article_ids) VALUES (
  'Should India prioritise Naval Power over Land Forces in the current security environment?',
  'Hard',
  ARRAY[
    'India has 7,516 km of coastline and 95% trade by sea — naval dominance directly protects economy',
    'China''s String of Pearls: Gwadar, Hambantota, Djibouti encircle India via sea',
    'QUAD partnership requires India to contribute naval capacity in the Indo-Pacific',
    'However, Pakistan and China land borders remain active threat vectors (Galwan 2020)',
    'Nuclear triad completion requires sea-based deterrence (INS Arihant class)',
    'Blue Water Navy aspirations need 3 carrier groups — India currently has 1',
    'Budget constraint: India cannot match China''s simultaneous land+sea buildup',
    'Counter-argument: Land modernisation (drones, artillery) is equally critical post-Ukraine lessons'
  ],
  ARRAY[(SELECT id FROM articles WHERE slug = 'global-strategic-choke-points')]
);
