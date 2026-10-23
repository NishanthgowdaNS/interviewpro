import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";

export default function SummaryScreen({ results, onHome }) {
    const total = results.reduce((sum, r) => sum + Number(r.score || 0), 0);
    const average = results.length ? (total / results.length).toFixed(1) : "0.0";

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Interview Complete</Text>

                <View style={styles.avgBox}>
                    <Text style={styles.avg}>{average}/10</Text>
                    <Text style={styles.avgLabel}>Average score</Text>
                </View>

                <Text style={styles.sectionTitle}>Question review</Text>

                {results.map((r, i) => (
                    <View key={i} style={styles.card}>
                        <Text style={styles.q}>Q{i + 1}. {r.question}</Text>
                        <Text style={styles.s}>Score: {r.score}/10</Text>
                        <Text style={styles.label}>Your answer</Text>
                        <Text style={styles.t}>{r.answer}</Text>
                        <Text style={styles.label}>To improve</Text>
                        <Text style={styles.t}>{r.improvements}</Text>
                    </View>
                ))}

                <TouchableOpacity style={styles.button} onPress={onHome}>
                    <Text style={styles.buttonText}>Back to Home</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F8FC" },
    content: { padding: 24, paddingTop: 70, paddingBottom: 60 },
    title: { fontSize: 28, fontWeight: "800", color: "#1F2A44", marginBottom: 20 },
    avgBox: { alignItems: "center", backgroundColor: "#4F46E5", padding: 24, borderRadius: 18, marginBottom: 24 },
    avg: { color: "#fff", fontSize: 40, fontWeight: "800" },
    avgLabel: { color: "#E0E7FF", marginTop: 4 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1F2A44", marginBottom: 12 },
    card: { backgroundColor: "#fff", padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2 },
    q: { fontSize: 15, fontWeight: "600", color: "#1F2A44" },
    s: { color: "#4F46E5", fontWeight: "700", marginTop: 6 },
    label: { fontSize: 13, fontWeight: "700", color: "#6B7280", marginTop: 10 },
    t: { color: "#374151", marginTop: 2, lineHeight: 20 },
    button: { marginTop: 16, backgroundColor: "#4F46E5", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});