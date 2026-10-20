---
title: 钢琴，作为通用声音拟合器
tags:
- essay
- piano
- midi
- audio
- 中文
---

<figure>
  <picture>
    {% midi /images/general-piano/hi-en.mid "Hi, I'm a smart piano." width=480 inline %}
    {% midi /images/general-piano/hi-zh.mid "你好，我是一架智慧钢琴。" width=480 inline %}
  </picture>
  <figcaption>
    如果钢琴会说话，听起来什么样？
  <figcaption>
</figure>


钢琴作品中有很多以华丽绵密的伴奏声部为特色。李斯特的很多作品中，右手常在高音区铺出一整片珍珠般的音流用作装饰而非旋律。肖邦夜曲 Op.9 No.1 中间段落的结尾，变换了和声音色的反复段落，制造出幽谷回声般的空间感。德彪西《水中倒影》和《欢乐岛》用绵密的琶音把键盘变成了水面。而里姆斯基-科萨科夫的《野蜂飞舞》则让钢琴模拟出昆虫振翅的嗡鸣。

这些作曲家都在做同一件事：把钢琴当作通用音色画布。他们并不满足于“钢琴只弹钢琴该弹的东西”。

这让我想到一个更极端的问题。如果不考虑演奏可行性——不管手指够不够、踏板忙不忙得过来——纯粹从声音合成的角度看，一架固定音色的三角钢琴，作为**通用声音拟合器**极限能做到什么程度？

我的核心发现可以概括为三点。

<!-- more -->

1. 时间轴上的密集表示，是语音可辨识度的关键。

   把输入语音切成每 20 ms 一个的短音符，在 88 个琴键上联合优化激活强度，语音识别器（Whisper）居然能从钢琴渲染出的“叮叮咚咚”里读出中文诗。五段诗词的平均字错误率（CER）从早期稀疏路线的 100% 降到了 68%。这说明钢琴声音里确实可以保留足够的语音线索。

2. 密集表示用在器乐上会变成灾难。

   当成千上万个短音符砸向一首流行歌时，听感不是音乐，而是白噪声般的密集敲击。给音符赋予自适应时值——低音铺长音、中高音用中等长度——器乐的音乐性立即回归。《画心》的音符数从 2706 个骤降到 473 个，频谱误差反而基本维持。

3. 长时值会牺牲语音细节，并带来“风铃感”杂音。

   当音符变长，歌词的可识别度随之下降；同时，过多的高音谐波叠加产生一种类似风铃的泛音杂响。最终采用分音区时间网格：低音区继续用长音支撑结构，高音区回到 10 ms 级别的短音刻画快速变化，在两者之间取得平衡。

下面按类别展示一些拟合结果。所有 MIDI 都由同一套固定音色（FluidSynth Grand Piano, bank 0 / program 0）渲染，可以直接点击试听。

**语音**

<figure>
  {% midi /images/general-piano/quiet-night.mid "静夜思" width=480 inline %}
  {% midi /images/general-piano/spring-dawn.mid "春晓" width=480 inline %}
  {% midi /images/general-piano/明月几时有.mid "明月几时有" width=800 inline %}
</figure>

**铃声与音效**

<figure>
  {% midi /images/general-piano/wechat.mid "WeChat" width=480 inline %}
  {% midi /images/general-piano/iphone.mid "iPhone" width=480 inline %}
</figure>

**电子游戏**

<figure>
  {% midi /images/general-piano/90坦克.mid "90坦克" width=480 inline %}
  {% midi /images/general-piano/魂斗罗.mid "魂斗罗" width=480 inline %}
  {% midi /images/general-piano/炸弹人.mid "炸弹人" width=480 inline %}
  {% midi /images/general-piano/超级玛莉-pass.mid "超级玛莉" width=480 inline %}
  {% midi /images/general-piano/彩虹岛.mid "彩虹岛" width=480 inline %}
  {% midi /images/general-piano/功夫.mid "功夫" width=480 inline %}
</figure>

**器乐与歌曲**

<figure>
  {% midi /images/general-piano/琵琶语.mid "琵琶语" width=480 inline %}
  {% midi /images/general-piano/欢沁.mid "欢沁" width=480 inline %}
  {% midi /images/general-piano/琴伤.mid "琴伤" width=480 inline %}
  {% midi /images/general-piano/半岛铁盒.mid "半岛铁盒" width=480 inline %}
  {% midi /images/general-piano/暗香.mid "暗香" width=480 inline %}
  {% midi /images/general-piano/传奇.mid "传奇" width=480 inline %}
</figure>

**影视与动漫**

