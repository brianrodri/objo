import { DateTime } from "luxon";
import { MyPluginSettings } from "main";
import { useEffect, useState } from "react";

export interface MyPluginCodeBlockProps {
    input: string;
    pluginSettings: MyPluginSettings;
}

export function MyPluginCodeBlock({ input, pluginSettings }: MyPluginCodeBlockProps) {
    // Free to use the full power of React!
    const now = useNow();

    return (
        <ul>
            <li>Current time: {now.toISO({ suppressMilliseconds: true })}</li>
            <li>Input: {input}</li>
            <li>My setting: {pluginSettings.mySetting}</li>
        </ul>
    );
}

/** Hook that returns the current time (stale by at most ~1 second). */
function useNow() {
    const [now, setNow] = useState(getNow);

    useEffect(() => {
        const i = setInterval(() => setNow(getNow()), 1000);
        return () => clearInterval(i);
    }, []);

    return now;
}

/** Returns the current time (milliseconds are truncated). */
function getNow() {
    return DateTime.now().set({ millisecond: 0 });
}
