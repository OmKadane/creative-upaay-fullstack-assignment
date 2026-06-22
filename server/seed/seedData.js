require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Showtime = require('../models/Showtime');


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinebook';

const movies = [
  {
    title: 'Dune: Part Two',
    description:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 166,
    rating: 'PG-13',
    imdbRating: 8.5,
    releaseDate: new Date('2024-03-01'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', photo: '' },
      { name: 'Zendaya', role: 'Chani', photo: '' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', photo: '' },
      { name: 'Austin Butler', role: 'Feyd-Rautha Harkonnen', photo: '' },
    ],
    formats: ['2D', '3D', 'IMAX'],
    language: 'English',
    status: 'now_showing',
    tags: ['Epic', 'Blockbuster', 'Franchise'],
  },
  {
    title: 'Oppenheimer',
    description:
      'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II. A gripping exploration of triumph, moral crisis, and political persecution.',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    rating: 'R',
    imdbRating: 8.9,
    releaseDate: new Date('2023-07-21'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', photo: '' },
      { name: 'Emily Blunt', role: 'Katherine "Kitty" Oppenheimer', photo: '' },
      { name: 'Matt Damon', role: 'Gen. Leslie Groves Jr.', photo: '' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', photo: '' },
    ],
    formats: ['2D', 'IMAX'],
    language: 'English',
    status: 'now_showing',
    tags: ['Oscar-Winner', 'Nolan', 'Historical'],
  },
  {
    title: 'Deadpool & Wolverine',
    description:
      'Deadpool is offered a chance to join the Time Variance Authority, but he has other plans — recruiting a reluctant Wolverine to save his universe from extinction.',
    genre: ['Action', 'Comedy', 'Superhero'],
    duration: 127,
    rating: 'R',
    imdbRating: 7.7,
    releaseDate: new Date('2024-07-26'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    cast: [
      { name: 'Ryan Reynolds', role: 'Deadpool / Wade Wilson', photo: '' },
      { name: 'Hugh Jackman', role: 'Wolverine / Logan', photo: '' },
      { name: 'Emma Corrin', role: 'Cassandra Nova', photo: '' },
    ],
    formats: ['2D', '3D'],
    language: 'English',
    status: 'now_showing',
    tags: ['MCU', 'Action', 'Comedy'],
  },
  {
    title: 'Inside Out 2',
    description:
      'Riley enters adolescence, and her emotions — led by Joy — face a new challenge when new emotions including Anxiety arrive in headquarters, threatening to take over.',
    genre: ['Animation', 'Comedy', 'Family'],
    duration: 100,
    rating: 'PG',
    imdbRating: 7.5,
    releaseDate: new Date('2024-06-14'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/xg27NrXi7VXCGUr7MlsF5JCKqBt.jpg',
    cast: [
      { name: 'Amy Poehler', role: 'Joy (voice)', photo: '' },
      { name: 'Maya Hawke', role: 'Anxiety (voice)', photo: '' },
      { name: 'Phyllis Smith', role: 'Sadness (voice)', photo: '' },
    ],
    formats: ['2D', '3D'],
    language: 'English',
    status: 'now_showing',
    tags: ['Pixar', 'Family', 'Animated'],
  },
  {
    title: 'Alien: Romulus',
    description:
      'A group of young space colonizers discover a derelict space station in the depths of the galaxy, only to confront the most terrifying lifeform in the universe.',
    genre: ['Horror', 'Sci-Fi', 'Thriller'],
    duration: 119,
    rating: 'R',
    imdbRating: 7.3,
    releaseDate: new Date('2024-08-16'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/aosm8NMQ3UyoBVpSxyimorCQykC.jpg',
    cast: [
      { name: 'Cailee Spaeny', role: 'Rain Carradine', photo: '' },
      { name: 'David Jonsson', role: 'Andy', photo: '' },
      { name: 'Archie Renaux', role: 'Tyler', photo: '' },
    ],
    formats: ['2D', '3D'],
    language: 'English',
    status: 'coming_soon',
    tags: ['Horror', 'Franchise', 'Sci-Fi'],
  },
  {
    title: 'Gladiator II',
    description:
      'After witnessing the death of his family at the hands of the tyrannic emperors who now lead Rome, Lucius is forced to enter the Colosseum and must look to his past to find strength to return the glory of Rome to its people.',
    genre: ['Action', 'Adventure', 'Drama'],
    duration: 148,
    rating: 'R',
    imdbRating: 6.9,
    releaseDate: new Date('2024-11-22'),
    posterUrl: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
    bannerUrl: 'https://image.tmdb.org/t/p/original/tkMzMPpFpMZRJVqAPWGtA04jAWO.jpg',
    cast: [
      { name: 'Paul Mescal', role: 'Lucius', photo: '' },
      { name: 'Pedro Pascal', role: 'Marcus Acacius', photo: '' },
      { name: 'Denzel Washington', role: 'Macrinus', photo: '' },
    ],
    formats: ['2D', '3D', 'IMAX'],
    language: 'English',
    status: 'coming_soon',
    tags: ['Epic', 'Historical', 'Ridley Scott'],
  },
];

const theaters = [
  {
    name: 'The Grandview',
    location: {
      address: 'Camp Aguinaldo',
      city: 'Quezon City',
      state: 'Metro Manila',
      pincode: '1110',
    },
    screens: 8,
    amenities: ['4DX', 'IMAX', 'Dolby Atmos', 'Recliner Seats'],
    basePrice: 320,
    maxPrice: 450,
    isActive: true,
  },
  {
    name: 'Play Loft',
    location: {
      address: 'Aurora Boulevard',
      city: 'Santa Mesa',
      state: 'Metro Manila',
      pincode: '1008',
    },
    screens: 6,
    amenities: ['IMAX', 'Dolby Atmos', 'Premium Seating'],
    basePrice: 300,
    maxPrice: 430,
    isActive: true,
  },
  {
    name: 'CinemaOne',
    location: {
      address: 'A Cruz',
      city: 'Pasay City',
      state: 'Metro Manila',
      pincode: '1300',
    },
    screens: 5,
    amenities: ['3D', 'Recliner Seats', 'Laser Projection'],
    basePrice: 320,
    isActive: true,
  },
  {
    name: 'Cinemount',
    location: {
      address: 'Baclaran',
      city: 'Paranaque City',
      state: 'Metro Manila',
      pincode: '1700',
    },
    screens: 4,
    amenities: ['2D', '3D', 'Standard Seating'],
    basePrice: 350,
    isActive: true,
  },
];

const generateShowtimes = (movieIds, theaterIds) => {
  const showtimes = [];
  const formats = ['2D', '3D', 'IMAX'];
  const times = ['10:00 AM', '01:30 PM', '04:45 PM', '08:00 PM', '11:00 PM'];

  const today = new Date();
  const dates = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);
    dates.push(d);
  }

  movieIds.slice(0, 4).forEach((movieId, mIdx) => {
    theaterIds.forEach((theaterId, tIdx) => {
      dates.forEach((date) => {
        const showtimeFormats = mIdx % 2 === 0 ? ['2D', '3D'] : ['2D', 'IMAX'];
        showtimeFormats.forEach((format) => {
          const selectedTimes = times.slice(0, 3);
          selectedTimes.forEach((time) => {
            showtimes.push({
              movie: movieId,
              theater: theaterId,
              date,
              time,
              format,
              screen: (tIdx % 3) + 1,
              language: 'English',
              priceMultiplier: format === 'IMAX' ? 1.5 : format === '3D' ? 1.2 : 1.0,
              seats: [],
            });
          });
        });
      });
    });
  });

  return showtimes;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Showtime.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert movies
    const createdMovies = await Movie.insertMany(movies);
    console.log(`🎬 ${createdMovies.length} movies inserted`);

    // Insert theaters
    const createdTheaters = await Theater.insertMany(theaters);
    console.log(`🎭 ${createdTheaters.length} theaters inserted`);

    // Generate and insert showtimes
    const movieIds = createdMovies.map((m) => m._id);
    const theaterIds = createdTheaters.map((t) => t._id);
    const showtimesData = generateShowtimes(movieIds, theaterIds);

    // Insert in batches to trigger pre-save hook for seat generation
    const batchSize = 50;
    let totalShowtimes = 0;
    for (let i = 0; i < showtimesData.length; i += batchSize) {
      const batch = showtimesData.slice(i, i + batchSize);
      // Use save() to trigger pre-save hook for seat generation
      const docs = batch.map((s) => new Showtime(s));
      for (const doc of docs) await doc.save();
      totalShowtimes += docs.length;
      process.stdout.write(`\r⏳ Showtimes created: ${totalShowtimes}/${showtimesData.length}`);
    }
    console.log(`\n🕐 ${totalShowtimes} showtimes created with seat maps`);

    console.log('\n✅ Database seeded successfully!');

    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();
