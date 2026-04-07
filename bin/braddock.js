#!/usr/bin/env node

import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = path.join(__dirname, "..", "template");

const args = process.argv.slice(2);
const command = args[0];

// ── Banner ────────────────────────────────────────────────────────────────────

function banner() {
  console.log("");
  console.log(
    pc.bold(pc.white("  ╔══════════════════════════════════════╗"))
  );
  console.log(
    pc.bold(pc.white("  ║  ")) +
      pc.bold(pc.yellow("B R A D D O C K")) +
      pc.bold(pc.white("                     ║"))
  );
  console.log(
    pc.bold(pc.white("  ║  ")) +
      pc.dim("AI Squad for Claude Code          ") +
      pc.bold(pc.white("  ║"))
  );
  console.log(
    pc.bold(pc.white("  ╚══════════════════════════════════════╝"))
  );
  console.log("");
}

// ── Help ──────────────────────────────────────────────────────────────────────

function printHelp() {
  banner();
  console.log(`  ${pc.bold("Usage:")}`);
  console.log(
    `    ${pc.cyan("npx braddock init")}              install in the current directory`
  );
  console.log(
    `    ${pc.cyan("npx braddock init <dir>")}        install in a specific directory`
  );
  console.log(
    `    ${pc.cyan("npx braddock help")}              show this message`
  );
  console.log("");
  console.log(
    `  ${pc.dim("Braddock doesn't improvise. Neither should you.")}`
  );
  console.log("");
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  banner();

  p.intro(pc.bgYellow(pc.black(" Initializing mission ")));

  let targetDir = args[1] ? path.resolve(args[1]) : null;

  // If no argument was passed, ask interactively
  if (!targetDir) {
    const answer = await p.text({
      message: "Where should the template be installed?",
      placeholder: "  (Press Enter to use the current directory)",
      defaultValue: process.cwd(),
    });

    if (p.isCancel(answer)) {
      p.cancel("Operation cancelled. Mission aborted.");
      process.exit(0);
    }

    targetDir = path.resolve(answer || process.cwd());
  }

  // Validate the directory
  if (!fs.existsSync(targetDir)) {
    const create = await p.confirm({
      message: `Directory ${pc.cyan(targetDir)} does not exist. Create it?`,
      initialValue: true,
    });

    if (p.isCancel(create) || !create) {
      p.cancel("Mission aborted.");
      process.exit(0);
    }

    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Confirm before installing
  const confirmed = await p.confirm({
    message: `Install Braddock in ${pc.cyan(path.relative(process.cwd(), targetDir) || ".")}?`,
    initialValue: true,
  });

  if (p.isCancel(confirmed) || !confirmed) {
    p.cancel("Mission aborted.");
    process.exit(0);
  }

  // Copy files with feedback
  const spinner = p.spinner();
  spinner.start("Preparing the ground...");

  const results = copyDir(TEMPLATE_DIR, targetDir);

  spinner.stop("Ground prepared.");

  // Show what was installed
  const groups = [
    {
      label: ".claude/CLAUDE.md",
      desc: "project governance",
      ok: results.copied.some((f) => f.includes("CLAUDE.md")),
    },
    {
      label: ".claude/agents/",
      desc: "8 specialized agents",
      ok: results.copied.some((f) => f.includes("agents")),
    },
    {
      label: ".claude/skills/",
      desc: "6 pipeline skills",
      ok: results.copied.some((f) => f.includes("skills")),
    },
    {
      label: ".braddock/board/kanban.json",
      desc: "operational board",
      ok: results.copied.some((f) => f.includes("kanban")),
    },
    {
      label: ".braddock/memory/",
      desc: "project artifacts",
      ok: results.copied.some((f) => f.includes("memory")),
    },
    {
      label: ".braddock/PROMPT.md",
      desc: "squad kickoff prompt",
      ok: results.copied.some((f) => f.includes("PROMPT")),
    },
  ];

  console.log("");
  for (const g of groups) {
    const icon = g.ok ? pc.green("✓") : pc.dim("–");
    const label = g.ok ? pc.white(g.label) : pc.dim(g.label);
    console.log(`  ${icon}  ${label}  ${pc.dim(g.desc)}`);
  }

  if (results.skipped.length > 0) {
    console.log("");
    console.log(
      pc.dim(`  ${results.skipped.length} file(s) skipped — already exist`)
    );
  }

  // Next steps
  p.note(
    [
      `${pc.bold("1.")} Edit ${pc.cyan(".braddock/memory/vision.md")} with your product idea`,
      `${pc.bold("2.")} Open ${pc.cyan("Claude Code")} at the project root`,
      `${pc.bold("3.")} Paste the content of ${pc.cyan(".braddock/PROMPT.md")} and wait for ${pc.yellow("/kickoff")}`,
    ].join("\n"),
    "Next steps"
  );

  p.outro(
    pc.bold(`${pc.yellow("Mission started.")} Let the squad do its job.`)
  );
}

// ── File copy ─────────────────────────────────────────────────────────────────

function copyDir(src, dest) {
  const results = { copied: [], skipped: [] };
  _copy(src, dest, results);
  return results;
}

function _copy(src, dest, results) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      _copy(srcPath, destPath, results);
    } else {
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        results.copied.push(destPath);
      } else {
        results.skipped.push(destPath);
      }
    }
  }
}

// ── Router ────────────────────────────────────────────────────────────────────

if (!command || command === "help" || command === "--help" || command === "-h") {
  printHelp();
} else if (command === "init") {
  init().catch((err) => {
    p.cancel(`Unexpected error: ${err.message}`);
    process.exit(1);
  });
} else {
  banner();
  console.log(pc.red(`  Unknown command: "${command}"`));
  console.log(pc.dim('  Run "braddock help" to see available commands.'));
  console.log("");
  process.exit(1);
}
