export function formatDurationMs(ms: number, shorthand = false): String | undefined {
    const units = [
        { label: ["Years", "Yr"], seconds: 31536000 },
        { label: ["Months", "Mn"], seconds: 2628288 },
        { label: ["Weeks", "wk"], seconds: 604800 },
        { label: ["Days", "d"], seconds: 86400 },
        { label: ["Hours", "h"], seconds: 3600 },
        { label: ["Minutes", "m"], seconds: 60 },
        { label: ["Seconds", "s"], seconds: 1 }
    ];

    let remaining = Math.floor(ms / 1000);
    let output = "";

    for (const { label, seconds } of units) {
        const value = Math.floor(remaining / seconds);
        if (value > 0) {
            output += `${value}${shorthand ? label[1] : label[0]} `;
            remaining -= value * seconds;
        }
    }

    if (output.trim().length === 0) {
        return `${ms} ${shorthand ? 'ms' : 'Milliseconds (not enough for seconds!)'}`;
    }

    return output.trim();
}