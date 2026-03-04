/* ============================================
   ADaM仕様書アカデミー - データ定義
   ============================================ */

/**
 * データセットクラス定義
 */
const DATASET_CLASSES = {
  adsl: {
    name: "ADSL",
    fullName: "Subject-Level Analysis Dataset",
    nameJa: "被験者レベル解析データセット",
    color: "#2563eb",
    icon: "👤",
    description: "1被験者1レコードの解析データセット。全てのADaMデータセットの基盤となり、被験者の人口統計学的情報、治療情報、解析フラグ等を格納する。",
    keyPoints: [
      "1被験者につき1レコード（1:1構造）",
      "全てのBDS/OCCDSデータセットはADSLとマージして使用",
      "治療変数（TRT01P, TRT01A等）はADSLで定義",
      "解析対象集団フラグ（SAFFL, ITTFL等）を格納",
      "人口統計学的情報（AGE, SEX, RACE等）を含む"
    ],
    whenToUse: "全ての臨床試験で必須。最初に作成するADaMデータセット。",
    sourceDatasets: ["DM", "EX", "DS", "SV", "SUPPDM"]
  },
  bds: {
    name: "BDS",
    fullName: "Basic Data Structure",
    nameJa: "基本データ構造",
    color: "#059669",
    icon: "📊",
    description: "パラメータ（PARAMCD/PARAM）とその値（AVAL/AVALC）を中心とした縦持ち構造。臨床検査値、バイタルサイン、有効性評価等、数値データの解析に使用される最も一般的な構造。",
    keyPoints: [
      "PARAMCD + AVAL/AVALC が核となる縦持ち構造",
      "1被験者×1パラメータ×1時点で複数レコード可",
      "ベースライン値（BASE）、変化量（CHG）等の導出変数を含む",
      "解析用フラグ（ANL01FL等）でサブセット制御",
      "ADLB, ADVS, ADEFF, ADEG 等がBDSに該当"
    ],
    whenToUse: "数値パラメータを持つ繰り返し測定データの解析時。臨床検査値、バイタルサイン、有効性スコア等。",
    sourceDatasets: ["LB", "VS", "EG", "QS", "SDTM domain"]
  },
  occds: {
    name: "OCCDS",
    fullName: "Occurrence Data Structure",
    nameJa: "発現データ構造",
    color: "#dc2626",
    icon: "⚠️",
    description: "有害事象（AE）や併用薬（CM）のような「発生したイベント」を記録する構造。イベントの発生・非発生をフラグで管理し、発現頻度の集計に適した形式。",
    keyPoints: [
      "イベント発生ごとに1レコード",
      "AOCCFL（初回発現フラグ）等の集計用フラグが特徴",
      "AEBODSYS, AEDECOD等のコーディング変数を含む",
      "ADAEが最も代表的なOCCDSデータセット",
      "発現頻度テーブル作成に最適化された構造"
    ],
    whenToUse: "有害事象、併用薬、既往歴等のイベントデータの解析時。",
    sourceDatasets: ["AE", "CM", "MH", "SDTM domain"]
  },
  other: {
    name: "ADaM Other",
    fullName: "Other ADaM Structures",
    nameJa: "その他のADaM構造",
    color: "#7c3aed",
    icon: "📁",
    description: "ADSL、BDS、OCCDSのいずれにも該当しない特殊な構造。Time-to-Event解析用のADTTE、PK解析用のADPC等が含まれる。",
    keyPoints: [
      "特定の解析目的に特化した構造",
      "ADTTEはKaplan-Meier解析・Cox回帰に使用",
      "ADPCは薬物動態パラメータの解析に使用",
      "ADaMIGの一般ルールに従いつつ柔軟に設計",
      "define.xmlでの文書化が特に重要"
    ],
    whenToUse: "生存時間解析、薬物動態解析等、標準構造では対応できない特殊な解析時。",
    sourceDatasets: ["AE", "DS", "EX", "PC", "PP"]
  }
};

/**
 * 代表的なADaMデータセット
 */
const DATASETS = [
  {
    id: "adsl",
    name: "ADSL",
    fullName: "Subject-Level Analysis Dataset",
    nameJa: "被験者レベル解析データセット",
    class: "adsl",
    description: "被験者ごとに1レコード。人口統計、治療情報、集団フラグを格納。",
    frequency: "全試験で必須",
    typicalRecords: "被験者数と同数",
    primarySource: "DM, EX, DS"
  },
  {
    id: "adae",
    name: "ADAE",
    fullName: "Adverse Events Analysis Dataset",
    nameJa: "有害事象解析データセット",
    class: "occds",
    description: "有害事象データの解析用。重症度、因果関係、発現フラグを含む。",
    frequency: "ほぼ全試験",
    typicalRecords: "有害事象の発現件数",
    primarySource: "AE, ADSL"
  },
  {
    id: "adlb",
    name: "ADLB",
    fullName: "Laboratory Analysis Dataset",
    nameJa: "臨床検査解析データセット",
    class: "bds",
    description: "臨床検査値の解析用。ベースライン、変化量、正常範囲判定を含む。",
    frequency: "ほぼ全試験",
    typicalRecords: "被験者数 × 検査項目数 × 来院数",
    primarySource: "LB, ADSL"
  },
  {
    id: "advs",
    name: "ADVS",
    fullName: "Vital Signs Analysis Dataset",
    nameJa: "バイタルサイン解析データセット",
    class: "bds",
    description: "バイタルサイン（血圧、脈拍、体温等）の解析用。",
    frequency: "ほぼ全試験",
    typicalRecords: "被験者数 × 測定項目数 × 来院数",
    primarySource: "VS, ADSL"
  },
  {
    id: "adcm",
    name: "ADCM",
    fullName: "Concomitant Medications Analysis Dataset",
    nameJa: "併用薬解析データセット",
    class: "occds",
    description: "併用薬データの解析用。投与期間、分類コード等を含む。",
    frequency: "ほぼ全試験",
    typicalRecords: "併用薬の使用件数",
    primarySource: "CM, ADSL"
  },
  {
    id: "adeff",
    name: "ADEFF",
    fullName: "Efficacy Analysis Dataset",
    nameJa: "有効性解析データセット",
    class: "bds",
    description: "主要・副次評価項目の有効性データ解析用。試験固有の設計に依存。",
    frequency: "多くの試験",
    typicalRecords: "被験者数 × パラメータ数 × 来院数",
    primarySource: "QS, RS, TR, ADSL"
  },
  {
    id: "adtte",
    name: "ADTTE",
    fullName: "Time-to-Event Analysis Dataset",
    nameJa: "イベント発生時間解析データセット",
    class: "other",
    description: "Kaplan-Meier解析やCox回帰分析用。PFS、OS等の生存時間解析に使用。",
    frequency: "オンコロジー試験等",
    typicalRecords: "被験者数 × イベント種類数",
    primarySource: "AE, DS, RS, ADSL"
  },
  {
    id: "adeg",
    name: "ADEG",
    fullName: "ECG Analysis Dataset",
    nameJa: "心電図解析データセット",
    class: "bds",
    description: "心電図（ECG）データの解析用。QTcF、QTcB等の補正値を含む。",
    frequency: "QT延長評価が必要な試験",
    typicalRecords: "被験者数 × ECGパラメータ数 × 来院数",
    primarySource: "EG, ADSL"
  }
];

