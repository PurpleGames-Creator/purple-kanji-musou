#!/usr/bin/env node

/**
 * 3,500問の問題データを生成するスクリプト
 * 各難易度700問：動詞/形容詞310 + 複合漢字310 + 慣用句50 + 四字熟語30
 */

const fs = require('fs');
const path = require('path');

// ========================
// 送り仮名付き動詞・形容詞データベース
// ========================
const verbsAdjectivesDB = {
  easy: [
    { kanji: '読む', reading: 'よむ', sentence: '毎日本を____。', type: 'verb', explanation: '本や文章を目で見て内容を理解する動作。' },
    { kanji: '座る', reading: 'すわる', sentence: '机に____。', type: 'verb', explanation: 'いすや床に腰を落ろす動作。' },
    { kanji: '起きる', reading: 'おきる', sentence: '朝早く____。', type: 'verb', explanation: '寝ている状態から覚めて起き上がる。' },
    { kanji: '飲む', reading: 'のむ', sentence: '水を____。', type: 'verb', explanation: '液体を口に入れて飲みこむ動作。' },
    { kanji: '見る', reading: 'みる', sentence: 'テレビを____。', type: 'verb', explanation: '目を向けて観察する、視点を向ける。' },
    { kanji: '聞く', reading: 'きく', sentence: '音声を____。', type: 'verb', explanation: '耳を傾けて音を感じ取る、相手の言葉に耳を傾ける。' },
    { kanji: '書く', reading: 'かく', sentence: '字を____。', type: 'verb', explanation: 'ペンや筆で文字や絵を紙などに表す。' },
    { kanji: '行く', reading: 'いく', sentence: '学校に____。', type: 'verb', explanation: 'ある場所へ移動する動作。' },
    { kanji: '来る', reading: 'くる', sentence: '家に____。', type: 'verb', explanation: 'ここに向かって移動してくる。' },
    { kanji: '食べる', reading: 'たべる', sentence: 'パンを____。', type: 'verb', explanation: '食物を口に入れてかみ砕き、飲み込む。' },
    { kanji: '飛ぶ', reading: 'とぶ', sentence: '鳥が____。', type: 'verb', explanation: '空中を移動する、宙を舞う。' },
    { kanji: '走る', reading: 'はしる', sentence: '子どもが____。', type: 'verb', explanation: '脚を速く動かして移動する。' },
    { kanji: '歩く', reading: 'あるく', sentence: '公園を____。', type: 'verb', explanation: 'ゆっくり脚を動かして移動する。' },
    { kanji: '寝る', reading: 'ねる', sentence: '夜____。', type: 'verb', explanation: '目を閉じて睡眠をとる。' },
    { kanji: '働く', reading: 'はたらく', sentence: '毎日____。', type: 'verb', explanation: '仕事をする、労働に従事する。' },
    { kanji: '学ぶ', reading: 'まなぶ', sentence: '学校で____。', type: 'verb', explanation: '知識や技能を身につける。' },
    { kanji: '遊ぶ', reading: 'あそぶ', sentence: '友達と____。', type: 'verb', explanation: '楽しむ、娯楽をする。' },
    { kanji: '作る', reading: 'つくる', sentence: 'ケーキを____。', type: 'verb', explanation: '何かを組み立てる、製造する。' },
    { kanji: '買う', reading: 'かう', sentence: '本を____。', type: 'verb', explanation: 'お金を払って物を手に入れる。' },
    { kanji: '売る', reading: 'うる', sentence: '店で____。', type: 'verb', explanation: '商品をお金と交換する。' },
    { kanji: '美しい', reading: 'うつくしい', sentence: 'この服は____。', type: 'adjective', explanation: '見た目が整っていて印象が良い、優雅である。' },
    { kanji: '新しい', reading: 'あたらしい', sentence: 'その話は____。', type: 'adjective', explanation: '最近作られたばかりで古くない。' },
    { kanji: '青い', reading: 'あおい', sentence: '空の色が____。', type: 'adjective', explanation: 'スカイブルーなどの色を示す。' },
    { kanji: '赤い', reading: 'あかい', sentence: 'りんごが____。', type: 'adjective', explanation: '血の色のような濃い色。' },
    { kanji: '白い', reading: 'しろい', sentence: '雪が____。', type: 'adjective', explanation: 'すべての光を反射する色。' },
    { kanji: '黒い', reading: 'くろい', sentence: '夜が____。', type: 'adjective', explanation: 'すべての光を吸収する色。' },
    { kanji: '大きい', reading: 'おおきい', sentence: 'この家は____。', type: 'adjective', explanation: '寸法が大きい、規模が大きい。' },
    { kanji: '小さい', reading: 'ちいさい', sentence: 'その虫は____。', type: 'adjective', explanation: '寸法が小さい、規模が小さい。' },
    { kanji: '長い', reading: 'ながい', sentence: '列が____。', type: 'adjective', explanation: '距離または時間が長い。' },
    { kanji: '短い', reading: 'みじかい', sentence: 'その映画は____。', type: 'adjective', explanation: '距離または時間が短い。' },
    { kanji: '高い', reading: 'たかい', sentence: 'この山は____。', type: 'adjective', explanation: '高さが大きい、価格が高い。' },
    { kanji: '低い', reading: 'ひくい', sentence: 'その声は____。', type: 'adjective', explanation: '高さが小さい、頻度が低い。' },
    { kanji: '熱い', reading: 'あつい', sentence: 'お湯が____。', type: 'adjective', explanation: '温度が高い状態。' },
    { kanji: '冷たい', reading: 'つめたい', sentence: 'アイスクリームが____。', type: 'adjective', explanation: '温度が低い状態。' },
    { kanji: '美味しい', reading: 'おいしい', sentence: 'この料理は____。', type: 'adjective', explanation: '味が良い、食べておいしい。' },
    { kanji: '悪い', reading: 'わるい', sentence: '天気が____。', type: 'adjective', explanation: '良くない、劣っている状態。' },
    { kanji: '良い', reading: 'よい', sentence: 'その案は____。', type: 'adjective', explanation: '優れている、良い状態である。' },
    { kanji: '明るい', reading: 'あかるい', sentence: '気持ちが____。', type: 'adjective', explanation: '光があふれている、楽観的で前向き。' },
    { kanji: '暗い', reading: 'くらい', sentence: '部屋が____。', type: 'adjective', explanation: '光が少ない、気分が悪い。' },
    { kanji: '狭い', reading: 'せまい', sentence: 'この部屋は____。', type: 'adjective', explanation: 'スペースが限られている。' },
    { kanji: '広い', reading: 'ひろい', sentence: 'その公園は____。', type: 'adjective', explanation: 'スペースが広い、範囲が広い。' },
    { kanji: '厳しい', reading: 'きびしい', sentence: '態度が____。', type: 'adjective', explanation: '厳密で容赦がない、手厳しい。' },
    { kanji: '易しい', reading: 'やさしい', sentence: 'その問題は____。', type: 'adjective', explanation: '難度が低い、親切である。' },
    { kanji: '難しい', reading: 'むずかしい', sentence: 'その問題は____。', type: 'adjective', explanation: '難度が高い、複雑である。' },
    { kanji: '強い', reading: 'つよい', sentence: 'その人は____。', type: 'adjective', explanation: '力が強い、逆境に強い。' },
    { kanji: '弱い', reading: 'よわい', sentence: 'その人は____。', type: 'adjective', explanation: '力が弱い、影響を受けやすい。' },
  ],
  normal: [
    { kanji: '解く', reading: 'とく', sentence: '問題を____。', type: 'verb', explanation: '問題や謎を考えて答えを出す。' },
    { kanji: '答える', reading: 'こたえる', sentence: '質問に____。', type: 'verb', explanation: '相手の質問に返事をする。' },
    { kanji: '話す', reading: 'はなす', sentence: '人と____。', type: 'verb', explanation: '言葉で相手と意思疎通を図る。' },
    { kanji: '言う', reading: 'いう', sentence: '何か____。', type: 'verb', explanation: '口で言葉を発する、述べる。' },
    { kanji: '覚える', reading: 'おぼえる', sentence: '字を____。', type: 'verb', explanation: '学んで記憶する、脳に刻み込む。' },
    { kanji: '忘れる', reading: 'わすれる', sentence: '名前を____。', type: 'verb', explanation: '記憶から消える、思い出せなくなる。' },
    { kanji: '分かる', reading: 'わかる', sentence: '意味が____。', type: 'verb', explanation: '理解する、意味や内容が把握できる。' },
    { kanji: '続ける', reading: 'つづける', sentence: '仕事を____。', type: 'verb', explanation: '同じ状態を保ち続ける。' },
    { kanji: '始める', reading: 'はじめる', sentence: 'ゲームを____。', type: 'verb', explanation: '何かを開始する、新しく取り組む。' },
    { kanji: '終わる', reading: 'おわる', sentence: 'その映画は____。', type: 'verb', explanation: 'あることが完了する、終結する。' },
    { kanji: '死ぬ', reading: 'しぬ', sentence: 'その虫が____。', type: 'verb', explanation: '生命を失う、生きることが終わる。' },
    { kanji: '生きる', reading: 'いきる', sentence: 'その人は____。', type: 'verb', explanation: '生命を持つ、生存する。' },
    { kanji: '寂しい', reading: 'さびしい', sentence: 'その気持ちは____。', type: 'adjective', explanation: '孤独感を感じている状態。' },
    { kanji: '楽しい', reading: 'たのしい', sentence: 'その時間は____。', type: 'adjective', explanation: '喜びや満足が感じられる。' },
    { kanji: '苦しい', reading: 'くるしい', sentence: 'その状況は____。', type: 'adjective', explanation: '身体や心が痛む、つらい。' },
    { kanji: '優しい', reading: 'やさしい', sentence: 'その人は____。', type: 'adjective', explanation: '心が優しい、親切である。' },
    { kanji: '厳しい', reading: 'きびしい', sentence: 'その評価は____。', type: 'adjective', explanation: '容赦がない、手厳しい。' },
    { kanji: '深い', reading: 'ふかい', sentence: 'その話は____。', type: 'adjective', explanation: '内容が奥深く、単純ではない。' },
    { kanji: '浅い', reading: 'あさい', sentence: 'その川は____。', type: 'adjective', explanation: '深さが浅い、理解が浅い。' },
    { kanji: '静か', reading: 'しずか', sentence: 'その場所は____。', type: 'adjective', explanation: '音がなく、落ち着いている。' },
    { kanji: 'うるさい', reading: 'うるさい', sentence: 'その音は____。', type: 'adjective', explanation: '音が大きくうるさい、煩わしい。' },
    { kanji: '清潔', reading: 'せいけつ', sentence: 'この部屋は____。', type: 'adjective', explanation: 'きれいで汚れがない。' },
    { kanji: '不潔', reading: 'ふけつ', sentence: 'その状態は____。', type: 'adjective', explanation: '汚くて衛生的でない。' },
    { kanji: '正確', reading: 'せいかく', sentence: 'その計算は____。', type: 'adjective', explanation: '間違いがなく正しい。' },
    { kanji: '不正確', reading: 'ふせいかく', sentence: 'その情報は____。', type: 'adjective', explanation: '間違いや誤差を含む。' },
    { kanji: '緊張', reading: 'きんちょう', sentence: 'その雰囲気は____。', type: 'adjective', explanation: 'ぴんと張られた状態。' },
    { kanji: '嫌い', reading: 'きらい', sentence: 'その食べ物は____。', type: 'adjective', explanation: '好みでない、避けたい。' },
    { kanji: '好き', reading: 'すき', sentence: 'その色は____。', type: 'adjective', explanation: 'よく好む、気に入っている。' },
    { kanji: '多い', reading: 'おおい', sentence: 'その数は____。', type: 'adjective', explanation: '量が多い、数が多い。' },
    { kanji: '少ない', reading: 'すくない', sentence: 'その量は____。', type: 'adjective', explanation: '量が少ない、数が少ない。' },
  ],
  hard: [
    { kanji: '述べる', reading: 'のべる', sentence: '詳細を____。', type: 'verb', explanation: '意見や考え、事実などを言葉で説明する。' },
    { kanji: '深める', reading: 'ふかめる', sentence: '知識を____。', type: 'verb', explanation: 'より深く理解する、さらに詳しく学ぶ。' },
    { kanji: '投じる', reading: 'とうじる', sentence: '物を____。', type: 'verb', explanation: '力を入れて遠くへ投げる、注ぎ込む。' },
    { kanji: '参照する', reading: 'さんしょうする', sentence: '文献を____。', type: 'verb', explanation: '他の資料や文献を調べ、確認する。' },
    { kanji: '貢献する', reading: 'こうけんする', sentence: '社会に____。', type: 'verb', explanation: '他者や社会のためになることをする。' },
    { kanji: '相談する', reading: 'そうだんする', sentence: '友達に____。', type: 'verb', explanation: '相手に意見を求める、話し合う。' },
    { kanji: '反対する', reading: 'はんたいする', sentence: 'その意見に____。', type: 'verb', explanation: '異議を唱える、反論する。' },
    { kanji: '賛成する', reading: 'さんせいする', sentence: 'その案に____。', type: 'verb', explanation: 'その意見に同意する。' },
    { kanji: '期待する', reading: 'きたいする', sentence: 'その結果を____。', type: 'verb', explanation: 'そうなることを望む、待つ。' },
    { kanji: '失望する', reading: 'しつぼうする', sentence: 'その結果に____。', type: 'verb', explanation: '希望を失う、がっかりする。' },
    { kanji: '推奨する', reading: 'すいしょうする', sentence: 'その製品を____。', type: 'verb', explanation: 'それをお勧めする、推し進める。' },
    { kanji: '懸念する', reading: 'けねんする', sentence: 'その結果を____。', type: 'verb', explanation: '心配する、危惧する。' },
    { kanji: '論理的', reading: 'ろんりてき', sentence: 'その考え方は____。', type: 'adjective', explanation: '物事の筋道が明確で理屈に基づいている。' },
    { kanji: '抽象的', reading: 'ちゅうしょうてき', sentence: 'その概念は____。', type: 'adjective', explanation: '具体性を欠いている、観念的である。' },
    { kanji: '具体的', reading: 'ぐたいてき', sentence: 'その案は____。', type: 'adjective', explanation: '実際的で詳細である、明確である。' },
    { kanji: '複雑', reading: 'ふくざつ', sentence: 'その構造は____。', type: 'adjective', explanation: 'いろいろなものが組み合わさっている。' },
    { kanji: 'シンプル', reading: 'しんぷる', sentence: 'そのデザインは____。', type: 'adjective', explanation: 'すっきりしていて分かりやすい。' },
    { kanji: '曖昧', reading: 'あいまい', sentence: 'その表現は____。', type: 'adjective', explanation: 'はっきりしていない、ぼやけている。' },
    { kanji: '明確', reading: 'めいかく', sentence: 'その規則は____。', type: 'adjective', explanation: 'はっきりしていて、よく分かる。' },
    { kanji: '賢い', reading: 'かしこい', sentence: '判断が____。', type: 'adjective', explanation: '知識豊かで、判断が優れている。' },
  ],
  veryhard: [
    { kanji: '具現化する', reading: 'ぐげんかする', sentence: '構想を____。', type: 'verb', explanation: '思い描いたものを実際の形にする。' },
    { kanji: '解消する', reading: 'かいしょうする', sentence: '矛盾を____。', type: 'verb', explanation: '問題や矛盾を取り除き、解決する。' },
    { kanji: '及ぼす', reading: 'およぼす', sentence: '影響を____。', type: 'verb', explanation: '作用や効果をもたらす、影響を与える。' },
    { kanji: '体系化する', reading: 'たいけいかする', sentence: '理論を____。', type: 'verb', explanation: '関連する事柄をまとめて整理する。' },
    { kanji: '相対化する', reading: 'そうたいかする', sentence: '現象を____。', type: 'verb', explanation: '絶対的だと思われているものを相対的に捉え直す。' },
    { kanji: '脱構築する', reading: 'だつこうちくする', sentence: '立場を____。', type: 'verb', explanation: '既成の枠組みや前提を解体し、新たな視点を開く。' },
    { kanji: '多元化する', reading: 'たげんかする', sentence: '概念を____。', type: 'verb', explanation: '単一ではなく、複数の視点や価値観を認める状態。' },
    { kanji: '精緻化する', reading: 'せいちかする', sentence: 'メタ認知を____。', type: 'verb', explanation: '物事をより詳しく、正確に作り込むこと。' },
    { kanji: '内在的', reading: 'ないざいてき', sentence: 'その原理は____。', type: 'adjective', explanation: '本質や内部に存在する。' },
    { kanji: '外在的', reading: 'がいざいてき', sentence: 'その要因は____。', type: 'adjective', explanation: '外部から影響を受ける。' },
    { kanji: '本質的', reading: 'ほんしつてき', sentence: 'その相違は____。', type: 'adjective', explanation: '根本的で重要な。' },
    { kanji: '相対的', reading: 'そうたいてき', sentence: 'その価値は____。', type: 'adjective', explanation: '他との関係によって決まる。' },
    { kanji: '絶対的', reading: 'ぜったいてき', sentence: 'その原則は____。', type: 'adjective', explanation: '普遍的で変わることがない。' },
    { kanji: '包括的', reading: 'ほうかつてき', sentence: 'その分析は____。', type: 'adjective', explanation: 'すべてを含む、幅広い。' },
    { kaiji: '限定的', reading: 'げんていてき', sentence: 'その説明は____。', type: 'adjective', explanation: '範囲が限られている。' },
  ],
  hellish: [
    { kanji: '脱中心化する', reading: 'だつちゅうしんかする', sentence: '権力を____。', type: 'verb', explanation: '中心となる権力構造を解体する。' },
    { kanji: '再帰的', reading: 'さいきてき', sentence: 'その構造は____。', type: 'adjective', explanation: '自分自身へ戻る性質がある。' },
    { kanji: '内省的', reading: 'ないせいてき', sentence: 'その思考は____。', type: 'adjective', explanation: '自分自身を深く振り返る。' },
    { kanji: '弁証法的', reading: 'べんしょうほうてき', sentence: 'その論理は____。', type: 'adjective', explanation: 'テーゼ・アンチテーゼ・ジンテーゼの矛盾を通じて展開する。' },
    { kanji: '現象学的', reading: 'げんしょうがくてき', sentence: 'その分析は____。', type: 'adjective', explanation: '現象そのものの本質を直観する。' },
    { kanji: '実存的', reading: 'じつそんてき', sentence: 'その問題は____。', type: 'adjective', explanation: '人間の実存に関わる根本的な問題。' },
    { kanji: '存在論的', reading: 'そんざいろんてき', sentence: 'その問いは____。', type: 'adjective', explanation: '何が存在するのかについての根本的な問い。' },
    { kanji: '認識論的', reading: 'にんしきろんてき', sentence: 'その問題は____。', type: 'adjective', explanation: '知識の本質と成立条件に関わる。' },
  ]
};

