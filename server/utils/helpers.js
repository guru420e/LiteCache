export function ioLogger(socket) {
    console.log("📡 A client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
}

export function serverLogger() {
    console.log("🚀 Server is running at http://localhost:3000");
}
