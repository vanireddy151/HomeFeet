const titleCase = (value = '') =>
  String(value)
    .toLowerCase()
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.replace(/^easts$/i, 'east').replace(/^wests$/i, 'west'))
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');

const stripNumberFormatting = (value = '') => String(value).replace(/,/g, '');

const valueAfterEquals = (value = '') => {
  const match = String(value).match(/=\s*([\d,.]+)/);
  return match?.[1] ? stripNumberFormatting(match[1]) : '';
};

const numericValue = (value = '') => {
  const parsed = Number(String(value || '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const isLargeAcreLand = (details = {}) =>
  /acre/i.test(details.areaUnit || '') && numericValue(details.totalArea) > 2;

const normalizeSummary = (value = '') =>
  String(value || '')
    .replace(/\bdevelopement\b/gi, 'development')
    .replace(/\bdevelopmant\b/gi, 'development')
    .replace(/\bdevlopment\b/gi, 'development')
    .replace(/\bp\s*villa\b/gi, 'villa')
    .replace(/\(\s*ac\.?\s*gts?\.?\s*\)/gi, ' acres')
    .replace(/\bfarm\s*plots?\b/gi, 'farm plots')
    .replace(/\bretio\b/gi, 'ratio')
    .replace(/\boutrate\b/gi, 'outright')
    .replace(/\bout\s*rate\b/gi, 'outright')
    .replace(/\baceres?\b/gi, 'acres')
    .replace(/\bacers?\b/gi, 'acres')
    .replace(/\bacrs?\b/gi, 'acres')
    .replace(/\bacr\b/gi, 'acre')
    .replace(/\b(\d+)\s*-\s*acres?\b/gi, '$1 acres')
    .replace(/\bs\s*yds?\b/gi, 'sq yards')
    .replace(/\bsyds?\b/gi, 'sq yards')
    .replace(/\bsq\s*yds?\b/gi, 'sq yards')
    .replace(/\bsqyds?\b/gi, 'sq yards')
    .replace(/\bsq\.?\s*(?:yds?|yrds?|yards?)\b/gi, 'sq yards')
    .replace(/\bsq\.?\s*ft\.?\b/gi, 'sq ft')
    .replace(/\bsqft\b/gi, 'sq ft')
    .replace(/\bsquare\s*feet\b/gi, 'sq ft')
    .replace(/\bsquare\s*(?:yds?|yrds?)\b/gi, 'square yards')
    .replace(/\bout\s*right\b/gi, 'outright')
    .replace(/\bfront\s+edge\b/gi, 'frontage')
    .replace(/\bfront\s+age\b/gi, 'frontage')
    .replace(/\bpin\s*code\b/gi, 'pincode')
    .replace(/\bfeet\b/gi, 'ft')
    .replace(/\bfeets\b/gi, 'ft')
    .replace(/\beasts\b/gi, 'east')
    .replace(/\bwests\b/gi, 'west')
    .replace(/\bcomercial\b/gi, 'commercial')
    .replace(/\bcommerical\b/gi, 'commercial')
    .replace(/\bsarver\b/gi, 'survey')
    .replace(/\bnala\s+conversation\b/gi, 'NALA conversion')
    .replace(/\bhi\s*rises?\b/gi, 'high-rise')
    .replace(/\bborampet\b/gi, 'Bowrampet')
    .replace(/\bmoinaabad\b/gi, 'Moinabad')
    .replace(/\bmoinabad\b/gi, 'Moinabad')
    .replace(/\bconvartion\b/gi, 'conversion')
    .replace(/\bcr\b/gi, 'Cr')
    .replace(/\bsy\.?\s*no\.?\b/gi, 'survey no')
    .replace(/\bsurvey\s+numbers?\b/gi, 'survey no')
    .replace(/\bratio\s+(\d{2})\s*[:-]?\s*(\d{2})\b/gi, 'ratio $1:$2')
    .replace(/[ \t]+/g, ' ')
    .trim();

const extractChoice = (text, choices) =>
  choices.find((choice) => new RegExp(`\\b${choice.replace('-', '[- ]?')}\\b`, 'i').test(text)) || '';

const extractSideLengthFromSummary = (summary, side) => {
  const pattern = new RegExp(`\\b${side}\\s*(?:side|length|width)?(?:\\s*\\(?\\s*(?:ft|feet)\\s*\\)?)?\\s*[.:\\-]?\\s*([\\d,.]+)(?![\\d,.\\/])(?:\\s*(?:ft|feet))?(?!\\s*roads?\\b)`, 'gi');
  const matches = Array.from(String(summary).matchAll(pattern))
    .map((match) => (match[1]?.replace(/,/g, '').replace(/\.$/, '') || ''))
    .filter(Boolean);
  return matches[matches.length - 1] || '';
};

const extractCornerFacingFromSummary = (summary) =>
  titleCase(
    String(summary).match(/\b(north|south|east|west)\s*(?:-|&|and|\s)\s*(north|south|east|west)\s+corner\s+plots?\b/i)?.[1] ||
    String(summary).match(/\b(north|south|east|west)\s*(?:-|&|and|\s)\s*(north|south|east|west)\s+corner\b/i)?.[1] ||
    ''
  );

const extractNumber = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    const value = match?.[1] || match?.[2];
    if (value) return String(value).replace(/,/g, '');
  }
  return '';
};

const extractAmount = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match?.[1]) continue;
    const value = Number(String(match[1]).replace(/,/g, ''));
    if (!Number.isFinite(value)) continue;
    const unit = String(match[2] || '').toLowerCase();
    if (/cr|crore/.test(unit)) return String(value * 10000000);
    if (/l|lac|lakh/.test(unit)) return String(value * 100000);
    return String(value);
  }
  return '';
};

