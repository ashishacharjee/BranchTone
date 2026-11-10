PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS projects (
  project_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  current_version_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS story_versions (
  version_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  version_label TEXT NOT NULL,
  source_filename TEXT NOT NULL,
  source_sha256 TEXT NOT NULL,
  story_format TEXT NOT NULL CHECK (story_format = 'twee_harlowe_subset'),
  compilation_status TEXT NOT NULL CHECK (compilation_status IN ('success','warning','failed')),
  compiled_at TEXT,
  UNIQUE(project_id, version_label)
);

CREATE TABLE IF NOT EXISTS passages (
  passage_id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES story_versions(version_id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  title TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  tags_json TEXT NOT NULL DEFAULT '[]',
  source_start INTEGER CHECK (source_start IS NULL OR source_start >= 0),
  source_end INTEGER CHECK (source_end IS NULL OR (source_start IS NOT NULL AND source_end >= source_start)),
  source_line_start INTEGER,
  source_line_end INTEGER,
  provenance TEXT NOT NULL CHECK (provenance IN ('imported_source','demo_fixture')),
  UNIQUE(version_id, source_name)
);

CREATE TABLE IF NOT EXISTS story_edges (
  edge_id TEXT PRIMARY KEY,
  version_id TEXT NOT NULL REFERENCES story_versions(version_id) ON DELETE CASCADE,
  source_passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  target_passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  choice_text TEXT NOT NULL,
  guard_json TEXT,
  source_start INTEGER CHECK (source_start IS NULL OR source_start >= 0),
  source_end INTEGER CHECK (source_end IS NULL OR (source_start IS NOT NULL AND source_end >= source_start)),
  CHECK (source_passage_id <> target_passage_id)
);

CREATE TABLE IF NOT EXISTS audio_assets (
  asset_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('music','ambience','sfx','voice')),
  mime_type TEXT,
  duration_seconds REAL CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
  sample_rate_hz INTEGER,
  channels INTEGER,
  size_bytes INTEGER CHECK (size_bytes IS NULL OR size_bytes >= 0),
  storage_key TEXT UNIQUE,
  sha256 TEXT,
  status TEXT NOT NULL CHECK (status IN ('available','missing','invalid')),
  provenance TEXT NOT NULL CHECK (provenance IN ('uploaded_asset','demo_fixture'))
);

CREATE TABLE IF NOT EXISTS audio_cues (
  cue_id TEXT PRIMARY KEY,
  asset_id TEXT NOT NULL REFERENCES audio_assets(asset_id) ON DELETE RESTRICT,
  layer TEXT NOT NULL CHECK (layer IN ('music','ambience','sfx','voice')),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('passage_entry','narrative_event')),
  trigger_passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  trigger_event_id TEXT,
  required_facts_json TEXT NOT NULL DEFAULT '[]',
  stop_policy TEXT NOT NULL CHECK (stop_policy IN ('manual','event_required','end_of_passage','asset_end')),
  stop_event_id TEXT,
  start_offset_ms INTEGER NOT NULL DEFAULT 0 CHECK (start_offset_ms >= 0),
  fade_in_ms INTEGER NOT NULL DEFAULT 0 CHECK (fade_in_ms >= 0),
  fade_out_ms INTEGER NOT NULL DEFAULT 0 CHECK (fade_out_ms >= 0),
  loop INTEGER NOT NULL DEFAULT 0 CHECK (loop IN (0,1)),
  allow_overlap INTEGER NOT NULL DEFAULT 0 CHECK (allow_overlap IN (0,1)),
  intentional INTEGER NOT NULL DEFAULT 0 CHECK (intentional IN (0,1)),
  provenance TEXT NOT NULL CHECK (provenance IN ('creator_config','demo_fixture'))
);


CREATE TABLE IF NOT EXISTS state_mutations (
  mutation_id TEXT PRIMARY KEY,
  passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  variable_name TEXT NOT NULL,
  value_json TEXT NOT NULL,
  source_start INTEGER CHECK (source_start IS NULL OR source_start >= 0),
  source_end INTEGER CHECK (source_end IS NULL OR (source_start IS NOT NULL AND source_end >= source_start)),
  provenance TEXT NOT NULL CHECK (provenance IN ('source_macro','demo_fixture'))
);

CREATE TABLE IF NOT EXISTS narrative_annotations (
  annotation_id TEXT PRIMARY KEY,
  passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  mood TEXT,
  intensity INTEGER CHECK (intensity IS NULL OR intensity BETWEEN 1 AND 5),
  provenance TEXT NOT NULL CHECK (provenance IN ('gemini_candidate','creator_authored','demo_fixture')),
  approval_status TEXT NOT NULL CHECK (approval_status IN ('pending','approved','rejected','edited')),
  authority_scope TEXT NOT NULL DEFAULT 'production'
);

