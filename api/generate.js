const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const FILE_PATHS = {
    animals: "wordlists/animal_pass.txt",
    fruits: "wordlists/fruit_pass.txt",
    common: "wordlists/common_words_pass.txt",
    names: "wordlists/names_pass.txt",
  };

  function loadLines(filepath) {
    const fullPath = path.join(process.cwd(), filepath);
    const data = fs.readFileSync(fullPath, "utf-8");
    return data.split("\n").map(line => line.trim()).filter(Boolean);
  }

  function countWords(phrase) {
    return phrase.split(/\s+/).length;
  }

  function selectPhrases(files, maxWords = 4) {
    let remaining = maxWords;
    const selected = [];
    const keys = Object.keys(files).sort(() => Math.random() - 0.5);

    for (const key of keys) {
      if (remaining === 0) break;
      const options = loadLines(files[key]).sort(() => Math.random() - 0.5);

      for (const phrase of options) {
        const wordCount = countWords(phrase);
        if (wordCount <= remaining) {
          selected.push({ category: key, phrase });
          remaining -= wordCount;
          break;
        }
      }
    }

    return selected;
  }

  const selected = selectPhrases(FILE_PATHS);
  const password = selected
    .map(p => p.phrase.toLowerCase().split(/\s+/))
    .flat()
    .join("");

  res.json({ password, phrases: selected });
};

