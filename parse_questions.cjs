const fs = require('fs');

const rawText = fs.readFileSync('raw_questions.txt', 'utf8');

const answerKeys = {
  1: 'A', 2: 'A', 3: 'A', 4: 'B', 5: 'C', 6: 'B', 7: 'A', 8: 'A', 9: 'C', 10: 'C',
  11: 'C', 12: 'B', 13: 'B', 14: 'A', 15: 'B', 16: 'A', 17: 'A', 18: 'A', 19: 'A', 20: 'B',
  21: 'C', 22: 'C', 23: 'B', 24: 'B', 25: 'A', 26: 'C', 27: 'B', 28: 'C', 29: 'B', 30: 'A',
  31: 'D', 32: 'A', 33: 'B', 34: 'A', 35: 'A', 36: 'C', 37: 'B', 38: 'B', 39: 'B', 40: 'C',
  41: 'A', 42: 'A', 43: 'A', 44: 'A', 45: 'A', 46: 'A', 47: 'C', 48: 'B', 49: 'B', 50: 'B',
  51: 'C', 52: 'B', 53: 'A', 54: 'A', 55: 'A', 56: 'B', 57: 'A', 58: 'C', 59: 'A', 60: 'C',
  61: 'A', 62: 'C', 63: 'C', 64: 'A', 65: 'B', 66: 'A', 67: 'B', 68: 'A', 69: 'B', 70: 'A',
  71: 'B', 72: 'C', 73: 'A', 74: 'A', 75: 'A', 76: 'A', 77: 'A', 78: 'C', 79: 'A', 80: 'B',
  81: 'B', 82: 'A', 83: 'A', 84: 'A', 85: 'A', 86: 'A', 87: 'A', 88: 'A', 89: 'B', 90: 'B',
  91: 'C', 92: 'B', 93: 'A', 94: 'A', 95: 'C', 96: 'C', 97: 'A', 98: 'C', 99: 'C', 100: 'A',
  101: 'C', 102: 'C', 103: 'B', 104: 'A', 105: 'B', 106: 'C', 107: 'A', 108: 'B', 109: 'B', 110: 'C',
  111: 'A', 112: 'C', 113: 'A', 114: 'B', 115: 'B', 116: 'A', 117: 'C', 118: 'A', 119: 'B', 120: 'A',
  121: 'A', 122: 'B', 123: 'B', 124: 'B', 125: 'B', 126: 'B', 127: 'B', 128: 'B', 129: 'A', 130: 'A',
  131: 'B', 132: 'A', 133: 'A', 134: 'B', 135: 'A', 136: 'B', 137: 'B', 138: 'B', 139: 'A', 140: 'A',
  141: 'B', 142: 'B', 143: 'B', 144: 'B', 145: 'A', 146: 'B', 147: 'C', 148: 'C', 149: 'B', 150: 'C'
};

const lines = rawText.split('\n').filter(l => l.trim() !== '');

let questions = [];
let currentQuestion = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line === 'Graph MCQ Practice Set') continue;
  
  // match "1. Question..." or "150. Question..."
  const match = line.match(/^(\d+)\.\s+(.*)/);
  if (match) {
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    const id = parseInt(match[1]);
    let qText = match[2];
    
    // Sometimes the question wraps to the next line. We can check if the next line starts with A/B/C/D
    let peekIdx = i + 1;
    while (peekIdx < lines.length && !lines[peekIdx].trim().match(/^[A-D]\.\s/)) {
      qText += ' ' + lines[peekIdx].trim();
      peekIdx++;
    }
    i = peekIdx - 1; // skip lines we just merged

    currentQuestion = {
      id: id,
      question: qText,
      optionsMap: {},
      options: [],
      answer: "",
      explanation: "Refer to class notes for explanation."
    };
  } else if (line.match(/^[A-D]\.\s/) && currentQuestion) {
    const letter = line.charAt(0);
    const text = line.substring(3).trim(); // remove "A. "
    currentQuestion.optionsMap[letter] = text;
  }
}

if (currentQuestion) {
  questions.push(currentQuestion);
}

// Map the options properly to A, B, C, D array order and assign answer string
const finalData = questions.map(q => {
  const opts = [
    q.optionsMap['A'] || "Option A",
    q.optionsMap['B'] || "Option B",
    q.optionsMap['C'] || "Option C",
    q.optionsMap['D'] || "Option D"
  ];
  
  const correctLetter = answerKeys[q.id];
  let answerStr = "";
  if (correctLetter && q.optionsMap[correctLetter]) {
    answerStr = q.optionsMap[correctLetter];
  } else {
    answerStr = opts[0];
  }

  return {
    id: q.id,
    question: q.question,
    options: opts,
    answer: answerStr,
    explanation: q.explanation
  };
});

fs.writeFileSync('./src/data/questions.json', JSON.stringify(finalData, null, 2));
console.log('Successfully generated questions.json with 150 questions.');