CREATE TABLE IF NOT EXISTS narrative_events (
  event_id TEXT PRIMARY KEY,
  annotation_id TEXT NOT NULL REFERENCES narrative_annotations(annotation_id) ON DELETE CASCADE,
  passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('identity_reveal','fact_discovery','mystery_resolved','new_conflict','jump_scare','other')),
  fact_key TEXT,
  description TEXT NOT NULL,
  evidence_quote TEXT,
  evidence_verified INTEGER NOT NULL DEFAULT 0 CHECK (evidence_verified IN (0,1)),
  source_start INTEGER,
  source_end INTEGER,
  order_index INTEGER NOT NULL,
  approved INTEGER NOT NULL DEFAULT 0 CHECK (approved IN (0,1)),
  provenance TEXT NOT NULL CHECK (provenance IN ('gemini_candidate','creator_authored','demo_fixture'))
);

CREATE TABLE IF NOT EXISTS simulation_runs (
  simulation_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  version_id TEXT NOT NULL REFERENCES story_versions(version_id) ON DELETE CASCADE,
  exploration_status TEXT NOT NULL CHECK (exploration_status IN ('exhaustive','bounded','incomplete')),
  states_explored INTEGER NOT NULL CHECK (states_explored >= 0),
  warnings_json TEXT NOT NULL DEFAULT '[]',
  provenance TEXT NOT NULL CHECK (provenance IN ('backend_run','demo_fixture')),
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS route_results (
  route_result_id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulation_runs(simulation_id) ON DELETE CASCADE,
  route_id TEXT NOT NULL,
  passage_path_json TEXT NOT NULL,
  trace_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('valid','issues','incomplete'))
);

CREATE TABLE IF NOT EXISTS cue_activation_events (
  activation_id TEXT PRIMARY KEY,
  simulation_id TEXT NOT NULL REFERENCES simulation_runs(simulation_id) ON DELETE CASCADE,
  route_id TEXT NOT NULL,
  cue_id TEXT NOT NULL REFERENCES audio_cues(cue_id) ON DELETE CASCADE,
  passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  trigger_fired INTEGER NOT NULL CHECK (trigger_fired IN (0,1)),
  asset_available INTEGER NOT NULL CHECK (asset_available IN (0,1)),
  route_time_seconds REAL CHECK (route_time_seconds IS NULL OR route_time_seconds >= 0),
  timing_provenance TEXT NOT NULL CHECK (timing_provenance IN ('simulation_trace','media_derived','design_fixture_only','unavailable')),
  facts_at_trigger_json TEXT NOT NULL,
  required_facts_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS validation_runs (
  run_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  version_id TEXT NOT NULL REFERENCES story_versions(version_id) ON DELETE CASCADE,
  simulation_id TEXT NOT NULL REFERENCES simulation_runs(simulation_id) ON DELETE CASCADE,
  rule_ids_json TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running','completed','failed')),
  started_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS findings (
  finding_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES validation_runs(run_id) ON DELETE CASCADE,
  finding_code TEXT NOT NULL,
  rule_id TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low','info')),
  status TEXT NOT NULL CHECK (status IN ('open','resolved','accepted_risk','false_positive')),
  passage_id TEXT NOT NULL REFERENCES passages(passage_id) ON DELETE CASCADE,
  cue_id TEXT REFERENCES audio_cues(cue_id) ON DELETE SET NULL,
  asset_id TEXT REFERENCES audio_assets(asset_id) ON DELETE SET NULL,
  affected_route_ids_json TEXT NOT NULL,
  explanation TEXT NOT NULL,
  expected_state_json TEXT,
  actual_state_json TEXT,
  evidence_quote TEXT,
  evidence_verified INTEGER NOT NULL DEFAULT 0 CHECK (evidence_verified IN (0,1)),
  source_start INTEGER,
  source_end INTEGER,
  route_trace_json TEXT NOT NULL,
  suggested_action TEXT,
  provenance TEXT NOT NULL CHECK (provenance IN ('backend_validation','demo_fixture')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_passages_version ON passages(version_id);
CREATE INDEX IF NOT EXISTS idx_edges_source ON story_edges(source_passage_id);
CREATE INDEX IF NOT EXISTS idx_cues_trigger_passage ON audio_cues(trigger_passage_id);
CREATE INDEX IF NOT EXISTS idx_findings_run ON findings(run_id);
CREATE INDEX IF NOT EXISTS idx_findings_code ON findings(finding_code);
