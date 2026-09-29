/* =====================================================
   DATA — Edit these values to customise the dashboard.
   ===================================================== */

var TTX_DATA = {

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
    { name: 'Dornier 228',   pax: 19, crew: '2 + 1', total: 22, fuel: '1,885 kg', wheels: 4, door: 'Left main door', baggage: 'Fwd + aft holds' }
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
    }
  ]
};
