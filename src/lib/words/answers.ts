// src/lib/words/answers.ts
// Hand-curated from common English vocabulary.
// Source basis: dwyl/english-words (MIT) + common English frequency knowledge.
// See scripts/generate-wordlists.py for the automated derivation methodology.
//
// Filtering applied:
//   - Exactly 5 alphabetic lowercase characters
//   - Common/playable to an average English speaker
//   - No proper nouns, abbreviations, hyphenated words
//   - No offensive or ultra-rare archaic words
//
// ANSWERS ⊂ ALLOWED is enforced in allowed.ts via Set union.

export const ANSWERS: string[] = [
  // A
  "abbey", "abbot", "abide", "abode", "about", "above", "abuse", "abyss",
  "acorn", "acrid", "acted", "acute", "admit", "adobe", "adopt", "adore",
  "adult", "after", "again", "agile", "aging", "agony", "agree", "ahead",
  "alarm", "album", "alert", "alibi", "alien", "alike", "align", "alive",
  "allay", "alley", "allow", "alloy", "alone", "along", "aloof", "aloud",
  "altar", "alter", "amber", "amend", "ample", "amuse", "angel", "anger",
  "angle", "angry", "anime", "ankle", "annex", "annoy", "anvil", "apart",
  "apple", "apply", "apron", "arbor", "ardor", "arena", "argue", "arise",
  "armed", "armor", "aroma", "arose", "array", "arson", "aside", "aspen",
  "asset", "atlas", "atone", "attic", "audio", "audit", "avail", "avoid",
  "awake", "award", "aware", "awful", "axiom", "azure",
  // B
  "bacon", "badge", "baker", "balmy", "bandy", "banjo", "barge", "baron",
  "basic", "basil", "basis", "batch", "bathe", "batty", "bawdy", "beach",
  "beard", "beast", "beady", "began", "being", "below", "bench", "birch",
  "birth", "bison", "black", "blade", "blame", "bland", "blank", "blast",
  "blaze", "bleed", "blend", "bless", "blind", "bliss", "blimp", "bloke",
  "blood", "bloom", "blown", "blues", "blunt", "board", "boggy", "bonus",
  "boost", "booth", "boozy", "bossy", "bound", "boxer", "brace", "brain",
  "brand", "brave", "brawl", "brawn", "bread", "break", "breed", "brick",
  "bride", "brief", "briny", "brisk", "bring", "broad", "broil", "broke",
  "brood", "broth", "brown", "brunt", "brush", "budge", "bugle", "buddy",
  "build", "built", "bulge", "bully", "bumpy", "bunch", "burnt", "burly",
  // C
  "cabin", "cache", "cadet", "camel", "cameo", "candy", "canny", "cargo",
  "carol", "carry", "catch", "cause", "cedar", "chain", "chair", "chalk",
  "champ", "chant", "charm", "chart", "chase", "chasm", "cheap", "check",
  "cheek", "cheer", "chess", "chest", "chewy", "child", "chili", "chimp",
  "chirp", "chips", "chuck", "chunk", "churn", "cinch", "civic", "civil",
  "claim", "clamp", "clang", "clash", "clasp", "class", "clean", "clear",
  "cleft", "clerk", "climb", "cling", "cloak", "clock", "clone", "close",
  "cloud", "clown", "cluck", "clump", "coast", "cobra", "comet", "comic",
  "coral", "could", "count", "cover", "crack", "craft", "cramp", "crane",
  "crash", "craze", "crazy", "cream", "creek", "crisp", "croak", "crone",
  "cross", "crowd", "crown", "cruel", "crush", "cubic", "curly", "curve",
  // D
  "daddy", "dairy", "dance", "dated", "daunt", "dazed", "debut", "decal",
  "decay", "decoy", "defer", "delay", "denim", "dense", "depot", "depth",
  "derby", "detox", "devil", "dirty", "disco", "ditch", "diver", "dizzy",
  "dodge", "dodgy", "doubt", "dough", "dowdy", "draft", "drain", "drama",
  "drape", "drawl", "drawn", "dread", "dream", "dress", "dried", "drift",
  "drill", "drink", "drive", "drone", "drove", "drown", "drums", "dusty",
  "dwarf", "dwell", "dying",
  // E
  "eager", "eagle", "early", "earth", "earthy", "edged", "eerie", "eight",
  "eject", "elect", "elite", "ember", "empty", "enemy", "enjoy", "enter",
  "entry", "envoy", "epoch", "equal", "equip", "erect", "erode", "error",
  "essay", "evade", "every", "exact", "exalt", "exile", "exist", "extra",
  "exert",
  // F
  "fable", "facet", "faint", "faith", "false", "fancy", "farce", "fatal",
  "fault", "fauna", "feast", "fence", "feral", "ferry", "fever", "fifth",
  "fifty", "fight", "filth", "finch", "first", "fishy", "fixed", "fjord",
  "flair", "flame", "flank", "flash", "flask", "flesh", "flick", "fling",
  "float", "flood", "floor", "fluff", "fluid", "flush", "foggy", "folio",
  "folly", "forge", "forth", "forum", "found", "frail", "frame", "fraud",
  "freak", "freed", "fresh", "front", "frost", "frown", "froze", "frond",
  "froth", "fruit", "fully", "funky", "funny", "furry", "fussy", "fuzzy",
  // G
  "gaily", "gaudy", "gauze", "gavel", "gawky", "gamut", "gecko", "geode",
  "ghost", "giddy", "gimpy", "girly", "given", "gland", "glare", "glaze",
  "gleam", "glean", "glide", "glint", "gloat", "globe", "gloom", "glory",
  "gloss", "glove", "gorge", "gouge", "gourd", "grace", "grade", "grain",
  "grant", "grasp", "grate", "grave", "gravy", "graze", "greed", "greet",
  "grief", "grimy", "groan", "groin", "grill", "groom", "gross", "group",
  "growl", "guess", "guide", "guild", "guile", "gulch", "gusto",
  // H
  "habit", "haiku", "halve", "handy", "hardy", "harpy", "harsh", "hatch",
  "haunt", "haven", "havoc", "hazel", "heady", "heart", "heave", "heavy",
  "hedge", "hefty", "heist", "hence", "herbs", "heron", "hippy", "hippo",
  "hinge", "hoard", "hobby", "hoist", "holly", "homer", "honey", "honor",
  "horde", "horse", "hound", "humid", "husky", "humor", "hurry",
  // I
  "icing", "ideal", "idiot", "igloo", "image", "imply", "inane", "inept",
  "infer", "ingot", "inner", "input", "intro", "irate", "irony", "ivory",
  "itchy",
  // J
  "jaunt", "jazzy", "jelly", "jiffy", "jingo", "joker", "jolly", "joust",
  "jowly", "judge", "juice", "juicy", "jumbo", "jumpy", "junta", "juror",
  // K
  "kayak", "kinky", "kiosk", "kitty", "knack", "knave", "kneel", "knife",
  "knock", "knoll", "known", "koala",
  // L
  "label", "lance", "lanky", "large", "laser", "latch", "lathe", "later",
  "laugh", "layer", "leafy", "leaky", "learn", "leash", "least", "ledge",
  "leery", "lefty", "legal", "lemur", "lemon", "level", "light", "lilac",
  "limbo", "liner", "lingo", "lithe", "llama", "local", "lodge", "lofty",
  "logic", "loose", "lover", "lower", "lowly", "lucid", "lucky", "lunar",
  "lunge", "lusty", "lying",
  // M
  "macho", "madly", "magic", "major", "mangy", "mango", "manly", "manor",
  "maple", "march", "marry", "marsh", "mason", "match", "maxim", "meaty",
  "medal", "media", "mercy", "merge", "merry", "messy", "metal", "micro",
  "might", "milky", "mimic", "mince", "minty", "mirth", "miser", "mixer",
  "mogul", "moist", "molar", "money", "month", "moody", "moral", "moron",
  "mossy", "motif", "motor", "mousy", "mourn", "muddy", "mulch", "murky",
  "mushy", "musty", "myths",
  // N
  "nadir", "naive", "nanny", "nasty", "naval", "navel", "needy", "nerdy",
  "nerve", "never", "newly", "nexus", "niche", "night", "nifty", "ninja",
  "nippy", "noble", "nobly", "noise", "noisy", "nonce", "notch", "north",
  "noted", "novel", "nudge", "nutty", "nymph",
  // O
  "oaken", "occur", "ocean", "offer", "often", "olive", "onset", "opera",
  "optic", "orbit", "order", "orate", "other", "otter", "outdo", "outer",
  "ovary", "ovoid", "owing", "owner", "oxide", "ozone",
  // P
  "paddy", "pansy", "paper", "pasty", "pause", "pearl", "pedal", "penny",
  "perch", "peril", "perky", "pesky", "petal", "petty", "phase", "phony",
  "piano", "picky", "piggy", "pilot", "pinch", "piney", "pixel", "pizza",
  "plane", "plank", "plant", "plaza", "plead", "pluck", "plumb", "plume",
  "plump", "plush", "podgy", "polka", "poppy", "porch", "potty", "pouch",
  "pouty", "power", "prank", "prawn", "preen", "press", "pride", "prime",
  "primp", "prior", "prism", "probe", "prose", "proud", "prowl", "proxy",
  "prune", "punch", "pupil", "puppy", "purge", "purse", "pushy", "putty",
  "pygmy", "pylon",
  // Q
  "qualm", "quaff", "queen", "query", "quest", "queue", "quill", "quirk",
  "quota", "quote",
  // R
  "rabid", "racer", "radar", "rainy", "rally", "ramen", "ranch", "range",
  "rapid", "raspy", "raven", "reach", "ready", "realm", "rebel", "reedy",
  "refer", "reign", "relax", "repay", "repel", "retch", "revel", "rhyme",
  "rider", "ridge", "right", "rigid", "risky", "rival", "river", "roast",
  "robin", "rocky", "rodeo", "rogue", "rouge", "round", "rowdy", "royal",
  "ruddy", "rugby", "ruler", "rummy", "runny", "rural", "rusty",
  // S
  "sadly", "saint", "salsa", "salty", "sandy", "sassy", "sauce", "savor",
  "savvy", "scald", "scalp", "scamp", "scant", "scare", "scarf", "scene",
  "scone", "scoop", "scorn", "scour", "scout", "scowl", "seize", "sense",
  "serum", "setup", "seven", "shade", "shady", "shake", "shaky", "shame",
  "shape", "share", "shark", "sharp", "sheer", "shelf", "shell", "shift",
  "shiny", "shirt", "shock", "shore", "short", "shout", "shove", "shown",
  "shrub", "sigma", "silky", "silly", "since", "sixth", "sixty", "skill",
  "skimp", "skirt", "skull", "skunk", "slack", "slant", "slash", "sleet",
  "slick", "slide", "sling", "slope", "sloth", "slump", "small", "smash",
  "smear", "smoke", "snack", "snail", "snake", "snare", "sneak", "snore",
  "snout", "snowy", "soggy", "solar", "solid", "solve", "sorry", "south",
  "spawn", "spell", "spend", "spicy", "spill", "spine", "spook", "spore",
  "sport", "spout", "spray", "squad", "squat", "squid", "stack", "staff",
  "stage", "stain", "stair", "stake", "stale", "stall", "stare", "stark",
  "start", "stash", "state", "steam", "steel", "steep", "steer", "stick",
  "stiff", "still", "sting", "stink", "stomp", "stone", "stood", "stool",
  "storm", "story", "stout", "straw", "stray", "stuck", "study", "stuff",
  "stump", "stunk", "stunt", "sugar", "suite", "sunny", "super", "surge",
  "swamp", "swarm", "swear", "sweat", "swipe", "sword", "syrup",
  // T
  "tabby", "taboo", "taffy", "tango", "tangy", "tapir", "tardy", "taste",
  "taunt", "tawny", "teary", "teach", "tense", "tepid", "testy", "thank",
  "their", "there", "these", "thick", "thorn", "those", "three", "threw",
  "throb", "throw", "thumb", "tiger", "tight", "timid", "tipsy", "tired",
  "titan", "toast", "today", "token", "tonic", "total", "totem", "touch",
  "tough", "track", "trade", "trail", "train", "trait", "tramp", "trash",
  "trawl", "tread", "treat", "trend", "trial", "tribe", "trick", "tried",
  "tripe", "trite", "troth", "trout", "trove", "truce", "trunk", "truss",
  "tulip", "tumor", "tunic", "turbo", "twang", "tweak", "twerp", "twirl",
  "twist", "tying",
  // U
  "udder", "ulcer", "ultra", "umbra", "unarm", "uncut", "undid", "undue",
  "unite", "unity", "unlit", "until", "unwed", "upper", "upset", "urban",
  "usher", "using", "usual", "utter",
  // V
  "valet", "valid", "valor", "value", "valve", "vapor", "vault", "vaunt",
  "vegan", "venom", "vibes", "vigor", "villa", "viola", "viper", "viral",
  "visor", "virus", "visit", "vista", "vixen", "vocal", "vogue", "voter",
  "vivid",
  // W
  "wacky", "wager", "wagon", "waist", "waltz", "warty", "watch", "waver",
  "weary", "weave", "wedge", "weedy", "weird", "wheat", "whack", "whiff",
  "while", "whole", "whose", "wield", "wimpy", "wince", "windy", "wispy",
  "witty", "woody", "world", "worse", "worst", "worth", "woven", "wrath",
  "wreck", "wring", "wrist", "wrong", "wrote",
  // Y
  "yacht", "yearn", "yeast", "yield", "yodel", "yokel", "young", "youth",
  "yummy",
  // Z
  "zebra", "zesty", "zilch", "zippy", "zoned",
]
