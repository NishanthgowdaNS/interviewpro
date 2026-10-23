import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "interview_sessions";

// Read all saved sessions (newest first)
export async function loadSessions() {
    try {
        const raw = await AsyncStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Add one finished session to the top of the list
export async function saveSession(session) {
    const all = await loadSessions();
    all.unshift(session);
    await AsyncStorage.setItem(KEY, JSON.stringify(all));
}

// Delete everything
export async function clearSessions() {
    await AsyncStorage.removeItem(KEY);
}