const extractAreaFromSummary = (summary) => {
  const labelledArea = String(summary).match(/\b(?:plot\s*size|plot\s*area|land\s*area|total\s*(?:area|extent)|square\s*feet|sq\.?\s*ft|sqft|square\s*yards?|sq\.?\s*yards?|syds?|area)\s*[:-]?\s*([^\n.]+)/i)?.[1] || '';
  const labelledTotal = valueAfterEquals(labelledArea);
  if (labelledTotal) return labelledTotal;

  return extractNumber(summary, [
    /(?:plot\s*size|plot\s*area|land\s*area)\s*[:-]?\s*([\d,.]+)\s*-?\s*(?:acres?|sq\.?\s*ft|square\s*feet|sqft|sq\.?\s*yards?|square\s*yards?|syds?)/i,
    /(?:total\s*)?area\s*[:-]?\s*([\d,.]+)\s*-?\s*(?:acres?|sq\.?\s*ft|square\s*feet|sqft|sq\.?\s*yards?|square\s*yards?|syds?)?/i,
    /(?:total\s*)?([\d,.]+)\s*-?\s*(?:sq\.?\s*ft|square\s*feet|sqft|sq\.?\s*yards?|square\s*yards?|syds?|acres?)/i
  ]);
};

const extractPlotDimensionPair = (summary) => {
  const labelledSize = String(summary).match(/\b(?:sizes?|dimensions?|plot\s*dimensions?)\s*[:-]?\s*([^\n.]+)/i)?.[1] || '';
  const source = labelledSize || summary;
  const dimensionMatch =
    String(source).match(/=\s*([\d,.]+)\s*(?:'|ft|feet)?\s*(?:x|×|by|\*)\s*([\d,.]+)/i) ||
    String(source).match(/([\d,.]+)\s*(?:'|ft|feet)?\s*(?:x|×|by|\*)\s*([\d,.]+)/i);
  return dimensionMatch?.[1] && dimensionMatch?.[2]
    ? { length: stripNumberFormatting(dimensionMatch[1]), width: stripNumberFormatting(dimensionMatch[2]) }
    : { length: '', width: '' };
};

const extractDirectionalRoadSizes = (summary) => {
  const roads = {};
  const pairedRoadPattern = /\b(north|south|east|west)\s*(?:&|and)\s*(north|south|east|west)\s*([\d,.]*\d[\d,.]*)\s*\/\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*roads?\b/gi;
  const pattern = /\b(north|south|east|west)\s*[:-]?\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*road\b|\b([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s+(north|south|east|west)\s+road\b/gi;
  let match;

  while ((match = pairedRoadPattern.exec(summary)) !== null) {
    const firstSide = titleCase(match[1]);
    const secondSide = titleCase(match[2]);
    const firstValue = (match[3] || '').replace(/,/g, '');
    const secondValue = (match[4] || '').replace(/,/g, '');
    if (firstSide && firstValue) roads[firstSide] = firstValue;
    if (secondSide && secondValue) roads[secondSide] = secondValue;
  }

  while ((match = pattern.exec(summary)) !== null) {
    const side = titleCase(match[1] || match[4]);
    const value = (match[2] || match[3] || '').replace(/,/g, '');
    if (side && value) roads[side] = value;
  }

  return roads;
};

const selectRoadFacingFromDirectionalRoads = (roads) => {
  const entries = Object.entries(roads)
    .map(([side, value]) => ({ side, value: Number(String(value).replace(/,/g, '')) }))
    .filter((entry) => Number.isFinite(entry.value) && entry.value > 0);
  if (!entries.length) return '';
  return entries.sort((a, b) => b.value - a.value)[0].side;
};

const extractRoadSizeFromSummary = (summary, facing = '', directionalRoadSizes = {}, defaultWhenRoadMentioned = false) => {
  const facingRoadSize = directionalRoadSizes[facing];
  if (facingRoadSize) return facingRoadSize;

  const cornerRoadPair =
    String(summary).match(/\b([\d,.]*\d[\d,.]*)\s*(?:&|and|\/)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*roads?\s+corner\b/i) ||
    String(summary).match(/\bcorner\b[^.\n,;]*?([\d,.]*\d[\d,.]*)\s*(?:&|and|\/)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*roads?\b/i);
  if (cornerRoadPair?.[1] && cornerRoadPair?.[2]) {
    const values = [cornerRoadPair[1], cornerRoadPair[2]]
      .map((value) => Number(String(value).replace(/,/g, '')))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length) return String(Math.max(...values));
  }

  const approachRoadPair =
    String(summary).match(/\bapproach\s+roads?\s*[:-]?\s*([\d,.]*\d[\d,.]*)\s*(?:&|and|\/)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*roads?\b/i) ||
    String(summary).match(/\b([\d,.]*\d[\d,.]*)\s*(?:&|and|\/)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*roads?\s+respectively\b/i);
  if (approachRoadPair?.[1] && approachRoadPair?.[2]) {
    const values = [approachRoadPair[1], approachRoadPair[2]]
      .map((value) => Number(String(value).replace(/,/g, '')))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length) return String(Math.max(...values));
  }

  const roadRange =
    String(summary).match(/\b(?:main\s*)?road\b[^.\n,;]*?([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*(?:to|-|–|—)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?/i) ||
    String(summary).match(/\b([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?\s*(?:to|-|–|—)\s*([\d,.]*\d[\d,.]*)\s*(?:ft|feet)?[^.\n,;]*?\b(?:main\s*)?road\b/i);
  if (roadRange?.[1] && roadRange?.[2]) {
    const values = [roadRange[1], roadRange[2]]
      .map((value) => Number(String(value).replace(/,/g, '')))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length) return String(Math.max(...values));
  }

  const genericRoad = String(summary).match(/\b(?:main\s*)?road\b[^.\n,;]*?([\d,.]*\d[\d,.]*)\s*(?:ft|feet)\b/i)?.[1]
    || String(summary).match(/\broads?\s*[:-]?\s*([\d,.]*\d[\d,.]*)\s*(?:'|ft|feet)?\s*(?:wide|wides|width)?\b/i)?.[1]
    || String(summary).match(/\b([\d,.]*\d[\d,.]*)\s*(?:ft|feet)\s*(?:main\s*)?road\b/i)?.[1];
  if (genericRoad) return genericRoad.replace(/,/g, '');
  return defaultWhenRoadMentioned && /\b(?:road|black\s*top|bt\s*road|blacktop)\b/i.test(summary) ? '30' : '';
};

const extractPerSqYardPrice = (summary) => {
  const amountBeforePerAcrePrice = String(summary).match(/\b(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)\s*(?:per\s*)?acres?\s*price\b/i);
  if (amountBeforePerAcrePrice?.[1]) {
    return '';
  }

  const directAmountBeforePerAcre = String(summary).match(/\b(?:rs\.?|inr|₹)?\s*([\d,]*\.?\d+)\s*(cr|crore|lakh|lac|l)\s*(?:per|\/)\s*acres?\b/i);
  if (directAmountBeforePerAcre?.[1]) {
    return '';
  }

  const perAcre = String(summary).match(/\bper\s*acres?\s*[:-]?\s*(?:is\s*)?(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)?\b/i);
  if (perAcre?.[1]) {
    return '';
  }

  const amountBeforePerAcre = String(summary).match(/\b(?:outright\s*price|price|outright)?\s*[:-]?\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)?\s*(?:per|\/)\s*acres?\b/i);
  if (amountBeforePerAcre?.[1]) {
    return '';
  }

  const looseAmountBeforePerAcre = String(summary).match(/\b(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)\s*(?:per|\/)\s*acres?\b/i);
  if (looseAmountBeforePerAcre?.[1]) {
    return '';
  }

  const lakhPerSqYard = String(summary).match(/\b(?:price\s*[:-]?\s*)?(?:rs\.?|inr|₹)?\s*([\d,]*\.?\d+)\s*(lakh|lakhs|lac|lacs|l)\s*(?:per|\/)\s*(?:sq\.?\s*yards?|square\s*yards?|sqyds?|yard)\b/i);
  if (lakhPerSqYard?.[1]) {
    const value = Number(stripNumberFormatting(lakhPerSqYard[1]));
    if (Number.isFinite(value)) return String(value * 100000);
  }

  const shorthand = String(summary).match(/\bprice\s*[:-]?\s*(?:is\s*)?(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(k|thousand)?\s*(?:per|\/)\s*(?:sq\.?\s*yards?|square\s*yards?|sqyds?|yard)\b/i);
  if (shorthand?.[1]) {
    const value = Number(stripNumberFormatting(shorthand[1]));
    if (Number.isFinite(value)) return String(/k|thousand/i.test(shorthand[2] || '') ? value * 1000 : value);
  }
  return extractAmount(summary, [/(?:sq(?:uare)?\s*yard\s*price|price)\s*[:-]?\s*(?:rs\.?|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)?/i]);
};

const extractPerAcrePrice = (summary) =>
  extractAmount(summary, [
    /\b(?:per\s*acres?|per\s*acres?\s*price|acre\s*price)\s*[:-]?\s*(?:is\s*)?(?:rs\.?|inr|₹)?\s*([\d,.]+)(?![\d,.])\s*(cr|crores?|lakhs?|lacs?|l)?\b(?!\s*(?:ft|feet|road)\b)/i,
    /\b(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)\s*(?:per\s*)?acres?\s*price\b/i,
    /\b(?:outright\s*price|outrate\s*price|price|outright)?\s*[:-]?\s*(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crore|lakh|lac|l)?\s*(?:per|\/)\s*acres?\b/i,
    /\b(?:rs\.?|inr|₹)?\s*([\d,]*\.?\d+)\s*(cr|crore|lakh|lac|l)\s*(?:per|\/)\s*acres?\b/i
  ]);

const extractDeveloperRatio = (summary) => {
  const directRatio = String(summary).match(/\b(?:ratio|developer\s*ratio|development\s*ratio)\s*[:-]?\s*(\d{1,3})\s*[:-]\s*(\d{1,3})\b/i);
  if (directRatio) return `${directRatio[1]}:${directRatio[2]}`;

  const trailingRatio = String(summary).match(/\b(\d{1,3})\s*[:-]\s*(\d{1,3})\s*(?:ratio|developer\s*ratio|development\s*ratio)\b/i);
  if (trailingRatio) return `${trailingRatio[1]}:${trailingRatio[2]}`;

  const revenueShareRatio =
    String(summary).match(/\b(?:jv\s*terms?|revenue\s*share|area\s*sharing)\b(?:\s*means?)?\s*[:-]?\s*(\d{1,3})\s*[:-]\s*(\d{1,3})\b/i) ||
    String(summary).match(/\b(\d{1,3})\s*[:-]\s*(\d{1,3})\s*(?:revenue\s*share|area\s*sharing|jv\s*terms?)\b/i);
  if (revenueShareRatio) return `${revenueShareRatio[1]}:${revenueShareRatio[2]}`;

  const looseJvRatio =
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,80}?\b(?:land\s*)?owner\b\D{0,20}(\d{1,3})\b[\s\S]{0,50}?\bbuilder\b\D{0,20}(\d{1,3})\b/i) ||
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,80}?\bbuilder\b\D{0,20}(\d{1,3})\b[\s\S]{0,50}?\b(?:land\s*)?owner\b\D{0,20}(\d{1,3})\b/i) ||
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,40}?\b(\d{1,3})\s+(\d{1,3})\b/i) ||
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,60}?\b(\d{1,3})\s*(?::|-|\/|to|owner\s*:?\s*)\s*(\d{1,3})\b/i) ||
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,80}?\b(\d{1,3})\s*%?\s*(?:land\s*)?owner\b[\s\S]{0,50}?\b(\d{1,3})\s*%?\s*builder\b/i) ||
    String(summary).match(/\bjv\b(?:\s*terms?|\s*means?)?[\s\S]{0,80}?\b(\d{1,3})\s*%?\s*builder\b[\s\S]{0,50}?\b(\d{1,3})\s*%?\s*(?:land\s*)?owner\b/i);
  if (looseJvRatio) {
    const builderFirst = /\bbuilder\b[\s\S]{0,50}?\b\d{1,3}\s*%?[\s\S]{0,50}?\b(?:land\s*)?owner\b/i.test(looseJvRatio[0]);
    return builderFirst ? `${looseJvRatio[2]}:${looseJvRatio[1]}` : `${looseJvRatio[1]}:${looseJvRatio[2]}`;
  }

  const looseOwnerBuilder = String(summary).match(/\b(?:ratio\s*)?(\d{1,3})\s*%?\s*(?:land\s*)?owner\b[\s\S]{0,80}?\b(\d{1,3})\s*%?\s*builder\b/i);
  if (looseOwnerBuilder) return `${looseOwnerBuilder[1]}:${looseOwnerBuilder[2]}`;

  const looseBuilderOwner = String(summary).match(/\b(?:ratio\s*)?(\d{1,3})\s*%?\s*builder\b[\s\S]{0,80}?\b(\d{1,3})\s*%?\s*(?:land\s*)?owner\b/i);
  if (looseBuilderOwner) return `${looseBuilderOwner[2]}:${looseBuilderOwner[1]}`;

  return String(summary).match(/\b(50\s*:\s*50|60\s*:\s*40|70\s*:\s*30|80\s*:\s*20)\b/)?.[1]?.replace(/\s+/g, '') || '';
};

