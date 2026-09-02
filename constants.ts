import { BrewingMethod, MethodDetails } from './types';

export const BREWING_METHODS: BrewingMethod[] = [
  {
    id: 'v60',
    name_en: 'Hario V60',
    name_id: 'Hario V60',
    category_en: 'Pour-over / Drip',
    category_id: 'Tuang / Tetes',
    image_url: 'https://picsum.photos/seed/v60/600/400',
    recommended_ratio: '1:15',
    description_en: 'A cone-shaped dripper with spiral ribs that allows for a clean, nuanced cup of coffee. It emphasizes clarity and acidity.',
    description_id: 'Dripper berbentuk kerucut dengan rusuk spiral yang menghasilkan kopi yang bersih dan bernuansa. Ini menonjolkan kejernihan dan keasaman.',
    instructions_en: [
      'Place a filter in the V60 and rinse it with hot water.',
      'Add 20g of medium-fine ground coffee.',
      'Start a timer and pour 60g of water for blooming. Wait 45 seconds.',
      'Slowly pour the remaining 280g of water in concentric circles.',
      'Aim for a total brew time of 2:30 - 3:00 minutes.',
    ],
    instructions_id: [
      'Letakkan filter di V60 dan bilas dengan air panas.',
      'Tambahkan 20g kopi giling sedang-halus.',
      'Mulai timer dan tuangkan 60g air untuk blooming. Tunggu 45 detik.',
      'Tuangkan sisa 280g air secara perlahan dengan gerakan melingkar.',
      'Targetkan total waktu seduh 2:30 - 3:00 menit.',
    ],
    coffee_characteristics_en: 'Highlights single-origin beans with bright, floral, or fruity notes. Body is typically light to medium.',
    coffee_characteristics_id: 'Menyoroti biji kopi asal tunggal dengan nada cerah, bunga, atau buah. Bodinya biasanya ringan hingga sedang.',
    chemical_reactions_en: 'Hot water acts as a solvent, extracting soluble compounds like acids, sugars, and melanoidins from the coffee grounds.',
    chemical_reactions_id: 'Air panas berfungsi sebagai pelarut, mengekstraksi senyawa larut seperti asam, gula, dan melanoidin dari bubuk kopi.',
    physical_principles_en: 'Gravity pulls water through the coffee bed. The grind size and pouring technique control the contact time and extraction rate.',
    physical_principles_id: 'Gravitasi menarik air melalui ampas kopi. Ukuran gilingan dan teknik penuangan mengontrol waktu kontak dan laju ekstraksi.',
  },
  {
    id: 'aeropress',
    name_en: 'AeroPress',
    name_id: 'AeroPress',
    category_en: 'Immersion',
    category_id: 'Rendam',
    image_url: 'https://picsum.photos/seed/aeropress/600/400',
    recommended_ratio: '1:5',
    description_en: 'A versatile brewer that uses pressure to extract a rich, smooth concentrate. Known for its low acidity and lack of bitterness.',
    description_id: 'Penyeduh serbaguna yang menggunakan tekanan untuk mengekstrak konsentrat yang kaya dan lembut. Dikenal karena keasamannya yang rendah dan tidak pahit.',
    instructions_en: [
      'Insert a filter into the cap, rinse, and attach to the chamber.',
      'Place the chamber on a sturdy mug. Add 17g of fine-drip ground coffee.',
      'Add hot water (around 85°C / 185°F) up to the #2 mark.',
      'Stir for 10 seconds.',
      'Insert the plunger and press gently for 20-30 seconds until you hear a hiss.',
    ],
    instructions_id: [
        'Masukkan filter ke dalam tutup, bilas, dan pasang ke chamber.',
        'Letakkan chamber di atas cangkir yang kokoh. Tambahkan 17g kopi giling halus.',
        'Tambahkan air panas (sekitar 85°C / 185°F) hingga tanda #2.',
        'Aduk selama 10 detik.',
        'Masukkan plunger dan tekan perlahan selama 20-30 detik hingga terdengar desisan.',
    ],
    coffee_characteristics_en: 'Produces a clean, full-bodied cup. Excellent for highlighting sweetness and complex flavor notes in various roasts.',
    coffee_characteristics_id: 'Menghasilkan cangkir yang bersih dan bertubuh penuh. Sangat baik untuk menonjolkan rasa manis dan catatan rasa yang kompleks dalam berbagai tingkat sangrai.',
    chemical_reactions_en: 'Immersion allows for even extraction, while the air pressure speeds up the process, reducing oxidation and bitterness.',
    chemical_reactions_id: 'Perendaman memungkinkan ekstraksi yang merata, sementara tekanan udara mempercepat proses, mengurangi oksidasi dan kepahitan.',
    physical_principles_en: 'Combines immersion brewing with pressure. The fine filter paper removes most oils and fine particles, resulting in a clean cup.',
    physical_principles_id: 'Menggabungkan penyeduhan rendam dengan tekanan. Kertas saring halus menghilangkan sebagian besar minyak dan partikel halus, menghasilkan cangkir yang bersih.',
  },
  {
    id: 'frenchpress',
    name_en: 'French Press',
    name_id: 'French Press',
    category_en: 'Immersion',
    category_id: 'Rendam',
    image_url: 'https://picsum.photos/seed/frenchpress/600/400',
    recommended_ratio: '1:17',
    description_en: 'A classic immersion brewer that produces a full-bodied, rich, and aromatic cup of coffee by steeping coarse grounds in hot water.',
    description_id: 'Penyeduh rendam klasik yang menghasilkan kopi bertubuh penuh, kaya, dan aromatik dengan merendam bubuk kopi kasar dalam air panas.',
    instructions_en: [
      'Warm the press with hot water, then discard.',
      'Add 30g of coarse ground coffee to the carafe.',
      'Pour 500g of hot water (just off the boil) over the grounds.',
      'Stir gently and place the plunger on top. Steep for 4 minutes.',
      'Press the plunger down slowly and evenly. Serve immediately.',
    ],
    instructions_id: [
        'Panaskan press dengan air panas, lalu buang.',
        'Tambahkan 30g kopi giling kasar ke dalam karafe.',
        'Tuangkan 500g air panas (baru mendidih) ke atas bubuk kopi.',
        'Aduk perlahan dan letakkan plunger di atasnya. Diamkan selama 4 menit.',
        'Tekan plunger ke bawah secara perlahan dan merata. Sajikan segera.',
    ],
    coffee_characteristics_en: 'Ideal for medium to dark roasts. The metal filter allows natural oils and fine sediment to pass through, creating a heavy body and robust flavor.',
    coffee_characteristics_id: 'Ideal untuk sangrai sedang hingga gelap. Filter logam memungkinkan minyak alami dan sedimen halus melewatinya, menciptakan bodi yang berat dan rasa yang kuat.',
    chemical_reactions_en: 'Full immersion steeping extracts a wide range of flavor compounds and oils, leading to a complex and rich profile.',
    chemical_reactions_id: 'Perendaman penuh mengekstrak berbagai senyawa rasa dan minyak, menghasilkan profil yang kompleks dan kaya.',
    physical_principles_en: 'Separation of grounds from liquid is achieved by a mesh filter. The lack of a paper filter results in more oils and solids in the final cup.',
    physical_principles_id: 'Pemisahan ampas dari cairan dicapai oleh filter jaring. Tidak adanya filter kertas menghasilkan lebih banyak minyak dan padatan di cangkir akhir.',
  },
  {
    id: 'coldbrew',
    name_en: 'Cold Brew',
    name_id: 'Cold Brew',
    category_en: 'Immersion',
    category_id: 'Rendam',
    image_url: 'https://picsum.photos/seed/coldbrew/600/400',
    recommended_ratio: '1:8',
    description_en: 'A method of brewing coffee with cold water over a long period. The result is a smooth, low-acid coffee concentrate.',
    description_id: 'Metode menyeduh kopi dengan air dingin dalam waktu lama. Hasilnya adalah konsentrat kopi yang lembut dan rendah asam.',
    instructions_en: [
      'Combine 1 part coarse ground coffee with 8 parts cold water in a jar.',
      'Stir to ensure all grounds are saturated.',
      'Cover and let it steep at room temperature or in the refrigerator for 12-24 hours.',
      'Strain the coffee through a fine-mesh sieve or cheesecloth.',
      'Dilute with water or milk to taste.',
    ],
    instructions_id: [
        'Campurkan 1 bagian kopi giling kasar dengan 8 bagian air dingin dalam toples.',
        'Aduk untuk memastikan semua ampas jenuh.',
        'Tutup dan biarkan terendam pada suhu kamar atau di lemari es selama 12-24 jam.',
        'Saring kopi melalui saringan jaring halus atau kain tipis.',
        'Encerkan dengan air atau susu sesuai selera.',
    ],
    coffee_characteristics_en: 'Produces a sweet, chocolatey, and smooth coffee concentrate. The lower acidity makes it easy on the stomach.',
    coffee_characteristics_id: 'Menghasilkan konsentrat kopi yang manis, cokelat, dan lembut. Keasaman yang lebih rendah membuatnya nyaman di perut.',
    chemical_reactions_en: 'Cold water extracts compounds differently than hot water, resulting in fewer acidic and bitter compounds being dissolved.',
    chemical_reactions_id: 'Air dingin mengekstrak senyawa secara berbeda dari air panas, menghasilkan lebih sedikit senyawa asam dan pahit yang larut.',
    physical_principles_en: 'Time replaces heat in the extraction process. The long steeping period allows for a slow, gentle extraction of flavors.',
    physical_principles_id: 'Waktu menggantikan panas dalam proses ekstraksi. Periode perendaman yang lama memungkinkan ekstraksi rasa yang lambat dan lembut.',
  },
];

