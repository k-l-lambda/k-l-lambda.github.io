---
title: 钢琴作为通用声音拟合器
tags:
- essay
- piano
- midi
- audio
- 中文
---


{% midi /images/general-piano/hi-en.mid "Hi, I'm a smart piano." %}
{% midi /images/general-piano/hi-zh.mid "你好，我是一架智慧钢琴。" %}

以上两段语音MIDI对应的五线谱。由于曲谱记谱缺少MIDI的逐音符力度，播放效果略差。

```lyl.play
% Exact pitches/onsets/gates; individual MIDI velocities are not encoded.
% 32 grid cells per bar; quarter note = 375; padding only after source end.
% Lyrics are approximate; second sentence inferred from ASR, pending original text.
[title "Speaking MIDI — English"]
[subtitle "20 ms = 1/32; 4/4; approximate lyrics"]
[auto-beam "off"]

\staff "1" \numericTimeSignature \time 4/4 \clef "treble" \time 4/4 \tempo 4=375 \ottava #2 <c'' cs d ds fs g gs a as b c cs d a'>32[ <cs d e f fs g gs a as b c cs d ds f fs g gs a as c> <c cs d ds g gs a as b cs d ds e f fs g gs a as b c> <e a c ds f fs g gs a as> <e f a cs e fs gs a as> <f a as cs g' a> <a as cs d g a> <a b cs g' a>] <a b c cs e fs g a>[ <c cs d e fs g gs a as> <ds, d' ds e fs g gs a as> <ds' fs gs as> <ds e f fs g gs a as> <d f g a> <g, d' e f fs g a> <d d' e f fs g a>] <d' e f fs g a>[ <e f fs g gs a> <c, g' d' ds e f fs gs> <fs gs cs d ds fs g a as> <c' cs d a'>] r r16 r8 r32 <c, cs d ds e f fs g gs a as b c cs d ds e f fs g gs a as b c>[ <gs' b c cs d e f fs g gs a as> <d' ds e f fs a>] \addlyrics { Hi, _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ I'm _ _ _ } \\
\staff "2" \clef "treble" r32 <fs g gs'>[ <gs g'> <gs a gs' a> <a a' as> <as as'> as a] a[ <a a'> <gs a'> gs <g g'> <fs g g'> <fs g'>] r fs' r as[ <as b> a] r r16 r8 g32[ <ds, g' gs as> <e e' b'> e] | %1

\staff "1" \numericTimeSignature \time 4/4 <cs''' d ds e f fs g gs a as>32[ <d ds e f fs g gs as> <as cs ds e f fs g gs a> <c, e f gs b cs d e fs g gs a as> <c f gs a as b d e fs gs> <ds as' gs'> ds <ds g as>] <c ds g gs a>[ <ds g a as b cs ds e f fs g gs a c> <fs as cs ds f g gs a as> <cs d a' c f g gs a b> d' <d f> <cs, f c' d f fs a> <c d d' f>] <c a' as c d ds e f fs g a>[ <ds fs a as c d f fs a as> <cs' d ds e f fs g a as> <f a> <f, gs> <f gs b cs> <cs f gs b cs> <cs d f fs g b cs f g gs as c>] <d fs a b d f fs g>[ <d g a c d e fs> <gs a as b d e fs g> <c, cs g' gs as c cs d ds e f fs g> <cs' d ds e f fs g gs b c>] r r16 \addlyrics { _ _ _ _ _ _ _ _ _ a _ _ _ _ smart _ _ _ _ _ _ _ _ _ _ _ _ _ pi } \\
\staff "2" <e as' b>32[ <ds e as'> <e e' b'> <e f f'> <e g> <cs ds e> e e] <as, ds e f e' f fs as b>[ as'' <b,, cs d'> <gs a''>] r16 <cs,, gs''''>32 r gs''''[ b] r16 cs,,32[ cs cs <d ds d' gs a>] a''[ as gs <b,, b' c e f fs g b> <gs as'>] r r16 | %2

\staff "1" \numericTimeSignature \time 4/4 r32 <a''' as b c d ds e f fs>[ <as d ds e f fs g gs a> <fs' g gs a as> <fs g a as> <fs g gs a as> <e f fs g gs> <c, cs g' as d e f fs g gs a>] <c cs e g as c d e f fs g gs a>[ <c cs e gs as c cs d ds e f fs g gs a as> <c cs g' gs as c cs d ds e f fs g gs a as> <c g' as b c d e f fs g gs a as> <ds fs a b cs ds f fs g gs a as> <d f gs e' fs g gs a as b c>] r16 <c cs ds f fs gs a as b c cs ds f fs g gs a as>32[ <d fs a as b cs d ds e f fs g gs a> <cs fs gs a as b f' fs g gs as> <c d ds e f gs a as d ds e f fs g gs a as> <d e fs a f' fs g gs> <c cs f gs'> <c cs ds f gs'> ds] <c cs d>[ <c cs a'' b>] r16 r32 <c cs g' a>[ <cs gs' a as b ds f gs> <c g' gs a as b c cs d ds e fs gs a>] \addlyrics { _ _ a _ _ _ _ _ _ no. _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ } \\
\staff "2" r8 r32 c[ <c cs cs'> <c cs g''>] <c cs g'' gs>[ <c cs g'' gs> <c g''> <b g''> <b fs'' as b> <e, f a' e' f as> a <ds, gs ds'' e>] <gs g' d' g a b>[ <cs, f fs'' g as b> f <as,, e'' e'' b'> <as e'' e'' gs b> <g'''' gs as b> <c,,,, ds' ds'' g gs as> <c ds' as'''>] <c, c' ds' as''' b>[ cs''] r16 r b'''32 r | %3

\staff "1" \numericTimeSignature \time 4/4 <g''' c cs d ds e f fs gs a>32[ <cs, a' b c cs d e f fs gs a> <gs' a cs d ds e fs g gs a> <c, c' cs d e a> <gs' cs d ds fs a> <b gs'> gs'] r r4 r8 <ds, fs>32[ <d a''> <ds e g> <c cs d ds f fs gs>] <fs g gs a d e fs gs a>[ <ds a' as b cs e fs gs a as c> <d as' c cs d ds e f fs g gs a as b>] r fs[ <c a' as b c cs d ds e f fs g gs a> <c d' fs g gs a> <fs' gs a>] \addlyrics { _ _ _ _ _ _ _ What _ _ _ _ _ can _ _ _ _ } \\
\staff "2" r2 r16 r32 <g' a'>[ <a, c cs d ds e f a' as> <ds a'' as> <a'' as> <e, f e' f fs b>] <ds' as' b>[ <cs, as''>] r16 r32 <fs g b>[ <b, c e f fs gs f' b> <c,, cs'' ds e as'>] | %4

\staff "1" \numericTimeSignature \time 4/4 as'''32[ <c, gs' b c d> <gs' b cs d ds e fs gs a> <cs ds e f fs g gs a> <cs d e f fs g gs a> <e f fs g gs> <f g gs>] r r <ds f>[ <ds, g as ds f fs g gs a> <as' ds f fs g a> <cs ds f fs g gs a> <gs b cs d e fs g gs> <g gs a as gs'> <e f fs g a c cs d ds e f fs g gs as>] <fs a as b c cs d ds e f fs g gs a>[ <gs as b cs d e fs g a> <gs c cs d ds f fs g gs a> <fs g gs a as c cs d ds e f fs g gs> <a as b e f fs g> <as c cs ds f gs> <c d ds e f fs gs> <a e' f fs g>] <fs' g a>[ <fs g a> <f fs g gs> <e f fs g gs a> <cs, a' c ds e f fs g gs a> <ds cs' d ds e f fs g gs a> <e c' fs gs> <ds gs a as cs fs>] \addlyrics { _ _ I _ _ _ do _ _ _ _ for _ _ _ _ _ _ _ _ _ _ you? _ _ _ _ _ _ _ } \\
\staff "2" e32[ <e f f' fs b> <ds e e' b'> <ds e> ds g <b, cs>] r r <fs' g>[ <cs ds e as'> e <e fs>] r cs r r8 <fs gs b'>32[ <ds as''> d <cs d>] b r <e f>[ <f fs> <g fs'> gs <gs a> gs] | %5

\staff "1" \numericTimeSignature \time 4/4 <d'' ds fs g b gs' a>32[ <c cs d ds e f> <c cs d ds g' gs a b> <c cs>] r ds[ <f fs> <fs gs a>] a r r16 r8 r2 \addlyrics { _ _ _ _ _ _ _ _ } \\
\staff "2" <fs g'>32[ <e ds' e f fs> <b c cs cs' d as' b> <gs a as' b a'> <ds gs> <ds gs b''> <ds as'''>] r r4 r2 | %6
```

