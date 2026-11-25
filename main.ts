// Fortune Cookie Wisdom for Developers (Node 22, standard library only):
// writes one original fortune-cookie line for a software developer to
// /output/entry.txt (1-120 characters).
//
// The judge is a tired senior engineer picking the line that makes it smile
// and nod, weighing in order: (1) a real fortune-cookie line for a developer,
// not a slogan or generic advice; (2) one short balanced sentence that lands
// in a single breath; (3) something true about a developer's day — bugs,
// reviews, deploys, estimates, legacy code; (4) a turn the reader has not
// heard before; (5) a quiet twist or double meaning that rewards a second
// read. So this program keeps a small bank of original candidates, scores
// each deterministically on those axes, and writes only the winner. No clock,
// no randomness, no network: both grader runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  fortune: number; // reads like a fortune cookie, not a slogan or punchline
  truth: number; // a developer recognises it from their own day
  fresh: number; // a turn the reader has not heard before
  twist: number; // a quiet double meaning that rewards a second read
};

// Every line below is original, written for this competition.
const BANK: Candidate[] = [
  {
    // Winner: the classic "You will..." fortune opening, a true warning
    // about rushed code, and the twist lands twice — the tired engineer
    // who inherits it is the reader themself.
    text: 'You will inherit the code you rush today, so write it gently — the tired engineer who reads it next is you.',
    fortune: 9,
    truth: 9,
    fresh: 8,
    twist: 9,
  },
  {
    // The legacy-code line: the curser and the cursed author share the
    // same deadline, which is the quiet twist. Slightly less fortune-like
    // in form than the winner, so it scores a touch lower there.
    text: 'The legacy code you curse was written by someone doing their best with the deadline you now have.',
    fortune: 7,
    truth: 9,
    fresh: 9,
    twist: 8,
  },
  {
    text: 'The bug you cannot reproduce is already teaching you where your tests are blind.',
    fortune: 8,
    truth: 8,
    fresh: 7,
    twist: 7,
  },
  {
    text: 'A quiet review comment today saves a loud incident page tomorrow; read slowly, merge kindly.',
    fortune: 7,
    truth: 8,
    fresh: 7,
    twist: 6,
  },
  {
    text: 'Your estimate was never wrong; the code simply took the time it always needed to be understood.',
    fortune: 8,
    truth: 8,
    fresh: 8,
    twist: 7,
  },
  {
    text: 'The deploy you fear most is the one your future self will thank you for testing twice.',
    fortune: 8,
    truth: 7,
    fresh: 6,
    twist: 7,
  },
];

function score(c: Candidate): number {
  // Judge order: fortune form first, then truth, freshness, twist.
  // A small bonus for brevity — a fortune lands in a single breath.
  const base = c.fortune * 3 + c.truth * 2 + c.fresh * 2 + c.twist * 2;
  const economyBonus = Math.max(0, 120 - [...c.text].length) / 20;
  return base + economyBonus;
}

function pickWinner(bank: Candidate[]): Candidate {
  let best = bank[0];
  for (const c of bank) {
    if (score(c) > score(best)) best = c;
  }
  return best;
}

const winner = pickWinner(BANK);

// No trailing line end: the judge reads exactly the bytes in the file,
// and a line end would count as a character that earns nothing.
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text);
