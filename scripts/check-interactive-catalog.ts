import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  HACKS_DATA as sessionHacks,
  PODERES_SHEREZADE_DATA as sessionPowers,
  INTERACTIVE_QUIZ_QUESTIONS as sessionQuestions
} from '../src/data/interactiveCatalog';

type CanonicalCatalog = {
  HACKS_DATA: unknown[];
  PODERES_SHEREZADE_DATA: unknown[];
  QUIZ_QUESTIONS: unknown[];
};

const interactiveRepo = process.argv[2] || process.env.INTERACTIVE_DECOX_PATH;

if (!interactiveRepo) {
  console.error(
    'Uso: npm run catalog:check -- /ruta/a/INTERACTIVE-DECOX\n' +
      'También puedes definir INTERACTIVE_DECOX_PATH.'
  );
  process.exit(2);
}

const constantsPath = pathToFileURL(
  resolve(interactiveRepo, 'src/utils/constants.ts')
).href;

const canonical = (await import(constantsPath)) as CanonicalCatalog;

const compare = (label: string, session: unknown[], official: unknown[]) => {
  if (JSON.stringify(session) !== JSON.stringify(official)) {
    console.error(
      'DIVERGENCIA: ' + label + ' no coincide con INTERACTIVE-DECOX ' +
      '(sesión: ' + session.length + '; oficial: ' + official.length + ').'
    );
    return false;
  }

  console.log('OK: ' + label + ' coincide exactamente (' + session.length + ').');
  return true;
};

const checks = [
  compare('HACKS_DATA', sessionHacks, canonical.HACKS_DATA),
  compare('PODERES_SHEREZADE_DATA', sessionPowers, canonical.PODERES_SHEREZADE_DATA),
  compare('INTERACTIVE_QUIZ_QUESTIONS', sessionQuestions, canonical.QUIZ_QUESTIONS)
];

if (checks.some((ok) => !ok)) process.exit(1);

const sessionHack8 = sessionHacks.find((hack) => hack.id === 8);
const officialHack8 = (canonical.HACKS_DATA as Array<{ id: number; poderDeSherezadeId?: number }>).find(
  (hack) => hack.id === 8
);

if (
  Boolean(sessionHack8?.poderDeSherezadeId) !==
  Boolean(officialHack8?.poderDeSherezadeId)
) {
  console.error('DIVERGENCIA: la relación explícita del Hack 8 fue alterada.');
  process.exit(1);
}

console.log(
  'OK: la relación Hack–Poder del Hack 8 conserva exactamente lo declarado en la fuente.'
);
console.log('Catálogo de Sesión de Descubrimiento alineado con INTERACTIVE-DECOX.');
