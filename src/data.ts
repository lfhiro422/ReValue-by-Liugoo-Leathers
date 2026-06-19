import { Brand, StyleOption, AgingFactor, FAQItem, Testimonial } from "./types";

export const BRANDS: Brand[] = [
  {
    id: "lewis-leathers",
    name: "Lewis Leathers（ルイスレザーズ）",
    basePrice: 85000,
    popularModels: ["Lightning (ライトニング)", "Cyclone (サイクロン)", "Dominator (ドミネーター)"]
  },
  {
    id: "schott",
    name: "Schott（ショット）",
    basePrice: 42000,
    popularModels: ["613US One Star (ワンスター)", "141 Single", "618 Double"]
  },
  {
    id: "vanson",
    name: "vanson（バンソン）",
    basePrice: 48000,
    popularModels: ["C2 Double Riders", "Model B Single", "ENF Single"]
  },
  {
    id: "real-mccoys",
    name: "The Real McCoy's（リアルマッコイズ）",
    basePrice: 90000,
    popularModels: ["BUCO J-100", "BUCO J-24", "A-2 Bomber Jacket"]
  },
  {
    id: "harley-davidson",
    name: "Harley-Davidson（ハーレーダビッドソン）",
    basePrice: 28000,
    popularModels: ["Vintage Cycle Champ", "Screamin' Eagle Classic", "Genuine Cruiser"]
  },
  {
    id: "liugoo-leathers",
    name: "Liugoo Leathers（リューグーレザーズ）",
    basePrice: 32000,
    popularModels: ["Premium Quality Double Riders", "Single Leather Jacket", "Horn Works Series"]
  },
  {
    id: "others",
    name: "その他・ヴィンテージ・ブランド不問",
    basePrice: 20000,
    popularModels: ["Vintage Riders", "Aero Leather", "Langlitz Leathers", "その他レザージャケット"]
  }
];

export const STYLE_OPTIONS: StyleOption[] = [
  { id: "double", name: "ダブルライダース（襟が重なる定番スタイル）", multiplier: 1.15 },
  { id: "single", name: "シングルライダース（立ち襟・襟なしスッキリ）", multiplier: 1.0 },
  { id: "bomber", name: "ボマー / A-2 / ミリタリー（リブや大きめの襟付き）", multiplier: 1.05 },
  { id: "collar-single", name: "襟付きシングル / スポーツジャケット / ハーフコート", multiplier: 1.1 }
];

