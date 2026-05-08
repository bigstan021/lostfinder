//  Intelligent Matching Engine

// Stop words to ignore
const STOP_WORDS = ["the", "a", "an", "with", "and", "of", "in", "on"];

// Simple synonym map (expand later if you want)
const SYNONYMS = {
  phone: ["iphone", "android", "mobile"],
  bag: ["backpack", "handbag"],
  wallet: ["purse"],
};

// 🔹 Normalize text
const normalize = (text = "") => {
  return text
    .toLowerCase()
    .split(" ")
    .filter((word) => !STOP_WORDS.includes(word));
};

// 🔹 Expand synonyms
const expandWords = (words) => {
  let expanded = [...words];

  words.forEach((w) => {
    if (SYNONYMS[w]) {
      expanded.push(...SYNONYMS[w]);
    }
  });

  return expanded;
};

// 🔹 Keyword similarity
const keywordScore = (aWords, bWords) => {
  let score = 0;

  aWords.forEach((w) => {
    if (bWords.includes(w)) score += 2;
  });

  return score;
};

// 🔹 Location match
const locationScore = (locA, locB) => {
  if (!locA || !locB) return 0;

  if (locA.toLowerCase() === locB.toLowerCase()) return 3;

  if (locA.toLowerCase().includes(locB.toLowerCase()) ||
      locB.toLowerCase().includes(locA.toLowerCase())) return 2;

  return 0;
};

// 🔹 Date proximity (in days)
const dateScore = (dateA, dateB) => {
  if (!dateA || !dateB) return 0;

  const d1 = new Date(dateA);
  const d2 = new Date(dateB);

  const diff = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24);

  if (diff === 0) return 3;
  if (diff <= 2) return 2;
  if (diff <= 5) return 1;

  return 0;
};

//  MAIN FUNCTION
export const matchItems = (lostItem, foundItems) => {
  const results = [];

  const lostWords = expandWords(normalize(lostItem.itemName));

  foundItems.forEach((item) => {
    let score = 0;
    let reasons = [];

    const foundWords = expandWords(normalize(item.itemName));

    // 🔹 Name similarity
    const nameMatch = keywordScore(lostWords, foundWords);
    if (nameMatch > 0) {
      score += nameMatch;
      reasons.push("Name similarity");
    }

    // 🔹 Description similarity
    const descMatch = keywordScore(
      normalize(lostItem.description || ""),
      normalize(item.description || "")
    );
    if (descMatch > 0) {
      score += descMatch;
      reasons.push("Description similarity");
    }

    // 🔹 Location
    const locMatch = locationScore(
      lostItem.lostLocation,
      item.foundLocation
    );
    if (locMatch > 0) {
      score += locMatch;
      reasons.push("Location match");
    }

    // 🔹 Date
    const dateMatch = dateScore(
      lostItem.lostDate,
      item.foundDate
    );
    if (dateMatch > 0) {
      score += dateMatch;
      reasons.push("Date proximity");
    }

    if (score > 0) {
      const maxScore = 15; // adjust if you change weights
      const confidence = Math.round((score / maxScore) * 100);

      results.push({
        ...item,
        score,
        confidence,
        reasons,
      });
    }
  });

  // 🔥 Sort by best match
  return results.sort((a, b) => b.score - a.score);
};