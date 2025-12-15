// 히스토리용 임시 데이터

export const MOCK_HISTORY = [
  {
    id: 1,
    userId: 1,
    date: "2025-12-06T21:12:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=youtube_id_1",
    instrument: ["보컬", "드럼", "베이스"],
    startSec: 10,
    endSec: 30,
    recommendedMusic: [
      {
        title: "Sweet Harmony",
        artist: "Band Z",
        similarity: 0.95,
        link: "https://youtube.com/z123",
      },
      {
        title: "Midnight Stroll",
        artist: "Solo A",
        similarity: 0.89,
        link: "https://youtube.com/a456",
      },
      {
        title: "Rainy Day Groove",
        artist: "Duo B",
        similarity: 0.78,
        link: "https://youtube.com/b789",
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    date: "2025-12-08T15:30:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=guitar_riff_2",
    instrument: ["기타", "베이스"],
    startSec: 50,
    endSec: 90,
    recommendedMusic: [
      {
        title: "Electric Blue",
        artist: "The Axes",
        similarity: 0.91,
        link: "https://youtube.com/axes01",
      },
      {
        title: "Funky Shuffle",
        artist: "Bass King",
        similarity: 0.85,
        link: "https://youtube.com/bass02",
      },
    ],
  },
  {
    id: 3,
    userId: 1,
    date: "2025-12-10T10:00:00.000Z",
    youtubeUrl: "https://www.youtube.com/watch?v=piano_concerto_3",
    instrument: ["피아노"],
    startSec: 120,
    endSec: 180,
    recommendedMusic: [
      {
        title: "Moonlight Sonata (Modern)",
        artist: "Remix Pro",
        similarity: 0.98,
        link: "https://youtube.com/remix99",
      },
      {
        title: "Raindrops",
        artist: "Clara C",
        similarity: 0.8,
        link: "https://youtube.com/clara01",
      },
      {
        title: "Jazz Chord Progression",
        artist: "Jazz Man",
        similarity: 0.75,
        link: "https://youtube.com/jazzpro",
      },
    ],
  },
];