```lyl.play
% Exact pitches/onsets/gates; individual MIDI velocities are not encoded.
% 32 grid cells per bar; quarter note = 375; padding only after source end.
% Lyrics are approximate; second sentence inferred from ASR, pending original text.
[title "Speaking MIDI — 中文"]
[subtitle "20 ms = 1/32; 4/4; approximate lyrics"]
[auto-beam "off"]

\staff "1" \numericTimeSignature \time 4/4 \clef "treble" \time 4/4 \tempo 4=375 \ottava #2 ds''32[ <ds ds' g a> <d' ds e f fs g gs a as> <f, d' ds e f fs g gs a as> <f c' ds f g a as> <c cs e f g gs a b c cs d ds e f fs g gs a as> <d f fs g gs a as b c cs d ds e f fs g gs a as b c> <cs d ds e f fs g gs a as cs d ds e f fs g gs a as b c>] <ds f g gs a as cs d ds e f fs g gs a as b>[ <d a' d fs gs a as b c> <cs d gs a' as b c> <c cs e g> <c e g as c> <c ds fs> <c ds fs a> <c d a' as>] <c cs d f gs as d c'>[ <cs d ds f fs gs a as cs d fs> <cs d ds a' d ds e f fs g a as c> <d f fs a as c cs d e f fs as> <fs a as c cs d ds f gs> <c ds as' cs d> <c b''> b'] r4 \addlyrics { 你 _ _ _ _ _ _ 好， _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ 我 } \\
\staff "2" \clef "treble" <b cs e fs g gs a as'>32[ <ds e a a' as> <e f g f'> <f f' fs>] r g'[ g g] <cs,, ds as''>[ <d gs' a> <cs gs''> <c g'' gs> <c c' g'> <c fs' g b> <b c b' fs' g b> <c g''>] <cs gs''>[ gs'' <ds, e f' a> <f' as b> <f fs> <e g>] r16 r4 | %1

\staff "1" \numericTimeSignature \time 4/4 r4 r8 c''32[ d <cs d e> <c cs ds e f fs as'>] <c fs g a' as>[ <gs' a d f fs g gs a> <a as b f' fs g> <a as b c cs d ds e f fs g> <cs d ds e f fs g gs a as> <ds e f fs g gs a> <cs d ds e f fs a as> <d ds e f fs g gs a as>] <c cs d ds e f fs g a as>[ <e f fs g gs a as> <fs g gs a as> <e g gs a as> <e f g gs a as> <fs g gs a as> <f fs as>] r \addlyrics { _ _ 是 _ _ _ _ _ 一 _ _ _ _ _ 架 _ _ _ _ } \\
\staff "2" r4 r8 <g b cs e gs as c cs f fs g b>32[ <a as b a' as f' as> <a a' e'> <gs a a' ds e>] <gs a gs'>[ <ds b'> ds] r r8 <f g'>32[ <b c cs d b' c> <b as' b> <b as'> <b b''>] r <ds, gs> r | %2

\staff "1" \numericTimeSignature \time 4/4 <as''' cs d e f as>32[ <e' f fs as> <d, fs d' ds e f fs a as b> <cs d f b cs d ds f fs g gs a as> <cs d fs b cs ds f fs g gs a as> <d fs c' cs d f gs a as b> <c' d ds e f fs g gs a as> <ds f fs g gs>] <as f' fs>[ <ds e f fs g gs a> <c ds e f fs g gs a as> <ds, cs' d ds e f fs g gs a as> <ds g as c cs gs' as> <fs gs a b a' as b> <c cs d ds e f fs g gs a as b cs f> <cs d ds as' b c cs d ds e f fs g>] <gs' a as fs' g gs c>[ <d a' as b a' as b> <c b' c cs d ds e f fs g gs a as> <cs' d ds e f fs gs a>] r16 <cs, d ds f gs a as b c cs d ds e f fs g>32[ <cs d fs b fs' g gs a as b c>] <d a' d g a as>[ <ds g as fs' a> <e gs as> <c gs' b>] r <c cs>[ <ds' f> <cs d ds f fs>] \addlyrics { _ _ _ _ _ _ 智 _ _ _ _ _ 慧 _ _ _ _ _ _ 钢 _ _ _ _ _ 琴。 _ _ _ } \\
\staff "2" g'32[ <gs f'> <cs, d ds e' a> <cs d gs' a b> <gs'' a> <fs, as'> <b, f' as'>] r r16 <fs' g>32[ <cs e as'> <d ds e as'> <b cs a''> <a g'' a b> <f'' gs>] <fs, e' gs as>[ <cs d ds a' cs gs'> <b b' c g'> <gs as'> <ds gs>] r <e'' f fs b>[ <d, ds fs' gs a as>] <a'' as>[ <ds,, as''> <e b''> <f fs g b'>] r <c,,, b'''>[ <ds'' gs>] r | %3

\staff "1" \numericTimeSignature \time 4/4 <d''' e f fs>32[ <ds e f fs a> <cs d ds f fs a> <d ds e f fs g as> <cs d ds e f fs g as> <f fs g as> <e f a as> <ds e f as>] <d ds>[ <d, cs' d> c' <c cs>] r8 r4 r8 r16 r32 <g a c cs d ds e f> \addlyrics { _ _ _ _ _ _ _ _ _ _ _ _ _ } \\
\staff "2" r8 <e, f b>32[ <ds gs a b gs' a as> <gs gs' a> <gs a a' e'>] <ds b' as' as'>[ <b' f'' b> fs'' <cs, e>] r8 r2 | %4

\staff "1" \numericTimeSignature \time 4/4 <g''' gs as b c cs d ds e f a as>32[ <cs, g' a as b c cs d ds e f fs a as> <a' c d ds e f fs gs a as> <cs d e as> <cs d ds f fs> f] r16 r4 r16 <a as>32[ <fs a as> <b, cs d ds e f fs g gs a as> <cs, g' gs as c cs d ds e g gs a> <c ds fs g a as d fs gs a> <d ds f fs>] <b' fs' gs>[ <gs a gs'> <a as b c cs d ds e f fs a as> <gs c cs d ds e f fs g a> <gs c cs d ds e f fs g> <as b cs d ds e f fs g a as> <c, ds e f fs g a as g' gs a as> <c ds>] \addlyrics { _ _ _ _ _ 有 _ _ _ _ _ _ _ 什 _ _ _ 么 _ _ } \\
\staff "2" gs''32[ gs a] r r8 r4 r16 fs,32[ <g gs> <gs, cs d ds f a> <c c' g'> <b b' fs' g b> <b as' fs' b>] as'[ <ds,, gs>] r16 r32 <f fs'>[ <f gs b c cs d e f as b cs g'> <gs'' b>] | %5

\staff "1" \numericTimeSignature \time 4/4 c''32[ <cs d f> <d ds fs g gs a as g' a as b c> <c b' gs' as>] r <e g>[ <c ds fs g a as cs> <cs d f f' gs c>] <cs d cs' fs g gs> r r16 r32 <c cs d f fs as' b c>[ <cs ds f a> <c ds e as cs>] <g' as cs>[ <ds gs b d> <d ds a' b c d>] r <c a' cs d ds a' as>[ <gs' as c cs d ds e f fs g gs a as> <a as b c cs d e f fs g gs a as> <ds, a' d ds e f fs g gs a as b>] <g f'>[ <d g f'> <cs fs a as e'> <c a' c>] r <gs'' as b>[ <g gs a>] r \addlyrics { _ 能 _ _ _ _ _ 帮 _ _ _ _ 助 _ _ _ _ _ _ 您 _ _ _ _ } \\
\staff "2" r16 <ds e fs g gs a f' as b>32[ e] r <e as f'>[ <d ds as''> <d ds fs g a' as>] <a c cs a''>[ a'' <f, fs> <gs, gs'>] r <f' fs g gs fs' g a>[ <fs fs'>] r g[ <g g'> <gs a as>] r r16 r32 <g gs a as> g[ <fs g'> <f b fs'> <e b''> <cs ds as''> <cs d a''> <b c g'' a> <b as' f' fs>] | %6

\staff "1" \numericTimeSignature \time 4/4 fs'''32[ <d e> e, <cs d e b' c cs d ds e f fs g a as> <fs gs as b cs d as'> <c ds f a as gs' a as>] r16 <cs d ds e f g gs>32[ <c cs ds e f fs g gs a as ds e fs gs c> <cs as' b c d e fs gs> <a' as> <a as>] r r16 r2 \addlyrics { 的 _ _ _ _ _ 吗？ _ _ _ _ } \\
\staff "2" <g' a as>32[ <ds, f g gs a> ds <f g gs g' b cs d ds e f gs> <gs a b a' as d ds e> <ds f gs> ds <b' as''>] <c d b' f' fs as b>[ <cs g''>] r16 r8 r2 | %7
```