export const BREWING_CLUSTERS = {
  'pressure-based': {
    en: 'Pressure-based',
    id: 'Berbasis Tekanan',
    methods: ['espresso', 'ristretto', 'lever', 'moka']
  },
  'pour-over': {
    en: 'Pour-over / Drip',
    id: 'Tuang / Tetes',
    methods: ['v60', 'kalita', 'chemex', 'electric_drip']
  },
  'immersion': {
    en: 'Immersion',
    id: 'Rendam',
    methods: ['french_press', 'aeropress', 'cold_brew']
  },
  'slow-drip': {
    en: 'Slow Drip / Vacuum',
    id: 'Tetes Lambat / Vakum',
    methods: ['siphon', 'cold_drip']
  },
  'boil-uncut': {
    en: 'Boil / Uncut',
    id: 'Rebus / Tanpa Potong',
    methods: ['turkish', 'cowboy']
  },
  'instant-industrial': {
    en: 'Instant / Industrial',
    id: 'Instan / Industri',
    methods: ['soluble', 'concentrates', 'pods']
  }
};

export const ALL_METHODS: { [key: string]: { en: string, id: string } } = {
  // Pressure-based
  espresso: { en: 'Espresso', id: 'Espresso' },
  ristretto: { en: 'Ristretto', id: 'Ristretto' },
  lever: { en: 'Lever Espresso', id: 'Lever Espresso' },
  moka: { en: 'Moka Pot', id: 'Moka Pot' },
  // Pour-over
  v60: { en: 'Hario V60', id: 'Hario V60' },
  kalita: { en: 'Kalita Wave', id: 'Kalita Wave' },
  chemex: { en: 'Chemex', id: 'Chemex' },
  electric_drip: { en: 'Electric Drip', id: 'Tetes Elektrik' },
  // Immersion
  french_press: { en: 'French Press', id: 'French Press' },
  aeropress: { en: 'AeroPress', id: 'AeroPress' },
  cold_brew: { en: 'Cold Brew', id: 'Cold Brew' },
  // Slow Drip
  siphon: { en: 'Siphon', id: 'Siphon' },
  cold_drip: { en: 'Cold Drip', id: 'Tetes Dingin' },
  // Boil
  turkish: { en: 'Turkish Coffee', id: 'Kopi Turki' },
  cowboy: { en: 'Cowboy Coffee', id: 'Kopi Koboi' },
  // Instant
  soluble: { en: 'Soluble', id: 'Larut' },
  concentrates: { en: 'Concentrates', id: 'Konsentrat' },
  pods: { en: 'Coffee Pods', id: 'Kapsul Kopi' },
};