<figure>
  {% midi /images/general-piano/圣女之歌.mid "圣女之歌" width=480 inline %}
  {% midi /images/general-piano/序曲_天地孤影任我行.mid "天地孤影任我行" width=480 inline %}
  {% midi /images/general-piano/鸟の诗.mid "鸟の诗" width=480 inline %}
  {% midi /images/general-piano/terminator.mid "Terminator" width=480 inline %}
  {% midi /images/general-piano/豪勇七蛟龙.mid "豪勇七蛟龙" width=480 inline %}
</figure>


## Demo

生成你的拟声MIDI: [🤗 Speaking MIDI](https://huggingface.co/spaces/k-l-lambda/speaking-midi)

## 五线谱转写

开头两段语音MIDI对应的五线谱。由于曲谱记谱缺少MIDI的逐音符力度，播放效果略差。

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

## 拟合算法

项目源代码：[k-l-lambda/speaking-midi](https://github.com/k-l-lambda/speaking-midi)

### 问题定义

给定一段目标音频 $y$，我们想找到一组 MIDI 事件 $\mathcal N$，让固定钢琴音色 $\mathcal R_\theta$ 的渲染结果尽可能逼近 $y$：

$$
\mathcal N^*=\arg\min_{\mathcal N\in\mathcal C}
D\bigl(y,\mathcal R_\theta(\mathcal N)\bigr).
$$

这里的约束 $\mathcal C$ 包括音高范围、力度范围，以及同音高按键不能重叠。它同时涉及离散变量、连续时间和未知音符数量，是一个**逆合成**问题。

### 声音表示的边界

我们不能直接在波形上叠加单音模板来评估，因为功率谱有交叉项：

$$
\left|\sum_i X_i\right|^2
=\sum_i|X_i|^2+2\operatorname{Re}\sum_{i<j}X_i\overline{X_j}.
$$

模板相加忽略了相位干涉，真实音源还有力度层和释放尾音。因此，优化目标只能建立在**近似频谱**上，最终质量必须以真实 MIDI 渲染为准。

### 分音区时间网格

最终采用的方案把时间轴和音高轴一起切分：

| 音区 | MIDI 音高 | 起音步长 | 可选按键时长 |
| --- | --- | --- | --- |
| 低音 | 21–59 | 40 ms | 80 / 240 / 640 ms |
| 中音 | 60–83 | 20 ms | 40 / 80 / 240 ms |
| 高音 | 84–108 | 10 ms | 10 / 20 / 40 ms |

所有音区共享同一套 2048 点 STFT 分析，但分别建立激活网格，再共同解释同一份 Mel 功率谱目标。优化变量是各网格上的非负激活 $A^{(r)}_{pdn}$：

$$
\hat M_{bt}=\sum_r\sum_{(p,d)\in r}\sum_n
A^{(r)}_{pdn}D^{(r)}_{pd,b,t+4-s_rn}.
$$

直观地说，低音用少量长事件托住持续结构，高音用密集短事件捕捉快速变化。优化器把它们当作一个联合拼图来解。

### 从连续激活到合法 MIDI

激活矩阵不能直接播放。实现时先对每个音高–时值组合做能量标定，把激活转换成整数力度；然后按得分排序，剔除同音高重叠事件，得到固定支持集 $Z$；最后只在 $Z$ 上重新优化 200 步，让剩余音符补偿被删去的能量。

这个“先筛选后重拟合”的步骤不能省略，否则删去冲突事件后，整体频谱平衡会被打破。

### 损失函数与高频控制

基础目标是对数功率谱的平方误差：

$$
L_{\mathrm{dense}}=
\frac1{BT}\sum_{b,t}
\left[\log\left(1+\frac{\hat M_{bt}}{\varepsilon}\right)
-\log\left(1+\frac{M_{bt}}{\varepsilon}\right)\right]^2.
$$

为了防止高音区产生过多“风铃”杂响，还可以启用保守型目标：对**超过原音频**的能量施加额外惩罚，尤其是高频带。不过实验表明，过强的高音成本会牺牲语音中的快速细节，因此它更像一个可选的音色调节旋钮，而非万能默认。

### 实验能告诉我们什么

- **语音**：密集或分音区表示都能让 ASR 识别出内容，说明钢琴声里确实可以编码可辨识的语音线索。但这不等于人耳一定能听懂——识别器有语言先验的加持。
- **器乐**：《画心》的音符数从密集短音符的 2706 个降到多时值的 473 个，对数谱 MAE 从 0.284 微降至 0.271。更少的长事件就足以保留音乐轮廓。
- **分音区**：《半岛铁盒》前 12 秒的 MAE 从 0.543 降到 0.493，代价是音符数从 1327 暴涨到 5023。细节是用密度换来的。

这些数字提醒我们：**没有免费的午餐**。想保留语音的颗粒度，就要承受密集敲击；想让器乐流畅，就要放弃一部分高频细节。钢琴作为拟合器，它的边界不在物理键盘，而在我们愿意接受的听觉妥协里。
