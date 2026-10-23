import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

const ROLES = [
  "Software Developer",
  "Data Analyst",
  "HR Executive",
  "Network Engineer",
];
const TYPES = ["Technical", "HR / Behavioral"];
const COUNTS = [3, 5, 10];

function Chip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ onStart, onHistory }) {
  const [role, setRole] = useState(null);
  const [type, setType] = useState(TYPES[0]);
  const [count, setCount] = useState(5);

  const startInterview = () => {
    if (!role) {
      Alert.alert("Pick a role", "Please choose a role to begin.");
      return;
    }
    onStart({ role, type, count });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>InterviewPro</Text>
        <Text style={styles.subtitle}>Practice interviews with AI feedback</Text>

        <Text style={styles.label}>Role</Text>
        <View style={styles.row}>
          {ROLES.map((r) => (
            <Chip
              key={r}
              label={r}
              selected={role === r}
              onPress={() => setRole(r)}
            />
          ))}
        </View>

        <Text style={styles.label}>Interview type</Text>
        <View style={styles.row}>
          {TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={type === t}
              onPress={() => setType(t)}
            />
          ))}
        </View>

        <Text style={styles.label}>Number of questions</Text>
        <View style={styles.row}>
          {COUNTS.map((c) => (
            <Chip
              key={c}
              label={String(c)}
              selected={count === c}
              onPress={() => setCount(c)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startInterview}>
          <Text style={styles.startText}>Start Interview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyButton} onPress={onHistory}>
          <Text style={styles.historyText}>View History</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 24, paddingTop: 80 },
  title: { fontSize: 32, fontWeight: "800", color: "#1F2A44" },
  subtitle: { fontSize: 15, color: "#6B7280", marginTop: 4 },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A44",
    marginTop: 28,
    marginBottom: 10,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  chipSelected: { backgroundColor: "#4F46E5", borderColor: "#4F46E5" },
  chipText: { color: "#374151", fontSize: 14 },
  chipTextSelected: { color: "#fff", fontWeight: "600" },
  startButton: {
    marginTop: 40,
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  startText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  historyButton: {
    marginTop: 14,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4F46E5",
  },
  historyText: { color: "#4F46E5", fontSize: 17, fontWeight: "700" },
});