export const METHOD_DETAILS: { [key: string]: Partial<MethodDetails> } = {
  v60: {
    recommendedGrind: ['medium-fine', 'medium'],
    defaultGrind: 'medium-fine',
    recommendedRatios: ['1:14', '1:15', '1:16', '1:16.67', '1:17', '1:18'],
    defaultRatio: '1:15',
  },
  kalita: {
    recommendedGrind: ['medium-fine', 'medium'],
    defaultGrind: 'medium',
    recommendedRatios: ['1:14', '1:15', '1:16', '1:17', '1:18'],
    defaultRatio: '1:16',
  },
  chemex: {
    recommendedGrind: ['medium', 'medium-coarse'],
    defaultGrind: 'medium-coarse',
    recommendedRatios: ['1:14', '1:15', '1:16', '1:16.67', '1:17', '1:18'],
    defaultRatio: '1:16',
  },
  electric_drip: {
    recommendedGrind: ['medium'],
    defaultGrind: 'medium',
    recommendedRatios: ['1:15', '1:16', '1:17', '1:18'],
    defaultRatio: '1:16',
  },
  french_press: {
    recommendedGrind: ['coarse'],
    defaultGrind: 'coarse',
    recommendedRatios: ['1:10', '1:12', '1:14', '1:15', '1:16.67', '1:17'],
    defaultRatio: '1:17',
  },
  aeropress: {
    recommendedGrind: ['fine', 'medium-fine', 'medium'],
    defaultGrind: 'medium-fine',
    recommendedRatios: ['1:3', '1:5', '1:8', '1:10', '1:12', '1:14', '1:16'],
    defaultRatio: '1:5',
  },
  cold_brew: {
    recommendedGrind: ['coarse', 'medium-coarse'],
    defaultGrind: 'coarse',
    recommendedRatios: ['1:4', '1:5', '1:8', '1:10', '1:12'],
    defaultRatio: '1:8',
  },
  espresso: {
    recommendedGrind: ['fine'],
    defaultGrind: 'fine',
    recommendedRatios: ['1:1.5', '1:2', '1:2.5', '1:3', '1:3.5'],
    defaultRatio: '1:2.5',
  },
  ristretto: {
    recommendedGrind: ['fine'],
    defaultGrind: 'fine',
    recommendedRatios: ['1:1', '1:1.25', '1:1.5'],
    defaultRatio: '1:1.25',
  },
  lever: {
    recommendedGrind: ['fine'],
    defaultGrind: 'fine',
    recommendedRatios: ['1:1.5', '1:2', '1:2.5', '1:3', '1:3.5'],
    defaultRatio: '1:2.5',
  },
  moka: {
    recommendedGrind: ['medium-fine'],
    defaultGrind: 'medium-fine',
    recommendedRatios: ['1:7', '1:8', '1:10', '1:12'],
    defaultRatio: '1:10',
  },
  siphon: {
    recommendedGrind: ['medium'],
    defaultGrind: 'medium',
    recommendedRatios: ['1:12', '1:14', '1:15', '1:16'],
    defaultRatio: '1:15',
  },
  cold_drip: {
    recommendedGrind: ['medium'],
    defaultGrind: 'medium',
    recommendedRatios: ['1:5', '1:8', '1:10', '1:12'],
    defaultRatio: '1:8',
  },
  turkish: {
    recommendedGrind: ['fine'],
    defaultGrind: 'fine',
    recommendedRatios: ['1:7', '1:8', '1:10'],
    defaultRatio: '1:8',
  },
  cowboy: {
    recommendedGrind: ['coarse'],
    defaultGrind: 'coarse',
    recommendedRatios: ['1:8', '1:10', '1:12', '1:15'],
    defaultRatio: '1:10',
  },
};

