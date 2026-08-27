# RED PEN

> **Your imagination is the spec.**

RED PEN turns rough hand-drawn ideas into working interactive software.

Draw an idea on paper, add notes about how it should behave, upload it, and RED PEN interprets the visual intent and turns it into an executable experience.

**Sketch → Understand → Build → Interact**

---

## ✏️ What is RED PEN?

Most AI coding tools start from text:

```text
Prompt
  ↓
AI decides the design
  ↓
Code
  ↓
UI
```

RED PEN starts from **human visual intent** instead:

```text
Imagination
    ↓
Drawing + annotations
    ↓
Visual understanding
    ↓
Structured visual specification
    ↓
Executable software
```

The goal is simple:

> **AI shouldn't replace human taste. It should make human ideas executable.**

Instead of asking AI to invent the design, RED PEN treats the human sketch as the source of truth.

---

## 🎬 Demo

For the demo, the sketch describes:

* a ball that slowly falls toward water
* a character that follows the mouse cursor
* ripples that appear when the ball reaches the water

The input is just a rough drawing with handwritten annotations.

RED PEN interprets the objects, relationships, motion, and behavior, then generates a working interactive experience from them.

```text
      BALL
        ↓
   falls slowly

       🙂
   CHARACTER
        ↔
      mouse

~~~~~~~~~~~~~~~~
      WATER

BALL hits WATER
       ↓
    ripples
```

The drawing is not just converted into an image.

**It becomes behavior.**

---

## 🧠 How It Works

```text
┌──────────────────────┐
│   Hand-drawn Sketch  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   OpenAI             │
│   Visual Reasoning   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      VisualSpec      │
│                      │
│ • Objects            │
│ • Relationships      │
│ • Interactions       │
│ • Style              │
│ • Annotations        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      Neo4j           │
│   Scene / Intent     │
│       Graph          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     OpenAI           │
│  Code Generation     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Interactive HTML/CSS │
│     + JavaScript     │
└──────────────────────┘
```

---

## 🔍 VisualSpec

RED PEN does not send the image directly to a code generator.

It first converts the drawing into a structured intermediate representation called **VisualSpec**.

Example:

```json
{
  "objects": [
    {
      "id": "ball",
      "type": "ball"
    },
    {
      "id": "character",
      "type": "character"
    },
    {
      "id": "water",
      "type": "water"
    }
  ],
  "interactions": [
    {
      "trigger": "time/start",
      "source": "ball",
      "target": "water",
      "action": "fall downward slowly"
    },
    {
      "trigger": "mouse movement",
      "source": "mouse",
      "target": "character",
      "action": "character follows cursor"
    },
    {
      "trigger": "ball enters water",
      "source": "ball",
      "target": "water",
      "action": "create expanding ripples"
    }
  ]
}
```

This separates:

* what should exist
* where it should exist
* how things relate
* how they should behave
* which parts are instructions rather than visible objects

---

## 🕸 Why Neo4j?

A drawing is not just a collection of pixels.

It contains relationships:

```text
BALL
  │
  │ above
  ▼
WATER

BALL ── hits ──→ WATER
                   │
                   ▼
                 RIPPLE

MOUSE ── controls ──→ CHARACTER
```

RED PEN stores this visual intent as a graph using **Neo4j**.

This creates a structured representation between human imagination and generated code.

---

## 🛠 Tech Stack

* **Next.js**
* **TypeScript**
* **OpenAI API**

  * multimodal visual understanding
  * structured visual specification
  * code generation
* **Neo4j Aura**

  * visual relationship / scene graph
* **HTML / CSS / JavaScript**

  * generated interactive output

---

## 🚀 Run Locally

### 1. Clone

```bash
git clone https://github.com/yamato1936/red-pen.git
cd red-pen
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

Add:

```bash
OPENAI_API_KEY=your_openai_api_key

NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=neo4j
```

### 4. Start

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧪 Usage

1. Draw an idea on paper.
2. Add arrows or handwritten behavior notes.
3. Take a photo of the drawing.
4. Upload it to RED PEN.
5. Click **ANALYZE IDEA**.
6. Review the generated VisualSpec.
7. Click **MAKE IT REAL**.
8. Interact with the generated software.

---

## 💡 Philosophy

Generative AI is very good at producing things that look reasonable.

But when AI makes every design decision, outputs often converge toward similar patterns.

RED PEN explores a different relationship between humans and AI:

```text
Human
→ imagination
→ taste
→ composition
→ intent

AI
→ interpretation
→ implementation
→ iteration
```

The human decides **what should exist**.

The AI figures out **how to make it work**.

---

## 🔮 What's Next?

Possible future directions:

* live drawing canvas
* iterative red-pen edits on generated software
* richer animation and physics interpretation
* visual memory and design references
* multi-page interactive products
* bidirectional editing between drawing and code
* collaborative visual programming

The long-term idea is broader than sketch-to-UI:

> **Turn human visual thinking directly into executable software.**

---

## Built at

**Fast Hacks - Hack Night - with OpenAI Codex**
Tokyo — August 27, 2026

---

# RED PEN

### **Draw it. Make it real.**

**Imagination → Software**
