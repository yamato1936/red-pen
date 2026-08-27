export type VisualSpec = {
  title: string;
  summary: string;

  objects: {
    id: string;
    type: string;
    label: string;
    description: string;
    x: number;
    y: number;
    width: number;
    height: number;
    styleHints: string[];
  }[];

  relations: {
    from: string;
    to: string;
    type: string;
    description: string;
  }[];

  interactions: {
    trigger: string;
    source: string;
    target: string;
    action: string;
    description: string;
  }[];

  style: {
    mood: string;
    palette: string[];
    notes: string[];
  };

  ambiguities: string[];
};

export const visualSpecSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    summary: { type: "string" },

    objects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          label: { type: "string" },
          description: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
          width: { type: "number" },
          height: { type: "number" },
          styleHints: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: [
          "id",
          "type",
          "label",
          "description",
          "x",
          "y",
          "width",
          "height",
          "styleHints",
        ],
      },
    },

    relations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          from: { type: "string" },
          to: { type: "string" },
          type: { type: "string" },
          description: { type: "string" },
        },
        required: ["from", "to", "type", "description"],
      },
    },

    interactions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          trigger: { type: "string" },
          source: { type: "string" },
          target: { type: "string" },
          action: { type: "string" },
          description: { type: "string" },
        },
        required: [
          "trigger",
          "source",
          "target",
          "action",
          "description",
        ],
      },
    },

    style: {
      type: "object",
      additionalProperties: false,
      properties: {
        mood: { type: "string" },
        palette: {
          type: "array",
          items: { type: "string" },
        },
        notes: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["mood", "palette", "notes"],
    },

    ambiguities: {
      type: "array",
      items: { type: "string" },
    },
  },

  required: [
    "title",
    "summary",
    "objects",
    "relations",
    "interactions",
    "style",
    "ambiguities",
  ],
} as const;