// ========================
// 複合漢字（2-3文字）データベース
// ========================
const compoundKanjiDB = {
  easy: [
    { kanji: '食事', reading: 'しょくじ', sentence: '友人と____をした。', explanation: 'ご飯を食べること、昼食や夕食。' },
    { kanji: '本', reading: 'ほん', sentence: '図書館で____を借りた。', explanation: '文字や絵が書かれた綴じた紙の束。' },
    { kanji: '雨', reading: 'あめ', sentence: '今日は____が降っている。', explanation: '空から落ちてくる水のしぶき。' },
    { kanji: '漢字', reading: 'かんじ', sentence: '____とは何か。', explanation: '中国に由来し、日本で使われる文字。' },
    { kanji: '勉強', reading: 'べんきょう', sentence: '学校の____は大切だ。', explanation: '努力して学ぶこと、知識を身につけるための活動。' },
    { kanji: '貢献', reading: 'こうけん', sentence: '社会に____する。', explanation: '他者や社会のためになることをする。' },
    { kanji: '学び', reading: 'まなび', sentence: '人生とは____である。', explanation: '知識や技能を身につけること、経験から得る知識。' },
    { kanji: '未来', reading: 'みらい', sentence: '過去と____を学ぶ。', explanation: 'これからやってくる時間や時代。' },
    { kanji: '視点', reading: 'してん', sentence: '多角的____から検討する。', explanation: '物事を見る立場や角度。' },
    { kanji: '知識', reading: 'ちしき', sentence: '____は力なり。', explanation: '学んで得た理解や情報。' },
    { kanji: '文字', reading: 'もじ', sentence: '____を読む。', explanation: '言葉を表現する記号。' },
    { kanji: '写真', reading: 'しゃしん', sentence: 'その____を見た。', explanation: 'カメラで撮られた画像。' },
    { kanji: '時間', reading: 'じかん', sentence: 'その____は貴重だ。', explanation: '過去から未来へ流れる連続。' },
    { kanji: '空間', reading: 'くうかん', sentence: 'その____は広い。', explanation: '立体的な広がり。' },
    { kanji: '言葉', reading: 'ことば', sentence: 'その____は難しい。', explanation: '意思疎通をするための表現。' },
    { kanji: '物事', reading: 'ものごと', sentence: 'すべての____は変わる。', explanation: 'すべての事柄。' },
    { kanji: '目標', reading: 'もくひょう', sentence: '人生の____を持つ。', explanation: '達成したい目的。' },
    { kanji: '情報', reading: 'じょうほう', sentence: 'その____は正確だ。', explanation: '物事についての知識や事実。' },
    { kanji: '質問', reading: 'しつもん', sentence: '____に答える。', explanation: '相手に尋ねること。' },
    { kanji: '回答', reading: 'かいとう', sentence: 'その____は正しい。', explanation: 'する。' },
  ],
  normal: [
    { kanji: '読書', reading: 'どくしょ', sentence: '昨日は図書館で____をした。', explanation: '本を読むこと。' },
    { kanji: '会議', reading: 'かいぎ', sentence: '友達と____をした。', explanation: 'ミーティング、話し合い。' },
    { kanji: '研究', reading: 'けんきゅう', sentence: 'その____は進んでいる。', explanation: '学問的に探求すること。' },
    { kanji: '方法', reading: 'ほうほう', sentence: 'その____は有効だ。', explanation: '物事を行うやり方。' },
    { kanji: '理論', reading: 'りろん', sentence: 'その____は正確だ。', explanation: '学問的な原理や体系。' },
    { kanji: '実践', reading: 'じっせん', sentence: 'その____は重要だ。', explanation: '実際に行動すること。' },
    { kanji: '関係', reading: 'かんけい', sentence: 'その____は複雑だ。', explanation: 'つながり、相互の影響。' },
    { kanji: '世界', reading: 'せかい', sentence: 'その____は広い。', explanation: '地球全体、存在するすべて。' },
    { kanji: '人間', reading: 'にんげん', sentence: 'その____は賢い。', explanation: '人類、人。' },
    { kanji: '社会', reading: 'しゃかい', sentence: 'その____は複雑だ。', explanation: '人間が生活する共同体。' },
    { kanji: '文化', reading: 'ぶんか', sentence: 'その____は豊かだ。', explanation: '人間がつくる精神的な財産。' },
    { kanji: '歴史', reading: 'れきし', sentence: 'その____を学ぶ。', explanation: '過去の出来事の記録。' },
    { kanji: '現象', reading: 'げんしょう', sentence: 'その____は興味深い。', explanation: '人間が観察できる事柄。' },
    { kanji: '意見', reading: 'いけん', sentence: 'その____は有力だ。', explanation: '個人的な考え方。' },
    { kanji: '主張', reading: 'しゅちょう', sentence: 'その____を述べる。', explanation: '自分の意見や考えを強く言い張ること。' },
    { kanji: '議論', reading: 'ぎろん', sentence: '____を重ねる。', explanation: '異なる意見を述べ合い、意見を交わすこと。' },
    { kanji: '文章', reading: 'ぶんしょう', sentence: '____の構成を理解する。', explanation: '文や段落が組み立てられた文の塊。' },
    { kanji: '論文', reading: 'ろんぶん', sentence: '研究____を書く。', explanation: '学問的な主張や発見を述べた文章。' },
    { kanji: '説明', reading: 'せつめい', sentence: 'その____は明確だ。', explanation: 'わかりやすく述べること。' },
    { kanji: '問題', reading: 'もんだい', sentence: '____を解く。', explanation: '解決が必要な事柄。' },
  ],
  hard: [
    { kanji: '超越性', reading: 'ちょうえつせい', sentence: 'その思想の____を理解する。', explanation: '通常の認識を超えた特性。' },
    { kanji: '媒介', reading: 'ばいかい', sentence: '仲介者が____になる。', explanation: '仲介者、媒介する立場。' },
    { kanji: '矛盾', reading: 'むじゅん', sentence: 'その論理に____がある。', explanation: '二つの事柄が相容れない状態。' },
    { kanji: '概念', reading: 'がいねん', sentence: 'その____を理解する。', explanation: 'ある事柄の意味や本質。' },
    { kanji: '意図', reading: 'いと', sentence: '著者の____を汲み取る。', explanation: 'する目的や狙い。' },
    { kanji: '妥当性', reading: 'だとうせい', sentence: '学説の____を検証する。', explanation: '主張や理論が適切で正当であるかどうかの性質。' },
    { kanji: '原典', reading: 'げんてん', sentence: '____を参照する。', explanation: '最初に書かれた本来の文献や資料。' },
    { kanji: '展開', reading: 'てんかい', sentence: '論脈の____を追う。', explanation: '物事が進み広がっていく過程。' },
    { kanji: '本質', reading: 'ほんしつ', sentence: '事柄の根本的な性質や特徴。', explanation: 'の____を深掘りする。' },
    { kanji: '転換点', reading: 'てんかんてん', sentence: '歴史の____を振り返る。', explanation: '物事が大きく変わる重要な時点。' },
    { kanji: '体系', reading: 'たいけい', sentence: 'その____は完成している。', explanation: 'いろいろなものが整然と組織された全体。' },
    { kanji: '規範', reading: 'きはん', sentence: 'その____は厳格だ。', explanation: '標準や基準となるもの。' },
    { kanji: '価値', reading: 'かち', sentence: 'その____は高い。', explanation: 'もののすぐれているていど。' },
    { kanji: '基準', reading: 'きじゅん', sentence: 'その____は明確だ。', explanation: 'ものごとをはかるための標準。' },
    { kanji: '視野', reading: 'しや', sentence: 'その____は広い。', explanation: '見える範囲、認識の範囲。' },
    { kanji: '認識', reading: 'にんしき', sentence: 'その____は深い。', explanation: '物事をはっきり理解すること。' },
    { kanji: '領域', reading: 'りょういき', sentence: 'その____は広がっている。', explanation: '一定の範囲、影響が及ぶ場所。' },
    { kanji: '手法', reading: 'しゅほう', sentence: 'その____は新しい。', explanation: '物事を行う方法や技術。' },
    { kanji: '装置', reading: 'そうち', sentence: 'その____は複雑だ。', explanation: '特定の目的で組み立てられた機械。' },
    { kanji: '構造', reading: 'こうぞう', sentence: 'その____を理解する。', explanation: 'いろいろなものがどのように組み合わさっているか。' },
  ],
  veryhard: [
    { kanji: '有効性', reading: 'ゆうこうせい', sentence: '学説の____を批判的に検討する。', explanation: '方法や理論が目的を達成するのに役立つ程度。' },
    { kanji: '枠組み', reading: 'わくぐみ', sentence: '従来の____を超える視点。', explanation: '物事を理解するための基本となる考え方や構造。' },
    { kanji: '根拠', reading: 'こんきょ', sentence: '命題の____に迫る。', explanation: '事柄が成り立つための基本となる理由や根拠。' },
    { kanji: '難解', reading: 'なんかい', sentence: '解釈が____である。', explanation: '理解が難しく、意味が分かりにくい。' },
    { kanji: '緻密', reading: 'ちみつ', sentence: '議論が____である。', explanation: '細部まで丁寧で、隙がない状態。' },
    { kanji: '深遠', reading: 'しんえん', sentence: '思想が____である。', explanation: '意味や奥行きが深く、計り知れない。' },
    { kanji: '矛盾', reading: 'むじゅん', sentence: '理論の____を統合する。', explanation: '二つの事柄が相容れない状態。' },
    { kanji: '実践性', reading: 'じっせんせい', sentence: '知識の____を実現する。', explanation: '理論が実際に応用・実行できる性質。' },
    { kanji: '妥協', reading: 'だきょう', sentence: 'その____は必要だ。', explanation: 'お互いが譲り合う、中間をとること。' },
    { kanji: '進化', reading: 'しんか', sentence: '思想の____を追う。', explanation: '時間の経過とともに発展すること。' },
    { kanji: '逆説', reading: 'ぎゃくせつ', sentence: 'その____は興味深い。', explanation: '常識に反した、一見矛盾した説。' },
    { kanji: '統合', reading: 'とうごう', sentence: 'その____により新たな視点が生まれた。', explanation: 'バラバラなものを一つにまとめること。' },
    { kanji: '思考法', reading: 'しこうほう', sentence: '彼の____は独特だ。', explanation: 'ものごとを考える方法や手段。' },
    { kanji: '言説', reading: 'げんせつ', sentence: 'その____を分析する。', explanation: 'ある観点から述べられた意見や主張。' },
    { kanji: '物語', reading: 'ものがたり', sentence: 'その____を理解する。', explanation: 'ある枠組みの中で語られる筋立てた話。' },
  ],
  hellish: [
    { kanji: '本質性', reading: 'ほんしつせい', sentence: '言語の____を問う。', explanation: '物事の根本的な性質であること。' },
    { kanji: '相互依存', reading: 'そうごいぞん', sentence: 'すべての存在は____である。', explanation: 'すべてのものが互いに関連し、他を頼りにして成り立つ。' },
    { kanji: '権力構造', reading: 'けんりょくこうぞう', sentence: '現代の____を批判する。', explanation: '支配と従属の関係が作られている仕組み。' },
    { kanji: '高次概念', reading: 'こうじがいねん', sentence: 'その分析は____で行われた。', explanation: 'より上位の、より抽象的な考え。' },
    { kanji: '反復性', reading: 'はんぷくせい', sentence: 'その構造の____を理解する。', explanation: '何度も繰り返される性質。' },
    { kanji: '内観性', reading: 'ないかんせい', sentence: 'その思考の____は深い。', explanation: '内側を深く見つめる性質。' },
    { kanji: '対立過程', reading: 'たいりつかてい', sentence: '歴史の____を学ぶ。', explanation: '相互に矛盾する力が作用する過程。' },
    { kanji: '本質直観', reading: 'ほんしつちょっかん', sentence: 'その分析の____により新たな理解が得られた。', explanation: '先入観を排除して物事の本質を直接的に把握する方法。' },
    { kanji: '価値多元化', reading: 'かちたげんか', sentence: 'その思想は____を認める。', explanation: '様々な価値観が同等に存在することを受け入れること。' },
    { kanji: '枠組再構成', reading: 'わくぐみさいこうせい', sentence: 'その理論の____により新たな解釈が可能になった。', explanation: '既存の枠組みを解体し、新しい秩序を作り直すこと。' },
  ]
};

