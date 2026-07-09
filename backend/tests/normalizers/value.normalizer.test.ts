import { describe, expect, it } from "vitest";
import { ValueNormalizer } from "../../src/normalizers/value.normalizer.js";

describe("ValueNormalizer", () => {
  const normalizer = new ValueNormalizer();

  it("should trim whitespace", () => {
    expect(
      normalizer.normalize([
        {
          name: "  John  ",
        },
      ]),
    ).toEqual([
      {
        name: "John",
      },
    ]);
  });

  it("should collapse multiple spaces", () => {
    expect(
      normalizer.normalize([
        {
          name: "John     Doe",
        },
      ]),
    ).toEqual([
      {
        name: "John Doe",
      },
    ]);
  });

  it("should convert empty string to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert NA to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "NA",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert n/a to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "n/a",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert undefined string to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "undefined",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert null string to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "null",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert dash to null", () => {
    expect(
      normalizer.normalize([
        {
          name: "-",
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should preserve numbers", () => {
    expect(
      normalizer.normalize([
        {
          age: 22,
        },
      ]),
    ).toEqual([
      {
        age: 22,
      },
    ]);
  });

  it("should preserve booleans", () => {
    expect(
      normalizer.normalize([
        {
          active: true,
        },
      ]),
    ).toEqual([
      {
        active: true,
      },
    ]);
  });

  it("should convert undefined to null", () => {
    expect(
      normalizer.normalize([
        {
          name: undefined,
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });

  it("should convert null to null", () => {
    expect(
      normalizer.normalize([
        {
          name: null,
        },
      ]),
    ).toEqual([
      {
        name: null,
      },
    ]);
  });
});