const extractPartlySaleDetails = (summary, perAcrePrice = '') => {
  const explicitPartlySale = String(summary).match(/(?:partly\s*sale|part\s*sale|partial\s*sale)\s*[:-]?\s*(yes|no)?\s*([\d,.]+)?\s*(acres?|sq\.?\s*ft|square\s*feet|sqft|sq\.?\s*yards?|square\s*yards?)?/i);
  if (explicitPartlySale) {
    const unitText = explicitPartlySale[3] || '';
    return {
      partlySale: explicitPartlySale[1]?.toLowerCase() || (explicitPartlySale[2] ? 'yes' : ''),
      partlySaleValue: explicitPartlySale[2]?.replace(/,/g, '') || '',
      partlySaleUnit: /acre/i.test(unitText) ? 'Acres' : /\b(?:sq\.?\s*ft|square\s*feet|sqft)\b/i.test(unitText) ? 'Square Feet' : 'Square Yard',
      partlySalePrice: ''
    };
  }

  const outrightPart =
    String(summary).match(/\b([\d,.]+)\s*(?:acres?|acre)\s+(?:outright|out\s*right|outrate)\b/i) ||
    String(summary).match(/\b(?:outright|out\s*right|outrate)\s+([\d,.]+)\s*(?:acres?|acre)\b/i);
  if (!outrightPart) {
    return { partlySale: '', partlySaleValue: '', partlySaleUnit: 'Square Yard', partlySalePrice: '' };
  }

  const outrightIndex = String(summary).toLowerCase().indexOf(String(outrightPart[0]).toLowerCase());
  const outrightContext = outrightIndex >= 0 ? String(summary).slice(outrightIndex, outrightIndex + 180) : String(outrightPart[0]);
  const outrightPrice = extractAmount(outrightContext, [
    /\b(?:outright|out\s*right|outrate)[\s\S]{0,80}?(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?\s*(?:per|\/)\s*acres?\b/i,
    /\b(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?\s*(?:per|\/)\s*acres?\b/i,
    /\b(?:rs\.?|inr|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?\b/i
  ]);

  return {
    partlySale: 'yes',
    partlySaleValue: outrightPart[1]?.replace(/,/g, '') || '',
    partlySaleUnit: 'Acres',
    partlySalePrice: outrightPrice || perAcrePrice
  };
};

const cleanLocationPart = (value = '') =>
  String(value)
    .replace(/\b(?:north|south|east|west)\s*\d+(?:\.\d+)?\b/gi, '')
    .replace(/\b(?:for|development|north|south|east|west|side|length|width|ft|feet|feets|meter|meters|metre|metres|meeters?|only|highway|facing|frontage|road|roads|size|sq|square|yards?|acres?|area|land|standalone|villa|high[- ]?rise|plotted|open[- ]?plot|outright|price|direct|owner|gunta|guntas|goodwill|advance|commercial|terms|lakhs?|lacs?|cr|crore|per|sale|selling|budget|amount|approach|survey|sy|no|towers?|surrounded|ratio|pincode|pin|code)\b/gi, '')
    .replace(/\b\d+(?:\.\d+)?\b/g, '')
    .replace(/[^\w\s.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const extractNamedText = (summary, labels) => {
  for (const label of labels) {
    const pattern = new RegExp(`\\b${label}\\b\\s*(?:name|street|address)?\\s*[:-]?\\s*([^,\n]+)`, 'i');
    const match = summary.match(pattern);
    if (match?.[1]) return cleanLocationPart(match[1]);
  }
  return '';
};

const cleanVillageCandidate = (value = '') => {
  const cleaned = cleanLocationPart(value)
    .replace(/\b(?:with|builder|khajoor|dates?|farm|total|compound|wall|gate|fix)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length > 2 ? words.slice(-2).join(' ') : cleaned;
};

const localityPincodeLookup = {
  miyapur: '500049',
  madinaguda: '500049',
  chandanagar: '500050',
  chanda_nagar: '500050',
  lingampally: '500019',
  serilingampally: '500019',
  kondapur: '500084',
  kukatpally: '500072',
  kphb: '500072',
  nizampet: '500090',
  manneguda: '501510',
  mangalguda: '501510',
  turkayamjal: '501510',
  injapur: '501510',
  tukkuguda: '501359',
  maheshwaram: '501359',
  nadargul: '501510',
  nadergul: '501510',
  kokapet: '500075',
  gachibowli: '500032',
  financial_district: '500032',
  nanakramguda: '500032',
  narsingi: '500075',
  jubilee_hills: '500033',
  jubileehills: '500033',
  bowrampet: '500043',
  bachupally: '500090',
  patancheru: '502319',
  tellapur: '502032',
  kollur: '502300',
  isnapur: '502307',
  shankarpally: '501203',
  bongulur: '501510',
  lb_nagar: '500074',
  lbnagar: '500074',
  l_b_nagar: '500074',
  kothapet: '500035',
  dilsukhnagar: '500060',
  uppal: '500039',
  habsiguda: '500007',
  habisguda: '500007',
  habsigudanacharam: '500007',
  habsiguda_nacharam: '500007',
  habsiguda_nacharam_main_road: '500007',
  habisguda_nacharam_main_road: '500007',
  nacharam: '500076',
  mallapur: '500076',
  cherlapally: '501301',
  kompally: '500014',
  medchal: '501401',
  shamshabad: '501218',
  shamsabad: '501218',
  rajendranagar: '500030',
  manikonda: '500089',
  shaikpet: '500008',
  suchitra: '500067',
  alwal: '500010',
  sainikpuri: '500094',
  ecil: '500062',
  meerpet: '500097',
  hayathnagar: '501505',
  vanasthalipuram: '500070',
  pocharam: '500088',
  ghatkesar: '501301',
  boduppal: '500092',
  tukkuguda: '501359',
  khalsa: '501506',
  ibrahimpatnam: '501506',
  rangareddy: '501506',
  khalsa_village: '501506',
  kandawada: '501503',
  kandwada: '501503',
  chevella: '501503',
  moinabad: '501504',
  moinaabad: '501504',
  venkatapur: '501504',
  imamguda: '501359',
  imam_guda: '501359',
  thukkuguda: '501359',
  maheshwaram_mandal: '501359',
  devanahalli: '562110',
  devanahalli_bengaluru_rural: '562110',
  brigade_orchards: '562110',
  brigade_orchards_sector: '562110',
  bengaluru_rural: '562110',
  thanisandra: '560077',
  thanisandra_main_road: '560077',
  manyata_tech_park: '560077',
  manyata_tech_park_peripheral_belt: '560077',
  bengaluru_urban: '560077'
};

const pincodeForLocality = (locality = '') => {
  const key = String(locality).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const compactKey = key.replace(/_/g, '');
  return localityPincodeLookup[key]
    || localityPincodeLookup[compactKey]
    || Object.entries(localityPincodeLookup).sort((a, b) => b[0].length - a[0].length).find(([localityKey]) =>
      key.includes(localityKey) || compactKey.includes(localityKey.replace(/_/g, ''))
    )?.[1]
    || '';
};

const localityNameFromLookup = (value = '') => {
  const key = String(value).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const compactKey = key.replace(/_/g, '');
  const match = Object.keys(localityPincodeLookup)
    .sort((a, b) => b.length - a.length)
    .find((localityKey) => {
      const compactLocality = localityKey.replace(/_/g, '');
      return key.includes(localityKey) || compactKey.includes(compactLocality);
    });
  return match ? titleCase(match.replace(/_/g, ' ')).replace(/-/g, ' ') : '';
};

const extractNearestLandmarkFromSummary = (summary, locality = '') => {
  const candidates = [];
  const distancePattern = /\b([A-Za-z][A-Za-z\s.'-]{1,60}?)(?:\s+)?(\d+(?:\.\d+)?)\s*(?:km|kms|kilometers?)\b/gi;
  let match;

  while ((match = distancePattern.exec(summary))) {
    const name = titleCase(cleanLocationPart(match[1] || ''))
      .replace(/\b(?:excellent|location|investment|for|from|to|and|or|direct|owner)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const distance = Number(match[2]);
    if (name && Number.isFinite(distance)) candidates.push({ name, distance });
  }

  const nearest = candidates.sort((a, b) => a.distance - b.distance)[0]?.name || '';
  if (nearest) return nearest;
  return locality ? `${titleCase(cleanLocationPart(locality))} Main Road` : '';
};

const extractLocationFields = (summary) => {
  const explicitPincode = summary.match(/\bpincode\s*[:-]?\s*(\d{6})\b/i)?.[1] || summary.match(/\b\d{6}\b/)?.[0] || '';
  const knownStates = ['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra'];
  const knownCities = ['Hyderabad', 'Secunderabad', 'Bengaluru', 'Bangalore', 'Chennai', 'Mumbai', 'Pune'];
  const isKarnatakaSummary = /\b(?:KA|Karnataka|Bengaluru\s+(?:Rural|Urban)|Bangalore\s+(?:Rural|Urban)|Devanahalli|Brigade\s+Orchards|Thanisandra|Manyata\s+Tech\s+Park)\b/i.test(summary);
  const state = extractChoice(summary, knownStates) || (isKarnatakaSummary ? 'Karnataka' : 'Telangana');
  const city = extractChoice(summary, knownCities) || (isKarnatakaSummary ? 'Bengaluru' : 'Hyderabad');
  const colonyName = extractNamedText(summary, ['colony']);
  let landmark = extractNamedText(summary, ['landmark', 'street', 'near']);
  const atLocation = cleanLocationPart(
    summary.match(/@\s*([A-Za-z][A-Za-z\s.'-]+?)(?:\s|,|\.|\n|$)/i)?.[1] ||
    summary.match(/\bat\s+([A-Za-z][A-Za-z\s.'-]+?)(?:\s|,|\.|\n|$)/i)?.[1] ||
    ''
  );
  const villageName = cleanVillageCandidate(
    summary.match(/\bvillage(?:\s*(?:&|and)\s*mandal)?\s*[:-]?\s*([A-Za-z][A-Za-z\s.'-]+?)(?:,|\n|$)/i)?.[1] ||
    summary.match(/\b([A-Za-z][A-Za-z\s.'-]+?)\s+village\b/i)?.[1] ||
    ''
  );
  const mandalName = cleanLocationPart(summary.match(/\b(?:village\s*(?:&|and)\s*)?mandal\s*[:-]?\s*([A-Za-z][A-Za-z\s.'-]+?)(?:,|\n|$)/i)?.[1] || '');
  const districtName = cleanLocationPart(summary.match(/\bdistrict\s*[:-]?\s*([A-Za-z][A-Za-z\s.'-]+?)(?:,|\n|$)/i)?.[1] || '');
  let locality = villageName || atLocation || extractNamedText(summary, ['locality', 'location']);
  const lookupLocality = localityNameFromLookup(summary);

  if (lookupLocality && (!locality || lookupLocality.toLowerCase().includes(String(locality).toLowerCase()))) {
    locality = lookupLocality;
  }

  if (!locality && lookupLocality) {
    locality = lookupLocality;
  }

  if (!locality) {
    const locationPartWithPincode = explicitPincode
      ? summary
          .split(/,|\n|\./)
          .map((part) => {
            let cleaned = cleanLocationPart(part);
            cleaned = cleaned.replace(new RegExp(`\\b${explicitPincode}\\b`, 'g'), ' ');
            [...knownStates, ...knownCities].forEach((name) => {
              cleaned = cleaned.replace(new RegExp(`\\b${name}\\b`, 'ig'), ' ');
            });
            return cleaned.replace(/\s+/g, ' ').trim();
          })
          .find((part) => part && part.length > 2)
      : '';

    const parts = summary
      .split(/,|\n|\./)
      .map((part) => {
        let cleaned = cleanLocationPart(part);
        if (explicitPincode) cleaned = cleaned.replace(new RegExp(`\\b${explicitPincode}\\b`, 'g'), ' ');
        [...knownStates, ...knownCities].forEach((name) => {
          cleaned = cleaned.replace(new RegExp(`\\b${name}\\b`, 'ig'), ' ');
        });
        return cleaned.replace(/\s+/g, ' ').trim();
      })
      .filter(Boolean)
      .filter((part) => !/^\d+$/.test(part))
      .filter((part) => part.length > 2)
      .filter((part) => !/^(?:by|and|or|with|near|from|to)$/i.test(part))
      .filter((part) => !/^\d+\s*(?:ft|sq yards|yards?|acres?|guntas?)?$/i.test(part))
      .filter((part) => !/\b(?:ft|side|length|width|price|road|owner|direct|outright|surrounded|goodwill|advance|lakhs?|lacs?|cr|crore|per acre|commercial terms|approach|survey|sy no|high rise|tower|ratio|pincode)\b/i.test(part))
      .filter((part) => !/^(?:rs\.?|₹)?\s*[\d,.]+\s*(?:l|lakh|lac|cr|crore)?$/i.test(part))
      .filter((part) => !new RegExp(`^(${knownStates.join('|')}|${knownCities.join('|')})$`, 'i').test(part));
    locality = locationPartWithPincode || parts[parts.length - 1] || '';
  }

  const resolvedPincode = explicitPincode
    || pincodeForLocality(locality)
    || pincodeForLocality(lookupLocality)
    || pincodeForLocality(colonyName)
    || pincodeForLocality(landmark)
    || pincodeForLocality(atLocation)
    || pincodeForLocality([city, state].filter(Boolean).join(' '))
    || pincodeForLocality(summary);

  landmark = landmark || extractNearestLandmarkFromSummary(summary, locality || colonyName || city);

  return {
    state,
    city: mandalName || city,
    locality: locality || colonyName || 'WhatsApp Intake',
    societyName: colonyName,
    landmark: landmark || 'Shared via WhatsApp',
    mandal: mandalName,
    district: districtName,
    pincode: resolvedPincode
  };
};

const parsePropertySummary = (summary = '') => {
  const normalizedSummary = normalizeSummary(summary);
  const usesAcreArea = /acre/i.test(normalizedSummary);
  const usesSqFtArea = /\b(?:sq\.?\s*ft|square\s*feet|sqft)\b/i.test(normalizedSummary);
  const approvalType = /hmda\s*(?:final\s*)?approval|hmda\s*approved|hmda\s*layout/i.test(normalizedSummary)
    ? 'HMDA Final Approval Layout'
    : /dtcp\s*(?:final\s*)?approval|dtcp\s*approved|dtcp\s*layout/i.test(normalizedSummary)
      ? 'DTCP Approved Layout'
      : /gp\s*layout|gram\s*panchayat/i.test(normalizedSummary)
        ? 'GP Layout'
        : /lrs\s*(?:fully\s*)?paid/i.test(normalizedSummary)
          ? 'LRS Fully Paid'
          : '';
  const developmentType = approvalType.includes('HMDA')
    ? 'hmda-layout'
    : approvalType.includes('DTCP')
      ? 'dtcp-layout'
      : approvalType.includes('GP')
        ? 'gp-layout'
        : /farm\s*plots?\s+development|farm\s*plots?\b|plotted\s+development/i.test(normalizedSummary)
          ? 'plotted'
        : /high[- ]?rise|hi[- ]?rise/i.test(normalizedSummary)
          ? 'high-rise'
        : /villa\s+development|development\s+site|villas?\b/i.test(normalizedSummary)
          ? 'villa'
        : usesAcreArea && /\b(?:land|plot|acres?|outright|purchase|sale|sell|buy)\b/i.test(normalizedSummary)
          ? 'land'
        : /commercial\s+(?:plot|land)|plot\s+for\s+sale|land\s+for\s+sale/i.test(normalizedSummary)
          ? 'open-plot'
          : extractChoice(normalizedSummary, [
    'standalone',
    'high-rise',
    'villa',
    'plotted',
    'open-plot',
    'land',
    'hmda-layout',
    'gp-layout',
    'dtcp-layout'
  ]) || 'standalone';
  const areaUnit = usesAcreArea ? 'Acres' : usesSqFtArea ? 'Sq Ft' : 'Sq Yards';
  const totalArea = extractAreaFromSummary(normalizedSummary) || '0';
  const skipPlotDimensions = isLargeAcreLand({ areaUnit, totalArea });
  const dimensionPair = skipPlotDimensions ? { length: '', width: '' } : extractPlotDimensionPair(normalizedSummary);
  const frontagePattern = /frontage(?:\s*width)?(?:\s*\(?\s*(?:ft|feet)\s*\)?)?\s*[:-]?\s*([\d,.]+)/i;
  const directionalRoadSizes = extractDirectionalRoadSizes(normalizedSummary);
  const roadFacingFromRoads = selectRoadFacingFromDirectionalRoads(directionalRoadSizes);
  const cornerFacing = extractCornerFacingFromSummary(normalizedSummary);
  const explicitRoadFacing = normalizedSummary.match(/(?:road\s*facing(?:\s*direction)?|frontage\s*(?:side|direction)?)\s*[:-]?\s*(north-east|north-west|south-east|south-west|north|south|east|west)/i)?.[1] || '';
  const spokenFacing =
    normalizedSummary.match(/\bfaces?\s*[:-]?\s*(north-east|north-west|south-east|south-west|north|south|east|west|easts|wests)\b/i)?.[1] ||
    normalizedSummary.match(/\b(north-east|north-west|south-east|south-west|north|south|east|west)\s+facing\b/i)?.[1] ||
    normalizedSummary.match(/\bfacing\s*[:-]?\s*(north-east|north-west|south-east|south-west|north|south|east|west)\b/i)?.[1] ||
    '';
  const facing = titleCase(spokenFacing || explicitRoadFacing || cornerFacing || roadFacingFromRoads);
  const locationFields = extractLocationFields(normalizedSummary);
  const developerRatio = extractDeveloperRatio(normalizedSummary);
  const hasDevelopmentTerms = Boolean(developerRatio || /\bfarm\s*plots?\s+development\b|\bdevelopment\s+advance\b/i.test(normalizedSummary));
  const frontageWidth = extractNumber(normalizedSummary, [frontagePattern])
    || (['East', 'West'].includes(titleCase(spokenFacing || explicitRoadFacing)) ? dimensionPair.width : dimensionPair.length)
    || (skipPlotDimensions ? '120' : '');
  const finalFacing = facing || (skipPlotDimensions ? 'East' : '');
  const finalRoadFacingDirection = titleCase(explicitRoadFacing || roadFacingFromRoads || spokenFacing || finalFacing) || (skipPlotDimensions ? 'East' : '');
  const finalRoadSize = extractRoadSizeFromSummary(normalizedSummary, finalRoadFacingDirection || finalFacing, directionalRoadSizes, skipPlotDimensions) || (skipPlotDimensions ? '30' : '');
  const zoningClassification = /\br[123]\s*zone\b|residential/i.test(normalizedSummary)
    ? 'Residential'
    : /\bcommercial\b/i.test(normalizedSummary)
      ? 'Commercial'
      : extractChoice(normalizedSummary, ['Residential', 'Commercial', 'Mixed Use', 'Agricultural', 'Industrial'])
        || (skipPlotDimensions ? 'Residential' : '');
  const perAcrePrice = extractPerAcrePrice(normalizedSummary);
  const perSqYardPrice = extractPerSqYardPrice(normalizedSummary);
  const partlySaleDetails = extractPartlySaleDetails(normalizedSummary, perAcrePrice);
  const advanceAmount = /\b(?:zero\s+advance|advance\s*[:-]?\s*zero)\b/i.test(normalizedSummary)
    ? '0'
    : extractAmount(normalizedSummary, [
      /advance\s*[:-]?\s*(?:rs\.?|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?/i,
      /(?:rs\.?|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?\s*(?:refundable\s*)?(?:security\s*)?advance\b/i
    ]);

  return {
    listingIntent: hasDevelopmentTerms ? 'development' : /\b(?:sell|sale|selling|per\s*acres?|card\s*value)\b/i.test(normalizedSummary) ? 'sell' : 'development',
    developmentType,
    plotNumber: normalizedSummary.match(/\bplot\s*numbers?\s*[:#-]?\s*([A-Za-z0-9/&\s-]+?)(?:\s*\(|,|\n|$)/i)?.[1]?.trim() || '',
    approvalType,
    ventureName: normalizedSummary.match(/\bventure(?:\s*name)?\s*[:-]?\s*([^\n.]+)/i)?.[1]?.replace(/[^\w\s.'-]/g, ' ').replace(/\s+/g, ' ').trim() || '',
    totalArea,
    areaUnit,
    northSideLength: extractSideLengthFromSummary(normalizedSummary, 'north') || dimensionPair.length,
    southSideLength: extractSideLengthFromSummary(normalizedSummary, 'south') || dimensionPair.length,
    eastSideLength: extractSideLengthFromSummary(normalizedSummary, 'east') || dimensionPair.width,
    westSideLength: extractSideLengthFromSummary(normalizedSummary, 'west') || dimensionPair.width,
    frontageWidth,
    roadSize: finalRoadSize,
    ...locationFields,
    facing: finalFacing,
    roadFacingDirection: finalRoadFacingDirection,
    developerRatio,
    goodwill: extractAmount(normalizedSummary, [
      /goodwill\s*[:-]?\s*(?:rs\.?|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?/i,
      /(?:rs\.?|₹)?\s*([\d,.]+)\s*(cr|crores?|lakhs?|lacs?|l)?\s*(?:flat\s*)?goodwill\b/i
    ]),
    advance: advanceAmount,
    ...partlySaleDetails,
    squareYardPrice: perAcrePrice || perSqYardPrice,
    priceUnit: perAcrePrice ? 'Acre' : 'Sq Yard',
    zoningClassification,
    description: normalizedSummary
  };
};

module.exports = {
  normalizeSummary,
  parsePropertySummary
};