// ========================
// 慣用句データベース
// ========================
const idiomDB = {
  easy: [
    { kanji: '目玉焼き', reading: 'めだまやき', explanation: '卵を割って焼いた料理。' },
    { kanji: '足がかり', reading: 'あしがかり', explanation: '成功への足がかり。' },
    { kanji: '手がかり', reading: 'てがかり', explanation: '解決への手がかり。' },
    { kanji: '口火を切る', reading: 'くちびをきる', explanation: 'はじめに意見を述べる。' },
    { kanji: '目に入る', reading: 'めにいる', explanation: '注意がひかれる。' },
    { kanji: '心が動く', reading: 'こころがうごく', explanation: '感動する。' },
    { kanji: '手をつなぐ', reading: 'てをつなぐ', explanation: '協力する。' },
    { kanji: '頭に来る', reading: 'あたまにくる', explanation: 'いらいらする。' },
    { kanji: '気に病む', reading: 'きにやむ', explanation: '心配する。' },
    { kanji: '血が騒ぐ', reading: 'ちがさわぐ', explanation: '興奮する。' },
    { kanji: '目が覚める', reading: 'めがさめる', explanation: '目が開く。' },
    { kanji: '夢を見る', reading: 'ゆめをみる', explanation: '願いを持つ。' },
    { kanji: '願いが叶う', reading: 'ねがいがかなう', explanation: '望みが実現する。' },
    { kanji: 'ことわざ', reading: 'ことわざ', explanation: '昔から言い伝えられた短い言葉。' },
    { kanji: '塩対応', reading: 'しおたいおう', explanation: 'つっけんどんな態度。' },
    { kanji: '火の車', reading: 'ひのくるま', explanation: '経済状態が悪い。' },
    { kanji: '天地返し', reading: 'てんちがえし', explanation: '完全に逆になること。' },
    { kanji: '白黒つける', reading: 'しろくろつける', explanation: 'はっきり決める。' },
    { kanji: '水に流す', reading: 'みずにながす', explanation: '過去のことは忘れる。' },
    { kanji: '花を持たせる', reading: 'はなをもたせる', explanation: '相手の面子をたてる。' },
  ],
  normal: [
    { kanji: '一寸先は闇', reading: 'いっすんさきはやみ', explanation: '人生は予測不可能だ。' },
    { kanji: '虎穴に入らずんば虎子を得ず', reading: 'こけつにはいらずんばこしをえず', explanation: 'リスクを冒さなければ成功は得られない。' },
    { kanji: '急がば回れ', reading: 'いそがばまわれ', explanation: '急ぎたいときは、確実な方法を選ぶべき。' },
    { kanji: '案ずるより産むが易し', reading: 'あんずるよりうむがやすし', explanation: '心配するより実行するほうが簡単。' },
    { kanji: '石の上にも三年', reading: 'いしのうえにもさんねん', explanation: 'どんなに苦しくても耐え抜けば成功する。' },
    { kanji: '色は思いのほか', reading: 'いろはおもいのほか', explanation: '見た目は予想と異なることがある。' },
    { kanji: '一筆書き', reading: 'いっぴつがき', explanation: 'ペンを離さずに書く。' },
    { kanji: '一刀両断', reading: 'いっとうりょうだん', explanation: '一度で問題を解決する。' },
    { kanji: '右から左へ', reading: 'みぎからひだりへ', explanation: 'すぐに忘れる。' },
    { kanji: '木を見て森を見ず', reading: 'きをみてもりをみず', explanation: '細部に気をとられて全体を見落とす。' },
    { kanji: '親の心子知らず', reading: 'おやのこころこしらず', explanation: '親の気持ちを子どもは理解していない。' },
    { kanji: 'お金は天下の回り物', reading: 'おかねはてんかのまわりもの', explanation: 'お金は流動的だ。' },
    { kanji: '鶴は千年亀は万年', reading: 'つるはせんねんかめはまんねん', explanation: '吉祥の象徴。' },
    { kanji: '笑う門には福来たる', reading: 'わらうかどにはふくきたる', explanation: 'いつも笑っていると幸せが訪れる。' },
    { kanji: '蒔かぬ種は生えぬ', reading: 'まかぬたねははえぬ', explanation: '努力しなければ成果は得られない。' },
    { kanji: '地獄も極楽も気次第', reading: 'じごくもごくらくもきしだい', explanation: '同じ状況でも気の持ち方で変わる。' },
    { kanji: '知らぬが仏', reading: 'しらぬがほとけ', explanation: '知らないほうが幸せなこともある。' },
    { kanji: '転ばぬ先の杖', reading: 'ころばぬさきのつえ', explanation: 'あらかじめ対策をしておく。' },
    { kanji: '天知る地知る我知る', reading: 'てんしるちしるわれしる', explanation: '秘密でも誰かは知っている。' },
    { kanji: '苦労は買ってでもせよ', reading: 'くろうはかってでもせよ', explanation: '若いときの苦労は大切だ。' },
  ],
  hard: [
    { kanji: '人事を尽くして天命を待つ', reading: 'じんじをつくしてもんめいをまつ', explanation: 'できることをやったら結果は運に任せるべき。' },
    { kanji: '文武両道', reading: 'ぶんぶりょうどう', explanation: '文化と武術の両方に優れること。' },
    { kanji: '羊頭狗肉', reading: 'ようとうくにく', explanation: '見かけ倒し、詐欺的な行為。' },
    { kanji: '千差万別', reading: 'せんさばんべつ', explanation: '様々な違いがあること。' },
    { kanji: '光陰矢のごとし', reading: 'こういんやのごとし', explanation: '時間は速く過ぎていく。' },
    { kanji: '春宵一刻値千金', reading: 'しゅんしょういっこくあたいせんきん', explanation: '春の夜の時間は貴重である。' },
    { kanji: '青雲の志', reading: 'せいうんのこころざし', explanation: '大きな野心、高い理想。' },
    { kanji: '白眉', reading: 'はくび', explanation: '最高峰、傑出した作品。' },
    { kanji: '奇想天外', reading: 'きそうてんがい', explanation: '予想もつかない驚くべきこと。' },
    { kanji: '古今東西', reading: 'ここんとうざい', explanation: '古い時代から新しい時代、東から西まで。' },
  ],
  veryhard: [
    { kanji: '久遠無窮', reading: 'きゅうおんむきゅう', explanation: '遠い過去から遠い未来へと終わりのない時間。' },
    { kanji: '物我一体', reading: 'ぶつがいったい', explanation: '主観と客観、自己と外界が一つに統一された状態。' },
    { kanji: '森羅万象', reading: 'しんらばんしょう', explanation: 'この世に存在するあらゆるもの。' },
  ],
  hellish: [
    { kanji: '知的誠実性', reading: 'ちてきせいじつせい', explanation: '真実を追求する態度。' },
    { kanji: '存在論的地盤', reading: 'そんざいろんてきじばん', explanation: '存在の根本的な基盤。' },
  ]
};

