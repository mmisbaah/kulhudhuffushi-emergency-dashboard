/* =====================================================
   DATA — Edit these values to customise the dashboard.
   ===================================================== */

var TTX_DATA = {

  /* Regulatory & guidance references */
  references: [
    { src: 'ICAO', doc: 'Annex 14 to the Chicago Convention, Vol. I — Aerodromes',
      scope: 'International standards for aerodrome design and operations, including aerodrome emergency planning (§9) and exercises.',
      key: [
        '§9.2 — emergency plan must be exercised at least every 2 years',
        '§9.3 — plan covers aircraft accidents and unlawful interference',
        'Zone system (hot/warm/cold) derived from these standards',
        'Rescue and firefighting categories (Cat. 1–10) by runway length'
      ] },
    { src: 'ICAO', doc: 'Annex 17 — Security; and Doc 8973 (Aviation Security Manual)',
      scope: 'Unlawful interference framework — applies to the active-shooter and hijack exercise scenarios.',
      key: [
        'Aviation security programme requirements for States',
        'Airport security plan and response coordination',
        'Threat classification and graduated response levels'
      ] },
    { src: 'FAA', doc: 'AC 150/5200-31C — Airport Emergency Plan',
      scope: 'US guidance on preparing and exercising airport emergency plans — widely used as a structural model.',
      key: [
        'Recommended airport emergency plan content and structure',
        'Exercise guidance: drill, walkthrough, tabletop and full-scale',
        'Emergency response exercise frequency expectations',
        'Hot Wash and AAR expectations after each exercise'
      ] },
    { src: 'EASA', doc: 'Regulation (EU) No 139/2013, AMC1 GM1 ADR-OPS',
      scope: 'European aerodrome operations — emergency planning and readiness requirements.',
      key: [
        'ADR-OPS-300 — aerodrome emergency plan content',
        'Exercise frequency and multi-agency participation',
        'Cooperation with State and local emergency services'
      ] },
    { src: 'Maldives', doc: 'MACL Airport Emergency Plan (AEP) + CAAML aerodrome requirements',
      scope: 'The governing local document — authority, agency roles and reporting lines for VRBK.',
      key: [
        'IC designation and ICP-to-EOC reporting lines',
        'Agency roles: MNDF, Police, MAHAA, Coast Guard, MACL',
        'Exercise schedule and AAR submission requirements'
      ] },
    { src: 'NFPA', doc: 'NFPA 1600 — Standard on Disaster/Emergency Management',
      scope: 'Programme-level standard for emergency management, business continuity and disaster recovery.',
      key: [
        'Emergency management programme elements',
        'Exercising, evaluation and improvement planning',
        'Common terminology and training requirements'
      ] }
  ],

  /* Glossary of emergency-exercise and ICS terms */
  glossary: [
    { term: 'AAR', full: 'After Action Report', def: 'Post-exercise document recording what worked, what failed, and the corrective actions with owners and deadlines.' },
    { term: 'AEP', full: 'Airport Emergency Plan', def: 'The airport’s standing plan for emergencies — roles, agencies, facilities and procedures the exercise tests.' },
    { term: 'ARFF', full: 'Aircraft Rescue and Fire Fighting', def: 'Specialist fire service for aircraft incidents — rapid intervention, foam application, cabin rescue.' },
    { term: 'CCP', full: 'Casualty Collection Point', def: 'Treatment and stabilisation area where triaged casualties are gathered before transport.' },
    { term: 'EOC', full: 'Emergency Operations Center', def: 'Fixed strategic coordination facility — where the airport links with MACL, regional and national agencies.' },
    { term: 'FAC', full: 'Family Assistance Center', def: 'Secure, private facility for families of those involved — identification, support, official notifications.' },
    { term: 'Hot Wash', full: 'Hot Wash', def: 'Immediate debrief held right after the exercise while observations are fresh — feeds the AAR.' },
    { term: 'IAP', full: 'Incident Action Plan', def: 'The written plan for one operational period: objectives, strategy, assignments and safety information.' },
    { term: 'IC', full: 'Incident Commander', def: 'The individual with overall authority for the incident until formally relieved.' },
    { term: 'ICP', full: 'Incident Command Post', def: 'The established physical location from which the IC directs the response — upwind and outside the warm zone.' },
    { term: 'ICS', full: 'Incident Command System', def: 'Standardised command structure (Command + Operations/Planning/Logistics/Finance) used across agencies.' },
    { term: 'Inject', full: 'Inject', def: 'A scripted piece of information or an event delivered to players during the exercise to drive decisions.' },
    { term: 'MACL', full: 'Maldives Airports Company Limited', def: 'Operator of Velana International and regional airports — governing authority for the AEP.' },
    { term: 'Mutual Aid', full: 'Mutual Aid', def: 'Pre-arranged agreements to share personnel and equipment with neighbouring islands and agencies.' },
    { term: 'Size-up', full: 'Size-up', def: 'Initial rapid assessment of the incident — conditions, hazards, victims, resources needed.' },
    { term: 'SOB', full: 'Souls On Board', def: 'Total persons on the aircraft: passengers + crew. The primary number driving casualty planning.' },
    { term: 'Staging', full: 'Resource Staging Center', def: 'Controlled area where arriving resources are registered, briefed and assigned before deployment.' },
    { term: 'TTX', full: 'Tabletop Exercise', def: 'Discussion-based exercise: players walk the scenario on paper — no deployment, low cost, high learning.' },
    { term: 'Warm Zone', full: 'Warm Zone', def: 'The area between hot and cold zones — controlled, decontamination and casualty rescue under cover.' },
    { term: 'VAAC', full: 'Volcanic Ash Advisory Centre', def: 'Regional centre (Melbourne) issuing ash-cloud advisories affecting aircraft and aerodromes.' }
  ],

  /* IC role reference cards (ICS command & general staff) */
  roleCards: [
    { role: 'Incident Commander', tag: 'Command', who: 'The overall authority for the incident until relieved.',
      duties: [
        'Sets objectives and approves the Incident Action Plan',
        'Establishes the ICP and directs all response elements',
        'Approves resource ordering and strategy changes',
        'Briefs MACL / Regional Airports and agency heads'
      ],
      reports: 'Reports to: EOC / MACL Duty Manager' },
    { role: 'Safety Officer', tag: 'Command Staff', who: 'Protects the responders — has authority to stop unsafe acts.',
      duties: [
        'Conducts responder safety briefings before deployment',
        'Monitors hot/warm zone entries and PPE compliance',
        'Issues mayday / stop-work authority when needed',
        'Confirms accountability of all personnel on scene'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Public Information Officer', tag: 'Command Staff', who: 'The single voice to media, families and the public.',
      duties: [
        'Issues statements and coordinates media staging',
        'Coordinates with airline and airport communications',
        'Protects operational information and casualty privacy',
        'Feeds the Family Assistance Center with verified updates'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Liaison Officer', tag: 'Command Staff', who: 'Single point of contact for assisting and cooperating agencies.',
      duties: [
        'Coordinates police, health, coast guard and MAHAA',
        'Tracks agency arrivals at the Resource Staging Center',
        'Resolves cross-agency resource conflicts',
        'Feeds agency input into the planning cycle'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Operations Section Chief', tag: 'General Staff', who: 'Runs the tactical response — fire, rescue, medical, security.',
      duties: [
        'Directs tactical groups and assigns work assignments',
        'Manages zone cordons and entry control points',
        'Reports tactical situation in the planning cycle',
        'Requests additional resources through Logistics'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Planning Section Chief', tag: 'General Staff', who: 'Owns the situation picture and the written plan.',
      duties: [
        'Maintains the master situation status board',
        'Runs resource status and situation reporting',
        'Drafts the IAP for IC approval each operational period',
        'Captures timeline entries for the After Action Report'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Logistics Section Chief', tag: 'General Staff', who: 'Provides everything the response needs to function.',
      duties: [
        'Orders and tracks resources (vehicles, equipment, staff)',
        'Manages staging, feeding, rehab and communications',
        'Supports the Family Assistance Center facilities',
        'Arranges transport and mutual-aid support'
      ],
      reports: 'Reports to: Incident Commander' },
    { role: 'Finance / Administration', tag: 'General Staff', who: 'Tracks cost, claims and contractual exposure.',
      duties: [
        'Records personnel hours and equipment usage',
        'Processes emergency procurement and contracts',
        'Logs claims and damage estimates',
        'Compiles cost data for the After Action Report'
      ],
      reports: 'Reports to: Incident Commander' }
  ],

  /* Checklist items for the IC Checklist tab */
  checklistItems: [
    'AEP reviewed and IC role officially confirmed',
    'Scenario and exercise objectives fully understood',
    'Incident Command Post established and identifiable',
    'Size-up completed and Incident Action Plan communicated',
    'Safety Officer assigned',
    'Public Information Officer assigned',
    'Liaison Officer assigned',
    'Multi-agency coordination active (fire, police, EMS, ops)',
    'Zones established and both cordons controlled',
    'Key locations activated — CCP, FAC, staging, morgue',
    'Hot Wash attended and AAR contributions submitted'
  ],

  /* Map pin categories */
  pinCategories: {
    command:  { label: 'Command & Coordination', color: '#3b82f6' },
    casualty: { label: 'Casualty Management',     color: '#ef4444' },
    family:   { label: 'Family & Survivor',       color: '#22c55e' },
    staging:  { label: 'Staging & Logistics',     color: '#f59e0b' },
    media:    { label: 'Media',                   color: '#a855f7' }
  },

  /* Key locations shown on the map */
  locations: [
    { id: 1, cat: 'command', x: 400, y: 185,
      name: 'Incident Command Post (ICP)',
      desc: 'Upwind (west) of crash site, outside warm zone. Clear line-of-sight to runway and apron.' },
    { id: 2, cat: 'command', x: 239, y: 200,
      name: 'Emergency Operations Center (EOC)',
      desc: 'Fixed facility within the terminal complex. Strategic coordination with MACL and Regional Airports.' },
    { id: 3, cat: 'command', x: 280, y: 490,
      name: 'Access / Crisis Control Point',
      desc: 'Single controlled entry on the access road where it meets the airport boundary.' },

    { id: 4, cat: 'casualty', x: 455, y: 310,
      name: 'Survivor Collection Area',
      desc: 'Safe assembly point on the apron side, edge of the hot zone. Initial gathering before triage.' },
    { id: 5, cat: 'casualty', x: 390, y: 355,
      name: 'Triage Area',
      desc: 'Upwind (west) of crash, inside warm zone. Casualties sorted Red / Yellow / Green.' },
    { id: 6, cat: 'casualty', x: 330, y: 400,
      name: 'Casualty Collection Point (CCP)',
      desc: 'Treatment & stabilisation area, south of ARFF. Colour-coded zones for priority care.' },
    { id: 7, cat: 'casualty', x: 250, y: 420,
      name: 'Transportation Area',
      desc: 'Ambulance loading on the access road. Direct route to island health centre and boat transfer.' },
    { id: 8, cat: 'casualty', x: 800, y: 460,
      name: 'Temporary Morgue',
      desc: 'Remote southeast corner of reclaimed land. Secure, dignified, away from town and terminal.' },

    { id: 9, cat: 'family', x: 205, y: 270,
      name: 'Family Assistance Center (FAC)',
      desc: 'Terminal conference room. Secure, private, off the operational area.' },
    { id: 10, cat: 'family', x: 300, y: 270,
      name: 'Uninjured Survivor Holding Area',
      desc: 'Terminal waiting area. Separate from casualties, for interviews and eventual release.' },

    { id: 11, cat: 'staging', x: 370, y: 240,
      name: 'Resource Staging Center',
      desc: 'Apron parking for mutual aid. Registration, briefing, and assignment point.' },
    { id: 12, cat: 'staging', x: 200, y: 440,
      name: 'Ambulance Staging Area',
      desc: 'Adjacent to the transportation area, on the access road. Ambulances wait for dispatch.' },

    { id: 13, cat: 'media', x: 160, y: 330,
      name: 'Media / Public Information Area',
      desc: 'Outside outer cordon, west of terminal. PIO briefings away from operations.' }
  ],

  /* Aircraft comparison data */
  aircraftComparison: [
    { name: 'ATR 72-600',    pax: 70, crew: '2 + 2', total: 74, fuel: '5,000 kg', wheels: 4, door: 'Rear left',    baggage: 'Fwd + aft holds' },
    { name: 'ATR 42-600',    pax: 48, crew: '2 + 2', total: 52, fuel: '4,000 kg', wheels: 4, door: 'Rear left',    baggage: 'Fwd + aft holds' },
    { name: 'Dash 8 Q400',   pax: 78, crew: '2 + 2', total: 82, fuel: '6,530 L',  wheels: 4, door: 'Forward left', baggage: 'Fwd + aft holds' },
    { name: 'Dash 8-300',    pax: 50, crew: '2 + 2', total: 54, fuel: '3,160 L',  wheels: 4, door: 'Forward left', baggage: 'Fwd + aft holds' },
    { name: 'Dash 8-200',    pax: 37, crew: '2 + 1', total: 40, fuel: '3,160 L',  wheels: 4, door: 'Forward left', baggage: 'Fwd + aft holds' },
    { name: 'Dornier 228',   pax: 19, crew: '2 + 1', total: 22, fuel: '1,885 kg', wheels: 4, door: 'Left main door', baggage: 'Fwd + aft holds' },
    { name: 'Fokker 100',    pax: 100, crew: '2 + 4', total: 106, fuel: '~14,000 L', wheels: 4, door: 'Fwd left',     baggage: 'Fwd + aft holds' },
    { name: 'A320-200',      pax: 150, crew: '2 + 4', total: 156, fuel: '~24,000 L', wheels: 4, door: 'Fwd + aft left', baggage: 'Fwd + aft holds' },
    { name: 'Boeing 737-800', pax: 162, crew: '2 + 4', total: 168, fuel: '~26,000 L', wheels: 4, door: 'Fwd + aft left', baggage: 'Fwd + aft holds' }
  ],

  /* Scenarios for the scenario selector */
  scenarios: [
    {
      id: 'atr72-crash',
      name: 'ATR 72 Crash on Runway',
      aircraft: 'ATR 72-600',
      soulsOnBoard: 74,
      fuelLoad: '5,000 kg',
      fireInvolved: true,
      casualties: { red: 8, yellow: 22, green: 34, deceased: 10 },
      resources: { arff: 2, ambulances: 6, fireTrucks: 2, buses: 2 },
      injects: [
        '09:00 — ATR 72 reports gear malfunction, requests priority landing',
        '09:05 — Aircraft crashes short of Runway 09, breaks apart',
        '09:06 — Fuel fire erupts near wreckage, spreading east',
        '09:10 — Wind shifts 45 degrees, smoke drifts toward terminal',
        '09:15 — Secondary explosion reported in rear fuselage',
        '09:20 — Media helicopter spotted overflying the scene'
      ]
    },
    {
      id: 'terminal-fire',
      name: 'Terminal Fire',
      aircraft: null,
      soulsOnBoard: 120,
      fuelLoad: 'N/A',
      fireInvolved: true,
      casualties: { red: 4, yellow: 18, green: 60, deceased: 0 },
      resources: { arff: 1, ambulances: 4, fireTrucks: 3, buses: 1 },
      injects: [
        '14:00 — Smoke reported in terminal kitchen',
        '14:03 — Fire alarm activated, sprinkler system fails',
        '14:05 — Fire spreads to ceiling void, heavy smoke in departures',
        '14:10 — Two passengers trapped in upstairs lounge',
        '14:15 — Power failure in terminal, emergency lighting only',
        '14:20 — Media arrives outside perimeter'
      ]
    },
    {
      id: 'fuel-spill',
      name: 'Fuel Spill on Apron',
      aircraft: 'Dash 8 Q400',
      soulsOnBoard: 0,
      fuelLoad: '6,530 L',
      fireInvolved: false,
      casualties: { red: 0, yellow: 2, green: 5, deceased: 0 },
      resources: { arff: 1, ambulances: 1, fireTrucks: 1, buses: 0 },
      injects: [
        '11:00 — Fuel bowser hose ruptures during refuelling',
        '11:02 — Approximately 2,000 L of Jet A-1 spills across apron',
        '11:05 — Fuel vapour drifts toward terminal intake vents',
        '11:10 — Aircraft evacuation initiated as precaution',
        '11:15 — Ignition source reported in nearby maintenance vehicle',
        '11:20 — Wind increases, vapour cloud expands'
      ]
    },
    {
      id: 'do228-gear-up',
      name: 'Dornier 228 Gear-Up Landing',
      aircraft: 'Dornier 228',
      soulsOnBoard: 22,
      fuelLoad: '1,885 kg',
      fireInvolved: false,
      casualties: { red: 2, yellow: 6, green: 12, deceased: 2 },
      resources: { arff: 1, ambulances: 3, fireTrucks: 1, buses: 1 },
      injects: [
        '16:00 — Dornier 228 reports gear indication problem',
        '16:05 — Low pass confirms gear not extended',
        '16:10 — Gear-up landing on Runway 09/27, aircraft skids to stop',
        '16:12 — Fuel leak reported from wing area',
        '16:15 — Runway blocked, airport closed to all traffic',
        '16:20 — Recovery equipment requested from Malé'
      ]
    },
    {
      id: 'water-rescue',
      name: 'Ditching / Water Rescue',
      aircraft: 'ATR 72-600',
      soulsOnBoard: 74,
      fuelLoad: '5,000 kg',
      fireInvolved: false,
      casualties: { red: 5, yellow: 15, green: 40, deceased: 6 },
      resources: { arff: 1, ambulances: 5, fireTrucks: 1, buses: 2 },
      injects: [
        '10:00 — ATR 72 declares emergency, ditches in the lagoon short of Runway 09',
        '10:04 — Life rafts deployed, passengers in water awaiting recovery',
        '10:08 — Strong current drifts survivors toward the reef channel',
        '10:12 — Coast Guard and dive team requested from Kulhudhuffushi harbour',
        '10:18 — Two passengers unaccounted for in headcount',
        '10:25 — Aircraft fuselage partially submerged, sinking risk reported'
      ]
    },
    {
      id: 'volcanic-ash',
      name: 'Volcanic Ash Arrival',
      aircraft: 'Dash 8 Q400',
      soulsOnBoard: 82,
      fuelLoad: '6,530 L',
      fireInvolved: false,
      casualties: { red: 1, yellow: 8, green: 45, deceased: 0 },
      resources: { arff: 1, ambulances: 2, fireTrucks: 1, buses: 2 },
      injects: [
        '08:00 — VAAC Melbourne advises ash cloud approaching Maldivian airspace',
        '08:20 — Inbound flights diverted; Q400 lands with ash-contaminated engines',
        '08:35 — Ashfall grounds all operations, visibility dropping on runway',
        '08:50 — Passengers and crew report respiratory irritation on board',
        '09:10 — Water supply and eye-wash requested for decontamination',
        '09:30 — Runway closure declared, aircraft inspection schedule issued'
      ]
    },
    {
      id: 'active-shooter',
      name: 'Active Shooter — Terminal',
      aircraft: null,
      soulsOnBoard: 150,
      fuelLoad: 'N/A',
      fireInvolved: false,
      casualties: { red: 6, yellow: 10, green: 60, deceased: 4 },
      resources: { arff: 1, ambulances: 6, fireTrucks: 1, buses: 2 },
      injects: [
        '13:00 — Shots reported inside the terminal check-in hall',
        '13:02 — Police respond; terminal enters lockdown, flights suspended',
        '13:06 — Casualties reported near the security checkpoint',
        '13:10 — Suspect movement unknown, CCTV feed partially lost',
        '13:15 — Family Assistance Center activation requested',
        '13:22 — Hostage situation reported in the departure lounge'
      ]
    },
    {
      id: 'earthquake',
      name: 'Earthquake — Structural Damage',
      aircraft: null,
      soulsOnBoard: 200,
      fuelLoad: 'N/A',
      fireInvolved: true,
      casualties: { red: 10, yellow: 30, green: 80, deceased: 8 },
      resources: { arff: 2, ambulances: 8, fireTrucks: 3, buses: 3 },
      injects: [
        '07:30 — M6.4 earthquake strikes; violent shaking felt across the airport',
        '07:33 — Terminal roof partially collapsed, structural damage reported',
        '07:36 — Fuel farm fire breaks out at the hydrant system',
        '07:40 — Runway cracks reported, all aircraft movement stopped',
        '07:48 — Trapped workers located under collapsed section',
        '07:55 — Aftershock warning issued; SAR teams pause operations'
      ]
    }
  ],

  /* Aircraft detail cards */
  aircraftDetails: [
    {
      name: 'ATR 72-600',
      operator: 'Maldivian · FlyMe — workhorse of the domestic network',
      pax: 70, crew: '2+2', total: 74, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '5,000 kg' },
        { k: 'Fuel storage', v: 'Integral wing tanks' },
        { k: 'Boarding door', v: 'Rear left (main)' },
        { k: 'Baggage holds', v: 'Forward + aft' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '4 main + overwing' }
      ]
    },
    {
      name: 'ATR 42-600',
      operator: 'Maldivian — shorter-fuselage regional variant',
      pax: 48, crew: '2+2', total: 52, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '4,000 kg' },
        { k: 'Fuel storage', v: 'Integral wing tanks' },
        { k: 'Boarding door', v: 'Rear left (main)' },
        { k: 'Baggage holds', v: 'Forward + aft' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '4 main + overwing' }
      ]
    },
    {
      name: 'Dash 8 Q400',
      operator: 'Maldivian — high-speed, high-capacity turboprop',
      pax: 78, crew: '2+2', total: 82, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '6,530 L' },
        { k: 'Fuel storage', v: 'Wing tanks' },
        { k: 'Boarding door', v: 'Forward left' },
        { k: 'Baggage holds', v: 'Forward + aft' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '2 doors + overwing' }
      ]
    },
    {
      name: 'Dornier 228',
      operator: 'Maldivian — short-field utility, resort and atoll routes',
      pax: 19, crew: '2+1', total: 22, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '1,885 kg' },
        { k: 'Fuel storage', v: 'Wing tanks' },
        { k: 'Boarding door', v: 'Left main / cargo door' },
        { k: 'Baggage holds', v: 'Fwd 90–120 kg · Aft 150–210 kg' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: 'Main door + rear' }
      ]
    },
    {
      name: 'Fokker 100',
      operator: 'Maldivian — jet operations from Velana Intl (WB/IB)',
      pax: 100, crew: '2+4', total: 106, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '~14,000 L' },
        { k: 'Fuel storage', v: 'Wing + centre tanks' },
        { k: 'Boarding door', v: 'Forward left' },
        { k: 'Baggage holds', v: 'Forward + aft' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '4 main exits (2 per side)' }
      ]
    },
    {
      name: 'A320-200',
      operator: 'Maldivian — international trunk routes, charters',
      pax: 150, crew: '2+4', total: 156, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '~24,000 L' },
        { k: 'Fuel storage', v: 'Centre + wing tanks' },
        { k: 'Boarding door', v: 'Forward + aft left' },
        { k: 'Baggage holds', v: 'Forward + aft (bulk + containers)' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '4 main exits (2 per side)' }
      ]
    },
    {
      name: 'Boeing 737-800',
      operator: 'Regional carriers — charters into Velana / Gan',
      pax: 162, crew: '2+4', total: 168, wheels: 4,
      specs: [
        { k: 'Fuel capacity', v: '~26,000 L' },
        { k: 'Fuel storage', v: 'Centre + wing tanks' },
        { k: 'Boarding door', v: 'Forward + aft left' },
        { k: 'Baggage holds', v: 'Forward + aft (bulk + containers)' },
        { k: 'Landing gear', v: 'Tricycle, retractable' },
        { k: 'Emergency exits', v: '4 doors + 4 overwing' }
      ]
    }
  ]
};
