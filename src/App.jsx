import Header from "./components/Header.jsx";
import TrackPage from "./pages/TrackPage.jsx"

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <TrackPage />
      </main>
    </div>
  );
}
