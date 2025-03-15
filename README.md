# 🌿 Colorless Green Ideas Ipsum Generator

![Language](https://img.shields.io/badge/language-TypeScript%20%7C%20JavaScript-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-philosophical-purple)

> "Colorless green ideas sleep furiously" - _Noam Chomsky_

A sophisticated nonsensical text generator inspired by Chomsky's famous example of a grammatically correct but semantically meaningless sentence. When you need placeholder text that challenges perception and ignites intellectual curiosity, reach for this instead of Lorem Ipsum.

![Colorless Green Ideas Ipsum Generator Preview](/static/preview.png)

### Sample Output

> Teleological phenomena of metaphysical dialectics systematize intrinsically. Epistemologically, transparent axioms meditate. Dialectical epistemologies reify the qualia of being. Ontological monads subsume, notwithstanding phenomenological axioms particularize heuristically.
>
> Apophatic frameworks deterritorialize categorically. Transcendental noumena of hermeneutic quiddities presuppose intrinsically. Metaphysical abstractions ontologize, ergo solipsistic essences sublimate apodictically. Phenomenologically, noumenal aporia delineate.

## ✨ Features

- **Semantically Absurd**: Generates grammatically correct but meaningfully vacant prose
- **Philosophically Rich**: Employs vocabulary from epistemology, ontology, phenomenology & more
- **Customizable Output**: Control paragraph count and sentence density
- **Multiple Sentence Patterns**: Creates varied text structures following linguistic rules
- **Available as NPM package**: Easy integration into any JavaScript project
- **Web Interface**: Simple UI for generating text directly in the browser

## 🚀 Live Demo

Try it now: [Colorless Green Ideas Ipsum Generator](https://vzsoares.github.io/colorless-green-ideas-sleep-furiously-ipsum/)

## 📋 Usage Examples

### NPM Package

Install the [package](https://www.npmjs.com/package/colorless-green-ipsum):

```bash
npm install colorless-green-ipsum
# or
yarn add colorless-green-ipsum
```

Use in your project:

```typescript
// ESM
import { ColorlessGreenIpsum } from "colorless-green-ipsum";

// CommonJS
const { ColorlessGreenIpsum } = require("colorless-green-ipsum");

// Create a new generator instance
const generator = new ColorlessGreenIpsum();

// Generate 3 paragraphs with 4 sentences each
const philosophicalNonsense = generator.generate(3, 4);
console.log(philosophicalNonsense);
```

Custom styles usage: 

```typescript
// Create a generator
const generator = new ColorlessGreenIpsumGenerator();

// Add a custom "technical" style
generator.addCustomStyle("technical", {
  adjectives: ["digital", "algorithmic", "computational", "binary", "encrypted", "quantum", "neural"],
  nouns: ["networks", "protocols", "algorithms", "processors", "databases", "architectures", "interfaces"],
  verbs: ["compute", "process", "optimize", "integrate", "compile", "debug", "implement"]
  // Note: adverbs and conjunctions will use erudite defaults
});

// Set to the new style
generator.setStyle("technical");

// Generate text using the technical style
const technicalText = generator.generate(2, 3);

// List all available styles (including custom ones)
const styles = generator.getAvailableStyles(); 
// ['common', 'erudite', 'whimsical', 'technical']

// Remove the custom style when no longer needed
generator.removeCustomStyle("technical");
```

## 🔧 Dev

1. Clone the repository:

```bash
git clone https://github.com/yourusername/colorless-green-ipsum.git
```

2. Run dev script:

```bash
yarn dev:www
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Add new philosophical terms to the word banks
- Improve sentence patterns for more variety
- Enhance the UI/UX
- Submit bugs and feature requests

## 📚 Further Reading

- [Colorless Green Ideas Sleep Furiously](https://en.wikipedia.org/wiki/Colorless_green_ideas_sleep_furiously) - Wikipedia
- [Syntactic Structures](https://en.wikipedia.org/wiki/Syntactic_Structures) - Noam Chomsky's groundbreaking work
- [Philosophy of Language](https://plato.stanford.edu/entries/language-philosophy/) - Stanford Encyclopedia of Philosophy

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

_Created with paradoxical intent and metaphysical purpose._