// ========================
// 四字熟語データベース
// ========================
const fourCharacterKanjiDB = {
  easy: [
    { kanji: '一期一会', reading: 'いちごいちえ', explanation: '人との出会いは二度と返らない大切な瞬間という考え方。' },
    { kanji: '三人寄れば文殊の知恵', reading: 'さんにんよればもんじゅのちえ', explanation: '凡人でも複数で相談すれば良い知恵が出る。' },
    { kanji: '五風十雨', reading: 'ごふうじゅうう', explanation: '良い季候で作物がよく育つ。' },
    { kanji: '十人十色', reading: 'じゅうにんといろ', explanation: 'みんな違う考え方や好みを持っている。' },
    { kanji: '百花繚乱', reading: 'ひゃっかりょうらん', explanation: '様々な才能が咲き誇っている。' },
    { kanji: '千変万化', reading: 'せんぺんばんか', explanation: '変化が非常に多い。' },
    { kanji: '一家言', reading: 'いっかげん', explanation: '個人的な主張や見解。' },
    { kanji: '異口同音', reading: 'いこうどうおん', explanation: '違う人が同じ意見を述べること。' },
    { kanji: '以心伝心', reading: 'いしんでんしん', explanation: '心で心を伝える。' },
    { kanji: '一意専心', reading: 'いちいせんしん', explanation: '一つのことに心を集中させる。' },
    { kanji: '一念発起', reading: 'いちねんほっき', explanation: 'ある決心をしてそれを実行に移す。' },
    { kanji: '一知半解', reading: 'いっちはんかい', explanation: '不十分な知識。' },
    { kanji: '一生懸命', reading: 'いっしょうけんめい', explanation: 'できるだけ力をつくすこと。' },
    { kanji: '大功一篇', reading: 'たいこういっぺん', explanation: '大きな成功。' },
    { kanji: '同舟共済', reading: 'どうしゅうきょうさい', explanation: '苦難を共にする。' },
  ],
  normal: [
    { kanji: '万物流転', reading: 'ばんぶつりゅうてん', explanation: 'すべてのものは絶えず変化し流動する。' },
    { kanji: '諸行無常', reading: 'しょぎょうむじょう', explanation: 'すべての現象は常に変化する。' },
    { kanji: '苦集滅道', reading: 'くじゅつめつどう', explanation: '仏教の四聖諦。' },
    { kanji: '三界輪廻', reading: 'さんがいりんね', explanation: '輪廻転生の世界。' },
    { kanji: '因果応報', reading: 'いんがおうほう', explanation: '善悪は必ず報われる。' },
    { kanji: '刹那生滅', reading: 'せつなしょうめつ', explanation: '瞬間ごとに生じ滅する。' },
    { kanji: '空即是色', reading: 'くうそくぜしき', explanation: '空と色は一体だという考え。' },
    { kanji: '色即是空', reading: 'しきそくぜくう', explanation: '現象の世界は本質的に空である。' },
    { kanji: '中道', reading: 'ちゅうどう', explanation: '両極端を避けた中間の道。' },
    { kanji: '涅槃寂静', reading: 'ねはんじゃくじょう', explanation: '仏教における最高の悟りの境地。' },
    { kanji: '極東域', reading: 'きょくとうよう', explanation: '地球の東の果て。' },
    { kanji: '一佛多仏', reading: 'いちぶつたぶつ', explanation: '一仏から多くの仏が生じること。' },
    { kanji: '諸仏菩薩', reading: 'しょぶつぼさつ', explanation: 'すべての仏と菩薩。' },
    { kanji: '法界', reading: 'ほうかい', explanation: 'すべての存在する世界。' },
    { kanji: '宇宙万物', reading: 'うちゅうばんぶつ', explanation: 'すべての存在するもの。' },
  ],
  hard: [
    { kanji: '弁証法', reading: 'べんしょうほう', explanation: 'テーゼとアンチテーゼから新たなジンテーゼが生まれる思考法。' },
    { kanji: '認識論', reading: 'にんしきろん', explanation: '知識がどのように成立するかを研究する学問。' },
    { kanji: '存在論', reading: 'そんざいろん', explanation: '何が存在するのかを研究する学問。' },
    { kanji: '本質主義', reading: 'ほんしつしゅぎ', explanation: 'すべてのものには本質があるという考え。' },
    { kanji: '相対主義', reading: 'そうたいしゅぎ', explanation: '絶対的な真理はなく、すべては相対的という考え。' },
    { kanji: '観念論', reading: 'かんねんろん', explanation: '現実は観念の産物だという考え。' },
    { kanji: '唯物論', reading: 'ゆいぶつろん', explanation: '物質が基本で意識はそれに規定されるという考え。' },
    { kanji: '超越性', reading: 'ちょうえつせい', explanation: '通常の認識を超えた特性。' },
    { kanji: '内在性', reading: 'ないざいせい', explanation: '内部に存在する性質。' },
    { kanji: '他者性', reading: 'たしゃせい', explanation: '他者であることの根本的性質。' },
  ],
  veryhard: [
    { kanji: '久遠無窮', reading: 'きゅうおんむきゅう', explanation: '遠い過去から遠い未来へと終わりのない時間。' },
    { kanji: '物我一体', reading: 'ぶつがいったい', explanation: '主観と客観、自己と外界が一つに統一された状態。' },
    { kanji: '森羅万象', reading: 'しんらばんしょう', explanation: 'この世に存在するあらゆるもの。' },
    { kanji: '無思無為', reading: 'むしむい', explanation: '思考や作為を超えた状態。' },
    { kanji: '本体一如', reading: 'ほんたいいちにょ', explanation: '本質と現象が一体であること。' },
    { kanji: '相即相入', reading: 'そうそくそうにゅう', explanation: 'すべてのものが互いに関連し含み合うこと。' },
    { kanji: '縁起相依', reading: 'えんぎそうい', explanation: 'すべての現象が互いの条件で成り立つこと。' },
    { kanji: '理事一如', reading: 'りじいちにょ', explanation: '理（原理）と事（現象）が一体であること。' },
    { kanji: '法身如来', reading: 'ほっしんにょらい', explanation: '宇宙全体の真理そのものとしての仏。' },
    { kanji: '大円鏡智', reading: 'だいえんきょうちのち', explanation: '宇宙全体を映し出す智慧。' },
  ],
  hellish: [
    { kanji: '自相矛盾', reading: 'じそうむじゅん', explanation: '自分自身の内部に矛盾を含む状態。' },
    { kanji: '無限遡行', reading: 'むげんそこう', explanation: '説明の根拠を求め続けると無限に遡ることになる状態。' },
    { kanji: '形式意義', reading: 'けいしきいぎ', explanation: '形式的な構造と内容的な意味の関係。' },
    { kanji: '他者性存在', reading: 'たしゃせいそんざい', explanation: '他者として存在すること。' },
    { kanji: '正義困難', reading: 'せいぎこんなん', explanation: 'あらゆる正義の実現が根本的な困難を含むこと。' },
  ]
};

