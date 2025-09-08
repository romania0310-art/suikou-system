-- 通知表所見管理システム初期スキーマ

-- クラス情報テーブル
CREATE TABLE IF NOT EXISTS classes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grade INTEGER NOT NULL,        -- 学年 (1-6)
  class_number INTEGER NOT NULL, -- クラス番号 (1, 2, 3...)
  school_year INTEGER NOT NULL,  -- 年度 (例: 2024)
  teacher_name TEXT NOT NULL,    -- 担任名
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(grade, class_number, school_year)
);

-- 児童情報テーブル
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_number TEXT NOT NULL,  -- 出席番号
  name TEXT NOT NULL,           -- 児童名
  class_id INTEGER NOT NULL,    -- クラスID
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id),
  UNIQUE(student_number, class_id)
);

-- 所見セッション管理テーブル（CSV一括処理用）
CREATE TABLE IF NOT EXISTS review_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_name TEXT NOT NULL,   -- セッション名（例：「3年1組 2学期所見」）
  class_id INTEGER NOT NULL,    -- 対象クラス
  status TEXT DEFAULT 'draft',  -- 状態: draft, completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- 所見データテーブル
CREATE TABLE IF NOT EXISTS student_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,  -- セッションID
  student_id INTEGER NOT NULL,  -- 児童ID
  subject TEXT NOT NULL,        -- 教科・分野（例：「国語」「算数」「総合」）
  original_text TEXT NOT NULL,  -- 元の所見文
  revised_text TEXT,            -- 推敲後の所見文
  revision_notes TEXT,          -- 修正理由・メモ
  is_reviewed BOOLEAN DEFAULT FALSE, -- 推敲済みかどうか
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES review_sessions(id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  UNIQUE(session_id, student_id, subject)
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_classes_year_grade ON classes(school_year, grade, class_number);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_sessions_class ON review_sessions(class_id);
CREATE INDEX IF NOT EXISTS idx_reports_session ON student_reports(session_id);
CREATE INDEX IF NOT EXISTS idx_reports_student ON student_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_reports_review_status ON student_reports(is_reviewed);