export const AGING_FACTORS: AgingFactor[] = [
  {
    id: "teacore",
    name: "ヴィンテージならではの「茶芯」の出現",
    description: "下地の茶色が擦れによって浮かび上がる、愛好家垂涎のヴィンテージ・ディテールです。",
    bonusAmount: 12000,
    iconName: "Sparkles"
  },
  {
    id: "creases",
    name: "腕回り・関節の美しい蛇腹シワ（アコーディオン）",
    description: "オーナーのライディングフォームが刻み込まれた、減点対象どころか、まさに勲章となるシワです。",
    bonusAmount: 6000,
    iconName: "Flame"
  },
  {
    id: "treatment",
    name: "定期的なオイル（マスタングペースト / ミンクオイル等）での保湿手入れ",
    description: "カビを抑え、しなやかさを保ち、専門職がそのまま店頭に並べられるほどの良好な栄養状態です。",
    bonusAmount: 8000,
    iconName: "Droplet"
  },
  {
    id: "zipper",
    name: "TALON・OPTI・riri・YKKなどジッパー動作がスムーズ",
    description: "スライダーが欠損なく滑らかに走り、サビやテープの破れがない完動状態を評価します。",
    bonusAmount: 4000,
    iconName: "Lock"
  },
  {
    id: "liner",
    name: "裏地（ライニング）にインナーのキルティング破れや汗染みがない",
    description: "赤いタータンチェックやシルク・サテン地など、美しいインナーライニングが保たれています。",
    bonusAmount: 5000,
    iconName: "Shield"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "oda-eiji",
    name: "織田 栄治さん",
    age: 46,
    subTitle: "週末ソロツーリングが唯一の癒やし（愛車：YAMAHA SR400）",
    storyTitle: "「クローゼット邪魔」という妻の冷視から、家族での笑顔の食卓へ。",
    quote: "近所の何でも買取店では4,000円と言われ絶望したSchottが、ここでは『惚れ惚れするエイジング』と認められて 68,000円 に！",
    fullText: "家族から『バイクの匂いがつくし、クローゼットを占領していて邪魔だよね』とプレッシャーをかけられつつも、20代の頃に憧れて買ったSchottを手放すのは断腸の思いでした。近所のリサイクルショップでは傷があるからと二死満金の買取額。自分の思い出をゴミ扱いされたようでしたが、リューグーの「価値発見方式」に出会って救われました。私のライディング癖による腕のシワ、カビ対策を施していたオイルメンテ履歴を事細かく『加点』してくれたのです。お小遣いもしっかり手に入り、クローゼットもスッキリして妻との円満も取り戻しました！",
    jacketSold: "Schott 613US One Star ダブルライダース (15年着用)",
    estimatedPrice: 38000,
    finalPrice: 68000,
    bikerType: "Classic Biker / SR400 Rider",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "kenji",
    name: "佐々木 憲二さん",
    age: 43,
    subTitle: "ハーレー乗り・アメカジコレクター（愛車：FLSTF Fat Boy）",
    storyTitle: "メルカリの面倒な値下げ交渉や細かなサイズ計測から解放された。",
    quote: "スマホで4箇所パシャパシャと写真を送るだけ。AIとプロソムリエが愛着をそのまま金額に変えてくれました。",
    fullText: "Lewis Leathersをネット出品しようと思いましたが、肩幅や身幅、袖丈などの計測から、購入検討者の『タバコの匂いはありますか？』といった際限ない問い合わせ対応に疲弊して放置。こちらのリユースでは、LINEからこだわり項目をぽちぽち選んで写真を送るだけ。次のオーナーへきれいにメンテナンスして受け継ぐというブランドの思想にも胸を撃たれました。下取り割を利用して、今シーズンの新しいアウターを速攻で購入しました！",
    jacketSold: "Lewis Leathers Lightning ダブルライダース (ホースハイド)",
    estimatedPrice: 75000,
    finalPrice: 104000,
    bikerType: "Cruiser Rider / Harley-Davidson Owner",
    avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "masahiko",
    name: "高橋 雅彦さん",
    age: 52,
    subTitle: "旧車・絶版車バイカー（愛車：KAWASAKI Z1-R）",
    storyTitle: "「傷＝擦れ＝一律減点」を覆す、これぞ大人の男にふさわしい査定。",
    quote: "ヴィンテージの革の厚み、ヤレ感、茶芯の風合いを、ソムリエがルーペを覗く熱中度合いで愛でてくれました！",
    fullText: "もう20年以上袖を通していなかったVansonのライダース。一般の服屋ではボロ中古扱いされても仕方のないヤレ感でしたが、リューグーは真逆でした。これぞ「価値発見（加点）方式」。『この擦れはバイク乗りの証。背中のヨレは本革が体に馴染んだ証拠』とまで言っていただき、驚くほど高額な加点を受けました。次にこの相棒を引き継いでくれる人がいると思うと嬉しくて、涙が出そうになりましたよ。",
    jacketSold: "vanson C2 ダブルライダースジャケット (25年モノ)",
    estimatedPrice: 32000,
    finalPrice: 59000,
    bikerType: "Vintage Motorcycle Biker / Z1 Owner",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300"
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "無料の自動査定を試してみたけれど、本当にこの金額で売れるの？",
    answer: "自動査定の金額は、多く集計された直近のリアルタイム相場データをベースに、あなたが選んだ「エイジング状態」「オイル手入れ」などの加点項目を反映させた「極めて精度の高い想定シミュレーション」です。もちろん本査定時に状態（大きな破れ等）のズレがあれば多少変動はございますが、私たちは最初からお客様の期待を裏切らない「誠実な最高適正価格」を算出するよう努めております。安心してお使いください。"
  },
  {
    question: "郵送で本査定に出した場合、送料やキャンセル料はとられますか？",
    answer: "いいえ、一切お客様に負担はございません。お送りいただく際の「郵送キット（梱包用段ボール箱・着払い伝票・緩衝材）」はすべて無料でご自宅にお届けします。また、万が一査定査定金額にご満足いただけなかった場合、速やかにご返送いたしますが、その際のキャンセル料・返送料もすべて当店が100%負担いたします。ノーリスクで安心してプロの鑑定を受けられます。"
  },
  {
    question: "なぜ「傷や擦れ」を減点せず、加点評価（価値発見方式）できるのですか？",
    answer: "私たちは創業以来、数万着の革ジャンを手がけ、レザーを誰よりもリスペクトしている革のプロフェッショナルだからです。一般的な古着屋ではマニュアルに基づいて『新品からの減収分』を引き算しますが、革愛好家の間では、長い年月をかけて愛情たっぷりに育てられた『茶芯』『シワ』『馴染み』はヴィンテージとしての【最高のアート（芸術）】に他なりません。私たちはそれを次に引き継ぎたいマニア層への広い自社販路を持っているため、唯一無二の価値として高額加点ができるのです。"
  },
  {
    question: "メルカリやオークション等で直接バイク仲間に売るのと、何が違いますか？",
    answer: "ズバリ「圧倒的な手離れの良さと、感情的満足感」が違います。フリマアプリでの革ジャン売却は、アームホール幅や着丈、傷の位置をルーペレベルで確認する購入希望者からの細かい質問攻め、大幅な値下げ交渉、サイズ違いによる返品トラブル、発送前のオイルケアや梱包の手間など、多大なストレスが伴います。リューグーレザーズリユースなら、それら面倒なやり取りは一切なし。LINEで写真を送って、箱に詰めて送るだけ。さらに大事にしてくれる次のオーナーへ確実にお繋ぎします。"
  }
];