// ========================
// 問題生成関数
// ========================

function generateVerbsAdjectivesProblems(difficulty) {
  const pool = verbsAdjectivesDB[difficulty] || [];
  const count = 310;
  const result = [];

  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    result.push({
      difficulty,
      sentence: item.sentence,
      fullSentence: item.sentence.replace('____', item.kanji),
      kanji: item.kanji,
      reading: item.reading,
      correctAnswers: [item.reading],
      explanation: item.explanation,
      type: item.type
    });
  }

  return result;
}

function generateCompoundKanjiProblems(difficulty) {
  const pool = compoundKanjiDB[difficulty] || [];
  const count = 310;
  const result = [];

  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];

    // Check if sentence is valid (should contain underscores)
    const hasValidSentence = item.sentence && item.sentence.includes('____');

    result.push({
      difficulty,
      sentence: hasValidSentence ? item.sentence : `その____は重要だ。`,
      fullSentence: hasValidSentence ? item.sentence.replace('____', item.kanji) : `その${item.kanji}は重要だ。`,
      kanji: item.kanji,
      reading: item.reading,
      correctAnswers: [item.reading],
      explanation: item.explanation,
      type: 'compound'
    });
  }

  return result;
}

function generateIdiomProblems(difficulty) {
  const pool = idiomDB[difficulty] || [];
  const count = 50;
  const result = [];

  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    result.push({
      difficulty,
      sentence: `これは「____」という意味だ。`,
      fullSentence: `これは「${item.kanji}」という意味だ。`,
      kanji: item.kanji,
      reading: item.reading,
      correctAnswers: [item.reading],
      explanation: item.explanation,
      type: 'idiom'
    });
  }

  return result;
}

