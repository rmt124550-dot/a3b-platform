-- ─────────────────────────────────────────
--  A3B Platform — Schema PostgreSQL
-- ─────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── PLANES ───────────────────────────────
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'team');
CREATE TYPE plan_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- ─── USUARIOS ─────────────────────────────
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  password_hash     VARCHAR(255),
  name              VARCHAR(255),
  avatar_url        TEXT,
  email_verified    BOOLEAN DEFAULT FALSE,
  email_verify_token VARCHAR(255),
  reset_token       VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  plan              plan_type DEFAULT 'free',
  role              VARCHAR(50) DEFAULT 'user',  -- user | admin
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  last_login_at     TIMESTAMPTZ,
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_plan ON users(plan);

-- ─── SUSCRIPCIONES STRIPE ─────────────────
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id    VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_price_id       VARCHAR(255),
  plan                  plan_type NOT NULL DEFAULT 'free',
  status                plan_status DEFAULT 'active',
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  trial_end             TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- ─── PAGOS / FACTURAS ─────────────────────
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(255) UNIQUE,
  stripe_payment_intent VARCHAR(255),
  amount            INTEGER NOT NULL,  -- en centavos
  currency          VARCHAR(10) DEFAULT 'usd',
  status            VARCHAR(50),       -- succeeded | failed | pending
  description       TEXT,
  receipt_url       TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);

-- ─── HISTORIAL DE TRADUCCIONES ────────────
CREATE TABLE translation_history (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_text   TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_lang     VARCHAR(10) DEFAULT 'en',
  target_lang     VARCHAR(10) DEFAULT 'es',
  platform        VARCHAR(50) DEFAULT 'coursera',  -- coursera | youtube | udemy
  course_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_history_user_id ON translation_history(user_id);
CREATE INDEX idx_history_created_at ON translation_history(created_at);

-- ─── DICCIONARIO PERSONAL ─────────────────
CREATE TABLE user_dictionary (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  term            VARCHAR(500) NOT NULL,
  translation     VARCHAR(500) NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, term)
);

CREATE INDEX idx_dictionary_user_id ON user_dictionary(user_id);

-- ─── CONFIGURACIÓN DE USUARIO ─────────────
CREATE TABLE user_settings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  voice_speed     DECIMAL(3,1) DEFAULT 1.0,
  voice_volume    DECIMAL(3,1) DEFAULT 1.0,
  voice_pitch     DECIMAL(3,1) DEFAULT 1.0,
  voice_name      VARCHAR(255),
  target_lang     VARCHAR(10) DEFAULT 'es',
  show_overlay    BOOLEAN DEFAULT TRUE,
  translator      VARCHAR(50) DEFAULT 'google',  -- google | deepl
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REFRESH TOKENS ───────────────────────
CREATE TABLE refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(500) UNIQUE NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- ─── USAGE / MÉTRICAS ─────────────────────
CREATE TABLE usage_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,  -- translate | tts | export_srt
  platform    VARCHAR(50),
  meta        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_user_id ON usage_logs(user_id);
CREATE INDEX idx_usage_created_at ON usage_logs(created_at);
CREATE INDEX idx_usage_action ON usage_logs(action);

-- ─── FUNCIÓN updated_at AUTO ──────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_dictionary_updated_at BEFORE UPDATE ON user_dictionary FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── DATOS INICIALES ──────────────────────
INSERT INTO users (email, name, role, plan, email_verified)
VALUES ('admin@a3bhub.cloud', 'A3B Admin', 'admin', 'team', TRUE);
