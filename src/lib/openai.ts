// Service OpenAI pour l'IA des monstres
import { Character, Monster } from '../types/game.types';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

interface MonsterAction {
  action: 'attack' | 'special';
  targetIndex: number;
  dialogue: string;
  reasoning: string;
}

// Langues des monstres selon leur type
const MONSTER_LANGUAGES: Record<string, string> = {
  'Gobelin': 'guttural et aigu avec des "grik", "nak", "zug"',
  'Squelette': 'claquements d\'os et murmures sombres "krak... krak..."',
  'Gelée': 'bruits gluants "bloub", "splorch", "gloub"',
  'Chauve-souris géante': 'cris stridents "SKREEEE", "kiii"',
  'Rat géant': 'couinements agressifs "SKRIT SKRIT", "gniiii"',
  'Araignée venimeuse': 'sifflements "ssssss", "tchik tchik"',
  'Orque': 'grognements gutturaux "WAAAGH", "grumph", "zog zog"',
  'Mage noir': 'incantations sombres en ancien "Kal\'thuzad... mor\'anak..."',
  'Loup-garou': 'grognements et hurlements "GRAAAOOO", "rrrr..."',
  'Spectre': 'murmures d\'outre-tombe "ouuuuuu...", "mooort..."',
  'Minotaure': 'mugissements puissants "MEUUUH", "GRAAAH"',
  'Harpie': 'cris perçants "KRAAAA", "hiiiii"',
  'Troll': 'grognements stupides "moi écraser!", "GROUMPF"',
  'Vampire': 'voix élégante et menaçante en vieux langage',
  'Golem de pierre': 'grondements rocheux "GRRRUMBLE", "KRONG"',
  'Démon mineur': 'paroles infernales "Kar\'nash!", "Zul\'jin mora!"',
  'Wyverne': 'rugissements draconiques "SKREEEEE", "RAAAH"',
  'Cyclope': 'voix grave et simple "MOI VOIR TOI!", "ÉCRASER!"',
  'Dragon ancien': 'voix majestueuse en draconique ancien "Dovahkiin...", "Fus Ro Dah!"',
  'Liche': 'incantations nécromantiques "Ner\'zhul arak...", "Morsiphian..."',
  'Seigneur démon': 'paroles démoniaques terrifiantes "Kil\'jaeden!", "Argus mora!"',
  'Hydre': 'sifflements multiples "SSSSHHH", chaque tête parle',
  'Titan des ombres': 'voix d\'outre-monde qui résonne "L\'OMBRE CONSUME..."'
};

