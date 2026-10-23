// Replace with YOUR laptop's IP address
export const API_URL = "http://192.168.1.8:3000";

async function post(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Server error");
    return res.json();
}

export const getQuestion = (role, type, previousQuestions = []) =>
    post("/question", { role, type, previousQuestions });

export const evaluateAnswer = (role, question, answer) =>
    post("/evaluate", { role, question, answer });