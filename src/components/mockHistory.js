// 히스토리용 임시 데이터

export const MOCK_HISTORY = [
  {
    index: 1,
    youtubeUrl: "https://www.youtube.com/watch?v=youtube_id_1",
    createdAt: "2025-12-06 21:12",
    instrument: ["보컬", "드럼", "베이스"],
    startSec: 10,
    endSec: 30,
    results: {
      recommendedSongs: [
        {
          title: "Sweet Harmony",
          artist: "Band Z",
          link: "https://youtube.com/z123",
        },
        {
          title: "Midnight Stroll",
          artist: "Solo A",
          link: "https://youtube.com/a456",
        },
        {
          title: "Rainy Day Groove",
          artist: "Duo B",
          link: "https://youtube.com/b789",
        },
      ],
    },
  },
  {
    index: 2,
    youtubeUrl: "https://www.youtube.com/watch?v=youtube_id_2",
    createdAt: "2025-12-08 13:00",
    instrument: ["보컬"],
    startSec: 50,
    endSec: 80,
    results: {
      recommendedSongs: [
        {
          title: "Electric Pulse",
          artist: "The Shocks",
          link: "https://youtube.com/shocks01",
        },
        {
          title: "Speed Limit",
          artist: "Velocity Crew",
          link: "https://youtube.com/vel02",
        },
      ],
    },
  },
  {
    index: 3,
    youtubeUrl: "https://www.youtube.com/watch?v=youtube_id_3",
    createdAt: "2025-12-11 17:34",
    instrument: ["드럼", "베이스"],
    startSec: 40,
    endSec: 60,
    results: {
      recommendedSongs: [
        {
          title: "Funky Town",
          artist: "Groove Master",
          link: "https://youtube.com/funk101",
        },
        {
          title: "Bass Line Hero",
          artist: "Jazzy J",
          link: "https://youtube.com/jazz202",
        },
        {
          title: "Drum Solo Forever",
          artist: "Rhythm King",
          link: "https://youtube.com/rhy303",
        },
        {
          title: "The Syncopated Beat",
          artist: "Beat Makers",
          link: "https://youtube.com/beat404",
        },
      ],
    },
  },
];