export const METHOD_CHAMPION_STYLES: { [methodId: string]: { [styleKey: string]: { en: string, id: string } } } = {
  // Pour-over Styles
  v60: {
    default: { en: 'Standard Method', id: 'Metode Standar' },
    kasuya: { en: 'Tetsu Kasuya (4:6 Method)', id: 'Tetsu Kasuya (Metode 4:6)' },
    hoffmann: { en: 'James Hoffmann (1-Pour)', id: 'James Hoffmann (1-Tuang)' },
    rao: { en: 'Scott Rao (Principles)', id: 'Scott Rao (Prinsip)' },
    wendelboe: { en: 'Tim Wendelboe (Light & Clear)', id: 'Tim Wendelboe (Ringan & Jernih)' },
    winton: { en: 'Matt Winton (Competition)', id: 'Matt Winton (Gaya Kompetisi)' },
    rolf: { en: 'Patrik Rolf (April Method)', id: 'Patrik Rolf (Metode April)' },
    gagne: { en: 'Jonathan Gagné (Physics-based)', id: 'Jonathan Gagné (Berbasis Fisika)' },
    wibawa: { en: 'Ryan Wibawa (Champion\'s Flow)', id: 'Ryan Wibawa (Alur Juara)' },
  },
  kalita: {
    default: { en: 'Standard Method', id: 'Metode Standar' },
    kasuya: { en: 'Tetsu Kasuya (4:6 Method)', id: 'Tetsu Kasuya (Metode 4:6)' },
    hoffmann: { en: 'James Hoffmann (1-Pour)', id: 'James Hoffmann (1-Tuang)' },
    rao: { en: 'Scott Rao (Principles)', id: 'Scott Rao (Prinsip)' },
    wendelboe: { en: 'Tim Wendelboe (Light & Clear)', id: 'Tim Wendelboe (Ringan & Jernih)' },
  },
  chemex: {
    default: { en: 'Standard Method', id: 'Metode Standar' },
    hoffmann: { en: 'James Hoffmann (Large Batch)', id: 'James Hoffmann (Batch Besar)' },
    rao: { en: 'Scott Rao (Principles)', id: 'Scott Rao (Prinsip)' },
  },
  // AeroPress Styles
  aeropress: {
    default: { en: 'Standard Method', id: 'Metode Standar' },
    wac_standard: { en: 'WAC Standard (Bypass)', id: 'WAC Standar (Bypass)' },
    wac_inverted: { en: 'WAC Inverted (Immersion)', id: 'WAC Terbalik (Rendam)' },
    low_temp: { en: 'Low-Temp Clarity', id: 'Kejernihan Suhu Rendah' },
  },
  // French Press Styles
  french_press: {
    default: { en: 'Standard Method', id: 'Metode Standar' },
    hoffmann: { en: 'James Hoffmann (Clean Cup)', id: 'James Hoffmann (Cangkir Bersih)' },
  },
  // Espresso "Techniques"
  espresso: {
    default: { en: 'Standard Shot', id: 'Shot Standar' },
    wdt: { en: 'WDT Preparation', id: 'Persiapan WDT' },
    paper_filter: { en: 'Puck Screen (Paper Filter)', id: 'Puck Screen (Filter Kertas)' },
    pressure_profile: { en: 'Modern Pressure Profile', id: 'Profil Tekanan Modern' },
  },
};

