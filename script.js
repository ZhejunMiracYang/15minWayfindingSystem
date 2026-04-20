document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════
  //  MOCK TRANSIT DATA
  // ══════════════════════════════════════════
  const TRANSIT_DATA = [
    {
      route: '5A',   provider: 'oakville-go', providerName: 'Oakville Go',
      destination: 'To Uptown Core',       from: 'Sheridan College',
      arrivalMin: 16
    },
    {
      route: '3',    provider: 'oakville-go', providerName: 'Oakville Go',
      destination: 'To Oakville GO Station', from: 'Sheridan College',
      arrivalMin: 28
    },
    {
      route: '14',   provider: 'oakville-go', providerName: 'Oakville Go',
      destination: 'To Bronte GO Station',  from: 'Trafalgar Rd & Dundas',
      arrivalMin: 41
    },
    {
      route: '56',   provider: 'go-bus',     providerName: 'GO Bus',
      destination: 'To Square One',         from: 'Sheridan College',
      arrivalMin: 32
    },
    {
      route: '46',   provider: 'go-bus',     providerName: 'GO Bus',
      destination: 'To Brampton GO',        from: 'Dundas & Trafalgar',
      arrivalMin: 47
    },
    {
      route: '19',   provider: 'miway',      providerName: 'MiWay',
      destination: 'To Erin Mills TC',      from: 'Winston Churchill',
      arrivalMin: 9
    },
    {
      route: '21',   provider: 'miway',      providerName: 'MiWay',
      destination: 'To Meadowvale TC',      from: 'Collegeway & Erin Centre',
      arrivalMin: 24
    },
    {
      route: '61',   provider: 'miway',      providerName: 'MiWay',
      destination: 'To Mississauga City Centre', from: 'Winston Park Dr',
      arrivalMin: 35
    }
  ];

  const IMMINENT_THRESHOLD = 5;
  const ICON_ARROW = 'assets/icon-arrow-right.svg';
  const startTime = Date.now();

  // Compute absolute arrival timestamp for each entry
  TRANSIT_DATA.forEach(entry => {
    entry._arrivalTime = startTime + entry.arrivalMin * 60 * 1000;
  });

  // ══════════════════════════════════════════
  //  MAP POI DATA (matches Figma markers 1:1)
  //  Extended with detail fields for DetailScreen
  // ══════════════════════════════════════════
  const MAP_POIS = [
    {
      id: 'washroom-1', category: 'washroom', name: 'Washroom (A-Wing)', walkMin: 3,
      icon: 'assets/washroom.png', x: 133, y: 266,
      subcategory: 'Facilities', rating: 4.0, thumbnail: 'assets/washroom.png',
      address: 'A-Wing, 1st Floor, Sheridan College',
      description: 'Clean and accessible washroom facilities located on the first floor of A-Wing. Features wheelchair-accessible stalls, baby changing stations, and touchless fixtures for hygiene.',
      gallery: []
    },
    {
      id: 'washroom-2', category: 'washroom', name: 'Washroom (B-Wing)', walkMin: 5,
      icon: 'assets/washroom.png', x: 244, y: 372,
      subcategory: 'Facilities', rating: 3.8, thumbnail: 'assets/washroom.png',
      address: 'B-Wing, 2nd Floor, Sheridan College',
      description: 'Washroom facilities on the second floor of B-Wing. Fully accessible with automatic doors and modern fixtures.',
      gallery: []
    },
    {
      id: 'event-1', category: 'event', name: 'Learning Commons', walkMin: 3,
      icon: 'assets/event.png', x: 317, y: 258,
      subcategory: 'Study Space', rating: 4.5, thumbnail: 'assets/event.png',
      address: 'C-Wing, Sheridan College Trafalgar Campus',
      description: 'The Learning Commons is a collaborative study space offering group study rooms, quiet zones, tutoring services, and access to digital resources. Open to all students and visitors during campus hours.',
      gallery: []
    },
    {
      id: 'atm-1', category: 'atm', name: 'ATM (Davis)', walkMin: 5,
      icon: 'assets/atm.png', x: 365, y: 178,
      subcategory: 'Banking', rating: 3.5, thumbnail: 'assets/atm.png',
      address: 'Davis Building Lobby, Sheridan College',
      description: 'A convenient ATM machine located in the Davis Building lobby. Supports major bank cards, credit cards, and contactless payments for cash withdrawals.',
      gallery: []
    },
    {
      id: 'atm-2', category: 'atm', name: 'ATM (SCAET)', walkMin: 4,
      icon: 'assets/atm.png', x: 376, y: 250,
      subcategory: 'Banking', rating: 3.5, thumbnail: 'assets/atm.png',
      address: 'SCAET Building Entrance, Sheridan College',
      description: 'ATM located near the SCAET building entrance, accessible during building hours. Supports all major banking networks.',
      gallery: []
    },
    {
      id: 'atm-3', category: 'atm', name: 'ATM (Trafalgar)', walkMin: 4,
      icon: 'assets/atm.png', x: 60, y: 224,
      subcategory: 'Banking', rating: 3.5, thumbnail: 'assets/atm.png',
      address: 'Trafalgar Rd Entrance, Sheridan College',
      description: 'An easily accessible ATM near the Trafalgar Road entrance. Available 24/7 with well-lit surroundings for safe transactions.',
      gallery: []
    },
    {
      id: 'food-1', category: 'food', name: 'Tim Hortons', walkMin: 8,
      icon: 'assets/food.png', x: 60, y: 360,
      subcategory: 'Coffee', rating: 5.0, thumbnail: 'assets/thumb-tim-hortons.png',
      address: '1289 Marlborough Ct, Oakville, ON L6H 2R9',
      description: '<b>Tim Hortons</b> is a Canadian multinational coffeehouse chain that serves coffee, donuts, muffins, bagels, sandwiches, wraps, and other light meals. It offers a range of hot and cold beverages, including brewed coffee, espresso-based drinks, and iced beverages, and is widely known for its quick service and broad accessibility across Canada and internationally.',
      gallery: ['assets/gallery-tim-1.png', 'assets/gallery-tim-2.png', 'assets/gallery-tim-3.png', 'assets/gallery-tim-4.png']
    },
    {
      id: 'food-2', category: 'food', name: 'Food Court', walkMin: 4,
      icon: 'assets/food.png', x: 23, y: 456,
      subcategory: 'Fast Food', rating: 4.6, thumbnail: 'assets/food.png',
      address: 'J-Wing, Sheridan College Trafalgar Campus',
      description: 'Several fast-food restaurants have opened here, offering a diverse range of quick-service dining options including burgers, wraps, Asian fare, and fresh salads.',
      gallery: []
    },
    {
      id: 'food-4', category: 'food', name: 'Pal Gong Tea', walkMin: 5,
      icon: 'assets/food.png', x: 45, y: 410,
      subcategory: 'Drinks', rating: 4.4, thumbnail: 'assets/thumb-palgong-tea.png',
      address: '266 N Service Rd W, Oakville, ON L6M 2R8',
      description: 'Known for authentic milk teas, fruit teas, and unique smoothies. Pal Gong Tea brings traditional Asian tea culture with a modern twist and a wide menu of refreshing beverages.',
      gallery: []
    },
    {
      id: 'food-3', category: 'food', name: 'Cravings Café', walkMin: 8,
      icon: 'assets/food.png', x: 356, y: 564,
      subcategory: 'Café', rating: 4.0, thumbnail: 'assets/food.png',
      address: 'G-Wing, Sheridan College Trafalgar Campus',
      description: 'Cravings Café serves freshly prepared sandwiches, salads, baked goods, and specialty coffee. A cozy spot for a quick bite between classes or meetings.',
      gallery: []
    },
    {
      id: 'attraction-1', category: 'attraction', name: 'Photo Gallery', walkMin: 6,
      icon: 'assets/attraction.png', x: 276, y: 158,
      subcategory: 'Art', rating: 4.7, thumbnail: 'assets/attraction.png',
      address: 'Davis Building, 2nd Floor, Sheridan College',
      description: 'A curated photo gallery showcasing works from Sheridan\'s photography program students and visiting artists. Exhibitions rotate monthly, featuring themes from documentary to fine art.',
      gallery: []
    },
    {
      id: 'medical-1', category: 'medical', name: 'Clinic', walkMin: 2,
      icon: 'assets/medical.png', x: 31, y: 320,
      subcategory: 'Health', rating: 4.3, thumbnail: 'assets/medical.png',
      address: 'A-Wing, Ground Floor, Sheridan College',
      description: 'The campus health clinic provides basic medical services including first aid, minor injury treatment, health consultations, and referrals. Open during regular campus hours with trained medical staff.',
      gallery: []
    },
    {
      id: 'police-1', category: 'police', name: 'Security Desk', walkMin: 1,
      icon: 'assets/police.png', x: 77, y: 402,
      subcategory: 'Safety', rating: 4.8, thumbnail: 'assets/police.png',
      address: 'J-Wing Entrance, Sheridan College',
      description: 'Campus security desk staffed 24/7. Provides assistance with emergencies, lost and found, campus escort services, and general safety information for visitors and students.',
      gallery: []
    },
    {
      id: 'transit-1', category: 'transit', name: 'Sheridan Bus Terminal', walkMin: 2,
      icon: 'assets/transit.png', x: 110, y: 430,
      subcategory: 'Bus Stop', rating: 4.2, thumbnail: 'assets/transit.png',
      address: 'Sheridan College Main Entrance, Trafalgar Rd',
      description: 'The main bus terminal serving Sheridan College Trafalgar Campus. Served by Oakville Transit routes 3, 5A, and 14 with connections to Oakville GO Station and surrounding areas.',
      gallery: []
    },
    {
      id: 'transit-2', category: 'transit', name: 'Trafalgar & Dundas Stop', walkMin: 7,
      icon: 'assets/transit.png', x: 200, y: 140,
      subcategory: 'Bus Stop', rating: 3.8, thumbnail: 'assets/transit.png',
      address: 'Trafalgar Rd & Dundas St, Oakville',
      description: 'A major intersection bus stop served by GO Bus route 46 to Brampton and Oakville Transit route 14 to Bronte GO. Features a sheltered waiting area and real-time arrival display.',
      gallery: []
    },
    {
      id: 'transit-3', category: 'transit', name: 'Winston Churchill Stop', walkMin: 12,
      icon: 'assets/transit.png', x: 350, y: 450,
      subcategory: 'MiWay Stop', rating: 3.5, thumbnail: 'assets/transit.png',
      address: 'Winston Churchill Blvd, Mississauga',
      description: 'Served by MiWay route 19 to Erin Mills Town Centre. Provides cross-boundary transit access between Oakville and Mississauga with frequent service during peak hours.',
      gallery: []
    }
  ];

  // ══════════════════════════════════════════
  //  DIRECTIONS DATA — step-by-step walking guidance per POI
  //  type: 'exit' | 'forward' | 'turn-left' | 'turn-right' | 'cross' | 'arrive'
  // ══════════════════════════════════════════
  const DIRECTIONS_DATA = {
    'food-1': {
      totalDistance: 180,
      steps: [
        { type: 'exit',    text: 'Exit <em>S Gate</em> of <em>Sheridan College</em>' },
        { type: 'forward', text: '<em>40 m</em> toward <em>Trafalgar Road</em>' },
        { type: 'cross',   text: 'Stop at <em>pedestrian crossing</em>' },
        { type: 'forward', text: '<em>25 m</em> cross <em>Trafalgar Road</em>' },
        { type: 'forward', text: 'Walk along sidewalk for <em>90 m</em>' },
        { type: 'arrive',  text: 'Stop at <em>Rabba Fine Foods</em> storefront' },
        { type: 'arrive',  text: 'Arrive at <em>Tim Hortons</em> on your right' }
      ]
    },
    'food-2': {
      totalDistance: 120,
      steps: [
        { type: 'exit',    text: 'Head toward <em>J-Wing</em> main corridor' },
        { type: 'forward', text: '<em>60 m</em> along hallway' },
        { type: 'turn-left', text: 'Turn left at the <em>information board</em>' },
        { type: 'forward', text: '<em>40 m</em> toward <em>Food Court entrance</em>' },
        { type: 'arrive',  text: 'Arrive at <em>Food Court</em> on your left' }
      ]
    },
    'food-3': {
      totalDistance: 250,
      steps: [
        { type: 'exit',    text: 'Exit through <em>E-Wing</em> doors' },
        { type: 'forward', text: '<em>80 m</em> along campus path' },
        { type: 'turn-right', text: 'Turn right toward <em>G-Wing</em>' },
        { type: 'forward', text: '<em>120 m</em> along walkway' },
        { type: 'arrive',  text: 'Arrive at <em>Cravings Café</em> entrance' }
      ]
    },
    'food-4': {
      totalDistance: 150,
      steps: [
        { type: 'exit',    text: 'Exit <em>S Gate</em> of <em>Sheridan College</em>' },
        { type: 'forward', text: '<em>50 m</em> toward <em>N Service Rd</em>' },
        { type: 'turn-left', text: 'Turn left onto <em>N Service Rd W</em>' },
        { type: 'forward', text: '<em>70 m</em> along sidewalk' },
        { type: 'arrive',  text: 'Arrive at <em>Pal Gong Tea</em> on your right' }
      ]
    },
    'washroom-1': {
      totalDistance: 90,
      steps: [
        { type: 'forward', text: '<em>50 m</em> along <em>A-Wing</em> corridor' },
        { type: 'turn-right', text: 'Turn right past the <em>elevator</em>' },
        { type: 'forward', text: '<em>30 m</em> to end of hallway' },
        { type: 'arrive',  text: 'Arrive at <em>Washroom</em> on your left' }
      ]
    },
    'washroom-2': {
      totalDistance: 150,
      steps: [
        { type: 'forward', text: '<em>60 m</em> through <em>B-Wing</em> lobby' },
        { type: 'forward', text: 'Take stairs to <em>2nd Floor</em>' },
        { type: 'turn-left', text: 'Turn left at the <em>stairwell exit</em>' },
        { type: 'forward', text: '<em>40 m</em> along corridor' },
        { type: 'arrive',  text: 'Arrive at <em>Washroom</em> on your right' }
      ]
    },
    'event-1': {
      totalDistance: 100,
      steps: [
        { type: 'forward', text: '<em>40 m</em> toward <em>C-Wing</em>' },
        { type: 'turn-right', text: 'Turn right at <em>main intersection</em>' },
        { type: 'forward', text: '<em>50 m</em> along corridor' },
        { type: 'arrive',  text: 'Arrive at <em>Learning Commons</em>' }
      ]
    },
    'atm-1': {
      totalDistance: 160,
      steps: [
        { type: 'forward', text: '<em>70 m</em> toward <em>Davis Building</em>' },
        { type: 'forward', text: 'Enter through <em>main entrance</em>' },
        { type: 'turn-left', text: 'Turn left in the <em>lobby</em>' },
        { type: 'arrive',  text: 'Arrive at <em>ATM</em> near reception' }
      ]
    },
    'atm-2': {
      totalDistance: 130,
      steps: [
        { type: 'forward', text: '<em>60 m</em> toward <em>SCAET Building</em>' },
        { type: 'forward', text: 'Enter through <em>south entrance</em>' },
        { type: 'arrive',  text: 'Arrive at <em>ATM</em> in entrance hall' }
      ]
    },
    'atm-3': {
      totalDistance: 120,
      steps: [
        { type: 'forward', text: '<em>80 m</em> toward <em>Trafalgar Rd</em> entrance' },
        { type: 'turn-left', text: 'Turn left at the <em>door</em>' },
        { type: 'arrive',  text: 'Arrive at <em>ATM</em> by entrance' }
      ]
    },
    'attraction-1': {
      totalDistance: 200,
      steps: [
        { type: 'forward', text: '<em>60 m</em> toward <em>Davis Building</em>' },
        { type: 'forward', text: 'Take stairs to <em>2nd Floor</em>' },
        { type: 'turn-right', text: 'Turn right at <em>stairwell exit</em>' },
        { type: 'forward', text: '<em>40 m</em> down the hallway' },
        { type: 'arrive',  text: 'Arrive at <em>Photo Gallery</em> on your left' }
      ]
    },
    'medical-1': {
      totalDistance: 60,
      steps: [
        { type: 'forward', text: '<em>30 m</em> toward <em>A-Wing</em>' },
        { type: 'turn-left', text: 'Turn left past the <em>information desk</em>' },
        { type: 'arrive',  text: 'Arrive at <em>Clinic</em> on the ground floor' }
      ]
    },
    'police-1': {
      totalDistance: 30,
      steps: [
        { type: 'forward', text: '<em>20 m</em> toward <em>J-Wing entrance</em>' },
        { type: 'arrive',  text: 'Arrive at <em>Security Desk</em> on your right' }
      ]
    },
    'transit-1': {
      totalDistance: 60,
      steps: [
        { type: 'exit',    text: 'Exit through <em>Main Entrance</em>' },
        { type: 'forward', text: '<em>40 m</em> along the driveway' },
        { type: 'arrive',  text: 'Arrive at <em>Sheridan Bus Terminal</em>' }
      ]
    },
    'transit-2': {
      totalDistance: 220,
      steps: [
        { type: 'exit',    text: 'Exit through <em>N Gate</em>' },
        { type: 'forward', text: '<em>100 m</em> north along <em>Trafalgar Rd</em>' },
        { type: 'cross',   text: 'Cross at <em>Dundas & Trafalgar</em> intersection' },
        { type: 'arrive',  text: 'Arrive at <em>Trafalgar & Dundas Stop</em>' }
      ]
    },
    'transit-3': {
      totalDistance: 380,
      steps: [
        { type: 'exit',    text: 'Exit through <em>E-Wing</em> doors' },
        { type: 'forward', text: '<em>150 m</em> east along campus path' },
        { type: 'turn-right', text: 'Turn right onto <em>Winston Churchill Blvd</em>' },
        { type: 'forward', text: '<em>180 m</em> south along sidewalk' },
        { type: 'arrive',  text: 'Arrive at <em>Winston Churchill Stop</em>' }
      ]
    }
  };

  const CATEGORY_LABELS = {
    food: 'Food', medical: 'Medical', police: 'Police', transit: 'Transit',
    event: 'Event', attraction: 'Attraction', washroom: 'Washroom', atm: 'ATM'
  };

  const WARM_CATEGORIES = ['food', 'event', 'attraction', 'washroom', 'atm', 'transit'];

  // ══════════════════════════════════════════
  //  TRANSIT CARD RENDERER
  // ══════════════════════════════════════════
  function renderTransitCard(entry) {
    const now = Date.now();
    const remaining = Math.max(0, entry._arrivalTime - now);
    const remainMin = Math.ceil(remaining / 60000);
    const isImminent = remainMin > 0 && remainMin <= IMMINENT_THRESHOLD;

    const arrivalDate = new Date(entry._arrivalTime);
    const clock = padTwo(arrivalDate.getHours()) + ':' + padTwo(arrivalDate.getMinutes());

    const minDisplay = remainMin <= 0 ? 'Now' : remainMin;
    const unitDisplay = remainMin <= 0 ? '' : 'Minutes';

    const card = document.createElement('div');
    card.className = 'transit-card transit-card--' + entry.provider +
                     (isImminent ? ' transit-card--imminent' : '');
    card.dataset.provider = entry.provider;
    card.dataset.arrivalTime = entry._arrivalTime;

    card.innerHTML =
      '<div class="transit-info">' +
        '<div class="transit-route-row">' +
          '<span class="transit-route-number">' + entry.route + '</span>' +
          '<span class="transit-route-name">' + entry.providerName + '</span>' +
        '</div>' +
        '<div class="transit-direction">' +
          '<img class="transit-direction-icon" src="' + ICON_ARROW + '" alt="">' +
          '<span class="transit-direction-text">' + entry.destination + '</span>' +
        '</div>' +
        '<div class="transit-departure">' +
          '<span class="transit-departure-label">Departure from</span>' +
          '<span class="transit-departure-station">' + entry.from + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="transit-time-block">' +
        '<span class="transit-arrival-number">' + minDisplay + '</span>' +
        '<span class="transit-arrival-unit">' + unitDisplay + '</span>' +
        '<span class="transit-arrival-clock">' + clock + '</span>' +
      '</div>';

    return card;
  }

  // ══════════════════════════════════════════
  //  POPULATE CONTAINERS
  // ══════════════════════════════════════════
  function populateHomePreview() {
    const container = document.getElementById('homeTransitPreview');
    if (!container) return;
    container.innerHTML = '';

    const sorted = [...TRANSIT_DATA].sort((a, b) => a.arrivalMin - b.arrivalMin);
    sorted.slice(0, 2).forEach(entry => {
      container.appendChild(renderTransitCard(entry));
    });
  }

  function populateTransitScreen() {
    const container = document.getElementById('transitFullList');
    if (!container) return;
    container.innerHTML = '';

    const providers = ['oakville-go', 'go-bus', 'miway'];
    const providerLabels = { 'oakville-go': 'Oakville GO', 'go-bus': 'GO Bus', 'miway': 'MiWay' };

    providers.forEach(pid => {
      const entries = TRANSIT_DATA
        .filter(e => e.provider === pid)
        .sort((a, b) => a.arrivalMin - b.arrivalMin);

      if (entries.length === 0) return;

      const group = document.createElement('div');
      group.className = 'transit-provider-group';

      const heading = document.createElement('span');
      heading.className = 'transit-provider-heading';
      heading.textContent = providerLabels[pid];
      group.appendChild(heading);

      entries.forEach(entry => {
        group.appendChild(renderTransitCard(entry));
      });

      container.appendChild(group);
    });
  }

  function refreshAllCards() {
    const now = Date.now();
    document.querySelectorAll('.transit-card[data-arrival-time]').forEach(card => {
      const arrivalTime = parseInt(card.dataset.arrivalTime, 10);
      const remaining = Math.max(0, arrivalTime - now);
      const remainMin = Math.ceil(remaining / 60000);

      const numberEl = card.querySelector('.transit-arrival-number');
      const unitEl = card.querySelector('.transit-arrival-unit');

      if (remainMin <= 0) {
        numberEl.textContent = 'Now';
        unitEl.textContent = '';
      } else {
        numberEl.textContent = remainMin;
        unitEl.textContent = 'Minutes';
      }

      if (remainMin > 0 && remainMin <= IMMINENT_THRESHOLD) {
        card.classList.add('transit-card--imminent');
      } else {
        card.classList.remove('transit-card--imminent');
      }
    });
  }

  populateHomePreview();
  populateTransitScreen();
  setInterval(refreshAllCards, 15000);

  // ══════════════════════════════════════════
  //  MAP MARKERS + QUICK ACCESS THUMBNAILS
  // ══════════════════════════════════════════
  function populateMapMarkers() {
    const container = document.getElementById('mapMarkers');
    if (!container) return;
    container.innerHTML = '';

    MAP_POIS.forEach(poi => {
      const marker = document.createElement('div');
      marker.className = 'map-marker';
      marker.style.left = poi.x + 'px';
      marker.style.top = poi.y + 'px';
      marker.setAttribute('aria-label', poi.name);
      marker.dataset.poiId = poi.id;
      marker.innerHTML = '<img src="' + poi.icon + '" alt="">';
      container.appendChild(marker);
    });
  }

  function renderThumbnailCard(poi) {
    const isWarm = WARM_CATEGORIES.indexOf(poi.category) !== -1;
    const card = document.createElement('div');
    card.className = 'thumbnail-card';
    card.dataset.poiId = poi.id;

    card.innerHTML =
      '<div class="thumbnail-card-header thumbnail-card-header--' + poi.category + '">' +
        '<img src="' + poi.icon + '" alt="">' +
        '<span>' + CATEGORY_LABELS[poi.category] + '</span>' +
      '</div>' +
      '<div class="thumbnail-card-body">' +
        '<span class="thumbnail-card-name">' + poi.name + '</span>' +
        '<span class="thumbnail-card-distance ' +
          (isWarm ? 'thumbnail-card-distance--warm' : 'thumbnail-card-distance--cool') +
        '">' + poi.walkMin + ' min walk</span>' +
      '</div>';

    return card;
  }

  function populateQuickAccess() {
    const strip = document.getElementById('quickAccessStrip');
    if (!strip) return;
    strip.innerHTML = '';

    var sorted = [...MAP_POIS].sort((a, b) => a.walkMin - b.walkMin);
    sorted.forEach(poi => {
      strip.appendChild(renderThumbnailCard(poi));
    });
  }

  populateMapMarkers();
  populateQuickAccess();

  // ══════════════════════════════════════════
  //  CATEGORIES SCREEN
  // ══════════════════════════════════════════
  var activeCatTab = 'food';

  function renderCatCard(poi) {
    var isIconThumb = (poi.thumbnail === poi.icon);
    var catLabel = CATEGORY_LABELS[poi.category] || poi.category;
    var subLabel = poi.subcategory || '';

    var thumbHtml;
    if (isIconThumb) {
      thumbHtml =
        '<div class="cat-card-thumb-icon">' +
          '<img src="' + poi.icon + '" alt="">' +
          '<span>' + catLabel + '</span>' +
        '</div>';
    } else {
      thumbHtml = '<img class="cat-card-thumb-photo" src="' + poi.thumbnail + '" alt="' + poi.name + '">';
    }

    var descPlain = poi.description.replace(/<[^>]*>/g, '');

    var card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.poiId = poi.id;

    card.innerHTML =
      '<div class="cat-card-left">' +
        '<div class="cat-card-content">' +
          '<div class="cat-card-title-row">' +
            thumbHtml +
            '<div class="cat-card-meta">' +
              '<div>' +
                '<h3 class="cat-card-name">' + poi.name + '</h3>' +
                '<span class="cat-card-subcategory">' + catLabel + ' \u00B7 ' + subLabel + '</span>' +
              '</div>' +
              '<div class="cat-card-rating">' +
                '<img class="cat-card-stars" src="assets/stars-5.svg" alt="Rating">' +
                '<span class="cat-card-rating-value">' + poi.rating.toFixed(1) + '</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<p class="cat-card-desc">' + descPlain + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="cat-card-walk-badge">' +
        '<div class="cat-card-walk-inner">' +
          '<div class="cat-card-walk-top">' +
            '<span class="cat-card-walk-num">' + poi.walkMin + '</span>' +
            '<span class="cat-card-walk-unit">min walk</span>' +
          '</div>' +
          '<img class="cat-card-chevron" src="assets/icon-chevrons-right.svg" alt="">' +
        '</div>' +
      '</div>';

    return card;
  }

  function populateCategoriesScreen(category) {
    var list = document.getElementById('catCardsList');
    if (!list) return;
    list.innerHTML = '';

    var pois = MAP_POIS
      .filter(function(p) { return p.category === category; })
      .sort(function(a, b) { return a.walkMin - b.walkMin; });

    pois.forEach(function(poi) {
      list.appendChild(renderCatCard(poi));
    });
  }

  function setActiveCatTab(category) {
    activeCatTab = category;
    var tabs = document.querySelectorAll('#catTabs .cat-tab');
    tabs.forEach(function(tab) {
      if (tab.dataset.cat === category) {
        tab.classList.add('cat-tab--active');
      } else {
        tab.classList.remove('cat-tab--active');
      }
    });
    populateCategoriesScreen(category);
  }

  function showCategoriesScreen(category) {
    setActiveCatTab(category);
    navigateTo('categoriesScreen');
  }

  // Wire category tab clicks
  document.querySelectorAll('#catTabs .cat-tab').forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      e.stopPropagation();
      setActiveCatTab(tab.dataset.cat);
    });
  });

  // Wire categories back button
  var catBackBtn = document.getElementById('catBackBtn');
  if (catBackBtn) {
    catBackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateBack();
    });
  }

  // Initialize with Food tab
  populateCategoriesScreen('food');

  // ══════════════════════════════════════════
  //  DETAIL SCREEN RENDERER
  // ══════════════════════════════════════════
  var currentDetailPoiId = null;

  function showDetail(poiId) {
    const poi = MAP_POIS.find(p => p.id === poiId);
    if (!poi) return;

    currentDetailPoiId = poiId;
    document.getElementById('detailThumb').src = poi.thumbnail || poi.icon;
    document.getElementById('detailThumb').alt = poi.name;
    document.getElementById('detailName').textContent = poi.name;
    document.getElementById('detailCategory').textContent =
      CATEGORY_LABELS[poi.category] + ' · ' + (poi.subcategory || '');
    document.getElementById('detailRatingValue').textContent = poi.rating.toFixed(1);
    document.getElementById('detailWalkNumber').textContent = poi.walkMin;
    document.getElementById('detailDescription').innerHTML = poi.description;
    document.getElementById('detailAddress').textContent = poi.address;

    var gallery = document.getElementById('detailGallery');
    gallery.innerHTML = '';
    if (poi.gallery && poi.gallery.length > 0) {
      poi.gallery.forEach(function(src) {
        var img = document.createElement('img');
        img.className = 'detail-gallery-img';
        img.src = src;
        img.alt = poi.name + ' photo';
        gallery.appendChild(img);
      });
      gallery.parentElement.style.display = '';
    } else {
      gallery.parentElement.style.display = 'none';
    }

    navigateTo('detailScreen');
  }

  // ══════════════════════════════════════════
  //  DIRECTIONALS SCREEN RENDERER
  // ══════════════════════════════════════════
  var dirCurrentStep = 0;
  var dirTotalSteps = 0;

  function showDirectionals(poiId) {
    var poi = MAP_POIS.find(function(p) { return p.id === poiId; });
    if (!poi) return;
    var dirs = DIRECTIONS_DATA[poiId];
    if (!dirs) return;

    document.getElementById('dirDestThumb').src = poi.thumbnail || poi.icon;
    document.getElementById('dirDestThumb').alt = poi.name;
    document.getElementById('dirDestName').textContent = poi.name;
    document.getElementById('dirDestCategory').textContent =
      CATEGORY_LABELS[poi.category] + ' \u00B7 ' + (poi.subcategory || '');
    document.getElementById('dirDestWalk').textContent = poi.walkMin + ' min walk';

    document.getElementById('dirSummaryDistance').textContent =
      '~' + dirs.totalDistance + ' m \u00B7 ' + poi.walkMin + ' min walk';

    var list = document.getElementById('dirStepsList');
    list.innerHTML = '';

    var steps = dirs.steps;
    dirTotalSteps = steps.length;
    dirCurrentStep = 0;

    steps.forEach(function(step, idx) {
      var card = document.createElement('div');
      var isWarm = idx % 2 === 0;
      card.className = 'dir-step-card ' +
        (isWarm ? 'dir-step-card--warm' : 'dir-step-card--cool') +
        (idx === 0 ? ' dir-step-card--active' : '');
      card.dataset.stepIdx = idx;

      var iconSrc, iconClass;
      if (step.type === 'exit') {
        iconSrc = 'assets/icon-exit.svg';
        iconClass = 'dir-step-icon';
      } else if (step.type === 'turn-left') {
        iconSrc = 'assets/icon-direction-arrow.svg';
        iconClass = 'dir-step-icon dir-step-icon--arrow dir-step-icon--turn-left';
      } else if (step.type === 'turn-right') {
        iconSrc = 'assets/icon-direction-arrow.svg';
        iconClass = 'dir-step-icon dir-step-icon--arrow dir-step-icon--turn-right';
      } else if (step.type === 'arrive') {
        iconSrc = 'assets/icon-map-pin.svg';
        iconClass = 'dir-step-icon';
      } else if (step.type === 'cross') {
        iconSrc = 'assets/icon-direction-arrow.svg';
        iconClass = 'dir-step-icon dir-step-icon--arrow dir-step-icon--forward';
      } else {
        iconSrc = 'assets/icon-direction-arrow.svg';
        iconClass = 'dir-step-icon dir-step-icon--arrow dir-step-icon--forward';
      }

      var isLastStep = (idx === steps.length - 1);
      var numberHtml = isLastStep
        ? '<span class="dir-step-number dir-step-number--final">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17L4 12" stroke="#F5F5F5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</span>'
        : '<span class="dir-step-number">' + (idx + 1) + '</span>';

      card.innerHTML =
        numberHtml +
        '<img class="' + iconClass + '" src="' + iconSrc + '" alt="">' +
        '<span class="dir-step-text">' + step.text + '</span>';

      card.addEventListener('click', function() {
        advanceToStep(idx);
      });

      list.appendChild(card);
    });

    updateDirectionalsProgress();

    var scrollArea = document.getElementById('dirStepsScroll');
    if (scrollArea) scrollArea.scrollTop = 0;

    navigateTo('directionalsScreen');
  }

  function advanceToStep(idx) {
    dirCurrentStep = idx;
    var cards = document.querySelectorAll('#dirStepsList .dir-step-card');
    cards.forEach(function(card, i) {
      card.classList.remove('dir-step-card--active', 'dir-step-card--completed');
      if (i < idx) card.classList.add('dir-step-card--completed');
      else if (i === idx) card.classList.add('dir-step-card--active');
    });
    updateDirectionalsProgress();

    var activeCard = cards[idx];
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function updateDirectionalsProgress() {
    var pct = dirTotalSteps > 1
      ? Math.round((dirCurrentStep / (dirTotalSteps - 1)) * 100)
      : 0;
    document.getElementById('dirProgressFill').style.width = pct + '%';
    document.getElementById('dirSummaryStep').textContent =
      'Step ' + (dirCurrentStep + 1) + ' of ' + dirTotalSteps;

    var nextBtn = document.getElementById('dirNextBtn');
    var nextWrapper = document.getElementById('dirNextWrapper');
    var doneWrapper = document.getElementById('dirDoneWrapper');
    if (!nextBtn) return;
    var isLastStep = dirCurrentStep >= dirTotalSteps - 1;
    if (isLastStep) {
      nextBtn.querySelector('span').textContent = "You've Arrived!";
      nextBtn.classList.add('dir-next-btn--arrived');
      nextBtn.querySelector('.dir-next-icon').style.display = 'none';
      if (nextWrapper) nextWrapper.style.display = 'none';
      if (doneWrapper) doneWrapper.style.display = 'block';
    } else {
      nextBtn.querySelector('span').textContent = 'Next Step';
      nextBtn.classList.remove('dir-next-btn--arrived');
      nextBtn.querySelector('.dir-next-icon').style.display = '';
      if (nextWrapper) nextWrapper.style.display = '';
      if (doneWrapper) doneWrapper.style.display = 'none';
    }
  }

  // Wire Next Step button
  var dirNextBtn = document.getElementById('dirNextBtn');
  if (dirNextBtn) {
    dirNextBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (dirCurrentStep >= dirTotalSteps - 1) return;
      advanceToStep(dirCurrentStep + 1);
    });
  }

  // Wire Done button (task completed → return to Home)
  var dirDoneBtn = document.getElementById('dirDoneBtn');
  if (dirDoneBtn) {
    dirDoneBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navHistory = [];
      navigateTo('homeScreen');
    });
  }

  // Wire Detail Screen CTA → Directionals
  var dirCta = document.querySelector('.detail-directions-btn');
  if (dirCta) {
    dirCta.addEventListener('click', function(e) {
      e.stopPropagation();
      if (currentDetailPoiId) showDirectionals(currentDetailPoiId);
    });
  }

  // Wire Directionals back button
  var dirBackBtn = document.getElementById('dirBackBtn');
  if (dirBackBtn) {
    dirBackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateBack();
    });
  }

  // Wire Map Screen back button (history-based, not hardcoded)
  var mapBackBtn = document.getElementById('mapBackBtn');
  if (mapBackBtn) {
    mapBackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateBack();
    });
  }

  // Wire Support Screen back button
  var supportBackBtn = document.getElementById('supportBackBtn');
  if (supportBackBtn) {
    supportBackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateBack();
    });
  }

  // ══════════════════════════════════════════
  //  MARQUEE ANIMATION FOR OVERFLOWING TEXT
  // ══════════════════════════════════════════
  function applyMarquee() {
    document.querySelectorAll('.transit-direction-text, .transit-departure-station').forEach(el => {
      el.classList.remove('marquee');
      if (el.scrollWidth > el.parentElement.clientWidth) {
        el.classList.add('marquee');
      }
    });
  }

  requestAnimationFrame(applyMarquee);

  // ══════════════════════════════════════════
  //  SCREEN NAVIGATION (with history stack)
  // ══════════════════════════════════════════
  var navHistory = ['onboardingScreen'];

  function getActiveScreenId() {
    var active = document.querySelector('.screen.active');
    return active ? active.id : 'onboardingScreen';
  }

  function navigateTo(screenId) {
    var current = getActiveScreenId();
    if (current !== screenId) {
      navHistory.push(current);
    }
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      const scrollable = target.querySelector('.main--scrollable');
      if (scrollable) scrollable.scrollTop = 0;
    }
  }

  function navigateBack() {
    var prev = navHistory.pop();
    if (!prev) prev = 'homeScreen';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(prev);
    if (target) target.classList.add('active');
  }

  // Detail back button uses history
  var detailBackBtn = document.getElementById('detailBackBtn');
  if (detailBackBtn) {
    detailBackBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      navigateBack();
    });
  }

  // Generic data-navigate handler
  document.addEventListener('click', (e) => {
    var navBtn = e.target.closest('[data-navigate]');
    if (navBtn) {
      e.stopPropagation();
      var target = navBtn.dataset.navigate;
      if (target === 'categoriesScreen' && navBtn.dataset.category) {
        showCategoriesScreen(navBtn.dataset.category);
      } else {
        navigateTo(target);
      }
      return;
    }

    // POI click → Detail Screen (map markers, thumbnail cards)
    var poiEl = e.target.closest('[data-poi-id]');
    if (poiEl) {
      e.stopPropagation();
      showDetail(poiEl.dataset.poiId);
    }
  });

  // ══════════════════════════════════════════
  //  LANGUAGE SELECTOR (Onboarding)
  // ══════════════════════════════════════════
  const selector = document.getElementById('languageSelector');
  if (selector) {
    const selectedText = document.getElementById('selectedLanguage');
    const options = selector.querySelectorAll('.language-option');

    selector.addEventListener('click', (e) => {
      if (e.target.closest('.language-dropdown')) return;
      selector.classList.toggle('open');
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        selectedText.textContent = option.textContent;
        selector.classList.remove('open');
        setTimeout(() => navigateTo('homeScreen'), 400);
      });
    });

    document.addEventListener('click', (e) => {
      if (!selector.contains(e.target)) {
        selector.classList.remove('open');
      }
    });
  }

  // ── Onboarding quick-actions navigate to Home ──
  const onboarding = document.getElementById('onboardingScreen');
  if (onboarding) {
    onboarding.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', () => navigateTo('homeScreen'));
    });
  }

  // ══════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════
  function padTwo(n) {
    return n < 10 ? '0' + n : '' + n;
  }
});
