import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getQuestion, evaluateAnswer } from "../api";

export default function InterviewScreen({ settings, onFinish }) {
  const { role, type, count } = settings;
  const [index, setIndex] = useState(0); // which question number we're on
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]); // all questions answered so far

  const loadQuestion = async (previous) => {
    setLoading(true);
    setError("");
    setFeedback(null);
    setAnswer("");
    try {
      const data = await getQuestion(role, type, previous);
      setQuestion(data.question);
    } catch (e) {
      setQuestion("");
      setError("Couldn't load the question. Check the server and Wi-Fi.");
    }
    setLoading(false);
  };

  // Runs once when this screen first appears
  useEffect(() => {
    loadQuestion([]);
  }, []);

  const submit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    setError("");
    try {
      const fb = await evaluateAnswer(role, question, answer);
      setFeedback(fb);
      setHistory((h) => [...h, { question, answer, ...fb }]);
    } catch (e) {
      setError("Couldn't evaluate your answer. Please try again.");
    }
    setLoading(false);
  };

  const next = () => {
    if (index + 1 >= count) {
      onFinish(history);
      return;
    }
    setIndex(index + 1);
    loadQuestion(history.map((h) => h.question));
  };

  const isLast = index + 1 >= count;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.progress}>
            Question {index + 1} of {count} • {role}
          </Text>

          {question ? (
            <View style={styles.card}>
              <Text style={styles.question}>{question}</Text>
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              {!question && (
                <TouchableOpacity
                  onPress={() => loadQuestion(history.map((h) => h.question))}
                >
                  <Text style={styles.retry}>Tap to retry</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {loading && (
            <ActivityIndicator
              size="large"
              color="#4F46E5"
              style={{ marginVertical: 20 }}
            />
          )}

          {question && !feedback && !loading ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Type your answer here..."
                multiline
                value={answer}
                onChangeText={setAnswer}
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  !answer.trim() && styles.buttonDisabled,
                ]}
                onPress={submit}
                disabled={!answer.trim()}
              >
                <Text style={styles.buttonText}>Submit Answer</Text>
              </TouchableOpacity>
            </>
          ) : null}

          {feedback && !loading ? (
            <View>
              <View style={styles.scoreBox}>
                <Text style={styles.score}>{feedback.score}/10</Text>
              </View>

              <Text style={styles.fbHeading}>Strengths</Text>
              <Text style={styles.fbText}>{feedback.strengths}</Text>

              <Text style={styles.fbHeading}>To improve</Text>
              <Text style={styles.fbText}>{feedback.improvements}</Text>

              <Text style={styles.fbHeading}>Sample better answer</Text>
              <Text style={styles.fbText}>{feedback.better_answer}</Text>

              <TouchableOpacity style={styles.button} onPress={next}>
                <Text style={styles.buttonText}>
                  {isLast ? "Finish" : "Next Question"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC" },
  content: { padding: 24, paddingTop: 70, paddingBottom: 60 },
  progress: { color: "#6B7280", marginBottom: 16, fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2A44",
    lineHeight: 26,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#A5A3E8" },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { color: "#991B1B" },
  retry: { color: "#4F46E5", fontWeight: "700", marginTop: 8 },
  scoreBox: {
    alignSelf: "center",
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    marginBottom: 16,
  },
  score: { color: "#fff", fontSize: 28, fontWeight: "800" },
  fbHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2A44",
    marginTop: 14,
    marginBottom: 4,
  },
  fbText: { fontSize: 15, color: "#374151", lineHeight: 22 },
});