export const CHAMPION_STYLE_PRESETS: {
  [methodId: string]: {
    [styleKey: string]: {
      ratio?: string;
      grind?: string;
      intensity?: 'Light' | 'Medium' | 'Strong';
    }
  }
} = {
  v60: {
    kasuya: { ratio: '1:15', grind: 'medium-coarse', intensity: 'Medium' },
    hoffmann: { ratio: '1:16.67', grind: 'medium-fine', intensity: 'Medium' },
    rao: { ratio: '1:17', grind: 'medium-fine', intensity: 'Medium' },
    wendelboe: { ratio: '1:16', grind: 'medium-fine', intensity: 'Light' },
    winton: { ratio: '1:16', grind: 'medium-fine', intensity: 'Strong' },
    rolf: { ratio: '1:16', grind: 'medium-coarse', intensity: 'Light' },
    gagne: { ratio: '1:17', grind: 'fine', intensity: 'Strong' },
    wibawa: { ratio: '1:15', grind: 'medium-fine', intensity: 'Medium' },
  },
  kalita: {
    kasuya: { ratio: '1:15', grind: 'medium-coarse', intensity: 'Medium' },
    hoffmann: { ratio: '1:16', grind: 'medium', intensity: 'Medium' },
    rao: { ratio: '1:17', grind: 'medium', intensity: 'Medium' },
    wendelboe: { ratio: '1:16', grind: 'medium', intensity: 'Light' },
  },
  chemex: {
    hoffmann: { ratio: '1:16.67', grind: 'medium-coarse', intensity: 'Medium' },
    rao: { ratio: '1:17', grind: 'medium-coarse', intensity: 'Medium' },
  },
  aeropress: {
    wac_standard: { ratio: '1:14', grind: 'medium-fine', intensity: 'Medium' },
    wac_inverted: { ratio: '1:14', grind: 'medium-fine', intensity: 'Strong' },
    low_temp: { ratio: '1:16', grind: 'fine', intensity: 'Light' },
  },
  french_press: {
    hoffmann: { ratio: '1:16.67', grind: 'medium', intensity: 'Medium' },
  },
  espresso: {
    wdt: { ratio: '1:2.5', grind: 'fine', intensity: 'Strong' },
    paper_filter: { ratio: '1:2.5', grind: 'fine', intensity: 'Strong' },
    pressure_profile: { ratio: '1:3', grind: 'fine', intensity: 'Medium' },
  },
};