/**
 * ADaM変数辞書
 * - id: 変数名
 * - label: ラベル
 * - type: Char / Num
 * - length: 長さ（目安）
 * - category: 変数カテゴリ
 * - class: 使用されるクラス
 * - core: Req(必須) / Cond(条件付き) / Perm(任意)
 * - source: ソース/導出方法
 * - description: 説明
 */
const VARIABLES = [
  // === 識別変数 ===
  { id: "STUDYID", label: "Study Identifier", labelJa: "試験識別子", type: "Char", length: 20, category: "識別変数", classes: ["adsl","bds","occds","other"], core: "Req", source: "SDTM.DM.STUDYID", description: "試験を一意に識別するID。SDTMのDMドメインから転記。" },
  { id: "USUBJID", label: "Unique Subject Identifier", labelJa: "被験者固有識別子", type: "Char", length: 40, category: "識別変数", classes: ["adsl","bds","occds","other"], core: "Req", source: "SDTM.DM.USUBJID", description: "被験者を全試験で一意に識別するID。STUDYID + SITEID + SUBJID の結合が一般的。" },
  { id: "SUBJID", label: "Subject Identifier for the Study", labelJa: "施設内被験者番号", type: "Char", length: 20, category: "識別変数", classes: ["adsl"], core: "Perm", source: "SDTM.DM.SUBJID", description: "施設内での被験者番号。USUBJIDの構成要素の1つ。" },
  { id: "SITEID", label: "Study Site Identifier", labelJa: "実施施設識別子", type: "Char", length: 20, category: "識別変数", classes: ["adsl"], core: "Perm", source: "SDTM.DM.SITEID", description: "実施医療機関の識別番号。" },

  // === 人口統計変数（ADSL） ===
  { id: "AGE", label: "Age", labelJa: "年齢", type: "Num", length: 8, category: "人口統計", classes: ["adsl"], core: "Req", source: "SDTM.DM.AGE", description: "同意取得時（またはスクリーニング時）の被験者の年齢。" },
  { id: "AGEGR1", label: "Pooled Age Group 1", labelJa: "年齢区分1", type: "Char", length: 20, category: "人口統計", classes: ["adsl"], core: "Cond", source: "導出: AGEからカテゴリ化", description: "解析用に区分した年齢グループ。例: '<65', '>=65'。SAPに基づいて定義。" },
  { id: "AGEGR1N", label: "Pooled Age Group 1 (N)", labelJa: "年齢区分1（数値）", type: "Num", length: 8, category: "人口統計", classes: ["adsl"], core: "Cond", source: "導出: AGEGR1の数値コード", description: "AGEGR1の数値コード版。ソートや統計処理に使用。" },
  { id: "SEX", label: "Sex", labelJa: "性別", type: "Char", length: 2, category: "人口統計", classes: ["adsl"], core: "Req", source: "SDTM.DM.SEX", description: "被験者の性別。M=Male, F=Female。" },
  { id: "RACE", label: "Race", labelJa: "人種", type: "Char", length: 60, category: "人口統計", classes: ["adsl"], core: "Cond", source: "SDTM.DM.RACE", description: "被験者の人種。SDTMのControlled Terminologyに従う。" },
  { id: "ETHNIC", label: "Ethnicity", labelJa: "民族", type: "Char", length: 40, category: "人口統計", classes: ["adsl"], core: "Cond", source: "SDTM.DM.ETHNIC", description: "民族。HISPANIC OR LATINO / NOT HISPANIC OR LATINO。" },
  { id: "COUNTRY", label: "Country", labelJa: "国", type: "Char", length: 3, category: "人口統計", classes: ["adsl"], core: "Perm", source: "SDTM.DM.COUNTRY", description: "実施国のISO 3166 alpha-3コード。" },

  // === 治療変数 ===
  { id: "TRT01P", label: "Planned Treatment for Period 01", labelJa: "Period 01 計画治療", type: "Char", length: 40, category: "治療変数", classes: ["adsl"], core: "Req", source: "SDTM.DM.ARM or DM.ACTARM", description: "Period 01の計画された治療群名。ランダム化で割り付けられた治療。ITT解析で使用。" },
  { id: "TRT01PN", label: "Planned Treatment for Period 01 (N)", labelJa: "Period 01 計画治療（数値）", type: "Num", length: 8, category: "治療変数", classes: ["adsl"], core: "Req", source: "導出: TRT01Pの数値コード", description: "TRT01Pの数値コード。統計モデルやソートに使用。" },
  { id: "TRT01A", label: "Actual Treatment for Period 01", labelJa: "Period 01 実際の治療", type: "Char", length: 40, category: "治療変数", classes: ["adsl"], core: "Req", source: "SDTM.EX等から導出", description: "Period 01で実際に投与された治療群名。安全性解析で使用。" },
  { id: "TRT01AN", label: "Actual Treatment for Period 01 (N)", labelJa: "Period 01 実際の治療（数値）", type: "Num", length: 8, category: "治療変数", classes: ["adsl"], core: "Req", source: "導出: TRT01Aの数値コード", description: "TRT01Aの数値コード。" },
  { id: "TRTSDT", label: "Date of First Exposure to Treatment", labelJa: "治験薬初回投与日", type: "Num", length: 8, category: "治療変数", classes: ["adsl"], core: "Cond", source: "SDTM.EX.EXSTDTC（最早日）", description: "治験薬の初回投与日。SAS日付値。安全性解析の基準日として使用されることが多い。" },
  { id: "TRTEDT", label: "Date of Last Exposure to Treatment", labelJa: "治験薬最終投与日", type: "Num", length: 8, category: "治療変数", classes: ["adsl"], core: "Cond", source: "SDTM.EX.EXENDTC（最遅日）", description: "治験薬の最終投与日。" },

  // === 集団フラグ ===
  { id: "ITTFL", label: "Intent-to-Treat Population Flag", labelJa: "ITT集団フラグ", type: "Char", length: 1, category: "集団フラグ", classes: ["adsl"], core: "Cond", source: "導出: プロトコルのITT定義に基づく", description: "ITT（Intent-to-Treat）解析対象集団フラグ。Y=該当, N=非該当。ランダム化された全被験者が対象となることが多い。" },
  { id: "SAFFL", label: "Safety Population Flag", labelJa: "安全性解析対象集団フラグ", type: "Char", length: 1, category: "集団フラグ", classes: ["adsl"], core: "Cond", source: "導出: 1回以上治験薬投与", description: "安全性解析対象集団フラグ。通常、治験薬を1回以上投与された被験者がY。" },
  { id: "FASFL", label: "Full Analysis Set Population Flag", labelJa: "最大の解析対象集団フラグ", type: "Char", length: 1, category: "集団フラグ", classes: ["adsl"], core: "Cond", source: "導出: プロトコルのFAS定義に基づく", description: "FAS（Full Analysis Set）フラグ。ICH E9で推奨される主要解析対象集団。" },
  { id: "PPROTFL", label: "Per-Protocol Population Flag", labelJa: "治験実施計画書適合集団フラグ", type: "Char", length: 1, category: "集団フラグ", classes: ["adsl"], core: "Cond", source: "導出: 重大な逸脱なし", description: "PP（Per-Protocol）集団フラグ。重大なプロトコル逸脱がない被験者がY。" },

  // === BDS核心変数 ===
  { id: "PARAMCD", label: "Parameter Code", labelJa: "パラメータコード", type: "Char", length: 8, category: "パラメータ変数", classes: ["bds","other"], core: "Req", source: "SDTMの検査コード等から導出", description: "パラメータを識別する短縮コード（8文字以内）。例: ALT, SYSBP, DIABP。テーブルのキー変数。" },
  { id: "PARAM", label: "Parameter", labelJa: "パラメータ", type: "Char", length: 200, category: "パラメータ変数", classes: ["bds","other"], core: "Req", source: "SDTMのTESTNAM等から導出", description: "パラメータの説明的な名称。例: 'Alanine Aminotransferase (U/L)'。単位を含めることが推奨。" },
  { id: "PARAMN", label: "Parameter (N)", labelJa: "パラメータ（数値）", type: "Num", length: 8, category: "パラメータ変数", classes: ["bds","other"], core: "Perm", source: "導出: PARAMCDの数値コード", description: "パラメータの数値コード。表示順序の制御に使用。" },
  { id: "PARCAT1", label: "Parameter Category 1", labelJa: "パラメータカテゴリ1", type: "Char", length: 60, category: "パラメータ変数", classes: ["bds"], core: "Perm", source: "SDTMのCATEGORY等", description: "パラメータのカテゴリ。例: 'HEMATOLOGY', 'CHEMISTRY', 'URINALYSIS'。" },
  { id: "AVAL", label: "Analysis Value", labelJa: "解析値", type: "Num", length: 8, category: "解析値変数", classes: ["bds","other"], core: "Cond", source: "SDTMの結果値（STRESN等）", description: "解析に使用する数値。AVALとAVALCの少なくとも一方は必須。BDSの核心となる変数。" },
  { id: "AVALC", label: "Analysis Value (C)", labelJa: "解析値（文字）", type: "Char", length: 200, category: "解析値変数", classes: ["bds","other"], core: "Cond", source: "SDTMの結果値（STRESC等）", description: "解析に使用する文字値。数値にできない結果（例: 'NEGATIVE', 'POSITIVE'）に使用。" },
  { id: "BASE", label: "Baseline Value", labelJa: "ベースライン値", type: "Num", length: 8, category: "解析値変数", classes: ["bds"], core: "Cond", source: "導出: ABLFL='Y'のAVAL", description: "ベースライン時点の解析値。ABLFL='Y'のレコードのAVAL値。変化量(CHG)の計算の基準。" },
  { id: "BASEC", label: "Baseline Value (C)", labelJa: "ベースライン値（文字）", type: "Char", length: 200, category: "解析値変数", classes: ["bds"], core: "Cond", source: "導出: ABLFL='Y'のAVALC", description: "ベースライン時点の文字値。" },
  { id: "CHG", label: "Change from Baseline", labelJa: "ベースラインからの変化量", type: "Num", length: 8, category: "解析値変数", classes: ["bds"], core: "Cond", source: "導出: AVAL - BASE", description: "ベースラインからの変化量。投与後のレコードでのみ計算（ベースラインレコードではnull）。" },
  { id: "PCHG", label: "Percent Change from Baseline", labelJa: "ベースラインからの変化率", type: "Num", length: 8, category: "解析値変数", classes: ["bds"], core: "Perm", source: "導出: (CHG / BASE) × 100", description: "ベースラインからの変化率(%)。BASE≠0の場合のみ計算可能。" },

  // === タイミング変数 ===
  { id: "ADT", label: "Analysis Date", labelJa: "解析日", type: "Num", length: 8, category: "タイミング変数", classes: ["bds","occds","other"], core: "Cond", source: "SDTMの日付変数から変換", description: "解析に使用する日付。SAS日付値（1960年1月1日からの日数）。" },
  { id: "ADY", label: "Analysis Relative Day", labelJa: "解析相対日", type: "Num", length: 8, category: "タイミング変数", classes: ["bds","occds","other"], core: "Cond", source: "導出: ADT - TRTSDT + 1（投与後）", description: "治験薬初回投与日からの相対日数。投与日=Day 1。Day 0は存在しない。" },
  { id: "AVISIT", label: "Analysis Visit", labelJa: "解析来院", type: "Char", length: 40, category: "タイミング変数", classes: ["bds"], core: "Cond", source: "導出: 来院ウィンドウに基づく", description: "解析用の来院名。SDTMのVISITをウィンドウルールに基づいて再割り当て。例: 'Baseline', 'Week 4'。" },
  { id: "AVISITN", label: "Analysis Visit (N)", labelJa: "解析来院（数値）", type: "Num", length: 8, category: "タイミング変数", classes: ["bds"], core: "Cond", source: "導出: AVISITの数値コード", description: "AVISITの数値コード。ソートや時系列グラフに使用。" },
  { id: "ATPT", label: "Analysis Timepoint", labelJa: "解析時点", type: "Char", length: 40, category: "タイミング変数", classes: ["bds"], core: "Cond", source: "SDTMのTPT等", description: "来院内の測定時点。例: 'PRE-DOSE', '1 HOUR POST-DOSE'。" },
  { id: "ATPTN", label: "Analysis Timepoint (N)", labelJa: "解析時点（数値）", type: "Num", length: 8, category: "タイミング変数", classes: ["bds"], core: "Cond", source: "導出: ATPTの数値コード", description: "ATPTの数値コード。" },

  // === フラグ変数 ===
  { id: "ABLFL", label: "Baseline Record Flag", labelJa: "ベースラインレコードフラグ", type: "Char", length: 1, category: "フラグ変数", classes: ["bds"], core: "Cond", source: "導出: ベースライン定義に基づく", description: "ベースラインレコードを示すフラグ。Y=ベースライン。SAPのベースライン定義に従って設定。" },
  { id: "ANL01FL", label: "Analysis Record Flag 01", labelJa: "解析レコードフラグ01", type: "Char", length: 1, category: "フラグ変数", classes: ["bds"], core: "Cond", source: "導出: 解析条件に基づく", description: "主要解析に使用するレコードを示すフラグ。例: 投与後の各来院で1レコード選択。Yまたはnull。" },
  { id: "AOCCFL", label: "1st Occurrence within Subject Flag", labelJa: "被験者内初回発現フラグ", type: "Char", length: 1, category: "フラグ変数", classes: ["occds"], core: "Cond", source: "導出: 被験者内で最初の発現", description: "被験者内で最初に発現したイベントにY。発現頻度テーブルで被験者数をカウントする際に使用。" },
  { id: "AOCCPFL", label: "1st Occurrence of Preferred Term Flag", labelJa: "PT別初回発現フラグ", type: "Char", length: 1, category: "フラグ変数", classes: ["occds"], core: "Cond", source: "導出: 被験者×PT内で最初", description: "同一被験者の同一PT（基本語）内で最初のイベントにY。PT別発現率のカウントに使用。" },
  { id: "AOCCSFL", label: "1st Occurrence of SOC Flag", labelJa: "SOC別初回発現フラグ", type: "Char", length: 1, category: "フラグ変数", classes: ["occds"], core: "Cond", source: "導出: 被験者×SOC内で最初", description: "同一被験者の同一SOC（器官別大分類）内で最初のイベントにY。" },
  { id: "CRIT1", label: "Analysis Criterion 1", labelJa: "解析基準1", type: "Char", length: 200, category: "フラグ変数", classes: ["bds"], core: "Cond", source: "導出: 解析基準の説明文", description: "解析基準の説明。例: 'ALT >= 3 x ULN'。" },
  { id: "CRIT1FL", label: "Criterion 1 Evaluation Result Flag", labelJa: "基準1評価結果フラグ", type: "Char", length: 1, category: "フラグ変数", classes: ["bds"], core: "Cond", source: "導出: 基準を満たすか判定", description: "CRIT1の評価結果。Y=基準を満たす、null=満たさない（Nは使わない）。" },

  // === OCCDS固有変数 ===
  { id: "AETERM", label: "Reported Term for the AE", labelJa: "有害事象報告名", type: "Char", length: 200, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AETERM", description: "報告された有害事象名（原語）。" },
  { id: "AEDECOD", label: "Dictionary-Derived Term", labelJa: "MedDRA基本語（PT）", type: "Char", length: 200, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AEDECOD", description: "MedDRAコーディングされた基本語（Preferred Term）。" },
  { id: "AEBODSYS", label: "Body System or Organ Class", labelJa: "器官別大分類（SOC）", type: "Char", length: 200, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AEBODSYS", description: "MedDRAの器官別大分類（System Organ Class）。" },
  { id: "AESEV", label: "Severity/Intensity", labelJa: "重症度", type: "Char", length: 20, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AESEV", description: "有害事象の重症度。MILD/MODERATE/SEVERE。" },
  { id: "AESER", label: "Serious Event", labelJa: "重篤な有害事象", type: "Char", length: 1, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AESER", description: "重篤な有害事象(SAE)フラグ。Y/N。" },
  { id: "AEREL", label: "Causality", labelJa: "因果関係", type: "Char", length: 20, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AEREL", description: "治験薬との因果関係。RELATED/NOT RELATED等。" },
  { id: "ASTDT", label: "Analysis Start Date", labelJa: "解析開始日", type: "Num", length: 8, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AESTDTC変換", description: "有害事象の発現日（解析用日付値）。" },
  { id: "AENDT", label: "Analysis End Date", labelJa: "解析終了日", type: "Num", length: 8, category: "有害事象変数", classes: ["occds"], core: "Cond", source: "SDTM.AE.AEENDTC変換", description: "有害事象の回復/転帰日（解析用日付値）。" },

  // === TTE固有変数 ===
  { id: "CNSR", label: "Censor", labelJa: "打切りフラグ", type: "Num", length: 8, category: "TTE変数", classes: ["other"], core: "Cond", source: "導出: イベント=0, 打切り=1", description: "打切りフラグ。0=イベント発生、1=打切り。生存時間解析で必須。" },
  { id: "AVAL_TTE", label: "Analysis Value (Time)", labelJa: "解析値（時間）", type: "Num", length: 8, category: "TTE変数", classes: ["other"], core: "Req", source: "導出: イベント/打切り日 - 基準日 + 1", description: "イベント発生までの時間（日数等）。" },
  { id: "STARTDT", label: "Time-to-Event Origin Date", labelJa: "TTE起算日", type: "Num", length: 8, category: "TTE変数", classes: ["other"], core: "Cond", source: "導出: ランダム化日等", description: "Time-to-Event解析の起算日。通常はランダム化日または初回投与日。" },
  { id: "EVNTDESC", label: "Event or Censoring Description", labelJa: "イベント/打切りの説明", type: "Char", length: 200, category: "TTE変数", classes: ["other"], core: "Perm", source: "導出", description: "イベントまたは打切りの理由の説明。" }
];

/**
 * 変数カテゴリ定義
 */
const VARIABLE_CATEGORIES = [
  { id: "識別変数", color: "#6366f1", icon: "🔑", description: "データセットとレコードを一意に識別" },
  { id: "人口統計", color: "#2563eb", icon: "👤", description: "被験者の基本属性情報" },
  { id: "治療変数", color: "#0891b2", icon: "💊", description: "治療群の割り付け・投与情報" },
  { id: "集団フラグ", color: "#059669", icon: "🏷️", description: "解析対象集団の定義" },
  { id: "パラメータ変数", color: "#d97706", icon: "📐", description: "BDS構造の測定パラメータ" },
  { id: "解析値変数", color: "#dc2626", icon: "📊", description: "解析に使用する値" },
  { id: "タイミング変数", color: "#7c3aed", icon: "📅", description: "時間・来院・時点の情報" },
  { id: "フラグ変数", color: "#be185d", icon: "🚩", description: "レコード選択・条件判定用" },
  { id: "有害事象変数", color: "#ea580c", icon: "⚠️", description: "ADAE固有の変数" },
  { id: "TTE変数", color: "#4f46e5", icon: "⏱️", description: "Time-to-Event解析固有の変数" }
];

/**
 * 仕様書作成ガイド - ステップ定義
 */
const GUIDE_STEPS = [
  {
    step: 1,
    title: "SAP（統計解析計画書）を確認する",
    titleShort: "SAP確認",
    icon: "📋",
    description: "仕様書作成の出発点はSAP。どの解析にどのデータが必要かを理解する。",
    details: [
      "主要評価項目・副次評価項目の確認",
      "解析対象集団（ITT, Safety, PP等）の定義確認",
      "ベースラインの定義確認",
      "解析に使用する来院・時点の確認",
      "統計手法（検定、モデル等）と必要な変数の確認"
    ],
    tips: "SAPが未完成でも、ドラフト版やモックTFL（Tables, Figures, Listings）があれば、必要な変数を逆算できます。",
    pitfalls: "SAPを読まずに仕様書を書き始めると、後から大幅な修正が必要になります。必ず最初に確認しましょう。"
  },
  {
    step: 2,
    title: "SDTMデータを確認する",
    titleShort: "SDTM確認",
    icon: "🔍",
    description: "ソースとなるSDTMデータの構造・変数・コードリストを把握する。",
    details: [
      "使用するSDTMドメイン（DM, AE, LB, VS等）の特定",
      "各ドメインの変数一覧とControlled Terminologyの確認",
      "データの品質（欠測、不完全日付等）の事前確認",
      "SUPPQUAL（補足修飾子）データの有無確認",
      "SDTMのannotated CRFとの対応確認"
    ],
    tips: "SDTMデータを実際にSASやRで開いて中身を確認すると、導出ロジックがイメージしやすくなります。",
    pitfalls: "SDTMの不完全日付（例: 2024-03）の扱いをここで検討しておかないと、後で問題になります。"
  },
  {
    step: 3,
    title: "ADSLの仕様を作成する",
    titleShort: "ADSL作成",
    icon: "👤",
    description: "全ADaMデータセットの基盤となるADSLを最初に作成する。",
    details: [
      "人口統計変数（AGE, SEX, RACE等）のマッピング",
      "治療変数（TRT01P, TRT01A等）の導出ルール定義",
      "集団フラグ（ITTFL, SAFFL等）の導出条件記述",
      "治療開始日・終了日（TRTSDT, TRTEDT）の導出",
      "サブグループ変数（AGEGR1等）の定義",
      "各変数のソース・導出ロジックを明記"
    ],
    tips: "ADSLは全てのBDS/OCCDSの基盤です。ここで定義した集団フラグや治療変数は、他のデータセットから参照されます。",
    pitfalls: "集団フラグの定義が曖昧だと、全ての解析結果に影響します。プロトコルとSAPの定義を正確に反映しましょう。"
  },
  {
    step: 4,
    title: "BDSデータセットの仕様を作成する",
    titleShort: "BDS作成",
    icon: "📊",
    description: "ADLB, ADVS, ADEFF等のBDSデータセットの仕様を作成する。",
    details: [
      "PARAMCD/PARAMの定義（検査項目のマッピング）",
      "AVAL/AVALCのソース定義",
      "ベースライン(ABLFL)の定義とBASE値の導出",
      "変化量(CHG)・変化率(PCHG)の導出",
      "来院ウィンドウ(AVISIT)の定義",
      "解析レコード選択フラグ(ANL01FL等)の定義",
      "カテゴリ判定(CRIT1/CRIT1FL)の定義"
    ],
    tips: "来院ウィンドウの定義は、SAPに明記されていない場合もあります。統計解析担当者と事前に合意しましょう。",
    pitfalls: "BASEが欠測の場合、CHGも欠測にすべきか判断が必要です。SAPの規定に従いましょう。"
  },
  {
    step: 5,
    title: "OCCDS/その他のデータセット仕様を作成する",
    titleShort: "OCCDS/Other",
    icon: "⚠️",
    description: "ADAE等のOCCDSデータセット、ADTTE等の特殊データセットの仕様を作成する。",
    details: [
      "ADAE: MedDRAコーディング変数のマッピング",
      "ADAE: 発現フラグ（AOCCFL, AOCCPFL等）の導出",
      "ADAE: Treatment-Emergent AEの定義",
      "ADTTE: イベント定義（CNSR=0の条件）",
      "ADTTE: 打切り条件とその優先順位",
      "ADTTE: 起算日(STARTDT)の定義"
    ],
    tips: "ADAEのTreatment-Emergent（TRTEMFL）の定義は、治験薬投与期間中またはその後一定期間内に発現/悪化したAEとするのが一般的です。",
    pitfalls: "ADTTEの打切りルールは試験ごとに異なります。必ずSAPを確認し、統計担当者と合意しましょう。"
  },
  {
    step: 6,
    title: "仕様書をレビュー・検証する",
    titleShort: "レビュー",
    icon: "✅",
    description: "完成した仕様書の品質チェックとチームレビューを実施する。",
    details: [
      "ADaM IGの一般ルールへの準拠確認",
      "変数名・ラベル・型の整合性チェック",
      "導出ロジックの論理的整合性確認",
      "ADSL変数の参照関係の確認",
      "P21（Pinnacle 21）バリデーションルールの確認",
      "define.xml用のメタデータ（Value Level Metadata等）の確認",
      "チーム内レビュー（統計、プログラマー、DM）"
    ],
    tips: "P21 Community版（無料）で事前にバリデーションチェックを実行すると、よくあるエラーを早期発見できます。",
    pitfalls: "レビューなしで実装に進むと、プログラミング後の仕様変更コストが大きくなります。必ずレビューを経ましょう。"
  }
];

/**
 * ADaM用語集
 */
const GLOSSARY = [
  { term: "ADaM", fullForm: "Analysis Data Model", definition: "CDISC（Clinical Data Interchange Standards Consortium）が定めた解析データの標準モデル。SDTMデータを基に、統計解析に直接使用できる形式でデータを構造化する。" },
  { term: "CDISC", fullForm: "Clinical Data Interchange Standards Consortium", definition: "臨床試験データの標準規格を策定する国際的な非営利団体。SDTM、ADaM、CDASH等の標準を管理している。" },
  { term: "SDTM", fullForm: "Study Data Tabulation Model", definition: "臨床試験の生データを標準化した表形式モデル。ADaMのソースデータとなる。FDA/PMDAへの申請データの標準フォーマット。" },
  { term: "ADaMIG", fullForm: "ADaM Implementation Guide", definition: "ADaMの実装ガイドライン。各データセット構造の詳細ルール、変数の命名規則、導出ロジックの記載方法等を規定する。" },
  { term: "SAP", fullForm: "Statistical Analysis Plan", definition: "統計解析計画書。解析方法、対象集団、評価項目を詳細に規定する文書。ADaM仕様書作成の最重要参考資料。" },
  { term: "define.xml", fullForm: "Define-XML", definition: "データセットのメタデータ（変数定義、導出ロジック、コードリスト等）を記述するXMLファイル。規制当局への申請時に必須。" },
  { term: "BDS", fullForm: "Basic Data Structure", definition: "ADaMの基本データ構造。PARAMCD/PARAMとAVAL/AVALCを核とした縦持ち構造。ADLB, ADVS等が該当。" },
  { term: "OCCDS", fullForm: "Occurrence Data Structure", definition: "イベント発現データの構造。有害事象（ADAE）等で使用。発現フラグ（AOCCFL等）が特徴。" },
  { term: "FAS", fullForm: "Full Analysis Set", definition: "最大の解析対象集団。ICH E9のITTの原則に近い概念。ランダム化され、少なくとも1回の有効性評価がある被験者。" },
  { term: "ITT", fullForm: "Intent-to-Treat", definition: "治療意図解析。ランダム化された全被験者を対象とする解析。主要解析に使用されることが多い。" },
  { term: "PP", fullForm: "Per-Protocol", definition: "治験実施計画書適合集団。重大なプロトコル逸脱のない被験者で構成。感度分析に使用。" },
  { term: "P21", fullForm: "Pinnacle 21", definition: "CDISCデータのバリデーション（検証）ツール。ADaM/SDTMデータの品質チェックに業界標準として使用される。" },
  { term: "MedDRA", fullForm: "Medical Dictionary for Regulatory Activities", definition: "規制活動のための医学辞典。有害事象のコーディングに使用。PT（基本語）、SOC（器官別大分類）等の階層構造を持つ。" },
  { term: "TFL", fullForm: "Tables, Figures, and Listings", definition: "統計解析結果を表・図・一覧表にまとめた成果物。ADaMデータセットから直接出力される。" },
  { term: "TEAE", fullForm: "Treatment-Emergent Adverse Event", definition: "治験薬投与後に新たに発現または悪化した有害事象。安全性解析の基本単位。" }
];

/**
 * 仕様書テンプレート（ビルダー用）
 */
const SPEC_TEMPLATES = {
  adsl: {
    name: "ADSL",
    description: "被験者レベル解析データセット",
    requiredVars: ["STUDYID", "USUBJID", "SUBJID", "SITEID", "AGE", "SEX", "RACE", "TRT01P", "TRT01PN", "TRT01A", "TRT01AN", "TRTSDT", "TRTEDT", "ITTFL", "SAFFL"],
    optionalVars: ["AGEGR1", "AGEGR1N", "ETHNIC", "COUNTRY", "FASFL", "PPROTFL"],
    sortKeys: "STUDYID, USUBJID"
  },
  adae: {
    name: "ADAE",
    description: "有害事象解析データセット",
    requiredVars: ["STUDYID", "USUBJID", "AETERM", "AEDECOD", "AEBODSYS", "AESEV", "AESER", "AEREL", "ASTDT", "ADT", "ADY", "AOCCFL", "AOCCPFL", "AOCCSFL"],
    optionalVars: ["AENDT", "CRIT1", "CRIT1FL"],
    sortKeys: "STUDYID, USUBJID, ASTDT, AETERM"
  },
  adlb: {
    name: "ADLB",
    description: "臨床検査解析データセット",
    requiredVars: ["STUDYID", "USUBJID", "PARAMCD", "PARAM", "AVAL", "ADT", "ADY", "AVISIT", "AVISITN", "BASE", "CHG", "ABLFL", "ANL01FL"],
    optionalVars: ["AVALC", "BASEC", "PCHG", "PARCAT1", "ATPT", "ATPTN", "PARAMN", "CRIT1", "CRIT1FL"],
    sortKeys: "STUDYID, USUBJID, PARAMCD, ADT, ATPTN"
  },
  advs: {
    name: "ADVS",
    description: "バイタルサイン解析データセット",
    requiredVars: ["STUDYID", "USUBJID", "PARAMCD", "PARAM", "AVAL", "ADT", "ADY", "AVISIT", "AVISITN", "BASE", "CHG", "ABLFL", "ANL01FL"],
    optionalVars: ["AVALC", "BASEC", "PCHG", "ATPT", "ATPTN", "PARAMN", "CRIT1", "CRIT1FL"],
    sortKeys: "STUDYID, USUBJID, PARAMCD, ADT, ATPTN"
  },
  adtte: {
    name: "ADTTE",
    description: "Time-to-Event解析データセット",
    requiredVars: ["STUDYID", "USUBJID", "PARAMCD", "PARAM", "AVAL", "CNSR", "STARTDT", "ADT"],
    optionalVars: ["EVNTDESC", "PARAMN"],
    sortKeys: "STUDYID, USUBJID, PARAMCD"
  }
};

/**
 * クイズデータ
 */
const QUIZ_DATA = [
  {
    id: 1,
    question: "ADaMの正式名称は何か？",
    choices: ["Analysis Data Model", "Analytical Data Management", "Advanced Data Mapping", "Application Data Module"],
    answer: 0,
    explanation: "ADaMはAnalysis Data Modelの略で、CDISCが策定した臨床試験の解析データ標準です。SDTMデータを統計解析に適した形式に変換する際の規格を定めています。"
  },
  {
    id: 2,
    question: "ADSLの特徴として正しいものは？",
    choices: [
      "1被験者につき複数レコードを持つ",
      "1被験者につき1レコードのみ",
      "パラメータごとにレコードを持つ",
      "イベントごとにレコードを持つ"
    ],
    answer: 1,
    explanation: "ADSLはSubject-Level Analysis Datasetの略で、1被験者につき必ず1レコード（1:1構造）です。被験者の人口統計情報、治療変数、集団フラグ等を格納します。"
  },
  {
    id: 3,
    question: "BDSの核心となる変数の組み合わせは？",
    choices: [
      "AETERM + AEDECOD",
      "PARAMCD + AVAL/AVALC",
      "TRT01P + TRT01A",
      "CNSR + STARTDT"
    ],
    answer: 1,
    explanation: "BDS（Basic Data Structure）はPARAMCD（パラメータコード）とAVAL/AVALC（解析値）を核とした縦持ち構造です。ADLB、ADVS、ADEFF等がこの構造に該当します。"
  },
  {
    id: 4,
    question: "ABLFL='Y'のレコードは何を示すか？",
    choices: [
      "異常値レコード",
      "最終来院レコード",
      "ベースラインレコード",
      "解析除外レコード"
    ],
    answer: 2,
    explanation: "ABLFLはBaseline Record Flagで、Y=ベースラインレコードを示します。このレコードのAVAL値がBASE（ベースライン値）となり、投与後の変化量（CHG = AVAL - BASE）の基準になります。"
  },
  {
    id: 5,
    question: "CHG（Change from Baseline）の計算式は？",
    choices: [
      "AVAL × BASE",
      "AVAL + BASE",
      "AVAL - BASE",
      "(AVAL - BASE) / BASE × 100"
    ],
    answer: 2,
    explanation: "CHG = AVAL - BASE です。ベースラインからの変化量を表します。なお、(AVAL - BASE) / BASE × 100 はPCHG（変化率）の計算式です。CHGはベースラインレコード（ABLFL='Y'）ではnullとします。"
  },
  {
    id: 6,
    question: "SAFPLの「Safety Population」に該当する被験者の一般的な定義は？",
    choices: [
      "同意書に署名した全被験者",
      "ランダム化された全被験者",
      "治験薬を1回以上投与された被験者",
      "試験を完了した被験者"
    ],
    answer: 2,
    explanation: "Safety Population（安全性解析対象集団）は、一般的に治験薬を少なくとも1回投与された被験者と定義されます。SAFFLフラグで管理されます。"
  },
  {
    id: 7,
    question: "ADYの計算で、治験薬投与初日（TRTSDT）は何日目とするか？",
    choices: ["Day 0", "Day 1", "Day -1", "Day 0.5"],
    answer: 1,
    explanation: "ADaM規則では、投与日をDay 1とします。Day 0は存在しません。投与後: ADY = ADT - TRTSDT + 1、投与前: ADY = ADT - TRTSDT（負の値になる）。"
  },
  {
    id: 8,
    question: "AOCCFLフラグの役割は？",
    choices: [
      "ベースラインレコードの特定",
      "被験者内で最初に発現したイベントの特定",
      "異常値の特定",
      "欠測値の特定"
    ],
    answer: 1,
    explanation: "AOCCFL（1st Occurrence within Subject Flag）は、被験者内で最初に発現したイベントにYを設定します。発現頻度テーブルで被験者数を重複なくカウントする際に使用します。"
  },
  {
    id: 9,
    question: "ADTTEでCNSR=0が意味するのは？",
    choices: [
      "打切り（イベント未発生）",
      "イベント発生",
      "データ欠測",
      "解析除外"
    ],
    answer: 1,
    explanation: "ADTTEのCNSR（Censor）は、0=イベント発生、1=打切り（Censored）を意味します。Kaplan-Meier解析やCox回帰で使用されます。"
  },
  {
    id: 10,
    question: "ADaM仕様書作成で最初に確認すべき文書は？",
    choices: [
      "治験薬概要書（IB）",
      "統計解析計画書（SAP）",
      "治験実施計画書（Protocol）",
      "症例報告書（CRF）"
    ],
    answer: 1,
    explanation: "ADaM仕様書作成の出発点はSAP（Statistical Analysis Plan）です。SAPにどの解析にどの変数が必要かが記載されており、これに基づいてデータセット・変数の設計を行います。"
  },
  {
    id: 11,
    question: "define.xmlの役割は？",
    choices: [
      "データのバリデーション実行",
      "統計解析の自動実行",
      "データセットのメタデータ記述",
      "CRFのデザイン定義"
    ],
    answer: 2,
    explanation: "define.xmlは、データセットの構造・変数定義・導出ロジック・コードリスト等のメタデータをXML形式で記述するファイルです。FDA/PMDAへの申請時に必須です。"
  },
  {
    id: 12,
    question: "TEAEの定義として一般的なものは？",
    choices: [
      "試験終了後に発現したAE",
      "試験開始前から存在したAE",
      "治験薬投与後に新たに発現または悪化したAE",
      "重篤な有害事象のみ"
    ],
    answer: 2,
    explanation: "TEAE（Treatment-Emergent Adverse Event）は、治験薬投与開始後に新たに発現した、または既存の状態が悪化した有害事象です。ADAEのTRTEMFLフラグで管理されます。"
  }
];

/**
 * クイズ結果の診断マップ
 */
const QUIZ_RESULTS = {
  expert: {
    min: 11,
    title: "ADaMエキスパート 🏆",
    description: "ADaMの構造と仕様書作成を完全に理解しています。リードプログラマーとして仕様書レビューもできるレベルです。",
    advice: "この知識を活かして、後輩の指導やdefine.xml作成にも挑戦してみましょう。"
  },
  advanced: {
    min: 9,
    title: "上級者 📈",
    description: "ADaMの主要概念をしっかり理解しています。実務で仕様書を作成できるレベルです。",
    advice: "ADTTEやdefine.xml等の応用的なトピックにも取り組むと、さらにスキルアップできます。"
  },
  intermediate: {
    min: 6,
    title: "中級者 📊",
    description: "基本的な構造は理解していますが、応用的な部分で理解が不足しています。",
    advice: "BDSのフラグ変数（ABLFL, ANL01FL等）やOCCDSの発現フラグの仕組みを復習しましょう。"
  },
  beginner: {
    min: 3,
    title: "初級者 📘",
    description: "ADaMの基礎概念を学び始めた段階です。まだ実務での仕様書作成は難しいでしょう。",
    advice: "まずはADSLとBDSの基本構造から理解を深めましょう。変数辞書を繰り返し確認することをお勧めします。"
  },
  novice: {
    min: 0,
    title: "入門者 🌱",
    description: "ADaMはまだこれからです。でも大丈夫、基礎から体系的に学べます。",
    advice: "「ADaM基礎」ページから始めて、ADSL→BDS→OCCDSの順に学んでいきましょう。"
  }
};