export async function getMonsterAction(
  monster: Monster,
  team: Character[],
  combatLog: string[]
): Promise<MonsterAction> {
  // Si pas de clé API, utiliser le fallback
  if (!OPENAI_API_KEY) {
    return getDefaultMonsterAction(monster, team);
  }

  const aliveTeam = team.filter(c => c.hp > 0);
  if (aliveTeam.length === 0) {
    return getDefaultMonsterAction(monster, team);
  }

  const monsterLanguage = MONSTER_LANGUAGES[monster.name] || 'grognements primitifs';
  
  const prompt = `Tu es ${monster.name}, un monstre dans un donjon de jeu de rôle.

CONTEXTE DU COMBAT:
- Tes PV: ${monster.hp}/${monster.maxHp}
- Ton attaque: ${monster.attack}
- Ta défense: ${monster.defense}
${monster.isBoss ? '- Tu es un BOSS puissant et terrifiant!' : ''}

ÉQUIPE ADVERSE:
${aliveTeam.map((c, i) => `${i}. ${c.name} (${c.class}) - PV: ${c.hp}/${c.maxHp}, ATK: ${c.attack}, DEF: ${c.defense}`).join('\n')}

DERNIÈRES ACTIONS:
${combatLog.slice(-3).join('\n')}

TA LANGUE: ${monsterLanguage}

INSTRUCTIONS:
1. Choisis qui attaquer (index du personnage) avec une stratégie intelligente:
   - Cible prioritaire: les soigneurs/mages (faibles en défense)
   - Ou achève les personnages avec peu de PV
   - Ou élimine les menaces (attaque élevée)

2. Génère une phrase COURTE (max 50 caractères) dans ta langue de monstre pour menacer/narguer tes adversaires.

Réponds UNIQUEMENT en JSON valide:
{
  "action": "attack",
  "targetIndex": <index du personnage à attaquer (0 à ${aliveTeam.length - 1})>,
  "dialogue": "<ta phrase en langue de monstre>",
  "reasoning": "<explication courte de ton choix>"
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un monstre intelligent dans un jeu de rôle. Réponds toujours en JSON valide.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return getDefaultMonsterAction(monster, team);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Parser le JSON de la réponse
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Valider l'index
      const targetIndex = Math.min(Math.max(0, parsed.targetIndex || 0), aliveTeam.length - 1);
      
      return {
        action: 'attack',
        targetIndex,
        dialogue: parsed.dialogue || getDefaultDialogue(monster),
        reasoning: parsed.reasoning || ''
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
  }

  return getDefaultMonsterAction(monster, team);
}

function getDefaultMonsterAction(monster: Monster, team: Character[]): MonsterAction {
  const aliveTeam = team.filter(c => c.hp > 0);
  
  // Stratégie par défaut: cibler le plus faible ou un soigneur
  let targetIndex = 0;
  
  // Chercher un soigneur/mage d'abord
  const healerIndex = aliveTeam.findIndex(c => 
    c.class.includes('Prêtresse') || c.class.includes('Druide') || 
    c.class.includes('Oracle') || c.class.includes('Mage')
  );
  
  if (healerIndex >= 0) {
    targetIndex = healerIndex;
  } else {
    // Sinon cibler le plus faible
    let minHp = Infinity;
    aliveTeam.forEach((c, i) => {
      if (c.hp < minHp) {
        minHp = c.hp;
        targetIndex = i;
      }
    });
  }

  return {
    action: 'attack',
    targetIndex,
    dialogue: getDefaultDialogue(monster),
    reasoning: 'Attaque par défaut'
  };
}

function getDefaultDialogue(monster: Monster): string {
  const dialogues: Record<string, string[]> = {
    'Gobelin': ['Grik grik nak!', 'Zug zug!', 'Nakka!'],
    'Squelette': ['Krak... krak...', 'Mort...', 'Os... briser...'],
    'Gelée': ['Bloub bloub!', 'Splorch!', 'Gloub gloub!'],
    'Orque': ['WAAAGH!', 'Zog zog!', 'Moi écraser!'],
    'Loup-garou': ['GRAAAOOO!', 'Rrrrrr...', 'Chair fraîche!'],
    'Vampire': ['Votre sang...', 'Délicieux...', 'Venez à moi...'],
    'Troll': ['GROUMPF!', 'Troll faim!', 'Écraser petit!'],
    'Dragon ancien': ['Dovahkiin...', 'Brûlez!', 'FUS RO DAH!'],
    'Liche': ['Ner\'zhul...', 'Servez-moi!', 'Mort éternelle...'],
    'Seigneur démon': ['Kil\'jaeden!', 'Souffrez!', 'Argus mora!']
  };

  const monsterDialogues = dialogues[monster.name] || ['GRAAAH!', 'Rrrr...', '...!'];
  return monsterDialogues[Math.floor(Math.random() * monsterDialogues.length)];
}

export function getMonsterTaunt(monster: Monster, situation: 'start' | 'hurt' | 'victory' | 'low_hp'): string {
  const taunts: Record<string, Record<string, string[]>> = {
    'Dragon ancien': {
      start: ['Mortels insignifiants... Dovahkiin mora!', 'Vous osez me défier?'],
      hurt: ['Grrrr... Vous le paierez!', 'Une égratignure!'],
      victory: ['Brûlez dans mes flammes!', 'Pathétique...'],
      low_hp: ['Impossible! Mais je suis ÉTERNEL!', 'Vous... m\'impressionnez...']
    },
    'Liche': {
      start: ['Ner\'zhul vous attend...', 'Rejoignez mon armée de morts!'],
      hurt: ['La douleur... un concept oublié...', 'Morsiphian arak!'],
      victory: ['Votre âme est mienne!', 'Servez-moi dans la mort!'],
      low_hp: ['Non! Mon phylactère...', 'Je reviendrai!']
    }
  };

  const monsterTaunts = taunts[monster.name]?.[situation];
  if (monsterTaunts) {
    return monsterTaunts[Math.floor(Math.random() * monsterTaunts.length)];
  }
  
  // Taunts génériques
  const genericTaunts: Record<string, string[]> = {
    start: ['GRAAAH!', 'Rrrr...', '*grognements menaçants*'],
    hurt: ['Argh!', 'Grrr!', '*cri de douleur*'],
    victory: ['*rugissement triomphant*', 'RAAAH!'],
    low_hp: ['*grognements affaiblis*', 'Nrgh...']
  };
  
  return genericTaunts[situation][Math.floor(Math.random() * genericTaunts[situation].length)];
}