[[钢琴作品中有很多以华丽的高音声部伴奏为特色，特别是李斯特的作品。这里可举两三个著名作品为例。
还有一些以不同的和声效果制造特定声音意象，如chopin op9 no1中的远方回声，再如野蜂飞舞，再如一些水的意象的片段，可举德彪西的作品。]]

[[现在我们想探讨一个问题，如果作为通用声音拟合器，包括人类语音，在不限制演奏可行性的情况下，钢琴这种乐器能做到什么程度。]]

[[核心发现：
- 时间轴的密集表示可有效提升语音音频的可识别程度
- 但密集表示应用到器乐音乐时会出现白噪声问题，自适应音符时值长度恢复了器乐作品的音乐性，且提升了信息压缩程度
- 自适应音符时值长度方法降低了其中歌词的可识别度，同时带来一种高频风铃音的杂音现象。
  采用分音区网格可兼顾音乐性和人声]]

[[引用 images/general-piano/ 中的midi文件素材，分类演示拟合效果。]]

---

[[这一章节给出更多拟合算法的技术细节。可引用形式化表示，但注意仍要以自然易懂的语言来叙述，避免艰涩的学术风格。
注意仅保留 general-piano-settings.md 中的最终方法，曾用方法和探索过程可省略或简略叙述。]]
