import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const ROOT = join(__dirname, "../..");

/** Recursively collect files with given extensions from a directory */
function collectFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];
  const absDir = join(ROOT, dir);

  function walk(currentDir: string) {
    let entries: string[];
    try {
      entries = readdirSync(currentDir);
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      try {
        const stat = statSync(fullPath);
        if (stat.isDirectory() && entry !== "node_modules" && entry !== ".next") {
          walk(fullPath);
        } else if (stat.isFile()) {
          const ext = extname(entry).slice(1);
          if (extensions.includes(ext)) {
            results.push(fullPath);
          }
        }
      } catch {
        // skip inaccessible entries
      }
    }
  }

  walk(absDir);
  return results;
}

/** Count regex matches across all files in a directory */
function countMatches(pattern: RegExp, dir: string, extensions: string[]): number {
  let count = 0;
  const files = collectFiles(dir, extensions);
  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");
      const matches = content.match(pattern);
      if (matches) count += matches.length;
    } catch {
      // skip unreadable files
    }
  }
  return count;
}

// SA-02: Log Hygiene
describe("SA-02: Log Hygiene", () => {
  it("SA-02-A: zero console.log in app/[locale]/ client files", () => {
    const count = countMatches(
      /console\.log\(/g,
      "app/[locale]",
      ["ts", "tsx"]
    );
    expect(count).toBe(0);
  });

  it("SA-02-B: zero console.log in components/", () => {
    const count = countMatches(
      /console\.log\(/g,
      "components",
      ["ts", "tsx"]
    );
    expect(count).toBe(0);
  });

  it("SA-02-C: no token/key/secret patterns in log statements", () => {
    const sensitiveLogPattern = /console\.\w+\(.*(?:token|secret|private.?key|oobCode|password)[^)]*\)/gi;
    const dirs = ["app", "components", "lib"];
    let totalMatches = 0;
    for (const dir of dirs) {
      totalMatches += countMatches(sensitiveLogPattern, dir, ["ts", "tsx"]);
    }
    expect(totalMatches).toBe(0);
  });
});

// SA-03: Code Quality
describe("SA-03: Code Quality", () => {
  it("SA-03-A: zero ': any' in lib/auth-config.ts", () => {
    const content = readFileSync(join(ROOT, "lib/auth-config.ts"), "utf-8");
    const matches = content.match(/: any\b/g);
    expect(matches).toBeNull();
  });

  it("SA-03-B: zero ': any' in lib/stripe-config.ts", () => {
    const content = readFileSync(join(ROOT, "lib/stripe-config.ts"), "utf-8");
    const matches = content.match(/: any\b/g);
    expect(matches).toBeNull();
  });

  it("SA-03-C: zero ': any' in app/api/stripe/checkout/route.ts", () => {
    const content = readFileSync(
      join(ROOT, "app/api/stripe/checkout/route.ts"),
      "utf-8"
    );
    const matches = content.match(/: any\b/g);
    expect(matches).toBeNull();
  });

  it("SA-03-D: zero ': any' in app/api/auth/ routes", () => {
    const authFiles = [
      "app/api/auth/[...nextauth]/route.ts",
      "app/api/auth/firebase-token/route.ts",
    ];
    for (const file of authFiles) {
      const content = readFileSync(join(ROOT, file), "utf-8");
      const matches = content.match(/: any\b/g);
      expect(matches).toBeNull();
    }
  });

  it("SA-03-E: zero merge conflict markers in README.md", () => {
    const content = readFileSync(join(ROOT, "README.md"), "utf-8");
    expect(content).not.toMatch(/<<<<<<<|=======|>>>>>>>/);
  });
});

// SA-04: Project Metadata
describe("SA-04: Project Metadata", () => {
  it('SA-04-A: package.json name is "easiful-web"', () => {
    const pkg = JSON.parse(
      readFileSync(join(ROOT, "package.json"), "utf-8")
    );
    expect(pkg.name).toBe("easiful-web");
  });

  it("SA-04-B: .gitignore includes test-results/", () => {
    const content = readFileSync(join(ROOT, ".gitignore"), "utf-8");
    expect(content).toContain("test-results/");
  });

  it("SA-04-C: .gitignore includes playwright-report/", () => {
    const content = readFileSync(join(ROOT, ".gitignore"), "utf-8");
    expect(content).toContain("playwright-report/");
  });
});