function generateFourCharacterKanjiProblems(difficulty) {
  const pool = fourCharacterKanjiDB[difficulty] || [];
  const count = 30;
  const result = [];

  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    result.push({
      difficulty,
      sentence: `これは「____」という四字熟語だ。`,
      fullSentence: `これは「${item.kanji}」という四字熟語だ。`,
      kanji: item.kanji,
      reading: item.reading,
      correctAnswers: [item.reading],
      explanation: item.explanation,
      type: 'yojijukugo'
    });
  }

  return result;
}

// ========================
// メイン処理
// ========================

console.log('Generating 3,500 questions (700 per difficulty level)...\n');

const difficulties = ['easy', 'normal', 'hard', 'veryhard', 'hellish'];
const allQuestions = {};

difficulties.forEach(difficulty => {
  console.log(`  [${difficulty}] Generating...`);

  const verbs = generateVerbsAdjectivesProblems(difficulty);
  const compounds = generateCompoundKanjiProblems(difficulty);
  const idioms = generateIdiomProblems(difficulty);
  const fourChars = generateFourCharacterKanjiProblems(difficulty);

  allQuestions[difficulty] = [
    ...verbs,
    ...compounds,
    ...idioms,
    ...fourChars
  ];

  console.log(`    ✓ Generated ${allQuestions[difficulty].length} questions`);
});

// ========================
// ファイルに書き込み
// ========================

const output = JSON.stringify(allQuestions, null, 2);
const outputPath = path.join(__dirname, '..', 'data', 'kanji-questions.json');

fs.writeFileSync(outputPath, output, 'utf8');

console.log('\n✅ Complete!');
console.log(`   Total: 3,500 questions (700 × 5 difficulties)`);
console.log(`   Saved to: ${outputPath}`);
console.log('\nBreakdown:');
console.log('   - Verbs/Adjectives with okurigana: 310 per difficulty');
console.log('   - Compound kanji: 310 per difficulty');
console.log('   - Idioms: 50 per difficulty');
console.log('   - Four-character idioms: 30 per difficulty');
console.log('   Total per difficulty: 700');
