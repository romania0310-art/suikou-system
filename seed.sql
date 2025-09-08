-- サンプルデータの投入

-- サンプルクラスデータ
INSERT OR IGNORE INTO classes (grade, class_number, school_year, teacher_name) VALUES 
  (3, 1, 2024, '田中太郎'),
  (3, 2, 2024, '佐藤花子'),
  (4, 1, 2024, '鈴木一郎'),
  (5, 1, 2024, '高橋美香');

-- サンプル児童データ（3年1組）
INSERT OR IGNORE INTO students (student_number, name, class_id) VALUES 
  ('01', '山田太郎', 1),
  ('02', '田中花子', 1),
  ('03', '佐藤次郎', 1),
  ('04', '鈴木美咲', 1),
  ('05', '高橋健太', 1);

-- サンプルセッション
INSERT OR IGNORE INTO review_sessions (session_name, class_id, status) VALUES 
  ('3年1組 2学期所見', 1, 'draft');

-- サンプル所見データ
INSERT OR IGNORE INTO student_reports (session_id, student_id, subject, original_text, revised_text, is_reviewed) VALUES 
  (1, 1, '国語', '読解力がとても良くて、作文も上手に書けています。漢字の練習もがんばっています。', '読解力に優れ、作文を適切に書くことができます。漢字の学習に継続して取り組んでいます。', true),
  (1, 1, '算数', '計算がすごく速くて、文章題もよく考えて解いています。', '計算を正確かつ迅速に行い、文章題について論理的に思考して解決しています。', true),
  (1, 2, '国語', 'お話を読むのが大好きで、感想もちゃんと書けています。', '物語の読解を積極的に行い、感想を適切に表現できます。', true),
  (1, 2, '算数', '基本的な計算はできるけど、少し難しい問題になると時間がかかります。', '基本的な計算技能を習得していますが、応用問題の解決には時間を要する場合があります。', true),
  (1, 3, '国語', 'みんなの前で発表するのがとても上手で、声も大きくてはっきりしています。', '学級での発表において、明瞭な発声で効果的に表現することができます。', true);