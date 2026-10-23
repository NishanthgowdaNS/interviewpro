import { useState, useEffect } from "react";
import {
    StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert,
} from "react-native";
import { loadSessions, clearSessions } from "../storage";

export default function HistoryScreen({ onOpen, onHome }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSessions().then((data) => {
            setSessions(data);
            setLoading(false);
        });
    }, []);

    const confirmClear = () => {
        Alert.alert("Clear history", "Delete all saved interviews?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await clearSessions();
                    setSessions([]);
                },
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>History</Text>

                {!loading && sessions.length === 0 && (
                    <Text style={styles.empty}>No interviews yet. Finish one and it will show up here.</Text>
                )}

                {sessions.map((s) => (
                    <TouchableOpacity key={s.id} style={styles.card} onPress={() => onOpen(s)}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.role}>{s.role}</Text>
                            <Text style={styles.meta}>
                                {s.type} • {s.results.length} questions
                            </Text>
                            <Text style={styles.meta}>{new Date(s.date).toLocaleString()}</Text>
                        </View>
                        <Text style={styles.avg}>{s.average}/10</Text>
                    </TouchableOpacity>
                ))}

                {sessions.length > 0 && (
                    <TouchableOpacity onPress={confirmClear}>
                        <Text style={styles.clear}>Clear all history</Text>
                    </TouchableOpacity>
                )}

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
    empty: { color: "#6B7280", fontSize: 15 },
    card: {
        flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
        padding: 16, borderRadius: 14, marginBottom: 12, elevation: 2,
    },
    role: { fontSize: 16, fontWeight: "700", color: "#1F2A44" },
    meta: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    avg: { fontSize: 20, fontWeight: "800", color: "#4F46E5" },
    clear: { color: "#B91C1C", textAlign: "center", marginTop: 16, fontWeight: "600" },
    button: { marginTop: 20, backgroundColor: "#4F46E5", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});