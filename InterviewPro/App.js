import { useState } from "react";
import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./screens/HomeScreen";
import InterviewScreen from "./screens/InterviewScreen";
import SummaryScreen from "./screens/SummaryScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { saveSession } from "./storage";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [settings, setSettings] = useState(null);
  const [results, setResults] = useState([]);

  const finishInterview = async (r) => {
    setResults(r);
    setScreen("summary");
    try {
      const total = r.reduce((sum, item) => sum + Number(item.score || 0), 0);
      const average = r.length ? (total / r.length).toFixed(1) : "0.0";
      await saveSession({
        id: Date.now().toString(),
        role: settings?.role || "Unknown",
        type: settings?.type || "General",
        date: new Date().toISOString(),
        average,
        results: r,
      });
    } catch (e) {
      Alert.alert("Save failed", String(e.message || e));
    }
  };

  return (
    <>
      <StatusBar style="dark" />

      {screen === "home" && (
        <HomeScreen
          onStart={(s) => {
            setSettings(s);
            setScreen("interview");
          }}
          onHistory={() => setScreen("history")}
        />
      )}

      {screen === "interview" && (
        <InterviewScreen
          settings={settings}
          onFinish={finishInterview}
        />
      )}

      {screen === "summary" && (
        <SummaryScreen results={results} onHome={() => setScreen("home")} />
      )}

      {screen === "history" && (
        <HistoryScreen
          onOpen={(session) => {
            setResults(session.results);
            setScreen("summary");
          }}
          onHome={() => setScreen("home")}
        />
      )}
    </>
  );
}